import Link from "next/link";

import { ViciadWordmark } from "@/components/brand/viciad-wordmark";
import { FooterRule } from "@/components/decor/dashed-rules";
import { PillButton } from "@/components/ui/pill-button";
import { Shell } from "@/components/ui/shell";
import { siteLinks } from "@/lib/nav";

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-ink">
      <Shell className="pb-16 pt-16 lg:pb-[56px] lg:pt-[104px]">
        <div className="flex flex-col items-start gap-8 border-b-2 border-dashed border-hairline-dark pb-8 lg:flex-row lg:items-end lg:gap-[25px]">
          <h2 className="font-display text-[32px] font-semibold leading-[1.41] text-white sm:text-[48px] lg:min-w-0 lg:flex-1 lg:text-[74px]">
            What are you waiting for?
            <br />
            Let&rsquo;s talk about your project.
          </h2>
          <PillButton href="mailto:info@viciad.com">Get in Touch</PillButton>
        </div>

        <div className="flex flex-col gap-10 pt-10 lg:flex-row lg:gap-[317px] lg:pt-[61px]">
          <ViciadWordmark className="h-8 w-[144.285px] shrink-0 text-white" />

          <nav className="flex flex-col gap-6 leading-[1.41] text-white">
            <h3 className="font-display text-[20px] font-semibold">Quick Links</h3>
            <ul className="flex flex-col gap-3 whitespace-nowrap text-base font-medium leading-[1.41]">
              {siteLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-brand">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-6 leading-[1.41] text-white lg:w-[421px]">
            <h3 className="font-display text-[20px] font-semibold">Contact Us</h3>
            <div className="flex flex-col gap-3 text-base font-medium leading-[1.41]">
              <a href="mailto:info@viciad.com" className="transition-colors hover:text-brand">
                info@viciad.com
              </a>
              <p>Plot 7 Agbada 2 Shell Location Road, Off Airport Road, Rivers State</p>
              <p>
                <a href="tel:08075420004" className="transition-colors hover:text-brand">
                  08075420004
                </a>
                {", "}
                <a href="tel:08075422777" className="transition-colors hover:text-brand">
                  08075422777
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-16 lg:pt-[66px]">
          <FooterRule />
          <p className="w-full text-center text-base font-medium leading-[1.41] text-white">
            © 2024 Viciad Engineering &amp; Construction. All rights reserved
          </p>
        </div>
      </Shell>
    </footer>
  );
}
