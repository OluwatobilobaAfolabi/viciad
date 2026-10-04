import { cn } from "@/lib/cn";

/** Section label: the section's name in small spaced capitals. */
export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p className={cn("type-eyebrow self-start", tone === "dark" ? "text-stone" : "text-mist", className)}>
      {children}
    </p>
  );
}

/**
 * Marks content that still has to be supplied. Deliberately visible, so a
 * placeholder can never be mistaken for real copy.
 */
export function Placeholder({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("rounded-sm border border-dashed border-current px-1.5 py-0.5 font-sans text-[0.8em] opacity-70", className)}>
      [PLACEHOLDER: {children}]
    </span>
  );
}
