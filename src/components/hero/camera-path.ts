import type { FinalCamera } from "./hero-config";
import type { SceneState } from "./tower-scene";

type Key = {
  /** Position along the camera move, 0..1. */
  at: number;
  az: number;
  radius: number;
  y: number;
  look: [number, number, number];
  fov: number;
  screen: [number, number];
};

const DEG = Math.PI / 180;

/**
 * The orbit, as four keyframes on one continuous move:
 * close-up on the lower floors → orbit rising around the tower → the matched
 * final camera. Timeline 0–15–55–70% maps to 0–0.214–0.786–1 here.
 *
 * `orbitScreenX` keeps the tower centred in what is actually on screen while
 * it orbits: on a phone the visible window is a crop held right of the 16:9
 * frame's centre, so centring on the frame would push the tower off the edge.
 */
export function cameraKeys(final: FinalCamera, mobile: boolean, orbitScreenX = 0.5): Key[] {
  const [px, py, pz] = final.position;
  const [tx, ty, tz] = final.target;
  const s = final.scale;
  const finalAz = Math.atan2(px - tx, pz - tz);
  const finalRadius = Math.hypot(px - tx, pz - tz);
  const span = (mobile ? 120 : 230) * DEG;

  return [
    { at: 0, az: finalAz - span, radius: 17 * s, y: 4 * s, look: [0, 5 * s, 0], fov: 42, screen: [orbitScreenX, 0.5] },
    {
      at: 0.214,
      az: finalAz - span * 0.86,
      radius: 26 * s,
      y: 8 * s,
      look: [0, 9 * s, 0],
      fov: 42,
      screen: [orbitScreenX, 0.5],
    },
    {
      at: 0.786,
      az: finalAz - 22 * DEG,
      radius: 54 * s,
      y: 30 * s,
      look: [0, 20 * s, 0],
      fov: 38,
      screen: [orbitScreenX, 0.5],
    },
    { at: 1, az: finalAz, radius: finalRadius, y: py, look: [tx, ty, tz], fov: final.fov, screen: final.screen },
  ];
}

/**
 * Cubic Hermite through the keys with Catmull-Rom tangents and zero tangents
 * at both ends: one smooth move that eases in and out, with no speed jumps at
 * the keyframes.
 */
function hermite(keys: Key[], c: number, pick: (k: Key) => number) {
  const n = keys.length;
  let i = 0;
  while (i < n - 2 && c > keys[i + 1].at) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const h = b.at - a.at || 1;
  const t = Math.min(Math.max((c - a.at) / h, 0), 1);

  const tangent = (j: number) => {
    if (j === 0 || j === n - 1) return 0;
    return (pick(keys[j + 1]) - pick(keys[j - 1])) / (keys[j + 1].at - keys[j - 1].at);
  };
  const m0 = tangent(i) * h;
  const m1 = tangent(i + 1) * h;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * pick(a) +
    (t3 - 2 * t2 + t) * m0 +
    (-2 * t3 + 3 * t2) * pick(b) +
    (t3 - t2) * m1
  );
}

export function sampleCamera(keys: Key[], c: number): Pick<SceneState, "position" | "target" | "fov" | "screen"> {
  const az = hermite(keys, c, (k) => k.az);
  const radius = hermite(keys, c, (k) => k.radius);
  const y = hermite(keys, c, (k) => k.y);
  const look: [number, number, number] = [
    hermite(keys, c, (k) => k.look[0]),
    hermite(keys, c, (k) => k.look[1]),
    hermite(keys, c, (k) => k.look[2]),
  ];
  return {
    position: [look[0] + Math.sin(az) * radius, y, look[2] + Math.cos(az) * radius],
    target: look,
    fov: hermite(keys, c, (k) => k.fov),
    screen: [hermite(keys, c, (k) => k.screen[0]), hermite(keys, c, (k) => k.screen[1])],
  };
}
