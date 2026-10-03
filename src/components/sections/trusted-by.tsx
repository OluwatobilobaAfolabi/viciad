import Image from "next/image";

import { Shell } from "@/components/ui/shell";
import { cn } from "@/lib/cn";

type Partner = {
  name: string;
  src: string;
  fit: "cover" | "contain";
  /** Some marks sit on their own brand colour in the design. */
  background?: string;
};

/** Ten of the fourteen slots are still empty placeholders in the design. */
const partners: (Partner | null)[] = [
  {
    name: "Northwest Petroleum and Gas Company",
    src: "/images/partners/northwest.png",
    fit: "cover",
  },
  { name: "Aiteo", src: "/images/partners/aiteo.png", fit: "contain" },
  { name: "Lagos State Tourism", src: "/images/partners/lagos-tourism.png", fit: "contain" },
  {
    name: "WABECO",
    src: "/images/partners/wabeco.png",
    fit: "contain",
    background: "bg-wabeco",
  },
  ...Array.from({ length: 10 }, () => null),
];

export function TrustedBy() {
  return (
    <section className="bg-white py-16 lg:py-[104px]">
      <Shell className="flex flex-col items-center gap-10 lg:gap-16">
        <h2 className="w-full font-display text-[40px] font-semibold leading-[1.41] text-black sm:text-[56px] lg:text-[74px]">
          Trusted by Organisations And Individuals Across The Country
        </h2>

        {/* 1096px keeps the design's seven marks per row. */}
        <ul className="mx-auto flex max-w-[1096px] flex-wrap justify-center gap-6">
          {partners.map((partner, index) => (
            <li
              key={partner?.name ?? `placeholder-${index}`}
              className={cn(
                "relative size-[136px] shrink-0 overflow-hidden rounded-full",
                partner?.background ?? (partner ? undefined : "bg-placeholder"),
              )}
            >
              {partner ? (
                <Image
                  src={partner.src}
                  alt={partner.name}
                  fill
                  sizes="136px"
                  className={partner.fit === "cover" ? "object-cover" : "object-contain"}
                />
              ) : null}
            </li>
          ))}
        </ul>
      </Shell>
    </section>
  );
}
