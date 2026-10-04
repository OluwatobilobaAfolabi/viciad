import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { Eyebrow, Placeholder } from "@/components/ui/eyebrow";
import { Shell } from "@/components/ui/shell";

/**
 * Testimonials. There are none on record yet, so these are marked
 * placeholders: nothing here should be filled with invented quotes.
 */
export function Testimonials() {
  return (
    <section className="bg-white py-28 md:py-40">
      <Shell>
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
          <Eyebrow className="md:col-span-3 md:pt-4">
            Client voices
          </Eyebrow>
          <RevealHeading className="type-h2 text-onyx md:col-span-9">
            <span className="block">In our clients&rsquo; words.</span>
          </RevealHeading>
        </div>

        <Reveal stagger={0.1} className="mt-16 grid gap-4 md:mt-24 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <figure
              key={n}
              className="flex min-h-[18rem] flex-col justify-between gap-10 rounded-md border border-dashed border-ash p-7 md:p-8"
            >
              <blockquote className="type-h3 text-stone">
                <span aria-hidden className="mr-1 text-brand">
                  &ldquo;
                </span>
                <Placeholder>client testimonial {n}</Placeholder>
              </blockquote>
              <figcaption className="border-t border-ash pt-5 font-sans text-sm text-stone">
                <Placeholder>name, role, company</Placeholder>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}
