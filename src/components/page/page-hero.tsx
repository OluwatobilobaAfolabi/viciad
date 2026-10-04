"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  title,
  lead,
  image,
  alt,
  video,
  position = "50% 50%",
  cta = { href: "#contact", label: "Talk with us" },
  children,
}: {
  /** One block element per line, e.g. `<span className="block">…</span>`. */
  title: React.ReactNode;
  lead: string;
  image: string;
  alt: string;
  /**
   * Optional looping background film. The photograph stays underneath as the
   * first frame and for reduced motion; the film fades in once it is playing.
   */
  video?: string;
  /** object-position for the photograph (and the film). */
  position?: string;
  cta?: { href: string; label: string };
  /** Pinned to the foot of the hero, below the title (the services marquee). */
  children?: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [filmPlaying, setFilmPlaying] = useState(false);

  // Started from code rather than `autoPlay`, so reduced motion never plays it.
  useEffect(() => {
    const el = film.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.play().catch(() => {
      // Autoplay refused (e.g. data saver): the photograph simply stays.
    });
  }, []);

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
    <section ref={root} data-nav-tone="dark" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-onyx text-white">
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
          {video ? (
            <video
              ref={film}
              src={video}
              muted
              loop
              playsInline
              preload="auto"
              onPlaying={() => setFilmPlaying(true)}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${filmPlaying ? "opacity-100" : "opacity-0"}`}
              style={{ objectPosition: position }}
            />
          ) : null}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0.55)_0%,rgba(10,10,10,0.25)_35%,rgba(10,10,10,0.92)_100%)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:96px_96px] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
      </div>

      <Shell className="flex flex-1 flex-col justify-end pb-14 pt-36 md:pb-20">
        <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-6">
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
