import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
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

/** Mission and vision, each a single statement set large. */
export function AboutPurpose() {
  return (
    <section className="bg-paper py-28 md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow className="md:col-span-3 md:pt-4">
            Purpose
          </Eyebrow>
          <RevealHeading className="type-h2 text-onyx md:col-span-9">
            <span className="block">What we set out</span>
            <span className="block text-stone">to do, every time.</span>
          </RevealHeading>
        </div>

        <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-2 md:gap-6">
          {pillars.map(({ title, body, image, alt }, index) => (
            <Reveal key={title} delay={index * 0.12} className="flex flex-col">
              <ParallaxImage
                src={image}
                alt={alt}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="aspect-[4/3] rounded-md"
              />
              <div className="mt-8 flex items-center justify-between border-t border-onyx pt-5">
                <h3 className="type-eyebrow text-onyx">{title}</h3>
                <span className="type-eyebrow text-brand">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-6 max-w-xl font-headline text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.02em] text-onyx [font-stretch:92%]">
                {body}
              </p>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}
