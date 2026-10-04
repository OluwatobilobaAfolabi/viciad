"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { RevealHeading } from "@/components/motion/reveal";
import { ArrowSwap } from "@/components/ui/arrow-swap";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Shell } from "@/components/ui/shell";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const items = [
  {
    kind: "Sector",
    title: "Civil Construction",
    body: "Conceptual and detailed engineering, project management, installation and commissioning.",
    image: "/images/about/hero.png",
    alt: "Steel fixers tying reinforcement cages",
  },
  {
    kind: "Sector",
    title: "Road & Bridge Construction",
    body: "Each area has its own manager, responsible for the normal operation of that section.",
    image: "/images/gallery/bridge-piers.png",
    alt: "Concrete bridge piers standing in a river",
  },
  {
    kind: "Sector",
    title: "Foundation Construction",
    body: "A flexible, responsive service wherever it is required, using the best available technical skills.",
    image: "/images/gallery/foundations.png",
    alt: "Reinforced foundations and formwork under construction",
  },
  {
    kind: "Service",
    title: "Hook-up & Commissioning",
    body: "Final installation, connection, testing and activation of equipment, so systems function correctly.",
    image: "/images/gallery/pipeline.png",
    alt: "A pipeline walkway with crew in high-visibility gear",
  },
  {
    kind: "Project",
    title: "Road Construction to an Offshore Loading Jetty",
    body: "From the shoreline road to the jetty, foundations and pipeline.",
    image: "/images/gallery/jetty-aerial.png",
    alt: "Aerial view of jetty works and a barge on the river",
    href: "/gallery",
  },
];

/**
 * 06 — sectors and a featured project, explored sideways.
 *
 * On desktop the section holds still (position: sticky) while vertical
 * scrolling drives the row of cards left; the section is made exactly as tall
 * as that sideways distance. On phones, and for reduced motion, it is a plain
 * horizontal swipe with snap points.
 */
export function SectorsScroller() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = section.current!;
        const row = track.current!;
        const travel = () => Math.max(0, row.scrollWidth - window.innerWidth);
        const size = () => {
          el.style.height = `${travel() + window.innerHeight}px`;
        };
        size();
        ScrollTrigger.addEventListener("refreshInit", size);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
        tl.to(row, { x: () => -travel(), ease: "none" }, 0).fromTo(
          bar.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none" },
          0,
        );
        ScrollTrigger.refresh();

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", size);
          el.style.height = "";
        };
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} data-nav-tone="dark" className="relative bg-onyx text-white">
      <div className="flex flex-col justify-center overflow-hidden py-28 md:sticky md:top-0 md:h-svh md:pb-8 md:pt-24">
        <Shell className="grid gap-y-8 md:grid-cols-12 md:gap-x-6">
          <Eyebrow index="05" tone="light" className="md:col-span-3 md:pt-4">
            Sectors &amp; projects
          </Eyebrow>
          <div className="flex flex-col gap-8 md:col-span-9 md:flex-row md:items-end md:justify-between">
            <RevealHeading className="type-h2">
              <span className="block">Where we build.</span>
            </RevealHeading>
            <div className="hidden w-48 items-center gap-4 font-sans text-xs text-mist md:flex">
              <span>Scroll</span>
              <span className="relative h-px flex-1 bg-white/15">
                <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-white" />
              </span>
            </div>
          </div>
        </Shell>

        <div className="mt-12 overflow-x-auto [scrollbar-width:none] md:mt-16 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          <div ref={track} className="flex w-max snap-x snap-mandatory gap-5 px-6 md:snap-none md:gap-6 md:px-16">
            {items.map((item, index) => {
              const card = (
                <>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-graphite md:aspect-[16/10]">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 768px) 82vw, 520px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-6 flex items-center justify-between font-sans text-xs text-mist">
                    <span className="type-eyebrow">{item.kind}</span>
                    <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="type-h3 mt-4 flex items-start justify-between gap-4">
                    {item.title}
                    {item.href ? <ArrowSwap className="mt-1.5" /> : null}
                  </h3>
                  <p className="mt-3 max-w-md font-sans text-[15px] leading-[1.6] text-mist">{item.body}</p>
                </>
              );
              const box = "group block w-[82vw] shrink-0 snap-start sm:w-[60vw] md:w-[min(36vw,520px)]";
              return item.href ? (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`${box} outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
                >
                  {card}
                </Link>
              ) : (
                <article key={item.title} className={box}>
                  {card}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
