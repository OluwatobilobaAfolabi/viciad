import { cn } from "@/lib/cn";

/**
 * The two dashed rules drawn as vector layers in Figma (the section separators
 * inside "How We Make It Happen" are plain dashed borders in the design, so
 * they stay as CSS borders).
 */

/** 159px dotted divider between the stat figures, rotated upright. */
export function StatDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-[159px] w-0 shrink-0 items-center justify-center text-hairline", className)}
      aria-hidden="true"
    >
      <svg
        width="159.004"
        height="1"
        viewBox="0 0 159.004 1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="shrink-0 rotate-90"
      >
        <line
          x1="0.5"
          y1="0.5"
          x2="158.504"
          y2="0.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray="8 8"
        />
      </svg>
    </div>
  );
}

/** Full-width dashed rule above the footer copyright line. */
export function FooterRule() {
  return (
    <svg
      width="1312"
      height="2"
      viewBox="0 0 1312 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-0.5 w-full text-hairline-dark"
    >
      <line
        x1="1"
        y1="1"
        x2="1311"
        y2="1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="8 8"
      />
    </svg>
  );
}
