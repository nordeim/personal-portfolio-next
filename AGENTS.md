# Agent Instructions: Nicholas Yun Portfolio (v2.0)

This is a high-signal brief for agents working on "The Engineered Soul" portfolio.

## Core Identity
- **Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Drizzle ORM, PostgreSQL.
- **Aesthetic**: "Tactile Brutalism" + "High-End Editorial".
- **Primary Design Constraint**: **Zero border-radius** globally (note: scrollbar thumb has `border-radius: 3px` — known deviation). Use the **28px mathematical grid** for all spacing.

## Current State

The project has passed three remediation phases. Build and typecheck pass cleanly. The SPA orchestrator (`PortfolioApp.tsx`) is implemented and wired into `page.tsx`. All CSS variables referenced by active components are defined in `@theme` with day-theme overrides. Hash routing is aligned with actual section IDs. Theme targeting is unified on `document.documentElement`. Site configuration is centralized in `site-config.ts`. Contact form submits to a real API endpoint with rate limiting. Dormant code has been archived to `_archive/` directories.

**Active components** (17, wired in `PortfolioApp.tsx`): Navigation, HeroKinetic, SectionBlock, ErrorBoundary, AccessibilityProvider, BentoGrid, ProjectsSection, ProjectCard, SkillsSection, Timeline, BlogSection, Terminal, ContactSection, Footer, ThemeSwitch, ScrollReveal, ThemeScript.

**Archived components** (14, in `src/components/_archive/`): AboutFlow, ArchiveSpread, ArchiveItemCard, BentoTile, BrandMark, ClientOnly, CodeRain, ContentBody, DitherOverlay, GrainOverlay, LayoutShell, MachineOverlay, MobileDrawer, SocialIcon, ThemeToggle.

**Archived dead code** (in `_archive/` directories): `src/lib/_archive/` (data.ts, content.ts, utils.ts, testimonials.ts, sounds.ts), `src/hooks/_archive/` (useViewTransitions.ts, useWeightedScroll.ts).

## Operational Gotchas

### Archived Components Use Old CSS Variable Names (Visual Breakage Risk)
The `@theme` block in `globals.css` uses `--color-` prefix: `--color-border`, `--color-text-primary`, `--color-bg`, etc. Archived components use shorthand names that **do not exist**: `--border-color`, `--text-primary`, `--bg-surface`, `--bg-primary`, `--bg-elevated`, `--text-secondary`, `--text-muted`, `--border-strong`, `--color-accent-code`, `--color-accent-poetry`. Before integrating any archived component, you must either add aliases in `globals.css` or rewrite the component to use the `--color-` prefix.

### `page.tsx` Is a Client Component
`src/app/page.tsx` has `"use client"` because it uses `next/dynamic` with `ssr: false`. This means the entire page is client-rendered — no SSR. Metadata from `layout.tsx` (Server Component) still works. If you re-enable SSR, remove `"use client"` from `page.tsx` and use `Suspense` boundaries instead.

### `PortfolioApp.tsx` Location
`PortfolioApp.tsx` lives in `src/app/`, NOT `src/components/`. The import in `page.tsx` is `@/app/PortfolioApp`. Do NOT move it — the App Router co-locates the orchestrator with the route.

### `react-error-boundary` v4 Type Change
`FallbackProps.error` is typed as `unknown`, not `Error`. Custom fallback components must type the prop as `error: unknown` and use `instanceof Error` to access `.message`.

### `noUncheckedIndexedAccess: true`
Array index access returns `T | undefined`. Always use `?.` or `??`. This caught 6+ real bugs during Remediation 2 (e.g., `commandHistory[newIndex]`, `columns[i]`, `CHARS[index]`, `focusable[0]`).

### Theme System: `data-theme` on `<html>`, NOT Classes
Theme switching uses `data-theme="night"` / `data-theme="day"`. Both `ThemeScript` and `PortfolioApp` target `document.documentElement`. CSS selectors target `[data-theme="day"]`. Do NOT use class-based theme switching (`theme-night`, `theme-day`). Do NOT set `data-theme` on `<body>` — it must be on `<html>`.

### Theme Falls Back to System Preference
When no `localStorage` value exists, `ThemeScript` checks `window.matchMedia('(prefers-color-scheme: dark)')` and sets the theme accordingly. This means a user's first visit respects their OS preference.

### Database Is Optional
`src/db/index.ts` exports `db` which can be `null` if `DATABASE_URL` is not set. Any API route using `db` must include a null guard. The health endpoint (`/api/health`) returns 503 when DB is unavailable.

### Contact API Endpoint Logs to Console
`/api/contact` validates input, applies rate limiting (5 req/min per IP), but only `console.log`s submissions. Must integrate an email service (Resend, SendGrid, etc.) before production.

### Rate Limiter Is In-Memory Only
`src/lib/rate-limit.ts` uses a `Map` for storage. Tokens don't persist across server instances or restarts. For multi-instance deployments (Vercel, Docker), replace with Redis/Upstash rate limiting.

### CSS Import Order (Build-Breaking)
`globals.css` uses `@import "tailwindcss"` as the first import. Google Fonts are loaded via `<link>` tags in `layout.tsx` `<head>`, NOT via `@import url()` in CSS. If you ever add `@import url()` for fonts back to `globals.css`, it MUST come before `@import "tailwindcss"`.

### `useAccessibility()` Hook Never Consumed
`AccessibilityProvider` provides `prefersReducedMotion` and `prefersHighContrast` via context, but no child component uses `useAccessibility()`. Components that need reduced-motion checks use `useReducedMotion()` directly or inline `window.matchMedia`. This should be consolidated.

### Missing Portrait Assets
Archived `data.ts` references `/portraits/*.webp` files that don't exist in `public/`. Either add the assets or remove the references.

### `drizzle.config.json` Hardcoded Credentials
Contains `postgresql://postgres:postgres@127.0.0.1:5432/app_db`. Must use environment variable instead.

### Scrollbar border-radius Deviation
The custom scrollbar style in `globals.css` uses `border-radius: 3px` on the thumb, violating the zero border-radius brutalist rule. Should be `0`.

## Developer Commands
| Task | Command |
| :--- | :--- |
| **Dev** | `npm run dev` |
| **Build** | `npm run build` |
| **Lint** | `npm run lint` |
| **Types** | `npm run typecheck` |
| **DB Push** | `npx drizzle-kit push` |
| **DB GUI** | `npx drizzle-kit studio` |

## Repository Patterns
- **Imports**: Always use `@/` alias for `src/`.
- **Components**:
  - Keep `src/components/` as stateless as possible.
  - `LayoutShell.tsx` is archived — do NOT wrap the app in it unless you integrate it.
  - `PortfolioApp.tsx` is in `src/app/`, not `src/components/` — import from `@/app/PortfolioApp`.
  - Archived components are in `_archive/` subdirectories — do NOT import from them in active code.
- **Styling**: Tailwind v4 with CSS variables from `globals.css`. Theme toggled via `data-theme` attribute on `<html>`.
- **Fonts**: `--font-editorial`/`--font-serif`/`--font-display` (Cormorant Garamond), `--font-body`/`--font-sans` (DM Sans), `--font-utility`/`--font-mono` (IBM Plex Mono). Body font is DM Sans, NOT Inter. All three font aliases are defined in `@theme`.
- **CSS Variables**: Always use the `--color-` prefix convention (e.g., `--color-border`, `--color-text-primary`).
- **Data**: Active data comes from `projects.ts`, `skills.ts`, `timeline.ts`. `data.ts` is archived dead code — do NOT import from it.
- **Config**: Site-wide constants (name, email, social links, URLs) come from `site-config.ts`. Do NOT hardcode these values in components.
- **Types**: `Project` is defined in `types.ts` and re-exported from `projects.ts`. Import from `@/lib/projects` for project-related code. `SiteConfig` is in `types.ts`, implemented in `site-config.ts`.
- **Rate Limiting**: Use `rateLimit()` and `getClientIp()` from `@/lib/rate-limit` for any new API routes.

## Critical "Never" List
- **Never** use `border-radius` (unless explicitly requested for a specific non-UI element).
- **Never** use `any` in TypeScript.
- **Never** use Vite-specific features like `import.meta.glob`.
- **Never** add speculative "AI slop" or safe defaults (e.g., rounded cards, Inter-only typography).
- **Never** add `optimizeFonts` to `next.config.ts` (removed in Next.js 16).
- **Never** put `@import url()` after `@import "tailwindcss"` in `globals.css`.
- **Never** use class-based theme switching (`theme-night` / `theme-day`). Use `data-theme` attribute on `<html>`.
- **Never** set `data-theme` on `<body>` — always use `document.documentElement` (`<html>`).
- **Never** use `db` from `@/db` without a null guard.
- **Never** access array indices without `?.` or `??` (enforced by `noUncheckedIndexedAccess`).
- **Never** import `PortfolioApp` from `@/components/PortfolioApp` — it's at `@/app/PortfolioApp`.
- **Never** type `react-error-boundary` fallback `error` prop as `Error` — it's `unknown`.
- **Never** import data from `@/lib/data` — it's archived dead code with stale section names.
- **Never** hardcode site config (name, email, URLs) in components — import from `@/lib/site-config`.
- **Never** create an API route without rate limiting — use `rateLimit()` from `@/lib/rate-limit`.

## Outstanding Issues (Priority Order)

1. **Fix `drizzle.config.json`** — Use environment variable for database URL instead of hardcoded credentials.
2. **Integrate email service** — Replace `console.log` in `/api/contact/route.ts` with Resend, SendGrid, or similar.
3. **Add error reporting** — Integrate Sentry in `error.tsx` and the global error boundary.
4. **Consume `useAccessibility()`** — Replace scattered `window.matchMedia` checks with the context hook from `AccessibilityProvider` for consistency.
5. **Fix scrollbar `border-radius`** — Change `border-radius: 3px` to `border-radius: 0` in `globals.css` scrollbar styles.
6. **Reconcile CSS variable naming for archived components** — If reintegrating any, add aliases in `globals.css` or rewrite to use `--color-` prefix.
7. **Add portrait assets** — Place webp images in `public/portraits/` if needed.
8. **Consider re-enabling SSR** — Replace `ssr: false` with `Suspense` boundaries for SEO.
9. **Write to analytics table** — Implement middleware to track page views or remove unused `analytics` schema.
10. **Replace in-memory rate limiting for production** — For multi-instance deployments, use Redis/Upstash.

## Lessons Learnt

1. **Verify npm versions before pinning** — The remediation specified versions that didn't exist on npm. Always check with `npm view <pkg> dist-tags`.
2. **CSS import order matters in Tailwind v4** — `@import url()` for fonts must precede `@import "tailwindcss"` which expands to `@layer` rules. Better: load fonts via `<link>` in `layout.tsx` to avoid the issue entirely.
3. **`optimizeFonts` is gone in Next.js 16** — Font optimization is automatic; the config key no longer exists.
4. **`ssr: false` requires `"use client"`** — Next.js 16 enforces this at build time for Server Components.
5. **Null-safe DB access is mandatory** — Optional database means `db` can be `null`; always guard.
6. **Two design token systems = technical debt** — The shorthand and `--color-` prefix conventions must be reconciled before archived components can be reintegrated. Moving dormant code to `_archive/` reduces confusion.
7. **`noUncheckedIndexedAccess` catches real bugs** — Array index access returning `T | undefined` revealed 6+ places where runtime errors were possible. Always use `?.` or `??`.
8. **Undefined CSS variables fail silently** — `var(--font-display)` resolving to `unset` produces no error, no warning — the style just doesn't apply. The solution: define every referenced variable in `@theme` with appropriate defaults and day-theme overrides.
9. **`react-error-boundary` v4 changed `FallbackProps.error`** — From `Error` to `unknown`. Must use `instanceof Error` guard.
10. **File location matters for App Router imports** — `PortfolioApp.tsx` in `src/app/` must be imported as `@/app/PortfolioApp`, not `@/components/PortfolioApp`.
11. **Centralize configuration early** — Contact info and social links hardcoded in 4+ places created drift risk. `site-config.ts` as single source of truth eliminated this.
12. **Theme target must be consistent** — Setting `data-theme` on `<html>` vs `<body>` breaks CSS selectors. Pick one target and use it everywhere.
13. **Hash routing section names must match actual IDs** — When `VALID_SECTIONS` diverges from actual section IDs, `aria-current` indicators silently break.
14. **Rate limiting is essential for public API routes** — Even a simple in-memory algorithm provides meaningful protection.
15. **Archiving dormant code reduces confusion** — `_archive/` directories make it immediately clear what code is active vs. dormant, reducing the risk of importing dead code.
