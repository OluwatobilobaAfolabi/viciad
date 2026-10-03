"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/*
 * One place to register GSAP plugins, so every component imports a gsap that
 * already knows about ScrollTrigger and SplitText. Registration is guarded for
 * the server render, where there is no window to attach to.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** The site's single easing family (see the brief: nothing bouncy). */
export const EASE = "power3.out";

export { gsap, ScrollTrigger, SplitText };
