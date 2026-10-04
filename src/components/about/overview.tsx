import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { CountUp } from "@/components/ui/count-up";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LineButton } from "@/components/ui/line-button";
import { Shell } from "@/components/ui/shell";
import { STATS } from "@/lib/content";

/** 01 — who VICIAD is, the three figures, and a wide site photograph. */
export function AboutOverview() {
  return (
    <section className="bg-white py-28 md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow index="01" className="md:col-span-3 md:pt-4">
            Overview
          </Eyebrow>
          <div className="md:col-span-9">
            <RevealHeading className="type-h2 text-onyx">
              <span className="block">Independent of suppliers.</span>
              <span className="block text-mist">Unbiased by design.</span>
            </RevealHeading>

            <Reveal className="mt-12 grid gap-8 md:mt-16 md:grid-cols-9 md:gap-6">
              <p className="type-body text-stone md:col-span-5">
                We are completely independent of equipment suppliers, welcomed by clients who seek
                unbiased solutions for their diverse design and project management requirements. Our
                resources are structured to provide a complete, quality-assured service capable of
                satisfying the most stringent requirements of our clients, enabling them to retain our
                services with complete confidence.
              </p>
              <div className="flex items-end md:col-span-3 md:col-start-7">
                <LineButton href="/services" tone="dark">
                  Our services
                </LineButton>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-20 md:mt-28">
          <dl className="grid gap-10 sm:grid-cols-3 sm:gap-6">
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} className="flex flex-col-reverse gap-4 border-t border-onyx pt-6">
                <dt className="type-body text-stone">{label}</dt>
                <dd className="type-stat text-onyx">
                  <CountUp to={value} suffix={suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-20 md:mt-28">
          <ParallaxImage
            src="/images/about/overview.png"
            alt="VICIAD engineers setting out reinforcement on site"
            className="aspect-[4/3] rounded-md md:aspect-[21/9]"
          />
        </Reveal>
      </Shell>
    </section>
  );
}
