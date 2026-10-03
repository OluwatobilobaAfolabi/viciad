/*
 * Values for the blueprint hero that you are expected to tune.
 *
 * FINAL_CAMERA is the camera the 3D sequence settles on, chosen so the lines
 * sit exactly on top of /hero/blueprint.jpg. Open the home page with
 * ?calibrate (dev server only), line it up with the sliders, press
 * "Copy values" and paste the result over the object below.
 */

export type FinalCamera = {
  /** Camera position in world units (the frame is 16 wide, a floor is 1 tall). */
  position: [number, number, number];
  /** The point the camera looks at. */
  target: [number, number, number];
  /** Vertical field of view in degrees. */
  fov: number;
  /**
   * Where the target lands on screen, as a fraction of the 16:9 frame.
   * This is a lens shift, not a rotation, so verticals stay parallel the way
   * they do in an architectural photograph.
   */
  screen: [number, number];
  /** Uniform scale applied to the whole model. */
  scale: number;
};

/*
 * Starting values solved from the drawing, not set by eye: four measured
 * landmarks on the frame plus the photo's ground horizon (y ≈ 630), fitted to
 * a level camera with lens shift — 4.6px RMS on the 1280px frame. It is a long
 * lens from far away (≈14° field of view, eye level near floor 8), which is
 * why the verticals stay parallel. Refine with ?calibrate.
 */
export const FINAL_CAMERA: FinalCamera = {
  position: [111.318, 8.298, 105.845],
  target: [0, 8.298, 0],
  fov: 14.097,
  screen: [0.6976, 0.8748],
  scale: 1,
};

/** The two stills are 1280×720 and pixel-aligned with each other. */
export const FRAME = { width: 1280, height: 720 };

/**
 * Horizontal focal point used when the 16:9 frame is cropped to a narrower
 * screen (object-position for the images, the same crop for the camera), so
 * the building stays centred-right on phones.
 */
export const FOCAL_X = { desktop: 0.5, mobile: 0.72 };

/**
 * Set to "/hero/hero.mp4" once the clip is in public/hero. Until then the
 * sequence holds on the photo, and nothing requests a file that isn't there.
 */
export const HERO_VIDEO_SRC: string | null = null;

/** Scroll distance the hero stays pinned for, in viewport heights. */
export const PIN_LENGTH_VH = { desktop: 450, mobile: 250 };
