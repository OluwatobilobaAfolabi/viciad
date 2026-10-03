import { BlueprintHero } from "@/components/hero/blueprint-hero";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";

/*
 * Phase 2 of the redesign: the blueprint hero on its own. The remaining home
 * sections are rebuilt in the new visual system in Phase 4; the previous
 * versions are still in src/components/sections until then.
 */
export default function Home() {
  return (
    <div className="relative">
      <SmoothScroll />
      <TopNav introHidden />
      <main>
        <BlueprintHero />
      </main>
      <SiteFooter />
    </div>
  );
}
