import { Color } from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

/**
 * A fat-line material whose segments draw themselves on.
 *
 * three's LineMaterial is extended rather than replaced: each instanced
 * segment gets an `instanceOrder`, and while `uDraw` sweeps from 0 to 1 a
 * segment grows from its start point to its end over `uWindow` of that sweep.
 * Segments not yet reached are discarded outright.
 *
 * Lines also dim with distance from the camera (`uNear` → `uFar`), which is
 * the "nearer = brighter" depth cue from the brief.
 */
export function createLineMaterial(options: { linewidth: number; opacity: number }) {
  const material = new LineMaterial({
    color: new Color("#ffffff"),
    linewidth: options.linewidth,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    worldUnits: false,
  });

  Object.assign(material.uniforms, {
    uDraw: { value: 0 },
    uWindow: { value: 0.025 },
    uNear: { value: 20 },
    uFar: { value: 80 },
    uFadeMin: { value: 0.32 },
    uOpacity: { value: options.opacity },
  });

  const vertexHook = "vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );";
  const fragmentHook = "gl_FragColor = vec4( diffuseColor.rgb, alpha );";
  if (!material.vertexShader.includes(vertexHook) || !material.fragmentShader.includes(fragmentHook)) {
    // three changed its line shader; fail loudly rather than drawing nothing.
    throw new Error("LineMaterial shader hooks not found — update line-material.ts for this three version.");
  }

  material.vertexShader = material.vertexShader
    .replace(
      "attribute vec3 instanceEnd;",
      `attribute vec3 instanceEnd;
      attribute float instanceOrder;
      uniform float uDraw;
      uniform float uWindow;
      uniform float uNear;
      uniform float uFar;
      varying float vReveal;
      varying float vFade;`,
    )
    .replace(
      vertexHook,
      `${vertexHook}
      vReveal = clamp( ( uDraw - instanceOrder ) / uWindow, 0.0, 1.0 );
      end.xyz = mix( start.xyz, end.xyz, vReveal );
      vFade = 1.0 - clamp( ( -start.z - uNear ) / max( uFar - uNear, 0.001 ), 0.0, 1.0 );`,
    );

  material.fragmentShader = material.fragmentShader
    .replace(
      "uniform float linewidth;",
      `uniform float linewidth;
      uniform float uOpacity;
      uniform float uFadeMin;
      varying float vReveal;
      varying float vFade;`,
    )
    .replace(
      fragmentHook,
      `if ( vReveal <= 0.0 ) discard;
      gl_FragColor = vec4( diffuseColor.rgb, alpha * uOpacity * mix( uFadeMin, 1.0, vFade ) );`,
    );

  return material;
}

export type DrawingMaterial = ReturnType<typeof createLineMaterial>;
