"use client";

import { Suspense, lazy, useCallback, useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroKinetic from "@/components/HeroKinetic";
import SectionBlock from "@/components/SectionBlock";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useRouteHash } from "@/hooks/useRouteHash";

// Dynamic imports for below-the-fold sections (code splitting)
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const SkillsSection = lazy(() => import("@/components/SkillsSection"));
const Timeline = lazy(() => import("@/components/Timeline"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const BlogSection = lazy(() => import("@/components/BlogSection"));
const Terminal = lazy(() => import("@/components/Terminal"));
const Footer = lazy(() => import("@/components/Footer"));
const BentoGrid = lazy(() => import("@/components/BentoGrid"));

function SectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        minHeight: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        color: "var(--color-text-muted)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      Loading&hellip;
    </div>
  );
}

function SectionError({ name }: { name: string }) {
  return (
    <div
      role="alert"
      style={{
        padding: "var(--spacing-grid)",
        border: "2px solid var(--color-error, #c0392b)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.8125rem",
      }}
    >
      <p>Failed to load the {name} section.</p>
    </div>
  );
}

export default function PortfolioApp() {
  const [currentHash, navigateTo] = useRouteHash();

  // Apply theme from localStorage or system preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const theme = savedTheme || (prefersDark ? "night" : "day");

    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const handleThemeChange = useCallback((theme: "day" | "night") => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Announce theme change to screen readers
    const announcement = document.getElementById("theme-announcement");
    if (announcement) {
      announcement.textContent = `Switched to ${theme} theme`;
    }
  }, []);

  return (
    <>
      {/* Live region for theme change announcements */}
      <div
        id="theme-announcement"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <header role="banner">
        <Navigation currentHash={currentHash} onNavigate={navigateTo} onThemeChange={handleThemeChange} />
      </header>

      <main id="main-content" role="main">
        {/* Hero — always loaded eagerly (above the fold) */}
        <section id="hero" aria-label="Introduction">
          <ErrorBoundary fallback={<SectionError name="Hero" />}>
            <HeroKinetic onNavigate={navigateTo} />
          </ErrorBoundary>
        </section>

        {/* Below-the-fold sections — lazy loaded */}
        <section id="about" aria-label="About">
          <ErrorBoundary fallback={<SectionError name="About" />}>
            <Suspense fallback={<SectionSkeleton />}>
              <SectionBlock id="about-content" title="About">
                <BentoGrid />
              </SectionBlock>
            </Suspense>
          </ErrorBoundary>
        </section>

        <section id="projects" aria-label="Projects">
          <ErrorBoundary fallback={<SectionError name="Projects" />}>
            <Suspense fallback={<SectionSkeleton />}>
              <SectionBlock id="projects-content" title="Projects">
                <ProjectsSection />
              </SectionBlock>
            </Suspense>
          </ErrorBoundary>
        </section>

        <section id="skills" aria-label="Skills">
          <ErrorBoundary fallback={<SectionError name="Skills" />}>
            <Suspense fallback={<SectionSkeleton />}>
              <SectionBlock id="skills-content" title="Skills">
                <SkillsSection />
              </SectionBlock>
            </Suspense>
          </ErrorBoundary>
        </section>

        <section id="experience" aria-label="Experience">
          <ErrorBoundary fallback={<SectionError name="Experience" />}>
            <Suspense fallback={<SectionSkeleton />}>
              <SectionBlock id="experience-content" title="Experience">
                <Timeline />
              </SectionBlock>
            </Suspense>
          </ErrorBoundary>
        </section>

        <section id="blog" aria-label="Blog">
          <ErrorBoundary fallback={<SectionError name="Blog" />}>
            <Suspense fallback={<SectionSkeleton />}>
              <SectionBlock id="blog-content" title="Blog">
                <BlogSection />
              </SectionBlock>
            </Suspense>
          </ErrorBoundary>
        </section>

        <section id="terminal" aria-label="Interactive Terminal">
          <ErrorBoundary fallback={<SectionError name="Terminal" />}>
            <Suspense fallback={<SectionSkeleton />}>
              <Terminal />
            </Suspense>
          </ErrorBoundary>
        </section>

        <section id="contact" aria-label="Contact">
          <ErrorBoundary fallback={<SectionError name="Contact" />}>
            <Suspense fallback={<SectionSkeleton />}>
              <SectionBlock id="contact-content" title="Get in Touch">
                <ContactSection />
              </SectionBlock>
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>

      <footer role="contentinfo">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </footer>
    </>
  );
}