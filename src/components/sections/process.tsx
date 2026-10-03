import { PillButton } from "@/components/ui/pill-button";
import { Shell } from "@/components/ui/shell";

const steps = [
  {
    title: "Feasibility & Strategy Studies",
    description:
      "Conducting feasibility and strategy studies to assess the viability and optimal direction of a project.",
  },
  {
    title: "Detail Design Engineering",
    description:
      "Comprehensive, precise plans and specifications for the implementation of a project.",
  },
  {
    title: "Project Management",
    description:
      "Planning, organization and execution of tasks and resources to achieve project goals.",
  },
  {
    title: "Hook-up & Commissioning Support",
    description:
      "Final installation, connection, testing and activation of equipment and systems to ensure they function correctly.",
  },
  {
    title: "Tenders & Contract Drafting",
    description:
      "Creation and submission of competitive bids, and the development of legally binding agreements that outline the terms and conditions of a project.",
  },
  {
    title: "Operational Training",
    description:
      "Instruction and guidance to personnel on the proper use and maintenance of equipment and systems to ensure efficient and safe operation.",
  },
];

export function Process() {
  return (
    <section id="services" className="bg-white py-16 lg:py-[104px]">
      <Shell className="flex flex-col items-start gap-10 lg:gap-16">
        <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row">
          <h2 className="font-display text-[40px] font-semibold leading-[1.41] text-black sm:text-[56px] lg:w-[533px] lg:text-[74px]">
            How We Make It Happen
          </h2>

          <div className="flex flex-col items-start gap-8">
            <p className="max-w-[644px] text-base leading-[1.41] text-black lg:text-lg">
              We regularly handle projects from the initial feasibility phase right through to
              design, implementation and commissioning — or provide assistance at a particular stage
              of the project cycle according to your requirements.
            </p>
            <PillButton href="/services">Our Services</PillButton>
          </div>
        </div>

        <ol className="flex w-full flex-col gap-[22px] text-black">
          {steps.map(({ title, description }, index) => (
            <li
              key={title}
              className="flex flex-col gap-4 border-t-2 border-dashed border-hairline py-8 lg:flex-row lg:items-center lg:gap-6"
            >
              <span className="font-display text-[24px] font-semibold leading-[1.06] tracking-[-0.48px]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[22px] font-semibold leading-[1.06] tracking-[-0.56px] lg:min-w-0 lg:flex-1 lg:text-[28px]">
                {title}
              </h3>
              <p className="text-base leading-[1.41] lg:min-w-0 lg:flex-1 lg:text-lg">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </Shell>
    </section>
  );
}
