"use client";

import { useMemo } from "react";
import { timeline } from "@/lib/timeline";
import ScrollReveal from "./ScrollReveal";

export default function Timeline() {
  const entries = useMemo(() => timeline, []);

  if (entries.length === 0) {
    return (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
          padding: "var(--spacing-grid)",
        }}
      >
        No experience data available.
      </p>
    );
  }

  return (
    <ol
      role="list"
      aria-label="Professional timeline"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
        paddingLeft: "var(--spacing-grid)",
        borderLeft: "2px solid var(--color-border)",
      }}
    >
      {entries.map((entry, index) => (
        <ScrollReveal key={entry.id} delay={index * 0.1}>
          <li
            style={{
              position: "relative",
              padding: "var(--spacing-grid) 0 var(--spacing-grid) var(--spacing-grid)",
            }}
          >
            {/* Timeline dot */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "calc(-1 * var(--spacing-grid) - 5px)",
                top: "var(--spacing-grid)",
                width: "var(--spacing-quarter)",
                height: "var(--spacing-quarter)",
                background: "var(--color-accent)",
                border: "2px solid var(--color-border)",
              }}
            />

            {/* Date range */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--color-text-muted)",
                marginBottom: "var(--spacing-quarter)",
              }}
            >
              <time dateTime={entry.startDate}>{entry.startDate}</time>
              {" — "}
              {entry.endDate ? (
                <time dateTime={entry.endDate}>{entry.endDate}</time>
              ) : (
                "Present"
              )}
            </p>

            {/* Role */}
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                marginBottom: "4px",
              }}
            >
              {entry.role}
            </h3>

            {/* Company */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8125rem",
                color: "var(--color-accent)",
                marginBottom: "var(--spacing-half)",
              }}
            >
              {entry.company}
            </p>

            {/* Description */}
            {entry.description && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.65,
                  color: "var(--color-text-secondary)",
                  maxWidth: "600px",
                }}
              >
                {entry.description}
              </p>
            )}
          </li>
        </ScrollReveal>
      ))}
    </ol>
  );
}