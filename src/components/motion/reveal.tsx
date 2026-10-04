"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { EASE, gsap, SplitText } from "@/lib/gsap";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Fades its content up into place the first time it scrolls into view.
 * With `stagger`, each direct child comes in a beat after the last.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
  stagger,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      gsap.from(stagger ? Array.from(el.children) : el, {
        autoAlpha: 0,
        y,
        duration: 0.9,
        delay,
        stagger: stagger ?? 0,
        ease: EASE,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * A heading whose lines rise out of a mask, staggered, when it scrolls into
 * view. Split with SplitText, re-split if the layout changes, and announced
 * to screen readers as one heading.
 */
export function RevealHeading({
  as = "h2",
  className,
  children,
}: {
  as?: "h2" | "h3" | "p";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const Tag = as as "h2";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1,
            stagger: 0.09,
            ease: EASE,
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          }),
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
