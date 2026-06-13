"use client";

import { useCallback, useEffect, useState } from "react";

interface ThemeSwitchProps {
  onThemeChange: (theme: "day" | "night") => void;
}

export default function ThemeSwitch({ onThemeChange }: ThemeSwitchProps) {
  const [theme, setTheme] = useState<"day" | "night">("day");

  // Read initial theme from DOM (set by FOUC-prevention script) or localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initial =
      stored === "night" || stored === "day"
        ? stored
        : prefersDark
          ? "night"
          : "day";
    setTheme(initial);
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