"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Longest edge of the simulation grid. Fixed, so cost doesn't track viewport size. */
const SIM_MAX = 512;
/** The wave step is integrated at a fixed 60Hz so ripples travel at the same speed on any display. */
const STEP_MS = 1000 / 60;
const MAX_STEPS_PER_FRAME = 3;
/** How long after the last touch the surface is considered still again. */
const IDLE_MS = 8000;

/** Ripples lose ~1.2% of their height per step, so a disturbance is gone in ~8s. */
const DAMPING = 0.988;
const IMPULSE_RADIUS = 0.055;
const IMPULSE_STRENGTH = 0.04;
/** Scales slope into a sample offset; ~0.16 peaks at roughly 20px on a 1440px band. */
const REFRACTION = 0.16;
const SPECULAR = 0.32;

const VERTEX_SHADER = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

/**
 * One step of the wave equation: a texel's next height is the average of its
 * neighbours minus where it was last step, which is what makes a disturbance
 * spread outwards and interfere with itself rather than just fading in place.
 * .r holds the current height, .g the previous one.
 */
const SIM_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uState;
uniform vec2 uTexel;
uniform vec2 uAspect;
uniform vec2 uPointer;
uniform vec2 uPointerPrev;
uniform float uPointerActive;
uniform float uRadius;
uniform float uStrength;
uniform float uDamping;

float segmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  return distance(p, a + ab * t);
}

void main() {
  vec2 state = texture(uState, vUv).rg;

  float left = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
  float right = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
  float down = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
  float up = texture(uState, vUv + vec2(0.0, uTexel.y)).r;

  float next = ((left + right + up + down) * 0.5 - state.g) * uDamping;

  if (uPointerActive > 0.5) {
    // Displace along the whole path travelled this frame, so a fast cursor
    // leaves a continuous wake instead of a dotted line.
    float d = segmentDistance(vUv * uAspect, uPointerPrev * uAspect, uPointer * uAspect);
    next -= uStrength * smoothstep(uRadius, 0.0, d);
  }

  // A cursor held in one spot would otherwise keep pumping energy in until the
  // surface tears; cap the height so the water can only get so choppy.
  next = clamp(next, -0.35, 0.35);

  outColor = vec4(next, state.r, 0.0, 1.0);
}`;

/**
 * Draws the photo through the height field: the surface slope bends the sample
 * position (refraction) and catches a highlight (specular), which is what reads
 * as water rather than as smeared pixels.
 */
const RENDER_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uState;
uniform sampler2D uPhoto;
uniform vec2 uTexel;
uniform vec2 uCoverScale;
uniform vec2 uCoverOffset;
uniform float uRefraction;
uniform float uSpecular;

void main() {
  float left = texture(uState, vUv - vec2(uTexel.x, 0.0)).r;
  float right = texture(uState, vUv + vec2(uTexel.x, 0.0)).r;
  float down = texture(uState, vUv - vec2(0.0, uTexel.y)).r;
  float up = texture(uState, vUv + vec2(0.0, uTexel.y)).r;
  vec2 slope = vec2(right - left, up - down);

  // vUv has its origin bottom-left; the photo's has it top-left.
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec2 displaced = uv + vec2(slope.x, -slope.y) * uRefraction;
  vec2 photoUv = clamp(displaced, 0.0, 1.0) * uCoverScale + uCoverOffset;

  vec3 color = texture(uPhoto, photoUv).rgb;

  vec3 normal = normalize(vec3(-slope.x, -slope.y, 0.55));
  vec3 light = normalize(vec3(-0.35, 0.6, 0.72));
  color += pow(max(dot(normal, light), 0.0), 42.0) * uSpecular;

  outColor = vec4(color, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function link(gl: WebGL2RenderingContext, fragmentSource: string) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, "aPos");
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

type WaterPhotoProps = {
  src: string;
  alt: string;
  /** Focal point, matching CSS object-position. Defaults to centre. */
  focalX?: number;
  focalY?: number;
  sizes?: string;
  className?: string;
};

/**
 * A photograph with a water surface over it: moving a cursor or finger across
 * it displaces the surface, and the ripples spread, interfere and settle.
 *
 * The <Image> below is the real content — it is what renders on the server, and
 * what stays on screen if WebGL2 is unavailable, JavaScript never arrives, or
 * the visitor prefers reduced motion. The canvas only fades in once it has a
 * frame to show, and its resting state is the same crop as the image beneath.
 */
export function WaterPhoto({
  src,
  alt,
  focalX = 0.5,
  focalY = 0.5,
  sizes = "100vw",
  className,
}: WaterPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!container || !canvas || !image) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    // Rendering into a float texture is what the wave state needs; without it
    // the photo below simply stays as it is.
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return;

    const simProgram = link(gl, SIM_SHADER);
    const renderProgram = link(gl, RENDER_SHADER);
    if (!simProgram || !renderProgram) return;

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const photoTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, photoTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Mipmaps so the downscale matches what the browser does for the <img>.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let simWidth = 0;
    let simHeight = 0;
    let targets: { texture: WebGLTexture; framebuffer: WebGLFramebuffer }[] = [];
    let front = 0;

    const releaseTargets = () => {
      for (const target of targets) {
        gl.deleteTexture(target.texture);
        gl.deleteFramebuffer(target.framebuffer);
      }
      targets = [];
    };

    const buildTargets = (width: number, height: number) => {
      releaseTargets();
      for (let i = 0; i < 2; i++) {
        const texture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // Half-float is filterable in WebGL2, and smoothing the height field is
        // what keeps the wavefronts round instead of stair-stepped.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const framebuffer = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        targets.push({ texture, framebuffer });
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    let coverScaleX = 1;
    let coverScaleY = 1;
    let coverOffsetX = 0;
    let coverOffsetY = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Keep the grid's aspect equal to the canvas so ripples stay circular.
      const ratio = rect.height / rect.width;
      let width = SIM_MAX;
      let height = Math.round(SIM_MAX * ratio);
      if (height > SIM_MAX) {
        height = SIM_MAX;
        width = Math.round(SIM_MAX / ratio);
      }
      width = Math.max(width, 8);
      height = Math.max(height, 8);

      if (width !== simWidth || height !== simHeight) {
        simWidth = width;
        simHeight = height;
        buildTargets(width, height);
      }

      // Reproduce the object-cover crop the <Image> uses, in texture space.
      const imageAspect = (image.naturalWidth || 1) / (image.naturalHeight || 1);
      const boxAspect = rect.width / rect.height;
      if (imageAspect > boxAspect) {
        coverScaleX = boxAspect / imageAspect;
        coverScaleY = 1;
      } else {
        coverScaleX = 1;
        coverScaleY = imageAspect / boxAspect;
      }
      coverOffsetX = focalX * (1 - coverScaleX);
      coverOffsetY = focalY * (1 - coverScaleY);
    };

    let photoReady = false;
    const onImageReady = () => {
      if (photoReady || !image.complete || image.naturalWidth === 0) return;
      gl.bindTexture(gl.TEXTURE_2D, photoTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      photoReady = true;
      resize();
      draw();
      setLive(true);
    };

    // Pointer state, in grid space (origin bottom-left, to match the shaders).
    let pointerX = 0;
    let pointerY = 0;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let pointerActive = false;
    let hasPointer = false;
    let lastTouchAt = 0;

    const pushPointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;

      // Only advance the trailing point once a step has consumed the last one,
      // so several moves inside one frame still form a single unbroken stroke.
      if (!pointerActive) {
        prevPointerX = hasPointer ? pointerX : x;
        prevPointerY = hasPointer ? pointerY : y;
      }
      pointerX = x;
      pointerY = y;
      hasPointer = true;
      pointerActive = true;
      lastTouchAt = performance.now();
      start();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return; // handled by touchmove
      pushPointer(event.clientX, event.clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) pushPointer(touch.clientX, touch.clientY);
    };
    const onPointerLeave = () => {
      hasPointer = false;
      pointerActive = false;
    };

    let raf = 0;
    let running = false;
    let visible = true;
    let accumulator = 0;
    let lastFrame = 0;

    const step = () => {
      gl.useProgram(simProgram);
      gl.uniform2f(gl.getUniformLocation(simProgram, "uTexel"), 1 / simWidth, 1 / simHeight);
      gl.uniform2f(gl.getUniformLocation(simProgram, "uAspect"), simWidth / simHeight, 1);
      gl.uniform2f(gl.getUniformLocation(simProgram, "uPointer"), pointerX, pointerY);
      gl.uniform2f(gl.getUniformLocation(simProgram, "uPointerPrev"), prevPointerX, prevPointerY);
      gl.uniform1f(gl.getUniformLocation(simProgram, "uPointerActive"), pointerActive ? 1 : 0);
      gl.uniform1f(gl.getUniformLocation(simProgram, "uRadius"), IMPULSE_RADIUS);
      gl.uniform1f(gl.getUniformLocation(simProgram, "uStrength"), IMPULSE_STRENGTH);
      gl.uniform1f(gl.getUniformLocation(simProgram, "uDamping"), DAMPING);
      gl.uniform1i(gl.getUniformLocation(simProgram, "uState"), 0);

      const source = targets[front];
      const destination = targets[1 - front];
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, source.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, destination.framebuffer);
      gl.viewport(0, 0, simWidth, simHeight);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      front = 1 - front;

      // An impulse lasts exactly one step; holding still shouldn't keep pumping.
      pointerActive = false;
      prevPointerX = pointerX;
      prevPointerY = pointerY;
    };

    const draw = () => {
      gl.useProgram(renderProgram);
      gl.uniform2f(gl.getUniformLocation(renderProgram, "uTexel"), 1 / simWidth, 1 / simHeight);
      gl.uniform2f(gl.getUniformLocation(renderProgram, "uCoverScale"), coverScaleX, coverScaleY);
      gl.uniform2f(gl.getUniformLocation(renderProgram, "uCoverOffset"), coverOffsetX, coverOffsetY);
      gl.uniform1f(gl.getUniformLocation(renderProgram, "uRefraction"), REFRACTION);
      gl.uniform1f(gl.getUniformLocation(renderProgram, "uSpecular"), SPECULAR);
      gl.uniform1i(gl.getUniformLocation(renderProgram, "uState"), 0);
      gl.uniform1i(gl.getUniformLocation(renderProgram, "uPhoto"), 1);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, targets[front].texture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, photoTexture);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      accumulator += Math.min(now - lastFrame, 100);
      lastFrame = now;

      let steps = 0;
      while (accumulator >= STEP_MS && steps < MAX_STEPS_PER_FRAME) {
        step();
        accumulator -= STEP_MS;
        steps++;
      }
      draw();

      // Nothing has been touched for a while: the surface is flat again, so
      // stop the loop entirely rather than spinning on a still image.
      if (now - lastTouchAt > IDLE_MS) {
        running = false;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    function start() {
      if (running || !visible || !photoReady || document.hidden) return;
      running = true;
      lastFrame = performance.now();
      accumulator = 0;
      raf = requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) {
          cancelAnimationFrame(raf);
          running = false;
          raf = 0;
        } else if (performance.now() - lastTouchAt < IDLE_MS) {
          start();
        }
      },
      { threshold: 0 },
    );
    observer.observe(container);

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
        raf = 0;
      }
    };

    const onResize = () => {
      resize();
      if (photoReady) {
        // Redraw once so a resize while idle doesn't leave a stale frame.
        draw();
      }
    };

    if (image.complete && image.naturalWidth > 0) {
      onImageReady();
    } else {
      image.addEventListener("load", onImageReady);
    }

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      image.removeEventListener("load", onImageReady);

      releaseTargets();
      gl.deleteTexture(photoTexture);
      gl.deleteBuffer(quad);
      gl.deleteProgram(simProgram);
      gl.deleteProgram(renderProgram);
    };
  }, [focalX, focalY]);

  return (
    <div ref={containerRef} className={className}>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: `${focalX * 100}% ${focalY * 100}%` }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 ${
          live ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
