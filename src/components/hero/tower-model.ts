/*
 * The procedural tower, modelled on /hero/blueprint.jpg.
 *
 * Everything is plain line segments in world units: a floor is 1 tall and a
 * structural bay 1.714 wide (solved from the drawing alongside the camera),
 * so the main frame is 13.7 × 12.0 in plan, roof at y = 24. It is
 * centred on the origin with the front face towards +z; the drawing looks at
 * the +x/+z corner, front face on the left, side face on the right.
 *
 * Each segment carries a build order in 0..1. The shader reveals segments as
 * the scroll-driven `draw` value passes their order, so the order is what makes
 * the building appear to be constructed: bottom to top, the core after the
 * frame, the cranes last.
 */

type V3 = [number, number, number];

export type LineLayer = { positions: Float32Array; orders: Float32Array };

export type TowerModel = {
  /** Primary structure: columns, slab edges, crane chords. */
  main: LineLayer;
  /** Secondary detail: railings, glazing grid, lattice bracing, formwork. */
  fine: LineLayer;
  /** Drawing annotations: dimension lines and a ground grid. Always fully drawn. */
  anno: LineLayer;
  labels: { text: string; at: V3 }[];
};

export type Detail = "high" | "low";

const BAYS_X = 8;
const BAYS_Z = 7;
const BAY = 1.714;
const FLOORS = 24;
const X0 = -(BAYS_X * BAY) / 2;
const Z0 = -(BAYS_Z * BAY) / 2;
const ROOF = 24;

/** Height of the cap's top: the highest structural point. */
const STRUCTURE_TOP = 33.1;
/** Structure is ordered into 0..STRUCTURE_SHARE; cranes take the rest. */
const STRUCTURE_SHARE = 0.78;

class Lines {
  private pos: number[] = [];
  private ord: number[] = [];

  seg(a: V3, b: V3, order: number) {
    this.pos.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    this.ord.push(order);
  }

  build(): LineLayer {
    return { positions: new Float32Array(this.pos), orders: new Float32Array(this.ord) };
  }
}

/** Build order for structure: by height, then sweeping left to right. */
function structural(y: number, x = 0) {
  const sweep = ((x - X0) / (BAYS_X * BAY)) * 0.006;
  return Math.min(Math.max(y / STRUCTURE_TOP, 0), 1) * STRUCTURE_SHARE + sweep;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** The 12 edges of an axis-aligned box. */
function box(lines: Lines, min: V3, max: V3, order: (y: number, x: number) => number) {
  const [x0, y0, z0] = min;
  const [x1, y1, z1] = max;
  for (const y of [y0, y1]) {
    lines.seg([x0, y, z0], [x1, y, z0], order(y, x0));
    lines.seg([x1, y, z0], [x1, y, z1], order(y, x1));
    lines.seg([x1, y, z1], [x0, y, z1], order(y, x0));
    lines.seg([x0, y, z1], [x0, y, z0], order(y, x0));
  }
  for (const [x, z] of [
    [x0, z0],
    [x1, z0],
    [x1, z1],
    [x0, z1],
  ] as const) {
    lines.seg([x, y0, z], [x, y1, z], order(y0, x));
  }
}

/** A horizontal ring around a box footprint at height y. */
function ring(lines: Lines, x0: number, x1: number, z0: number, z1: number, y: number, order: number) {
  lines.seg([x0, y, z0], [x1, y, z0], order);
  lines.seg([x1, y, z0], [x1, y, z1], order);
  lines.seg([x1, y, z1], [x0, y, z1], order);
  lines.seg([x0, y, z1], [x0, y, z0], order);
}

/**
 * A square lattice crane mast: four chords split per panel so they draw
 * upwards, with X-bracing on every face.
 */
function mast(
  main: Lines,
  fine: Lines,
  base: V3,
  height: number,
  width: number,
  order0: number,
  order1: number,
  detail: Detail,
) {
  const h = width;
  const panels = Math.max(1, Math.round(height / h));
  const step = height / panels;
  const w = width / 2;
  const corners: V3[] = [
    [-w, 0, -w],
    [w, 0, -w],
    [w, 0, w],
    [-w, 0, w],
  ];
  for (let p = 0; p < panels; p++) {
    const y0 = base[1] + p * step;
    const y1 = y0 + step;
    const o = lerp(order0, order1, p / panels);
    for (let c = 0; c < 4; c++) {
      const a = corners[c];
      const b = corners[(c + 1) % 4];
      main.seg([base[0] + a[0], y0, base[2] + a[2]], [base[0] + a[0], y1, base[2] + a[2]], o);
      fine.seg([base[0] + a[0], y1, base[2] + a[2]], [base[0] + b[0], y1, base[2] + b[2]], o);
      if (detail === "high" || c % 2 === 0) {
        fine.seg([base[0] + a[0], y0, base[2] + a[2]], [base[0] + b[0], y1, base[2] + b[2]], o);
        fine.seg([base[0] + b[0], y0, base[2] + b[2]], [base[0] + a[0], y1, base[2] + a[2]], o);
      }
    }
  }
}

/**
 * A triangular lattice jib from `start` to `end`, tapering towards the tip,
 * with zig-zag webbing on each face.
 */
function jib(
  main: Lines,
  fine: Lines,
  start: V3,
  end: V3,
  width: number,
  order0: number,
  order1: number,
) {
  const dir = norm([end[0] - start[0], end[1] - start[1], end[2] - start[2]]);
  const helper: V3 = Math.abs(dir[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  const side = norm(cross(dir, helper));
  const up = norm(cross(side, dir));
  const length = Math.hypot(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
  const panels = Math.max(2, Math.round(length / (width * 1.1)));

  const chords = (t: number): V3[] => {
    const p = add(start, scale(dir, length * t));
    const w = width * lerp(1, 0.35, t);
    return [add(p, scale(side, w / 2)), add(p, scale(side, -w / 2)), add(p, scale(up, w * 0.85))];
  };

  for (let i = 0; i < panels; i++) {
    const t0 = i / panels;
    const t1 = (i + 1) / panels;
    const a = chords(t0);
    const b = chords(t1);
    const o = lerp(order0, order1, t0);
    for (let c = 0; c < 3; c++) {
      main.seg(a[c], b[c], o);
      fine.seg(a[c], b[(c + 1) % 3], o);
      fine.seg(b[c], b[(c + 1) % 3], o);
    }
  }
}

/** A straight hoist cable hanging from a jib tip. */
function cable(fine: Lines, from: V3, toY: number, order: number) {
  fine.seg(from, [from[0], toY, from[2]], order);
}

/** A luffing crane: mast, jib at an angle in the x/y plane, A-frame and cable. */
function crane(
  main: Lines,
  fine: Lines,
  opts: {
    base: V3;
    mastHeight: number;
    mastWidth: number;
    /** Jib angle above +x, in degrees (90 = straight up, >90 leans left). */
    angle: number;
    jibLength: number;
    counter: number;
    cableTo: number | null;
    order: [number, number];
    detail: Detail;
  },
) {
  const { base, mastHeight, mastWidth, angle, jibLength, counter, cableTo, order, detail } = opts;
  const [o0, o1] = order;
  const span = o1 - o0;
  mast(main, fine, base, mastHeight, mastWidth, o0, o0 + span * 0.55, detail);

  const top: V3 = [base[0], base[1] + mastHeight, base[2]];
  // Slewing unit and cab.
  box(
    main,
    [top[0] - mastWidth * 0.8, top[1], top[2] - mastWidth * 0.8],
    [top[0] + mastWidth * 0.8, top[1] + mastWidth * 0.9, top[2] + mastWidth * 0.8],
    () => o0 + span * 0.56,
  );

  const rad = (angle * Math.PI) / 180;
  const pivot: V3 = [top[0], top[1] + mastWidth * 0.9, top[2]];
  const tip: V3 = [pivot[0] + Math.cos(rad) * jibLength, pivot[1] + Math.sin(rad) * jibLength, pivot[2]];
  jib(main, fine, pivot, tip, mastWidth * 0.9, o0 + span * 0.6, o0 + span * 0.9);

  // Counter-jib, pointing away from the jib, with its counterweight.
  const back = Math.cos(rad) >= 0 ? -1 : 1;
  const counterEnd: V3 = [pivot[0] + back * counter, pivot[1] + 0.2, pivot[2]];
  main.seg(pivot, counterEnd, o0 + span * 0.62);
  box(
    main,
    [counterEnd[0] - 0.35, counterEnd[1] - 0.7, counterEnd[2] - 0.35],
    [counterEnd[0] + 0.35, counterEnd[1], counterEnd[2] + 0.35],
    () => o0 + span * 0.64,
  );

  // A-frame and the pendant lines that hold the jib.
  const apex: V3 = [pivot[0], pivot[1] + mastWidth * 3, pivot[2]];
  main.seg(pivot, apex, o0 + span * 0.66);
  fine.seg(apex, tip, o0 + span * 0.92);
  fine.seg(apex, counterEnd, o0 + span * 0.92);

  if (cableTo !== null) cable(fine, tip, cableTo, o0 + span * 0.97);
}

export function buildTower(detail: Detail): TowerModel {
  const main = new Lines();
  const fine = new Lines();
  const anno = new Lines();
  const high = detail === "high";

  const xs = Array.from({ length: BAYS_X + 1 }, (_, i) => X0 + i * BAY);
  const zs = Array.from({ length: BAYS_Z + 1 }, (_, k) => Z0 + k * BAY);
  const X1 = X0 + BAYS_X * BAY;
  const Z1 = Z0 + BAYS_Z * BAY;

  /* ---------- Main frame: 24 floors of columns, slab edges and railings ---------- */
  for (let f = 0; f < FLOORS; f++) {
    const y0 = f;
    const y1 = f + 1;

    // Perimeter columns.
    for (const x of xs) {
      for (const z of zs) {
        const perimeter = x === X0 || x === X1 || z === Z0 || z === Z1;
        if (!perimeter) continue;
        main.seg([x, y0, z], [x, y1, z], structural(y0 + 0.35, x));
      }
    }

    // Slab edges: top line structural, underside line fine, then the railing.
    const edges: [V3, V3][] = [];
    for (let i = 0; i < BAYS_X; i++) {
      edges.push([[xs[i], y1, Z1], [xs[i + 1], y1, Z1]]);
      edges.push([[xs[i], y1, Z0], [xs[i + 1], y1, Z0]]);
    }
    for (let k = 0; k < BAYS_Z; k++) {
      edges.push([[X0, y1, zs[k]], [X0, y1, zs[k + 1]]]);
      edges.push([[X1, y1, zs[k]], [X1, y1, zs[k + 1]]]);
    }
    for (const [a, b] of edges) {
      const o = structural(y1, a[0]);
      main.seg(a, b, o);
      fine.seg([a[0], a[1] - 0.14, a[2]], [b[0], b[1] - 0.14, b[2]], o);
      if (high) fine.seg([a[0], a[1] + 0.32, a[2]], [b[0], b[1] + 0.32, b[2]], o + 0.002);
    }

    // Interior floor beams, so the frame reads as a see-through drawing.
    if (high || f % 2 === 1) {
      for (let k = 1; k < BAYS_Z; k++) {
        for (let i = 0; i < BAYS_X; i++) {
          fine.seg([xs[i], y1, zs[k]], [xs[i + 1], y1, zs[k]], structural(y1, xs[i]));
        }
      }
    }
  }

  /* ---------- Two scaffold / formwork bands wrapping the lower floors ---------- */
  for (const [yb, yt] of [
    [6.1, 7.6],
    [8.3, 9.8],
  ] as const) {
    const p = 0.35;
    const bx0 = X0 - p;
    const bx1 = X1 + p;
    const bz0 = Z0 - p;
    const bz1 = Z1 + p;
    ring(main, bx0, bx1, bz0, bz1, yb, structural(yb));
    ring(main, bx0, bx1, bz0, bz1, yt, structural(yt));
    ring(fine, bx0, bx1, bz0, bz1, (yb + yt) / 2, structural(yt));
    const step = high ? 1 : 2;
    for (let x = bx0; x <= bx1 + 0.01; x += step) {
      for (const z of [bz0, bz1]) {
        fine.seg([x, yb, z], [x, yt, z], structural(yb, x));
      }
    }
    for (let z = bz0; z <= bz1 + 0.01; z += step) {
      for (const x of [bx0, bx1]) {
        fine.seg([x, yb, z], [x, yt, z], structural(yb, x));
      }
    }
  }

  /* ---------- The shorter glass tower behind and to the left ---------- */
  {
    // Behind the frame and far enough left to show past its left edge.
    const gx0 = -15.5;
    const gx1 = -8.5;
    const gz0 = -3;
    const gz1 = 3.5;
    const top = 18;
    const order = (y: number, x: number) => structural(y, x) + 0.004;
    box(main, [gx0, 0, gz0], [gx1, top, gz1], order);
    const level = high ? 0.5 : 1;
    for (let y = level; y < top; y += level) ring(fine, gx0, gx1, gz0, gz1, y, order(y, gx0));
    const mull = high ? 0.8 : 1.6;
    const faces: [V3, V3][] = [
      [[gx0, 0, gz1], [gx1, 0, gz1]],
      [[gx1, 0, gz0], [gx1, 0, gz1]],
      [[gx0, 0, gz0], [gx1, 0, gz0]],
      [[gx0, 0, gz0], [gx0, 0, gz1]],
    ];
    for (const [a, b] of faces) {
      const len = Math.hypot(b[0] - a[0], b[2] - a[2]);
      for (let d = mull; d < len - 0.01; d += mull) {
        const t = d / len;
        const x = lerp(a[0], b[0], t);
        const z = lerp(a[2], b[2], t);
        for (let y = 0; y < top; y += 2) {
          fine.seg([x, y, z], [x, Math.min(y + 2, top), z], order(y, x));
        }
      }
    }
  }

  /* ---------- Core rising above the roof, with its formwork cap ---------- */
  {
    const cx0 = -2.4;
    const cx1 = 2.4;
    const cz0 = -2.4;
    const cz1 = 2.4;
    const coreTop = 29.4;
    box(main, [cx0, ROOF, cz0], [cx1, coreTop, cz1], structural);
    for (let y = ROOF + 1; y < coreTop; y += 1) ring(main, cx0, cx1, cz0, cz1, y, structural(y));
    const panel = high ? 0.9 : 1.8;
    for (let x = cx0 + panel; x < cx1; x += panel) {
      fine.seg([x, ROOF, cz1], [x, coreTop, cz1], structural(ROOF + 1, x));
      fine.seg([x, ROOF, cz0], [x, coreTop, cz0], structural(ROOF + 1, x));
    }
    // A lower annexe on the core's left.
    box(main, [cx0 - 1, ROOF, -1.2], [cx0, 29, 1.2], structural);

    // The jump-form cap: wider than the core, densely lined.
    const kx0 = -2.9;
    const kx1 = 2.9;
    const kz0 = -2.9;
    const kz1 = 2.9;
    box(main, [kx0, coreTop, kz0], [kx1, STRUCTURE_TOP, kz1], structural);
    const lift = high ? 0.45 : 0.9;
    for (let y = coreTop + lift; y < STRUCTURE_TOP; y += lift) {
      ring(fine, kx0, kx1, kz0, kz1, y, structural(y));
    }
    const rib = high ? 0.7 : 1.4;
    for (let x = kx0 + rib; x < kx1; x += rib) {
      fine.seg([x, coreTop, kz1], [x, STRUCTURE_TOP, kz1], structural(coreTop + 1, x));
    }
    // Platform rim on top of the cap.
    ring(main, kx0 - 0.3, kx1 + 0.3, kz0 - 0.3, kz1 + 0.3, STRUCTURE_TOP, structural(STRUCTURE_TOP));
  }

  /* ---------- Cranes: they draw in last ---------- */
  crane(main, fine, {
    base: [X0 - 1, 0, Z1 + 0.9],
    mastHeight: 19.4,
    mastWidth: 0.75,
    angle: 67,
    jibLength: 14.8,
    counter: 2.6,
    cableTo: 25,
    order: [0.78, 0.89],
    detail,
  });
  crane(main, fine, {
    base: [X1 - 1, ROOF, -2.1],
    mastHeight: 1.6,
    mastWidth: 0.6,
    angle: 61,
    jibLength: 9.6,
    counter: 2.2,
    cableTo: 0,
    order: [0.89, 0.95],
    detail,
  });
  crane(main, fine, {
    base: [0.3, STRUCTURE_TOP, 0],
    mastHeight: 3,
    mastWidth: 0.6,
    angle: 118,
    jibLength: 9,
    counter: 3,
    cableTo: null,
    order: [0.955, 1],
    detail,
  });
  // Two small luffing jibs on the cap corners.
  jib(main, fine, [-2.7, STRUCTURE_TOP, 2.7], [-4.3, STRUCTURE_TOP + 2.6, 2.7], 0.35, 0.945, 0.955);
  jib(main, fine, [2.7, STRUCTURE_TOP, 2.7], [4.2, STRUCTURE_TOP + 1.9, 2.7], 0.35, 0.945, 0.955);

  /* ---------- Annotations: dimension lines, level ticks, a ground grid ---------- */
  const labels: TowerModel["labels"] = [];
  const dimX = X1 + 2.2;
  const dimZ = Z1;
  anno.seg([dimX, 0, dimZ], [dimX, ROOF, dimZ], 0);
  for (let y = 0; y <= ROOF; y += 5) {
    anno.seg([dimX - 0.4, y, dimZ], [dimX + 0.4, y, dimZ], 0);
    if (y > 0) labels.push({ text: `LVL ${String(y).padStart(2, "0")}`, at: [dimX + 0.7, y, dimZ] });
  }
  anno.seg([dimX - 0.4, ROOF, dimZ], [dimX + 0.4, ROOF, dimZ], 0);
  labels.push({ text: "ROOF +24.00", at: [dimX + 0.7, ROOF, dimZ] });

  const dimY = ROOF + 1.6;
  anno.seg([X0, dimY, Z1], [X1, dimY, Z1], 0);
  xs.forEach((x, i) => {
    anno.seg([x, dimY - 0.3, Z1], [x, dimY + 0.3, Z1], 0);
    labels.push({ text: String.fromCharCode(65 + i), at: [x, dimY + 0.9, Z1] });
  });

  for (let g = -24; g <= 24; g += 4) {
    anno.seg([g, 0, -24], [g, 0, 24], 0);
    anno.seg([-24, 0, g], [24, 0, g], 0);
  }

  return { main: main.build(), fine: fine.build(), anno: anno.build(), labels };
}

/** The point the orbit revolves around: the frame's centre, mid-height. */
export const TOWER_CENTRE: V3 = [0, 14, 0];
