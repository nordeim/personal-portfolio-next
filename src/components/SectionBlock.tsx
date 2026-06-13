"use client";

import type { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";

interface SectionBlockProps {
  readonly id: string;
  readonly title: string;
  readonly children: ReactNode;
  readonly paddingY?: string;
}

export default function SectionBlock({
  id,
  title,
  children,
  paddingY = "var(--spacing-double)",
}: SectionBlockProps) {
  return (
    <div
      id={id}
      style={{
        padding: `${paddingY} var(--spacing-grid)`,
        position: "relative",
      }}
    >
      <ScrollReveal>
        {/* h2 — section-level heading under the page's single h1 */}
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "var(--color-text-muted)",
            marginBottom: "var(--spacing-grid)",
            paddingBottom: "var(--spacing-half)",
            borderBottom: "2px solid var(--color-border)",
          }}
        >
          {title}
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        {children}
      </ScrollReveal>
    </div>
  );
}