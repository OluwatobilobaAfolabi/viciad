import type { Metadata } from "next";

import { Completion } from "@/components/sections/completion";
import { OurApproach } from "@/components/sections/our-approach";
import { ServicesHero } from "@/components/sections/services-hero";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Feasibility, design and commissioning — VICIAD handles projects from the initial feasibility phase through to commissioning, or steps in at any single stage of the cycle.",
};

export default function ServicesPage() {
  return (
    <div className="relative">
      <TopNav />
      <main>
        <ServicesHero />
        <OurApproach />
        <Completion />
      </main>
      <SiteFooter />
    </div>
  );
}
