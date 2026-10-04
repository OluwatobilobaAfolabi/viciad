"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { Eyebrow, Placeholder } from "@/components/ui/eyebrow";
import { Shell } from "@/components/ui/shell";
import { cn } from "@/lib/cn";

/**
 * The five photographs are all of one job — the road, the bridge piers, the
 * jetty, the foundations and the pipeline — so this is one project with five
 * photographs. More projects later means turning this into a list.
 */
const project = {
  title: ["Road construction to an", "offshore loading jetty."],
  photos: [
    { src: "/images/gallery/road-shoreline.png", alt: "Earthworks cut along the shoreline from the air" },
    { src: "/images/gallery/bridge-piers.png", alt: "Concrete bridge piers standing in the river" },
    { src: "/images/gallery/jetty-aerial.png", alt: "Aerial view of the jetty works and barge" },
    { src: "/images/gallery/foundations.png", alt: "Reinforced foundations and formwork under construction" },
    { src: "/images/gallery/pipeline.png", alt: "Pipeline walkway with crew in high-visibility gear" },
  ],
};

const VIEWS = [
  { id: "slideshow", label: "Slideshow" },
  { id: "grid", label: "Grid" },
] as const;
type View = (typeof VIEWS)[number]["id"];

const ADVANCE_MS = 4500;

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The featured project. "Slideshow" is one large frame that crossfades
 * on its own (paused on hover or focus, and never for reduced motion) with a
 * thumbnail strip beneath; "Grid" lays every photograph out at once, and
 * choosing one opens it in the slideshow.
 */
export function ProjectViewer() {
  const [view, setView] = useState<View>("slideshow");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => true,
  );
  const count = project.photos.length;

  const playing = view === "slideshow" && !paused && !reduced;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % count), ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [playing, active, count]);

  const step = (delta: number) => setActive((index) => (index + delta + count) % count);

  const onTabKeyDown = (event: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    setView((current) => (current === "slideshow" ? "grid" : "slideshow"));
  };

  return (
    <section className="bg-white py-28 md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow className="md:col-span-3 md:pt-4">
            Featured project
          </Eyebrow>
          <div className="md:col-span-9">
            <RevealHeading className="type-h2 text-onyx">
              <span className="block">{project.title[0]}</span>
              <span className="block text-mist">{project.title[1]}</span>
            </RevealHeading>
            <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-sans text-sm text-stone">
              <span>{count} photographs</span>
              <Placeholder>client, location &amp; year</Placeholder>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between gap-6 border-b border-ash md:mt-24">
          <div role="tablist" aria-label="Gallery view" onKeyDown={onTabKeyDown} className="flex gap-8">
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
                    "relative -mb-px border-b py-4 font-sans text-[15px] font-medium outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-onyx",
                    selected ? "border-onyx text-onyx" : "border-transparent text-stone hover:text-onyx",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="type-eyebrow tabular-nums text-stone" aria-live="polite">
            <span className="text-onyx">{pad(active + 1)}</span> / {pad(count)}
          </p>
        </div>

        <div id="gallery-panel" role="tabpanel" aria-labelledby={`gallery-tab-${view}`} className="mt-8">
          {view === "slideshow" ? (
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-ash md:aspect-[16/9]">
                {project.photos.map((photo, index) => (
                  <Image
                    key={photo.src}
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1440px) 100vw, 1312px"
                    aria-hidden={index !== active || undefined}
                    className={cn(
                      "object-cover transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                      index === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                    )}
                  />
                ))}

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-[linear-gradient(to_top,rgba(10,10,10,0.7),transparent)] p-5 pt-20 md:p-8 md:pt-28">
                  <p className="max-w-md font-sans text-sm text-white/85 md:text-[15px]">
                    {project.photos[active].alt}
                  </p>
                  <div className="flex shrink-0 gap-2">
                    {[
                      { delta: -1, label: "Previous photograph", flip: true },
                      { delta: 1, label: "Next photograph", flip: false },
                    ].map(({ delta, label, flip }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => step(delta)}
                        aria-label={label}
                        className="flex size-11 items-center justify-center rounded-full border border-white/45 text-white outline-none transition-colors duration-300 hover:border-white hover:bg-white hover:text-onyx focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <ArrowUpRight className={cn("size-4", flip ? "-rotate-[135deg]" : "rotate-45")} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <ul className="mt-4 grid grid-cols-5 gap-2 md:gap-4">
                {project.photos.map((photo, index) => {
                  const current = index === active;
                  return (
                    <li key={photo.src}>
                      <button
                        type="button"
                        onClick={() => setActive(index)}
                        aria-label={`Show photograph ${index + 1} of ${count}`}
                        aria-current={current ? "true" : undefined}
                        className="group block w-full text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-onyx"
                      >
                        <span className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-ash">
                          <Image
                            src={photo.src}
                            alt=""
                            fill
                            sizes="20vw"
                            className={cn(
                              "object-cover transition-opacity duration-500",
                              current ? "opacity-100" : "opacity-45 group-hover:opacity-80",
                            )}
                          />
                        </span>
                        <span className="relative mt-3 block h-px bg-ash">
                          {current ? (
                            <span
                              key={`${active}-${playing}`}
                              className="absolute inset-0 origin-left bg-onyx"
                              style={
                                playing ? { animation: `progress ${ADVANCE_MS}ms linear both` } : undefined
                              }
                            />
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
              {project.photos.map((photo, index) => (
                <li key={photo.src} className={cn(index === 0 && "col-span-2 row-span-2")}>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(index);
                      setView("slideshow");
                    }}
                    aria-label={`Open photograph ${index + 1} of ${count} in the slideshow`}
                    className="group relative block size-full min-h-40 overflow-hidden rounded-md bg-ash outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-onyx md:min-h-56"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes={index === 0 ? "66vw" : "33vw"}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-4 top-4 font-sans text-xs tabular-nums text-white drop-shadow">
                      {pad(index + 1)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Reveal className="mt-20 rounded-md border border-dashed border-ash p-8 text-center md:mt-28 md:p-14">
          <p className="type-eyebrow text-stone">More projects</p>
          <p className="mt-4 font-sans text-[15px] text-stone">
            <Placeholder>further projects — titles, details and photographs</Placeholder>
          </p>
        </Reveal>
      </Shell>
    </section>
  );
}
