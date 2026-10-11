export type NavLink = {
  label: string;
  href: string;
  /** Left out of the top nav (the nav's "Get in Touch" button covers it); still in the footer. */
  footerOnly?: boolean;
  /** A dropdown under the link (desktop) or nested links (mobile menu, footer). */
  children?: { label: string; href: string; description: string; image: string }[];
};

/**
 * The primary links, shared by the top nav and the footer. A link is shown as
 * active on its own page and on any page nested under it (/about/…).
 */
export const siteLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      {
        label: "Company",
        href: "/about",
        description: "Who we are, our purpose and our team",
        image: "/images/about/overview.png",
      },
      {
        label: "HSSE Policy",
        href: "/about/hsse-policy",
        description: "Health, safety, security & environment",
        image: "/images/about/hero-video-poster.jpg",
      },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Services", href: "/services" },
  { label: "Contact Us", href: "/contact", footerOnly: true },
];

/** The links shown in the top nav. */
export const navLinks = siteLinks.filter((link) => !link.footerOnly);

export const isActive = (href: string, pathname: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
