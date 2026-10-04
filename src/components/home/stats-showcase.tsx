import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/ui/count-up";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Shell } from "@/components/ui/shell";
import { STATS } from "@/lib/content";

import { RotatingPhotos } from "./rotating-photos";

/** The three headline figures beside rotating site photography. */
export function StatsShowcase() {
  return (
    <section className="bg-white pb-28 md:pb-40">
      <Shell className="grid gap-14 border-t border-ash pt-14 md:grid-cols-12 md:gap-6 md:pt-20">
        <div className="flex flex-col justify-between gap-12 md:col-span-7">
          <Eyebrow>In numbers</Eyebrow>
          <Reveal stagger={0.12}>
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
        </div>
        <Reveal className="md:col-span-4 md:col-start-9">
          <RotatingPhotos />
        </Reveal>
      </Shell>
    </section>
  );
}
