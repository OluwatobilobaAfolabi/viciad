"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { RevealHeading } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Shell } from "@/components/ui/shell";
import { cn } from "@/lib/cn";

/**
 * "Project Development" is VICIAD's own text. The other two entries are
 * assembled from VICIAD's copy elsewhere on the site, and are the obvious
 * thing to replace when the real service text arrives.
 */
const stages = [
  {
    id: "project-development",
    label: "Project Development",
    body: "The initial consultancy phase determines the baseline specification for the project in terms of technology, budget and timescales. Acting as your adviser, our objective is to supply an achievable practical project plan covering every activity and technology needed to meet your requirements specification.",
    points: [
      "Active client involvement in all phases of development",
      "A partnership: our engineering expertise, your knowledge of the need",
      "Pure consultancy, full project management, or anything in between",
      "Consultants recruited for field experience, not just academics",
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    body: "VICIAD offers conceptual and detailed engineering, project management, installation and commissioning services. Each area has its own manager responsible for the normal operation of that section, producing comprehensive, precise plans and specifications for the implementation of a project.",
    points: [
      "Feasibility and strategy studies to assess the viability and optimal direction of a project",
      "Comprehensive, precise plans and specifications for implementation",
      "A flexible, responsive service wherever required, using the best available technical skills",
      "Final installation, connection, testing and activation of equipment and systems",
    ],
  },
  {
    id: "project-management",
    label: "Project Management",
    body: "Planning, organisation and execution of tasks and resources to achieve project goals. Completion of projects on time is a foremost objective, and our engineers work in both manual and computerised techniques to keep delivery on schedule.",
    points: [
      "A realistic plan for timely execution, with targets set for work accomplishment",
      "Accurate, timely reporting of status and progress at every interval",
      "Exception reports highlighting areas of concern and critical activities",
      "Early detection of deviations, so preventative action can be taken in time",
    ],
  },
];

const DESKTOP = "(min-width: 1024px)";

/**
 * The approach, one stage at a time. From lg up the section is three
 * screens tall: the layout holds still (position: sticky) below the nav and
 * the active stage steps 01 → 02 → 03 as you scroll, with a line under each
 * stage filling as you pass through it. Nothing is hijacked; you can always
 * scroll straight past. Below lg the three simply stack.
 */
export function Approach() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  // Below lg every stage is on screen, so none may be hidden from assistive tech.
  const [stacked, setStacked] = useState(true);
  const driverRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const driver = driverRef.current;
    if (!driver) return;
    const desktop = window.matchMedia(DESKTOP);
    let frame = 0;

    const measure = () => {
      frame = 0;
      setStacked(!desktop.matches);
      if (!desktop.matches) {
        setActive(0);
        return;
      }
      const rect = driver.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const p = Math.min(Math.max(-rect.top / travel, 0), 0.9999);
      setProgress(p);
      setActive(Math.min(Math.floor(p * stages.length), stages.length - 1));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      desktop.removeEventListener("change", schedule);
    };
  }, []);

  /** Scrolls to the middle of a stage's slice of the section. */
  const goTo = useCallback((index: number) => {
    const driver = driverRef.current;
    if (!driver) return;
    const rect = driver.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    if (travel <= 0) return;
    const top = rect.top + window.scrollY + ((index + 0.5) / stages.length) * travel;
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.2 });
    else window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const delta = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (active + delta + stages.length) % stages.length;
    buttonRefs.current[next]?.focus();
    goTo(next);
  };

  /** How far through its own slice the given stage is, 0–1. */
  const fill = (index: number) => Math.min(Math.max(progress * stages.length - index, 0), 1);

  return (
    <section id="approach" className="bg-onyx text-white">
      <Shell className="pt-28 md:pt-40">
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow tone="light" className="md:col-span-3 md:pt-4">
            Our approach
          </Eyebrow>
          <RevealHeading className="type-h2 md:col-span-9">
            <span className="block">Development, engineering</span>
            <span className="block text-mist">&amp; management.</span>
          </RevealHeading>
        </div>
      </Shell>

      <div ref={driverRef} className="relative pb-28 pt-16 md:pb-40 md:pt-24 lg:h-[300svh] lg:pb-0 lg:pt-0">
        <div className="lg:sticky lg:top-24 lg:flex lg:h-[calc(100svh-6rem)] lg:items-center">
          <Shell className="w-full">
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-6">
              <div className="hidden flex-col gap-10 lg:col-span-4 lg:flex">
                <nav aria-label="Our approach" onKeyDown={onKeyDown} className="flex flex-col">
                  {stages.map((stage, index) => {
                    const current = index === active;
                    return (
                      <button
                        key={stage.id}
                        ref={(node) => {
                          buttonRefs.current[index] = node;
                        }}
                        type="button"
                        aria-current={current ? "step" : undefined}
                        onClick={() => goTo(index)}
                        className="group relative flex items-baseline gap-5 py-5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <span className="absolute inset-x-0 bottom-0 h-px bg-white/12" />
                        <span
                          className="absolute inset-x-0 bottom-0 h-px origin-left bg-white"
                          style={{ transform: `scaleX(${fill(index)})` }}
                        />
                        <span
                          className={cn(
                            "type-eyebrow transition-colors duration-300",
                            current ? "text-brand" : "text-white/40",
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "type-h3 transition-colors duration-300",
                            current ? "text-white" : "text-white/40 group-hover:text-white/70",
                          )}
                        >
                          {stage.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-graphite">
                  <Image
                    src="/images/services/approach.jpg"
                    alt="Tower cranes over a VICIAD project at dusk"
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* The panels share one grid cell at lg, so the column is as tall
                  as the longest and the crossfade pushes nothing around. */}
              <div className="flex flex-col gap-20 lg:col-span-7 lg:col-start-6 lg:grid lg:gap-0">
                {stages.map((stage, index) => (
                  <article
                    key={stage.id}
                    aria-hidden={(!stacked && index !== active) || undefined}
                    className={cn(
                      "lg:col-start-1 lg:row-start-1 lg:transition-[opacity,visibility,transform] lg:duration-700 lg:ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                      index === active
                        ? "lg:visible lg:translate-y-0 lg:opacity-100"
                        : "lg:invisible lg:translate-y-4 lg:opacity-0",
                    )}
                  >
                    <p className="type-eyebrow text-brand">
                      Stage {String(index + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-6 font-headline text-[clamp(2rem,3.6vw,3.5rem)] font-bold leading-none tracking-[-0.035em] [font-stretch:84%]">
                      {stage.label}
                    </h3>
                    <p className="type-body mt-6 max-w-2xl text-mist">{stage.body}</p>
                    <ul className="mt-10 border-b border-white/12">
                      {stage.points.map((point, pointIndex) => (
                        <li
                          key={point}
                          className="grid grid-cols-[3rem_1fr] items-baseline gap-2 border-t border-white/12 py-4 font-sans text-[15px] leading-[1.55] text-white/85"
                        >
                          <span className="type-eyebrow text-white/40">
                            {String.fromCharCode(97 + pointIndex)}.
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </Shell>
        </div>
      </div>
    </section>
  );
}
