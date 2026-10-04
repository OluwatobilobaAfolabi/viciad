import type { Metadata } from "next";

import { ProjectViewer } from "@/components/gallery/project-viewer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PageHero } from "@/components/page/page-hero";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Some of VICIAD's ongoing and completed engineering and construction projects.",
};

export default function GalleryPage() {
  return (
    <>
      <SmoothScroll />
      <TopNav />
      <main>
        <PageHero
          title={
            <>
              <span className="block">Some of our ongoing</span>
              <span className="block text-white/55">and completed projects.</span>
            </>
          }
          lead="A look at the work on site — from the earthworks and foundations to the jetty and the pipeline."
          image="/images/gallery/hero-video-poster.jpg"
          video="/images/gallery/gallery%20hero%20video.mp4"
          alt="A gallery of black-and-white construction photographs, with visitors walking through"
          position="50% 50%"
          cta={{ href: "#contact", label: "Start a project" }}
        />
        <ProjectViewer />
      </main>
      <SiteFooter index="02" />
    </>
  );
}
