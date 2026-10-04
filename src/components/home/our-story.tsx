import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { WaterLensImage } from "@/components/motion/water-lens-image";
import { Shell } from "@/components/ui/shell";

const reasons = [
  {
    title: "On time, by design",
    body: "Completion on time is a foremost objective. We set a realistic plan with targets for work accomplishment, report status and progress at every interval, and detect deviations early enough for preventative action.",
  },
  {
    title: "Quality assured",
    body: "Our resources are structured to provide a complete, quality-assured service capable of satisfying the most stringent requirements of our clients — enabling them to retain us with complete confidence.",
  },
  {
    title: "Independent advice",
    body: "We are completely independent of equipment suppliers, which is why clients who need unbiased solutions for their design and project management requirements come to us.",
  },
];

/**
 * Our story: who founded VICIAD and why, the crane photograph in full (with
 * its water-glass lens), then the three things clients rely on us for.
 */
export function OurStory() {
  return (
    <section className="bg-white py-28 md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:items-end md:gap-x-6">
          <RevealHeading className="type-h2 text-onyx md:col-span-5">Our Story</RevealHeading>
          <Reveal className="md:col-span-6 md:col-start-7">
            <p className="type-body max-w-xl text-stone">
              VICIAD was registered in Nigeria by a group of highly seasoned professionals. The common goal
              is to provide first-class services to the engineering and construction industry.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-16 md:mt-24">
          <WaterLensImage
            src="/images/construction-site.jpg"
            reveal="/images/construction-site-lines.webp"
            alt="Tower cranes above a high-rise frame under construction"
            drift={false}
            className="aspect-[3/2] rounded-md"
          />
        </Reveal>

        <Reveal stagger={0.12} className="mt-20 grid gap-12 md:mt-28 md:grid-cols-3 md:gap-6">
          {reasons.map(({ title, body }, index) => (
            <article key={title} className="border-t border-onyx pt-6">
              <p className="type-eyebrow text-stone">({String(index + 1).padStart(2, "0")})</p>
              <h3 className="type-h3 mt-8 text-onyx">{title}</h3>
              <p className="type-body mt-4 max-w-sm text-stone">{body}</p>
            </article>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}
