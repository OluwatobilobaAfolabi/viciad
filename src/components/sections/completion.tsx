import { Fragment } from "react";

import { StatDivider } from "@/components/decor/dashed-rules";
import { PillButton } from "@/components/ui/pill-button";
import { Shell } from "@/components/ui/shell";

const promises = [
  "A realistic plan for timely execution, with targets set for work accomplishment.",
  "Accurate, timely reporting of status and progress at every interval.",
  "Exception reports highlighting areas of concern and critical activities.",
  "Early detection of deviations, so preventative action can be taken in time.",
];

export function Completion() {
  return (
    <section className="bg-white py-16 lg:py-[104px]">
      <Shell className="flex flex-col gap-10 lg:gap-16">
        <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row">
          <h2 className="font-display text-[40px] font-semibold leading-[1.06] tracking-[-1.48px] text-black sm:text-[56px] lg:w-[533px] lg:text-[74px]">
            Completion?
            <br />
            on Time.
          </h2>

          <div className="flex flex-col items-start gap-8">
            <p className="max-w-[644px] text-base leading-[1.41] text-black lg:text-lg">
              Completion of projects on time is a foremost objective. Our engineers work in both
              manual and computerised techniques to provide four things:
            </p>
            <PillButton href="#contact">Get in Touch</PillButton>
          </div>
        </div>

        <ol className="flex w-full flex-col items-stretch rounded-[20px] border border-hairline px-2 py-4 lg:flex-row lg:items-center lg:justify-between">
          {promises.map((promise, index) => (
            <Fragment key={promise}>
              {index > 0 ? <StatDivider className="hidden lg:flex" /> : null}
              <li className="flex flex-col gap-4 p-4 lg:w-[310px]">
                <p className="font-display text-xl leading-[1.06] tracking-[-0.4px] text-black">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <span aria-hidden className="h-1 w-[37px] rounded-[40px] bg-brand" />
                <p className="text-base leading-[1.41] text-black lg:text-lg">{promise}</p>
              </li>
            </Fragment>
          ))}
        </ol>
      </Shell>
    </section>
  );
}
