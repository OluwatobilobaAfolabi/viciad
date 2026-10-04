import type { Metadata } from "next";

import { ContactDetails } from "@/components/contact/contact-details";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal, RevealHeading } from "@/components/motion/reveal";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PageHero } from "@/components/page/page-hero";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Shell } from "@/components/ui/shell";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to VICIAD about your engineering or construction project — email info@viciad.com, call 08075420004 or 08075422777, or visit us in Rivers State.",
};

export default function ContactPage() {
  return (
    <>
      <SmoothScroll />
      <TopNav />
      <main>
        <PageHero
          title={
            <>
              <span className="block">Let&rsquo;s talk about</span>
              <span className="block text-white/55">your project.</span>
            </>
          }
          lead="Whether it's a feasibility study, a single stage of the cycle or the whole project, tell us what you need and we'll get back to you."
          image="/images/about/overview.png"
          alt="VICIAD engineers setting out reinforcement on site"
          position="50% 40%"
          cta={{ href: "#message", label: "Send a message" }}
        />

        <section id="message" className="scroll-mt-28 bg-white py-28 md:py-40">
          <Shell>
            <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-6">
              <Eyebrow className="md:col-span-3 md:pt-4">Contact</Eyebrow>
              <RevealHeading className="type-h2 text-onyx md:col-span-9">
                <span className="block">Tell us what</span>
                <span className="block text-mist">you&rsquo;re building.</span>
              </RevealHeading>
            </div>

            <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-12 lg:gap-6">
              <Reveal className="lg:col-span-7">
                <ContactForm />
              </Reveal>
              <Reveal className="lg:col-span-4 lg:col-start-9">
                <ContactDetails />
              </Reveal>
            </div>
          </Shell>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
