"use client";

import { useEffect, useRef, useState } from "react";

import { WORDMARK_BOUNDS, WORDMARK_PATH } from "@/components/brand/viciad-wordmark";
import { lockScroll } from "@/lib/scroll-lock";
import { loaderWork, markSiteReady, onLoaderWork } from "@/lib/site-loader";
import { sampleWordmarkDots } from "@/lib/wordmark-dots";

/** Shortest time on screen, so the whole fill always plays out. */
const MIN_MS = 5000;
/** Give up waiting after this and let the visitor in. */
const MAX_MS = 20000;
/** Width of the soft edge where dots turn from dull to lit, as a share of the wordmark. */
const EDGE = 0.14;
const STEPS = 6;
const DULL = [255, 255, 255, 0.09] as const;
const LIT = [139, 92, 246, 1] as const; // brand violet

const [LEFT, TOP, RIGHT, BOTTOM] = WORDMARK_BOUNDS;
/** The server-rendered dull dots: same pitch as the canvas uses on desktop. */
const SVG_PITCH = 0.58;

/** Resolves when a media element has enough to show (or fails, which also counts). */
function mediaReady(el: HTMLImageElement | HTMLVideoElement) {
  return new Promise<void>((resolve) => {
    if (el instanceof HTMLImageElement) {
      if (el.complete) return resolve();
      el.addEventListener("load", () => resolve(), { once: true });
    } else {
      if (el.readyState >= 2) return resolve();
      el.addEventListener("loadeddata", () => resolve(), { once: true });
    }
    el.addEventListener("error", () => resolve(), { once: true });
  });
}

/**
 * The home page's opening screen: the VICIAD wordmark in dots, all dull, lighting
 * up violet from left to right as the page really loads.
 *
 * The dull wordmark is plain SVG, so it is on screen from the first paint,
 * before any JavaScript runs; the lit fill is drawn on a canvas over it once
 * the code is in. Progress follows real work — the window's own load, the
 * fonts, every eagerly loaded image and video on the page, and anything a
 * page registers with `holdLoader` (the home hero's drawings and 3D code) —
 * so a slow connection fills slowly. It never takes less than MIN_MS, so the
 * animation always plays out, nor more than MAX_MS. Then the screen lifts
 * away and `siteReady` resolves.
 *
 * Shown whenever the home page is loaded in full — first visit, refresh or
 * hard refresh. On other pages a head script marks <html> and CSS hides it
 * before it can flash. Without JavaScript it
 * never shows at all.
 */
export function SiteLoader() {
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Not the home page: CSS keeps it hidden; just let the page start.
    if (document.documentElement.dataset.loader === "skip") {
      markSiteReady();
      return;
    }
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    const overlay = root.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const release = lockScroll();

    /* ---------- What we wait for ---------- */
    const windowLoaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
    const media = Array.from(document.querySelectorAll<HTMLImageElement | HTMLVideoElement>("main img, main video"))
      .filter((m) => !(m instanceof HTMLImageElement && m.loading === "lazy"))
      .map(mediaReady);
    const base: Promise<unknown>[] = [windowLoaded, document.fonts.ready, ...media];
    let total = 0;
    let done = 0;
    const counted = new WeakSet<Promise<unknown>>();
    const count = () => {
      for (const work of [...base, ...loaderWork()]) {
        if (counted.has(work)) continue;
        counted.add(work);
        total += 1;
        work.then(
          () => (done += 1),
          () => (done += 1),
        );
      }
    };
    count();
    const stopListening = onLoaderWork(count);

    /* ---------- Dots ---------- */
    let dots: { x: number; y: number; u: number; a: number }[] = [];
    let radius = 1;
    let cw = 0;
    let ch = 0;
    const resize = () => {
      const width = el.parentElement!.clientWidth;
      const sampled = sampleWordmarkDots(width);
      cw = width;
      ch = sampled.height;
      radius = sampled.pitch * 0.36;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(cw * dpr);
      el.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Re-sampled at the new size; the fill catches up within a few frames.
      dots = sampled.points.map(({ x, y }) => ({ x, y, u: x / width, a: 0 }));
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (progress: number) => {
      const paths = Array.from({ length: STEPS + 1 }, () => new Path2D());
      for (const dot of dots) {
        // Lit once the fill front has passed it, with a soft edge.
        const target = Math.min(Math.max((progress * (1 + EDGE) - dot.u) / EDGE, 0), 1);
        dot.a += (target - dot.a) * (reduced ? 1 : 0.2);
        const step = Math.round(dot.a * STEPS);
        const r = radius * (1 + dot.a * 0.18);
        paths[step].moveTo(dot.x + r, dot.y);
        paths[step].arc(dot.x, dot.y, r, 0, Math.PI * 2);
      }
      ctx.clearRect(0, 0, cw, ch);
      paths.forEach((path, step) => {
        const t = step / STEPS;
        const mix = (i: number) => DULL[i] + (LIT[i] - DULL[i]) * t;
        ctx.fillStyle = `rgba(${mix(0)},${mix(1)},${mix(2)},${mix(3)})`;
        ctx.fill(path);
      });
    };

    /* ---------- Progress loop ---------- */
    const start = performance.now();
    let shown = 0;
    let creep = 0;
    let frame = 0;
    let leaving = false;
    let exitTimer = 0;

    const finish = () => {
      if (leaving) return;
      leaving = true;
      release();
      markSiteReady();
      overlay.dataset.state = "leaving";
      exitTimer = window.setTimeout(() => setGone(true), reduced ? 400 : 1100);
    };

    const loop = (now: number) => {
      const elapsed = now - start;
      const real = total ? done / total : 0;
      // While a big file is still coming, drift slowly toward the next
      // milestone (never reaching it), so the fill keeps moving honestly.
      const next = total ? Math.min(real + 0.85 / total, 0.97) : 0.1;
      creep = Math.max(creep, real);
      creep += (next - creep) * 0.004;
      // Follow that, but never faster than the minimum time allows.
      const target = elapsed > MAX_MS ? 1 : Math.min(real === 1 ? 1 : creep, elapsed / MIN_MS, 1);
      shown = Math.max(shown, shown + (target - shown) * 0.07);
      if (target === 1 && shown > 0.985) shown = 1;
      draw(shown);
      // The canvas has taken over from the server-drawn dots.
      if (!overlay.dataset.live) overlay.dataset.live = "true";
      if (counter.current) counter.current.textContent = String(Math.round(shown * 100)).padStart(3, "0");
      // Fully lit: hold a beat, then lift away.
      if (shown === 1 && !exitTimer) exitTimer = window.setTimeout(finish, 350);
      if (!leaving) frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      window.removeEventListener("resize", resize);
      stopListening();
      release();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      id="site-loader"
      aria-hidden
      data-state="loading"
      className="group/loader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-onyx transition-[clip-path] duration-[1000ms] ease-[cubic-bezier(0.76,0,0.24,1)] [clip-path:inset(0_0_0_0)] data-[state=leaving]:[clip-path:inset(0_0_100%_0)] motion-reduce:transition-opacity motion-reduce:duration-300 motion-reduce:data-[state=leaving]:[clip-path:none] motion-reduce:data-[state=leaving]:opacity-0 [@media(scripting:none)]:hidden"
    >
      <div className="flex w-[min(78vw,980px)] flex-col gap-6 transition-[opacity,transform] duration-700 ease-out group-data-[state=leaving]/loader:-translate-y-6 group-data-[state=leaving]/loader:opacity-0">
        <div className="relative">
          {/* The dull wordmark, drawn by the server so it shows on first paint. */}
          <svg
            viewBox={`${LEFT} ${TOP} ${RIGHT - LEFT} ${BOTTOM - TOP}`}
            className="block h-auto w-full group-data-[live]/loader:opacity-0"
          >
            <defs>
              <pattern id="loader-dots" patternUnits="userSpaceOnUse" width={SVG_PITCH} height={SVG_PITCH} x={LEFT} y={TOP}>
                <circle cx={SVG_PITCH / 2} cy={SVG_PITCH / 2} r={SVG_PITCH * 0.36} fill={`rgba(255,255,255,${DULL[3]})`} />
              </pattern>
            </defs>
            <path d={WORDMARK_PATH} fill="url(#loader-dots)" />
          </svg>
          <canvas ref={canvas} className="absolute inset-0 size-full" />
        </div>
        <div className="type-eyebrow flex items-center justify-between text-white/40">
          <span>Loading</span>
          <span className="tabular-nums text-white/70">
            <span ref={counter}>000</span>%
          </span>
        </div>
      </div>
    </div>
  );
}
