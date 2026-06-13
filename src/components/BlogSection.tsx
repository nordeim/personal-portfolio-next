"use client";

export default function BlogSection() {
  return (
    <div
      style={{
        padding: "var(--spacing-grid)",
        border: "2px dashed var(--color-border-subtle)",
        textAlign: "center" as const,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.5rem",
          fontWeight: 600,
          marginBottom: "var(--spacing-half)",
          color: "var(--color-text-primary)",
        }}
      >
        Coming Soon
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9375rem",
          color: "var(--color-text-muted)",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        Thoughts on engineering, design, and building things with intention.
      </p>
    </div>
  );
}