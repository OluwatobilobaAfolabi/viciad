import Link from "next/link";

import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { ArrowSwap } from "@/components/ui/arrow-swap";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LineButton } from "@/components/ui/line-button";
import { Shell } from "@/components/ui/shell";
import { SERVICES } from "@/lib/content";

/** The six services, each card filling with the brand violet on hover. */
export function ServicesGrid() {
  return (
    <section className="bg-paper py-28 md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow className="md:col-span-3 md:pt-4">
            Services
          </Eyebrow>
          <div className="flex flex-col gap-10 md:col-span-9 md:flex-row md:items-end md:justify-between">
            <RevealHeading className="type-h2 text-onyx">
              <span className="block">The whole project cycle,</span>
              <span className="block text-stone">or any single stage of it.</span>
            </RevealHeading>
            <LineButton href="/services" tone="dark">
              All services
            </LineButton>
          </div>
        </div>

        <Reveal stagger={0.08} className="mt-16 grid gap-4 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
          {SERVICES.map(({ title, body }, index) => (
            <Link
              key={title}
              href="/services"
              className="group flex min-h-[18rem] flex-col justify-between gap-12 rounded-md border border-ash bg-white p-7 outline-none transition-colors duration-500 ease-out hover:border-brand hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-onyx md:p-8"
            >
              <div className="flex items-start justify-between text-stone transition-colors duration-500 group-hover:text-white/75">
                <span className="type-eyebrow">{String(index + 1).padStart(2, "0")}</span>
                <ArrowSwap className="text-onyx transition-colors duration-500 group-hover:text-white" />
              </div>
              <div>
                <h3 className="type-h3 text-onyx transition-colors duration-500 group-hover:text-white">
                  {title}
                </h3>
                <p className="mt-3 font-sans text-[15px] leading-[1.6] text-stone transition-colors duration-500 group-hover:text-white/85">
                  {body}
                </p>
              </div>
            </Link>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}
