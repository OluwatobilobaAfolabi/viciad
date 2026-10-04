"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * A photograph that drifts slightly slower than the page as it passes —
 * oversized inside its frame so the drift never shows an edge.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        inner.current,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={cn("relative overflow-hidden bg-ash", className)}>
      <div ref={inner} className="absolute inset-x-0 -inset-y-[9%]">
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}
