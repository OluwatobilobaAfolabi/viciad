"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { LineButton } from "@/components/ui/line-button";
import { Shell } from "@/components/ui/shell";
import { EASE, gsap, SplitText } from "@/lib/gsap";

/**
 * The hero every inner page opens with: a full-bleed site photograph under a
 * dark ramp and a faint blueprint grid (the home hero's drawing, echoed), the
 * page title set large at the foot. On load the photo settles out of a slight
 * zoom and the title lines rise out of their masks.
 */
export function PageHero({
  crumb,
  title,
  lead,
  image,
  alt,
  position = "50% 50%",
  cta = { href: "#contact", label: "Talk with us" },
  children,
}: {
  /** The page name, shown as the breadcrumb. */
  crumb: string;
  /** One block element per line, e.g. `<span className="block">…</span>`. */
  title: React.ReactNode;
  lead: string;
  image: string;
  alt: string;
  /** object-position for the photograph. */
  position?: string;
  cta?: { href: string; label: string };
  /** Pinned to the foot of the hero, below the title (the services marquee). */
  children?: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.from(q("[data-hero-photo]"), { scale: 1.12, duration: 2.2, ease: "power2.out" }, 0);

      const heading = q("h1")[0];
      if (heading) {
        const split = SplitText.create(heading, { type: "lines", mask: "lines" });
        tl.from(split.lines, { yPercent: 110, duration: 1.1, stagger: 0.1 }, 0.25);
      }
      tl.from(q("[data-hero-fade]"), { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.08 }, 0.6);
    },
    { scope: root },
  );

  return (
    <section ref={root} data-nav-tone="dark" className="relative isolate flex min-h-[92svh] flex-col overflow-hidden bg-onyx text-white">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div data-hero-photo className="absolute inset-0">
          <Image
            src={image}
            alt={alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: position }}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0.55)_0%,rgba(10,10,10,0.25)_35%,rgba(10,10,10,0.92)_100%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:96px_96px] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
      </div>

      <Shell className="flex flex-1 flex-col justify-end pb-14 pt-36 md:pb-20">
        <nav aria-label="Breadcrumb" data-hero-fade>
          <ol className="type-eyebrow flex items-center gap-3 text-white/60">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                VICIAD
              </Link>
            </li>
            <li aria-hidden className="h-px w-6 bg-current opacity-50" />
            <li aria-current="page" className="flex items-center gap-2 text-white">
              <span className="size-1.5 rounded-full bg-brand" />
              {crumb}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-12 md:items-end md:gap-6">
          <h1 className="type-display md:col-span-8">{title}</h1>
          <div className="flex flex-col items-start gap-8 md:col-span-4">
            <p data-hero-fade className="type-body max-w-md text-white/75">
              {lead}
            </p>
            <div data-hero-fade>
              <LineButton href={cta.href}>{cta.label}</LineButton>
            </div>
          </div>
        </div>
      </Shell>

      {children ? (
        <div data-hero-fade className="relative border-t border-white/12">
          {children}
        </div>
      ) : null}
    </section>
  );
}
