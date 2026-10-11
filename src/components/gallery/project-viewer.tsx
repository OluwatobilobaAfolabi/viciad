"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Shell } from "@/components/ui/shell";
import { cn } from "@/lib/cn";

/**
 * Site photographs of the marine and jetty works. Each has a short title
 * (shown with it) and a fuller description for screen readers.
 */
const photo = (file: string, title: string, alt: string) => ({ src: `/images/gallery/site/${file}.webp`, title, alt });

const project = {
  title: ["Road construction to an", "offshore loading jetty."],
  photos: [
    photo("rebar-cage-jetty", "Fixing a rebar cage on the jetty platform", "Two workers in orange coveralls and life vests fixing a reinforcement cage on a platform over the river"),
    photo("pile-cap-reinforcement", "Pile cap reinforcement over the river", "Three workers tying reinforcement for a pile cap on a temporary platform above the water"),
    photo("pile-caps-deck-beams", "Concrete pile caps and deck beams", "Cast concrete pile caps and deck beams standing on piles in the river, with an industrial plant behind"),
    photo("crawler-crane-barge", "Crawler crane on a barge, pitching piles", "A crawler crane on a barge lifting a steel pile into position"),
    photo("mooring-dolphins", "Completed mooring dolphins with bollards", "Three finished concrete mooring dolphins with bollards standing in the river"),
    photo("shoreline-earthworks", "Shoreline access road earthworks", "A newly formed earth access road running along the shoreline"),
    photo("loading-platform-crew", "Crew on the loading platform", "Crew in hard hats working on the loading platform, with tyre fenders on the jetty head"),
    photo("walkway-crane-barge", "Walkway approach with the crane barge and tug", "A steel grating walkway leading out to a crane barge and a tug on the river"),
    photo("cutter-suction-dredger", "Cutter suction dredger", "A blue and yellow cutter suction dredger moored beside a barge"),
    photo("foundation-formwork", "Foundation reinforcement and formwork", "Reinforcement cages and timber formwork for foundations across a waterlogged site"),
    photo("piling-rig-barge", "Piling rig on a barge", "A piling rig and crew working from a barge at the waterfront"),
    photo("jetty-pipeline", "Pipeline along the jetty walkway", "A worker in orange coveralls walking beside the pipeline along the jetty walkway"),
    photo("concrete-pump", "Pumping concrete for the pile caps", "A concrete pump boom and mixer truck placing concrete at the quayside"),
    photo("steel-deck-frame", "Lifting a steel deck frame onto the piles", "A steel deck frame being lowered by crane onto piles in the river"),
    photo("aerial-site", "Aerial view of the site and marine spread", "Aerial view of the cleared site, storage tanks and the marine spread of barges on the river"),
    photo("quayside-rebar-mat", "Fixing a rebar mat at the quayside", "Workers in coveralls and yellow hard hats fixing a reinforcement mat at the quayside"),
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
 * scrollable thumbnail strip beneath; "Grid" lays every photograph out at once, and
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
  const strip = useRef<HTMLUListElement>(null);

  // Keep the active thumbnail in view by scrolling the strip sideways only
  // (scrollIntoView would also move the page).
  useEffect(() => {
    const list = strip.current;
    const thumb = list?.children[active] as HTMLElement | undefined;
    if (!list || !thumb) return;
    const left = thumb.offsetLeft - (list.clientWidth - thumb.clientWidth) / 2;
    list.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [active, reduced]);

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
            <Reveal className="mt-10 font-sans text-sm text-stone">
              <p>{count} photographs</p>
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
                    loading={Math.abs(index - active) <= 1 ? "eager" : "lazy"}
                    aria-hidden={index !== active || undefined}
                    className={cn(
                      "object-cover transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                      index === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                    )}
                  />
                ))}

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-[linear-gradient(to_top,rgba(10,10,10,0.7),transparent)] p-5 pt-20 md:p-8 md:pt-28">
                  <p className="max-w-xl font-headline text-xl font-semibold leading-tight tracking-[-0.02em] text-white [font-stretch:90%] md:text-3xl">
                    {project.photos[active].title}
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

              <ul
                ref={strip}
                className="mt-4 flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none] md:gap-4 [&::-webkit-scrollbar]:hidden"
              >
                {project.photos.map((photo, index) => {
                  const current = index === active;
                  return (
                    <li key={photo.src} className="w-28 shrink-0 snap-start md:w-40">
                      <button
                        type="button"
                        onClick={() => setActive(index)}
                        aria-label={`Show photograph ${index + 1} of ${count}: ${photo.title}`}
                        aria-current={current ? "true" : undefined}
                        className="group block w-full text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-onyx"
                      >
                        <span className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-ash">
                          <Image
                            src={photo.src}
                            alt=""
                            fill
                            sizes="160px"
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
            <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
              {project.photos.map((photo, index) => (
                <li key={photo.src}>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(index);
                      setView("slideshow");
                    }}
                    aria-label={`Open photograph ${index + 1} of ${count} in the slideshow: ${photo.title}`}
                    className="group block w-full text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-onyx"
                  >
                    <span className="relative block aspect-square overflow-hidden rounded-md bg-ash">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <span className="absolute left-3 top-3 font-sans text-xs tabular-nums text-white drop-shadow">
                        {pad(index + 1)}
                      </span>
                    </span>
                    <span className="mt-3 block font-sans text-sm leading-snug text-onyx transition-colors group-hover:text-brand md:text-[15px]">
                      {photo.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Shell>
    </section>
  );
}
