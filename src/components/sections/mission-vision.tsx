import Image from "next/image";

import { Shell } from "@/components/ui/shell";

const pillars = [
  {
    title: "Mission",
    body: "To provide quality-assured engineering services capable of satisfying the most stringent requirements of our clients using the best available technical skills.",
    image: "/images/about/mission.jpg",
    alt: "A dart in the bullseye of a target",
  },
  {
    title: "Vision",
    body: "To provide quality engineering and construction services.",
    image: "/images/about/vision.jpg",
    alt: "A hand holding up a lightbulb against a pastel sky",
  },
];

export function MissionVision() {
  return (
    <section className="bg-white py-16 lg:py-[104px]">
      <Shell className="grid gap-10 lg:grid-cols-2 lg:gap-6">
        {pillars.map(({ title, body, image, alt }) => (
          <div key={title} className="flex flex-col gap-8">
            {/* The violet card sits 19px proud of the photo at the bottom. */}
            <div className="relative aspect-[644/524] w-full rounded-[32px] bg-brand">
              <div className="absolute inset-x-0 top-0 h-[96.374%] overflow-hidden rounded-[32px] bg-placeholder">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 644px"
                  className="object-cover"
                />
              </div>
            </div>

            <h2 className="font-display text-[40px] font-semibold leading-[1.06] tracking-[-1.48px] text-black sm:text-[56px] lg:text-[74px]">
              {title}
            </h2>
            <p className="text-base leading-[1.41] text-black lg:text-lg">{body}</p>
          </div>
        ))}
      </Shell>
    </section>
  );
}
