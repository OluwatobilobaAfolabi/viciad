"use client";

import { useEffect, useRef } from "react";

/*
 * A wireframe construction loop for the hero, drawn as a white technical
 * elevation on the dark ground: a tower crane raises a high-rise, it dissolves,
 * the crane raises a cable-stayed bridge, that dissolves, then it raises the
 * jacket foundation for an oil rig.
 *
 * Structures are authored as 3D line segments and projected axonometrically, so
 * columns, slabs and bracing read with real depth. Segments carry an ordering
 * key and are revealed in construction order, each drawing itself on from one
 * end; the dissolve runs the same order backwards as a fade.
 */

type Vec3 = readonly [number, number, number];
type Segment = { a: Vec3; b: Vec3; order: number; light: boolean; at: number };

/** Axonometric skew: depth runs up and to the right. */
const ISO_X = 0.4;
const ISO_Y = 0.22;

/** Fraction of the build a single member spends drawing itself on. */
const DRAW_WINDOW = 0.022;

type Phase = "build" | "hold" | "dissolve";
const SEQUENCE = [
  { name: "highRise", build: 28000, hold: 4400, dissolve: 6000 },
  { name: "bridge", build: 25600, hold: 4400, dissolve: 6000 },
  { name: "oilRig", build: 25600, hold: 5200, dissolve: 6000 },
] as const;

class Sketch {
  segments: Segment[] = [];

  add(a: Vec3, b: Vec3, order: number, light = false) {
    this.segments.push({ a, b, order, light, at: 0 });
  }

  /** A closed rectangle in the x/y plane at depth z. */
  rect(x0: number, y0: number, x1: number, y1: number, z: number, order: number, light = false) {
    this.add([x0, y0, z], [x1, y0, z], order, light);
    this.add([x1, y0, z], [x1, y1, z], order, light);
    this.add([x1, y1, z], [x0, y1, z], order, light);
    this.add([x0, y1, z], [x0, y0, z], order, light);
  }

  /** Sorts into construction order and normalises `at` onto 0..1. */
  done(): Segment[] {
    const list = this.segments;
    list.sort((p, q) => p.order - q.order);
    const last = Math.max(list.length - 1, 1);
    list.forEach((segment, index) => {
      segment.at = index / last;
    });
    return list;
  }
}

/** Storey footprint, giving the tower its setbacks. */
function plan(floor: number) {
  if (floor < 8) return { nx: 5, nz: 2 };
  if (floor < 12) return { nx: 4, nz: 2 };
  return { nx: 3, nz: 2 };
}

function highRise(): Segment[] {
  const s = new Sketch();
  const bay = 1.55;
  const storey = 1.2;
  const floors = 15;
  const widest = 5;

  for (let f = 0; f < floors; f++) {
    const { nx, nz } = plan(f);
    const inset = ((widest - nx) * bay) / 2;
    const x = (i: number) => inset + i * bay;
    const z = (k: number) => k * bay;
    const y0 = f * storey;
    const y1 = (f + 1) * storey;
    const base = f * 10;

    // Columns on the perimeter only — an interior grid projects into visual
    // noise at this scale without adding anything you can read.
    for (let i = 0; i <= nx; i++) {
      for (let k = 0; k <= nz; k++) {
        if (i > 0 && i < nx && k > 0 && k < nz) continue;
        s.add([x(i), y0, z(k)], [x(i), y1, z(k)], base);
      }
    }

    // Floor beams: spanning members on the front and back frames, depth
    // members on the two side frames, plus the slab edge just below.
    for (const k of [0, nz]) {
      for (let i = 0; i < nx; i++) {
        s.add([x(i), y1, z(k)], [x(i + 1), y1, z(k)], base + 1);
        if (f === 0) s.add([x(i), 0, z(k)], [x(i + 1), 0, z(k)], base + 1);
        if (k === 0) s.add([x(i), y1 - 0.11, z(k)], [x(i + 1), y1 - 0.11, z(k)], base + 1, true);
      }
    }
    for (const i of [0, nx]) {
      for (let k = 0; k < nz; k++) {
        s.add([x(i), y1, z(k)], [x(i), y1, z(k + 1)], base + 2);
        if (f === 0) s.add([x(i), 0, z(k)], [x(i), 0, z(k + 1)], base + 2);
      }
    }

    // Bracing, kept inside a single bay so it reads as a braced core rather
    // than a diagonal cutting across the whole elevation.
    if (f % 3 === 1) {
      const i = Math.max(Math.floor(nx / 2) - 1, 0);
      s.add([x(i), y0, 0], [x(i + 1), y1, 0], base + 3, true);
      s.add([x(i + 1), y0, 0], [x(i), y1, 0], base + 3, true);
      s.add([x(0), y0, z(0)], [x(0), y1, z(1)], base + 3, true);
      s.add([x(0), y0, z(1)], [x(0), y1, z(0)], base + 3, true);
    }

    // Facade mullions on the front plane, one per bay, trailing the frame.
    if (f < floors - 3) {
      for (let i = 0; i < nx; i++) {
        s.add([x(i) + bay / 2, y0, 0], [x(i) + bay / 2, y1, 0], base + 4, true);
      }
    }

    // Edge handrail posts on the working floor.
    if (f === floors - 1) {
      for (let i = 0; i <= nx * 3; i++) {
        const px = inset + (i * bay) / 3;
        s.add([px, y1, 0], [px, y1 + 0.3, 0], base + 5, true);
      }
      s.add([inset, y1 + 0.3, 0], [inset + nx * bay, y1 + 0.3, 0], base + 5, true);
    }
  }

  // Crown and mast.
  const top = floors * storey;
  const { nx, nz } = plan(floors - 1);
  const inset = ((widest - nx) * bay) / 2;
  s.rect(inset, top, inset + nx * bay, top + 0.7, 0, floors * 10 + 6);
  const mx = inset + (nx * bay) / 2;
  s.add([mx, top + 0.7, (nz * bay) / 2], [mx, top + 2.2, (nz * bay) / 2], floors * 10 + 7);

  return s.done();
}

function bridge(): Segment[] {
  const s = new Sketch();
  const span = 21;
  const width = 2.4;
  const deck = 3.4;
  const pylons = [6, 15];
  const towerTop = deck + 7.2;

  // Piers and abutments.
  for (const p of pylons) {
    for (const k of [0, width]) {
      s.add([p - 0.35, 0, k], [p - 0.35, deck, k], 0);
      s.add([p + 0.35, 0, k], [p + 0.35, deck, k], 0);
    }
    s.add([p - 0.35, 0, 0], [p - 0.35, 0, width], 1, true);
    s.add([p, deck, 0], [p, deck, width], 1, true);
  }
  for (const e of [0, span]) {
    for (const k of [0, width]) s.add([e, 0, k], [e, deck, k], 2);
    s.add([e, 0, 0], [e, 0, width], 2, true);
  }

  // Deck: edge girders, a lower chord and cross members.
  for (const k of [0, width]) {
    s.add([0, deck, k], [span, deck, k], 10);
    s.add([0, deck - 0.3, k], [span, deck - 0.3, k], 10, true);
  }
  for (let x = 0; x <= span; x += 0.75) {
    s.add([x, deck, 0], [x, deck, width], 11, true);
    if (x % 1.5 < 0.01) s.add([x, deck - 0.3, 0], [x, deck - 0.3, width], 11, true);
  }

  // Pylons: two legs per tower, tied across.
  for (const p of pylons) {
    for (const k of [0, width]) {
      s.add([p - 0.3, deck, k], [p - 0.12, towerTop, k], 20);
      s.add([p + 0.3, deck, k], [p + 0.12, towerTop, k], 20);
    }
    for (const level of [0.35, 0.7, 0.95]) {
      const y = deck + (towerTop - deck) * level;
      s.add([p - 0.2, y, 0], [p + 0.2, y, 0], 21, true);
      s.add([p - 0.2, y, width], [p + 0.2, y, width], 21, true);
      s.add([p, y, 0], [p, y, width], 21, true);
    }
  }

  // Stay cables, fanning both ways from each head.
  for (const p of pylons) {
    for (let n = 1; n <= 6; n++) {
      const reach = n * 1.45;
      const head = towerTop - n * 0.16;
      for (const k of [0, width]) {
        s.add([p, head, k], [Math.max(0.4, p - reach), deck, k], 30 + n, true);
        s.add([p, head, k], [Math.min(span - 0.4, p + reach), deck, k], 30 + n, true);
      }
    }
  }

  return s.done();
}

function oilRig(): Segment[] {
  const s = new Sketch();
  const height = 9.4;
  const levels = 4;
  const topHalf = 2.1;
  const botHalf = 3.6;
  const topDepth = 1.6;
  const botDepth = 2.8;

  const legX = (side: number, t: number) => side * (topHalf + (botHalf - topHalf) * (1 - t));
  const legZ = (side: number, t: number) => side * (topDepth + (botDepth - topDepth) * (1 - t));
  const corners: [number, number][] = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  const node = (corner: [number, number], t: number): Vec3 => [
    legX(corner[0], t),
    height * t,
    legZ(corner[1], t),
  ];

  // Mud mats on the seabed.
  for (const corner of corners) {
    const p = node(corner, 0);
    s.rect(p[0] - 0.55, 0, p[0] + 0.55, 0.12, p[2], 0, true);
    s.add([p[0] - 0.55, 0.06, p[2] - 0.5], [p[0] + 0.55, 0.06, p[2] - 0.5], 0, true);
  }

  // Battered legs, level by level, with a ring beam and X-bracing per bay.
  for (let level = 0; level < levels; level++) {
    const t0 = level / levels;
    const t1 = (level + 1) / levels;
    const base = 10 + level * 10;

    for (const corner of corners) s.add(node(corner, t0), node(corner, t1), base);

    for (let i = 0; i < corners.length; i++) {
      const a = corners[i];
      const b = corners[(i + 1) % corners.length];
      s.add(node(a, t1), node(b, t1), base + 1);
      s.add(node(a, t0), node(b, t1), base + 2, true);
      s.add(node(b, t0), node(a, t1), base + 2, true);
    }
  }

  // Waterline.
  const water = height * 0.62;
  for (let x = -6.2; x < 6.2; x += 1.1) {
    s.add([x, water, botDepth * 0.4], [x + 0.6, water, botDepth * 0.4], 45, true);
  }

  // Deck box and derrick.
  const deckY = height;
  const dx = topHalf + 0.8;
  const dz = topDepth + 0.6;
  for (const k of [-dz, dz]) {
    s.add([-dx, deckY, k], [dx, deckY, k], 50);
    s.add([-dx, deckY + 1.1, k], [dx, deckY + 1.1, k], 51);
  }
  for (const x of [-dx, dx]) {
    s.add([x, deckY, -dz], [x, deckY, dz], 50);
    s.add([x, deckY + 1.1, -dz], [x, deckY + 1.1, dz], 51);
    s.add([x, deckY, -dz], [x, deckY + 1.1, -dz], 51);
    s.add([x, deckY, dz], [x, deckY + 1.1, dz], 51);
  }
  for (let x = -dx; x <= dx; x += 0.9) {
    s.add([x, deckY, -dz], [x, deckY + 1.1, -dz], 52, true);
  }

  const derrickTop = deckY + 4.2;
  const legs: [number, number][] = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  for (const [sx, sz] of legs) {
    s.add([sx * 1.1, deckY + 1.1, sz * 0.8], [sx * 0.28, derrickTop, sz * 0.2], 60);
  }
  for (let n = 1; n <= 4; n++) {
    const t = n / 5;
    const y = deckY + 1.1 + (derrickTop - deckY - 1.1) * t;
    const hx = 1.1 - 0.82 * t;
    const hz = 0.8 - 0.6 * t;
    s.rect(-hx, y, hx, y + 0.02, -hz, 60 + n, true);
    s.rect(-hx, y, hx, y + 0.02, hz, 60 + n, true);
  }

  return s.done();
}

export function HeroConstruction() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;

    const scenes: Record<string, { segments: Segment[]; anchorX: number; craneGap: number }> = {
      highRise: { segments: highRise(), anchorX: -4, craneGap: 5.4 },
      bridge: { segments: bridge(), anchorX: -10.5, craneGap: 3.2 },
      oilRig: { segments: oilRig(), anchorX: 0, craneGap: 6.6 },
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let scale = 26;
    let originX = 0;
    let originY = 0;
    let dpr = 1;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      scale = Math.max(12, Math.min(30, rect.height / 33));
      originX = rect.width * 0.6;
      originY = rect.height - Math.max(48, rect.height * 0.09);
    };

    resize();

    const px = (p: Vec3, ox: number) => originX + (p[0] + ox + p[2] * ISO_X) * scale;
    const py = (p: Vec3) => originY - (p[1] + p[2] * ISO_Y) * scale;

    /** Groups segments into one path per weight, so a frame is two stroke calls. */
    const strokeSet = (
      segments: Segment[],
      ox: number,
      alphaOf: (segment: Segment) => number,
      lengthOf: (segment: Segment) => number,
    ) => {
      const buckets = new Map<string, Path2D>();
      for (const segment of segments) {
        const alpha = alphaOf(segment);
        if (alpha <= 0.02) continue;
        const grow = lengthOf(segment);
        if (grow <= 0) continue;

        const step = Math.min(Math.round(alpha * 6), 6);
        const bucketKey = `${step}|${segment.light ? 1 : 0}`;
        let path = buckets.get(bucketKey);
        if (!path) {
          path = new Path2D();
          buckets.set(bucketKey, path);
        }
        const ax = px(segment.a, ox);
        const ay = py(segment.a);
        const bx = px(segment.b, ox);
        const by = py(segment.b);
        path.moveTo(ax, ay);
        path.lineTo(ax + (bx - ax) * grow, ay + (by - ay) * grow);
      }

      for (const [bucketKey, path] of buckets) {
        const [step, light] = bucketKey.split("|");
        const alpha = (Number(step) / 6) * (light === "1" ? 0.5 : 0.92);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = light === "1" ? 1 : 1.35;
        ctx.stroke(path);
      }
    };

    const drawGround = (alpha: number) => {
      const rect = parent.getBoundingClientRect();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, originY + 0.5);
      ctx.lineTo(rect.width, originY + 0.5);
      ctx.stroke();
    };

    /** A lattice tower crane, drawn live rather than revealed. */
    const drawCrane = (
      baseX: number,
      baseZ: number,
      mastTop: number,
      jib: number,
      counter: number,
      trolley: number,
      hookY: number,
      alpha: number,
      light = false,
    ) => {
      const w = 0.34;
      const path = new Path2D();
      const seg = (a: Vec3, b: Vec3) => {
        path.moveTo(px(a, baseX), py(a));
        path.lineTo(px(b, baseX), py(b));
      };

      // Mast: front and back rails, X-lattice on the front, ties across.
      for (const z of [baseZ - w, baseZ + w]) {
        seg([-w, 0, z], [-w, mastTop, z]);
        seg([w, 0, z], [w, mastTop, z]);
      }
      for (let y = 0; y < mastTop - 0.6; y += 0.62) {
        const zf = baseZ - w;
        seg([-w, y, zf], [w, y + 0.62, zf]);
        seg([w, y, zf], [-w, y + 0.62, zf]);
        seg([-w, y, zf], [w, y, zf]);
        seg([-w, y, baseZ - w], [-w, y, baseZ + w]);
      }

      // Splayed footing.
      seg([-w - 0.7, 0, baseZ - w], [w + 0.7, 0, baseZ - w]);
      seg([-w - 0.7, 0, baseZ - w], [-w, 1.1, baseZ - w]);
      seg([w + 0.7, 0, baseZ - w], [w, 1.1, baseZ - w]);
      seg([-w - 0.7, 0, baseZ - w], [-w - 0.7, 0, baseZ + w]);
      seg([w + 0.7, 0, baseZ - w], [w + 0.7, 0, baseZ + w]);

      // Operator's cab.
      const cab = mastTop - 1.15;
      for (const z of [baseZ - w, baseZ + w * 0.2]) {
        seg([w, cab, z], [w + 0.8, cab, z]);
        seg([w, cab + 0.95, z], [w + 0.8, cab + 0.95, z]);
        seg([w + 0.8, cab, z], [w + 0.8, cab + 0.7, z]);
        seg([w + 0.8, cab + 0.7, z], [w, cab + 0.95, z]);
      }

      // Slewing ring and the jib pair.
      const top = mastTop;
      for (const z of [baseZ - w, baseZ + w]) {
        seg([-counter, top, z], [jib, top, z]);
        seg([-counter, top + 0.42, z], [-counter + 0.5, top + 0.42, z]);
      }
      // Jib bottom chord and zig-zag web.
      const zf = baseZ - w;
      seg([0, top - 0.55, zf], [jib * 0.82, top - 0.1, zf]);
      for (let x = 0; x < jib * 0.82; x += 0.85) {
        const t0 = x / (jib * 0.82);
        seg([x, top, zf], [x + 0.42, top - 0.55 + 0.45 * t0, zf]);
        seg([x + 0.42, top - 0.55 + 0.45 * t0, zf], [Math.min(x + 0.85, jib * 0.82), top, zf]);
      }
      // Counter-jib platform and counterweight.
      seg([-counter, top, zf], [-counter, top - 0.7, zf]);
      seg([-counter, top - 0.7, zf], [-0.6, top - 0.55, zf]);
      for (const z of [baseZ - w, baseZ + w]) {
        seg([-counter + 0.15, top - 0.75, z], [-counter + 1.25, top - 0.75, z]);
        seg([-counter + 0.15, top - 0.05, z], [-counter + 0.15, top - 0.75, z]);
        seg([-counter + 1.25, top - 0.05, z], [-counter + 1.25, top - 0.75, z]);
      }

      // A-frame apex with tie bars fore and aft.
      const apex = top + 1.9;
      seg([-0.35, top + 0.4, zf], [0, apex, zf]);
      seg([0.35, top + 0.4, zf], [0, apex, zf]);
      seg([0, apex, zf], [jib * 0.97, top, zf]);
      seg([0, apex, zf], [-counter + 0.1, top, zf]);

      // Trolley, hoist rope, hook block, spreader and load.
      seg([trolley - 0.3, top, zf], [trolley - 0.3, top - 0.32, zf]);
      seg([trolley + 0.3, top, zf], [trolley + 0.3, top - 0.32, zf]);
      seg([trolley - 0.3, top - 0.32, zf], [trolley + 0.3, top - 0.32, zf]);
      seg([trolley, top - 0.32, zf], [trolley, hookY + 0.75, zf]);
      seg([trolley - 0.22, hookY + 0.75, zf], [trolley + 0.22, hookY + 0.75, zf]);
      seg([trolley - 0.22, hookY + 0.55, zf], [trolley + 0.22, hookY + 0.55, zf]);
      seg([trolley - 0.22, hookY + 0.75, zf], [trolley - 0.22, hookY + 0.55, zf]);
      seg([trolley + 0.22, hookY + 0.75, zf], [trolley + 0.22, hookY + 0.55, zf]);
      seg([trolley, hookY + 0.55, zf], [trolley - 0.62, hookY, zf]);
      seg([trolley, hookY + 0.55, zf], [trolley + 0.62, hookY, zf]);
      for (const z of [zf, zf + 0.55]) {
        seg([trolley - 0.62, hookY, z], [trolley + 0.62, hookY, z]);
        seg([trolley - 0.62, hookY - 0.62, z], [trolley + 0.62, hookY - 0.62, z]);
        seg([trolley - 0.62, hookY, z], [trolley - 0.62, hookY - 0.62, z]);
        seg([trolley + 0.62, hookY, z], [trolley + 0.62, hookY - 0.62, z]);
      }

      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * (light ? 0.4 : 0.92)})`;
      ctx.lineWidth = light ? 1 : 1.35;
      ctx.stroke(path);
    };

    let stage = 0;
    let phase: Phase = "build";
    let phaseStart = 0;

    let craneX = 0;
    let trolleyX = 0;
    let hookY = 0;
    let primed = false;

    const approach = (current: number, target: number, rate: number, dt: number) =>
      current + (target - current) * (1 - Math.exp(-rate * dt));

    const renderFrame = (
      scene: { segments: Segment[]; anchorX: number; craneGap: number },
      revealed: number,
      alphaOf: (segment: Segment) => number,
      craneAlpha: number,
      mastTop: number,
    ) => {
      const rect = parent.getBoundingClientRect();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      drawGround(Math.max(craneAlpha, 0.35));

      // Background crane, smaller and dimmer, to give the site some depth.
      drawCrane(scene.anchorX + 16, 2.6, mastTop * 0.72, 7, 2.4, 4.4, mastTop * 0.34, craneAlpha, true);

      strokeSet(scene.segments, scene.anchorX, alphaOf, (segment) => {
        if (segment.at > revealed) return 0;
        const age = (revealed - segment.at) / DRAW_WINDOW;
        return age >= 1 ? 1 : Math.max(age, 0);
      });

      drawCrane(craneX, 1.2, mastTop, 11, 3.6, trolleyX, hookY, craneAlpha);
    };

    const staticFrame = () => {
      const scene = scenes.highRise;
      const mastTop = 21;
      craneX = scene.anchorX - scene.craneGap;
      trolleyX = scene.craneGap + 4;
      hookY = 15;
      renderFrame(scene, 1, () => 1, 0.92, mastTop);
    };

    if (reduced) {
      staticFrame();
      const onResizeStatic = () => {
        resize();
        staticFrame();
      };
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    let raf = 0;
    let running = false;
    let last = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!phaseStart) phaseStart = now;

      const step = SEQUENCE[stage];
      const scene = scenes[step.name];
      const segments = scene.segments;
      const elapsed = now - phaseStart;

      let top = 0;
      for (const segment of segments) top = Math.max(top, segment.a[1], segment.b[1]);
      const mastTop = top + 2.4;

      if (phase === "dissolve") {
        const q = Math.min(elapsed / step.dissolve, 1);
        // Unbuild in reverse: the last members placed are the first to go.
        renderFrame(
          scene,
          1,
          (segment) => {
            const start = (1 - segment.at) * 0.68;
            return 1 - Math.min(Math.max((q - start) / 0.3, 0), 1);
          },
          1 - q,
          mastTop,
        );
        if (q >= 1) {
          stage = (stage + 1) % SEQUENCE.length;
          phase = "build";
          phaseStart = now;
          primed = false;
        }
      } else {
        const revealed =
          phase === "hold" ? 1 : Math.min(elapsed / step.build, 1) * (1 + DRAW_WINDOW);
        const index = Math.min(Math.floor(revealed * segments.length), segments.length - 1);
        const active = segments[index];
        const midX = (active.a[0] + active.b[0]) / 2;
        const midY = (active.a[1] + active.b[1]) / 2;

        const targetCrane = scene.anchorX + midX - scene.craneGap;
        if (!primed) {
          craneX = targetCrane;
          trolleyX = scene.craneGap;
          hookY = midY + 1.4;
          primed = true;
        } else {
          craneX = approach(craneX, targetCrane, 1.6, dt);
          trolleyX = approach(trolleyX, scene.anchorX + midX - craneX, 6, dt);
          hookY = approach(hookY, phase === "hold" ? mastTop - 5 : midY + 1.4, 7, dt);
        }

        renderFrame(scene, revealed, () => 1, 1, mastTop);

        if (phase === "build" && elapsed >= step.build) {
          phase = "hold";
          phaseStart = now;
        } else if (phase === "hold" && elapsed >= step.hold) {
          phase = "dissolve";
          phaseStart = now;
        }
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      last = performance.now();
      phaseStart = 0;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    observer.observe(parent);

    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => resize();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.5] [mask-image:linear-gradient(to_right,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.26)_34%,rgba(0,0,0,1)_66%)]"
    />
  );
}
