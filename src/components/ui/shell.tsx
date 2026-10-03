import { cn } from "@/lib/cn";

/** The 1440px page frame with the design's 64px gutters (24px on small screens). */
export function Shell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-6 lg:px-16", className)}>{children}</div>
  );
}
