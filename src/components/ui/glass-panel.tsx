import { cn } from "@/lib/cn";

/**
 * Frosted panel used for the About hero's stat card and the expertise cards:
 * 12% white over the photo/dark background, hairline border, 15px blur.
 */
export function GlassPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[32px] border border-glass-line bg-white/12 backdrop-blur-[15px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
