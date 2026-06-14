"use client";

import { useCallback, useEffect, useState } from "react";

interface ThemeSwitchProps {
  onThemeChange: (theme: "day" | "night") => void;
}

export default function ThemeSwitch({ onThemeChange }: ThemeSwitchProps) {
  /**
   * Two-pass render strategy to avoid hydration mismatch:
   *
   * 1. SSR + first client render: always "day" (safe default)
   * 2. After hydration (useEffect): read actual theme from
   *    ThemeScript.tsx's data-theme attribute and re-render.
   *
   * This is necessary because getInitialTheme() differs between
   * server (no window) and client (reads localStorage/matchMedia),
   * which causes React hydration mismatch when SSR is enabled.
   */
  const [theme, setTheme] = useState<"day" | "night">("day");
  const [isHydrated, setIsHydrated] = useState(false);

  /**
   * After hydration, read the actual theme from the DOM attribute
   * set by ThemeScript.tsx and re-render if needed.
   * Using requestAnimationFrame avoids the synchronous-setState-in-effect
   * lint error by deferring the state update to the next paint.
   */
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "night" || attr === "day") {
        setTheme(attr);
      }
      setIsHydrated(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "day" ? "night" : "day";
      onThemeChange(next);
      return next;
    });
  }, [onThemeChange]);

  const isNight = theme === "night";

  return (
    <button
      role="switch"
      aria-checked={isNight}
      aria-label={`Switch to ${isNight ? "day" : "night"} theme`}
      onClick={toggleTheme}
      // Prevent layout shift before hydration: render a visually neutral state
      aria-disabled={!isHydrated}
      style={{
        background: "transparent",
        border: "2px solid var(--color-border)",
        padding: "var(--spacing-quarter) var(--spacing-half)",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        borderRadius: 0,
        color: "var(--color-text-primary)",
        lineHeight: 1,
        minWidth: "3rem",
        textAlign: "center" as const,
        transition: "background var(--transition-fast), color var(--transition-fast)",
        opacity: isHydrated ? 1 : 0.6, // Visual cue for pre-hydration state
      }}
    >
      {isNight ? "NIGHT" : "DAY"}
    </button>
  );
}