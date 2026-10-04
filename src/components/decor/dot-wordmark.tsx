"use client";

import { useEffect, useRef } from "react";

import { sampleWordmarkDots } from "@/lib/wordmark-dots";

/** Spring back home, and how much velocity survives each frame. */
const SPRING = 0.055;
const DAMPING = 0.86;
/** Peak outward push per frame, in px, right under the cursor. */
const PUSH = 2.6;
const SWEEP_MS = 1400;
/** Alpha steps for resting → fully scattered dots (batched per step). */
const ALPHAS = [0.17, 0.26, 0.36, 0.48];

type Dot = {
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Per-dot spin on the push direction and its strength, so the scatter is organic. */
  turn: number;
  kick: number;
};

/**
 * The VICIAD wordmark set the full width of the footer as a dense field of
 * dots sampled from the real logo artwork. The dots switch on in a
 * left-to-right sweep the first time it scrolls into view. Under the cursor
 * they scatter outward, each on a slightly different heading, and a damped
 * spring draws every one back to its place, so the logo re-forms smoothly
 * behind the pointer. Drawn on a canvas and only animated while something is
 * moving. Reduced motion gets the still wordmark.
 */
export function DotWordmark() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = wrap.current;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!box || !el || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let pad = 0; // room around the letters for scattered dots
    let radius = 1;
    let reach = 100;
    let pointer: { x: number; y: number } | null = null;
    let sweepStart = still ? -Infinity : 0; // 0 = not started yet
    let frame = 0;

    const resize = () => {
      width = box.clientWidth;
      const sampled = sampleWordmarkDots(width);
      radius = sampled.pitch * 0.36;
      reach = Math.min(Math.max(width * 0.075, 64), 140);
      pad = Math.round(reach * 0.6);
      height = sampled.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = width + pad * 2;
      const ch = height + pad * 2;
      el.width = Math.round(cw * dpr);
      el.height = Math.round(ch * dpr);
      el.style.width = `${cw}px`;
      el.style.height = `${ch}px`;
      el.style.margin = `${-pad}px`;
      box.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = sampled.points.map(({ x, y }) => ({
        hx: pad + x,
        hy: pad + y,
        x: pad + x,
        y: pad + y,
        vx: 0,
        vy: 0,
        turn: (Math.random() - 0.5) * 1.2,
        kick: 0.6 + Math.random() * 0.8,
      }));
      draw(performance.now());
    };

    /** Steps the physics and draws one frame; returns whether anything still moves. */
    const draw = (now: number) => {
      const front =
        sweepStart === -Infinity
          ? Infinity
          : sweepStart === 0
            ? -Infinity
            : pad - 100 + ((now - sweepStart) / SWEEP_MS) * (width + 200);
      let moving = sweepStart > 0 && now - sweepStart < SWEEP_MS + 300;

      // One path per alpha step keeps a few thousand dots to a handful of fills.
      const paths = ALPHAS.map(() => new Path2D());
      const fading: { dot: Dot; on: number }[] = [];

      for (const dot of dots) {
        if (pointer) {
          const dx = dot.hx - pointer.x;
          const dy = dot.hy - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < reach && d > 0.001) {
            const force = (1 - d / reach) ** 2 * PUSH * dot.kick;
            const angle = Math.atan2(dy, dx) + dot.turn;
            dot.vx += Math.cos(angle) * force;
            dot.vy += Math.sin(angle) * force;
          }
        }
        dot.vx = (dot.vx + (dot.hx - dot.x) * SPRING) * DAMPING;
        dot.vy = (dot.vy + (dot.hy - dot.y) * SPRING) * DAMPING;
        dot.x += dot.vx;
        dot.y += dot.vy;

        const offset = Math.abs(dot.x - dot.hx) + Math.abs(dot.y - dot.hy);
        if (offset > 0.05 || Math.abs(dot.vx) + Math.abs(dot.vy) > 0.05) moving = true;
        else {
          dot.x = dot.hx;
          dot.y = dot.hy;
        }

        const on = Math.min(Math.max((front - dot.hx) / 100, 0), 1);
        if (on <= 0) continue;
        if (on < 1) {
          fading.push({ dot, on });
          continue;
        }
        const step = Math.min(Math.floor(offset / 6), ALPHAS.length - 1);
        paths[step].moveTo(dot.x + radius, dot.y);
        paths[step].arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      }

      ctx.clearRect(0, 0, width + pad * 2, height + pad * 2);
      paths.forEach((path, i) => {
        ctx.fillStyle = `rgba(255,255,255,${ALPHAS[i]})`;
        ctx.fill(path);
      });
      for (const { dot, on } of fading) {
        ctx.fillStyle = `rgba(255,255,255,${ALPHAS[0] * on})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      return moving;
    };

    const loop = (now: number) => {
      frame = draw(now) ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };

    // Tracked on the window: the canvas ignores the mouse, so its overhang
    // never blocks the links above it.
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (!inside && !pointer) return;
      pointer = inside ? { x, y } : null;
      kick();
    };
    const onLeave = () => {
      if (!pointer) return;
      pointer = null;
      kick();
    };

    const sizer = new ResizeObserver(resize);
    sizer.observe(box);

    let seen: IntersectionObserver | undefined;
    if (!still) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      seen = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          sweepStart = performance.now();
          seen?.disconnect();
          kick();
        },
        { threshold: 0.35 },
      );
      seen.observe(el);
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      sizer.disconnect();
      seen?.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // The canvas overhangs the box on every side (negative margin set in
  // code) so scattered dots are never clipped; the footer hides the overflow.
  return (
    <div ref={wrap} aria-hidden className="relative w-full">
      <canvas ref={canvas} className="pointer-events-none block" />
    </div>
  );
}
