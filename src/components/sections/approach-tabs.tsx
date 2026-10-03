"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Starburst } from "@/components/icons/starburst";
import { Shell } from "@/components/ui/shell";
import { cn } from "@/lib/cn";

/**
 * Figma ships only the "Project Development" state of this switcher, so that
 * entry is verbatim from the design. The other two are assembled from VICIAD's
 * own copy elsewhere on the site — the home page process list, the About
 * expertise cards, and the four delivery points from the section below — and
 * are the obvious thing to replace with their real service text.
 */
const services = [
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
    body: "Viciad offers conceptual and detailed engineering, project management, installation and commissioning services. Each area has its own manager responsible for the normal operation of that section, producing comprehensive, precise plans and specifications for the implementation of a project.",
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
 * From lg up the section runs three viewports tall: the layout pins to the top
 * and the active service steps 01 → 02 → 03 as you scroll through. Below that
 * the pin is dropped entirely and all three simply stack, which reads better on
 * a short viewport and costs no extra scrolling.
 *
 * The active index is derived from where the tall driver sits in the viewport,
 * so the page keeps its native scrolling — nothing is hijacked, and you can
 * always scroll straight past.
 */
export function ApproachTabs() {
  const [active, setActive] = useState(0);
  const driverRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const driver = driverRef.current;
    if (!driver) return;

    const desktop = window.matchMedia(DESKTOP);
    let frame = 0;

    const measure = () => {
      frame = 0;
      if (!desktop.matches) {
        setActive(0);
        return;
      }
      const rect = driver.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(Math.max(-rect.top / travel, 0), 0.9999);
      setActive(Math.min(Math.floor(progress * services.length), services.length - 1));
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

  /** Clicking a step scrolls to the middle of its slice of the driver. */
  const goTo = useCallback((index: number) => {
    const driver = driverRef.current;
    if (!driver) return;
    const rect = driver.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    if (travel <= 0) return;
    const top = rect.top + window.scrollY + ((index + 0.5) / services.length) * travel;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const delta =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (active + delta + services.length) % services.length;
    buttonRefs.current[next]?.focus();
    goTo(next);
  };

  return (
    <div ref={driverRef} className="relative lg:h-[300vh]">
      {/* Pinned below the fixed nav rather than at the very top, so the tab
          list never sits underneath the pill. */}
      <div className="lg:sticky lg:top-[112px] lg:flex lg:h-[calc(100vh-112px)] lg:py-6">
        <Shell className="w-full lg:min-h-0">
          <div className="flex w-full flex-col gap-10 lg:h-full lg:min-h-0 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
            <div className="flex w-full flex-col gap-6 lg:h-full lg:min-h-0 lg:w-[533px] lg:shrink-0">
              <nav
                aria-label="Our approach"
                onKeyDown={onKeyDown}
                className="hidden flex-col lg:flex"
              >
                {services.map((service, index) => {
                  const current = index === active;
                  return (
                    <button
                      key={service.id}
                      ref={(node) => {
                        buttonRefs.current[index] = node;
                      }}
                      type="button"
                      aria-current={current ? "true" : undefined}
                      onClick={() => goTo(index)}
                      className={cn(
                        "flex w-full items-center gap-6 border-t-2 border-dashed px-6 py-8 text-left transition-colors duration-300",
                        current
                          ? "border-black bg-brand text-black"
                          : "border-hairline-mid text-white hover:bg-white/5",
                      )}
                    >
                      <span className="font-label text-2xl font-semibold leading-[1.06] tracking-[-0.48px]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 font-display text-[28px] font-semibold leading-[1.06] tracking-[-0.56px]">
                        {service.label}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {/* Takes whatever height is left once the tab list is placed, so
                  the pinned column always fits between nav and viewport foot. */}
              <div className="relative h-[320px] w-full overflow-hidden bg-placeholder sm:h-[440px] lg:h-auto lg:min-h-0 lg:flex-1">
                <Image
                  src="/images/services/approach.jpg"
                  alt="Tower cranes over a VICIAD project at dusk"
                  fill
                  sizes="(max-width: 1024px) 100vw, 533px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Panels share one grid cell at lg so the column is as tall as the
                longest of them and the crossfade has nothing to push around. */}
            <div className="flex flex-col gap-12 lg:grid lg:w-[755px] lg:shrink-0 lg:gap-0">
              {services.map((service, index) => (
                <article
                  key={service.id}
                  aria-hidden={index !== active || undefined}
                  className={cn(
                    "flex flex-col gap-6 border-t border-brand pt-4",
                    "lg:col-start-1 lg:row-start-1 lg:transition-opacity lg:duration-500",
                    index === active
                      ? "lg:visible lg:opacity-100"
                      : "lg:invisible lg:opacity-0",
                  )}
                >
                  <div className="flex flex-col gap-[11px]">
                    <h3 className="font-label text-[32px] font-medium leading-[1.06] tracking-[-0.96px] text-white lg:text-[48px]">
                      <span className="lg:hidden">{String(index + 1).padStart(2, "0")} </span>
                      {service.label}
                    </h3>
                    <p className="text-base leading-[1.41] text-cloud-soft lg:text-lg">
                      {service.body}
                    </p>
                  </div>

                  <ul className="flex w-full flex-col gap-4 lg:w-[644px]">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-center gap-4 rounded-[40px] bg-panel px-6 py-4 text-base leading-[1.41] text-cloud-soft"
                      >
                        <Starburst className="size-4 shrink-0 text-brand" />
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
  );
}
