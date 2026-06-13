# Nicholas Yun — "The Engineered Soul" (v2.0)

[![Framework](https://img.shields.io/badge/Framework-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![Database](https://img.shadge.io/badge/Database-PostgreSQL%20%2B%20Drizzle-336791?logo=postgresql)](https://orm.drizzle.team/)

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
| **Language** | TypeScript | 5.9.3 | Type safety |

## Design System

- **Core Aesthetic**: Tactile Brutalism (Zero border-radius, visible grids).
- **Mathematical Grid**: 28px visible background grid governing all spacing.
- **Typography Hierarchy**:
  - **Editorial**: *Cormorant Garamond* — Heading/Narrative.
  - **Utility**: *IBM Plex Mono* — Labels/Machine Mode.
  - **Body**: *DM Sans* — General content (replaces Inter for anti-generic identity).
- **Dual Theme**: High-contrast "Night" (Dark) and warm "Day" (Cream) modes, toggled via `data-theme` attribute on `<body>`.

## File Hierarchy

- `src/app/` — Next.js entry points, global design system, and the SPA orchestrator.
- `src/components/` — Modular brutalist UI components. Includes both active components (used by `PortfolioApp.tsx`) and dormant components (from earlier iterations, awaiting integration).
- `src/hooks/` — Custom interaction logic (Velocity scroll, hash routing, reduced motion).
- `src/lib/` — Static content arrays, TypeScript interfaces, and utility functions.
- `src/db/` — Drizzle schema and database configuration.
- `public/` — Static assets (favicons, portraits — portrait assets pending).

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
| **0: Design System** | Complete | `globals.css`, theme tokens, CSS variables |
| **1: Core Logic** | Complete | Hooks (`useRouteHash`, `useWeightedScroll`, `useReducedMotion`) |
| **2: Components** | Complete | 28 components total (18 active, 10 dormant) |
| **3: Data Layer** | Complete | Static content arrays, Drizzle schema |
| **4: Orchestration** | Complete | `PortfolioApp.tsx` with ErrorBoundary + Suspense wrapping |
| **5: Entry Point** | Complete | `page.tsx` with client-side dynamic import |
| **6: Remediation** | Complete | 40 files updated, build errors resolved, typecheck passing |

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
| `db is possibly null` | Database connection is optional | Add null guard: `if (!db) { return ... }` |

### CSS Variables Not Resolving

The project has **two naming conventions** for CSS variables coexisting. The canonical system (defined in `globals.css` `@theme`) uses the `--color-` prefix (e.g., `--color-border`, `--color-text-primary`). Several dormant components use shorthand names (e.g., `--border-color`, `--text-primary`) that are **not defined**. If integrating dormant components, either:
- Add alias variables in `globals.css`, or
- Rewrite the component to use the `--color-` prefix convention.

### Tailwind Utility Classes Not Working

Dormant components use custom Tailwind classes (`font-utility`, `font-editorial`, `font-body`, `z-grain`, `z-machine`, etc.) that are **not defined** in the `@theme` block. These need to be added to `globals.css` `@theme` before those components can render correctly.

## Known Issues

1. **Duplicate `Project` interface** — `src/lib/types.ts` and `src/lib/projects.ts` export incompatible `Project` types. Needs consolidation into a single canonical definition.
2. **Duplicate skip-link** — Both `layout.tsx` and `PortfolioApp.tsx` render a skip-to-content link. Remove one.
3. **Contact form is simulated** — `ContactSection.tsx` uses a `setTimeout` mock instead of a real API endpoint.
4. **No error reporting** — `error.tsx` has a placeholder for Sentry or similar.
5. **Missing portrait assets** — `src/lib/data.ts` references `/portraits/*.webp` files that don't exist in `public/`.
6. **Email/GitHub inconsistencies** — Different files use different email addresses (`nicholas@example.com` vs `hello@nicholasyun.com`) and GitHub URLs (`nicholasyun` vs `nordeim`).
7. **Hardcoded DB credentials** — `drizzle.config.json` has `postgres:postgres` instead of an environment variable.
8. **No SSR** — `page.tsx` is a Client Component with `ssr: false`, so search engines see only the loading state. Consider re-enabling SSR with `Suspense` boundaries for SEO.

## Lessons Learnt

1. **Version pinning matters** — The remediation specified `@types/react-dom@^19.2.6` which didn't exist on npm (max was 19.2.3). Always verify versions against `npm view` before updating `package.json`.
2. **CSS import order is critical** — In Tailwind v4, `@import "tailwindcss"` expands to `@layer` rules. Any `@import url()` for external fonts **must** come before it, or the CSS optimizer will reject it.
3. **Next.js 16 removes `optimizeFonts`** — This `next.config.ts` option no longer exists in the `NextConfig` type. Font optimization is now handled automatically.
4. **`ssr: false` requires Client Components** — In Next.js 16, `next/dynamic` with `ssr: false` cannot be used in Server Components. The page must have `"use client"`.
5. **Two design token systems create technical debt** — The remediation introduced CSS variables using a shorthand naming convention that differs from the `@theme` block's `--color-` prefix convention. Dormant components use the shorthand, active components use the prefix. This must be reconciled before integrating dormant components.
6. **Null-safe database access** — Since `DATABASE_URL` is optional, `db` can be `null`. Any API route using `db` must include a null guard.

## Recommendations

1. **Reconcile CSS variable naming** — Define aliases in `globals.css` or standardize on one convention across all components.
2. **Add missing Tailwind tokens** — Define `font-utility`, `font-editorial`, `font-body` font families and `z-grain`, `z-machine`, `z-mobile-backdrop`, `z-mobile-drawer` z-index tokens in `@theme`.
3. **Consolidate the `Project` type** — Merge both definitions into `src/lib/types.ts` as the single source of truth.
4. **Remove or integrate dormant components** — The 10+ unused components either need to be wired into `PortfolioApp.tsx` (with CSS variable fixes) or deleted to reduce confusion.
5. **Add portrait assets** — Place webp images in `public/portraits/` or remove `PORTRAIT_MAP` references from `data.ts`.
6. **Remove duplicate skip-link** — Keep it in `layout.tsx` only (runs on server, always present).
7. **Standardize contact info** — Use consistent email and GitHub URLs across all files.
8. **Fix `drizzle.config.json`** — Use `process.env.DATABASE_URL` instead of hardcoded credentials.
9. **Consider re-enabling SSR** — Replace `ssr: false` with `Suspense` boundaries for better SEO while keeping interactive features client-side.
10. **Wire contact form** — Create an API route (`/api/contact`) or integrate a third-party service.

## License

Proprietary — All rights reserved.
