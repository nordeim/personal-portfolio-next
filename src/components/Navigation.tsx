"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import ThemeSwitch from "./ThemeSwitch";

interface NavLink {
  readonly label: string;
  readonly href: string;
}

const NAV_LINKS: readonly NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
] as const;

interface NavigationProps {
  currentHash: string;
  onNavigate: (hash: string) => void;
  onThemeChange: (theme: "day" | "night") => void;
}

export default function Navigation({
  currentHash,
  onNavigate,
  onThemeChange,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleNavClick = useCallback(
    (href: string) => {
      onNavigate(href);
      setIsMobileMenuOpen(false);
    },
    [onNavigate],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLAnchorElement>, href: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNavClick(href);
      }
    },
    [handleNavClick],
  );

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Focus first element in mobile menu when opened
  useEffect(() => {
    if (!isMobileMenuOpen || !mobileMenuRef.current) return;

    const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );

    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }, [isMobileMenuOpen]);

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--spacing-half) var(--spacing-grid)",
        borderBottom: "2px solid var(--color-border)",
        background: "var(--color-bg)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.8125rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      {/* Logo / Site title */}
      <a
        href="#hero"
        onClick={(e) => {
          e.preventDefault();
          handleNavClick("#hero");
        }}
        onKeyDown={(e) => handleKeyDown(e, "#hero")}
        aria-label="Nicholas Yun — Go to top"
        style={{
          fontWeight: 600,
          textDecoration: "none",
          color: "var(--color-text-primary)",
        }}
      >
        NY
      </a>

      {/* Desktop navigation */}
      <ul
        role="list"
        className="nav-links-desktop"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-grid)",
          listStyle: "none",
        }}
      >
        {NAV_LINKS.map((link) => {
          const isActive = currentHash === link.href;
          return (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                onKeyDown={(e) => handleKeyDown(e, link.href)}
                aria-current={isActive ? "page" : undefined}
                style={{
                  textDecoration: "none",
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
                  fontWeight: isActive ? 600 : 400,
                  padding: "var(--spacing-quarter) 0",
                  borderBottom: isActive
                    ? "2px solid var(--color-accent)"
                    : "2px solid transparent",
                  transition:
                    "color var(--transition-fast), border-color var(--transition-fast)",
                }}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>

      {/* Theme switch + Mobile menu toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-half)",
        }}
      >
        <ThemeSwitch onThemeChange={onThemeChange} />

        <button
          ref={menuButtonRef}
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          className="mobile-menu-button"
          style={{
            display: "none",
            background: "transparent",
            border: "2px solid var(--color-border)",
            padding: "var(--spacing-quarter)",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: "0.875rem",
            lineHeight: 1,
            borderRadius: 0,
            color: "var(--color-text-primary)",
          }}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          role="dialog"
          aria-label="Mobile navigation menu"
          aria-modal="true"
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--color-bg)",
            borderBottom: "2px solid var(--color-border)",
            padding: "var(--spacing-grid)",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-half)",
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = currentHash === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                onKeyDown={(e) => handleKeyDown(e, link.href)}
                aria-current={isActive ? "page" : undefined}
                style={{
                  textDecoration: "none",
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-primary)",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "1.125rem",
                  padding: "var(--spacing-half) 0",
                  borderBottom: "1px solid var(--color-border-subtle)",
                }}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none !important;
          }
          .mobile-menu-button {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}