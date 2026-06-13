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
- **Dual Theme**: High-contrast "Night" (Dark) and warm "Day" (Cream) modes, toggled via `data-theme` attribute on `<html>`. FOUC prevention via inline `ThemeScript` in `layout.tsx`. System preference detection (`prefers-color-scheme`) when no stored value exists.

## File Hierarchy

- `src/app/` — Next.js entry points (`layout.tsx`, `page.tsx`, `error.tsx`, `not-found.tsx`), global design system (`globals.css`), the SPA orchestrator (`PortfolioApp.tsx`), and API routes (`/api/contact`, `/api/health`).
- `src/components/` — 17 active brutalist UI components. 14 archived components in `src/components/_archive/` (dormant from earlier iterations, awaiting integration or removal).
- `src/hooks/` — Custom interaction logic: 2 active (`useRouteHash`, `useReducedMotion`), 2 archived in `src/hooks/_archive/`.
- `src/lib/` — Static content arrays (`projects.ts`, `skills.ts`, `timeline.ts`), TypeScript interfaces (`types.ts`), centralized site config (`site-config.ts`), rate limiting utility (`rate-limit.ts`). 5 archived files in `src/lib/_archive/`.
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
| **1: Core Logic** | Complete | Hooks (`useRouteHash`, `useReducedMotion`) |
| **2: Components** | Complete | 17 active + 14 archived components |
| **3: Data Layer** | Complete | Static content arrays, consolidated `Project` type, Drizzle schema |
| **4: Orchestration** | Complete | `PortfolioApp.tsx` with ErrorBoundary + Suspense wrapping per section |
| **5: Entry Point** | Complete | `page.tsx` with client-side dynamic import + `react-error-boundary` |
| **6: Remediation 1** | Complete | 40 files updated, build errors resolved, typecheck passing |
| **7: Remediation 2** | Complete | 14 files updated, `Project` type consolidated, `noUncheckedIndexedAccess` enabled, 34 type errors resolved |
| **8: Remediation 3** | Complete | All 14 missing CSS variables defined in `@theme` with day overrides, hash routing aligned, theme target unified on `<html>`, system preference detection added, site config centralized (`site-config.ts`), contact API endpoint with rate limiting, dead code archived to `_archive/` directories |

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
| `useRouteHash` destructuring mismatch | Hook returns a tuple `[string, fn]`, not an object | Destructure as `[currentHash, navigateTo]` not `{ currentHash, navigateTo }` |
| `Project` type missing `tags`/`github`/`live` fields | Old Vite-era shape; consolidated `Project` uses `tech`, `links.repo`, `links.live` | Update imports to use `@/lib/projects` re-export |

### CSS Variables Not Resolving

The project uses a single canonical `--color-` prefix convention defined in `globals.css` `@theme` block (e.g., `--color-border`, `--color-text-primary`). All 14 previously undefined variables (`--font-display`, `--spacing-half`, `--transition-fast`, `--shadow-brutal`, `--color-text-inverse`, etc.) have been defined as of Remediation 3. Archived components in `_archive/` directories still use shorthand names (`--border-color`, `--text-primary`) that are **not defined**. If integrating archived components, either add alias variables in `globals.css` or rewrite them to use the `--color-` prefix convention.

### Tailwind Utility Classes Not Working

Archived components use custom Tailwind classes (`font-utility`, `font-editorial`, `font-body`, `z-grain`, `z-machine`, etc.) that are defined in the `@theme` block as `--font-*` and `--z-index-*` variables. Tailwind v4 maps these to `font-editorial`, `font-utility`, `font-body` utility classes and `z-grain`, `z-machine` etc. — verify the mapping works correctly before relying on them.

### Theme Not Persisting

The theme system uses `localStorage` with the key `"theme"`. `ThemeScript` (inline in `layout.tsx`) reads from localStorage and falls back to system preference (`prefers-color-scheme`). Both `ThemeScript` and `PortfolioApp` now target `document.documentElement` consistently. If theme fails to persist, check that localStorage is available (not blocked by private browsing).

## Known Issues

### Moderate

1. **`drizzle.config.json` hardcoded credentials** — Contains `postgres:postgres` instead of an environment variable. Replace with `process.env.DATABASE_URL` or `.env` variable before any deployment.
2. **Contact API logs to console** — The `/api/contact` endpoint validates and rate-limits requests, but only logs submissions to the server console (see `TODO` in `route.ts`). A real email service (Resend, SendGrid, etc.) needs to be integrated before production use.
3. **No error reporting** — `error.tsx` has a `console.error` placeholder for Sentry or similar. No structured error reporting exists.
4. **Analytics table never written to** — The `analytics` table schema exists and the health endpoint checks DB connectivity, but no code ever inserts rows.
5. **Missing portrait assets** — Archived `data.ts` references `/portraits/*.webp` files that don't exist in `public/`.
6. **No SSR** — `page.tsx` is a Client Component with `ssr: false`, so search engines see only the loading state. Consider re-enabling SSR with `Suspense` boundaries for SEO.

### Low

7. **`useAccessibility()` hook never consumed** — `AccessibilityProvider` exports a context hook (`useAccessibility`) that provides `prefersReducedMotion` and `prefersHighContrast`. No child component consumes it; they use `useReducedMotion()` directly or check `window.matchMedia` inline.
8. **Archived components use old CSS variable names** — Components in `_archive/` reference shorthand variable names (`--border-color`, `--text-primary`, etc.) that don't exist in `@theme`. Must be updated before reintegration.
9. **Scrollbar `border-radius: 3px`** — The custom scrollbar style in `globals.css` uses `border-radius: 3px`, which violates the zero border-radius brutalist rule. Should be `border-radius: 0`.

## Lessons Learnt

1. **Verify npm versions before pinning** — Remediation specified `@types/react-dom@^19.2.6` which didn't exist (max was 19.2.3). Always check with `npm view <pkg> dist-tags` before updating `package.json`.
2. **CSS import order is critical** — In Tailwind v4, `@import "tailwindcss"` expands to `@layer` rules. Any `@import url()` for external fonts **must** come before it, or the CSS optimizer will reject it.
3. **Next.js 16 removes `optimizeFonts`** — This `next.config.ts` option no longer exists. Font optimization is automatic.
4. **`ssr: false` requires Client Components** — In Next.js 16, `next/dynamic` with `ssr: false` cannot be used in Server Components. The page must have `"use client"`.
5. **Two design token systems create technical debt** — Archived components use shorthand CSS variable names (`--border-color`) while `@theme` uses `--color-` prefix (`--color-border`). Must reconcile before integration. Moving dormant code to `_archive/` directories prevents confusion about what's active.
6. **Null-safe database access** — Since `DATABASE_URL` is optional, `db` can be `null`. Any API route using `db` must include a null guard.
7. **`noUncheckedIndexedAccess` catches real bugs** — Enabling this strict TypeScript option revealed 6+ places where array index access could return `undefined`, including `commandHistory[newIndex]`, `columns[i]`, and `CHARS[index]`. Always use `?.` or `??` for index access.
8. **`react-error-boundary` v4 changed `FallbackProps.error` type** — The `error` prop changed from `Error` to `unknown`. Custom fallback components must type it as `unknown` and use `instanceof Error` to access `.message`.
9. **`PortfolioApp.tsx` location matters** — It lives in `src/app/`, not `src/components/`. The import in `page.tsx` must be `@/app/PortfolioApp`, not `@/components/PortfolioApp`. The App Router co-locates the orchestrator with the route.
10. **Undefined CSS variables silently fail** — When `var(--font-display)` resolves to `unset`, there's no error or warning — the property just doesn't apply. Always audit `var()` references against `@theme` definitions after any refactoring. The solution is to define every referenced variable in `@theme` with appropriate defaults and day-theme overrides.
11. **Centralize configuration early** — Contact info, site name, and social links were hardcoded in 4+ places (Footer, Terminal, layout.tsx, Navigation). Creating `site-config.ts` as a single source of truth eliminated drift risk and simplified future changes.
12. **Theme target must be consistent** — Setting `data-theme` on different DOM elements (`<html>` vs `<body>`) causes CSS selectors to break. Pick one target (`<html>`) and use it everywhere — both in `ThemeScript` (initial paint) and `PortfolioApp` (runtime toggle).
13. **Hash routing section names must match actual IDs** — When `VALID_SECTIONS` in `useRouteHash` diverges from actual section IDs in `PortfolioApp`, `aria-current` indicators and active link highlighting silently break for mismatched sections. Keep these in sync.
14. **Rate limiting is essential for public API routes** — Without rate limiting, the contact form endpoint is vulnerable to abuse. Even a simple in-memory sliding window algorithm (as implemented in `rate-limit.ts`) provides meaningful protection for single-instance deployments.
15. **Archiving dormant code reduces confusion** — Moving unused components, hooks, and lib files to `_archive/` directories makes it immediately clear what code is active vs. dormant, reducing the risk that developers accidentally import dead code.

## Recommendations

1. **Fix `drizzle.config.json`** — Use `process.env.DATABASE_URL` instead of hardcoded credentials. This is the only remaining file with a plaintext database URL.
2. **Integrate an email service** — Replace the `console.log` in `/api/contact/route.ts` with a real email provider (Resend, SendGrid, etc.) before deploying to production.
3. **Add error reporting** — Integrate Sentry or a similar service in `error.tsx` and the global error boundary.
4. **Consume `useAccessibility()`** — Replace direct `window.matchMedia("(prefers-reduced-motion: reduce)")` checks in components with the context hook from `AccessibilityProvider` for consistency.
5. **Fix scrollbar `border-radius`** — Change `border-radius: 3px` to `border-radius: 0` in the scrollbar styles in `globals.css` to maintain brutalist consistency.
6. **Reconcile CSS variable naming for archived components** — If reintegrating any archived components, either add alias variables in `globals.css` or rewrite them to use the `--color-` prefix convention.
7. **Add portrait assets** — Place webp images in `public/portraits/` if needed, or remove references from archived `data.ts`.
8. **Consider re-enabling SSR** — Replace `ssr: false` with `Suspense` boundaries for better SEO while keeping interactive features client-side.
9. **Write to analytics table** — Either implement middleware to track page views or remove the unused `analytics` table schema.
10. **Replace in-memory rate limiting for production** — The current `rate-limit.ts` uses a `Map` which doesn't persist across instances. For multi-instance deployments (Vercel, Docker), replace with Redis/Upstash rate limiting.

## License

Proprietary — All rights reserved.
