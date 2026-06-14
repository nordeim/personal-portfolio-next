"use client";

import { useCallback, useEffect, useState } from "react";

interface ThemeSwitchProps {
  onThemeChange: (theme: "day" | "night") => void;
}

// Helper to read the initial theme without an effect
function getInitialTheme(): "day" | "night" {
  if (typeof window === "undefined") return "day";
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return stored === "night" || stored === "day" ? stored : prefersDark ? "night" : "day";
}

export default function ThemeSwitch({ onThemeChange }: ThemeSwitchProps) {
  const [theme, setTheme] = useState<"day" | "night">(getInitialTheme);

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
      }}
    >
      {isNight ? "NIGHT" : "DAY"}
    </button>
  );
}