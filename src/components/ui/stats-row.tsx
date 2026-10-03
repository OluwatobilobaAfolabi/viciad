import { Fragment } from "react";

import { StatDivider } from "@/components/decor/dashed-rules";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/cn";

const stats = [
  { value: 25, suffix: "+", label: "Professional Teams" },
  { value: 10, suffix: "+", label: "Years of Experience" },
  { value: 147, suffix: "+", label: "Completed Projects" },
];

/**
 * The three headline figures, shared by the home stats band and the About
 * hero's glass card. `tone` is the surface the row sits on.
 */
export function StatsRow({ tone = "light" }: { tone?: "light" | "dark" }) {
  const onDark = tone === "dark";

  return (
    <div className="flex w-full flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:gap-4">
      {stats.map(({ value, suffix, label }, index) => (
        <Fragment key={label}>
          {index > 0 ? <StatDivider className="hidden lg:flex" /> : null}
          <div className="flex flex-1 flex-col gap-1 leading-[1.06] lg:px-8">
            <p
              className={cn(
                "font-display text-[40px] font-bold tabular-nums tracking-[-1.12px] lg:text-[56px]",
                onDark ? "text-white" : "text-black",
              )}
            >
              <CountUp to={value} suffix={suffix} />
            </p>
            <p
              className={cn(
                "text-base leading-[1.06] tracking-[-0.36px] lg:text-lg",
                onDark ? "text-cloud-dim" : "text-muted",
              )}
            >
              {label}
            </p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
