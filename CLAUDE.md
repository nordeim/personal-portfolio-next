---
IMPORTANT: File is read fresh for every conversation. Be brief and practical.
---

# Nicholas Yun Portfolio — "The Engineered Soul" (v2.0)

Avant-garde digital installation porting the Nicholas Yun portfolio from a Vite SPA to the **Next.js 16 App Router**, balancing Tactile Brutalism with High-End Editorial design.

## Foundational Principles

### Meticulous Approach (Six-Phase Workflow)

1. **ANALYZE** - Deep, multi-dimensional requirement mining. Never surface-level.
2. **PLAN** - Structured execution roadmap presented for review.
3. **VALIDATE** - Explicit confirmation checkpoint before any code is written.
4. **IMPLEMENT** - Modular, tested, documented builds (Library-first, bespoke styling).
5. **VERIFY** - Rigorous QA against success criteria (edge cases, accessibility, performance).
6. **DELIVER** - Complete handoff with knowledge transfer.

### Anti-Generic Design Philosophy
- **Uniqueness**: Bespoke layouts, asymmetry, and distinctive typography.
- **Intentional Minimalism**: Whitespace as a structural element.
- **Library Discipline**: Use Shadcn/Radix primitives as foundation, styled to achieve the vision.
- **The "Why" Factor**: Every element must earn its place through calculated purpose.

## Implementation Standards

### Next.js 16 Specific
- **App Router**: Use `app/` directory for routes and layouts.
- **Server Components**: Default to Server Components; use `'use client'` only for interactivity. `page.tsx` remains `"use client"` because it uses `next/dynamic`, but SSR is now enabled (no `ssr: false` — removed in Remediation 7).
- **Metadata API**: Use `generateMetadata` and `export const metadata` in `layout.tsx`.
- **Font Loading**: Google Fonts loaded via `<link>` tags in `layout.tsx` `<head>` (preconnect + stylesheet). The `@import url()` approach in `globals.css` also works but MUST come before `@import "tailwindcss"`.
- **`optimizeFonts`**: Removed in Next.js 16 — do NOT add to `next.config.ts`.

### Design System & Styling
- **Brutalist Enforcement**: `border-radius: 0px !important` is enforced globally, including scrollbar thumb (fixed in Remediation 4).
- **28px Grid**: Layout is governed by a 28px mathematical backbone (`--spacing-grid` in `@theme`). Derived: `--spacing-double` (56px), `--spacing-half` (14px), `--spacing-quarter` (7px).
- **Typography Hierarchy**:
  - **Editorial**: `Cormorant Garamond` (Headings/Narrative) — `var(--font-editorial)` / `var(--font-serif)` / `var(--font-display)`.
  - **Utility**: `IBM Plex Mono` (Labels/Machine Mode) — `var(--font-utility)` / `var(--font-mono)`.
  - **Body**: `DM Sans` (General content, replaces Inter) — `var(--font-body)` / `var(--font-sans)`.
- **Theme System**: Uses `data-theme="night"` / `data-theme="day"` on `<html>`. CSS selectors target `[data-theme="day"]`. NOT class-based (`theme-night` / `theme-day`). System preference (`prefers-color-scheme`) is detected when no stored value exists.
- **CSS Variable Naming**: The canonical convention uses `--color-` prefix (e.g., `--color-border`, `--color-text-primary`, `--color-bg`). Archived components in `_archive/` use shorthand names (`--border-color`, `--text-primary`) that are NOT defined — see Gotchas.
- **Contrast Ratios**: All `--color-text-muted` values pass WCAG AA (Night: `#918983` = 5.76:1, Day: `#6b6560` = 5.06:1). Fixed in Remediation 4.

### Architecture & Routing
- **Client-Side Orchestrator**: Most portfolio logic runs in `src/app/PortfolioApp.tsx` (Client Component with `"use client"`). Note: this file is in `src/app/`, NOT `src/components/`.
- **Entry Point**: `src/app/page.tsx` is a Client Component that dynamically imports `PortfolioApp` from `@/app/PortfolioApp`. SSR is enabled (Remediation 7 removed `ssr: false`). Uses `react-error-boundary` (not the custom `ErrorBoundary` component).
- **Hash Routing**: Preserved via `useRouteHash` hook. `VALID_SECTIONS` is aligned with actual section IDs: `["hero","about","projects","skills","experience","blog","terminal","contact"]`. Focus management moves keyboard focus to section headings after navigation.
- **Site Configuration**: Centralized in `src/lib/site-config.ts` — name, email, social links, URL. All components that need this data import from here.
- **Static Content**: Active data comes from `src/lib/projects.ts`, `src/lib/skills.ts`, `src/lib/timeline.ts`. The file `src/lib/_archive/data.ts` is **archived dead code** (never imported by active components).
- **Lazy Loading**: Below-the-fold sections use `React.lazy()` + `Suspense` for code splitting.
- **Error Boundaries**: Two systems coexist — `react-error-boundary` at the page level (`page.tsx`) and a custom class-based `ErrorBoundary` per section (in `PortfolioApp.tsx`).
- **Rate Limiting**: `src/lib/rate-limit.ts` provides an in-memory sliding window rate limiter. Applied to `/api/contact`. For multi-instance deployments, replace with Redis/Upstash.
- **Drizzle Config**: `drizzle.config.ts` (not `.json`) reads `DATABASE_URL` from environment. Throws a clear error if the variable is missing.

### Component Classification
**Active** (16, used by `PortfolioApp.tsx` and `layout.tsx`): Navigation, HeroKinetic, SectionBlock, ErrorBoundary, BentoGrid, ProjectsSection, ProjectCard, SkillsSection, Timeline, BlogSection, Terminal, ContactSection, Footer, ThemeSwitch, ScrollReveal, ThemeScript (Server Component, used in `layout.tsx`).

**Archived** (15, in `src/components/_archive/`): AboutFlow, ArchiveSpread, ArchiveItemCard, BentoTile, BrandMark, ClientOnly, CodeRain, ContentBody, DitherOverlay, GrainOverlay, LayoutShell, MachineOverlay, MobileDrawer, SocialIcon, ThemeToggle.

> Archived components have **unresolved CSS variable references** (shorthand names) and **undefined Tailwind classes**. They need remediation before integration — see Gotchas.

### Type System
- **`Project` type consolidated** — Single canonical definition in `src/lib/types.ts`, re-exported from `src/lib/projects.ts`. Fields: `id`, `title`, `description`, `role`, `period`, `category`, `tech` (readonly string[]), `links: ProjectLink` (with `live?` and `repo?`), `image?`, `featured?`.
- **`SiteConfig` interface** — Defined in `types.ts`, implemented as `const ... satisfies SiteConfig` in `site-config.ts` (Remediation 7 added `satisfies` for compile-time validation). Single source of truth for name, email, URLs.
- **`Skill` and `TimelineEntry` interfaces** — Defined in `types.ts`, re-exported from `skills.ts` and `timeline.ts`. Centralized in Remediation 7 to prevent type drift.
- **`ContactApiResponse` discriminated union** — Added in Remediation 4. `ContactApiSuccess | ContactApiError` with `success` discriminant. Used by `/api/contact` and `ContactSection`.
- **Runtime type guard `isContactPayload()`** — Added in Remediation 7. Replaces the unsafe `as ContactPayload` cast in the contact API route. Validates field types before processing.
- **Archived types in `types.ts`**: `AboutPillar`, `ParsedCollectionItem`, `Collection`, `ParsedPortfolioItem`, `MachineOverlayData`, `SocialIconVariant` — only imported by archived components.
- **`noUncheckedIndexedAccess: true`** — Array index access returns `T | undefined`. Always use `?.` or `??`.

## Development Workflow

### Build Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Typecheck + Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |

### Database (Drizzle)
| Command | Purpose |
|---------|---------|
| `npx drizzle-kit push` | Sync schema to DB |
| `npx drizzle-kit studio` | Open DB explorer |

> Database is **optional**. Without `DATABASE_URL`, the app runs normally — DB features are disabled gracefully (returns 503 on `/api/health`). Note: `drizzle.config.ts` will throw if `DATABASE_URL` is missing; this is intentional since Drizzle Kit commands require it.

### Environment Variables
| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | No (app runs without DB; Drizzle Kit requires it) |
| `NEXT_PUBLIC_SITE_URL` | Site URL for `metadataBase` in `layout.tsx` | No (defaults to `https://nicholasyun.com`) |
| `EMAIL_API_KEY` | API key for email delivery service (Resend, SendGrid, etc.) | No (without it, contact form only logs server-side) |

## Testing Strategy

- **Test-Driven Development**: Write failing tests first; test behavior, not implementation.
- **Command**: `npm test`

## Code Quality Standards

- **TypeScript Strict Mode**: No `any`, explicit types on all parameters/returns. `noUncheckedIndexedAccess: true` enabled.
- **Early Returns**: Prefer early returns over nested conditionals.
- **Composition over Inheritance**: Favor wrapper classes and factory functions.

## Gotchas & Critical Warnings

### Archived Components Use Old CSS Variable Names
Components in `_archive/` use shorthand names that **do not exist** in `@theme`:
- `--border-color`, `--text-primary`, `--bg-surface`, `--bg-primary`, `--bg-elevated`, `--text-secondary`, `--text-muted`, `--border-strong`, `--color-accent-code`, `--color-accent-poetry`

**Before integrating any archived component**, either define aliases in `globals.css` or rewrite the component to use the `--color-` prefix convention (`--color-border`, `--color-text-primary`, etc.).

### Missing Tailwind Utility Classes (Archived Components)
Archived components reference these classes. `@theme` has corresponding `--font-*` and `--z-index-*` entries, but verify Tailwind v4 mapping works:
- `font-editorial`, `font-utility`, `font-body` — mapped from `--font-editorial`, `--font-utility`, `--font-body`
- `z-grain`, `z-machine`, `z-mobile-backdrop`, `z-mobile-drawer` — mapped from `--z-index-grain`, etc.

### `page.tsx` Is a Client Component (SSR Enabled)
`src/app/page.tsx` has `"use client"` because it uses `next/dynamic`. SSR is now enabled — `ssr: false` was removed in Remediation 7. The portfolio is server-rendered and visible to search engines. Theme initialization is handled by `ThemeScript` in `<head>` (blocking script), so there's no FOUC or hydration mismatch from `localStorage` access.

### `PortfolioApp.tsx` Location
`PortfolioApp.tsx` lives in `src/app/`, NOT `src/components/`. The import in `page.tsx` must be `@/app/PortfolioApp`. Do NOT move it — the App Router co-locates the orchestrator with the route.

### `react-error-boundary` v6+ Type Change (originated in v4)
`FallbackProps.error` is typed as `unknown`, not `Error`. This breaking change was introduced in v4 and persists through v6 (current installed version). Custom fallback components must use `error: unknown` and guard with `instanceof Error` to access `.message`.

### `noUncheckedIndexedAccess: true`
Array index access returns `T | undefined`. Always use `?.` or `??`. This caught 6+ real bugs during Remediation 2 (e.g., `commandHistory[newIndex]`, `columns[i]`, `CHARS[index]`, `focusable[0]`).

### Theme System: Single Initialization Point
Theme initialization happens in `ThemeScript` (inline `<script>` in `layout.tsx` `<head>`), which runs before React hydration. `PortfolioApp.tsx` no longer has a duplicate theme `useEffect` (removed in Remediation 7). The `handleThemeChange` callback in `PortfolioApp` handles runtime toggles and uses `useRef` (not `document.getElementById`) for screen reader announcements. Both `ThemeScript` and `PortfolioApp` target `document.documentElement`. CSS selectors target `[data-theme="day"]`. Do NOT use class-based theme switching (`theme-night`, `theme-day`).

### Database Is Optional
`src/db/index.ts` exports `db` which can be `null` if `DATABASE_URL` is not set. Any API route using `db` must include a null guard. The health endpoint (`/api/health`) returns 503 when DB is unavailable.

### Contact API Endpoint Logs to Console (Honest Response)
`/api/contact` validates input, rate-limits requests (5 req/min per IP), but only `console.log`s submissions. The response message honestly states that email delivery is not yet configured. Must integrate an email service (Resend, SendGrid, etc.) before production. Set `EMAIL_API_KEY` in `.env.local` when integrating.

### Rate Limiter Is In-Memory Only (Dev Warning)
`src/lib/rate-limit.ts` uses a `Map` for storage. Tokens don't persist across server instances or restarts. The cleanup logic uses lazy evaluation (triggered by actual requests) instead of a never-cleared `setInterval`. When no client IP can be determined, rate limiting is skipped rather than grouping all unknown requests under a shared `127.0.0.1` key. For multi-instance deployments (Vercel, Docker), replace with Redis/Upstash rate limiting.

### ✅ `useAccessibility()` and `useReducedMotion()` Are Consolidated (Remediation 6)
`AccessibilityProvider` was removed in Remediation 5. All components now import `useReducedMotion()` directly from `@/hooks/useReducedMotion`. The context-based system is gone — no redundancy remains.

### No Error Reporting
`error.tsx` has a `console.error` placeholder for Sentry or similar. No structured error reporting exists. Integrate Sentry or a comparable service before production.

### Analytics Table Never Written To
The `analytics` table schema exists and the health endpoint checks DB connectivity, but no code ever inserts rows. Either implement middleware to track page views or remove the unused schema.

### Missing Portrait Assets
Archived `data.ts` references `/portraits/*.webp` files that don't exist in `public/`. Either add the assets or remove the references.

### CSS Import Order (MUST follow)
```
/* CORRECT order in globals.css: */
@import "tailwindcss";      /* Tailwind (expands to @layer rules) */

/* Note: Google Fonts are loaded via <link> tags in layout.tsx <head>,
   NOT via @import in globals.css. This avoids CSS import ordering issues. */
```

### `drizzle.config.ts` Throws Without DATABASE_URL
The config file throws a descriptive error if `DATABASE_URL` is not set. This is intentional for Drizzle Kit commands. The main application handles a missing database gracefully (returns 503 on DB-dependent endpoints).

### Remediation Docs May Reference Non-Existent Files
Remediation_4.md was written without access to the actual codebase and referenced ~15 files that don't exist (`ParticleField.tsx`, `CustomCursor.tsx`, `CursorTrail.tsx`, `GlitchText.tsx`, `DayNightToggle.tsx`, `AccessibilityMenu.tsx`, `TerminalEmulator.tsx`, `PersistentTerminal.tsx`, `ScrollProgress.tsx`, `useAccessibility.ts`, `projectsData.ts`, `About.tsx`, `Projects.tsx`, `Skills.tsx`, `Contact.tsx`, `Hero.tsx`). Always validate remediation proposals against the actual file structure before applying.

## Lessons Learnt

See **README.md** § Lessons Learnt for the full annotated list (46 lessons across 7 remediation phases). Key takeaways:

- Always validate remediation docs against the actual file structure before applying.
- Discriminated unions for API responses prevent type errors and enable safe narrowing.
- Contrast ratios must be tested in BOTH themes — the same hex can pass AA on dark but fail on light.
- Remove half-implemented features entirely rather than leaving dead toggles.
- Focus management is essential for keyboard navigation with hash-based routing.
- Never hardcode credentials — use environment variables and create `.env.example`.
- Always update ALL agent instruction files (CLAUDE.md, AGENTS.md, GEMINI.md) in the same pass — GEMINI.md fell behind through 7 remediations.
- Keep license declarations consistent across project files (MIT per `package.json`).
- Count actual files when documenting component totals — ThemeScript is a Server Component easily missed.
- Prior remediation "fixes" may be incomplete — always verify old files were deleted after conversion.
- `ssr: false` is a sledgehammer; use `<head>` scripts for initialization instead.
- `as` type casts bypass TypeScript's safety net — use runtime type guards.
- Falling back to a shared IP in rate limiting is a DoS vector — return `null` instead.
- Error messages must be gated on `NODE_ENV` to prevent information leakage in production.

### `ContactApiResponse` Is a Discriminated Union
API responses from `/api/contact` use `ContactApiResponse = ContactApiSuccess | ContactApiError`. TypeScript narrows the type automatically when you check `data.success`. Do NOT access `data.error` without first checking `data.success === false`, and do NOT access `data.message` without checking `data.success === true`.

## Project-Specific Standards

### Visual Fidelity Checklist
- [x] WCAG AAA: skip link, focus-visible, reduced motion, sr-only utility
- [x] Dual theme with FOUC prevention script
- [x] System preference detection (`prefers-color-scheme`)
- [x] Error boundaries per section
- [x] Consolidated `Project` type with `noUncheckedIndexedAccess`
- [x] Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [x] OG/Twitter metadata + JSON-LD structured data + OG image (`public/og-image.png`)
- [x] Centralized site config (`site-config.ts`)
- [x] Contact API with server-side validation + rate limiting + honest response messages + runtime type guard
- [x] All CSS variables defined in `@theme` with day overrides
- [x] Hash routing aligned with actual section IDs
- [x] Theme target unified on `<html>`
- [x] Dead code archived to `_archive/` directories
- [x] Scrollbar `border-radius: 0` (brutalist consistency)
- [x] `drizzle.config.ts` uses env vars (no hardcoded credentials); `drizzle.config.json` DELETED and in `.gitignore`
- [x] `.env.example` created with all required/optional variables documented
- [x] Text-muted contrast ratios pass WCAG AA in both themes
- [x] Focus management on hash navigation for keyboard users
- [x] Animation components respect `useReducedMotion`
- [x] `ContactApiResponse` discriminated union for type-safe API responses
- [ ] 28px visible background grid (both themes)
- [ ] Kinetic typography: scroll velocity -> font-weight (200-950)
- [ ] Grain overlay (human fingerprint)
- [ ] Machine Mode overlay with terminal aesthetics
- [ ] Pointer parallax on hero portrait
- [ ] Portrait assets in `/public/portraits/`
- [ ] Email service integration for contact form
- [ ] Error reporting (Sentry integration)
- [ ] SSR for SEO ✅ Completed in Remediation 7
- [ ] Update/remove `GEMINI.md` (severely outdated — references `Inter`, `--bg-primary`, `theme-night`, `src/lib/data.ts`, `Next.js 16.2.6`)
- [ ] Remove `skills-backup.tar.gz` from repo (40MB, should not be version-controlled)
- [x] Consolidate `useAccessibility()` context vs. standalone `useReducedMotion()` ✅ Completed in Remediation 6
- [x] SSR for SEO ✅ Completed in Remediation 7 — `ssr: false` removed, `ThemeScript` handles initialization, duplicate theme `useEffect` removed
- [x] CSP hardened ✅ Completed in Remediation 7 — `'unsafe-eval'` removed from `script-src`
- [x] Error messages gated on `NODE_ENV` ✅ Completed in Remediation 7
- [x] `siteConfig` satisfies `SiteConfig` ✅ Completed in Remediation 7
- [x] BentoGrid responsive fallback ✅ Completed in Remediation 7
- [x] Type definitions centralized to `types.ts` ✅ Completed in Remediation 7
- [x] npm vulnerabilities resolved ✅ Completed in Remediation 7 (0 vulnerabilities via overrides)

## Remediation History

### Remediation 1 (v2.0 initial pass)

| Issue | Resolution |
|-------|-----------|
| `@types/react-dom@^19.2.6` didn't exist on npm | Updated to `^19.2.3` |
| `react@^19.2.6` / `react-dom@^19.2.6` didn't exist | Updated to `^19.2.7` |
| `next@^16.2.6` didn't exist | Updated to `^16.2.9` |
| `optimizeFonts` not in `NextConfig` type | Removed from `next.config.ts` |
| Unused `CodeRain` lazy import (TS6133) | Removed from `PortfolioApp.tsx` |
| `db` possibly null (TS18047) | Added null guard in `/api/health/route.ts` |
| `ssr: false` not allowed in Server Components | Added `"use client"` to `page.tsx` |
| CSS `@import url()` must precede all rules | Moved Google Fonts import before `@import "tailwindcss"` |

### Remediation 2 (type consolidation + strictness)

| Issue | Resolution |
|-------|-----------|
| Duplicate `Project` type across `types.ts` and `projects.ts` | Consolidated into single definition in `types.ts`; `projects.ts` re-exports |
| Missing type exports (`AboutPillar`, `ParsedCollectionItem`, etc.) | Added 7 missing interfaces/types to `types.ts` |
| `noUncheckedIndexedAccess` not enabled | Added to `tsconfig.json`; fixed 6+ array index access patterns |
| `react-error-boundary` not installed | Added as dependency; `page.tsx` uses its `ErrorBoundary` |
| `useRouteHash` returns tuple, not object | Fixed destructuring in `PortfolioApp.tsx` |
| `page.tsx` imported `@/components/PortfolioApp` (wrong path) | Fixed to `@/app/PortfolioApp` |
| `FallbackProps.error` typed as `Error` instead of `unknown` | Updated `ErrorFallback` in `page.tsx` |
| `ProjectCard` used `tags`/`github`/`live` (old Project shape) | Rewrote to use `tech`/`links.repo`/`links.live` |
| `MobileDrawer` accessed `link.href`/`link.label` on `SocialLink` | Fixed to use `link.url`/`link.platform` with `SocialIconVariant` cast |
| Missing `@theme` tokens (fonts, z-index, animations) | Added `--font-editorial`, `--font-utility`, `--font-body`, `--z-index-*` scale, `--animate-*` |
| Missing day-theme overrides | Added `[data-theme="day"]` color overrides |
| Missing security headers | Added X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| Missing OG/Twitter metadata | Added comprehensive metadata in `layout.tsx` |
| Missing structured data | Added JSON-LD `Person` schema in `layout.tsx` |

### Remediation 3 (design tokens, routing, architecture)

| Issue | Resolution |
|-------|-----------|
| 14 undefined CSS variables in active components | Defined all in `@theme`: `--font-display`, `--spacing-double`, `--spacing-half`, `--spacing-quarter`, `--transition-fast`, `--shadow-brutal`, `--shadow-brutal-sm`, `--color-text-inverse`, `--color-border-subtle`, `--color-bg-sunken`, `--color-bg-elevated`, `--color-error`, `--color-accent-subtle` |
| Day theme incomplete | Added day-theme overrides for ALL semantic tokens (inverse, subtle, sunken, elevated, error, accent-subtle, shadows) |
| Hash routing mismatch (`VALID_SECTIONS` != actual IDs) | Updated `useRouteHash` to `["hero","about","projects","skills","experience","blog","terminal","contact"]` |
| Theme target inconsistency (`<html>` vs `<body>`) | Unified on `document.documentElement` in both `ThemeScript` and `PortfolioApp` |
| System preference ignored | Added `prefers-color-scheme` detection in `ThemeScript` and `PortfolioApp` |
| Contact info scattered across components | Created `src/lib/site-config.ts` as single source of truth; imported by Footer, Navigation, Terminal, layout.tsx |
| `metadataBase` hardcoded as `example.com` | Now uses `NEXT_PUBLIC_SITE_URL` env var with `https://nicholasyun.com` fallback |
| `NEXT_PUBLIC_SITE_URL` defined but unused | Now consumed in `layout.tsx` |
| Contact form simulated with `setTimeout` | Replaced with real `POST /api/contact` endpoint with validation + rate limiting |
| No rate limiting on API routes | Created `src/lib/rate-limit.ts` with sliding window algorithm; applied to `/api/contact` |
| Duplicate skip-link in `layout.tsx` and `PortfolioApp.tsx` | Removed from `PortfolioApp.tsx`; kept in `layout.tsx` only |
| Dead/dormant code mixed with active code | Moved 14 dormant components to `_archive/`, 5 lib files to `lib/_archive/`, 2 hooks to `hooks/_archive/` |

### Remediation 4 (accessibility, security, type safety)

| Issue | Resolution |
|-------|-----------|
| Scrollbar `border-radius: 3px` violated zero-radius brutalist rule | Changed to `border-radius: 0` in `globals.css` |
| `drizzle.config.json` had hardcoded `postgres:postgres` credentials | Converted to `drizzle.config.ts` reading `DATABASE_URL` from environment; throws clear error if missing |
| No `.env.example` file | Created `.env.example` with `DATABASE_URL` and `NEXT_PUBLIC_SITE_URL` documented |
| Contact API responses untyped | Added `ContactApiResponse` discriminated union (`ContactApiSuccess \| ContactApiError`) to `types.ts`; updated `route.ts` and `ContactSection` |
| `prefersHighContrast` in `AccessibilityProvider` was never consumed and had no implementation | Removed from interface, context, and provider — dead feature with no color palette |
| `HeroKinetic` and `ScrollReveal` used inline `window.matchMedia` instead of `useReducedMotion` hook | Updated both to import and use `useReducedMotion()` from `@/hooks/useReducedMotion` |
| Text-muted contrast ratios failed WCAG AA | Night: `#6b6560` → `#918983` (3.45:1 → 5.76:1); Day: `#8a8478` → `#6b6560` (3.28:1 → 5.06:1) |
| No focus management after hash navigation | Added `requestAnimationFrame` + `tabindex="-1"` + `focus()` in `useRouteHash.setActiveSection` to move keyboard focus to section headings |
| ARIA attributes on interactive widgets | Verified already present — `ThemeSwitch` has `role="switch"` + `aria-checked`, `Navigation` has `aria-current`, `Terminal` has `role="log"` + `aria-live="polite"` |

### Remediation 5 (Code Review Fixes — 2026-06-14)

| Issue | Resolution |
|-------|-----------|
| `error.tsx` typed `error` as `Error` instead of `unknown` | Changed to `error: unknown` with `isErrorLike()` custom type guard |
| `not-found.tsx` was a Client Component with hardcoded `<a>` | Removed `"use client"`; replaced `<a>` with Next.js `<Link>`; replaced inline styles with CSS variables |
| `next.config.ts` was empty / missing security headers | Added `headers()` export with CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| Rate limiter trusted `x-forwarded-for` without proxy trust | Documented proxy trust boundary; added warning log when falling back to `127.0.0.1` |
| Hero "View Work" link bypassed hash routing | Delegated click to `onNavigate` prop from parent `PortfolioApp` |
| Mobile menu lacked focus trap | Implemented Tab key cycling within mobile menu dialog in `Navigation.tsx` |
| `ProjectCard` used raw `<img>` tag | Replaced with Next.js `<Image>` component with proper sizing and lazy loading |
| `ContactSection` re-rendered on every keystroke | Removed `errors` from `handleChange` dependency array; used functional `setErrors` updates |
| Grain overlay SVG filter caused GPU repaints | Reduced `baseFrequency` from `0.9` to `0.65` in `globals.css` |
| Redundant `AccessibilityProvider` context | Removed from `PortfolioApp.tsx`; all components use `useReducedMotion()` directly |
| Terminal used unstable `key={index}` for history lines | Added monotonic `id` to `TerminalLine`; use `line.id` as `key` |
| Terminal hardcoded `8px` spacing | Replaced with `var(--spacing-quarter)` |
| Terminal inline object creation in `executeCommand` | Extracted `newLine()` helper; refactored `executeCommand` to use it |
| No request body size limit on contact API | Added `MAX_BODY_SIZE` (10KB) check before JSON parsing |
| `window.location.hash` triggered browser scroll | Replaced with `history.pushState`; added `popstate` event listener in `useRouteHash` |
| `eslint-plugin-jsx-a11y` import conflict | Documented that it's already bundled in `eslint-config-next`; removed redundant import |

### Remediation 6 (Full Codebase Alignment — 2026-06-14)

| Issue | Resolution |
|-------|-----------|
| `AccessibilityProvider.tsx` still existed after supposed removal | Deleted the file; no active imports remain |
| ESLint errors from `setState` inside `useEffect` | Refactored `useReducedMotion.ts`, `ScrollReveal.tsx`, `HeroKinetic.tsx`, `ThemeSwitch.tsx` to initialize state directly in render |
| ESLint error in `_archive/ClientOnly.tsx` | Added `**/_archive/**` to `globalIgnores` in `eslint.config.mjs` |
| `Timeline.tsx` had hardcoded `8px` | Replaced with `var(--spacing-quarter)` |
| Lessons Learned numbering was inconsistent in README.md | Renumbered all items for consistency |

### Remediation 7 (CRITICAL + HIGH Security & Quality — 2026-06-14)

| Issue | Resolution |
|-------|-----------|
| `drizzle.config.json` still existed with hardcoded credentials | **DELETED** the file; added `drizzle.config.json`, `.env`, `.env.local` to `.gitignore` |
| CSP had `'unsafe-inline'` and `'unsafe-eval'` in `script-src` | Removed `'unsafe-eval'` from `script-src`; restricted `'unsafe-inline'` to `style-src` only |
| `ssr: false` made portfolio invisible to search engines | Removed `ssr: false` from `page.tsx`; portfolio is now server-rendered |
| Contact API returned `success: true` without sending email | Changed response message to honestly state delivery is pending; added `EMAIL_API_KEY` to `.env.example` |
| Missing OG image at `/og-image.png` | Generated 1200x630 brutalist OG image at `public/og-image.png` |
| `as ContactPayload` cast bypassed runtime validation | Replaced with `isContactPayload()` runtime type guard function |
| Rate limiter fell back to shared `127.0.0.1` IP | `getClientIp()` now returns `null`; caller skips rate limiting when IP unknown |
| `setInterval` for cleanup never cleared | Replaced with lazy cleanup triggered by actual requests |
| In-memory rate limiter undocumented as dev-only | Added WARNING comments; documented multi-instance limitation |
| Duplicate theme `useEffect` in `PortfolioApp.tsx` | Removed — `ThemeScript` in `<head>` is the single initialization point |
| `document.getElementById` for theme announcements | Replaced with `useRef<HTMLDivElement>` |
| `grid-column: span 2` without responsive fallback | Added `.bento-span-2` CSS class with `@media (max-width: 640px)` fallback |
| `siteConfig` lacked `satisfies SiteConfig` | Added `satisfies SiteConfig` with import from `types.ts` |
| `error.tsx` exposed internal error details in production | Gated `errorMessage` on `process.env.NODE_ENV === 'production'` |
| `not-found.tsx` missing `<h1>`, `<main>`, `role="alert"` | Added semantic HTML landmarks for accessibility |
| `Skill` and `TimelineEntry` types defined locally | Moved to central `types.ts` with re-exports from data modules |
| 6 npm vulnerabilities (esbuild RCE, PostCSS XSS) | Added npm `overrides` for `esbuild >=0.25.0` and `postcss >=8.5.10` — 0 vulnerabilities |
| `skills/` directory caused 40+ TypeScript errors | Added `"skills"` to `tsconfig.json` `exclude` array |

### Documentation Alignment (2026-06-15)

| Issue | Resolution |
|-------|-----------|
| Component count listed as 15 instead of 16 | Corrected to 16 (ThemeScript was a Server Component not counted) |
| Lessons 27-28 in README.md contained Chinese text | Translated to English for consistency |
| README.md license said "Proprietary" but `package.json` said "MIT" | Aligned to MIT |
| `react-error-boundary` type change docs referenced "v4" but installed version is v6 | Updated to "v6+ (originated in v4)" |
| `GEMINI.md` severely outdated (7 remediations behind) | Updated to match current codebase state |
| `skills-backup.tar.gz` (40MB) in repo root undocumented | Added to outstanding issues and recommendations |

