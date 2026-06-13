import Link from "next/link";

export default function NotFound() {
  return (
    <main
      aria-labelledby="not-found-heading"
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
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          color: "var(--color-accent)",
          marginBottom: "var(--spacing-half)",
        }}
      >
        404
      </p>
      <h1
        id="not-found-heading"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5vw, 4rem)",
          fontWeight: 600,
          marginBottom: "var(--spacing-half)",
          color: "var(--color-text-primary)",
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
          marginBottom: "var(--spacing-grid)",
          maxWidth: "400px",
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.8125rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
          textDecoration: "none",
          padding: "var(--spacing-half) var(--spacing-grid)",
          border: "2px solid var(--color-border)",
          background: "var(--color-text-primary)",
          color: "var(--color-text-inverse)",
          boxShadow: "var(--shadow-brutal)",
          borderRadius: 0,
        }}
      >
        Go Home
      </Link>
    </main>
  );
}