# Nicholas Yun — "The Engineered Soul" (v2.0)

[![Framework](https://img.shields.io/badge/Framework-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Drizzle-336791?logo=postgresql)](https://orm.drizzle.team/)

An avant-garde digital installation balancing **Tactile Brutalism** with **High-End Editorial** design. This project is a meticulous port of the Nicholas Yun portfolio from a Vite SPA to the **Next.js 16 App Router**, preserving architectural integrity and design fidelity.

## Overview

- **The Problem**: Transitioning a highly interactive, kinetic Vite SPA to a server-rendered Next.js environment without losing performance or design precision.
- **The Solution**: A Client-Side SPA Orchestrator model embedded within the Next.js App Router, utilizing hash-based routing and static TypeScript data ingestion to maintain the original "digital installation" feel.

## Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 16.2.9 | App Router, Server Components |
| **Runtime** | React | 19.2.7 | UI Library |
| **Styling** | Tailwind CSS | 4.1.17 | CSS-first utility styling |
| **Database** | PostgreSQL | 17+ | Persistent storage (optional) |
| **ORM** | Drizzle | 0.45.2 | Type-safe database management |
| **Language** | TypeScript | 5.9.3 | Type safety (`strict` + `noUncheckedIndexedAccess`) |

## Design System

- **Core Aesthetic**: Tactile Brutalism (Zero border-radius, visible grids).
- **Mathematical Grid**: 28px visible background grid governing all spacing (`--spacing-grid`).
- **Typography Hierarchy**:
  - **Editorial**: *Cormorant Garamond* — Heading/Narrative (`--font-editorial` / `--font-serif` / `--font-display`).
  - **Utility**: *IBM Plex Mono* — Labels/Machine Mode (`--font-utility` / `--font-mono`).
  - **Body**: *DM Sans* — General content (`--font-body` / `--font-sans`), replaces Inter for anti-generic identity.
- **Dual Theme**: High-contrast "Night" (Dark) and warm "Day" (Cream) modes, toggled via `data-theme` attribute on `<body>`. FOUC prevention via inline `ThemeScript` in `layout.tsx`.

## File Hierarchy

- `src/app/` — Next.js entry points (`layout.tsx`, `page.tsx`, `error.tsx`, `not-found.tsx`), global design system (`globals.css`), the SPA orchestrator (`PortfolioApp.tsx`), and API routes.
- `src/components/` — Modular brutalist UI components. 18 active + 14 dormant (from earlier iterations, awaiting integration or removal).
- `src/hooks/` — Custom interaction logic (`useRouteHash`, `useReducedMotion`, `useWeightedScroll`, `useViewTransitions`).
- `src/lib/` — Static content arrays, TypeScript interfaces, and utility functions.
- `src/db/` — Drizzle schema and database configuration (optional — app runs without `DATABASE_URL`).
- `public/` — Static assets (favicon only; portrait assets pending).

## Quick Start

### Prerequisites

- Node.js >= 20
- PostgreSQL (for database-dependent features; the app runs without it)

### Installation

```bash
npm install
cp .env.example .env   # Configure your database URL (optional)
```

### Development

```bash
npm run dev
```

### Verification

```bash
npm run typecheck  # TypeScript validation (runs before build)
npm run lint       # ESLint check
npm run build      # Production build (runs typecheck + next build)
```

## Project Status

| Phase | Status | Key Deliverables |
| :--- | :--- | :--- |
| **0: Design System** | Complete | `globals.css` with `@theme` tokens, day/night theme overrides, keyframes |
| **1: Core Logic** | Complete | Hooks (`useRouteHash`, `useReducedMotion`, `useWeightedScroll`, `useViewTransitions`) |
| **2: Components** | Complete | 32 components total (18 active, 14 dormant) |
| **3: Data Layer** | Complete | Static content arrays, consolidated `Project` type, Drizzle schema |
| **4: Orchestration** | Complete | `PortfolioApp.tsx` with ErrorBoundary + Suspense wrapping per section |
| **5: Entry Point** | Complete | `page.tsx` with client-side dynamic import + `react-error-boundary` |
| **6: Remediation 1** | Complete | 40 files updated, build errors resolved, typecheck passing |
| **7: Remediation 2** | Complete | 14 files updated, `Project` type consolidated, missing types added, `noUncheckedIndexedAccess` enabled, 34 type errors resolved |

## Testing

- **Command**: `npm test` (TDD preferred)
- **Convention**: Test behavior over implementation; use mocks for DB operations.

## Troubleshooting

### Build Errors

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| `npm install` fails with `ETARGET` | Package version doesn't exist on npm | Check `package.json` versions against `npm view <pkg> dist-tags` |
| `optimizeFonts` not in `NextConfig` | Property removed in Next.js 16 | Remove from `next.config.ts` |
| `ssr: false` not allowed in Server Components | `page.tsx` was a Server Component using `next/dynamic` with `ssr: false` | Ensure `page.tsx` has `"use client"` directive |
| `@import url()` CSS warning | Google Fonts import must precede all other rules | Move `@import url(...)` before `@import "tailwindcss"` in `globals.css` |
| `db is possibly null` | Database connection is optional | Add null guard: `if (!db) { return Response.json({...}, { status: 503 }); }` |
| `Property X does not exist on type [...]` | `noUncheckedIndexedAccess: true` flags array index access | Use optional chaining (`arr[i]?.`) or null coalescing (`arr[i] ?? default`) |
| `Type 'unknown' is not assignable to type 'Error'` | `react-error-boundary` v4 changed `FallbackProps.error` to `unknown` | Type the prop as `error: unknown` and use `instanceof Error` guard |
| Cannot find module `react-error-boundary` | Package not installed | Run `npm install react-error-boundary` |
| Cannot find module `@/components/PortfolioApp` | `PortfolioApp.tsx` lives in `src/app/`, not `src/components/` | Import from `@/app/PortfolioApp` |

### CSS Variables Not Resolving

The project has **two naming conventions** for CSS variables coexisting. The canonical system (defined in `globals.css` `@theme`) uses the `--color-` prefix (e.g., `--color-border`, `--color-text-primary`). Several dormant components use shorthand names (e.g., `--border-color`, `--text-primary`) that are **not defined**. If integrating dormant components, either:
- Add alias variables in `globals.css`, or
- Rewrite the component to use the `--color-` prefix convention.

**Additionally, 14 CSS variables are referenced by ACTIVE components but not defined in `@theme`** (e.g., `--font-display`, `--spacing-half`, `--transition-fast`, `--shadow-brutal`). These resolve to `unset` at runtime, causing broken transitions, missing shadows, and transparent backgrounds. See Known Issues below.

### Tailwind Utility Classes Not Working

Dormant components use custom Tailwind classes (`font-utility`, `font-editorial`, `font-body`, `z-grain`, `z-machine`, etc.) that are now defined in the `@theme` block as `--font-*` and `--z-index-*` variables. However, Tailwind v4 maps these to `font-editorial`, `font-utility`, `font-body` utility classes and `z-grain`, `z-machine` etc. — verify the mapping works correctly before relying on them.

## Known Issues

### Critical

1. **14 undefined CSS variables in active components** — Variables like `--font-display`, `--spacing-half`, `--spacing-quarter`, `--spacing-double`, `--transition-fast`, `--shadow-brutal`, `--shadow-brutal-sm`, `--color-text-inverse`, `--color-border-subtle`, `--color-bg-sunken`, `--color-bg-elevated`, `--color-error`, `--color-accent-subtle` are used by active components but not defined in `@theme`. They resolve to `unset` at runtime, causing missing shadows, broken transitions, and transparent backgrounds.
2. **Hash routing mismatch** — `useRouteHash` validates against `["hero","who","work","skills","music","now","contact"]` but the actual section IDs in `PortfolioApp` are `["hero","about","projects","skills","experience","blog","terminal","contact"]`. Only `hero`, `skills`, and `contact` match, breaking `aria-current` indicators and active link highlighting for most sections.

### Moderate

3. **Duplicate skip-link** — Both `layout.tsx` and `PortfolioApp.tsx` render a skip-to-content link. Remove one — keep in `layout.tsx` (server-rendered, always present).
4. **Theme target inconsistency** — `ThemeScript` sets `data-theme` on `document.documentElement` (`<html>`), but `PortfolioApp` sets it on `document.body`. CSS `[data-theme="day"]` rules only match the element they're set on. Pick one target and use it consistently.
5. **Duplicate project data** — `src/lib/data.ts` contains an identical copy of the `projects` array that's in `src/lib/projects.ts`. `data.ts` is never imported by any active component — it's dead code.
6. **Contact form is simulated** — `ContactSection.tsx` uses a `setTimeout` mock instead of a real API endpoint.
7. **No error reporting** — `error.tsx` has a `console.error` placeholder for Sentry or similar.
8. **Missing portrait assets** — `src/lib/data.ts` references `/portraits/*.webp` files that don't exist in `public/`.
9. **No SSR** — `page.tsx` is a Client Component with `ssr: false`, so search engines see only the loading state. Consider re-enabling SSR with `Suspense` boundaries for SEO.

### Low

10. **Hardcoded DB credentials** — `drizzle.config.json` has `postgres:postgres` instead of an environment variable.
11. **`NEXT_PUBLIC_SITE_URL` unused** — Defined in `.env.example` but never read; `metadataBase` in `layout.tsx` is hardcoded.
12. **Analytics table never written to** — The `analytics` table schema exists and the health endpoint checks DB connectivity, but no code ever inserts rows.
13. **~40% of codebase is dormant** — 14 component files, 5 lib files, and 2 hooks are never imported. They create maintenance confusion and should be integrated or removed.
14. **`useAccessibility()` hook never consumed** — `AccessibilityProvider` exports a context hook that no component uses. Components that need reduced-motion use `useReducedMotion()` directly or check `window.matchMedia` inline.
15. **Contact info scattered** — Email, GitHub, and LinkedIn are consistent where they appear but hardcoded in multiple places (Footer, Terminal, layout.tsx structured data) instead of imported from a single source of truth.

## Lessons Learnt

1. **Verify npm versions before pinning** — Remediation specified `@types/react-dom@^19.2.6` which didn't exist (max was 19.2.3). Always check with `npm view <pkg> dist-tags` before updating `package.json`.
2. **CSS import order is critical** — In Tailwind v4, `@import "tailwindcss"` expands to `@layer` rules. Any `@import url()` for external fonts **must** come before it, or the CSS optimizer will reject it.
3. **Next.js 16 removes `optimizeFonts`** — This `next.config.ts` option no longer exists. Font optimization is automatic.
4. **`ssr: false` requires Client Components** — In Next.js 16, `next/dynamic` with `ssr: false` cannot be used in Server Components. The page must have `"use client"`.
5. **Two design token systems create technical debt** — Dormant components use shorthand CSS variable names (`--border-color`) while `@theme` uses `--color-` prefix (`--color-border`). Must reconcile before integration.
6. **Null-safe database access** — Since `DATABASE_URL` is optional, `db` can be `null`. Any API route using `db` must include a null guard.
7. **`noUncheckedIndexedAccess` catches real bugs** — Enabling this strict TypeScript option revealed 6+ places where array index access could return `undefined`, including `commandHistory[newIndex]`, `columns[i]`, and `CHARS[index]`. Always use `?.` or `??` for index access.
8. **`react-error-boundary` v4 changed `FallbackProps.error` type** — The `error` prop changed from `Error` to `unknown`. Custom fallback components must type it as `unknown` and use `instanceof Error` to access `.message`.
9. **`PortfolioApp.tsx` location matters** — It lives in `src/app/`, not `src/components/`. The import in `page.tsx` must be `@/app/PortfolioApp`, not `@/components/PortfolioApp`. The App Router co-locates the orchestrator with the route.
10. **Undefined CSS variables silently fail** — When `var(--font-display)` resolves to `unset`, there's no error or warning — the property just doesn't apply. Always audit `var()` references against `@theme` definitions after any refactoring.

## Recommendations

1. **Define 14 missing CSS variables in `@theme`** — Add `--font-display`, `--spacing-half`, `--spacing-quarter`, `--spacing-double`, `--transition-fast`, `--shadow-brutal`, `--shadow-brutal-sm`, `--color-text-inverse`, `--color-border-subtle`, `--color-bg-sunken`, `--color-bg-elevated`, `--color-error`, `--color-accent-subtle`, and day-theme overrides where applicable.
2. **Fix hash routing section names** — Update `useRouteHash`'s `VALID_SECTIONS` to match actual section IDs: `["hero","about","projects","skills","experience","blog","terminal","contact"]`.
3. **Remove duplicate skip-link** — Keep it in `layout.tsx` only (server-rendered, always present).
4. **Standardize theme target** — Pick either `<html>` or `<body>` for `data-theme` and use it consistently across `ThemeScript` and `PortfolioApp`.
5. **Delete dead code** — Remove `src/lib/data.ts`, `src/lib/content.ts`, `src/lib/utils.ts`, `src/lib/testimonials.ts`, `src/lib/sounds.ts`, `src/hooks/useViewTransitions.ts`, `src/hooks/useWeightedScroll.ts` and any dormant components you don't plan to integrate. This reduces ~40% of the codebase and eliminates confusion.
6. **Reconcile CSS variable naming for dormant components** — If keeping any dormant components, either add alias variables in `globals.css` or rewrite them to use the `--color-` prefix convention.
7. **Add portrait assets** — Place webp images in `public/portraits/` or remove `portraitMap` references from `data.ts`.
8. **Centralize contact info** — Export email, GitHub, and LinkedIn from a single source (e.g., `src/lib/config.ts`) and import everywhere instead of hardcoding.
9. **Fix `drizzle.config.json`** — Use `process.env.DATABASE_URL` instead of hardcoded credentials.
10. **Wire contact form** — Create an API route (`/api/contact`) or integrate a third-party service.
11. **Consider re-enabling SSR** — Replace `ssr: false` with `Suspense` boundaries for better SEO while keeping interactive features client-side.
12. **Consume `useAccessibility()`** — Replace direct `window.matchMedia("(prefers-reduced-motion: reduce)")` checks in components with the context hook from `AccessibilityProvider` for consistency.

## License

Proprietary — All rights reserved.
