import { ApproachTabs } from "@/components/sections/approach-tabs";
import { Shell } from "@/components/ui/shell";

export function OurApproach() {
  return (
    <section id="approach" className="bg-ink py-16 lg:py-[104px]">
      <Shell>
        <h2 className="font-display text-[40px] font-semibold leading-[1.06] tracking-[-1.48px] text-white sm:text-[56px] lg:text-[74px]">
          Our Approach to Project Development, Engineering &amp; Management.
        </h2>
      </Shell>

      <div className="mt-10 lg:mt-16">
        <ApproachTabs />
      </div>
    </section>
  );
}
