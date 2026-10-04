/**
 * A shared hold on page scrolling. The site loader and the home hero's intro
 * can both hold the page at once; it is released only when every holder has
 * let go. Works before or after Lenis starts (SmoothScroll reads
 * `data-scroll-locked` when it boots).
 */
let holders = 0;

export function lockScroll(): () => void {
  holders += 1;
  if (holders === 1) {
    const root = document.documentElement;
    root.dataset.scrollLocked = "true";
    root.style.overflow = "hidden";
    window.__lenis?.stop();
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders -= 1;
    if (holders === 0) {
      const root = document.documentElement;
      delete root.dataset.scrollLocked;
      root.style.overflow = "";
      window.__lenis?.start();
    }
  };
}
