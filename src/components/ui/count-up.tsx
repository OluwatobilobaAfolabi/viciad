"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const DURATION_MS = 1600;

/** Decelerating ramp — quick off the mark, easing into the final figure. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** useLayoutEffect zeroes the figure before paint, but only exists on the client. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type CountUpProps = {
  to: number;
  suffix?: string;
  className?: string;
};

/**
 * Counts from zero to `to` whenever the figure scrolls into view, and rewinds
 * on the way out so it runs again on the next pass.
 *
 * The real figure is what renders on the server, so crawlers and visitors
 * without JavaScript see "147+" rather than a zero.
 */
export function CountUp({ to, suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const run = () => {
      const startedAt = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / DURATION_MS, 1);
        setValue(Math.round(easeOut(progress) * to));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    setValue(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(frame);
        if (entry.isIntersecting) run();
        else setValue(0);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
