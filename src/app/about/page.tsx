import type { Metadata } from "next";

import { AboutHero } from "@/components/sections/about-hero";
import { AboutOverview } from "@/components/sections/about-overview";
import { Expertise } from "@/components/sections/expertise";
import { MissionVision } from "@/components/sections/mission-vision";
import { OurTeam } from "@/components/sections/our-team";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Providing first-class services to the engineering and construction industry — VICIAD's overview, mission, vision, expertise and team.",
};

export default function AboutPage() {
  return (
    <div className="relative">
      <TopNav />
      <main>
        <AboutHero />
        <AboutOverview />
        <MissionVision />
        <Expertise />
        <OurTeam />
      </main>
      <SiteFooter />
    </div>
  );
}
