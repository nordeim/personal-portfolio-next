# Nicholas Yun Portfolio — "The Engineered Soul" (v2.0)

A digital installation balancing **Tactile Brutalism** with **High-End Editorial**. This project is a port of the Nicholas Yun portfolio from a Vite SPA to the **Next.js 16 App Router**, preserving all design fidelity, interactions, and content.

## Project Overview

- **Purpose:** Personal portfolio for Nicholas Yun, Software Engineer & Designer.
- **Architecture:** Next.js 16 (App Router) with a Client-Side SPA Orchestrator (`PortfolioApp.tsx`). SSR is enabled (no `ssr: false`). Theme initialization handled by `ThemeScript` in `<head>`.
- **Tech Stack:**
  - **Framework:** Next.js 16.2.9 (App Router, Server Components)
  - **Runtime:** React 19.2.7
  - **Styling:** Tailwind CSS v4.1.17 + PostCSS (Brutalist defaults)
  - **Database:** PostgreSQL with Drizzle ORM 0.45.2 (optional)
  - **Language:** TypeScript 5.9.3 (`strict` + `noUncheckedIndexedAccess`)
  - **Error Boundaries:** `react-error-boundary` v6.1.2

## Building and Running

### Development
```bash
npm run dev          # next dev --turbopack
```

### Production Build
```bash
npm run build        # typecheck + next build
npm run start        # next start
```

### Quality Control
```bash
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

### Database (Drizzle)
```bash
npx drizzle-kit push    # Sync schema to DB
npx drizzle-kit studio  # Open DB explorer
```

> Database is **optional**. Without `DATABASE_URL`, the app runs normally — DB features return 503.

## Development Conventions

### 1. Design Philosophy: "Tactile Brutalism + High-End Editorial"
- **Brutalist Enforcement:** `border-radius: 0` is enforced globally in `globals.css`, including scrollbar thumb. Do not use rounded corners.
- **The 28px Grid:** Layout governed by `--spacing-grid` (28px). Derived: `--spacing-double` (56px), `--spacing-half` (14px), `--spacing-quarter` (7px). Do NOT use `var(--unit)` — it does not exist.
- **Typography Hierarchy:**
  - **Editorial:** `Cormorant Garamond` (Serif) — `var(--font-editorial)` / `var(--font-serif)` / `var(--font-display)`.
  - **Utility:** `IBM Plex Mono` (Monospace) — `var(--font-utility)` / `var(--font-mono)`.
  - **Body:** `DM Sans` (Sans-serif) — `var(--font-body)` / `var(--font-sans)`. **NOT Inter.**
- **Dual Theme:** Toggled via `data-theme="night"` / `data-theme="day"` on `<html>`. CSS selectors target `[data-theme="day"]`. Do NOT use class-based switching (`theme-night` / `theme-day`). All CSS variables use the `--color-` prefix (e.g., `var(--color-border)`, `var(--color-text-primary)`). Do NOT use shorthand names like `--bg-primary` or `--text-primary` — they do not exist.

### 2. Implementation Rules
- **Client-Side Orchestration:** Most portfolio logic runs in `src/app/PortfolioApp.tsx` (Client Component with `"use client"`). Note: this file is in `src/app/`, NOT `src/components/`. Import as `@/app/PortfolioApp`.
- **Entry Point:** `src/app/page.tsx` is a Client Component that dynamically imports `PortfolioApp`. SSR is enabled. Uses `react-error-boundary` (not the custom `ErrorBoundary`).
- **Routing:** Hash-based routing via `useRouteHash` hook. Uses `history.pushState` (not `window.location.hash`) to avoid scroll-to-anchor. Sections: `hero`, `about`, `projects`, `skills`, `experience`, `blog`, `terminal`, `contact`.
- **Content Strategy:** Active data comes from `src/lib/projects.ts`, `src/lib/skills.ts`, `src/lib/timeline.ts`. The file `src/lib/_archive/data.ts` is **archived dead code** — do NOT import from it.
- **Site Configuration:** Centralized in `src/lib/site-config.ts` — name, email, social links, URLs. Do NOT hardcode these in components.
- **Accessibility (WCAG AAA):**
  - Skip link provided in `layout.tsx`.
  - `focus-visible` for keyboard navigation.
  - `useReducedMotion` hook respected by all animations.
  - Focus management on hash navigation (keyboard users are moved to section headings).
  - ARIA attributes on all interactive widgets.

### 3. Component Architecture
- **Active Components (16):** Navigation, HeroKinetic, SectionBlock, ErrorBoundary, BentoGrid, ProjectsSection, ProjectCard, SkillsSection, Timeline, BlogSection, Terminal, ContactSection, Footer, ThemeSwitch, ScrollReveal, ThemeScript (Server Component in `layout.tsx`).
- **Archived Components (15):** In `src/components/_archive/` — AboutFlow, ArchiveSpread, ArchiveItemCard, BentoTile, BrandMark, ClientOnly, CodeRain, ContentBody, DitherOverlay, GrainOverlay, LayoutShell, MachineOverlay, MobileDrawer, SocialIcon, ThemeToggle. Do NOT import from `_archive/` in active code.
- **Stateless Primitives:** Keep `src/components/` as stateless as possible.
- **Custom Hooks:** `useRouteHash` (hash routing), `useReducedMotion` (motion preference). Archived hooks in `src/hooks/_archive/`.

## Project Structure
- `src/app/`: Next.js App Router entry points (`layout.tsx`, `page.tsx`, `error.tsx`, `not-found.tsx`), global styles (`globals.css`), SPA orchestrator (`PortfolioApp.tsx`), API routes (`/api/contact`, `/api/health`).
- `src/components/`: 16 active UI components. 15 archived in `_archive/` subdirectory.
- `src/hooks/`: Custom interaction logic — 2 active, 2 archived.
- `src/lib/`: Static content arrays, TypeScript interfaces (`types.ts`), site config (`site-config.ts`), rate limiting (`rate-limit.ts`). 5 archived files in `_archive/`.
- `src/db/`: Drizzle schema and database client (nullable — graceful no-DB).
- `public/`: Static assets — `favicon.svg`, `og-image.png`. Portrait assets pending.

## Critical Gotchas

- **CSS Variable Naming:** Always use `--color-` prefix (`--color-border`, `--color-text-primary`). Archived components use shorthand names that do NOT exist.
- **`react-error-boundary` v6+** has `FallbackProps.error` typed as `unknown` (not `Error`). Use `instanceof Error` guard.
- **`noUncheckedIndexedAccess: true`** — Array index access returns `T | undefined`. Always use `?.` or `??`.
- **`optimizeFonts` does not exist** in Next.js 16 — do NOT add to `next.config.ts`.
- **CSS import order:** `@import "tailwindcss"` must come first. Google Fonts loaded via `<link>` in `layout.tsx`, NOT via `@import url()` in CSS.
- **`PortfolioApp` is at `@/app/PortfolioApp`**, NOT `@/components/PortfolioApp`.
- **Contact API** only logs to console — email delivery not yet configured. Response is honest about this.
- **Rate limiter** is in-memory only (single-instance dev). Replace with Redis/Upstash for production.
- **`drizzle.config.ts`** throws if `DATABASE_URL` is not set — this is intentional for Drizzle Kit.
- **License:** MIT (consistent between `package.json` and README).

---
*Last updated: 2026-06-15. This file must be updated in the same pass as CLAUDE.md and AGENTS.md.*
