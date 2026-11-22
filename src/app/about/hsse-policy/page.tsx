import type { Metadata } from "next";

import { HsseAim, HsseCoreStandards, HsseFurtherStandards, HssePolicyStatement } from "@/components/hsse/hsse-sections";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PageHero } from "@/components/page/page-hero";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";
import { createBreadcrumbSchema, JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "ISO 9001, 14001 & 45001 HSSE Standards Nigeria | VICIAD",
  description:
    "Safe sites, zero defects. VICIAD operates under rigorous ISO 9001, ISO 14001, and ISO 45001 standards to protect workers, structures, and Nigeria's environment.",
  alternates: {
    canonical: "https://www.viciad.org/about/hsse-policy",
  },
  openGraph: {
    title: "ISO 9001, 14001 & 45001 HSSE Standards Nigeria | VICIAD",
    description:
      "Safe sites, zero defects. VICIAD operates under rigorous ISO 9001, ISO 14001, and ISO 45001 standards to protect workers, structures, and Nigeria's environment.",
    url: "https://www.viciad.org/about/hsse-policy",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "VICIAD HSSE Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ISO 9001, 14001 & 45001 HSSE Standards Nigeria | VICIAD",
    description:
      "Safe sites, zero defects. VICIAD operates under rigorous ISO 9001, ISO 14001, and ISO 45001 standards to protect workers, structures, and Nigeria's environment.",
    images: ["/og-image.jpg"],
  },
};

const breadcrumbs = createBreadcrumbSchema([
  { name: "Home", url: "https://www.viciad.org" },
  { name: "About Us", url: "https://www.viciad.org/about" },
  { name: "HSSE Policy", url: "https://www.viciad.org/about/hsse-policy" },
]);

export default function HssePolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SmoothScroll />
      <TopNav />
      <main>
        <PageHero
          title={
            <>
              <span className="block">Health, Safety, Security</span>
              <span className="block text-white/55">&amp; Environment.</span>
            </>
          }
          lead="Protecting our people, our clients and the environment on every site — built on internationally recognised standards."
          image="/images/about/hsse-hero.webp"
          alt="A team in hard hats and high-visibility vests reviewing plans together on site, seen from above"
          position="28% 50%"
          cta={{ href: "/contact", label: "Talk with us" }}
        />
        <HssePolicyStatement />
        <HsseCoreStandards />
        <HsseFurtherStandards />
        <HsseAim />
      </main>
      <SiteFooter />
    </>
  );
}
