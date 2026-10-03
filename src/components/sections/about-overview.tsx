import Image from "next/image";

import { PillButton } from "@/components/ui/pill-button";
import { Shell } from "@/components/ui/shell";

export function AboutOverview() {
  return (
    <section className="bg-white py-16 lg:py-[104px]">
      <Shell className="flex flex-col items-center gap-10 lg:gap-16">
        <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row">
          <h2 className="font-display text-[40px] font-semibold leading-[1.06] tracking-[-1.48px] text-black sm:text-[56px] lg:w-[533px] lg:text-[74px]">
            Overview
          </h2>

          <div className="flex flex-col items-start gap-8">
            <p className="max-w-[644px] text-base leading-[1.41] text-black lg:text-lg">
              We are completely independent of equipment suppliers welcomed by clients who seek
              unbiased solutions for their diverse design and project management requirements. Our
              resources are structured to provide a complete, quality assured service capable of
              satisfying the most stringent requirements of our clients, enabling them to retain our
              services with complete confidence.
            </p>
            <PillButton href="/services">Our Services</PillButton>
          </div>
        </div>

        <div className="relative h-[320px] w-full overflow-hidden rounded-[32px] sm:h-[420px] lg:h-[595px]">
          <Image
            src="/images/about/overview.png"
            alt="VICIAD engineers setting out reinforcement on site"
            fill
            sizes="(max-width: 1440px) 100vw, 1312px"
            className="object-cover"
          />
        </div>
      </Shell>
    </section>
  );
}
