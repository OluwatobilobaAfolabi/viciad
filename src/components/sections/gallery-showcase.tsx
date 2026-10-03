"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Shell } from "@/components/ui/shell";
import { cn } from "@/lib/cn";

/**
 * Figma gives one caption for the whole strip, and the five photographs are all
 * of the same job — the road, the bridge piers, the jetty, the foundations and
 * the pipeline — so this is modelled as one project with five photographs
 * rather than five separate projects. Adding more projects later means turning
 * this into a list; the title would then follow the active one.
 */
const project = {
  title: "Road Construction to an Offshore Loading Jetty",
  photos: [
    { src: "/images/gallery/road-shoreline.png", alt: "Earthworks cut along the shoreline from the air" },
    { src: "/images/gallery/bridge-piers.png", alt: "Concrete bridge piers standing in the river" },
    { src: "/images/gallery/jetty-aerial.png", alt: "Aerial view of the jetty works and barge" },
    { src: "/images/gallery/foundations.png", alt: "Reinforced foundations and formwork under construction" },
    { src: "/images/gallery/pipeline.png", alt: "Pipeline walkway with crew in high-visibility gear" },
  ],
};

const VIEWS = [
  { id: "slideshow", label: "Watch Slideshow" },
  { id: "grid", label: "Grid View" },
] as const;

type View = (typeof VIEWS)[number]["id"];

const AUTO_ADVANCE_MS = 3800;

export function GalleryShowcase() {
  const [view, setView] = useState<View>("slideshow");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLLIElement | null)[]>([]);

  /* "Watch Slideshow" earns its name: the expanded photo advances on its own. */
  useEffect(() => {
    if (view !== "slideshow" || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % project.photos.length),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearInterval(timer);
  }, [view, paused, active]);

  /* Nudge the strip only when the expanded photo would otherwise be off-screen. */
  useEffect(() => {
    if (view !== "slideshow") return;
    const panel = panelRefs.current[active];
    const scroller = scrollerRef.current;
    if (!panel || !scroller) return;

    const p = panel.getBoundingClientRect();
    const s = scroller.getBoundingClientRect();
    if (p.right > s.right) {
      scroller.scrollTo({ left: scroller.scrollLeft + (p.right - s.right) + 24, behavior: "smooth" });
    } else if (p.left < s.left) {
      scroller.scrollTo({ left: scroller.scrollLeft - (s.left - p.left) - 24, behavior: "smooth" });
    }
  }, [active, view]);

  const onToggleKeyDown = (event: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    setView((current) => (current === "slideshow" ? "grid" : "slideshow"));
  };

  return (
    <section className="bg-white py-16 lg:pb-[201px] lg:pt-[104px]">
      <Shell>
        <div
          role="tablist"
          aria-label="Gallery view"
          onKeyDown={onToggleKeyDown}
          className="mx-auto flex h-[45px] w-[323px] max-w-full gap-1 rounded-[30px] border border-switch-line bg-switch p-1"
        >
          {VIEWS.map(({ id, label }) => {
            const selected = view === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`gallery-tab-${id}`}
                aria-selected={selected}
                aria-controls="gallery-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setView(id)}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-[20px] px-8 py-2.5 font-display text-base font-medium leading-[1.06] tracking-[-0.32px] transition-colors",
                  selected
                    ? "bg-brand text-white drop-shadow-[0px_2px_2px_rgba(0,0,0,0.24)]"
                    : "text-switch-off hover:text-ink",
                )}
              >
                <span className="whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      </Shell>

      <div id="gallery-panel" role="tabpanel" aria-labelledby={`gallery-tab-${view}`}>
        {view === "slideshow" ? (
          /*
           * The strip is anchored to the page gutter and runs past the right
           * edge exactly as the design has it (1421px of panels in a 1440px
           * frame), so the last photograph is always clipped. Making it a
           * scroller rather than pure overflow keeps it usable at any width.
           */
          <div
            ref={scrollerRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="mx-auto mt-10 w-full max-w-[1440px] overflow-x-auto px-6 [scrollbar-width:none] lg:mt-16 lg:pl-16 lg:pr-0 [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex w-max gap-6 pr-6 lg:pr-16">
              {project.photos.map((photo, index) => {
                const expanded = index === active;
                return (
                  <li
                    key={photo.src}
                    ref={(node) => {
                      panelRefs.current[index] = node;
                    }}
                    className={cn(
                      "h-[320px] shrink-0 transition-[width] duration-500 ease-out sm:h-[400px] lg:h-[505px]",
                      expanded
                        ? "w-[260px] sm:w-[380px] lg:w-[533px]"
                        : "w-[96px] sm:w-[140px] lg:w-[198px]",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      aria-label={`Show photograph ${index + 1} of ${project.photos.length}`}
                      aria-current={expanded ? "true" : undefined}
                      className="relative block size-full overflow-hidden rounded-[32px] bg-placeholder"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 1024px) 50vw, 533px"
                        className="object-cover"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <Shell className="mt-10 lg:mt-16">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {project.photos.map((photo) => (
                <li
                  key={photo.src}
                  className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-placeholder"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 421px"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </Shell>
        )}

        <Shell className="mt-8">
          <h2 className="font-display text-[32px] font-semibold leading-[1.06] tracking-[-1.12px] text-black sm:text-[44px] lg:text-[56px]">
            {project.title}
          </h2>
        </Shell>
      </div>
    </section>
  );
}
