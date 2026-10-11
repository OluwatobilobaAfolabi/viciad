import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Shell } from "@/components/ui/shell";

/**
 * VICIAD's HSSE policy, from the company's own policy document (lightly
 * copy-edited). The focus line under each core standard is that standard's
 * official subject.
 */
const CORE = [
  {
    code: "ISO 9001",
    focus: "Quality management",
    body: "Standardises site processes to prevent structural defects, control material variations, reduce expensive rework and enforce consistent project delivery.",
  },
  {
    code: "ISO 14001",
    focus: "Environmental management",
    body: "Establishes strict guidelines for construction waste reduction, environmental risk assessments, site erosion control and carbon-footprint reduction.",
  },
  {
    code: "ISO 45001",
    focus: "Occupational health & safety",
    body: "Addresses how we deal with heavy-equipment safety, hazard identification, proper scaffolding and excavation safety protocols, and field incident reporting to protect site labour.",
  },
];

const FURTHER = [
  {
    code: "ISO 21931-2",
    title:
      "Sustainability in buildings and civil engineering works — framework for assessing the environmental performance of civil engineering works.",
  },
  // TODO(client): confirm this standard's number; no ISO 67007-01 could be found.
  { code: "ISO 67007-01", title: null },
];

/** The policy statement: what the standards are for. */
export function HssePolicyStatement() {
  return (
    <section className="bg-white py-28 md:py-40">
      <Shell className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
        <Eyebrow className="md:col-span-3 md:pt-4">Policy statement</Eyebrow>
        <div className="md:col-span-9">
          <RevealHeading className="type-h2 text-onyx">
            <span className="block">Quality-assured,</span>
            <span className="block text-mist">by recognised standards.</span>
          </RevealHeading>
          <Reveal className="mt-12 md:mt-16">
            <p className="type-body max-w-2xl text-stone">
              As part of VICIAD&rsquo;s mission to provide quality-assured engineering that meets the most stringent
              requirements, we adhere to a number of recognised standards. The foundation of all the work we do is
              built on three of them.
            </p>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}

/** The three core standards, set large on black. */
export function HsseCoreStandards() {
  return (
    <section className="bg-onyx py-28 text-white md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow tone="light" className="md:col-span-3 md:pt-4">
            The foundation
          </Eyebrow>
          <RevealHeading className="type-h2 md:col-span-9">
            <span className="block">Three standards</span>
            <span className="block text-mist">behind every project.</span>
          </RevealHeading>
        </div>

        <Reveal stagger={0.1} className="mt-16 grid gap-4 md:mt-24 lg:grid-cols-3">
          {CORE.map(({ code, focus, body }) => (
            <article
              key={code}
              className="flex flex-col justify-between gap-16 rounded-md border border-white/12 bg-graphite p-8 md:p-10"
            >
              <div>
                <p className="type-eyebrow text-brand">{focus}</p>
                <h3 className="mt-6 font-headline text-[clamp(2.6rem,4.4vw,4rem)] font-bold leading-none tracking-[-0.04em] [font-stretch:80%]">
                  {code}
                </h3>
              </div>
              <p className="type-body text-mist">{body}</p>
            </article>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/** The two further standards. */
export function HsseFurtherStandards() {
  return (
    <section className="bg-paper py-28 md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow className="md:col-span-3 md:pt-4">Going further</Eyebrow>
          <div className="md:col-span-9">
            <RevealHeading className="type-h2 text-onyx">
              <span className="block">A step further,</span>
              <span className="block text-stone">for our clients.</span>
            </RevealHeading>
            <Reveal className="mt-12 md:mt-16">
              <p className="type-body max-w-2xl text-stone">
                We take it a step further to provide the best care to our clients by also adhering to:
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal stagger={0.1} className="mt-16 border-b border-onyx/15 md:mt-24">
          {FURTHER.map(({ code, title }) => (
            <div
              key={code}
              className="grid gap-3 border-t border-onyx/15 py-8 md:grid-cols-12 md:items-baseline md:gap-6 md:py-10"
            >
              <h3 className="font-headline text-[clamp(1.9rem,3.2vw,3rem)] font-bold leading-none tracking-[-0.035em] text-onyx [font-stretch:82%] md:col-span-5">
                {code}
              </h3>
              {title ? <p className="type-body text-stone md:col-span-7">{title}</p> : null}
            </div>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}

/** The aim, set as the policy's closing line. */
export function HsseAim() {
  return (
    <section className="bg-white py-28 md:py-40">
      <Shell className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
        <Eyebrow className="md:col-span-3 md:pt-4">Our aim</Eyebrow>
        <Reveal className="md:col-span-9">
          <blockquote>
            <p className="font-headline text-[clamp(1.9rem,3.6vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-onyx [font-stretch:88%]">
              To build engineering structures that stand the test of time while protecting not just our workers but
              also the environment
              <span className="text-mist"> — creating long-lasting engineering marvels with no adverse long-term impact.</span>
            </p>
          </blockquote>
        </Reveal>
      </Shell>
    </section>
  );
}
