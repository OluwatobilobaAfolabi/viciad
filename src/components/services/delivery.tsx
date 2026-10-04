import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LineButton } from "@/components/ui/line-button";
import { Shell } from "@/components/ui/shell";

const promises = [
  "A realistic plan for timely execution, with targets set for work accomplishment.",
  "Accurate, timely reporting of status and progress at every interval.",
  "Exception reports highlighting areas of concern and critical activities.",
  "Early detection of deviations, so preventative action can be taken in time.",
];

/** On-time completion and the four things that secure it. */
export function Delivery() {
  return (
    <section className="bg-paper py-28 md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow className="md:col-span-3 md:pt-4">
            Delivery
          </Eyebrow>
          <div className="md:col-span-9">
            <RevealHeading className="type-h2 text-onyx">
              <span className="block">Completion?</span>
              <span className="block text-stone">On time.</span>
            </RevealHeading>
            <Reveal className="mt-12 grid gap-8 md:mt-16 md:grid-cols-9 md:gap-6">
              <p className="type-body text-stone md:col-span-5">
                Completion of projects on time is a foremost objective. Our engineers work in both manual and
                computerised techniques to provide four things:
              </p>
              <div className="flex items-end md:col-span-3 md:col-start-7">
                <LineButton href="/contact" tone="dark">
                  Talk with us
                </LineButton>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <ol className="mt-16 grid gap-10 sm:grid-cols-2 md:mt-24 lg:grid-cols-4 lg:gap-6">
            {promises.map((promise, index) => (
              <li key={promise} className="flex flex-col gap-10 border-t border-onyx pt-6">
                <span className="type-stat text-onyx">{String(index + 1).padStart(2, "0")}</span>
                <p className="type-body max-w-xs text-stone">{promise}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Shell>
    </section>
  );
}
