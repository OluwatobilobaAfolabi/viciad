import GUI from "lil-gui";

import type { FinalCamera } from "./hero-config";

/**
 * The ?calibrate panel (development only — loaded with a dynamic import).
 *
 * It edits a working copy of FINAL_CAMERA live while the 3D lines are drawn
 * over a half-opacity copy of blueprint.jpg. "Copy values" prints the object
 * to the console and puts it on the clipboard, ready to paste into
 * hero-config.ts.
 */
export function openCalibration(options: {
  camera: FinalCamera;
  overlay: HTMLElement;
  onChange: () => void;
  onLineColor: (hex: string) => void;
}) {
  const { camera, overlay, onChange, onLineColor } = options;
  const initial: FinalCamera = JSON.parse(JSON.stringify(camera));

  const model = {
    posX: camera.position[0],
    posY: camera.position[1],
    posZ: camera.position[2],
    targetX: camera.target[0],
    targetY: camera.target[1],
    targetZ: camera.target[2],
    fov: camera.fov,
    screenX: camera.screen[0],
    screenY: camera.screen[1],
    scale: camera.scale,
    overlay: 0.5,
    violetLines: true,
    copy: () => {
      const text = format(camera);
      console.log(`Paste into src/components/hero/hero-config.ts:\n\n${text}`);
      navigator.clipboard?.writeText(text).catch(() => undefined);
    },
    reset: () => {
      Object.assign(camera, JSON.parse(JSON.stringify(initial)));
      sync();
      gui.controllersRecursive().forEach((c) => c.updateDisplay());
      onChange();
    },
  };

  const sync = () => {
    model.posX = camera.position[0];
    model.posY = camera.position[1];
    model.posZ = camera.position[2];
    model.targetX = camera.target[0];
    model.targetY = camera.target[1];
    model.targetZ = camera.target[2];
    model.fov = camera.fov;
    model.screenX = camera.screen[0];
    model.screenY = camera.screen[1];
    model.scale = camera.scale;
  };

  const apply = () => {
    camera.position = [model.posX, model.posY, model.posZ];
    camera.target = [model.targetX, model.targetY, model.targetZ];
    camera.fov = model.fov;
    camera.screen = [model.screenX, model.screenY];
    camera.scale = model.scale;
    onChange();
  };

  const gui = new GUI({ title: "Hero camera calibration" });
  const cam = gui.addFolder("Camera position");
  cam.add(model, "posX", -120, 120, 0.05).onChange(apply);
  cam.add(model, "posY", -20, 120, 0.05).onChange(apply);
  cam.add(model, "posZ", -120, 160, 0.05).onChange(apply);
  const tgt = gui.addFolder("Camera target");
  tgt.add(model, "targetX", -40, 40, 0.05).onChange(apply);
  tgt.add(model, "targetY", -10, 60, 0.05).onChange(apply);
  tgt.add(model, "targetZ", -40, 40, 0.05).onChange(apply);
  const lens = gui.addFolder("Lens");
  lens.add(model, "fov", 10, 90, 0.05).name("fov (vertical °)").onChange(apply);
  lens.add(model, "screenX", 0, 1, 0.001).name("target on screen X").onChange(apply);
  lens.add(model, "screenY", 0, 1, 0.001).name("target on screen Y").onChange(apply);
  gui.add(model, "scale", 0.5, 2, 0.001).name("model scale").onChange(apply);
  const view = gui.addFolder("Overlay");
  view
    .add(model, "overlay", 0, 1, 0.01)
    .name("blueprint opacity")
    .onChange((v: number) => (overlay.style.opacity = String(v)));
  view.add(model, "violetLines").name("violet 3D lines").onChange((on: boolean) => onLineColor(on ? "#8b5cf6" : "#ffffff"));
  gui.add(model, "copy").name("Copy values");
  gui.add(model, "reset").name("Reset");

  overlay.style.opacity = String(model.overlay);
  onLineColor("#8b5cf6");

  return () => gui.destroy();
}

function format(camera: FinalCamera) {
  const r = (n: number) => Math.round(n * 1000) / 1000;
  const v = (a: number[]) => `[${a.map(r).join(", ")}]`;
  return `export const FINAL_CAMERA: FinalCamera = {
  position: ${v(camera.position)},
  target: ${v(camera.target)},
  fov: ${r(camera.fov)},
  screen: ${v(camera.screen)},
  scale: ${r(camera.scale)},
};`;
}
