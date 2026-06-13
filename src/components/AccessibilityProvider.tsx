"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AccessibilityContextValue {
  readonly prefersReducedMotion: boolean;
  readonly prefersHighContrast: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextValue>({
  prefersReducedMotion: false,
  prefersHighContrast: false,
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
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const contrastQuery = window.matchMedia("(prefers-contrast: more)");

    setPrefersReducedMotion(motionQuery.matches);
    setPrefersHighContrast(contrastQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    motionQuery.addEventListener("change", handleMotionChange);
    contrastQuery.addEventListener("change", handleContrastChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      contrastQuery.removeEventListener("change", handleContrastChange);
    };
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{ prefersReducedMotion, prefersHighContrast }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}