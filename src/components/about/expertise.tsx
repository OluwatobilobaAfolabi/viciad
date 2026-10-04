import Image from "next/image";

import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LineButton } from "@/components/ui/line-button";
import { Shell } from "@/components/ui/shell";

const areas = [
  {
    title: "Civil Construction",
    body: "Conceptual and detailed engineering, project management, installation and commissioning.",
    image: "/images/expertise/civil-construction.jpg",
    alt: "Aerial view of a reinforced concrete slab under construction",
  },
  {
    title: "Road & Bridge Construction",
    body: "Each area has its own manager responsible for the normal operation of that section.",
    image: "/images/expertise/road-bridge-construction.jpg",
    alt: "Bridge deck resting on its concrete piers",
  },
  {
    title: "Foundation Construction",
    body: "A flexible and responsive service wherever it is required, using the best available technical skills.",
    image: "/images/expertise/foundation-construction.jpg",
    alt: "Excavated foundation with blinding and rebar being laid",
  },
];

/** The three areas of expertise, on black. */
export function AboutExpertise() {
  return (
    <section data-nav-tone="dark" className="bg-onyx py-28 text-white md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow tone="light" className="md:col-span-3 md:pt-4">
            Expertise
          </Eyebrow>
          <div className="md:col-span-9">
            <RevealHeading className="type-h2">
              <span className="block">Each area,</span>
              <span className="block text-mist">its own manager.</span>
            </RevealHeading>
            <Reveal className="mt-12 grid gap-8 md:mt-16 md:grid-cols-9 md:gap-6">
              <p className="type-body text-mist md:col-span-5">
                VICIAD offers conceptual and detailed engineering, project management, installation and
                commissioning services. Each area has its own manager, responsible for its operation.
              </p>
              <div className="flex items-end md:col-span-3 md:col-start-7">
                <LineButton href="/services">All services</LineButton>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal stagger={0.1} className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-6">
          {areas.map(({ title, body, image, alt }, index) => (
            <article key={title} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-graphite">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
                <span className="type-eyebrow text-brand">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="type-h3 mt-4">{title}</h3>
              <p className="type-body mt-3 max-w-sm text-mist">{body}</p>
            </article>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}
