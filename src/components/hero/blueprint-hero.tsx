"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

import { LineButton } from "@/components/ui/line-button";
import { cn } from "@/lib/cn";
import { EASE, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { lockScroll } from "@/lib/scroll-lock";
import { holdLoader, siteReady } from "@/lib/site-loader";

import { cameraKeys, sampleCamera } from "./camera-path";
import {
  FINAL_CAMERA,
  FOCAL_X,
  FRAME,
  HERO_VIDEO_SRC,
  INTRO_CAPTIONS,
  PIN_LENGTH_VH,
  type FinalCamera,
} from "./hero-config";
import type { TowerScene } from "./tower-scene";

type Mode = "scroll" | "static" | "calibrate" | "final";

/**
 * Set once the intro has played through to the end. Module state survives
 * client-side navigation between pages but not a reload, which is exactly
 * "once per page load": returning to Home through the nav shows the finished
 * hero, and only a reload (or a new tab) plays the intro again.
 */
let introFinished = false;

const MOBILE = "(max-width: 767px)";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function waitForImage(img: HTMLImageElement | null) {
  return new Promise<void>((resolve) => {
    if (!img || (img.complete && img.naturalWidth > 0)) return resolve();
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

/**
 * The scroll-driven blueprint hero.
 *
 * The section is tall and its stage is position: sticky, so the stage holds
 * still for PIN_LENGTH_VH of scrolling while one scrubbed GSAP timeline runs:
 *
 *    0–15%  close-up on the lower floors, lines drawing floor by floor
 *   15–55%  orbit, rising as the tower draws upward; cranes last
 *   55–70%  pull back to the matched camera; annotations come and go
 *   70–78%  3D lines crossfade into blueprint.jpg
 *   78–88%  photo.jpg wipes up from the base over the drawing
 *   88–95%  video crossfade (only once HERO_VIDEO_SRC is set)
 *   95–100% headline, subcopy, CTAs and nav reveal
 *
 * It plays once per page load: at the end the hero freezes in its finished
 * state and the pinned scroll space collapses, so scrolling back up never
 * rewinds it; returning to Home without reloading shows the finished hero.
 *
 * Reduced motion and no-WebGL get a still version: blueprint → photo → text.
 * ?calibrate (dev only) freezes the final frame over a half-opacity drawing.
 */
export function BlueprintHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blueprintRef = useRef<HTMLImageElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const cueInnerRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const captionsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const safe = contextSafe!;
      const section = sectionRef.current!;
      const stage = stageRef.current!;
      const canvas = canvasRef.current!;
      const nav = document.querySelector<HTMLElement>("header[data-intro-nav]");

      const calibrate = process.env.NODE_ENV !== "production" && new URLSearchParams(location.search).has("calibrate");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia(MOBILE).matches;
      const mode: Mode = calibrate
        ? "calibrate"
        : introFinished
          ? "final"
          : reduced || !supportsWebGL()
            ? "static"
            : "scroll";
      section.dataset.mode = mode;

      let cancelled = false;
      let scene: TowerScene | null = null;
      let tick: (() => void) | null = null;
      let resizeObserver: ResizeObserver | null = null;
      let closeGui: (() => void) | null = null;
      let split: SplitText | null = null;
      let releaseScroll: (() => void) | null = null;

      if (mode === "scroll") {
        // Always start the intro from the top. Without this the browser
        // restores the old scroll position on reload, dropping the visitor
        // mid-sequence or past it.
        if ("scrollRestoration" in history) history.scrollRestoration = "manual";
        window.scrollTo(0, 0);
        releaseScroll = lockScroll();
      }

      /* ---------- Loading: the site loader waits for both stills (and the 3D code, below) ---------- */
      const preload = Promise.all([
        holdLoader(waitForImage(blueprintRef.current)),
        holdLoader(waitForImage(photoRef.current)),
      ]);

      /* ---------- Already played this load: just the finished hero ---------- */
      const showFinal = safe(() => {
        gsap.set([coverRef.current, cueRef.current, canvas, overlayRef.current], { autoAlpha: 0 });
        gsap.set(photoWrapRef.current, { "--reveal": "115%" });
        if (videoWrapRef.current) gsap.set(videoWrapRef.current, { opacity: 1 });
        gsap.set(scrimRef.current, { opacity: 1 });
        gsap.set(nav, { autoAlpha: 1 });
        gsap.fromTo(
          [headlineRef.current, subRef.current, ctaRef.current],
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: EASE },
        );
      });
      if (mode === "final") {
        showFinal();
        return;
      }

      /* ---------- Static fallback: blueprint → photo → text, no pinning ---------- */
      const runStatic = safe(() => {
        gsap.to(coverRef.current, { autoAlpha: 0, duration: 0.6 });
        gsap.set(photoWrapRef.current, { "--reveal": "115%", opacity: 0 });
        gsap.set([cueRef.current, overlayRef.current], { autoAlpha: 0 });
        gsap.set(canvas, { autoAlpha: 0 });
        gsap.set(nav, { autoAlpha: 1 });
        gsap.set([scrimRef.current], { opacity: 0 });
        gsap.set([headlineRef.current, subRef.current, ctaRef.current], { autoAlpha: 0 });
        gsap
          .timeline({ delay: 0.2 })
          .to(photoWrapRef.current, { opacity: 1, duration: 1.4, ease: "power1.inOut" }, "+=0.3")
          .to(scrimRef.current, { opacity: 1, duration: 0.8 }, "-=0.4")
          .to([headlineRef.current, subRef.current, ctaRef.current], { autoAlpha: 1, duration: 0.8, stagger: 0.15 }, "<");
      });

      /* ---------- 3D: build the scene and the render loop ---------- */
      const startScene = safe((SceneClass: typeof TowerScene) => {
        const camera: FinalCamera = JSON.parse(JSON.stringify(FINAL_CAMERA));
        const built = new SceneClass(canvas, {
          detail: mobile ? "low" : "high",
          focalX: mobile ? FOCAL_X.mobile : FOCAL_X.desktop,
          dprCap: mobile ? 1.5 : 2,
        });
        scene = built;

        const sizeToStage = () => built.resize(stage.clientWidth, stage.clientHeight);
        sizeToStage();
        resizeObserver = new ResizeObserver(sizeToStage);
        resizeObserver.observe(stage);

        // Drawing annotations as real DOM text, re-projected every frame.
        const labelHost = labelsRef.current!;
        labelHost.replaceChildren();
        const labelEls = built.labels.map(({ text }) => {
          const el = document.createElement("span");
          el.textContent = text;
          el.className =
            "absolute left-0 top-0 -translate-y-1/2 whitespace-nowrap font-label text-[10px] uppercase tracking-[0.18em] text-white/70";
          labelHost.appendChild(el);
          return el;
        });

        const state = { c: mode === "calibrate" ? 1 : 0, draw: 0, intro: 0, anno: 0 };
        // Centre of the visible crop, as a fraction of the 16:9 frame.
        const focalX = mobile ? FOCAL_X.mobile : FOCAL_X.desktop;
        const coverScale = Math.max(stage.clientWidth / FRAME.width, stage.clientHeight / FRAME.height);
        const visibleW = stage.clientWidth / coverScale / FRAME.width;
        const orbitScreenX = focalX * (1 - visibleW) + visibleW / 2;
        let keys = cameraKeys(camera, mobile, orbitScreenX);
        let active = true;

        const visibility = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (active = self.isActive),
        });

        tick = () => {
          if (!active) return;
          // Nothing to draw once the lines have handed over to the images.
          if (mode === "scroll" && Number(gsap.getProperty(canvas, "opacity")) <= 0.001) return;
          const cam =
            mode === "calibrate"
              ? { position: camera.position, target: camera.target, fov: camera.fov, screen: camera.screen }
              : sampleCamera(keys, state.c);
          built.apply({
            ...cam,
            draw: mode === "calibrate" ? 1.05 : Math.max(state.draw, state.intro),
            anno: state.anno,
            scale: camera.scale,
          });
          built.render();

          labelHost.style.opacity = String(state.anno);
          if (state.anno > 0.001) {
            built.labels.forEach((label, i) => {
              const p = built.project(label.at);
              const el = labelEls[i];
              if (!p) {
                el.style.visibility = "hidden";
                return;
              }
              el.style.visibility = "visible";
              el.style.transform = `translate(${p.x}px, ${p.y}px) translateY(-50%)`;
            });
          }
        };
        gsap.ticker.add(tick);

        if (mode === "calibrate") {
          gsap.set([coverRef.current, cueRef.current, copyRef.current, scrimRef.current], { autoAlpha: 0 });
          gsap.set(nav, { autoAlpha: 0 });
          gsap.set(overlayRef.current, { mixBlendMode: "normal" });
          // Gated on NODE_ENV directly so the bundler drops lil-gui from
          // production builds entirely, not just from the initial load.
          if (process.env.NODE_ENV !== "production") {
            import("./calibrate").then(({ openCalibration }) => {
              if (cancelled) return;
              closeGui = openCalibration({
                camera,
                overlay: overlayRef.current!,
                onChange: () => {
                  keys = cameraKeys(camera, mobile, orbitScreenX);
                },
                onLineColor: (hex) => built.setLineColor(hex),
              });
            });
          }
          return;
        }

        /* ---------- The scroll timeline ---------- */
        split = SplitText.create(headlineRef.current, { type: "lines", mask: "lines" });
        // Set explicitly: a staggered fromTo in a scrubbed timeline only
        // pre-renders its first target, which left line two showing.
        gsap.set(split.lines, { yPercent: 110 });
        gsap.set(nav, { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        tl.to(state, { c: 1, duration: 70 }, 0)
          .to(state, { draw: 1.03, duration: 58 }, 0)
          .to(cueRef.current, { autoAlpha: 0, duration: 2 }, 0)
          .to(state, { anno: 1, duration: 5 }, 55)
          .to(state, { anno: 0, duration: 6 }, 64)
          .to(canvas, { opacity: 0, duration: 8 }, 70)
          .fromTo(photoWrapRef.current, { "--reveal": "-15%" }, { "--reveal": "115%", duration: 10, ease: "power1.inOut" }, 78)
          .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 0.35, duration: 3 }, 78)
          .to(overlayRef.current, { opacity: 0, duration: 5 }, 85);
        if (videoWrapRef.current) {
          tl.fromTo(videoWrapRef.current, { opacity: 0 }, { opacity: 1, duration: 7 }, 88);
        }
        // The three captions, each rising in and drifting out over its window.
        Array.from(captionsRef.current?.children ?? []).forEach((caption, i) => {
          const [inAt, outAt] = INTRO_CAPTIONS[i].at;
          tl.fromTo(caption, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 2.5, ease: EASE }, inAt).to(
            caption,
            { autoAlpha: 0, y: -28, duration: 2.5, ease: "power2.in" },
            outAt,
          );
        });
        tl.fromTo(scrimRef.current, { opacity: 0 }, { opacity: 1, duration: 4 }, 93)
          .fromTo(nav, { autoAlpha: 0 }, { autoAlpha: 1, duration: 2.5 }, 96)
          .to(split.lines, { yPercent: 0, duration: 3, stagger: 0.8, ease: EASE }, 95)
          .fromTo(subRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 2.5, ease: EASE }, 96.5)
          .fromTo(ctaRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 2.5, ease: EASE }, 97.2)
          .set({}, {}, 100);

        /*
         * Once the timeline reaches the end the intro is done for this page
         * load: freeze the finished hero, collapse the pinned scroll space to a
         * single screen and shift the scroll position by the same amount in
         * the same frame, so nothing on screen moves. Scrolling up can no
         * longer rewind it, and the WebGL scene is freed.
         */
        tl.eventCallback("onComplete", () => {
          if (introFinished) return;
          introFinished = true;

          const pinDistance = section.offsetHeight - window.innerHeight;
          const scrollY = window.scrollY;

          // kill(false), not kill(): with no argument ScrollTrigger reverts its
          // animation to the first frame, which would undo the finished hero.
          tl.scrollTrigger?.kill(false);
          visibility.kill(false);
          if (tick) gsap.ticker.remove(tick);
          tick = null;
          resizeObserver?.disconnect();
          resizeObserver = null;
          scene?.dispose();
          scene = null;

          section.dataset.mode = "final";
          const target = Math.max(0, scrollY - pinDistance);
          const lenis = window.__lenis;
          if (lenis) {
            lenis.resize();
            lenis.scrollTo(target, { immediate: true, force: true });
          } else {
            window.scrollTo(0, target);
          }
          ScrollTrigger.refresh();
        });

        ScrollTrigger.refresh();

        // The site loader has lifted: a few lines start drawing at the base.
        gsap
          .timeline()
          .add(() => {
            // Re-zero here as well: some browsers restore the old position
            // after load, past our first reset. The page is still held, so
            // this is invisible.
            window.__lenis?.scrollTo(0, { immediate: true, force: true });
            window.scrollTo(0, 0);
            releaseScroll?.();
            releaseScroll = null;
          })
          .to(coverRef.current, { autoAlpha: 0, duration: 0.6, ease: EASE }, "<")
          .to(state, { intro: 0.07, duration: 2.4, ease: "power2.out" }, "<0.2")
          .fromTo(cueInnerRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE }, "<0.6");
      });

      const run = async () => {
        if (mode === "static") {
          await Promise.all([preload, siteReady]);
          if (!cancelled) runStatic();
          return;
        }
        const [{ TowerScene }] = await Promise.all([holdLoader(import("./tower-scene")), preload, siteReady]);
        if (!cancelled) startScene(TowerScene);
      };
      run();

      return () => {
        cancelled = true;
        if (tick) gsap.ticker.remove(tick);
        resizeObserver?.disconnect();
        scene?.dispose();
        closeGui?.();
        split?.revert();
        releaseScroll?.();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      data-nav-tone="dark"
      ref={sectionRef}
      data-mode="scroll"
      aria-label="Introduction"
      style={
        {
          "--pin-desktop": `${PIN_LENGTH_VH.desktop}vh`,
          "--pin-mobile": `${PIN_LENGTH_VH.mobile}vh`,
          "--focal-desktop": `${FOCAL_X.desktop * 100}%`,
          "--focal-mobile": `${FOCAL_X.mobile * 100}%`,
        } as React.CSSProperties
      }
      className="relative h-[calc(var(--pin-mobile)+100svh)] bg-black md:h-[calc(var(--pin-desktop)+100svh)] motion-reduce:h-svh data-[mode=calibrate]:h-svh data-[mode=final]:h-svh data-[mode=static]:h-svh"
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-svh w-full overflow-hidden [--focal:var(--focal-mobile)] md:[--focal:var(--focal-desktop)]"
      >
        {/* Stills: drawing at the bottom, photo wiping up over it. */}
        <div aria-hidden className="absolute inset-0">
          <Image
            ref={blueprintRef}
            src="/hero/blueprint.jpg"
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            unoptimized
            sizes="100vw"
            className="object-cover [object-position:var(--focal)_50%]"
          />
        </div>
        <div
          ref={photoWrapRef}
          className="absolute inset-0"
          style={
            {
              "--reveal": "-15%",
              maskImage: "linear-gradient(to top, #000 calc(var(--reveal) - 14%), transparent var(--reveal))",
              WebkitMaskImage: "linear-gradient(to top, #000 calc(var(--reveal) - 14%), transparent var(--reveal))",
            } as React.CSSProperties
          }
        >
          <Image
            ref={photoRef}
            src="/hero/photo.jpg"
            alt="A high-rise tower under construction with three tower cranes at work"
            fill
            loading="eager"
            fetchPriority="high"
            unoptimized
            sizes="100vw"
            className="object-cover [object-position:var(--focal)_50%]"
          />
        </div>

        {HERO_VIDEO_SRC ? (
          <div ref={videoWrapRef} className="absolute inset-0 opacity-0" aria-hidden>
            <video
              className="size-full object-cover [object-position:var(--focal)_50%]"
              src={HERO_VIDEO_SRC}
              poster="/hero/photo.jpg"
              muted
              loop
              autoPlay
              playsInline
              preload="auto"
            />
          </div>
        ) : null}

        {/* The live 3D drawing. Decorative: the headline below is the content. */}
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />

        {/* The drawing again, screened over the photo so the lines linger as it fills in. */}
        <div
          ref={overlayRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
        >
          <Image
            src="/hero/blueprint.jpg"
            alt=""
            fill
            loading="eager"
            unoptimized
            sizes="100vw"
            className="object-cover [object-position:var(--focal)_50%]"
          />
        </div>

        <div ref={labelsRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" />

        {/* Intro captions: hidden until the scroll timeline brings each in, so
            the still, finished and no-JavaScript heroes never show them. */}
        <div ref={captionsRef} className="pointer-events-none absolute inset-0">
          {INTRO_CAPTIONS.map(({ lines, side }, i) => (
            <div
              key={lines[0]}
              className={cn(
                "invisible absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_35%,transparent)] px-6 pb-12 pt-28 opacity-0",
                "md:inset-x-auto md:bottom-auto md:top-[34%] md:max-w-[21vw] md:bg-none md:p-0",
                side === "left" ? "md:left-16" : "md:right-16 md:text-right",
              )}
            >
              <p className="type-eyebrow text-brand">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-4 font-headline text-[1.9rem] font-bold leading-[1.02] tracking-[-0.03em] text-white [font-stretch:82%] md:mt-5 md:text-[clamp(1.9rem,2.5vw,3rem)]">
                {lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        {/* Keeps the headline legible over the pale sky (and the lower photo on
            phones), and carries the faint blueprint grid the inner-page heroes
            share, so both arrive with the finished hero. */}
        <div
          ref={scrimRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.35)_45%,transparent_70%)] opacity-0 md:bg-[linear-gradient(to_right,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.3)_32%,transparent_55%)]"
        >
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:96px_96px] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
        </div>

        <div
          ref={copyRef}
          className="absolute inset-x-0 bottom-0 md:inset-y-0 md:flex md:items-center"
        >
          <div className="mx-auto w-full max-w-[1440px] px-6 pb-14 md:px-16 md:pb-0 md:pt-16">
            <div className="max-w-xl md:max-w-[min(42vw,640px)]">
              <h1
                ref={headlineRef}
                className="font-headline text-[clamp(2.6rem,5vw,5.6rem)] font-bold leading-[0.98] tracking-[-0.035em] text-white [font-stretch:82%]"
              >
                <span className="block">Engineering That Holds.</span>
                <span className="block">Construction That Lasts.</span>
              </h1>
              <p
                ref={subRef}
                className="mt-6 max-w-md font-label text-base leading-[1.5] text-white/75 md:text-[17px]"
              >
                Quality-assured engineering services capable of satisfying the most stringent
                requirements of our clients, wherever required, using the best available technical
                skills.
              </p>
              <div ref={ctaRef} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <LineButton href="#contact">Talk with us</LineButton>
                <LineButton href="/gallery" variant="text">
                  Our projects
                </LineButton>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue. */}
        <div ref={cueRef} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <div ref={cueInnerRef} className="flex flex-col items-center gap-3 opacity-0">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-white/60">Scroll</span>
            <span className="relative block h-10 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-white motion-safe:animate-scroll-cue" />
            </span>
          </div>
        </div>

        {/* Hides the hero's unstarted state until its intro is ready to run.
            Only with JavaScript, so the page is never stuck behind it. */}
        <div ref={coverRef} aria-hidden className="absolute inset-0 hidden bg-black [@media(scripting:enabled)]:block" />
      </div>
    </section>
  );
}
