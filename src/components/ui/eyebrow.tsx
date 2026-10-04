import { cn } from "@/lib/cn";

/** Section label: a numbered index in the accent, then the section's name. */
export function Eyebrow({
  index,
  children,
  tone = "dark",
  className,
}: {
  index: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p className={cn("type-eyebrow flex items-center gap-3 self-start", tone === "dark" ? "text-stone" : "text-mist", className)}>
      <span className="text-brand">{index}</span>
      <span aria-hidden className="h-px w-6 bg-current opacity-40" />
      <span>{children}</span>
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
