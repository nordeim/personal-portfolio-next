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

- **Core Aesthetic**: Tactile Brutalism (Zero border-radius globally, including scrollbars, visible grids).
- **Mathematical Grid**: 28px visible background grid governing all spacing (`--spacing-grid`).
- **Typography Hierarchy**:
  - **Editorial**: *Cormorant Garamond* — Heading/Narrative (`--font-editorial` / `--font-serif` / `--font-display`).
  - **Utility**: *IBM Plex Mono* — Labels/Machine Mode (`--font-utility` / `--font-mono`).
  - **Body**: *DM Sans* — General content (`--font-body` / `--font-sans`), replaces Inter for anti-generic identity.
- **Dual Theme**: High-contrast "Night" (Dark) and warm "Day" (Cream) modes, toggled via `data-theme` attribute on `<html>`. FOUC prevention via inline `ThemeScript` in `layout.tsx`. System preference detection (`prefers-color-scheme`) when no stored value exists. All text-muted colors pass WCAG AA contrast ratios in both themes.

## File Hierarchy

- `src/app/` — Next.js entry points (`layout.tsx`, `page.tsx`, `error.tsx`, `not-found.tsx`), global design system (`globals.css`), the SPA orchestrator (`PortfolioApp.tsx`), and API routes (`/api/contact`, `/api/health`).
- `src/components/` — 16 active brutalist UI components (including `ThemeScript`, a Server Component). 15 archived components in `src/components/_archive/` (dormant from earlier iterations, awaiting integration or removal).
- `src/hooks/` — Custom interaction logic: 2 active (`useRouteHash`, `useReducedMotion`), 2 archived in `src/hooks/_archive/`.
- `src/lib/` — Static content arrays (`projects.ts`, `skills.ts`, `timeline.ts`), TypeScript interfaces (`types.ts`), centralized site config (`site-config.ts`), rate limiting utility (`rate-limit.ts`). 5 archived files in `src/lib/_archive/`.
- `src/db/` — Drizzle schema and database configuration (optional — app runs without `DATABASE_URL`).
- `drizzle.config.ts` — Drizzle Kit configuration, reads `DATABASE_URL` from environment (converted from hardcoded JSON in Remediation 4).
- `public/` — Static assets: `favicon.svg` and `og-image.png` (1200×630 brutalist OG image for social previews; portrait assets pending).

## Quick Start

### Prerequisites

- Node.js >= 20
- PostgreSQL (for database-dependent features; the app runs without it)

### Installation

```bash
npm install
cp .env.example .env.local   # Configure your database URL and site URL (all optional)
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
| **2: Components** | Complete | 16 active + 15 archived components |
| **3: Data Layer** | Complete | Static content arrays, consolidated `Project` type, Drizzle schema |
| **4: Orchestration** | Complete | `PortfolioApp.tsx` with ErrorBoundary + Suspense wrapping per section |
| **5: Entry Point** | Complete | `page.tsx` with client-side dynamic import + `react-error-boundary` |
| **6: Remediation 1** | Complete | 40 files updated, build errors resolved, typecheck passing |
| **7: Remediation 2** | Complete | 14 files updated, `Project` type consolidated, `noUncheckedIndexedAccess` enabled, 34 type errors resolved |
| **8: Remediation 3** | Complete | All 14 missing CSS variables defined in `@theme` with day overrides, hash routing aligned, theme target unified on `<html>`, system preference detection added, site config centralized (`site-config.ts`), contact API endpoint with rate limiting, dead code archived to `_archive/` directories |
| **9: Remediation 4** | Complete | Scrollbar `border-radius` fixed to 0, `drizzle.config.json` converted to `.ts` with env vars, `.env.example` created, `ContactApiResponse` discriminated union added, `prefersHighContrast` removed, `useReducedMotion` hook adopted in animation components, text-muted contrast ratios fixed to WCAG AA, focus management added to `useRouteHash`, ARIA attributes verified on interactive widgets |
| **10: Remediation 5 (Code Review Fixes)** | Complete | `error.tsx` type guard, `not-found.tsx` Server Component, `next.config.ts` security headers, `rate-limit.ts` proxy trust, `HeroKinetic.tsx` navigation delegation, `Navigation.tsx` focus trap, `ProjectCard.tsx` Next.js Image, `ContactSection.tsx` re-render fix, `globals.css` performance optimization, `PortfolioApp.tsx` sync setState removal, `Terminal.tsx` key/8px/executeCommand fixes, `route.ts` body size limit, `useRouteHash.ts` `history.pushState`, `eslint.config.mjs` a11y plugin notes |
| **11: Remediation 6 (Full Codebase Alignment)** | Complete | `AccessibilityProvider.tsx` removed, `useReducedMotion.ts` / `ScrollReveal.tsx` / `HeroKinetic.tsx` / `ThemeSwitch.tsx` refactored to avoid `setState` in `useEffect`, `Timeline.tsx` hardcoded `8px` replaced with CSS variable, `_archive/` excluded from ESLint |
| **12: Remediation 7 (CRITICAL + HIGH Security & Quality)** | Complete | 18 issues fixed: `drizzle.config.json` deleted (credential leak), `ssr: false` removed (SEO now works), CSP hardened (`unsafe-eval` removed), contact API response made honest, OG image generated, `as ContactPayload` replaced with type guard, rate limiter returns `null` IP instead of shared fallback, lazy cleanup replaces never-cleared `setInterval`, duplicate theme init removed, `getElementById` replaced with `useRef`, BentoGrid responsive fallback, `siteConfig` satisfies `SiteConfig`, error messages gated on `NODE_ENV`, `not-found.tsx` semantic HTML, types centralized to `types.ts`, npm overrides for `esbuild`/`postcss` (0 vulnerabilities), `skills/` excluded from `tsconfig.json` |
| **13: Documentation Alignment** | Complete | Component count corrected (16 active), Chinese text in lessons translated to English, license aligned to MIT, `react-error-boundary` version clarified (v6+, originated v4), `GEMINI.md` rewritten, new gotchas and lessons added (50 total), `skills-backup.tar.gz` flagged for removal |

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
| `ContactApiResponse` type not found | Type added in Remediation 4 | Import from `@/lib/types` — it is a discriminated union for API responses |
| `drizzle.config.ts` throws on startup | `DATABASE_URL` environment variable not set | Copy `.env.example` to `.env.local` and configure your database URL |
| `drizzle.config.json` still exists | Old JSON config was not deleted after conversion to `.ts` | **Fixed in Remediation 7** — file deleted and added to `.gitignore`. If you see it, delete it. |
| TypeScript errors from `skills/` directory | `tsconfig.json` include pattern `**/*.ts` was too broad | **Fixed in Remediation 7** — `"skills"` added to `exclude`. Run `npm run typecheck` to verify. |
| CSP blocks scripts | `'unsafe-eval'` removed from `script-src` in Remediation 7 | If a third-party script needs eval, add a `script-src` exception with a specific domain, not `'unsafe-eval'` |
| Contact form says "email delivery not configured" | API now honestly reports that email isn't sent | Set `EMAIL_API_KEY` in `.env.local` and integrate an email service provider |
| BentoGrid items overflow on mobile | `grid-column: span 2` without fallback | **Fixed in Remediation 7** — `.bento-span-2` CSS class with `@media (max-width: 640px)` fallback added |
| ESLint error: `Calling setState synchronously within an effect` | React 19 strict linter detects `setState` inside `useEffect` | Initialize state directly in render (e.g., `useState(getInitialTheme)`) or use a lazy initializer |
| `GEMINI.md` references outdated variables | File was not updated during 7 remediation phases | Update GEMINI.md to match CLAUDE.md/AGENTS.md, or delete it |
| Component count mismatch in docs | ThemeScript (Server Component) was not counted | 16 active components total (15 Client + 1 Server) |

### Visual Issues

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| Text appears too faint in Night theme | Pre-Remediation 4 `--color-text-muted` was `#6b6560` (3.45:1 on dark bg) | Now fixed to `#918983` (5.76:1) — ensure you have the latest `globals.css` |
| Text appears too faint in Day theme | Pre-Remediation 4 `--color-text-muted` was `#8a8478` (3.28:1 on light bg) | Now fixed to `#6b6560` (5.06:1) — ensure you have the latest `globals.css` |
| Keyboard focus doesn't move after hash navigation | Pre-Remediation 4 `useRouteHash` had no focus management | Now fixed — `useRouteHash` moves focus to the section heading via `tabindex="-1"` + `focus()` |
| Scrollbar has rounded corners | Pre-Remediation 4 used `border-radius: 3px` | Now fixed to `border-radius: 0` — ensure you have the latest `globals.css` |

### CSS Variables Not Resolving

The project uses a single canonical `--color-` prefix convention defined in `globals.css` `@theme` block (e.g., `--color-border`, `--color-text-primary`). All 14 previously undefined variables (`--font-display`, `--spacing-half`, `--transition-fast`, `--shadow-brutal`, `--color-text-inverse`, etc.) have been defined as of Remediation 3. Archived components in `_archive/` directories still use shorthand names (`--border-color`, `--text-primary`) that are **not defined**. If integrating archived components, either add alias variables in `globals.css` or rewrite them to use the `--color-` prefix convention.

### Tailwind Utility Classes Not Working

Archived components use custom Tailwind classes (`font-utility`, `font-editorial`, `font-body`, `z-grain`, `z-machine`, etc.) that are defined in the `@theme` block as `--font-*` and `--z-index-*` variables. Tailwind v4 maps these to `font-editorial`, `font-utility`, `font-body` utility classes and `z-grain`, `z-machine` etc. — verify the mapping works correctly before relying on them.

### Theme Not Persisting

The theme system uses `localStorage` with the key `"theme"`. `ThemeScript` (inline in `layout.tsx`) reads from localStorage and falls back to system preference (`prefers-color-scheme`). Theme initialization happens in exactly one place — the `ThemeScript` in `<head>`. The previous duplicate `useEffect` in `PortfolioApp.tsx` was removed in Remediation 7 because it caused redundant DOM writes and potential hydration mismatches. If theme fails to persist, check that localStorage is available (not blocked by private browsing).

### Drizzle Config Fails Without DATABASE_URL

The `drizzle.config.ts` file throws an error if `DATABASE_URL` is not set. This is intentional — Drizzle Kit commands (`push`, `studio`, `generate`) require a database connection. The main application runs fine without it (DB features are optional), but Drizzle Kit itself needs the URL.

### Code Review Fixes (2026-06-14)

| Symptom | Component | Fix |
| :--- | :--- | :--- |
| `Property 'message' does not exist on type '{}'` | `src/app/error.tsx` | Use `isErrorLike` type guard instead of `instanceof Error` for `unknown` error prop |
| Client-side `not-found.tsx` with hardcoded `<a>` | `src/app/not-found.tsx` | Convert to Server Component; replace `<a>` with Next.js `<Link>` |
| Missing security headers | `next.config.ts` | Add `Strict-Transport-Security` and `Content-Security-Policy` headers |
| Rate limiter vulnerable to spoofed X-Forwarded-For | `src/lib/rate-limit.ts` | Document proxy trust boundary; add warning log and `__no_hash__` fallback |
| Hero CTA not wired to navigation | `src/components/HeroKinetic.tsx` | Delegate to `onNavigate` prop on "View Work" button |
| Mobile menu lacks focus trap | `src/components/Navigation.tsx` | Implement Tab key cycling within mobile menu |
| Raw `<img>` tag instead of Next.js Image | `src/components/ProjectCard.tsx` | Replace with Next.js `<Image>` component |
| Excessive re-renders on contact form input | `src/components/ContactSection.tsx` | Remove `errors` from `handleChange` dependency array |
| Grain overlay causes layout thrashing | `src/app/globals.css` | Reduce `baseFrequency` from `0.9` to `0.65` |
| Redundant AccessibilityProvider context | `src/app/PortfolioApp.tsx` | Remove `AccessibilityProvider`; use `useReducedMotion()` directly |
| Unstable array keys in terminal output | `src/components/Terminal.tsx` | Add stable `id` to history entries; use `line.id` as `key` |
| Hardcoded `8px` spacing in Terminal | `src/components/Terminal.tsx` | Replace with `var(--spacing-quarter)` |
| Inline object creation in executeCommand | `src/components/Terminal.tsx` | Extract `newLine()` helper; refactor `executeCommand` to use it |
| No request body size limit on contact API | `src/app/api/contact/route.ts` | Add `MAX_BODY_SIZE` (10KB) check before JSON parsing |
| `window.location.hash` triggers browser scroll | `src/hooks/useRouteHash.ts` | Use `history.pushState` instead; listen for `popstate` event |
| `eslint-plugin-jsx-a11y` conflicts with Next.js config | `eslint.config.mjs` | Plugin is already bundled in `eslint-config-next`; add explanatory comment |
| ESLint: `Calling setState synchronously within an effect` | `useReducedMotion.ts`, `ScrollReveal.tsx`, `HeroKinetic.tsx`, `ThemeSwitch.tsx` | Refactored to initialize state directly in render instead of calling `setState` in `useEffect` |

## Known Issues

### Moderate

1. **Contact API logs to console** — The `/api/contact` endpoint validates and rate-limits requests, but only logs submissions to the server console (see `TODO` in `route.ts`). The response message now honestly states that email delivery is not yet configured. A real email service (Resend, SendGrid, etc.) needs to be integrated before production use. Set `EMAIL_API_KEY` in `.env.local` when integrating.
2. **No error reporting** — `error.tsx` has a `console.error` placeholder for Sentry or similar. No structured error reporting exists.
3. **Analytics table never written to** — The `analytics` table schema exists and the health endpoint checks DB connectivity, but no code ever inserts rows.
4. **Missing portrait assets** — Archived `data.ts` references `/portraits/*.webp` files that don't exist in `public/`.
5. ~~**No SSR**~~ — **FIXED in Remediation 7**: `ssr: false` has been removed from `page.tsx`. The portfolio is now server-rendered and visible to search engines. Theme initialization is handled by `ThemeScript` in `<head>` (no FOUC), and `PortfolioApp.tsx` no longer has a duplicate theme `useEffect` that would cause hydration mismatches.

### Low

6. **Archived components use old CSS variable names** — Components in `_archive/` reference shorthand variable names (`--border-color`, `--text-primary`, etc.) that don't exist in `@theme`. Must be updated before reintegration.
7. **In-memory rate limiting only** — `rate-limit.ts` uses a `Map` that doesn't persist across server instances or restarts. The cleanup logic now uses lazy evaluation instead of a never-cleared `setInterval`. When no client IP can be determined, rate limiting is skipped rather than grouping all unknown requests under a shared `127.0.0.1` key (which was a DoS vector). Suitable for single-instance dev only; replace with Redis/Upstash for production multi-instance deployments.
8. **ESLint warnings from `@next/next/no-page-custom-font`** — Loading Google Fonts via `<link>` in App Router (`layout.tsx`) triggers this Next.js lint warning. This is an intentional design choice — the alternative (`next/font`) requires significant refactoring for the dual-theme design system. The warning is benign.
9. **`GEMINI.md` is severely outdated** — This agent instruction file references `Inter` (should be `DM Sans`), `--bg-primary`/`--text-primary` (should be `--color-bg`/`--color-text-primary`), `theme-night`/`theme-day` (should be `data-theme`), `src/lib/data.ts` (archived), `Next.js 16.2.6` (should be `16.2.9`), and `Tailwind CSS 4.0` (should be `4.1.17`). It was not updated during any of the 7 remediation phases and will mislead agents that read it.
10. **`skills-backup.tar.gz` is 40MB** — This archive in the repo root is unnecessarily large for version control and should be deleted or moved to external storage.
11. **License field inconsistency** — `package.json` says `"MIT"` but README previously said "Proprietary". Now aligned to MIT.

## Lessons Learnt

1. **`instanceof Error` does not reliably narrow `unknown` in TS Strict** — TypeScript 5.5+ strict mode may fail to narrow `unknown` via `instanceof Error`. Use a custom type guard (e.g., `isErrorLike()`) instead. This was encountered in `error.tsx` where `error instanceof Error` produced `Property 'message' does not exist on type '{}'` despite the guard. Always prefer `isErrorLike(error) ? error.message : "..."` for `unknown` error values.
2. **`eslint-config-next` already bundles `eslint-plugin-jsx-a11y`** — Do NOT import it separately in `eslint.config.mjs` — doing so triggers `ConfigError: Cannot redefine plugin "jsx-a11y"`. The plugin is activated transitively through `eslint-config-next`.
3. **`useEffect` should not synchronously call `setState`** — `useEffect(() => { setState(true); }, [])` triggers React linter warnings in React 19. Initialize state directly in render (e.g., `const [mounted] = useState(true)`) or use a lazy initializer `useState(() => true)`.
4. **`history.pushState` replaces `window.location.hash` for SPA routing** — `pushState` avoids the browser's default scroll-to-anchor behavior. Note: `pushState` does NOT fire `hashchange` events — you must listen for `popstate` to capture back/forward navigation.
5. **Stable keys for mutable lists prevent rendering bugs** — `key={index}` causes React to lose track of items when order changes. Use stable unique IDs (e.g., `Date.now()` or a monotonic counter) and reference them with `key={item.id}`.
6. **Verify npm versions before pinning** — Remediation specified `@types/react-dom@^19.2.6` which didn't exist (max was 19.2.3). Always check with `npm view <pkg> dist-tags` before updating `package.json`.
7. **CSS import order is critical** — In Tailwind v4, `@import "tailwindcss"` expands to `@layer` rules. Any `@import url()` for external fonts **must** come before it, or the CSS optimizer will reject it.
8. **Next.js 16 removes `optimizeFonts`** — This `next.config.ts` option no longer exists. Font optimization is automatic.
9. **`ssr: false` requires Client Components** — In Next.js 16, `next/dynamic` with `ssr: false` cannot be used in Server Components. The page must have `"use client"`.
10. **Two design token systems create technical debt** — Archived components use shorthand CSS variable names (`--border-color`) while `@theme` uses `--color-` prefix (`--color-border`). Must reconcile before integration. Moving dormant code to `_archive/` directories prevents confusion about what's active.
11. **Null-safe database access** — Since `DATABASE_URL` is optional, `db` can be `null`. Any API route using `db` must include a null guard.
12. **`noUncheckedIndexedAccess` catches real bugs** — Enabling this strict TypeScript option revealed 6+ places where array index access could return `undefined`, including `commandHistory[newIndex]`, `columns[i]`, and `CHARS[index]`. Always use `?.` or `??` for index access.
13. **`react-error-boundary` v4 changed `FallbackProps.error` type** — The `error` prop changed from `Error` to `unknown`. Custom fallback components must type it as `unknown` and use `instanceof Error` to access `.message`.
14. **`PortfolioApp.tsx` location matters** — It lives in `src/app/`, not `src/components/`. The import in `page.tsx` must be `@/app/PortfolioApp`, not `@/components/PortfolioApp`. The App Router co-locates the orchestrator with the route.
15. **Undefined CSS variables silently fail** — When `var(--font-display)` resolves to `unset`, there's no error or warning — the property just doesn't apply. Always audit `var()` references against `@theme` definitions after any refactoring. The solution is to define every referenced variable in `@theme` with appropriate defaults and day-theme overrides.
16. **Centralize configuration early** — Contact info, site name, and social links were hardcoded in 4+ places (Footer, Terminal, layout.tsx, Navigation). Creating `site-config.ts` as a single source of truth eliminated drift risk and simplified future changes.
17. **Theme target must be consistent** — Setting `data-theme` on different DOM elements (`<html>` vs `<body>`) causes CSS selectors to break. Pick one target (`<html>`) and use it everywhere — both in `ThemeScript` (initial paint) and `PortfolioApp` (runtime toggle).
18. **Hash routing section names must match actual IDs** — When `VALID_SECTIONS` in `useRouteHash` diverges from actual section IDs in `PortfolioApp`, `aria-current` indicators and active link highlighting silently break for mismatched sections. Keep these in sync.
19. **Rate limiting is essential for public API routes** — Without rate limiting, the contact form endpoint is vulnerable to abuse. Even a simple in-memory sliding window algorithm (as implemented in `rate-limit.ts`) provides meaningful protection for single-instance deployments.
20. **Archiving dormant code reduces confusion** — Moving unused components, hooks, and lib files to `_archive/` directories makes it immediately clear what code is active vs. dormant, reducing the risk that developers accidentally import dead code.
21. **Remediation docs may reference files that don't exist** — Remediation_4.md was written without access to the actual codebase and referenced ~15 files that don't exist in the project (e.g., `ParticleField.tsx`, `CustomCursor.tsx`, `DayNightToggle.tsx`, `AccessibilityMenu.tsx`, `useAccessibility.ts`, `projectsData.ts`). Always validate each remediation proposal against the actual file structure before applying changes.
22. **Discriminated unions for API responses prevent type errors** — Adding `ContactApiResponse = ContactApiSuccess | ContactApiError` with a `success` discriminant field enables TypeScript narrowing. Code that checks `if (data.success)` automatically narrows to the correct branch, preventing access to `error` on success responses and `message` on error responses.
23. **Contrast ratios must be verified in both themes** — The same hex value can pass WCAG AA on a dark background but fail on a light background (or vice versa). The Night theme needed a *lighter* muted text (`#918983`) while the Day theme needed a *darker* muted text (`#6b6560`). Always test both themes independently.
24. **Remove unused features rather than leaving them half-implemented** — `prefersHighContrast` was defined in `AccessibilityProvider` but never consumed, and no high-contrast color palette existed. Removing it entirely was cleaner than leaving a dead toggle that implied functionality that didn't work.
25. **Focus management is essential for keyboard navigation** — Hash-based routing that scrolls without moving focus creates a trap for keyboard users who must Tab through all intermediate elements. Adding `tabindex="-1"` + `focus()` on the target heading after navigation brings keyboard users directly to the new section.
26. **Never hardcode credentials in config files** — `drizzle.config.json` had `postgres:postgres` in plaintext. Converting to `drizzle.config.ts` with `process.env.DATABASE_URL` eliminated the security risk and aligned with the `.env.example` pattern. The config now throws a clear error message if the variable is missing.
27. **`instanceof Error` does not reliably narrow `unknown` in TS strict** — TypeScript 5.5+ strict mode may fail to narrow `unknown` via `instanceof Error`. Use a custom type guard (e.g., `isErrorLike()`) instead. Encountered in `error.tsx` where `instanceof Error` produced `Property 'message' does not exist on type '{}'` despite the guard.
28. **`eslint-config-next` already bundles `eslint-plugin-jsx-a11y`** — Do NOT import it separately in `eslint.config.mjs`. The plugin is activated transitively through `eslint-config-next/core-web-vitals`. Redundant imports trigger `ConfigError: Cannot redefine plugin "jsx-a11y"`.
29. **`useEffect` should not synchronously call `setState`** — `useEffect(() => { setState(true); }, [])` triggers React linter warnings in React 19. Initialize state directly in render (e.g., `const [mounted] = useState(true)`) or use a lazy initializer `useState(() => true)`.
30. **`history.pushState` replaces `location.hash` but requires `popstate` listener** — `pushState` does NOT fire `hashchange` events. You must listen for `popstate` to capture back/forward navigation. This is the correct implementation pattern for SPA hash routing.
31. **Use stable keys for mutable lists** — `key={index}` causes React to lose track of items when order changes. Use stable unique IDs (e.g., `Date.now()` or a monotonic counter) and reference them with `key={item.id}`.
32. **Prior remediation "fixes" may be incomplete** — Remediation 4 claimed `drizzle.config.json` was "converted to `.ts`", but the old JSON file with hardcoded credentials was never deleted. Always verify that old files are removed after conversion, not just that new files exist. Check `.gitignore` too.
33. **`ssr: false` is a sledgehammer for hydration mismatches** — The real solution to `localStorage`/`window` hydration issues is to handle initialization in a blocking `<head>` script (`ThemeScript.tsx`), not to disable SSR entirely. SSR is critical for SEO; `ssr: false` makes the entire page invisible to search engines.
34. **`'unsafe-eval'` in CSP is almost never needed** — Next.js does not require `'unsafe-eval'` in production. The only common exception is development hot module replacement. Remove it from `script-src`; keep `'unsafe-inline'` only on `style-src` where inline styles require it.
35. **API responses that claim success without delivering are deceptive** — A contact form that returns `success: true` without sending email misleads users into thinking their message was delivered. Always be honest in API responses — if email delivery isn't configured, say so explicitly in the response message.
36. **`as` type casts bypass TypeScript's safety net** — Using `body as ContactPayload` after a basic `typeof` check means any JSON shape passes through. Replace `as` casts with runtime type guards (`isContactPayload()`) that validate the actual structure of the data. TypeScript `as` assertions are compile-time only — they provide zero runtime protection.
37. **Falling back to a shared IP in rate limiting is a DoS vector** — If `getClientIp()` returns `127.0.0.1` for all requests without proxy headers, every unknown-origin request shares the same rate limit bucket. A single attacker can exhaust that bucket and block ALL legitimate requests from unknown origins. Return `null` instead and skip rate limiting when IP cannot be determined.
38. **`setInterval` that is never cleared creates a memory leak** — Module-level `setInterval` for cleanup runs even when the server is idle and never stops. Replace with lazy cleanup triggered by actual requests (check elapsed time inside the rate limit function).
39. **Duplicate theme initialization causes hydration mismatches** — If `ThemeScript` sets `data-theme` in `<head>` AND a `useEffect` in `PortfolioApp` also writes to `data-theme` on mount, the second write is redundant and can cause a flash or hydration mismatch. Theme initialization should happen in exactly one place — the `<head>` script.
40. **`document.getElementById` in React should be replaced with `useRef`** — Direct DOM access bypasses React's rendering lifecycle and can reference stale or non-existent elements. `useRef` provides a stable reference that React manages, ensuring the reference stays current across re-renders.
41. **`grid-column: span 2` without responsive fallback causes overflow** — When the viewport is too narrow for two columns, `span 2` items overflow their container. Always pair `grid-column: span 2` with a `@media (max-width)` rule that resets to `span 1` on mobile.
42. **`as const` without `satisfies` loses type checking** — `const x = { ... } as const` freezes the type but doesn't validate it against an interface. Adding `satisfies InterfaceName` ensures the object actually conforms to the expected shape while preserving the literal types.
43. **Error messages must be gated on `NODE_ENV`** — Displaying raw error messages in production (`error.message`) can leak stack traces, file paths, and internal implementation details. Always gate detailed error display on `process.env.NODE_ENV === 'development'` and show a generic message in production.
44. **Centralize type definitions to prevent drift** — Defining `Skill` in `skills.ts` and `TimelineEntry` in `timeline.ts` means each file is its own source of truth. Moving types to `types.ts` with re-exports from the data modules ensures there's one canonical definition that all consumers reference.
45. **`tsconfig.json` include patterns must be scoped narrowly** — `"include": ["**/*.ts"]` catches every `.ts` file in the repo, including unrelated directories like `skills/` that import packages not in the project's dependencies. Always use targeted include patterns or add problematic directories to `exclude`.
46. **npm overrides can fix transitive dependency vulnerabilities** — When `npm audit fix` can't resolve vulnerabilities because the fix would break a direct dependency, use `"overrides"` in `package.json` to force a patched version of the transitive dependency. This resolved all 6 npm vulnerabilities (esbuild RCE, PostCSS XSS) without breaking the build.
47. **`GEMINI.md` must be kept in sync with other agent docs** — GEMINI.md became severely outdated (referenced `Inter`, `--bg-primary`, `theme-night`, `src/lib/data.ts`, `Next.js 16.2.6`) while README/CLAUDE/AGENTS were updated through 7 remediation phases. Any agent instruction file must be updated in the same pass as the others, or it will mislead future agents.
48. **License field consistency matters** — `package.json` had `"MIT"` but README stated "Proprietary — All rights reserved.". Always keep license declarations consistent across all project files.
49. **`react-error-boundary` v6 still has the `unknown` error type from v4** — The `FallbackProps.error` type change from `Error` to `unknown` was introduced in v4 and persists through v6+. Documentation should reference the current installed version (v6) but note the breaking change originated in v4.
50. **Component counts must be audited after each remediation** — After 7 remediation phases, the active component count was listed as 15 in multiple places despite 16 existing (ThemeScript was always present but excluded from counts). Always count actual files in the directory when updating documentation.

## Recommendations

1. **Integrate an email service** — Replace the `console.log` in `/api/contact/route.ts` with a real email provider (Resend, SendGrid, etc.) before deploying to production. The `EMAIL_API_KEY` variable is already documented in `.env.example`.
2. **Add error reporting** — Integrate Sentry or a similar service in `error.tsx` and the global error boundary.
3. **Reconcile CSS variable naming for archived components** — If reintegrating any archived components, either add alias variables in `globals.css` or rewrite them to use the `--color-` prefix convention.
4. **Add portrait assets** — Place webp images in `public/portraits/` if needed, or remove references from archived `data.ts`.
5. ~~**Re-enable SSR**~~ — **DONE in Remediation 7**: `ssr: false` removed. Portfolio is now server-rendered and SEO-visible.
6. **Write to analytics table** — Either implement middleware to track page views or remove the unused `analytics` table schema.
7. **Replace in-memory rate limiting for production** — For multi-instance deployments, use Redis/Upstash. The current implementation includes dev-only warnings and skips rate limiting when client IP cannot be determined.
8. **Generate production-quality OG image** — The current `og-image.png` is a placeholder generated with PIL. Replace with a high-fidelity design matching the brutalist aesthetic (consider using Playwright for HTML-to-image generation).
9. **Migrate Google Fonts to `next/font/google`** — Currently loaded via render-blocking `<link>` tags in `layout.tsx`. `next/font/google` provides automatic optimization, eliminates render-blocking, and supports `next/font` CSS variable injection. Requires refactoring the dual-theme font loading.
10. **Remove `skills/` directory from repo** — The `skills/` directory contains 40+ unrelated AI skill modules (61 MB) that import `z-ai-web-dev-sdk` (not a project dependency). It's excluded from `tsconfig.json` and the build, but clutters the repository. Consider moving it to a separate repo or deleting it entirely.
11. **Clean up legacy documentation files** — The repo root contains 20+ remediation reports, code review PDFs, tar archives, and status files from prior sessions. These should be archived or removed to reduce repo clutter.
12. **Update or remove `GEMINI.md`** — The file is severely outdated (references `Inter`, `--bg-primary`, `theme-night`, `src/lib/data.ts`, `Next.js 16.2.6`, `Tailwind CSS 4.0`). Either update it to match CLAUDE.md/AGENTS.md or delete it to prevent agent confusion.
13. **Audit `skills-backup.tar.gz` (40MB)** — This massive archive in the repo root should not be version-controlled. Delete or move to external storage.

## License

MIT — See `package.json` for details.
