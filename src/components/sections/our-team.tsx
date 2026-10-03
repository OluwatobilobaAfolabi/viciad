import Image from "next/image";

import { Shell } from "@/components/ui/shell";

export function OurTeam() {
  return (
    <section className="bg-white py-16 lg:py-[104px]">
      <Shell className="flex flex-col items-center gap-10 lg:gap-16">
        <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row">
          <h2 className="font-display text-[40px] font-semibold leading-[1.06] tracking-[-1.48px] text-black sm:text-[56px] lg:whitespace-nowrap lg:text-[74px]">
            Our Team
          </h2>
          <p className="max-w-[644px] text-base leading-[1.41] text-black lg:text-lg">
            Professional integrity in the workplace and on project sites has a powerful impact on
            our productivity, performance and reputation. Every team member is encouraged to build
            personal character on integrity, a culture we have created throughout the entire
            organisation.
          </p>
        </div>

        <div className="relative h-[320px] w-full overflow-hidden rounded-[32px] sm:h-[420px] lg:h-[595px]">
          <Image
            src="/images/about/our-team.png"
            alt="The VICIAD team joining hands over a meeting table"
            fill
            sizes="(max-width: 1440px) 100vw, 1312px"
            className="object-cover object-top"
          />
        </div>
      </Shell>
    </section>
  );
}
