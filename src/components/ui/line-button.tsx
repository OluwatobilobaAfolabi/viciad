import Link from "next/link";

import { ArrowSwap } from "@/components/ui/arrow-swap";
import { cn } from "@/lib/cn";

type LineButtonProps = {
  href: string;
  children: React.ReactNode;
  /**
   * `outline`: thin bordered pill. `text`: bare link with a growing underline.
   * `fill`: solid brand pill with the arrow in a white disc (the nav's CTA).
   */
  variant?: "outline" | "text" | "fill";
  /** The surface it sits on: `light` text for dark backgrounds, `dark` for light ones. */
  tone?: "light" | "dark";
  size?: "md" | "sm";
  className?: string;
  onClick?: () => void;
};

/**
 * The redesign's call to action. On hover the arrow swaps; the outline variant
 * fills solid, the text variant draws its underline, the fill variant deepens.
 */
export function LineButton({
  href,
  children,
  variant = "outline",
  tone = "light",
  size = "md",
  className,
  onClick,
}: LineButtonProps) {
  const light = tone === "light";
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group inline-flex shrink-0 items-center gap-3 font-sans font-medium tracking-[-0.01em] outline-none transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4",
        size === "md" ? "text-[15px]" : "text-sm",
        light ? "text-white focus-visible:outline-white" : "text-onyx focus-visible:outline-onyx",
        variant === "outline" && "rounded-full border",
        variant === "outline" && (size === "md" ? "h-12 px-6" : "h-10 px-5"),
        variant === "outline" &&
          (light
            ? "border-white/45 hover:border-white hover:bg-white hover:text-onyx"
            : "border-onyx/30 hover:border-onyx hover:bg-onyx hover:text-white"),
        variant === "fill" &&
          "rounded-full bg-brand text-white hover:bg-brand-dark focus-visible:outline-brand",
        variant === "fill" && (size === "md" ? "h-12 pl-6 pr-1.5" : "h-11 pl-5 pr-1.5"),
        variant === "text" &&
          "relative h-12 after:absolute after:inset-x-0 after:bottom-3 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.215,0.61,0.355,1)] hover:after:scale-x-100",
        className,
      )}
    >
      <span>{children}</span>
      {variant === "fill" ? (
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-white text-brand",
            size === "md" ? "size-9" : "size-8",
          )}
        >
          <ArrowSwap />
        </span>
      ) : (
        <ArrowSwap />
      )}
    </Link>
  );
}
