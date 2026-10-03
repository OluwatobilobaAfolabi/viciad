import Link from "next/link";

import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { cn } from "@/lib/cn";

type LineButtonProps = {
  href: string;
  children: React.ReactNode;
  /** `outline`: thin bordered pill. `text`: bare link with a growing underline. */
  variant?: "outline" | "text";
  className?: string;
};

/**
 * The redesign's call to action: no heavy fill. On hover the arrow slides out
 * up-right and a fresh one slides in behind it; the outline variant fills
 * white, the text variant draws its underline.
 */
export function LineButton({ href, children, variant = "outline", className }: LineButtonProps) {
  const arrow = (
    <span aria-hidden className="relative block size-4 overflow-hidden">
      <ArrowUpRight className="absolute inset-0 size-4 transition-transform duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:-translate-y-full group-hover:translate-x-full" />
      <ArrowUpRight className="absolute inset-0 size-4 -translate-x-full translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
    </span>
  );

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 font-label text-[15px] font-medium tracking-[-0.01em] text-white outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
        variant === "outline"
          ? "h-12 rounded-full border border-white/45 px-6 hover:border-white hover:bg-white hover:text-black"
          : "relative h-12 after:absolute after:inset-x-0 after:bottom-3 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.215,0.61,0.355,1)] hover:after:scale-x-100",
        className,
      )}
    >
      <span>{children}</span>
      {arrow}
    </Link>
  );
}
