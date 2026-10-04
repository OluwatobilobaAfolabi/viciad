import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Shell } from "@/components/ui/shell";

/** 04 — the team and the culture of integrity behind it. */
export function AboutTeam() {
  return (
    <section className="bg-white py-28 md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow index="04" className="md:col-span-3 md:pt-4">
            Our team
          </Eyebrow>
          <div className="md:col-span-9">
            <RevealHeading className="type-h2 text-onyx">
              <span className="block">Integrity, in the office</span>
              <span className="block text-mist">and on every site.</span>
            </RevealHeading>
            <Reveal className="mt-12 md:mt-16">
              <p className="type-body max-w-xl text-stone">
                Professional integrity in the workplace and on project sites has a powerful impact on our
                productivity, performance and reputation. Every team member is encouraged to build personal
                character on integrity, a culture we have created throughout the entire organisation.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-20 md:mt-28">
          <ParallaxImage
            src="/images/about/our-team.png"
            alt="The VICIAD team joining hands over a meeting table"
            className="aspect-[4/3] rounded-md md:aspect-[21/9] [&_img]:object-[50%_20%]"
          />
        </Reveal>
      </Shell>
    </section>
  );
}
