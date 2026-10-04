import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Shell } from "@/components/ui/shell";
import { SERVICES } from "@/lib/content";

/** The six services as an index: number, name, what it covers. */
export function ServiceList() {
  return (
    <section className="bg-white py-28 md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow className="md:col-span-3 md:pt-4">
            What we do
          </Eyebrow>
          <div className="md:col-span-9">
            <RevealHeading className="type-h2 text-onyx">
              <span className="block">Six services,</span>
              <span className="block text-mist">any stage of the cycle.</span>
            </RevealHeading>
            <Reveal className="mt-12 md:mt-16">
              <p className="type-body max-w-xl text-stone">
                We regularly handle projects from the initial feasibility phase right through to design,
                implementation and commissioning — or step in at any single stage of the cycle, according to
                your requirements.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal stagger={0.06} className="mt-16 border-b border-ash md:mt-24">
          {SERVICES.map(({ title, body }, index) => (
            <article
              key={title}
              className="group grid gap-3 border-t border-ash py-8 transition-colors duration-500 hover:border-onyx md:grid-cols-12 md:items-baseline md:gap-6 md:py-10"
            >
              <span className="type-eyebrow text-stone transition-colors duration-500 group-hover:text-brand md:col-span-3">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-headline text-[clamp(1.75rem,3.2vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-onyx transition-transform duration-500 ease-out [font-stretch:86%] md:col-span-5 md:group-hover:translate-x-3">
                {title}
              </h3>
              <p className="type-body text-stone md:col-span-4">{body}</p>
            </article>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}
