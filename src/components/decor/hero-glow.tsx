/**
 * Blurred violet ellipse behind the hero copy (Figma "Ellipse 1").
 * The 919px layer sits at (-264, -62); the 187px blur grows it by 40.7% on
 * every side, which is where the -638 / -436 offsets and 1667px box come from.
 */
export function HeroGlow() {
  return (
    <div
      className="pointer-events-none absolute -left-[638px] -top-[436px] size-[1667px]"
      aria-hidden="true"
    >
      <svg
        width="1667"
        height="1667"
        viewBox="0 0 1667 1667"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block size-full"
      >
        <g filter="url(#hero-glow-blur)">
          <circle cx="833.5" cy="833.5" r="459.5" fill="#8B5CF6" fillOpacity="0.24" />
        </g>
        <defs>
          <filter
            id="hero-glow-blur"
            x="0"
            y="0"
            width="1667"
            height="1667"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="187" result="effect1_foregroundBlur" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
