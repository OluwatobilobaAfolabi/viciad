import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Shell } from "@/components/ui/shell";

const partners = [
  { name: "Northwest Petroleum and Gas Company", src: "/images/partners/northwest.png" },
  { name: "Aiteo", src: "/images/partners/aiteo.png" },
  { name: "Lagos State Tourism", src: "/images/partners/lagos-tourism.png" },
  { name: "Wabeco", src: "/images/partners/wabeco.png" },
];

/** 08 — the clients on record, quiet in greyscale until hovered. */
export function Partners() {
  return (
    <section className="bg-white pb-28 md:pb-40">
      <Shell className="grid items-center gap-10 border-y border-ash py-12 md:grid-cols-12 md:gap-6 md:py-14">
        <p className="type-body text-stone md:col-span-4">
          Trusted by organisations and individuals across the country.
        </p>
        <Reveal stagger={0.08} className="grid grid-cols-2 items-center gap-8 sm:grid-cols-4 md:col-span-7 md:col-start-6">
          {partners.map(({ name, src }) => (
            // The reveal animates the outer box; the hover styles live on the
            // inner one so a CSS opacity transition never fights the tween.
            <div key={name}>
              <div className="relative h-16 opacity-60 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0">
                <Image src={src} alt={name} fill sizes="160px" className="object-contain mix-blend-multiply" />
              </div>
            </div>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}
