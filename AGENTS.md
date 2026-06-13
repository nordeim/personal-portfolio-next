# Agent Instructions: Nicholas Yun Portfolio (v2.0)

This is a high-signal brief for agents working on "The Engineered Soul" portfolio.

## Core Identity
- **Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Drizzle ORM, PostgreSQL.
- **Aesthetic**: "Tactile Brutalism" + "High-End Editorial".
- **Primary Design Constraint**: **Zero border-radius** globally (including scrollbar thumb — fixed in Remediation 4). Use the **28px mathematical grid** for all spacing.

## Current State

The project has passed four remediation phases. Build and typecheck pass cleanly. The SPA orchestrator (`PortfolioApp.tsx`) is implemented and wired into `page.tsx`. All CSS variables referenced by active components are defined in `@theme` with day-theme overrides. Hash routing is aligned with actual section IDs and includes focus management for keyboard users. Theme targeting is unified on `document.documentElement`. Site configuration is centralized in `site-config.ts`. Contact form submits to a real API endpoint with rate limiting and typed responses (`ContactApiResponse` discriminated union). All text-muted colors pass WCAG AA contrast ratios in both themes. Animation components (`HeroKinetic`, `ScrollReveal`) use `useReducedMotion` hook. All interactive widgets have proper ARIA attributes (`ThemeSwitch`: `role="switch"`+`aria-checked`, `Navigation`: `aria-current`, `Terminal`: `role="log"`+`aria-live="polite"`). Dormant code has been archived to `_archive/` directories. Drizzle config uses environment variables (no hardcoded credentials). `.env.example` is present.

**Active components** (17, wired in `PortfolioApp.tsx`): Navigation, HeroKinetic, SectionBlock, ErrorBoundary, AccessibilityProvider, BentoGrid, ProjectsSection, ProjectCard, SkillsSection, Timeline, BlogSection, Terminal, ContactSection, Footer, ThemeSwitch, ScrollReveal, ThemeScript.

**Archived components** (15, in `src/components/_archive/`): AboutFlow, ArchiveSpread, ArchiveItemCard, BentoTile, BrandMark, ClientOnly, CodeRain, ContentBody, DitherOverlay, GrainOverlay, LayoutShell, MachineOverlay, MobileDrawer, SocialIcon, ThemeToggle.

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

### `useAccessibility()` and `useReducedMotion()` Are Redundant
`AccessibilityProvider` provides `prefersReducedMotion` via context (simplified in Remediation 4 — removed unused `prefersHighContrast`). However, `HeroKinetic` and `ScrollReveal` import `useReducedMotion()` directly instead of consuming the context. These two systems should be consolidated — either have all components use the context hook, or remove `AccessibilityProvider` and use the standalone hook everywhere.

### Missing Portrait Assets
Archived `data.ts` references `/portraits/*.webp` files that don't exist in `public/`. Either add the assets or remove the references.

### `drizzle.config.ts` Throws Without DATABASE_URL
The config file throws a descriptive error if `DATABASE_URL` is not set. This is intentional for Drizzle Kit commands (`push`, `studio`, `generate`). The main application handles a missing database gracefully (returns 503 on DB-dependent endpoints).

### Remediation Docs May Reference Non-Existent Files
Remediation_4.md was written without access to the actual codebase and referenced ~15 files that don't exist (`ParticleField.tsx`, `CustomCursor.tsx`, `CursorTrail.tsx`, `GlitchText.tsx`, `DayNightToggle.tsx`, `AccessibilityMenu.tsx`, `TerminalEmulator.tsx`, `PersistentTerminal.tsx`, `ScrollProgress.tsx`, `useAccessibility.ts`, `projectsData.ts`, `About.tsx`, `Projects.tsx`, `Skills.tsx`, `Contact.tsx`, `Hero.tsx`). Always validate remediation proposals against the actual file structure before applying.

### `ContactApiResponse` Is a Discriminated Union
API responses from `/api/contact` use `ContactApiResponse = ContactApiSuccess | ContactApiError`. TypeScript narrows the type automatically when you check `data.success`. Do NOT access `data.error` without first checking `data.success === false`.

### Text-Muted Contrast Ratios Must Be Checked in Both Themes
The Night theme needs a lighter muted text (`#918983`) while the Day theme needs a darker muted text (`#6b6560`). The same hex value can pass WCAG AA on one background but fail on the other. Always test contrast in both themes.

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
- **Types**: `Project` is defined in `types.ts` and re-exported from `projects.ts`. Import from `@/lib/projects` for project-related code. `SiteConfig` is in `types.ts`, implemented in `site-config.ts`. `ContactApiResponse` is in `types.ts` — use it for all contact API response handling.
- **Rate Limiting**: Use `rateLimit()` and `getClientIp()` from `@/lib/rate-limit` for any new API routes.
- **Drizzle Config**: `drizzle.config.ts` reads `DATABASE_URL` from environment. Do NOT hardcode credentials.
- **Environment Variables**: Copy `.env.example` to `.env.local`. All variables are optional (app runs without them).

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
- **Never** hardcode credentials in config files — use `process.env.DATABASE_URL` or other environment variables.
- **Never** access `ContactApiResponse.error` without checking `data.success === false` first (discriminated union narrowing).
- **Never** trust remediation docs without validating file paths against the actual codebase structure.

## Outstanding Issues (Priority Order)

1. **Integrate email service** — Replace `console.log` in `/api/contact/route.ts` with Resend, SendGrid, or similar.
2. **Add error reporting** — Integrate Sentry in `error.tsx` and the global error boundary.
3. **Consolidate `useAccessibility()` and `useReducedMotion()`** — Either have all components consume the context hook from `AccessibilityProvider`, or remove the provider and use the standalone `useReducedMotion` hook everywhere. The current redundancy creates confusion about which system to use.
4. **Reconcile CSS variable naming for archived components** — If reintegrating any, add aliases in `globals.css` or rewrite to use `--color-` prefix.
5. **Add portrait assets** — Place webp images in `public/portraits/` if needed.
6. **Consider re-enabling SSR** — Replace `ssr: false` with `Suspense` boundaries for SEO.
7. **Write to analytics table** — Implement middleware to track page views or remove unused `analytics` schema.
8. **Replace in-memory rate limiting for production** — For multi-instance deployments, use Redis/Upstash.

## Lessons Learnt

1. **Verify npm versions before pinning** — The remediation specified versions that didn't exist on npm. Always check with `npm view <pkg> dist-tags`.
2. **CSS import order matters in Tailwind v4** — `@import url()` for fonts must precede `@import "tailwindcss"` which expands to `@layer` rules. Better: load fonts via `<link>` in `layout.tsx` to avoid the issue entirely.
3. **`optimizeFonts` is gone in Next.js 16** — Font optimization is automatic; the config key no longer exists.
4. **`ssr: false` requires `"use client"`** — Next.js 16 enforces this at build time for Server Components.
5. **Two design token systems create technical debt** — Archived components use shorthand CSS variable names (`--border-color`) while `@theme` uses `--color-` prefix (`--color-border`). Must reconcile before integration. Moving dormant code to `_archive/` directories prevents confusion about what's active.
6. **Null-safe database access** — Since `DATABASE_URL` is optional, `db` can be `null`. Any API route using `db` must include a null guard.
7. **`noUncheckedIndexedAccess` catches real bugs** — Array index access returning `T | undefined` revealed 6+ places where runtime errors were possible. Always use `?.` or `??`.
8. **`react-error-boundary` v4 changed `FallbackProps.error` type** — The `error` prop changed from `Error` to `unknown`. Custom fallback components must type it as `unknown` and use `instanceof Error` to access `.message`.
9. **`PortfolioApp.tsx` location matters** — It lives in `src/app/`, not `src/components/`. The import in `page.tsx` must be `@/app/PortfolioApp`, not `@/components/PortfolioApp`. The App Router co-locates the orchestrator with the route.
10. **Undefined CSS variables silently fail** — When `var(--font-display)` resolves to `unset`, there's no error or warning — the property just doesn't apply. Always audit `var()` references against `@theme` definitions after any refactoring. The solution is to define every referenced variable in `@theme` with appropriate defaults and day-theme overrides.
11. **Centralize configuration early** — Contact info and social links hardcoded in 4+ places created drift risk. `site-config.ts` as single source of truth eliminated this.
12. **Theme target must be consistent** — Setting `data-theme` on `<html>` vs `<body>` breaks CSS selectors. Pick one target and use it everywhere.
13. **Hash routing section names must match actual IDs** — When `VALID_SECTIONS` diverges from actual section IDs, `aria-current` indicators silently break.
14. **Rate limiting is essential for public API routes** — Even a simple in-memory algorithm provides meaningful protection.
15. **Archiving dormant code reduces confusion** — `_archive/` directories make it immediately clear what code is active vs. dormant, reducing the risk of importing dead code.
16. **Remediation docs may reference non-existent files** — Remediation_4.md was written without access to the actual codebase. Always validate each proposal against the real file structure before applying changes.
17. **Discriminated unions prevent type errors on API responses** — `ContactApiResponse = ContactApiSuccess | ContactApiError` with a `success` discriminant enables TypeScript narrowing. Code that checks `if (data.success)` automatically gets the correct type.
18. **Contrast ratios must be verified in both themes independently** — The Night theme needed a lighter muted text (`#918983` = 5.76:1) while the Day theme needed a darker muted text (`#6b6560` = 5.06:1). The same hex value can pass AA on one background but fail on the other.
19. **Remove unused features rather than leaving them half-implemented** — `prefersHighContrast` was defined in `AccessibilityProvider` but never consumed, and no high-contrast color palette existed. Removing it entirely was cleaner than leaving a dead toggle implying non-existent functionality.
20. **Focus management is essential for keyboard navigation** — Hash-based routing that scrolls without moving focus creates a trap for keyboard users. Adding `tabindex="-1"` + `focus()` on the target heading after navigation brings keyboard users directly to the new section.
21. **Never hardcode credentials in config files** — `drizzle.config.json` had `postgres:postgres` in plaintext. Converting to `drizzle.config.ts` with `process.env.DATABASE_URL` eliminated the security risk. The config now throws a clear error message if the variable is missing.

