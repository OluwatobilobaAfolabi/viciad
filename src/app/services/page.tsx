import type { Metadata } from "next";

import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PageHero } from "@/components/page/page-hero";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";
import { createBreadcrumbSchema, JsonLd } from "@/components/seo/json-ld";
import { Approach } from "@/components/services/approach";
import { CapabilityMarquee } from "@/components/services/capability-marquee";
import { Delivery } from "@/components/services/delivery";
import { ServiceList } from "@/components/services/service-list";

export const metadata: Metadata = {
  title: "Civil Construction & Engineering Services Nigeria | VICIAD",
  description:
    "Explore VICIAD's comprehensive services: civil works, road and bridge construction, foundation piling, project management, and commissioning support in Nigeria.",
  alternates: {
    canonical: "https://www.viciad.org/services",
  },
  openGraph: {
    title: "Civil Construction & Engineering Services Nigeria | VICIAD",
    description:
      "Explore VICIAD's comprehensive services: civil works, road and bridge construction, foundation piling, project management, and commissioning support in Nigeria.",
    url: "https://www.viciad.org/services",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "VICIAD Engineering Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Civil Construction & Engineering Services Nigeria | VICIAD",
    description:
      "Explore VICIAD's comprehensive services: civil works, road and bridge construction, foundation piling, project management, and commissioning support in Nigeria.",
    images: ["/og-image.jpg"],
  },
};

const breadcrumbs = createBreadcrumbSchema([
  { name: "Home", url: "https://www.viciad.org" },
  { name: "Services", url: "https://www.viciad.org/services" },
]);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <SmoothScroll />
      <TopNav />
      <main>
        <PageHero
          title={
            <>
              <span className="block">Feasibility. Design.</span>
              <span className="block text-white/55">Commissioning.</span>
            </>
          }
          lead="We regularly handle projects from the initial feasibility phase right through to design, implementation and commissioning — or step in at any single stage of the cycle."
          image="/images/services/hero.jpg"
          alt="Steelwork rising against the sky on a VICIAD project"
          position="50% 36%"
        >
          <CapabilityMarquee />
        </PageHero>
        <ServiceList />
        <Approach />
        <Delivery />
      </main>
      <SiteFooter />
    </>
  );
}
