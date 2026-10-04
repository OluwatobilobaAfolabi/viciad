/**
 * Coordination for the site loader: the dot-wordmark screen shown whenever
 * the home page is loaded in full (first visit, refresh or hard refresh).
 *
 * Pages register the work the loader should wait for with `holdLoader`, and
 * anything that must not start until the loader has gone (the home hero's
 * intro) awaits `siteReady`. When a page other than Home is loaded the
 * loader is skipped and `siteReady` resolves straight away; moving between
 * pages inside the site never loads a page in full, so it never shows then.
 */

/**
 * Runs in <head> before first paint: on any page but Home, mark <html> so CSS
 * hides the loader before it can flash.
 */
export const LOADER_HEAD_SCRIPT = `if(location.pathname!=="/")document.documentElement.dataset.loader="skip"`;

const pending = new Set<Promise<unknown>>();
const listeners = new Set<() => void>();
let resolveReady: () => void = () => {};

/** Resolves once the loader has finished (or immediately if it was skipped). */
export const siteReady: Promise<void> =
  typeof window === "undefined" ? Promise.resolve() : new Promise((resolve) => (resolveReady = resolve));

export function markSiteReady() {
  resolveReady();
}

/** Ask the loader to wait for this work too. Failures count as done. */
export function holdLoader<T>(work: Promise<T>): Promise<T> {
  const settled = work.then(
    () => undefined,
    () => undefined,
  );
  pending.add(settled);
  listeners.forEach((listener) => listener());
  return work;
}

/** The loader's view of the registered work. */
export function loaderWork() {
  return Array.from(pending);
}

export function onLoaderWork(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
