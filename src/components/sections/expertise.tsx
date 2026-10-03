import Image from "next/image";

import { GlassPanel } from "@/components/ui/glass-panel";
import { PillButton } from "@/components/ui/pill-button";
import { Shell } from "@/components/ui/shell";

const areas = [
  {
    title: "Civil Construction",
    description:
      "Conceptual and detailed engineering, project management, installation and commissioning.",
    image: "/images/expertise/civil-construction.jpg",
    alt: "Aerial view of a reinforced concrete slab under construction",
  },
  {
    title: "Road & Bridge Construction",
    description:
      "Each area has its own manager responsible for the normal operation of that section.",
    image: "/images/expertise/road-bridge-construction.jpg",
    alt: "Bridge deck resting on its concrete piers",
  },
  {
    title: "Foundation Construction",
    description:
      "A flexible and responsive service wherever it is required, using the best available technical skills.",
    image: "/images/expertise/foundation-construction.jpg",
    alt: "Excavated foundation with blinding and rebar being laid",
  },
];

export function Expertise() {
  return (
    <section className="bg-ink py-16 lg:py-[104px]">
      <Shell className="flex flex-col items-start gap-10 lg:gap-16">
        <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row">
          <h2 className="font-display text-[40px] font-semibold leading-[1.06] tracking-[-1.48px] text-cloud sm:text-[56px] lg:whitespace-nowrap lg:text-[74px]">
            Our Expertise
          </h2>

          <div className="flex flex-col items-start gap-8">
            <p className="max-w-[644px] text-base leading-[1.41] text-cloud lg:text-lg">
              Viciad offers conceptual / detailed engineering, project management, installation and
              commissioning services. Each area has its own manager responsible for its operation.
            </p>
            <PillButton href="/services">Learn More</PillButton>
          </div>
        </div>

        <ol className="grid w-full gap-6 lg:grid-cols-3">
          {areas.map(({ title, description, image, alt }, index) => (
            <li key={title} className="flex">
              <GlassPanel className="flex w-full flex-col gap-4 p-8">
                <div className="relative h-[241px] w-full shrink-0 overflow-hidden rounded-lg bg-placeholder">
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 357px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col gap-[17px]">
                  <p className="font-label text-sm font-bold leading-[1.06] tracking-[-0.28px] text-white">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-[28px] font-medium leading-[1.06] tracking-[-0.64px] text-cloud lg:text-[32px]">
                    {title}
                  </h3>
                  <p className="text-base leading-[1.41] text-cloud lg:text-lg">{description}</p>
                </div>
              </GlassPanel>
            </li>
          ))}
        </ol>
      </Shell>
    </section>
  );
}
