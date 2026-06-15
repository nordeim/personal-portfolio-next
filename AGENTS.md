# Agent Instructions: Nicholas Yun Portfolio (v2.0)

This is a high-signal brief for agents working on "The Engineered Soul" portfolio.

## Core Identity
- **Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Drizzle ORM, PostgreSQL.
- **Aesthetic**: "Tactile Brutalism" + "High-End Editorial".
- **Primary Design Constraint**: **Zero border-radius** globally (including scrollbar thumb — fixed in Remediation 4). Use the **28px mathematical grid** for all spacing.

## Current State

The project has passed seven remediation phases (Remediation 1-4 + Code Review Fixes + Full Codebase Alignment + CRITICAL/HIGH Security & Quality 2026-06-14) plus a documentation alignment pass (2026-06-15). Build and typecheck pass cleanly. **SSR is now enabled** (`ssr: false` removed in Remediation 7) — the portfolio is server-rendered and visible to search engines. The SPA orchestrator (`PortfolioApp.tsx`) is implemented and wired into `page.tsx`. Theme initialization happens in exactly one place: `ThemeScript` in `<head>` (the duplicate `useEffect` in `PortfolioApp` was removed). All CSS variables referenced by active components are defined in `@theme` with day-theme overrides. Hash routing uses `history.pushState` to avoid default browser scroll behavior. Theme targeting is unified on `document.documentElement`. Site configuration is centralized in `site-config.ts` (with `satisfies SiteConfig`). Contact form submits to a real API endpoint with rate limiting, typed responses (`ContactApiResponse` discriminated union), request body size limits, runtime type guard (`isContactPayload()`), and honest response messages. Error details are gated on `NODE_ENV`. CSP is hardened (no `'unsafe-eval'`). All text-muted colors pass WCAG AA contrast ratios in both themes. Animation components use `useReducedMotion` hook. All interactive widgets have proper ARIA attributes. BentoGrid has responsive fallback for `span 2` items. Type definitions (`Skill`, `TimelineEntry`) are centralized in `types.ts`. NPM vulnerabilities are resolved (0 via overrides). The `skills/` directory is excluded from TypeScript checking. OG image exists at `public/og-image.png`. Dormant code has been archived to `_archive/` directories. `drizzle.config.json` with hardcoded credentials has been deleted and added to `.gitignore`. `.env.example` includes `EMAIL_API_KEY`. License is MIT (consistent between `package.json` and README).

**Active components** (16: 15 Client Components wired in `PortfolioApp.tsx` + 1 Server Component `ThemeScript` in `layout.tsx`): Navigation, HeroKinetic, SectionBlock, ErrorBoundary, BentoGrid, ProjectsSection, ProjectCard, SkillsSection, Timeline, BlogSection, Terminal, ContactSection, Footer, ThemeSwitch, ScrollReveal, ThemeScript.

**Archived components** (15, in `src/components/_archive/`): AboutFlow, ArchiveSpread, ArchiveItemCard, BentoTile, BrandMark, ClientOnly, CodeRain, ContentBody, DitherOverlay, GrainOverlay, LayoutShell, MachineOverlay, MobileDrawer, SocialIcon, ThemeToggle.

**Archived dead code** (in `_archive/` directories): `src/lib/_archive/` (data.ts, content.ts, utils.ts, testimonials.ts, sounds.ts), `src/hooks/_archive/` (useViewTransitions.ts, useWeightedScroll.ts).

## Operational Gotchas

### Archived Components Use Old CSS Variable Names (Visual Breakage Risk)
The `@theme` block in `globals.css` uses `--color-` prefix: `--color-border`, `--color-text-primary`, `--color-bg`, etc. Archived components use shorthand names that **do not exist**: `--border-color`, `--text-primary`, `--bg-surface`, `--bg-primary`, `--bg-elevated`, `--text-secondary`, `--text-muted`, `--border-strong`, `--color-accent-code`, `--color-accent-poetry`. Before integrating any archived component, you must either add aliases in `globals.css` or rewrite the component to use the `--color-` prefix.

### `page.tsx` Is a Client Component (SSR Enabled)
`src/app/page.tsx` has `"use client"` because it uses `next/dynamic`. **SSR is now enabled** — `ssr: false` was removed in Remediation 7. The portfolio is server-rendered and visible to search engines. Theme initialization is handled by `ThemeScript` in `<head>` (blocking script), so there's no FOUC or hydration mismatch. If you need to re-disable SSR for debugging, add `ssr: false` back to the `dynamic()` call, but do not ship to production with it.

### `PortfolioApp.tsx` Location
`PortfolioApp.tsx` lives in `src/app/`, NOT `src/components/`. The import in `page.tsx` is `@/app/PortfolioApp`. Do NOT move it — the App Router co-locates the orchestrator with the route.

### `react-error-boundary` v6+ Type Change (originated in v4)
`FallbackProps.error` is typed as `unknown`, not `Error`. This breaking change was introduced in v4 and persists through v6 (current installed version). Custom fallback components must type the prop as `error: unknown` and use `instanceof Error` to access `.message`.

### `noUncheckedIndexedAccess: true`
Array index access returns `T | undefined`. Always use `?.` or `??`. This caught 6+ real bugs during Remediation 2 (e.g., `commandHistory[newIndex]`, `columns[i]`, `CHARS[index]`, `focusable[0]`).

### Theme System: Single Initialization Point
Theme switching uses `data-theme="night"` / `data-theme="day"` on `<html>`. Initialization happens in `ThemeScript` (inline `<script>` in `<head>`) — the only place that sets `data-theme` on mount. `PortfolioApp.tsx` no longer has a duplicate theme `useEffect` (removed in Remediation 7 to prevent hydration mismatches). Runtime toggles use `handleThemeChange` which uses `useRef` (not `document.getElementById`) for screen reader announcements. CSS selectors target `[data-theme="day"]`. Do NOT use class-based theme switching (`theme-night`, `theme-day`). Do NOT set `data-theme` on `<body>` — it must be on `<html>`.

### Theme Falls Back to System Preference
When no `localStorage` value exists, `ThemeScript` checks `window.matchMedia('(prefers-color-scheme: dark)')` and sets the theme accordingly. This means a user's first visit respects their OS preference.

### Database Is Optional
`src/db/index.ts` exports `db` which can be `null` if `DATABASE_URL` is not set. Any API route using `db` must include a null guard. The health endpoint (`/api/health`) returns 503 when DB is unavailable.

### Contact API Endpoint Logs to Console (Honest Response)
`/api/contact` validates input, applies rate limiting (5 req/min per IP), but only `console.log`s submissions. The response message honestly states that email delivery is not yet configured. Must integrate an email service (Resend, SendGrid, etc.) before production. Set `EMAIL_API_KEY` in `.env.local` when integrating. The API uses a runtime type guard (`isContactPayload()`) instead of an `as` cast for request body validation.

### Rate Limiter Is In-Memory Only (Dev Warning)
`src/lib/rate-limit.ts` uses a `Map` for storage. Tokens don't persist across server instances or restarts. The cleanup logic uses lazy evaluation (triggered by actual requests) instead of a never-cleared `setInterval`. When no client IP can be determined, rate limiting is skipped rather than grouping all unknown requests under a shared `127.0.0.1` key (which was a DoS vector). For multi-instance deployments (Vercel, Docker), replace with Redis/Upstash rate limiting.

### CSS Import Order (Build-Breaking)
`globals.css` uses `@import "tailwindcss"` as the first import. Google Fonts are loaded via `<link>` tags in `layout.tsx` `<head>`, NOT via `@import url()` in CSS. If you ever add `@import url()` for fonts back to `globals.css`, it MUST come before `@import "tailwindcss"`.

### ✅ `useAccessibility()` and `useReducedMotion()` Are Consolidated (Remediation 5)
`AccessibilityProvider` was removed in Remediation 5. All components now import `useReducedMotion()` directly from `@/hooks/useReducedMotion`. The context-based system is gone — no redundancy remains. Do NOT import `AccessibilityProvider` from `@/components/AccessibilityProvider` — it no longer exists.

### `eslint-plugin-jsx-a11y` Is Already Bundled in `eslint-config-next`
`eslint-config-next/core-web-vitals` already includes `eslint-plugin-jsx-a11y` with its recommended rules (e.g., `anchor-is-valid`, `alt-text`). Do NOT import it separately in `eslint.config.mjs` — doing so causes `ConfigError: Cannot redefine plugin "jsx-a11y"`. The plugin is activated transitively through `eslint-config-next`.

### Error Details Gated on `NODE_ENV`
`error.tsx` and the `ErrorFallback` in `page.tsx` gate detailed error message display on `process.env.NODE_ENV`. In production, users see a generic "An unexpected error occurred" message. In development, the actual error message is displayed for debugging. Do NOT remove this gating — it prevents stack trace and internal implementation leakage in production.

### `instanceof Error` Does Not Reliably Narrow `unknown` in TS Strict
TypeScript 5.5+ strict mode may fail to narrow `unknown` via `instanceof Error`. Use a custom type guard (e.g., `isErrorLike()`) instead. This was encountered in `error.tsx` where `error instanceof Error` produced `Property 'message' does not exist on type '{}'` despite the guard. Always prefer `isErrorLike(error) ? error.message : "..."` for `unknown` error values.

### `history.pushState` Replaces `window.location.hash` for SPA Routing
`useRouteHash` now uses `history.pushState(null, "", "#" + valid)` instead of `window.location.hash = valid`. This avoids the browser's default scroll-to-anchor behavior. Note: `pushState` does NOT fire `hashchange` events — `useRouteHash` now listens for `popstate` to capture back/forward navigation instead.

### Synchronous `setState` Inside `useEffect` Is an Anti-Pattern
`useEffect(() => { setIsMounted(true); }, [])` triggers React linter warnings ("Calling setState synchronously within an effect can trigger cascading renders"). Initialize state directly in render (e.g., `const [mounted] = useState(true)`) or use `useLayoutEffect` if post-DOM updates are needed. Never synchronously update state inside a `useEffect` body.

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
- **Types**: `Project`, `Skill`, and `TimelineEntry` are defined in `types.ts`. `Project` is re-exported from `projects.ts`; `Skill` from `skills.ts`; `TimelineEntry` from `timeline.ts`. Import from the data modules for domain-specific code. `SiteConfig` is in `types.ts`, implemented as `satisfies SiteConfig` in `site-config.ts`. `ContactApiResponse` is in `types.ts` — use it for all contact API response handling.
- **Rate Limiting**: Use `rateLimit()` and `getClientIp()` from `@/lib/rate-limit` for any new API routes. Note: `getClientIp()` returns `null` when no IP can be determined — caller must handle this case.
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
- **Never** call `setState` synchronously inside `useEffect` — React 19 strict linter flags this.
- **Never** let `_archive/` code trigger ESLint errors — add `**/_archive/**` to `globalIgnores`.
- **Never** use `as` type casts on unvalidated input — use runtime type guards.
- **Never** expose internal error details in production — gate on `process.env.NODE_ENV`.
- **Never** fall back to a shared IP in rate limiting — return `null` and skip rate limiting.
- **Never** use `document.getElementById` in React components — use `useRef`.
- **Never** use `grid-column: span 2` without a responsive `@media` fallback.
- **Never** use `as const` without `satisfies` when an interface exists.
- **Never** leave a `setInterval` without `clearInterval` — prefer lazy cleanup.
- **Never** allow `tsconfig.json` include patterns broader than needed — use `exclude`.
- **Never** let agent instruction files (GEMINI.md, etc.) fall out of sync — update all docs in the same pass.
- **Never** mix license declarations across project files — keep consistent (MIT per `package.json`).
- **Never** count components without auditing actual files — ThemeScript is a Server Component easily missed.
- **Never** version-control large binary archives (e.g., `skills-backup.tar.gz` at 40MB).

## Outstanding Issues (Priority Order)

1. **Integrate email service** — Replace `console.log` in `/api/contact/route.ts` with Resend, SendGrid, or similar. `EMAIL_API_KEY` is already in `.env.example`.
2. **Add error reporting** — Integrate Sentry in `error.tsx` and the global error boundary.
3. **Reconcile CSS variable naming for archived components** — If reintegrating any, add aliases in `globals.css` or rewrite to use `--color-` prefix.
4. **Add portrait assets** — Place webp images in `public/portraits/` if needed.
5. ~~**Re-enable SSR**~~ — **DONE in Remediation 7**: `ssr: false` removed.
6. **Write to analytics table** — Implement middleware to track page views or remove unused `analytics` schema.
7. **Replace in-memory rate limiting for production** — For multi-instance deployments, use Redis/Upstash.
8. **Generate production-quality OG image** — Current `og-image.png` is a PIL placeholder.
9. **Migrate Google Fonts to `next/font/google`** — Eliminates render-blocking `<link>` tags.
10. **Remove `skills/` directory** — 40+ unrelated AI skill modules (61 MB) cluttering the repo.
11. **Clean up legacy documentation** — 20+ remediation reports and tar archives should be archived.
12. **Update or remove `GEMINI.md`** — Severely outdated (references `Inter`, `--bg-primary`, `theme-night`, `src/lib/data.ts`, `Next.js 16.2.6`, `Tailwind CSS 4.0`). Will mislead agents that read it.
13. **Remove `skills-backup.tar.gz`** — 40MB archive in repo root should not be version-controlled.

## Lessons Learnt

1. **Verify npm versions before pinning** — The remediation specified versions that didn't exist on npm. Always check with `npm view <pkg> dist-tags`.
2. **CSS import order matters in Tailwind v4** — `@import url()` for fonts must precede `@import "tailwindcss"` which expands to `@layer` rules. Better: load fonts via `<link>` in `layout.tsx` to avoid the issue entirely.
3. **`optimizeFonts` is gone in Next.js 16** — Font optimization is automatic; the config key no longer exists.
4. **`ssr: false` requires `"use client"`** — Next.js 16 enforces this at build time for Server Components.
5. **Two design token systems create technical debt** — Archived components use shorthand CSS variable names (`--border-color`) while `@theme` uses `--color-` prefix (`--color-border`). Must reconcile before integration. Moving dormant code to `_archive/` directories prevents confusion about what's active.
6. **Null-safe database access** — Since `DATABASE_URL` is optional, `db` can be `null`. Any API route using `db` must include a null guard.
7. **`noUncheckedIndexedAccess` catches real bugs** — Array index access returning `T | undefined` revealed 6+ places where runtime errors were possible. Always use `?.` or `??`.
8. **`react-error-boundary` v4 changed `FallbackProps.error` type** — The `error` prop changed from `Error` to `unknown`. This persists through v6+ (current installed version). Custom fallback components must type it as `unknown` and use `instanceof Error` to access `.message`.
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
22. **Prior remediation "fixes" may be incomplete** — Remediation 4 claimed the JSON config was "converted", but the old file was never deleted. Always verify old files are removed.
23. **`ssr: false` is a sledgehammer for hydration mismatches** — Use a blocking `<head>` script (`ThemeScript`) instead. `ssr: false` makes the page invisible to search engines.
24. **`'unsafe-eval'` in CSP is almost never needed in production** — Next.js doesn't require it. Remove from `script-src`.
25. **API responses that claim success without delivering are deceptive** — Be honest. If email isn't configured, say so.
26. **`as` type casts bypass TypeScript's safety net** — Zero runtime protection. Use runtime type guards.
27. **Shared IP fallback in rate limiting is a DoS vector** — Return `null` instead.
28. **`setInterval` without `clearInterval` is a memory leak** — Use lazy cleanup.
29. **Duplicate theme initialization causes hydration mismatches** — One initialization point only.
30. **`document.getElementById` in React should use `useRef`** — `useRef` is React-managed.
31. **`grid-column: span 2` needs responsive fallback** — Always pair with `@media (max-width)`.
32. **`as const` without `satisfies` loses type checking** — Add `satisfies InterfaceName`.
33. **Error messages must be gated on `NODE_ENV`** — Prevent information leakage in production.
34. **Centralize type definitions to prevent drift** — One canonical `types.ts` with re-exports.
35. **`tsconfig.json` include patterns must be scoped narrowly** — Add unrelated directories to `exclude`.
36. **npm overrides can fix transitive dependency vulnerabilities** — Force patched versions without breaking direct dependencies.
37. **Agent instruction files must be updated in the same pass** — `GEMINI.md` fell severely behind (7 remediations) and now references `Inter`, `--bg-primary`, `theme-night`, `src/lib/data.ts`, `Next.js 16.2.6`. Any doc that guides agents must stay current or be deleted.
38. **License declarations must be consistent across files** — `package.json` said `"MIT"` but README said "Proprietary". Always cross-check.
39. **`react-error-boundary` v6+ preserves the v4 `unknown` error type** — Documentation should reference the current installed version (v6) while noting the breaking change originated in v4.
40. **Component counts must be verified by file audit** — After 7 remediations, active component count was listed as 15 despite 16 existing. ThemeScript (Server Component) was consistently missed. Always `ls` the directory.

