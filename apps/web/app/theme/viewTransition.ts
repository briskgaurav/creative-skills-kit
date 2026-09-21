/**
 * Shared plumbing for the circular clip-path reveals. The theme toggle and
 * page navigation both animate `::view-transition-new(root)`, so they publish
 * the same CSS custom properties and tell them apart with a transition type
 * (`theme-swap` vs `page-nav`) that the stylesheet keys its animations off.
 */

type Origin = { x: number; y: number };

export type TransitionKind = "theme-swap" | "page-nav";

export function supportsViewTransitions() {
  return (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Publishes the reveal origin and the radius needed to cover the furthest
 * corner of the viewport from it, so the circle always finishes off-screen.
 */
export function setRevealOrigin(origin?: Origin) {
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const root = document.documentElement;
  root.style.setProperty("--reveal-x", `${x}px`);
  root.style.setProperty("--reveal-y", `${y}px`);
  root.style.setProperty("--reveal-radius", `${radius}px`);
}

/**
 * Runs `swap` inside a typed view transition. Returns false when the browser
 * can't animate it, so callers can fall back to their default behaviour.
 */
export function startReveal(
  kind: TransitionKind,
  origin: Origin | undefined,
  swap: () => void
) {
  if (!supportsViewTransitions()) {
    swap();
    return false;
  }

  setRevealOrigin(origin);

  const transition = document.startViewTransition({
    update: swap,
    types: [kind],
  });

  transition.ready.catch(() => {});
  transition.finished
    .catch(() => {})
    .finally(() => {
      // Long pages scroll-restore to the top on navigation; without this the
      // next reveal can inherit a stale origin from an unmounted element.
      document.documentElement.style.removeProperty("--reveal-x");
      document.documentElement.style.removeProperty("--reveal-y");
      document.documentElement.style.removeProperty("--reveal-radius");
    });

  return true;
}

/**
 * Page navigation cross-fades, so it needs no click origin — only the
 * transition type that selects the fade rules in the stylesheet.
 */
export function startPageTransition(navigate: () => void) {
  return startReveal("page-nav", undefined, navigate);
}
