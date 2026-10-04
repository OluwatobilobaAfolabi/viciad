/**
 * Coordination for the site loader: the dot-wordmark screen shown on the
 * first page a visitor opens in a browsing session.
 *
 * Pages register the work the loader should wait for with `holdLoader`, and
 * anything that must not start until the loader has gone (the home hero's
 * intro) awaits `siteReady`. On later pages in the session the loader is
 * skipped and `siteReady` resolves straight away.
 */

/** sessionStorage key marking that the loader has played this session. */
export const LOADER_SEEN_KEY = "viciad-loader-seen";

/**
 * Runs in <head> before first paint: if the loader has already played this
 * session, mark <html> so CSS hides it before it can flash.
 */
export const LOADER_HEAD_SCRIPT = `try{if(sessionStorage.getItem("${LOADER_SEEN_KEY}"))document.documentElement.dataset.loader="skip"}catch(e){}`;

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
