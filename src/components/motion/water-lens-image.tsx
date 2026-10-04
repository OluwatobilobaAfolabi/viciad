"use client";

import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/*
 * Draws only inside a wobbling circle around the pointer: the line drawing,
 * magnified a touch and bent harder toward the rim (as if seen through a glass
 * of water), with faint inner ripples, a little colour fringing at the edge,
 * a bright rim and a soft highlight.
 */
const FRAGMENT = `
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uRes;      // canvas size, device px
uniform vec2 uMouse;    // lens centre, device px, y up
uniform float uRadius;  // device px
uniform float uTime;
uniform float uRipple;  // 0 for reduced motion
uniform vec2 uScale;    // object-fit: cover mapping
uniform float uDpr;

vec3 sampleAt(vec2 p) {
  vec2 uv = p / uRes;
  uv.y = 1.0 - uv.y;
  uv = (uv - 0.5) * uScale + 0.5;
  return texture2D(uTex, uv).rgb;
}

void main() {
  vec2 p = gl_FragCoord.xy;
  vec2 d = p - uMouse;
  float dist = length(d);
  float ang = atan(d.y, d.x);
  float wobble = uRipple * (
    sin(ang * 5.0 + uTime * 2.1) * 0.010 +
    sin(ang * 9.0 - uTime * 2.9) * 0.006 +
    sin(ang * 3.0 + uTime * 1.3) * 0.009);
  float r = uRadius * (1.0 + wobble);
  if (r < 1.0 || dist > r + 2.0 * uDpr) discard;

  float t = clamp(dist / r, 0.0, 1.0);
  vec2 dir = d / max(dist, 0.001);
  float ring = uRipple * sin(dist / uDpr * 0.09 - uTime * 3.2) * 2.2 * uDpr * (1.0 - t);
  // Magnify gently in the middle, pull harder near the rim.
  vec2 base = uMouse + d * (0.88 - 0.22 * t * t * t) + dir * ring;
  float fringe = 0.8 * uDpr * t * t * t * t;
  vec3 col = vec3(
    sampleAt(base + dir * fringe).r,
    sampleAt(base).g,
    sampleAt(base - dir * fringe).b);

  // Rim light and a soft highlight up and to the left.
  col += vec3(0.55) * smoothstep(r - 3.0 * uDpr, r, dist);
  col += vec3(0.18) * smoothstep(0.55, 0.0, length(d / r - vec2(-0.38, 0.38)));
  col -= vec3(0.12) * smoothstep(0.6, 1.0, t);

  float alpha = 1.0 - smoothstep(r - 1.0 * uDpr, r + 1.0 * uDpr, dist);
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
  return shader;
}

/**
 * A photograph with a water-glass lens: wherever the pointer goes, a round,
 * gently rippling lens shows `reveal` — an image pixel-aligned with `src` (the
 * same scene drawn in line) — bent as if through water. It trails the pointer
 * softly, swells open on entry and closes on exit; on touch screens a press
 * and drag moves it. With `drift`, the photo also drifts slightly slower than
 * the page (which shows it slightly zoomed so no edge appears); without it,
 * the whole image is shown.
 *
 * Without WebGL it is simply the photograph. Reduced motion keeps the lens
 * but drops the ripple and the drift.
 */
export function WaterLensImage({
  src,
  reveal,
  alt,
  className,
  sizes = "100vw",
  drift = true,
}: {
  src: string;
  reveal: string;
  alt: string;
  className?: string;
  sizes?: string;
  drift?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  // The parallax drift (same as ParallaxImage).
  useGSAP(
    () => {
      if (!drift || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        inner.current,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: frame, dependencies: [drift] },
  );

  useEffect(() => {
    const box = frame.current!;
    const layer = inner.current!;
    const el = canvas.current!;
    const gl = el.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    } catch {
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes"), uMouse = u("uMouse"), uRadius = u("uRadius"), uTime = u("uTime");
    const uRipple = u("uRipple"), uScale = u("uScale"), uDpr = u("uDpr");
    gl.uniform1f(uRipple, reduced ? 0 : 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    /* ---------- The drawing, fetched once the photo is near the screen ---------- */
    let texAspect = 1.5;
    let ready = false;
    const texture = gl.createTexture();
    const load = () => {
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        texAspect = img.naturalWidth / img.naturalHeight;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        ready = true;
        size();
      };
      img.src = reveal;
    };
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        load();
      },
      { rootMargin: "400px" },
    );
    near.observe(box);

    /* ---------- Size ---------- */
    let dpr = 1;
    let maxRadius = 120;
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = layer.clientWidth;
      const h = layer.clientHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(uRes, el.width, el.height);
      gl.uniform1f(uDpr, dpr);
      // object-fit: cover, centred
      const aspect = w / h;
      if (aspect > texAspect) gl.uniform2f(uScale, 1, texAspect / aspect);
      else gl.uniform2f(uScale, aspect / texAspect, 1);
      maxRadius = Math.min(Math.max(box.clientWidth * 0.09, 64), 120);
    };
    size();
    const sizer = new ResizeObserver(size);
    sizer.observe(box);

    /* ---------- Pointer and the loop ---------- */
    let target: { x: number; y: number } | null = null;
    const lens = { x: 0, y: 0, r: 0 };
    let frameId = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const open = target !== null;
      if (target) {
        // A soft, liquid lag behind the pointer.
        lens.x += (target.x - lens.x) * 0.16;
        lens.y += (target.y - lens.y) * 0.16;
      }
      lens.r += ((open ? maxRadius : 0) - lens.r) * (open ? 0.12 : 0.16);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (ready && lens.r > 0.5) {
        const h = layer.clientHeight;
        gl.uniform2f(uMouse, lens.x * dpr, (h - lens.y) * dpr);
        gl.uniform1f(uRadius, lens.r * dpr);
        gl.uniform1f(uTime, (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      frameId = open || lens.r > 0.5 ? requestAnimationFrame(draw) : 0;
    };
    const kick = () => {
      if (!frameId) frameId = requestAnimationFrame(draw);
    };

    const toLayer = (event: PointerEvent) => {
      const rect = layer.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const onEnter = (event: PointerEvent) => {
      const point = toLayer(event);
      if (!target) Object.assign(lens, point);
      target = point;
      kick();
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && !target) return;
      target = toLayer(event);
      kick();
    };
    const onLeave = () => {
      target = null;
      kick();
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") onEnter(event);
    };
    const onEnterMouse = (event: PointerEvent) => {
      if (event.pointerType === "mouse") onEnter(event);
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") onLeave();
    };

    box.addEventListener("pointerenter", onEnterMouse);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);
    box.addEventListener("pointerdown", onDown);
    box.addEventListener("pointerup", onUp);
    box.addEventListener("pointercancel", onLeave);

    return () => {
      cancelAnimationFrame(frameId);
      near.disconnect();
      sizer.disconnect();
      box.removeEventListener("pointerenter", onEnterMouse);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
      box.removeEventListener("pointerdown", onDown);
      box.removeEventListener("pointerup", onUp);
      box.removeEventListener("pointercancel", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reveal]);

  return (
    <div ref={frame} className={cn("relative touch-pan-y overflow-hidden bg-ash", className)}>
      <div ref={inner} className={cn("absolute inset-x-0", drift ? "-inset-y-[9%]" : "inset-y-0")}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      </div>
    </div>
  );
}
