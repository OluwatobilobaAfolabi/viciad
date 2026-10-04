import { WORDMARK_BOUNDS, WORDMARK_PATH } from "@/components/brand/viciad-wordmark";

/** Dot pitch in wordmark units: about four dots across each stroke. */
const PITCH = 0.58;
/** Never closer than this on screen, so small screens keep legible dots. */
const MIN_PITCH_PX = 3.4;

export type WordmarkDots = {
  /** Dot centres in px, relative to the wordmark's top-left ink corner. */
  points: { x: number; y: number }[];
  /** Rendered size of the wordmark's ink, in px. */
  width: number;
  height: number;
  /** Spacing between dots, in px. */
  pitch: number;
};

let shape: Path2D | null = null;
let probe: CanvasRenderingContext2D | null = null;

/**
 * Samples the real VICIAD wordmark on a square grid at the given rendered
 * width. Shared by the footer sign-off and the site loader.
 */
export function sampleWordmarkDots(width: number): WordmarkDots {
  shape ??= new Path2D(WORDMARK_PATH);
  probe ??= document.createElement("canvas").getContext("2d")!;

  const [left, top, right, bottom] = WORDMARK_BOUNDS;
  const scale = width / (right - left);
  const pitch = Math.max(PITCH, MIN_PITCH_PX / scale);

  const points: { x: number; y: number }[] = [];
  for (let y = top + pitch / 2; y < bottom; y += pitch) {
    for (let x = left + pitch / 2; x < right; x += pitch) {
      if (probe.isPointInPath(shape, x, y)) points.push({ x: (x - left) * scale, y: (y - top) * scale });
    }
  }
  return { points, width, height: (bottom - top) * scale, pitch: pitch * scale };
}
