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
- **Font Loading**: Google Fonts loaded via `@import url()` in `globals.css` (NOT `next/font`). Fonts must be imported BEFORE `@import "tailwindcss"` or the CSS optimizer rejects them.
- **`optimizeFonts`**: Removed in Next.js 16 — do NOT add to `next.config.ts`.

### Design System & Styling
- **Brutalist Enforcement**: `border-radius: 0px !important` is enforced globally.
- **28px Grid**: Layout is governed by a 28px mathematical backbone (`--spacing-grid` in `@theme`).
- **Typography Hierarchy**:
  - **Editorial**: `Cormorant Garamond` (Headings/Narrative) — `var(--font-display)`.
  - **Utility**: `IBM Plex Mono` (Labels/Machine Mode) — `var(--font-mono)`.
  - **Body**: `DM Sans` (General content, replaces Inter) — `var(--font-body)`.
- **Theme System**: Uses `data-theme="night"` / `data-theme="day"` on `<body>`. CSS selectors target `body[data-theme="night"]`. NOT class-based (`theme-night` / `theme-day`).
- **CSS Variable Naming**: The canonical convention uses `--color-` prefix (e.g., `--color-border`, `--color-text-primary`, `--color-bg`). Several dormant components use shorthand names (`--border-color`, `--text-primary`) that are NOT defined — see Gotchas.

### Architecture & Routing
- **Client-Side Orchestrator**: Most portfolio logic runs in `src/app/PortfolioApp.tsx` (Client Component with `"use client"`).
- **Entry Point**: `src/app/page.tsx` is a Client Component that dynamically imports `PortfolioApp` with `ssr: false`.
- **Hash Routing**: Preserved via `useRouteHash` hook (e.g., `#portfolio/slug`).
- **Static Content**: Portfolio content is managed as static TypeScript data in `src/lib/data.ts` and `src/lib/content.ts`.
- **Lazy Loading**: Below-the-fold sections use `React.lazy()` + `Suspense` for code splitting.
- **Error Boundaries**: Each section is wrapped in `ErrorBoundary` with fallback UI.

### Component Classification
**Active** (used by `PortfolioApp.tsx`): Navigation, HeroKinetic, SectionBlock, ErrorBoundary, AccessibilityProvider, BentoGrid, ProjectsSection, SkillsSection, Timeline, BlogSection, Terminal, ContactSection, Footer, ThemeSwitch, ScrollReveal.

**Dormant** (exist but not wired in): AboutFlow, ArchiveSpread, ArchiveItemCard, BentoTile, BrandMark, ClientOnly, CodeRain, ContentBody, DitherOverlay, GrainOverlay, LayoutShell, MachineOverlay, MobileDrawer, SocialIcon, ThemeToggle.

> Dormant components have **unresolved CSS variable references** and **undefined Tailwind classes**. They need remediation before integration — see Gotchas.

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

- **TypeScript Strict Mode**: No `any`, explicit types on all parameters/returns.
- **Early Returns**: Prefer early returns over nested conditionals.
- **Composition over Inheritance**: Favor wrapper classes and factory functions.

## Gotchas & Critical Warnings

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

### Missing Tailwind Utility Classes
Dormant components reference these undefined classes:
- `font-utility`, `font-editorial`, `font-body` — need `@theme` font family entries
- `z-grain`, `z-machine`, `z-mobile-backdrop`, `z-mobile-drawer` — need `@theme` z-index entries
- `animate-fade-in` — needs `@keyframes` + `@theme` animation entry

### Duplicate `Project` Type
Two incompatible `Project` interfaces exist:
- `src/lib/types.ts`: `{ title, category, accent, medium?, status, description, link?, linkLabel, slug, image?, body? }`
- `src/lib/projects.ts`: `{ id, title, description, tags, image?, github?, live?, featured? }`

`ProjectCard.tsx` imports from `@/lib/projects`. Do NOT import `Project` from `types.ts` for project-related code.

### Duplicate Skip-Link
Both `layout.tsx` and `PortfolioApp.tsx` render `<a href="#main-content" className="skip-link">`. Remove one — preferably keep in `layout.tsx` (server-rendered, always present).

### Database Null Safety
`src/db/index.ts` exports `db` as potentially `null`. Any API route using `db` must guard:
```typescript
if (!db) {
  return Response.json({ ok: false, error: "Database not configured" }, { status: 503 });
}
```

### `drizzle.config.json` Hardcoded Credentials
Contains `postgresql://postgres:postgres@127.0.0.1:5432/app_db`. Replace with `process.env.DATABASE_URL` or `.env` variable.

## Project-Specific Standards

### Visual Fidelity Checklist
- [x] WCAG AAA: skip link, focus-visible, reduced motion, sr-only utility
- [x] Dual theme with FOUC prevention script
- [x] Error boundaries per section
- [ ] 28px visible background grid (both themes)
- [ ] Kinetic typography: scroll velocity -> font-weight (200-950)
- [ ] Grain overlay (human fingerprint)
- [ ] Machine Mode overlay with terminal aesthetics
- [ ] Pointer parallax on hero portrait
- [ ] Portrait assets in `/public/portraits/`

### Environment Variables
| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | No (app runs without DB) |

## Remediation History

The following issues were identified and resolved during the v2.0 remediation pass:

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
