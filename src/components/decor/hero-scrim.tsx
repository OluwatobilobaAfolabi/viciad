/**
 * The overlay every page hero puts over its photograph.
 *
 * Figma's gradient — rgba(81,66,118,.74) to rgba(0,0,0,.74) at 43.575% — is
 * tuned to the 1440x~800 crop. Below lg the heroes are portrait, so the photo's
 * darker lower half fills the flat part of the ramp and the image disappears;
 * the stop is eased there. The desktop gradient is exactly as designed.
 */
export function HeroScrim() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(81,66,118,0.74)_0%,rgba(0,0,0,0.62)_43.575%)] lg:bg-[linear-gradient(to_bottom,rgba(81,66,118,0.74)_0%,rgba(0,0,0,0.74)_43.575%)]"
    />
  );
}
