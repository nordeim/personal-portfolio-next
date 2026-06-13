"use client";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono, monospace)",
        color: "var(--color-text-primary, #f0ece4)",
        gap: "1rem",
        padding: "2rem",
      }}
    >
      <p
        style={{
          fontSize: "3rem",
          fontWeight: 300,
          fontFamily: "var(--font-editorial, serif)",
        }}
      >
        404
      </p>
      <p
        style={{
          fontSize: "0.875rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Page not found
      </p>
      <p
        style={{
          color: "var(--color-text-muted, #6b6560)",
          fontSize: "0.75rem",
          maxWidth: "40ch",
          textAlign: "center",
        }}
      >
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1.5rem",
          background: "var(--color-accent, #e8c547)",
          color: "var(--color-bg, #0a0a0a)",
          border: "none",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        Go Home
      </a>
    </div>
  );
}
