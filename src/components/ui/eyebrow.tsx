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
