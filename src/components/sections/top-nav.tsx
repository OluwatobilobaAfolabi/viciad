"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ViciadWordmark } from "@/components/brand/viciad-wordmark";
import { Dot } from "@/components/icons/dot";
import { PillButton } from "@/components/ui/pill-button";
import { cn } from "@/lib/cn";
import { siteLinks } from "@/lib/nav";

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /*
   * The pill is white on white once it passes the hero, where its pale border
   * alone doesn't separate it from the page. A shadow fades in past the fold so
   * the resting state at the top still matches the design exactly.
   */
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-8 z-50">
      <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-12">
        <nav
          className={cn(
            "flex h-20 items-center justify-between rounded-[90px] border border-nav-line bg-white/95 px-5 backdrop-blur-[15px] transition-shadow duration-300 lg:px-8",
            scrolled && "shadow-[0_10px_34px_rgba(11,9,16,0.18)]",
          )}
        >
          <Link href="/" aria-label="VICIAD — home">
            <ViciadWordmark className="h-8 w-[144.285px] text-brand" />
          </Link>

          <ul className="hidden items-center gap-10 lg:flex">
            {siteLinks.map(({ label, href }) => {
              const isActive = href === pathname;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex w-[93px] items-center justify-center gap-2 pb-1 text-center font-display text-base",
                      isActive
                        ? "border-b-2 border-brand font-bold text-brand"
                        : "font-normal text-nav-link transition-colors hover:text-ink",
                    )}
                  >
                    {isActive ? <Dot className="size-2 shrink-0" /> : null}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block">
            <PillButton href="#contact">Get in Touch</PillButton>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex size-11 origin-center items-center justify-center rounded-full border border-nav-line motion-safe:hover:animate-jelly lg:hidden"
          >
            <span className="flex w-5 flex-col gap-[5px]">
              <span
                className={cn(
                  "h-0.5 w-full rounded-full bg-ink transition-transform",
                  menuOpen && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn("h-0.5 w-full rounded-full bg-ink transition-opacity", menuOpen && "opacity-0")}
              />
              <span
                className={cn(
                  "h-0.5 w-full rounded-full bg-ink transition-transform",
                  menuOpen && "-translate-y-[7px] -rotate-45",
                )}
              />
            </span>
          </button>
        </nav>

        {menuOpen ? (
          <div
            id="mobile-menu"
            className="mt-3 flex flex-col gap-6 rounded-[32px] border border-nav-line bg-white p-6 lg:hidden"
          >
            <ul className="flex flex-col gap-4">
              {siteLinks.map(({ label, href }) => {
                const isActive = href === pathname;

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2 font-display text-base",
                        isActive ? "font-bold text-brand" : "font-normal text-nav-link",
                      )}
                    >
                      {isActive ? <Dot className="size-2 shrink-0" /> : null}
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <PillButton href="#contact" className="w-full">
              Get in Touch
            </PillButton>
          </div>
        ) : null}
      </div>
    </header>
  );
}
