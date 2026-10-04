"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ViciadWordmark } from "@/components/brand/viciad-wordmark";
import { Dot } from "@/components/icons/dot";
import { LineButton } from "@/components/ui/line-button";
import { Shell } from "@/components/ui/shell";
import { cn } from "@/lib/cn";
import { siteLinks } from "@/lib/nav";

/**
 * The redesign's nav: a floating glass capsule — logo left, a short menu, one
 * filled call to action. The frost is only 4%, so the page shows through it;
 * the links therefore follow what is behind the capsule, white over the dark
 * sections (marked data-nav-tone="dark") and grey over the light ones. The
 * plum logo, the violet active page and its GPS-style ping never change.
 *
 * `introHidden`: the home hero fades the nav in at the end of its intro. It
 * starts hidden only when JavaScript is running, so it is never lost without.
 */
export function TopNav({ introHidden = false }: { introHidden?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Whether the capsule currently sits over a dark section (one marked
  // data-nav-tone="dark"). The glass is nearly clear, so the links follow it.
  const [overDark, setOverDark] = useState(true);
  const capsule = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      const box = capsule.current?.getBoundingClientRect();
      if (!box) return;
      const y = box.top + box.height / 2;
      setOverDark(
        Array.from(document.querySelectorAll('[data-nav-tone="dark"]')).some((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= y && rect.bottom > y;
        }),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  const dark = overDark || menuOpen;

  // Hold the page still behind the open mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    window.__lenis?.stop();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      data-intro-nav={introHidden || undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4",
        introHidden && "[@media(scripting:enabled)]:invisible [@media(scripting:enabled)]:opacity-0",
      )}
    >
      {/* The glass capsule: a 4% lavender frost over a strong blur, so the
          page shows clearly through it. A lit top edge, a hairline border and
          a soft shadow give it its shape; the shadow lifts once scrolled. */}
      <div
        ref={capsule}
        className={cn(
          "relative z-10 mx-auto max-w-[1376px] rounded-full border bg-[rgba(247,245,253,0.04)] backdrop-blur-[20px] backdrop-saturate-[1.8] transition-[border-color,box-shadow] duration-500",
          dark ? "border-white/25" : "border-onyx/[0.08]",
          scrolled || menuOpen
            ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(255,255,255,0.08),0_12px_40px_-14px_rgba(10,10,10,0.35)]"
            : "shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(255,255,255,0.08),0_6px_24px_-14px_rgba(10,10,10,0.2)]",
        )}
      >
        <div className="flex h-16 items-center justify-between pl-6 pr-2.5 md:h-[72px] md:pl-8 md:pr-3">
          <Link
            href="/"
            aria-label="VICIAD — home"
            className="outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            <ViciadWordmark className="h-6 w-auto text-plum md:h-7" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-12">
              {siteLinks.map(({ label, href }) => {
                const active = href === pathname;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-2 py-2 font-sans text-[15px] outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand",
                        "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-brand after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                        active
                          ? "font-semibold text-brand after:scale-x-0"
                          : cn(
                              "after:scale-x-0 hover:text-brand hover:after:scale-x-100",
                              dark ? "text-white/80" : "text-nav-link",
                            ),
                      )}
                    >
                      {active ? <Dot className="size-1.5" /> : null}
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <LineButton href="#contact" variant="fill" size="sm">
              Get in Touch
            </LineButton>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={cn(
              "relative flex size-11 items-center justify-center outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-brand lg:hidden",
              dark ? "text-white" : "text-onyx",
            )}
          >
            <span
              className={cn(
                "absolute h-px w-6 bg-current transition-transform duration-300",
                menuOpen ? "rotate-45" : "-translate-y-[4px]",
              )}
            />
            <span
              className={cn(
                "absolute h-px w-6 bg-current transition-transform duration-300",
                menuOpen ? "-rotate-45" : "translate-y-[4px]",
              )}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 bg-onyx pt-24 transition-[opacity,visibility] duration-500 lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <Shell className="flex h-full flex-col justify-between pb-10 pt-10">
          <ul className="flex flex-col">
            {siteLinks.map(({ label, href }, index) => {
              const active = href === pathname;
              return (
                <li
                  key={href}
                  className={cn(
                    "border-b border-white/10 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                    menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                  )}
                  style={{ transitionDelay: menuOpen ? `${80 + index * 60}ms` : "0ms" }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="flex items-center justify-between py-5 font-headline text-4xl font-semibold tracking-[-0.03em] text-white [font-stretch:85%]"
                  >
                    {label}
                    {active ? <Dot className="size-2 text-brand" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div>
            <LineButton href="#contact" variant="fill" onClick={() => setMenuOpen(false)}>
              Get in Touch
            </LineButton>
          </div>
        </Shell>
      </div>
    </header>
  );
}
