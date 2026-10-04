import type { Metadata } from "next";

import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PageHero } from "@/components/page/page-hero";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";
import { Approach } from "@/components/services/approach";
import { CapabilityMarquee } from "@/components/services/capability-marquee";
import { Delivery } from "@/components/services/delivery";
import { ServiceList } from "@/components/services/service-list";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Feasibility, design and commissioning — VICIAD handles projects from the initial feasibility phase through to commissioning, or steps in at any single stage of the cycle.",
};

export default function ServicesPage() {
  return (
    <>
      <SmoothScroll />
      <TopNav />
      <main>
        <PageHero
          title={
            <>
              <span className="block">Feasibility. Design.</span>
              <span className="block text-white/55">Commissioning.</span>
            </>
          }
          lead="We regularly handle projects from the initial feasibility phase right through to design, implementation and commissioning — or step in at any single stage of the cycle."
          image="/images/services/hero.jpg"
          alt="Steelwork rising against the sky on a VICIAD project"
          position="50% 36%"
        >
          <CapabilityMarquee />
        </PageHero>
        <ServiceList />
        <Approach />
        <Delivery />
      </main>
      <SiteFooter index="04" />
    </>
  );
}
