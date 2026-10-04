import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LineButton } from "@/components/ui/line-button";
import { Shell } from "@/components/ui/shell";

/** The value statement: one two-part line and the case behind it. */
export function ValueStatement() {
  return (
    <section className="bg-white pb-20 pt-28 md:pb-24 md:pt-40">
      <Shell className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
        <Eyebrow className="md:col-span-3 md:pt-4">
          Who we are
        </Eyebrow>

        <div className="md:col-span-9">
          <RevealHeading className="type-h2 text-onyx">
            <span className="block">From the first feasibility study</span>
            <span className="block text-mist">to final commissioning.</span>
          </RevealHeading>

          <Reveal className="mt-12 grid gap-8 md:mt-16 md:grid-cols-9 md:gap-6">
            <p className="type-body text-stone md:col-span-5">
              We regularly handle projects from the initial feasibility phase right through to design,
              implementation and commissioning — or step in at any single stage of the cycle. We are
              completely independent of equipment suppliers, so the solutions we bring to your design and
              project management requirements are unbiased.
            </p>
            <div className="flex items-end md:col-span-3 md:col-start-7">
              <LineButton href="/about" tone="dark">
                About VICIAD
              </LineButton>
            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
