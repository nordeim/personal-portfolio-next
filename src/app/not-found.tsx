import Link from "next/link";

export default function NotFound() {
  return (
    <main
      role="main"
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
    >
      <div role="alert">
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 300,
            fontFamily: "var(--font-editorial)",
            textAlign: "center",
          }}
        >
          404
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Page not found
        </p>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.75rem",
            maxWidth: "40ch",
            textAlign: "center",
          }}
        >
          The page you are looking for does not exist.
        </p>
      </div>
      <Link
        href="/"
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
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Go Home
      </Link>
    </main>
  );
}
