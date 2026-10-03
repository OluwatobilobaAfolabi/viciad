import type { Metadata } from "next";

import { GalleryHero } from "@/components/sections/gallery-hero";
import { GalleryShowcase } from "@/components/sections/gallery-showcase";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Some of VICIAD's ongoing and completed engineering and construction projects.",
};

export default function GalleryPage() {
  return (
    <div className="relative">
      <TopNav />
      <main>
        <GalleryHero />
        <GalleryShowcase />
      </main>
      <SiteFooter />
    </div>
  );
}
