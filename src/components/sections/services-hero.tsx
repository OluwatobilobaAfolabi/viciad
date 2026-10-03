import Image from "next/image";

import { HeroScrim } from "@/components/decor/hero-scrim";
import { Starburst } from "@/components/icons/starburst";
import { PillButton } from "@/components/ui/pill-button";
import { Shell } from "@/components/ui/shell";
import { cn } from "@/lib/cn";

const capabilities = [
  "Professional Teams",
  "Electrical & Instrumentation",
  "Quality Assurance",
  "Civil / Structural",
  "Hook-up & Commissioning",
  "Mechanical / Piping",
];

/** One pass of the capability list. The second copy is decorative. */
function CapabilityTrack({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={cn(
        "flex shrink-0 items-center gap-6 pr-6 lg:gap-8 lg:pr-8",
        "motion-safe:animate-marquee motion-safe:group-hover:[animation-play-state:paused]",
        duplicate && "motion-reduce:hidden",
      )}
    >
      {capabilities.map((capability) => (
        <li key={capability} className="flex shrink-0 items-center gap-6 lg:gap-8">
          <Starburst className="size-4 shrink-0 text-brand" />
          <span className="whitespace-nowrap font-display text-base leading-[1.06] tracking-[-0.32px] text-white">
            {capability}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-ink lg:h-[820px]">
      <Image
        src="/images/services/hero.jpg"
        alt="Steelwork rising against the sky on a VICIAD project"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-[50%_36%]"
      />
      <HeroScrim />

      <Shell className="relative flex flex-col pb-16 pt-[150px] lg:pb-0 lg:pt-[256px]">
        <div className="flex w-full max-w-[1113px] flex-col gap-8">
          <div className="flex flex-col gap-4 text-white">
            <h1 className="font-display text-[40px] font-semibold leading-[1.06] tracking-[-1.48px] sm:text-[56px] lg:text-[74px]">
              Feasibility.
              <br />
              Design.
              <br />
              <span className="text-brand">Commissioning.</span>
            </h1>
            <p className="max-w-[644px] text-base leading-[1.41] lg:text-lg">
              We regularly handle projects from the initial feasibility phase right through to
              design, implementation and commissioning — or step in at any single stage of the
              cycle, according to your requirements.
            </p>
          </div>
          <div className="flex">
            <PillButton href="#contact">Get in Touch</PillButton>
          </div>
        </div>
      </Shell>

      {/*
       * Capability marquee, pinned to the foot of the hero at lg and in flow
       * below it. Two identical tracks sit side by side and the pair slides by
       * exactly one track width per cycle, so the seam never shows. Reduced
       * motion drops back to a static strip you can scroll by hand.
       */}
      <div className="group relative border-y border-glass-line bg-white/12 backdrop-blur-[15px] lg:absolute lg:inset-x-0 lg:bottom-0">
        <div className="flex overflow-hidden py-5 lg:py-8 motion-reduce:overflow-x-auto motion-reduce:[scrollbar-width:none] motion-reduce:[&::-webkit-scrollbar]:hidden">
          <CapabilityTrack />
          <CapabilityTrack duplicate />
        </div>
      </div>
    </section>
  );
}
