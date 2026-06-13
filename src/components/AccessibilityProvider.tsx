"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AccessibilityContextValue {
  readonly prefersReducedMotion: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextValue>({
  prefersReducedMotion: false,
});

export function useAccessibility(): AccessibilityContextValue {
  return useContext(AccessibilityContext);
}

interface AccessibilityProviderProps {
  readonly children: ReactNode;
}

export default function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{ prefersReducedMotion }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}
