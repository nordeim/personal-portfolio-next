/**
 * Fixed-position CSS noise overlay.
 * Purely decorative — `pointer-events-none` and aria-hidden.
 * z-index 9999 ensures it sits on top of every other element.
 */
export function GrainOverlay() {
  return <div className="grain-overlay z-grain" aria-hidden="true" />;
}
