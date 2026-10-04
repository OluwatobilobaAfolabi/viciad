import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { cn } from "@/lib/cn";

/**
 * The redesign's arrow micro-interaction: on hover of the nearest `.group`,
 * the arrow slides out up-right and a fresh one slides in behind it.
 */
export function ArrowSwap({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative block size-4 shrink-0 overflow-hidden", className)}>
      <ArrowUpRight className="absolute inset-0 size-full transition-transform duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:-translate-y-full group-hover:translate-x-full" />
      <ArrowUpRight className="absolute inset-0 size-full -translate-x-full translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
    </span>
  );
}
