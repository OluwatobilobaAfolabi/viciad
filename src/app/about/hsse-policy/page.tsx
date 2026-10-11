import type { Metadata } from "next";

import { HsseAim, HsseCoreStandards, HsseFurtherStandards, HssePolicyStatement } from "@/components/hsse/hsse-sections";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PageHero } from "@/components/page/page-hero";
import { SiteFooter } from "@/components/sections/site-footer";
import { TopNav } from "@/components/sections/top-nav";

export const metadata: Metadata = {
  title: "HSSE Policy",
  description:
    "VICIAD's health, safety, security and environment policy: quality-assured engineering built on ISO 9001, ISO 14001 and ISO 45001.",
};

export default function HssePolicyPage() {
  return (
    <>
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
