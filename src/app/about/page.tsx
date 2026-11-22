import type { Metadata } from "next";

import { AboutExpertise } from "@/components/about/expertise";
import { AboutOverview } from "@/components/about/overview";
import { AboutPurpose } from "@/components/about/purpose";
import { AboutTeam } from "@/components/about/team";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PageHero } from "@/components/page/page-hero";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";
import { createBreadcrumbSchema, JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About VICIAD – Independent Engineering Experts Nigeria",
  description:
    "Unbiased by design. VICIAD brings 10+ years of supplier-independent civil engineering and project management across Nigeria. Learn about our mission and team.",
  alternates: {
    canonical: "https://www.viciad.org/about",
  },
  openGraph: {
    title: "About VICIAD – Independent Engineering Experts Nigeria",
    description:
      "Unbiased by design. VICIAD brings 10+ years of supplier-independent civil engineering and project management across Nigeria. Learn about our mission and team.",
    url: "https://www.viciad.org/about",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "About VICIAD Engineering" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About VICIAD – Independent Engineering Experts Nigeria",
    description:
      "Unbiased by design. VICIAD brings 10+ years of supplier-independent civil engineering and project management across Nigeria. Learn about our mission and team.",
    images: ["/og-image.jpg"],
  },
};

const breadcrumbs = createBreadcrumbSchema([
  { name: "Home", url: "https://www.viciad.org" },
  { name: "About Us", url: "https://www.viciad.org/about" },
]);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
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
