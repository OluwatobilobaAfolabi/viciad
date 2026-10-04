import type { Metadata } from "next";

import { AboutExpertise } from "@/components/about/expertise";
import { AboutOverview } from "@/components/about/overview";
import { AboutPurpose } from "@/components/about/purpose";
import { AboutTeam } from "@/components/about/team";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PageHero } from "@/components/page/page-hero";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Providing first-class services to the engineering and construction industry — VICIAD's overview, mission, vision, expertise and team.",
};

export default function AboutPage() {
  return (
    <>
      <SmoothScroll />
      <TopNav />
      <main>
        <PageHero
          title={
            <>
              <span className="block">First-class services</span>
              <span className="block text-white/55">for engineering &amp; construction.</span>
            </>
          }
          lead="Providing first-class services to the engineering and construction industry — from the initial feasibility phase right through to commissioning."
          image="/images/about/hero-video-poster.jpg"
          video="/images/about/about%20us%20video.mp4"
          alt="Steel fixers tying reinforcement cages on a VICIAD site"
          position="50% 38%"
        />
        <AboutOverview />
        <AboutPurpose />
        <AboutExpertise />
        <AboutTeam />
      </main>
      <SiteFooter />
    </>
  );
}
