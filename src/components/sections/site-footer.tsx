import Image from "next/image";
import Link from "next/link";

import { ViciadWordmark } from "@/components/brand/viciad-wordmark";
import { DotWordmark } from "@/components/decor/dot-wordmark";
import { RevealHeading } from "@/components/motion/reveal";
import { Eyebrow, Placeholder } from "@/components/ui/eyebrow";
import { LineButton } from "@/components/ui/line-button";
import { Shell } from "@/components/ui/shell";
import { COMPANY, CONTACT, SERVICES } from "@/lib/content";
import { siteLinks } from "@/lib/nav";

/**
 * The closing call to action and the full footer, shared by every page.
 * `#contact` lands here, so "Talk with us" / "Work with us" work everywhere.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const columnTitle = "type-eyebrow text-mist";
  const link = "w-fit font-sans text-[15px] text-white/80 transition-colors hover:text-white";

  return (
    <footer id="contact" data-nav-tone="dark" className="relative overflow-hidden bg-onyx text-white">
      {/* A faint echo of the hero drawing. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 hidden h-[44rem] w-[58%] opacity-[0.16] [mask-image:linear-gradient(to_left,#000_35%,transparent)] md:block"
      >
        <Image src="/hero/blueprint.jpg" alt="" fill unoptimized sizes="58vw" className="object-cover object-[72%_28%]" />
      </div>

      <Shell className="relative">
        <div className="py-28 md:py-40">
          <Eyebrow tone="light">
            Start a project
          </Eyebrow>
          <RevealHeading className="type-display mt-10 max-w-5xl">
            <span className="block">What are you waiting for?</span>
            <span className="block text-mist">Let&rsquo;s talk about your project.</span>
          </RevealHeading>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <LineButton href={`mailto:${CONTACT.email}`}>Talk with us</LineButton>
            <LineButton href={`mailto:${CONTACT.email}`} variant="text">
              {CONTACT.email}
            </LineButton>
          </div>
        </div>

        <div className="grid gap-12 border-t border-white/10 py-16 sm:grid-cols-2 md:grid-cols-12 md:gap-6">
          <div className="flex flex-col gap-6 md:col-span-4">
            <ViciadWordmark className="h-7 w-auto self-start text-plum" />
            <p className="max-w-xs font-sans text-[15px] leading-[1.6] text-mist">{COMPANY.summary}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-5 md:col-span-2">
            <h2 className={columnTitle}>Company</h2>
            <ul className="flex flex-col gap-3">
              {siteLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={link}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-5 md:col-span-3">
            <h2 className={columnTitle}>Services</h2>
            <ul className="flex flex-col gap-3">
              {SERVICES.map(({ title }) => (
                <li key={title}>
                  <Link href="/services" className={link}>
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <address className="flex flex-col gap-5 not-italic md:col-span-3">
            <h2 className={columnTitle}>Office</h2>
            <p className="max-w-[16rem] font-sans text-[15px] leading-[1.6] text-white/80">{CONTACT.address}</p>
            <a href={`mailto:${CONTACT.email}`} className={link}>
              {CONTACT.email}
            </a>
            <p className="flex flex-col gap-1">
              {CONTACT.phones.map((phone) => (
                <a key={phone} href={`tel:${phone}`} className={link}>
                  {phone}
                </a>
              ))}
            </p>
            <p className="font-sans text-sm text-mist">
              Hours: <Placeholder>office hours</Placeholder>
            </p>
          </address>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-8 font-sans text-sm text-mist md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {year} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Placeholder>social links</Placeholder>
            <Placeholder>privacy policy &amp; terms</Placeholder>
          </div>
        </div>

        {/* The sign-off: the wordmark the full width of the page, in dots. */}
        <div className="pb-14 pt-6 md:pb-28 md:pt-10">
          <DotWordmark />
        </div>
      </Shell>
    </footer>
  );
}
