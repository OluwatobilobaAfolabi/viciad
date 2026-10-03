import { cn } from "@/lib/cn";

/**
 * 8x8 bullet marking the active nav item, exported from Figma.
 *
 * The solid core is the exported circle, unchanged. Two rings ride out of it on
 * a staggered loop — one always mid-flight — which is what makes it read as a
 * live GPS ping rather than a single throb. The rings are absolutely positioned
 * and `pointer-events-none`, so the nav item's 93px box never moves, and they
 * only run when the visitor hasn't asked for reduced motion.
 */
export function Dot({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex shrink-0 text-current", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-current opacity-0 motion-safe:animate-ping-out"
      />
      {/* Half a cycle behind the first, so one ring is always mid-flight. The
          delay is inline because the `animate-*` shorthand resets it. */}
      <span
        aria-hidden
        style={{ animationDelay: "1s" }}
        className="pointer-events-none absolute inset-0 rounded-full bg-current opacity-0 motion-safe:animate-ping-out"
      />
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="relative block size-full"
      >
        <circle cx="4" cy="4" r="4" fill="currentColor" />
      </svg>
    </span>
  );
}
