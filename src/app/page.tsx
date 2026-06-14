"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";

const PortfolioApp = dynamic(() => import("@/app/PortfolioApp"), {
  loading: () => <LoadingSkeleton />,
});

function LoadingSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        color: "var(--color-text-muted)",
        fontSize: "0.875rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading portfolio...</span>
      <span aria-hidden="true">Loading...</span>
    </div>
  );
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  const message = process.env.NODE_ENV === "production"
    ? "An unexpected error occurred."
    : error instanceof Error ? error.message : "An unknown error occurred";
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        color: "var(--color-text-primary)",
        gap: "1rem",
        padding: "2rem",
      }}
      role="alert"
    >
      <p style={{ fontSize: "0.875rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Something went wrong
      </p>
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
        {message}
      </p>
      <button
        onClick={resetErrorBoundary}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1.5rem",
          background: "var(--color-accent)",
          color: "var(--color-bg)",
          border: "none",
          fontFamily: "var(--font-mono)",
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

export default function Page() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <PortfolioApp />
    </ErrorBoundary>
  );
}
