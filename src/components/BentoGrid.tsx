"use client";

import { useMemo } from "react";
import ScrollReveal from "./ScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface BentoItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly span?: 1 | 2;
}

const BENTO_ITEMS: readonly BentoItem[] = [
  {
    id: "philosophy",
    title: "Philosophy",
    description:
      "I believe in engineering with intention — every line of code, every pixel, every interaction should serve a purpose. No decoration without function.",
    span: 2,
  },
  {
    id: "frontend",
    title: "Frontend",
    description:
      "React, Next.js, TypeScript, and modern CSS. I build interfaces that are accessible, performant, and visually distinctive.",
  },
  {
    id: "backend",
    title: "Backend",
    description:
      "Node.js, PostgreSQL, and API design. Robust systems that scale with clean data architecture.",
  },
  {
    id: "design",
    title: "Design Systems",
    description:
      "Creating cohesive visual languages that bridge design intent and engineering reality. Tokens, components, and documentation.",
    span: 2,
  },
] as const;

export default function BentoGrid() {
  const prefersReducedMotion = useReducedMotion();

  const items = useMemo(() => BENTO_ITEMS, []);

  if (items.length === 0) {
    return (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
        }}
      >
        No content available.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "var(--spacing-grid)",
      }}
    >
      {items.map((item, index) => (
        <ScrollReveal
          key={item.id}
          delay={prefersReducedMotion ? 0 : index * 0.1}
        >
          <article
            style={{
              gridColumn: item.span === 2 ? "span 2" : "span 1",
              padding: "var(--spacing-grid)",
              border: "2px solid var(--color-border)",
              background: "var(--color-surface)",
              boxShadow: "var(--shadow-brutal-sm)",
              transition: prefersReducedMotion
                ? "none"
                : "transform var(--transition-fast), box-shadow var(--transition-fast)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
                marginBottom: "var(--spacing-half)",
                color: "var(--color-text-primary)",
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                color: "var(--color-text-secondary)",
              }}
            >
              {item.description}
            </p>
          </article>
        </ScrollReveal>
      ))}
    </div>
  );
}