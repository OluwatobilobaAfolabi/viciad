"use client";

import { useId, useState } from "react";

import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LineButton } from "@/components/ui/line-button";
import { Shell } from "@/components/ui/shell";
import { cn } from "@/lib/cn";

/*
 * The answers are VICIAD's own copy from elsewhere on the site; only the
 * questions are phrased for this section.
 */
const faqs = [
  {
    q: "Do you take on whole projects, or single stages?",
    a: "Both. We regularly handle projects from the initial feasibility phase right through to design, implementation and commissioning — or step in at any single stage of the cycle, according to your requirements.",
  },
  {
    q: "Are you tied to any equipment supplier?",
    a: "No. We are completely independent of equipment suppliers, so the solutions we recommend for your design and project management requirements are unbiased.",
  },
  {
    q: "How do you keep projects on schedule?",
    a: "Completion on time is a foremost objective. Working in both manual and computerised techniques, we give you a realistic plan with targets for work accomplishment, accurate reporting of status and progress, exception reports on critical activities, and early detection of deviations so preventative action can be taken in time.",
  },
  {
    q: "What does the initial consultancy phase involve?",
    a: "It determines the baseline specification for the project in terms of technology, budget and timescales. Acting as your adviser, we supply an achievable, practical project plan covering every activity and technology needed to meet your requirements.",
  },
  {
    q: "Who will work on my project?",
    a: "Our consultants are recruited for field experience, not just academics, and each area of our work has its own manager responsible for its operation.",
  },
  {
    q: "Where are you based?",
    a: "Plot 7 Agbada 2 Shell Location Road, Off Airport Road, Rivers State. You can reach us at info@viciad.com, or on 08075420004 and 08075422777.",
  },
];

/** 09 — frequently asked questions, as an accessible accordion. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className="bg-paper py-28 md:py-40">
      <Shell className="grid gap-16 md:grid-cols-12 md:gap-6">
        <div className="flex flex-col gap-10 md:col-span-4">
          <Eyebrow index="07">FAQ</Eyebrow>
          <RevealHeading className="type-h2 text-onyx">
            <span className="block">Questions,</span>
            <span className="block text-stone">answered.</span>
          </RevealHeading>
          <p className="type-body max-w-xs text-stone">Can&rsquo;t find what you need? We&rsquo;ll answer it directly.</p>
          <div>
            <LineButton href="#contact" tone="dark">
              Talk with us
            </LineButton>
          </div>
        </div>

        <Reveal className="md:col-span-7 md:col-start-6">
          <ul className="border-b border-ash">
            {faqs.map(({ q, a }, index) => {
              const expanded = open === index;
              const buttonId = `${baseId}-q${index}`;
              const panelId = `${baseId}-a${index}`;
              return (
                <li key={q} className="border-t border-ash">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpen(expanded ? null : index)}
                      className="group flex w-full items-center justify-between gap-6 py-7 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-onyx"
                    >
                      <span className="font-headline text-xl font-semibold tracking-[-0.015em] text-onyx [font-stretch:90%] md:text-[1.4rem]">
                        {q}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                          expanded ? "border-onyx bg-onyx text-white" : "border-ash text-onyx group-hover:border-onyx",
                        )}
                      >
                        <span className="absolute h-px w-3.5 bg-current" />
                        <span
                          className={cn(
                            "absolute h-3.5 w-px bg-current transition-transform duration-300",
                            expanded && "scale-y-0",
                          )}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                      expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden" inert={!expanded}>
                      <p className="type-body max-w-2xl pb-8 pr-12 text-stone">{a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Shell>
    </section>
  );
}
