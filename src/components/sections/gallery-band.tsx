import { WaterPhoto } from "@/components/ui/water-photo";

/**
 * Full-bleed site photograph. Figma crops it to 132.21% height with a -21.2%
 * offset, which is object-cover with the focal point at 66% vertically.
 *
 * The surface ripples under a cursor or finger — see WaterPhoto, which falls
 * back to the plain photograph wherever that can't run.
 */
export function GalleryBand() {
  return (
    <section id="gallery" className="relative h-[320px] w-full overflow-hidden bg-white sm:h-[480px] lg:h-[726px]">
      <WaterPhoto
        src="/images/construction-site.jpg"
        alt="Tower cranes above a high-rise building under construction"
        focalX={0.5}
        focalY={0.66}
        sizes="100vw"
        className="absolute inset-0"
      />
    </section>
  );
}
