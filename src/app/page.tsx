import { GalleryBand } from "@/components/sections/gallery-band";
import { Hero } from "@/components/sections/hero";
import { OurStory } from "@/components/sections/our-story";
import { Process } from "@/components/sections/process";
import { SiteFooter } from "@/components/sections/site-footer";
import { StatsBar } from "@/components/sections/stats-bar";
import { TopNav } from "@/components/sections/top-nav";
import { TrustedBy } from "@/components/sections/trusted-by";

export default function Home() {
  return (
    <div className="relative">
      <TopNav />
      <main>
        <Hero />
        <StatsBar />
        <GalleryBand />
        <OurStory />
        <Process />
        <TrustedBy />
      </main>
      <SiteFooter />
    </div>
  );
}
