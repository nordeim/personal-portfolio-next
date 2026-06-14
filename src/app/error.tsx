"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service when integrated (e.g., Sentry)
    console.error("Application error:", error);
  }, [error]);

  // Type guard to safely extract a message from an unknown error value
  function isErrorLike(err: unknown): err is { message: string } {
    return (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof (err as { message: unknown }).message === "string"
    );
  }

  const errorMessage =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred. Please try again."
      : typeof error === "string"
        ? error
        : isErrorLike(error)
          ? error.message
          : "An unexpected error occurred. Please try again.";

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
          color: "var(--color-text-muted)",
          fontSize: "0.75rem",
          maxWidth: "40ch",
          textAlign: "center",
        }}
      >
        {errorMessage}
      </p>
      <button
        onClick={reset}
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
