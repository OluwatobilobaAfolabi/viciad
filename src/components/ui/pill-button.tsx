import Link from "next/link";

import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { cn } from "@/lib/cn";

type PillButtonProps = {
  href: string;
  children: React.ReactNode;
  /** `brand` is the filled violet pill, `outline` the white-bordered one. */
  variant?: "brand" | "outline";
  className?: string;
};

/**
 * The single call-to-action shape used everywhere in the design: 56px tall,
 * fully rounded, label on the left and a white circle holding the arrow.
 */
export function PillButton({ href, children, variant = "brand", className }: PillButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-14 shrink-0 items-center justify-center gap-6 rounded-[60px] pl-8 pr-4 font-display text-base font-medium text-white transition-colors",
        "origin-center motion-safe:hover:animate-jelly",
        variant === "brand"
          ? "bg-brand hover:bg-brand-dark"
          : "border-2 border-white hover:bg-white/10",
        className,
      )}
    >
      <span className="whitespace-nowrap">{children}</span>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white">
        <ArrowUpRight
          className={cn(
            "size-5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px",
            variant === "brand" ? "text-brand" : "text-black",
          )}
        />
      </span>
    </Link>
  );
}
