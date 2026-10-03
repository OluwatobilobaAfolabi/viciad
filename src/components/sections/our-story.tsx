import Image from "next/image";

import { PillButton } from "@/components/ui/pill-button";
import { Shell } from "@/components/ui/shell";

export function OurStory() {
  return (
    <section id="about" className="bg-ink py-16 lg:py-[104px]">
      <Shell className="flex flex-col items-center gap-10 lg:gap-16">
        <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row">
          <h2 className="font-display text-[40px] font-semibold leading-[1.41] text-cloud sm:text-[56px] lg:whitespace-nowrap lg:text-[74px]">
            Our Story
          </h2>

          <div className="flex flex-col items-start gap-8">
            <p className="max-w-[644px] text-base leading-[1.41] text-cloud lg:text-lg">
              VICIAD was registered in Nigeria in by a group of highly seasoned Professionals. The
              common goal is to provide first class services to the engineering and construction
            </p>
            <PillButton href="#about">Learn More</PillButton>
          </div>
        </div>

        <div className="relative h-[320px] w-full overflow-hidden rounded-[32px] sm:h-[420px] lg:h-[595px]">
          <Image
            src="/images/our-story.png"
            alt="Concrete frame of a multi-storey VICIAD project under construction"
            fill
            sizes="(max-width: 1440px) 100vw, 1312px"
            className="object-cover"
          />
        </div>
      </Shell>
    </section>
  );
}
