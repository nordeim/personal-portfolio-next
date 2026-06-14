import { useState, useEffect } from "react";

// SSR-safe default: treats reduced-motion as disabled until the real
// preference is read on the client.
const SSR_SAFE_DEFAULT = false;

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return SSR_SAFE_DEFAULT;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(getPrefersReducedMotion);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    function handleChange(e: MediaQueryListEvent) {
      setPrefersReducedMotion(e.matches);
    }

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
