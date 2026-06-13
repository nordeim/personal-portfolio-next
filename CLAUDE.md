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
- **Server Components**: Default to Server Components; use `'use client'` only for interactivity. Exception: `page.tsx` is `"use client"` because it uses `next/dynamic` with `ssr: false`.
- **Metadata API**: Use `generateMetadata` and `export const metadata` in `layout.tsx`.
- **Font Loading**: Google Fonts loaded via `<link>` tags in `layout.tsx` `<head>` (preconnect + stylesheet). The `@import url()` approach in `globals.css` also works but MUST come before `@import "tailwindcss"`.
- **`optimizeFonts`**: Removed in Next.js 16 — do NOT add to `next.config.ts`.

### Design System & Styling
- **Brutalist Enforcement**: `border-radius: 0px !important` is enforced globally.
- **28px Grid**: Layout is governed by a 28px mathematical backbone (`--spacing-grid` in `@theme`).
- **Typography Hierarchy**:
  - **Editorial**: `Cormorant Garamond` (Headings/Narrative) — `var(--font-editorial)` / `var(--font-serif)` / `var(--font-display)`.
  - **Utility**: `IBM Plex Mono` (Labels/Machine Mode) — `var(--font-utility)` / `var(--font-mono)`.
  - **Body**: `DM Sans` (General content, replaces Inter) — `var(--font-body)` / `var(--font-sans)`.
- **Theme System**: Uses `data-theme="night"` / `data-theme="day"`. CSS selectors target `[data-theme="day"]`. NOT class-based (`theme-night` / `theme-day`).
- **CSS Variable Naming**: The canonical convention uses `--color-` prefix (e.g., `--color-border`, `--color-text-primary`, `--color-bg`). Dormant components use shorthand names (`--border-color`, `--text-primary`) that are NOT defined — see Gotchas.

### Architecture & Routing
- **Client-Side Orchestrator**: Most portfolio logic runs in `src/app/PortfolioApp.tsx` (Client Component with `"use client"`). Note: this file is in `src/app/`, NOT `src/components/`.
- **Entry Point**: `src/app/page.tsx` is a Client Component that dynamically imports `PortfolioApp` from `@/app/PortfolioApp` with `ssr: false`. Uses `react-error-boundary` (not the custom `ErrorBoundary` component).
- **Hash Routing**: Preserved via `useRouteHash` hook — but `VALID_SECTIONS` is currently **out of sync** with actual section IDs. See Gotchas.
- **Static Content**: Active data comes from `src/lib/projects.ts`, `src/lib/skills.ts`, `src/lib/timeline.ts`. The file `src/lib/data.ts` is **dead code** (never imported by active components).
- **Lazy Loading**: Below-the-fold sections use `React.lazy()` + `Suspense` for code splitting.
- **Error Boundaries**: Two systems coexist — `react-error-boundary` at the page level (`page.tsx`) and a custom class-based `ErrorBoundary` per section (in `PortfolioApp.tsx`).

### Component Classification
**Active** (18, used by `PortfolioApp.tsx`): Navigation, HeroKinetic, SectionBlock, ErrorBoundary, AccessibilityProvider, BentoGrid, ProjectsSection, ProjectCard, SkillsSection, Timeline, BlogSection, Terminal, ContactSection, Footer, ThemeSwitch, ScrollReveal, ThemeScript.

**Dormant** (14, exist but NOT wired in): AboutFlow, ArchiveSpread, ArchiveItemCard, BentoTile, BrandMark, ClientOnly, CodeRain, ContentBody, DitherOverlay, GrainOverlay, LayoutShell, MachineOverlay, MobileDrawer, SocialIcon, ThemeToggle.

> Dormant components have **unresolved CSS variable references** and **undefined Tailwind classes**. They need remediation before integration — see Gotchas. ~40% of the codebase is dormant.

### Type System
- **`Project` type consolidated** — Single canonical definition in `src/lib/types.ts`, re-exported from `src/lib/projects.ts`. Fields: `id`, `title`, `description`, `role`, `period`, `category`, `tech` (readonly string[]), `links: ProjectLink` (with `live?` and `repo?`), `image?`, `featured?`.
- **Dormant types in `types.ts`**: `AboutPillar`, `ParsedCollectionItem`, `Collection`, `ParsedPortfolioItem`, `MachineOverlayData`, `SocialIconVariant` — only imported by dormant components.
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

> Database is **optional**. Without `DATABASE_URL`, the app runs normally — DB features are disabled gracefully (returns 503 on `/api/health`).

## Testing Strategy

- **Test-Driven Development**: Write failing tests first; test behavior, not implementation.
- **Command**: `npm test`

## Code Quality Standards

- **TypeScript Strict Mode**: No `any`, explicit types on all parameters/returns. `noUncheckedIndexedAccess: true` enabled.
- **Early Returns**: Prefer early returns over nested conditionals.
- **Composition over Inheritance**: Favor wrapper classes and factory functions.

## Gotchas & Critical Warnings

### 14 Undefined CSS Variables in Active Components
Active components reference these variables via `var(--*)` that are **NOT defined** in `@theme`, causing them to resolve to `unset` at runtime:

| Variable | Used In | Expected Value |
|----------|---------|----------------|
| `--font-display` | HeroKinetic, Timeline, BlogSection, ContactSection, BentoGrid, ProjectCard | Alias for `--font-editorial` |
| `--spacing-double` | HeroKinetic, SectionBlock, ProjectsSection, ContactSection | `56px` (2 × grid) |
| `--spacing-half` | Navigation, ProjectsSection, SkillsSection, Timeline, ContactSection, ThemeSwitch, Terminal, BentoGrid, ErrorBoundary | `14px` (grid / 2) |
| `--spacing-quarter` | Navigation, ProjectsSection, SkillsSection, Timeline, ContactSection, ThemeSwitch, ErrorBoundary | `7px` (grid / 4) |
| `--transition-fast` | Navigation, HeroKinetic, ProjectsSection, ProjectCard, ThemeSwitch, ContactSection, Footer, BentoGrid | e.g., `150ms ease` |
| `--shadow-brutal` | HeroKinetic, ContactSection, Terminal | e.g., `4px 4px 0 0 var(--color-border-strong)` |
| `--shadow-brutal-sm` | SkillsSection, ProjectCard, BentoGrid | e.g., `2px 2px 0 0 var(--color-border)` |
| `--color-text-inverse` | HeroKinetic, ProjectsSection, ProjectCard, ContactSection | Inverse of `--color-text-primary` |
| `--color-border-subtle` | Navigation, HeroKinetic, ProjectsSection, ProjectCard, SkillsSection, BlogSection | Lighter than `--color-border` |
| `--color-bg-sunken` | ProjectCard, ContactSection, Terminal | Darker than `--color-bg` |
| `--color-bg-elevated` | Terminal, ErrorBoundary | Lighter than `--color-surface` |
| `--color-error` | ContactSection, Terminal, ErrorBoundary | Red for error states |
| `--color-accent-subtle` | ContactSection | Low-opacity accent |

**These need to be added to `@theme` in `globals.css` with day-theme overrides.**

### Hash Routing Mismatch (Functional Breakage)
`useRouteHash` validates `VALID_SECTIONS = ["hero","who","work","skills","music","now","contact"]` but `PortfolioApp` renders sections with IDs `["hero","about","projects","skills","experience","blog","terminal","contact"]`. Only `hero`, `skills`, and `contact` match. This breaks `aria-current` indicators and active link highlighting for most sections. Update `VALID_SECTIONS` to match.

### Theme Target Inconsistency
- `ThemeScript` (in `layout.tsx`) sets `data-theme` on `document.documentElement` (`<html>`)
- `PortfolioApp` sets `data-theme` on `document.body`
- CSS `[data-theme="day"]` only matches the element it's set on
- **Pick one target and use it consistently.** Recommendation: use `<html>` (which ThemeScript already targets).

### CSS Import Order (MUST follow)
```
/* CORRECT order in globals.css: */
@import url("...fonts...");   /* 1. External font imports FIRST */
@import "tailwindcss";        /* 2. Tailwind second (expands to @layer rules) */

/* WRONG — will cause build warning and font loading failure: */
@import "tailwindcss";
@import url("...fonts...");   /* @import must precede all rules */
```

### Two CSS Variable Naming Conventions
The `@theme` block defines variables with `--color-` prefix:
- `--color-border`, `--color-text-primary`, `--color-bg`, `--color-surface`, etc.

Dormant components use shorthand names that **do not exist**:
- `--border-color`, `--text-primary`, `--bg-surface`, `--bg-primary`, `--bg-elevated`, `--text-secondary`, `--text-muted`, `--border-strong`, `--color-accent-code`, `--color-accent-poetry`

**Before integrating any dormant component**, either define aliases in `globals.css` or rewrite the component to use the `--color-` prefix convention.

### Missing Tailwind Utility Classes (Dormant Components)
Dormant components reference these classes. `@theme` now has corresponding `--font-*` and `--z-index-*` entries, but verify Tailwind v4 mapping works:
- `font-editorial`, `font-utility`, `font-body` — mapped from `--font-editorial`, `--font-utility`, `--font-body`
- `z-grain`, `z-machine`, `z-mobile-backdrop`, `z-mobile-drawer` — mapped from `--z-index-grain`, etc.

### Duplicate Skip-Link
Both `layout.tsx` and `PortfolioApp.tsx` render `<a href="#main-content" className="skip-link">`. Remove one — preferably keep in `layout.tsx` (server-rendered, always present).

### `PortfolioApp.tsx` Location
`PortfolioApp.tsx` lives in `src/app/`, NOT `src/components/`. The import in `page.tsx` must be `@/app/PortfolioApp`. Do NOT move it to `src/components/` — the App Router co-locates it with the route.

### `react-error-boundary` v4 Type Change
`FallbackProps.error` is typed as `unknown`, not `Error`. Custom fallback components must use `error: unknown` and guard with `instanceof Error` to access `.message`.

### Database Null Safety
`src/db/index.ts` exports `db` as potentially `null`. Any API route using `db` must guard:
```typescript
if (!db) {
  return Response.json({ ok: false, error: "Database not configured" }, { status: 503 });
}
```

### `drizzle.config.json` Hardcoded Credentials
Contains `postgresql://postgres:postgres@127.0.0.1:5432/app_db`. Replace with `process.env.DATABASE_URL` or `.env` variable.

### Dead Code
The following files are never imported by any active component and should be deleted or integrated:
- **Lib**: `data.ts`, `content.ts`, `utils.ts`, `testimonials.ts`, `sounds.ts`
- **Hooks**: `useViewTransitions.ts`, `useWeightedScroll.ts`
- **Components**: All 14 dormant components listed above

## Project-Specific Standards

### Visual Fidelity Checklist
- [x] WCAG AAA: skip link, focus-visible, reduced motion, sr-only utility
- [x] Dual theme with FOUC prevention script
- [x] Error boundaries per section
- [x] Consolidated `Project` type with `noUncheckedIndexedAccess`
- [x] Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [x] OG/Twitter metadata + JSON-LD structured data
- [ ] 28px visible background grid (both themes)
- [ ] Kinetic typography: scroll velocity -> font-weight (200-950)
- [ ] Grain overlay (human fingerprint)
- [ ] Machine Mode overlay with terminal aesthetics
- [ ] Pointer parallax on hero portrait
- [ ] Portrait assets in `/public/portraits/`
- [ ] 14 missing CSS variables defined in `@theme`
- [ ] Hash routing section names aligned with actual section IDs

### Environment Variables
| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | No (app runs without DB) |
| `NEXT_PUBLIC_SITE_URL` | Site URL for metadata | No (currently unused; `metadataBase` is hardcoded) |

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
