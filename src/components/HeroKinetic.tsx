"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HEADLINE_LINES = [
  "The Engineered",
  "Soul",
] as const;

const SUBTITLE = "Full-Stack Developer · Designer · Engineer";

interface HeroKineticProps {
  onNavigate?: (hash: string) => void;
}

export default function HeroKinetic({ onNavigate }: HeroKineticProps) {
  const prefersReducedMotion = useReducedMotion();
  // Initialize state directly based on reduced-motion preference.
  // When motion is not reduced we start false and trigger the animation
  // via a layout effect so CSS transitions run after paint.
  const [isAnimated, setIsAnimated] = useState(prefersReducedMotion);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // When reduced motion is preferred the initial state is already true.
    // Otherwise trigger the animation on mount so CSS transitions fire.
    if (!prefersReducedMotion) {
      const timer = requestAnimationFrame(() => {
        setIsAnimated(true);
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [prefersReducedMotion]);

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "var(--spacing-double) var(--spacing-grid)",
    position: "relative",
    overflow: "hidden",
  };

  const headlineStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(3rem, 10vw, 8rem)",
    fontWeight: 600,
    lineHeight: 1.0,
    letterSpacing: "-0.04em",
    color: "var(--color-text-primary)",
    marginBottom: "var(--spacing-grid)",
  };

  const subtitleStyle: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-muted)",
    marginBottom: "var(--spacing-double)",
  };

  const lineDelay = (index: number): CSSProperties => ({
    opacity: isAnimated ? 1 : 0,
    transform: isAnimated ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.8s ease-out ${index * 0.15}s, transform 0.8s ease-out ${index * 0.15}s`,
  });

  return (
    <section ref={heroRef} style={containerStyle} aria-label="Hero introduction">
      {/* Decorative grid lines — purely aesthetic */}
      <div aria-hidden="true" style={{
        position: "absolute",
        top: 0,
        left: "var(--spacing-grid)",
        width: "1px",
        height: "100%",
        background: "var(--color-border-subtle)",
        opacity: 0.3,
      }} />
      <div aria-hidden="true" style={{
        position: "absolute",
        top: 0,
        left: "calc(var(--spacing-grid) * 4)",
        width: "1px",
        height: "100%",
        background: "var(--color-border-subtle)",
        opacity: 0.15,
      }} />

      <div style={{ maxWidth: "900px" }}>
        {/* h1 — the ONE and only h1 on the page */}
        <h1 style={headlineStyle}>
          {HEADLINE_LINES.map((line, i) => (
            <span key={line} style={{ display: "block", ...lineDelay(i) }}>
              {line}
            </span>
          ))}
        </h1>

        <p style={{ ...subtitleStyle, ...lineDelay(HEADLINE_LINES.length) }}>
          {SUBTITLE}
        </p>

        <div style={lineDelay(HEADLINE_LINES.length + 1)}>
          <button
            onClick={() => onNavigate?.("#projects")}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              textDecoration: "none",
              color: "var(--color-text-inverse)",
              background: "var(--color-text-primary)",
              padding: "var(--spacing-half) var(--spacing-grid)",
              border: "2px solid var(--color-border)",
              boxShadow: "var(--shadow-brutal)",
              borderRadius: 0,
              transition: "transform var(--transition-fast), box-shadow var(--transition-fast)",
              cursor: "pointer",
            }}
          >
            View Work →
          </button>
        </div>
      </div>
    </section>
  );
}