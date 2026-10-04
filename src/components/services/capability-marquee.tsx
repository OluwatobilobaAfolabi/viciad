import { cn } from "@/lib/cn";

const capabilities = [
  "Professional Teams",
  "Electrical & Instrumentation",
  "Quality Assurance",
  "Civil / Structural",
  "Hook-up & Commissioning",
  "Mechanical / Piping",
];

/** One pass of the list. The second copy is decorative and hidden from assistive tech. */
function Track({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={cn(
        "flex shrink-0 items-center",
        "motion-safe:animate-marquee motion-safe:group-hover:[animation-play-state:paused]",
        duplicate && "motion-reduce:hidden",
      )}
    >
      {capabilities.map((capability) => (
        <li key={capability} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap px-8 font-headline text-xl font-semibold tracking-[-0.02em] text-white [font-stretch:88%] md:px-12 md:text-2xl">
            {capability}
          </span>
          <span aria-hidden className="size-1.5 rotate-45 bg-brand" />
        </li>
      ))}
    </ul>
  );
}

/**
 * The capability strip along the foot of the services hero, looping sideways.
 * Two identical tracks slide by one track width per cycle so the seam never
 * shows; hovering pauses it, and reduced motion leaves a strip to swipe.
 */
export function CapabilityMarquee() {
  return (
    <div className="group flex overflow-hidden py-6 md:py-7 motion-reduce:overflow-x-auto motion-reduce:[scrollbar-width:none] motion-reduce:[&::-webkit-scrollbar]:hidden">
      <Track />
      <Track duplicate />
    </div>
  );
}
