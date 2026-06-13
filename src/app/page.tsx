"use client";

import dynamic from "next/dynamic";

const PortfolioApp = dynamic(() => import("./PortfolioApp"), {
  ssr: false,
  loading: () => (
    <main
      id="main-content"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "var(--font-mono)",
        fontSize: "0.875rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      <p>Initializing&hellip;</p>
    </main>
  ),
});

export default function Page() {
  return <PortfolioApp />;
}