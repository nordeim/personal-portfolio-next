"use client";

import { useMemo } from "react";
import { skills } from "@/lib/skills";
import ScrollReveal from "./ScrollReveal";

interface SkillCategory {
  readonly name: string;
  readonly items: readonly string[];
}

export default function SkillsSection() {
  const categories = useMemo((): readonly SkillCategory[] => {
    const grouped = new Map<string, string[]>();

    for (const skill of skills) {
      const existing = grouped.get(skill.category);
      if (existing) {
        existing.push(skill.name);
      } else {
        grouped.set(skill.category, [skill.name]);
      }
    }

    return Array.from(grouped.entries()).map(([name, items]) => ({
      name,
      items,
    }));
  }, []);

  if (categories.length === 0) {
    return (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
        }}
      >
        No skills data available.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "var(--spacing-grid)",
      }}
    >
      {categories.map((category, catIndex) => (
        <ScrollReveal key={category.name} delay={catIndex * 0.1}>
          <div
            style={{
              padding: "var(--spacing-grid)",
              border: "2px solid var(--color-border)",
              background: "var(--color-surface)",
              boxShadow: "var(--shadow-brutal-sm)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: "var(--color-accent)",
                marginBottom: "var(--spacing-half)",
                paddingBottom: "var(--spacing-quarter)",
                borderBottom: "1px solid var(--color-border-subtle)",
              }}
            >
              {category.name}
            </h3>

            <ul
              role="list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-quarter)",
              }}
            >
              {category.items.map((skill) => (
                <li
                  key={skill}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--color-text-secondary)",
                    paddingLeft: "var(--spacing-half)",
                    borderLeft: "2px solid var(--color-border-subtle)",
                  }}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}