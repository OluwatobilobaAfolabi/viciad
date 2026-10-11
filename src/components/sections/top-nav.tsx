"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { ViciadWordmark } from "@/components/brand/viciad-wordmark";
import { Dot } from "@/components/icons/dot";
import { ArrowSwap } from "@/components/ui/arrow-swap";
import { LineButton } from "@/components/ui/line-button";
import { Shell } from "@/components/ui/shell";
import { cn } from "@/lib/cn";
import { isActive, navLinks } from "@/lib/nav";

/**
 * The redesign's nav: a floating glass capsule — logo left, a short menu, one
 * filled call to action. Its glass is an 80% white overlay over a strong blur,
 * so it reads as light frosted glass over every section; the links are grey,
 * the logo violet, and the active page violet with its GPS-style ping.
 *
 * A link with children (About Us) grows the capsule itself downward on hover
 * or keyboard focus: the pill eases into a rounded panel and its options
 * appear inside it, then it shrinks back when the pointer leaves, another
 * link is hovered, focus moves away or Escape is pressed.
 *
 * `introHidden`: the home hero fades the nav in at the end of its intro. It
 * starts hidden only when JavaScript is running, so it is never lost without.
 */
export function TopNav({ introHidden = false }: { introHidden?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  // Mobile menu: whether About Us is expanded. It opens already expanded on a page inside it.
  const [subOpen, setSubOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const dropTrigger = useRef<HTMLAnchorElement>(null);
  const dropPanel = useRef<HTMLDivElement>(null);
  // Set when Escape hands focus back to the trigger, so that focus doesn't re-open it.
  const skipFocusOpen = useRef(false);
  const pathname = usePathname();
  const dropLink = navLinks.find((link) => link.children);

  const openDrop = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setDropOpen(true);
  }, []);
  // A short grace period, so a pointer crossing the edge doesn't snap it shut.
  const closeDrop = useCallback((delay = 140) => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setDropOpen(false), delay);
  }, []);

  /*
   * Keyboard order: the panel sits after the bar in the markup, so Tab from
   * the trigger is sent into the panel, and Tab off its last option carries
   * on to the link after the trigger (Shift+Tab off the first returns).
   */
  const panelLinks = () => Array.from(dropPanel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
  const onTriggerKey = (event: React.KeyboardEvent) => {
    if ((event.key === "Tab" && !event.shiftKey) || event.key === "ArrowDown") {
      event.preventDefault();
      openDrop();
      requestAnimationFrame(() => panelLinks()[0]?.focus());
    }
  };
  const onPanelKey = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const links = panelLinks();
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (!event.shiftKey && index === links.length - 1) {
      event.preventDefault();
      const triggerItem = dropTrigger.current?.closest("li");
      triggerItem?.nextElementSibling?.querySelector<HTMLAnchorElement>("a")?.focus();
    } else if (event.shiftKey && index === 0) {
      event.preventDefault();
      skipFocusOpen.current = true;
      dropTrigger.current?.focus();
    }
  };

  // Navigating somewhere closes it (state reset during render, React's
  // recommended pattern for responding to a changed prop).
  const [dropPath, setDropPath] = useState(pathname);
  if (dropPath !== pathname) {
    setDropPath(pathname);
    setDropOpen(false);
  }

  useEffect(() => {
    if (!dropOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDropOpen(false);
      skipFocusOpen.current = true;
      dropTrigger.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dropOpen]);

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
      {/* The glass capsule: an 80% white overlay over a strong blur. A lit top
          edge, a hairline border and a soft shadow give it its shape; the
          shadow lifts once scrolled. */}
      <div
        onMouseLeave={() => closeDrop()}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeDrop(0);
        }}
        className={cn(
          "relative z-10 mx-auto max-w-[1376px] rounded-[32px] border border-white/60 bg-white/80 backdrop-blur-[20px] backdrop-saturate-[1.8] transition-[box-shadow,border-radius] duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] md:rounded-[36px]",
          dropOpen && "lg:rounded-[28px]",
          scrolled || menuOpen || dropOpen
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
            <ViciadWordmark className="h-6 w-auto text-brand md:h-7" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-12">
              {navLinks.map(({ label, href, children }) => {
                const active = isActive(href, pathname);
                return (
                  <li key={href} onMouseEnter={children ? openDrop : () => closeDrop(0)}>
                    <Link
                      ref={children ? dropTrigger : undefined}
                      href={href}
                      onFocus={
                        children
                          ? () => {
                              if (skipFocusOpen.current) skipFocusOpen.current = false;
                              else openDrop();
                            }
                          : () => closeDrop(0)
                      }
                      onKeyDown={children ? onTriggerKey : undefined}
                      aria-current={href === pathname ? "page" : undefined}
                      aria-expanded={children ? dropOpen : undefined}
                      aria-controls={children ? "nav-drop" : undefined}
                      className={cn(
                        "relative flex items-center gap-2 py-2 font-sans text-[15px] outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand",
                        "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-brand after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                        active || (children && dropOpen)
                          ? cn("after:scale-x-0", active ? "font-semibold text-brand" : "text-brand")
                          : "text-nav-link after:scale-x-0 hover:text-brand hover:after:scale-x-100",
                      )}
                    >
                      {active ? <Dot className="size-1.5" /> : null}
                      {label}
                      {children ? (
                        <svg
                          viewBox="0 0 12 12"
                          aria-hidden
                          className={cn("size-3 transition-transform duration-300", dropOpen && "rotate-180")}
                        >
                          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <LineButton href="/contact" variant="fill" size="sm">
              Get in Touch
            </LineButton>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!menuOpen) setSubOpen(navLinks.some((link) => link.children && isActive(link.href, pathname)));
              setMenuOpen(!menuOpen);
            }}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative flex size-11 items-center justify-center text-brand outline-none focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
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

        {/* The capsule's lower half: rows animate 0fr → 1fr so it grows to
            exactly the panel's height. Desktop only; inert while closed. */}
        {dropLink?.children ? (
          <div
            id="nav-drop"
            ref={dropPanel}
            onMouseEnter={openDrop}
            onKeyDown={onPanelKey}
            className={cn(
              "hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] lg:grid",
              dropOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="min-h-0 overflow-hidden" inert={!dropOpen}>
              <div
                className={cn(
                  "mx-3 grid grid-cols-2 gap-3 border-t border-onyx/[0.07] pb-3 pt-3 transition-[opacity,transform] duration-500",
                  dropOpen ? "translate-y-0 opacity-100 delay-100" : "-translate-y-2 opacity-0",
                )}
              >
                {dropLink.children.map((child) => {
                  const current = child.href === pathname;
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      aria-current={current ? "page" : undefined}
                      className="group/item flex items-center gap-5 rounded-[20px] p-3 outline-none transition-colors duration-300 hover:bg-brand/[0.07] focus-visible:bg-brand/[0.07] focus-visible:outline-2 focus-visible:outline-brand"
                    >
                      <span className="relative h-[84px] w-[132px] shrink-0 overflow-hidden rounded-[14px] bg-ash">
                        <Image
                          src={child.image}
                          alt=""
                          fill
                          sizes="132px"
                          className="object-cover transition-transform duration-700 ease-out group-hover/item:scale-[1.06]"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "flex items-center gap-2 font-headline text-xl font-semibold tracking-[-0.02em] [font-stretch:90%]",
                            current ? "text-brand" : "text-onyx group-hover/item:text-brand",
                          )}
                        >
                          {current ? <Dot className="size-1.5 text-brand" /> : null}
                          {child.label}
                        </span>
                        <span className="mt-1 block font-sans text-sm text-stone">{child.description}</span>
                      </span>
                      <ArrowSwap className="mr-2 text-onyx transition-colors group-hover/item:text-brand" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 overflow-y-auto overscroll-contain bg-onyx pt-24 transition-[opacity,visibility] duration-500 lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <Shell className="flex min-h-full flex-col justify-between gap-10 pb-10 pt-10">
          <ul className="flex flex-col">
            {navLinks.map(({ label, href, children }, index) => {
              const active = isActive(href, pathname);
              return (
                <li
                  key={href}
                  className={cn(
                    "border-b border-white/10 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                    menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                  )}
                  style={{ transitionDelay: menuOpen ? `${80 + index * 60}ms` : "0ms" }}
                >
                  {children ? (
                    <>
                      {/* About Us: a toggle that unfolds its pages as cards. */}
                      <button
                        type="button"
                        onClick={() => setSubOpen((open) => !open)}
                        aria-expanded={subOpen}
                        aria-controls={`mobile-sub-${index}`}
                        className="flex w-full items-center justify-between py-5 text-left font-headline text-4xl font-semibold tracking-[-0.03em] text-white outline-none [font-stretch:85%] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        <span className="flex items-center gap-3">
                          {label}
                          {active ? <Dot className="size-2 text-brand" /> : null}
                        </span>
                        <span
                          aria-hidden
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full border transition-colors duration-300",
                            subOpen ? "border-brand bg-brand text-white" : "border-white/20 text-white/70",
                          )}
                        >
                          <svg
                            viewBox="0 0 12 12"
                            className={cn("size-3.5 transition-transform duration-500", subOpen && "rotate-180")}
                          >
                            <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                          </svg>
                        </span>
                      </button>
                      <div
                        id={`mobile-sub-${index}`}
                        className={cn(
                          "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)]",
                          subOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <div className="min-h-0 overflow-hidden" inert={!subOpen}>
                          <ul
                            className={cn(
                              "flex flex-col gap-2 pb-5 transition-[opacity,transform] duration-500",
                              subOpen ? "translate-y-0 opacity-100 delay-100" : "-translate-y-2 opacity-0",
                            )}
                          >
                            {children.map((child) => {
                              const current = child.href === pathname;
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={() => setMenuOpen(false)}
                                    aria-current={current ? "page" : undefined}
                                    className={cn(
                                      "group/sub flex items-center gap-4 rounded-2xl border p-2.5 pr-4 outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-brand",
                                      current
                                        ? "border-brand/60 bg-brand/10"
                                        : "border-white/10 bg-white/[0.04] active:bg-white/[0.08]",
                                    )}
                                  >
                                    <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-graphite">
                                      <Image src={child.image} alt="" fill sizes="64px" className="object-cover" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span
                                        className={cn(
                                          "block font-headline text-xl font-semibold tracking-[-0.02em] [font-stretch:90%]",
                                          current ? "text-brand" : "text-white",
                                        )}
                                      >
                                        {child.label}
                                      </span>
                                      <span className="mt-0.5 block font-sans text-sm leading-snug text-white/55">
                                        {child.description}
                                      </span>
                                    </span>
                                    {current ? (
                                      <Dot className="size-2 text-brand" />
                                    ) : (
                                      <ArrowSwap className="text-white/70" />
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={href === pathname ? "page" : undefined}
                      className="flex items-center justify-between py-5 font-headline text-4xl font-semibold tracking-[-0.03em] text-white [font-stretch:85%]"
                    >
                      {label}
                      {active ? <Dot className="size-2 text-brand" /> : null}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <div>
            <LineButton href="/contact" variant="fill" onClick={() => setMenuOpen(false)}>
              Get in Touch
            </LineButton>
          </div>
        </Shell>
      </div>
    </header>
  );
}
