"use client";

import { siteConfig } from "@/lib/site-config";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <div
      style={{
        borderTop: "2px solid var(--color-border)",
        padding: "var(--spacing-grid)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--spacing-half)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        color: "var(--color-text-muted)",
        letterSpacing: "0.05em",
      }}
    >
      <p>
        &copy; {CURRENT_YEAR} {siteConfig.name}. Engineered with intention.
      </p>

      <nav aria-label="Footer navigation">
        <ul
          role="list"
          style={{
            display: "flex",
            gap: "var(--spacing-grid)",
            listStyle: "none",
          }}
        >
          <li>
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in new tab)"
              style={{
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "color var(--transition-fast)",
              }}
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label={`Send email to ${siteConfig.name}`}
              style={{
                color: "var(--color-text-muted)",
                textDecoration: "none",
                transition: "color var(--transition-fast)",
              }}
            >
              Email
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}