import { BlueprintHero } from "@/components/hero/blueprint-hero";
import { Faq } from "@/components/home/faq";
import { OurStory } from "@/components/home/our-story";
import { Partners } from "@/components/home/partners";
import { SectorsScroller } from "@/components/home/sectors-scroller";
import { ServicesGrid } from "@/components/home/services-grid";
import { StatsShowcase } from "@/components/home/stats-showcase";
import { ValueStatement } from "@/components/home/value-statement";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";

/*
 * The redesigned home page. News is left out until there is content for it;
 * the closing call to action is the top of the shared footer.
 */
export default function Home() {
  return (
    <div className="relative">
      <SmoothScroll />
      <TopNav introHidden />
      <main>
        <BlueprintHero />
        <ValueStatement />
        <StatsShowcase />
        <ServicesGrid />
        <OurStory />
        <SectorsScroller />
        <Partners />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}
