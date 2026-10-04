"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

const photos = [
  { src: "/images/services/hero.jpg", alt: "Steelwork and a tower crane seen from below" },
  { src: "/images/gallery/road-shoreline.png", alt: "Road earthworks along the shoreline, seen from above" },
  { src: "/images/our-story.png", alt: "A concrete frame building under construction" },
  { src: "/images/about/overview.png", alt: "A crew setting out reinforcement on site" },
];

const INTERVAL_MS = 4500;

/**
 * Site photography crossfading on a slow cycle beside the stats. It only
 * advances while on screen, and holds on the first photo for visitors who
 * prefer reduced motion.
 */
export function RotatingPhotos({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) {
        timer = window.setInterval(() => setIndex((i) => (i + 1) % photos.length), INTERVAL_MS);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div ref={ref} className={cn("flex flex-col gap-4", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-ash">
        {photos.map((photo, i) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            aria-hidden={i !== index}
            className={cn(
              "object-cover transition-[opacity,transform] duration-[1400ms] ease-out",
              i === index ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
            )}
          />
        ))}
      </div>
      <div className="flex items-center gap-4 font-sans text-xs tabular-nums text-stone">
        <span>
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <span className="relative h-px flex-1 overflow-hidden bg-ash">
          <span
            key={index}
            className="absolute inset-y-0 left-0 w-full origin-left bg-onyx motion-safe:animate-[progress_4500ms_linear]"
          />
        </span>
      </div>
    </div>
  );
}
