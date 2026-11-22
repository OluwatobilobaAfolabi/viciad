import type { Metadata } from "next";

import { ProjectViewer } from "@/components/gallery/project-viewer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PageHero } from "@/components/page/page-hero";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";
import { createBreadcrumbSchema, JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Civil Construction & Marine Jetty Projects | VICIAD",
  description:
    "Explore VICIAD's work on site: shoreline earthworks, offshore loading jetties, bridge decks, and pipeline foundations across Nigeria. View our photo gallery.",
  alternates: {
    canonical: "https://www.viciad.org/gallery",
  },
  openGraph: {
    title: "Civil Construction & Marine Jetty Projects | VICIAD",
    description:
      "Explore VICIAD's work on site: shoreline earthworks, offshore loading jetties, bridge decks, and pipeline foundations across Nigeria. View our photo gallery.",
    url: "https://www.viciad.org/gallery",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "VICIAD Projects Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Civil Construction & Marine Jetty Projects | VICIAD",
    description:
      "Explore VICIAD's work on site: shoreline earthworks, offshore loading jetties, bridge decks, and pipeline foundations across Nigeria. View our photo gallery.",
    images: ["/og-image.jpg"],
  },
};

const breadcrumbs = createBreadcrumbSchema([
  { name: "Home", url: "https://www.viciad.org" },
  { name: "Gallery", url: "https://www.viciad.org/gallery" },
]);

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
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
          cta={{ href: "/contact", label: "Start a project" }}
        />
        <ProjectViewer />
      </main>
      <SiteFooter />
    </>
  );
}
