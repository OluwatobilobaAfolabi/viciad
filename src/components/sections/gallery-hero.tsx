import Image from "next/image";

import { HeroScrim } from "@/components/decor/hero-scrim";
import { PillButton } from "@/components/ui/pill-button";
import { Shell } from "@/components/ui/shell";

export function GalleryHero() {
  return (
    <section className="relative overflow-hidden bg-ink lg:h-[711px]">
      <Image
        src="/images/gallery/hero.jpg"
        alt="A gallery hall hung with framed photographs"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_15%]"
      />
      <HeroScrim />

      <Shell className="relative flex flex-col pb-16 pt-[150px] lg:pb-0 lg:pt-[261px]">
        <div className="flex w-full max-w-[644px] flex-col gap-8">
          <div className="flex flex-col gap-4 text-cloud">
            <h1 className="font-display text-[40px] font-semibold leading-[1.06] tracking-[-1.48px] sm:text-[56px] lg:text-[74px]">
              Gallery
            </h1>
            <p className="text-base leading-[1.41] lg:text-lg">
              Some Of Our Ongoing and Completed Projects.
            </p>
          </div>
          <div className="flex">
            <PillButton href="#contact">Get In Touch</PillButton>
          </div>
        </div>
      </Shell>
    </section>
  );
}
