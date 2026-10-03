import Image from "next/image";

import { HeroScrim } from "@/components/decor/hero-scrim";
import { GlassPanel } from "@/components/ui/glass-panel";
import { PillButton } from "@/components/ui/pill-button";
import { Shell } from "@/components/ui/shell";
import { StatsRow } from "@/components/ui/stats-row";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-ink lg:h-[820px]">
      <Image
        src="/images/about/hero.png"
        alt="Steel fixers tying reinforcement cages on a VICIAD site"
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-[50%_38%]"
      />
      <HeroScrim />

      <Shell className="relative flex flex-col pb-16 pt-[160px] lg:pt-[261px]">
        <div className="flex w-full max-w-[644px] flex-col gap-8">
          <div className="flex flex-col gap-4 text-cloud">
            <h1 className="font-display text-[40px] font-semibold leading-[1.06] tracking-[-1.48px] sm:text-[56px] lg:text-[74px]">
              About Viciad
            </h1>
            <p className="text-base leading-[1.41] lg:text-lg">
              Providing first-class services to the engineering and construction industry.
            </p>
          </div>
          <div className="flex">
            <PillButton href="#contact">Get In Touch</PillButton>
          </div>
        </div>

        <GlassPanel className="mt-10 p-6 lg:mt-16 lg:p-8">
          <StatsRow tone="dark" />
        </GlassPanel>
      </Shell>
    </section>
  );
}
