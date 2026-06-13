# Agent Instructions: Nicholas Yun Portfolio (v2.0)

This is a high-signal brief for agents working on "The Engineered Soul" portfolio.

## Core Identity
- **Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Drizzle ORM, PostgreSQL.
- **Aesthetic**: "Tactile Brutalism" + "High-End Editorial".
- **Primary Design Constraint**: **Zero border-radius** globally. Use the **28px mathematical grid** for all spacing.

## Current State

The project has passed the remediation phase. Build and typecheck pass cleanly. The SPA orchestrator (`PortfolioApp.tsx`) is implemented and wired into `page.tsx`. However, several dormant components from an earlier iteration exist in `src/components/` but are **not integrated** into the application — they have unresolved CSS variable references and undefined Tailwind classes.

**Active components** (wired in `PortfolioApp.tsx`): Navigation, HeroKinetic, SectionBlock, ErrorBoundary, AccessibilityProvider, BentoGrid, ProjectsSection, SkillsSection, Timeline, BlogSection, Terminal, ContactSection, Footer, ThemeSwitch, ScrollReveal.

**Dormant components** (exist but NOT wired): AboutFlow, ArchiveSpread, ArchiveItemCard, BentoTile, BrandMark, ClientOnly, CodeRain, ContentBody, DitherOverlay, GrainOverlay, LayoutShell, MachineOverlay, MobileDrawer, SocialIcon, ThemeToggle.

## Operational Gotchas

### CSS Import Order (Build-Breaking)
`globals.css` MUST have `@import url(...)` for Google Fonts BEFORE `@import "tailwindcss"`. Tailwind v4 expands to `@layer` rules, and CSS spec requires `@import` to precede all other rules. Wrong order causes build warnings and font loading failure.

### Two CSS Variable Naming Conventions (Visual Breakage Risk)
The `@theme` block in `globals.css` uses `--color-` prefix: `--color-border`, `--color-text-primary`, `--color-bg`, etc. Dormant components use shorthand names that **do not exist**: `--border-color`, `--text-primary`, `--bg-surface`, `--bg-primary`, `--bg-elevated`, `--text-secondary`, `--text-muted`, `--border-strong`, `--color-accent-code`, `--color-accent-poetry`. Before integrating any dormant component, you must either add aliases in `globals.css` or rewrite the component to use the `--color-` prefix.

### Missing Tailwind Utility Classes (Visual Breakage Risk)
Dormant components reference undefined classes: `font-utility`, `font-editorial`, `font-body` (font families), `z-grain`, `z-machine`, `z-mobile-backdrop`, `z-mobile-drawer` (z-index layers), `animate-fade-in` (animation). These need `@theme` entries in `globals.css` before the components will render correctly.

### `page.tsx` Is a Client Component
`src/app/page.tsx` has `"use client"` because it uses `next/dynamic` with `ssr: false`. This means the entire page is client-rendered — no SSR. Metadata from `layout.tsx` (Server Component) still works. If you re-enable SSR, remove `"use client"` from `page.tsx` and use `Suspense` boundaries instead.

### Theme System: `data-theme` Attribute, NOT Classes
Theme switching uses `data-theme="night"` / `data-theme="day"` on `<body>`. CSS selectors target `body[data-theme="night"]`. Do NOT use class-based theme switching (`theme-night`, `theme-day` on `<html>`). The FOUC-prevention script in `layout.tsx` sets `data-theme` on both `documentElement` and `body`, but CSS only targets `body[data-theme]`.

### Database Is Optional
`src/db/index.ts` exports `db` which can be `null` if `DATABASE_URL` is not set. Any API route using `db` must include a null guard. The health endpoint (`/api/health`) returns 503 when DB is unavailable.

### Duplicate Skip-Link
Both `layout.tsx` and `PortfolioApp.tsx` render a skip-to-content link. Remove the duplicate — keep it in `layout.tsx` only.

### Duplicate `Project` Type
`src/lib/types.ts` and `src/lib/projects.ts` export incompatible `Project` interfaces. `ProjectCard.tsx` imports from `@/lib/projects`. Do NOT use `Project` from `types.ts` for project data.

### Contact Form Is Simulated
`ContactSection.tsx` uses `setTimeout` to mock form submission. No API route exists. Replace with a real endpoint before production.

### Missing Portrait Assets
`src/lib/data.ts` references `/portraits/*.webp` files that don't exist in `public/`. Either add the assets or remove the references.

### Inconsistent Contact Info
- Email: `nicholas@example.com` (data.ts) vs `hello@nicholasyun.com` (Terminal, Footer)
- GitHub: `nicholasyun` (data.ts) vs `nordeim` (Footer, projects.ts)

### `drizzle.config.json` Hardcoded Credentials
Contains `postgresql://postgres:postgres@127.0.0.1:5432/app_db`. Must use environment variable instead.

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
- **Styling**: Tailwind v4 with CSS variables from `globals.css`. Theme toggled via `data-theme` attribute on `<body>`.
- **Fonts**: `--font-display` (Cormorant Garamond), `--font-body` (DM Sans), `--font-mono` (IBM Plex Mono). Body font is DM Sans, NOT Inter.
- **CSS Variables**: Always use the `--color-` prefix convention (e.g., `--color-border`, `--color-text-primary`).

## Critical "Never" List
- **Never** use `border-radius` (unless explicitly requested for a specific non-UI element).
- **Never** use `any` in TypeScript.
- **Never** use Vite-specific features like `import.meta.glob`.
- **Never** add speculative "AI slop" or safe defaults (e.g., rounded cards, Inter-only typography).
- **Never** add `optimizeFonts` to `next.config.ts` (removed in Next.js 16).
- **Never** put `@import url()` after `@import "tailwindcss"` in `globals.css`.
- **Never** use class-based theme switching (`theme-night` / `theme-day`). Use `data-theme` attribute.
- **Never** use `db` from `@/db` without a null guard.

## Outstanding Issues (Priority Order)

1. **Reconcile CSS variable naming** — Define aliases or standardize on `--color-` prefix across all components.
2. **Add missing Tailwind tokens** — `font-utility`, `font-editorial`, `font-body`, `z-grain`, `z-machine`, `z-mobile-backdrop`, `z-mobile-drawer`, `animate-fade-in` in `@theme`.
3. **Consolidate `Project` type** — Merge into a single canonical definition in `types.ts`.
4. **Integrate or delete dormant components** — 10+ unused components create confusion.
5. **Remove duplicate skip-link** — Keep in `layout.tsx` only.
6. **Add portrait assets** — Place webp images in `public/portraits/`.
7. **Standardize contact info** — Use consistent email and GitHub URLs.
8. **Fix `drizzle.config.json`** — Use environment variable for database URL.
9. **Wire contact form** — Create `/api/contact` route or integrate third-party service.
10. **Consider re-enabling SSR** — Replace `ssr: false` with `Suspense` boundaries for SEO.

## Lessons Learnt

1. **Verify npm versions before pinning** — The remediation specified versions that didn't exist on npm. Always check with `npm view <pkg> dist-tags`.
2. **CSS import order matters in Tailwind v4** — `@import url()` for fonts must precede `@import "tailwindcss"` which expands to `@layer` rules.
3. **`optimizeFonts` is gone in Next.js 16** — Font optimization is automatic; the config key no longer exists.
4. **`ssr: false` requires `"use client"`** — Next.js 16 enforces this at build time for Server Components.
5. **Null-safe DB access is mandatory** — Optional database means `db` can be `null`; always guard.
6. **Two design token systems = technical debt** — The shorthand and `--color-` prefix conventions must be reconciled before dormant components can be integrated.
