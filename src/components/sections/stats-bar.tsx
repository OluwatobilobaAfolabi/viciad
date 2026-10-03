import { StatsRow } from "@/components/ui/stats-row";
import { Shell } from "@/components/ui/shell";

export function StatsBar() {
  return (
    <section className="bg-white">
      <Shell className="flex items-center py-14 lg:h-[235px] lg:py-0">
        <StatsRow />
      </Shell>
    </section>
  );
}
