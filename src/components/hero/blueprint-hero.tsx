"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

import { LineButton } from "@/components/ui/line-button";
import { EASE, gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

import { cameraKeys, sampleCamera } from "./camera-path";
import { FINAL_CAMERA, FOCAL_X, FRAME, HERO_VIDEO_SRC, PIN_LENGTH_VH, type FinalCamera } from "./hero-config";
import type { TowerScene } from "./tower-scene";

type Mode = "scroll" | "static" | "calibrate";

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

/** Holds the page still while the preloader runs (works before or after Lenis starts). */
function lockScroll(lock: boolean) {
  const root = document.documentElement;
  if (lock) {
    root.dataset.scrollLocked = "true";
    root.style.overflow = "hidden";
    window.__lenis?.stop();
  } else {
    delete root.dataset.scrollLocked;
    root.style.overflow = "";
    window.__lenis?.start();
  }
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
  const preloaderRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

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
      const mode: Mode = calibrate ? "calibrate" : reduced || !supportsWebGL() ? "static" : "scroll";
      section.dataset.mode = mode;

      let cancelled = false;
      let scene: TowerScene | null = null;
      let tick: (() => void) | null = null;
      let resizeObserver: ResizeObserver | null = null;
      let closeGui: (() => void) | null = null;
      let split: SplitText | null = null;

      const atTop = window.scrollY < 10;
      if (mode === "scroll" && atTop) lockScroll(true);

      /* ---------- Preloader: both stills and the fonts, with a progress line ---------- */
      const showProgress = safe((done: number, total: number) => {
        const p = done / total;
        gsap.to(barRef.current, { scaleX: p, duration: 0.4, ease: EASE });
        if (percentRef.current) percentRef.current.textContent = `${Math.round(p * 100)}%`;
      });
      const assets = [
        waitForImage(blueprintRef.current),
        waitForImage(photoRef.current),
        document.fonts.ready.then(() => undefined),
      ];
      let loaded = 0;
      const preload = Promise.all(
        assets.map((p) =>
          p.then(() => {
            loaded += 1;
            if (!cancelled) showProgress(loaded, assets.length);
          }),
        ),
      );

      /* ---------- Static fallback: blueprint → photo → text, no pinning ---------- */
      const runStatic = safe(() => {
        gsap.set(photoWrapRef.current, { "--reveal": "115%", opacity: 0 });
        gsap.set([cueRef.current, overlayRef.current], { autoAlpha: 0 });
        gsap.set(canvas, { autoAlpha: 0 });
        gsap.set(nav, { autoAlpha: 1 });
        gsap.set([scrimRef.current], { opacity: 0 });
        gsap.set([headlineRef.current, subRef.current, ctaRef.current], { autoAlpha: 0 });
        gsap
          .timeline({ delay: 0.2 })
          .to(preloaderRef.current, { autoAlpha: 0, duration: 0.5 })
          .to(photoWrapRef.current, { opacity: 1, duration: 1.4, ease: "power1.inOut" }, "+=0.5")
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

        ScrollTrigger.create({
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
          gsap.set([preloaderRef.current, cueRef.current, copyRef.current, scrimRef.current], { autoAlpha: 0 });
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
        tl.fromTo(scrimRef.current, { opacity: 0 }, { opacity: 1, duration: 4 }, 93)
          .fromTo(nav, { autoAlpha: 0 }, { autoAlpha: 1, duration: 2.5 }, 96)
          .to(split.lines, { yPercent: 0, duration: 3, stagger: 0.8, ease: EASE }, 95)
          .fromTo(subRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 2.5, ease: EASE }, 96.5)
          .fromTo(ctaRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 2.5, ease: EASE }, 97.2)
          .set({}, {}, 100);

        ScrollTrigger.refresh();

        // Preloader out, then a few lines start drawing at the base.
        const intro = gsap.timeline();
        intro
          .to(barRef.current, { scaleX: 1, duration: 0.3, ease: EASE })
          .to(preloaderRef.current, { autoAlpha: 0, duration: 0.8, ease: EASE })
          .add(() => lockScroll(false));
        if (atTop) {
          intro
            .to(state, { intro: 0.07, duration: 2.4, ease: "power2.out" }, "<0.2")
            .fromTo(cueInnerRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE }, "<0.6");
        } else {
          gsap.set(cueInnerRef.current, { autoAlpha: 1 });
        }
      });

      const run = async () => {
        if (mode === "static") {
          await preload;
          if (!cancelled) runStatic();
          return;
        }
        const [{ TowerScene }] = await Promise.all([import("./tower-scene"), preload]);
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
        lockScroll(false);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
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
      className="relative h-[calc(var(--pin-mobile)+100svh)] bg-black md:h-[calc(var(--pin-desktop)+100svh)] motion-reduce:h-svh data-[mode=calibrate]:h-svh data-[mode=static]:h-svh"
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
            unoptimized
            sizes="100vw"
            className="object-cover [object-position:var(--focal)_50%]"
          />
        </div>

        <div ref={labelsRef} aria-hidden className="pointer-events-none absolute inset-0 opacity-0" />

        {/* Keeps the headline legible over the pale sky (and the lower photo on phones). */}
        <div
          ref={scrimRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.35)_45%,transparent_70%)] opacity-0 md:bg-[linear-gradient(to_right,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.3)_32%,transparent_55%)]"
        />

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

        {/* Preloader. Hidden without JavaScript, so the page is never stuck behind it. */}
        <div
          ref={preloaderRef}
          className="absolute inset-0 hidden flex-col items-center justify-center gap-4 bg-black [@media(scripting:enabled)]:flex"
        >
          <span className="font-label text-[10px] uppercase tracking-[0.32em] text-white/45">Loading drawings</span>
          <div className="h-px w-40 overflow-hidden bg-white/15">
            <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-white" />
          </div>
          <span ref={percentRef} className="font-label text-xs tabular-nums text-white/55">
            0%
          </span>
        </div>
      </div>
    </section>
  );
}
