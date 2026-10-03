import { HeroConstruction } from "@/components/decor/hero-construction";
import { HeroGlow } from "@/components/decor/hero-glow";
import { PillButton } from "@/components/ui/pill-button";
import { Shell } from "@/components/ui/shell";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[680px] items-center overflow-hidden bg-ink py-32 lg:h-[959px] lg:py-0"
    >
      <HeroGlow />
      <HeroConstruction />

      {/* The design nudges the copy 24px below the optical centre. */}
      <Shell className="relative lg:pt-12">
        <div className="flex w-full max-w-[1113px] flex-col gap-8">
          <div className="flex flex-col gap-4 text-cloud">
            <h1 className="font-display text-[40px] font-semibold leading-[1.41] sm:text-[56px] lg:text-[74px]">
              <span className="text-brand">Engineering</span> That Holds.
              <br />
              <span className="text-brand">Construction</span> That Lasts.
            </h1>
            <p className="max-w-[644px] text-base leading-[1.41] lg:text-lg">
              Quality-assured engineering services capable of satisfying the most stringent
              requirements of our clients, wherever required, using the best available technical
              skills.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <PillButton href="/services" variant="outline">
              Our Services
            </PillButton>
            <PillButton href="/gallery">View Projects</PillButton>
          </div>
        </div>
      </Shell>
    </section>
  );
}
