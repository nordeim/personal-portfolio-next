# Agent Instructions: Nicholas Yun Portfolio (v2.0)

This is a high-signal brief for agents working on "The Engineered Soul" portfolio.

## Core Identity
- **Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Drizzle ORM, PostgreSQL.
- **Aesthetic**: "Tactile Brutalism" + "High-End Editorial".
- **Primary Design Constraint**: **Zero border-radius** globally. Use the **28px mathematical grid** for all spacing.

## Current State

The project has passed two remediation phases. Build and typecheck pass cleanly. The SPA orchestrator (`PortfolioApp.tsx`) is implemented and wired into `page.tsx`. However, several dormant components from an earlier iteration exist in `src/components/` but are **not integrated** — they have unresolved CSS variable references and undefined Tailwind classes. Additionally, **14 CSS variables referenced by active components are not defined** in `@theme`, causing silent runtime failures (broken transitions, missing shadows, transparent backgrounds).

**Active components** (18, wired in `PortfolioApp.tsx`): Navigation, HeroKinetic, SectionBlock, ErrorBoundary, AccessibilityProvider, BentoGrid, ProjectsSection, ProjectCard, SkillsSection, Timeline, BlogSection, Terminal, ContactSection, Footer, ThemeSwitch, ScrollReveal, ThemeScript.

**Dormant components** (14, exist but NOT wired): AboutFlow, ArchiveSpread, ArchiveItemCard, BentoTile, BrandMark, ClientOnly, CodeRain, ContentBody, DitherOverlay, GrainOverlay, LayoutShell, MachineOverlay, MobileDrawer, SocialIcon, ThemeToggle.

**Dead code** (never imported by anyone): `src/lib/data.ts`, `src/lib/content.ts`, `src/lib/utils.ts`, `src/lib/testimonials.ts`, `src/lib/sounds.ts`, `src/hooks/useViewTransitions.ts`, `src/hooks/useWeightedScroll.ts`.

## Operational Gotchas

### 14 Undefined CSS Variables in Active Components (CRITICAL)
Active components use `var(--font-display)`, `var(--spacing-half)`, `var(--transition-fast)`, `var(--shadow-brutal)`, `var(--color-text-inverse)`, etc. that resolve to `unset` at runtime. There are **no errors or warnings** — styles simply don't apply. These must be added to `@theme` in `globals.css`:

| Variable | Used In (active) | Needs Day Override? |
|----------|------------------|---------------------|
| `--font-display` | HeroKinetic, Timeline, BlogSection, ContactSection, BentoGrid, ProjectCard | No (alias for `--font-editorial`) |
| `--spacing-double` | HeroKinetic, SectionBlock, ProjectsSection, ContactSection | No |
| `--spacing-half` | Navigation, ProjectsSection, SkillsSection, Timeline, ContactSection, ThemeSwitch, Terminal, BentoGrid, ErrorBoundary | No |
| `--spacing-quarter` | Navigation, ProjectsSection, SkillsSection, Timeline, ContactSection, ThemeSwitch, ErrorBoundary | No |
| `--transition-fast` | Navigation, HeroKinetic, ProjectsSection, ProjectCard, ThemeSwitch, ContactSection, Footer, BentoGrid | No |
| `--shadow-brutal` | HeroKinetic, ContactSection, Terminal | No |
| `--shadow-brutal-sm` | SkillsSection, ProjectCard, BentoGrid | No |
| `--color-text-inverse` | HeroKinetic, ProjectsSection, ProjectCard, ContactSection | Yes |
| `--color-border-subtle` | Navigation, HeroKinetic, ProjectsSection, ProjectCard, SkillsSection, BlogSection | Yes |
| `--color-bg-sunken` | ProjectCard, ContactSection, Terminal | Yes |
| `--color-bg-elevated` | Terminal, ErrorBoundary | Yes |
| `--color-error` | ContactSection, Terminal, ErrorBoundary | Yes |
| `--color-accent-subtle` | ContactSection | Yes |

### Hash Routing Mismatch (CRITICAL)
`useRouteHash` validates `VALID_SECTIONS = ["hero","who","work","skills","music","now","contact"]` but `PortfolioApp` renders sections with IDs `["hero","about","projects","skills","experience","blog","terminal","contact"]`. Only `hero`, `skills`, and `contact` match. This breaks `aria-current` indicators and active link highlighting for most sections. **Update `VALID_SECTIONS` to match actual IDs.**

### Theme Target Inconsistency
- `ThemeScript` sets `data-theme` on `document.documentElement` (`<html>`)
- `PortfolioApp` sets `data-theme` on `document.body`
- CSS `[data-theme="day"]` only matches the element it's set on
- **Pick one target.** Recommendation: use `<html>` consistently.

### CSS Import Order (Build-Breaking)
`globals.css` MUST have `@import url(...)` for Google Fonts BEFORE `@import "tailwindcss"`. Tailwind v4 expands to `@layer` rules, and CSS spec requires `@import` to precede all other rules. Wrong order causes build warnings and font loading failure.

### Two CSS Variable Naming Conventions (Visual Breakage Risk)
The `@theme` block in `globals.css` uses `--color-` prefix: `--color-border`, `--color-text-primary`, `--color-bg`, etc. Dormant components use shorthand names that **do not exist**: `--border-color`, `--text-primary`, `--bg-surface`, `--bg-primary`, `--bg-elevated`, `--text-secondary`, `--text-muted`, `--border-strong`, `--color-accent-code`, `--color-accent-poetry`. Before integrating any dormant component, you must either add aliases in `globals.css` or rewrite the component to use the `--color-` prefix.

### `page.tsx` Is a Client Component
`src/app/page.tsx` has `"use client"` because it uses `next/dynamic` with `ssr: false`. This means the entire page is client-rendered — no SSR. Metadata from `layout.tsx` (Server Component) still works. If you re-enable SSR, remove `"use client"` from `page.tsx` and use `Suspense` boundaries instead.

### `PortfolioApp.tsx` Location
`PortfolioApp.tsx` lives in `src/app/`, NOT `src/components/`. The import in `page.tsx` is `@/app/PortfolioApp`. Do NOT move it — the App Router co-locates the orchestrator with the route.

### `react-error-boundary` v4 Type Change
`FallbackProps.error` is typed as `unknown`, not `Error`. Custom fallback components must type the prop as `error: unknown` and use `instanceof Error` to access `.message`.

### `noUncheckedIndexedAccess: true`
Array index access returns `T | undefined`. Always use `?.` or `??`. This caught 6+ real bugs during Remediation 2 (e.g., `commandHistory[newIndex]`, `columns[i]`, `CHARS[index]`, `focusable[0]`).

### Theme System: `data-theme` Attribute, NOT Classes
Theme switching uses `data-theme="night"` / `data-theme="day"`. CSS selectors target `[data-theme="day"]`. Do NOT use class-based theme switching (`theme-night`, `theme-day`).

### Database Is Optional
`src/db/index.ts` exports `db` which can be `null` if `DATABASE_URL` is not set. Any API route using `db` must include a null guard. The health endpoint (`/api/health`) returns 503 when DB is unavailable.

### Duplicate Skip-Link
Both `layout.tsx` and `PortfolioApp.tsx` render a skip-to-content link. Remove the duplicate — keep it in `layout.tsx` only.

### Contact Form Is Simulated
`ContactSection.tsx` uses `setTimeout` to mock form submission. No API route exists. Replace with a real endpoint before production.

### Missing Portrait Assets
`src/lib/data.ts` references `/portraits/*.webp` files that don't exist in `public/`. Either add the assets or remove the references.

### `drizzle.config.json` Hardcoded Credentials
Contains `postgresql://postgres:postgres@127.0.0.1:5432/app_db`. Must use environment variable instead.

### `NEXT_PUBLIC_SITE_URL` Unused
Defined in `.env.example` but never read. `metadataBase` in `layout.tsx` is hardcoded to `https://nicholasyun.com`.

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
  - `LayoutShell.tsx` is dormant — do NOT wrap the app in it unless you integrate it.
  - `PortfolioApp.tsx` is in `src/app/`, not `src/components/` — import from `@/app/PortfolioApp`.
- **Styling**: Tailwind v4 with CSS variables from `globals.css`. Theme toggled via `data-theme` attribute.
- **Fonts**: `--font-editorial`/`--font-serif`/`--font-display` (Cormorant Garamond), `--font-body`/`--font-sans` (DM Sans), `--font-utility`/`--font-mono` (IBM Plex Mono). Body font is DM Sans, NOT Inter. Note: `--font-display` is NOT defined in `@theme` yet — use `--font-editorial` or `--font-serif` instead, or add the alias.
- **CSS Variables**: Always use the `--color-` prefix convention (e.g., `--color-border`, `--color-text-primary`).
- **Data**: Active data comes from `projects.ts`, `skills.ts`, `timeline.ts`. `data.ts` is dead code — do NOT import from it.
- **Types**: `Project` is defined in `types.ts` and re-exported from `projects.ts`. Import from `@/lib/projects` for project-related code (this is the pattern `ProjectCard` uses).

## Critical "Never" List
- **Never** use `border-radius` (unless explicitly requested for a specific non-UI element).
- **Never** use `any` in TypeScript.
- **Never** use Vite-specific features like `import.meta.glob`.
- **Never** add speculative "AI slop" or safe defaults (e.g., rounded cards, Inter-only typography).
- **Never** add `optimizeFonts` to `next.config.ts` (removed in Next.js 16).
- **Never** put `@import url()` after `@import "tailwindcss"` in `globals.css`.
- **Never** use class-based theme switching (`theme-night` / `theme-day`). Use `data-theme` attribute.
- **Never** use `db` from `@/db` without a null guard.
- **Never** access array indices without `?.` or `??` (enforced by `noUncheckedIndexedAccess`).
- **Never** import `PortfolioApp` from `@/components/PortfolioApp` — it's at `@/app/PortfolioApp`.
- **Never** type `react-error-boundary` fallback `error` prop as `Error` — it's `unknown`.
- **Never** import data from `@/lib/data` — it's dead code with stale section names.

## Outstanding Issues (Priority Order)

1. **Define 14 missing CSS variables in `@theme`** — Add `--font-display`, `--spacing-half`, `--spacing-quarter`, `--spacing-double`, `--transition-fast`, `--shadow-brutal`, `--shadow-brutal-sm`, `--color-text-inverse`, `--color-border-subtle`, `--color-bg-sunken`, `--color-bg-elevated`, `--color-error`, `--color-accent-subtle` with day-theme overrides.
2. **Fix hash routing section names** — Update `useRouteHash`'s `VALID_SECTIONS` to `["hero","about","projects","skills","experience","blog","terminal","contact"]`.
3. **Standardize theme target** — Use `<html>` consistently for `data-theme` across `ThemeScript` and `PortfolioApp`.
4. **Remove duplicate skip-link** — Keep in `layout.tsx` only.
5. **Delete dead code** — Remove `data.ts`, `content.ts`, `utils.ts`, `testimonials.ts`, `sounds.ts`, `useViewTransitions.ts`, `useWeightedScroll.ts` and unused dormant components.
6. **Reconcile CSS variable naming for dormant components** — If keeping any, add aliases or rewrite to use `--color-` prefix.
7. **Add portrait assets** — Place webp images in `public/portraits/`.
8. **Centralize contact info** — Export email/GitHub/LinkedIn from a single source instead of hardcoding in Footer, Terminal, and layout.tsx.
9. **Fix `drizzle.config.json`** — Use environment variable for database URL.
10. **Wire contact form** — Create `/api/contact` route or integrate third-party service.
11. **Consider re-enabling SSR** — Replace `ssr: false` with `Suspense` boundaries for SEO.
12. **Consume `useAccessibility()`** — Replace scattered `window.matchMedia` checks with the context hook from `AccessibilityProvider`.

## Lessons Learnt

1. **Verify npm versions before pinning** — The remediation specified versions that didn't exist on npm. Always check with `npm view <pkg> dist-tags`.
2. **CSS import order matters in Tailwind v4** — `@import url()` for fonts must precede `@import "tailwindcss"` which expands to `@layer` rules.
3. **`optimizeFonts` is gone in Next.js 16** — Font optimization is automatic; the config key no longer exists.
4. **`ssr: false` requires `"use client"`** — Next.js 16 enforces this at build time for Server Components.
5. **Null-safe DB access is mandatory** — Optional database means `db` can be `null`; always guard.
6. **Two design token systems = technical debt** — The shorthand and `--color-` prefix conventions must be reconciled before dormant components can be integrated.
7. **`noUncheckedIndexedAccess` catches real bugs** — Array index access returning `T | undefined` revealed 6+ places where runtime errors were possible. Always use `?.` or `??`.
8. **Undefined CSS variables fail silently** — `var(--font-display)` resolving to `unset` produces no error, no warning — the style just doesn't apply. Audit all `var()` references against `@theme` after any refactoring.
9. **`react-error-boundary` v4 changed `FallbackProps.error`** — From `Error` to `unknown`. Must use `instanceof Error` guard.
10. **File location matters for App Router imports** — `PortfolioApp.tsx` in `src/app/` must be imported as `@/app/PortfolioApp`, not `@/components/PortfolioApp`.
