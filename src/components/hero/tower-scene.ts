import { Group, InstancedBufferAttribute, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";

import { FRAME } from "./hero-config";
import { createLineMaterial, type DrawingMaterial } from "./line-material";
import { buildTower, TOWER_CENTRE, type Detail, type LineLayer } from "./tower-model";

type V3 = [number, number, number];

/** Everything the scene needs to draw one frame. */
export type SceneState = {
  position: V3;
  target: V3;
  fov: number;
  /** Where the target sits on screen, as a fraction of the 16:9 frame. */
  screen: [number, number];
  /** Build progress, 0 → ~1.03. */
  draw: number;
  /** Annotation visibility, 0 → 1. */
  anno: number;
  scale: number;
};

function lineMesh(layer: LineLayer, material: DrawingMaterial) {
  const geometry = new LineSegmentsGeometry();
  geometry.setPositions(layer.positions);
  geometry.setAttribute("instanceOrder", new InstancedBufferAttribute(layer.orders, 1));
  const mesh = new LineSegments2(geometry, material);
  mesh.frustumCulled = false;
  return mesh;
}

/**
 * Owns the WebGL renderer, the camera and the three line meshes.
 *
 * The camera is framed against the 16:9 stills rather than the window: the
 * images are shown with object-fit: cover, so the same cover crop is applied
 * to the projection with setViewOffset. That is what keeps the lines sitting
 * on the drawing at any window shape.
 */
export class TowerScene {
  readonly labels: { text: string; at: V3 }[];
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(35, FRAME.width / FRAME.height, 0.5, 600);
  private group = new Group();
  private materials: { main: DrawingMaterial; fine: DrawingMaterial; anno: DrawingMaterial };
  private size = { width: 1, height: 1 };
  private focalX: number;
  private scratch = new Vector3();

  constructor(
    canvas: HTMLCanvasElement,
    options: { detail: Detail; focalX: number; dprCap: number; antialias?: boolean },
  ) {
    this.focalX = options.focalX;
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: options.antialias ?? true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.dprCap));

    const model = buildTower(options.detail);
    this.labels = model.labels;
    this.materials = {
      main: createLineMaterial({ linewidth: 1.25, opacity: 0.95 }),
      fine: createLineMaterial({ linewidth: 0.85, opacity: 0.5 }),
      anno: createLineMaterial({ linewidth: 0.8, opacity: 0 }),
    };
    this.group.add(lineMesh(model.anno, this.materials.anno));
    this.group.add(lineMesh(model.fine, this.materials.fine));
    this.group.add(lineMesh(model.main, this.materials.main));
    this.scene.add(this.group);
  }

  resize(width: number, height: number) {
    this.size = { width, height };
    this.renderer.setSize(width, height, false);
    for (const material of Object.values(this.materials)) material.resolution.set(width, height);
  }

  /** Calibration: tint the lines so they can be told apart from the drawing. */
  setLineColor(hex: string) {
    for (const material of Object.values(this.materials)) material.color.set(hex);
  }

  apply(state: SceneState) {
    const { width, height } = this.size;
    this.group.scale.setScalar(state.scale);
    this.group.updateMatrixWorld();

    // Cover-crop the 16:9 frame to the canvas, then lens-shift so the target
    // lands at `screen`, exactly as the stills are cropped by CSS.
    const s = Math.max(width / FRAME.width, height / FRAME.height);
    const viewW = width / s;
    const viewH = height / s;
    const cropX = (FRAME.width - viewW) * this.focalX;
    const cropY = (FRAME.height - viewH) * 0.5;
    const shiftX = (0.5 - state.screen[0]) * FRAME.width;
    const shiftY = (0.5 - state.screen[1]) * FRAME.height;

    const camera = this.camera;
    camera.fov = state.fov;
    camera.aspect = FRAME.width / FRAME.height;
    camera.position.set(...state.position);
    camera.lookAt(...state.target);
    camera.setViewOffset(FRAME.width, FRAME.height, cropX + shiftX, cropY + shiftY, viewW, viewH);

    // Fade with distance across the depth of the building.
    const centre = this.scratch.set(...TOWER_CENTRE).multiplyScalar(state.scale);
    const distance = camera.position.distanceTo(centre);
    const reach = 16 * state.scale;
    for (const material of [this.materials.main, this.materials.fine]) {
      material.uniforms.uDraw.value = state.draw;
      material.uniforms.uNear.value = distance - reach;
      material.uniforms.uFar.value = distance + reach;
    }
    this.materials.anno.uniforms.uDraw.value = 1;
    this.materials.anno.uniforms.uOpacity.value = state.anno * 0.55;
    this.materials.anno.uniforms.uNear.value = distance - reach;
    this.materials.anno.uniforms.uFar.value = distance + reach;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /** Screen position (CSS px) of a model-space point, or null if behind the camera. */
  project(point: V3): { x: number; y: number } | null {
    const v = this.scratch.set(...point).applyMatrix4(this.group.matrixWorld).project(this.camera);
    if (v.z > 1 || v.z < -1) return null;
    return { x: ((v.x + 1) / 2) * this.size.width, y: ((1 - v.y) / 2) * this.size.height };
  }

  dispose() {
    this.group.traverse((child) => {
      if (child instanceof LineSegments2) child.geometry.dispose();
    });
    for (const material of Object.values(this.materials)) material.dispose();
    this.renderer.dispose();
  }
}
