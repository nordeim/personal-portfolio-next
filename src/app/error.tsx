"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      // Replace with actual error reporting (e.g., Sentry)
    }
  }, [error]);

  return (
    <main
      role="alert"
      aria-labelledby="error-heading"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "var(--spacing-grid)",
        fontFamily: "var(--font-mono)",
        textAlign: "center" as const,
      }}
    >
      <h1
        id="error-heading"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontWeight: 600,
          marginBottom: "var(--spacing-half)",
          color: "var(--color-text-primary)",
        }}
      >
        Something Broke
      </h1>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
          marginBottom: "var(--spacing-grid)",
          maxWidth: "500px",
        }}
      >
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.8125rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
          padding: "var(--spacing-half) var(--spacing-grid)",
          border: "2px solid var(--color-border)",
          background: "var(--color-text-primary)",
          color: "var(--color-text-inverse)",
          cursor: "pointer",
          boxShadow: "var(--shadow-brutal)",
          borderRadius: 0,
          transition: "transform var(--transition-fast), box-shadow var(--transition-fast)",
        }}
      >
        Try Again
      </button>
    </main>
  );
}