import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Shell } from "@/components/ui/shell";
import { cn } from "@/lib/cn";

/**
 * The clients on record; `w`/`h` are each file's own pixel size. `scale`
 * evens out the optical size of files with a lot of empty margin (or, for
 * the low-resolution Nembe mark, keeps it near its native size).
 */
type Partner = { name: string; file: string; w: number; h: number; scale?: number };

const partners: Partner[] = [
  { name: "Northwest Petroleum and Gas Company", file: "northwest", w: 600, h: 600, scale: 2 },
  { name: "Aiteo", file: "aiteo", w: 500, h: 375 },
  { name: "Lagos State Tourism", file: "lagos-tourism", w: 446, h: 448 },
  { name: "Wabeco", file: "wabeco", w: 386, h: 294 },
  { name: "Bravura", file: "bravura", w: 263, h: 151 },
  { name: "Mabisel Trading and Construction Company", file: "mabisel", w: 850, h: 184 },
  { name: "Government of Cross River State", file: "cross-river-state", w: 516, h: 514 },
  { name: "Aviam Offshore", file: "aviam-offshore", w: 200, h: 200, scale: 1.7 },
  { name: "Nembe Crude Oil Terminal", file: "nembe-crude-oil-terminal", w: 95, h: 38, scale: 0.6 },
  { name: "Niger Delta Development Commission", file: "nddc", w: 432, h: 432 },
  { name: "Rainoil", file: "rainoil", w: 374, h: 466 },
  { name: "Stockgap Fuels", file: "stockgap", w: 660, h: 574 },
  { name: "Government of Bayelsa State", file: "bayelsa-state", w: 432, h: 432 },
  { name: "Promenade Oil and Gas Company", file: "promenade", w: 766, h: 270 },
  { name: "Lagos State Development and Property Corporation", file: "lsdpc", w: 400, h: 400 },
  { name: "Puma Energy", file: "puma-energy", w: 450, h: 390 },
  { name: "Fynefield Petroleum Company", file: "fynefield", w: 804, h: 276 },
  { name: "Daewoo Nigeria", file: "daewoo-nigeria", w: 814, h: 378 },
];

/** One pass of the logos. The second copy is decorative and hidden from assistive tech. */
function Track({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className={cn(
        "flex shrink-0 items-center gap-14 pr-14 md:gap-20 md:pr-20",
        "motion-safe:animate-marquee motion-safe:[animation-duration:70s] motion-safe:group-hover:[animation-play-state:paused]",
        duplicate && "motion-reduce:hidden",
      )}
    >
      {partners.map(({ name, file, w, h, scale }) => (
        <li key={file} className="flex h-16 shrink-0 items-center md:h-20">
          <Image
            src={`/images/partners/${file}.png`}
            alt={duplicate ? "" : name}
            width={w}
            height={h}
            sizes="200px"
            className="h-full w-auto max-w-[11rem] object-contain opacity-70 mix-blend-multiply grayscale transition duration-500 hover:opacity-100 hover:grayscale-0 md:max-w-[13rem]"
            style={scale ? { scale } : undefined}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * The clients on record, looping sideways in a quiet greyscale that
 * turns to full colour under the cursor. Hovering pauses the loop; reduced
 * motion leaves a single strip to swipe through.
 */
export function Partners() {
  return (
    <section className="bg-white pb-28 md:pb-40">
      <div className="border-y border-ash py-12 md:py-16">
        <Shell>
          <Reveal>
            <p className="type-body max-w-md text-stone">
              Trusted by organisations and individuals across the country.
            </p>
          </Reveal>
        </Shell>

        <Reveal className="mt-10 md:mt-14">
          <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[scrollbar-width:none] motion-reduce:[&::-webkit-scrollbar]:hidden">
            <Track />
            <Track duplicate />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
