import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
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

/** 05 — three reasons to rely on VICIAD, then a wide photograph. */
export function WhyUs() {
  return (
    <section className="bg-white py-28 md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow index="04" className="md:col-span-3 md:pt-4">
            Why VICIAD
          </Eyebrow>
          <RevealHeading className="type-h2 text-onyx md:col-span-9">
            <span className="block">Quality-assured.</span>
            <span className="block text-mist">Independent. On time.</span>
          </RevealHeading>
        </div>

        <Reveal stagger={0.12} className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-6">
          {reasons.map(({ title, body }, index) => (
            <article key={title} className="border-t border-onyx pt-6">
              <p className="type-eyebrow text-stone">({String(index + 1).padStart(2, "0")})</p>
              <h3 className="type-h3 mt-8 text-onyx">{title}</h3>
              <p className="type-body mt-4 max-w-sm text-stone">{body}</p>
            </article>
          ))}
        </Reveal>

        <Reveal className="mt-20 md:mt-28">
          <ParallaxImage
            src="/images/construction-site.jpg"
            alt="Tower cranes above a high-rise frame under construction"
            className="aspect-[4/3] rounded-md md:aspect-[21/9]"
          />
        </Reveal>
      </Shell>
    </section>
  );
}
