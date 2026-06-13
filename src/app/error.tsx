"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service when integrated (e.g., Sentry)
    console.error("Application error:", error);
  }, [error]);

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
      role="alert"
    >
      <p
        style={{
          fontSize: "0.875rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Something went wrong
      </p>
      <p
        style={{
          color: "var(--color-text-muted, #6b6560)",
          fontSize: "0.75rem",
          maxWidth: "40ch",
          textAlign: "center",
        }}
      >
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
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
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
