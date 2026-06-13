I'll begin by cloning the repository and systematically reading through all the key documentation files to build a deep understanding of the project before planning the audit.

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user && git clone https://github.com/nordeim/personal-portfolio-next.git 2>&1"}}
</tool_call>
<tool_result>
Cloning into 'personal-portfolio-next'...
remote: Enumerating objects: 919, done.
remote: Counting objects: 100% (382/382), done.
remote: Compressing objects: 100% (215/215), done.
remote: Total 919 (delta 202), reused 310 (delta 164), pack-reused 537 (from 1)
Receiving objects: 100% (919/919), 880.12 KiB | 7.21 MiB/s, done.
Resolving deltas: 100% (452/452), done.
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && find . -maxdepth 1 -type f -name '*.md' | sort"}}
</tool_call>
<tool_result>
./AGENT.md
./CLAUDE.md
./README.md
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && find . -type f -name '*.md' | sort"}}
</tool_call>
<tool_result>
./AGENT.md
./CLAUDE.md
./README.md
./docs/Code_Review_Report_4.md
./docs/brutalist-portfolio-nextjs_SKILL_v4.md
./docs/remediation_1.md
./docs/remediation_2.md
./docs/remediation_3.md
./docs/remediation_4.md
./docs/status_4.md
</tool_result>

Now let me read all the key documentation files:

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat CLAUDE.md"}}
</tool_call>
<tool_result>
# CLAUDE.md — The Engineered Soul (v2.0)

This document is the canonical source of truth for the architectural and operational constraints of the Nicholas Yun portfolio. It must be read before any modification or generation task.

## The Design Philosophy: The Engineered Soul

The project's aesthetic is **Tactile Brutalism** balanced with **High-End Editorial** design. It is not a "website"; it is a "digital installation."

### Core Visual Axioms

1.  **Zero Border Radius**: `border-radius: 0` everywhere. The design language is built on rigid, geometric forms. No soft edges, no pills, no rounded corners—anywhere.
2.  **Visible Structure**: A 28px mathematical grid is visible in the background. All spacing, padding, and alignment must adhere to this underlying structure.
3.  **Grid Paper Overlay**: The background must feature a faint grid overlay that reinforces the architectural blueprint aesthetic. The effect is subtle but present—it should evoke a drafting table or a terminal, not a blank canvas.
4.  **High-Contrast Dark Mode**: The primary theme is a high-contrast dark mode. The background is a deep, near-black (e.g., `#0d0d0d`), with a single, sharp accent color (e.g., `#e8c547` or `#3b82f6`) and clean white or cream text for high readability.
5.  **Typographic Hierarchy**: Use a pairing of a distinctive serif or display font (like *Cormorant Garamond* or *Playfair Display*) for large headings and a clean monospaced font (like *IBM Plex Mono* or *JetBrains Mono*) for labels, stats, and code-like text.

## Architectural Blueprint

### The SPA Orchestrator Model

The entire front-end is a **single-page application (SPA)** orchestrator embedded within the Next.js App Router.

*   **`src/app/PortfolioApp.tsx`**: This is the client-side "conductor." It renders a persistent shell (a full-screen terminal layout with a title bar and a draggable status window) and conditionally renders the active section. It is **not** a standard Next.js page; it is the heart of the SPA.
*   **`page.tsx`**: The Next.js entry point is a simple Client Component (`"use client"`) that dynamically imports `PortfolioApp.tsx` with `ssr: false`. This is intentional.
*   **Hash-Based Routing**: Navigation is handled by a custom `useRouteHash` hook that listens for changes in `window.location.hash`. This avoids React Router and keeps the application feeling like a native desktop application with view switching, not a multi-page website.

### Server-Side Architecture

*   **API Routes**: `src/app/api/contact/route.ts` handles form submissions. It includes basic server-side validation, an in-memory rate limiter, and a placeholder for email delivery.
*   **Database (Optional)**: A Drizzle ORM setup connects to a PostgreSQL database. The database is an **optional feature**; the application must run gracefully without it (e.g., health checks degrade to a non-DB version).
*   **Health Check**: `src/app/api/health/route.ts` provides a liveness probe that verifies both the application status and (optionally) database connectivity.

### Data Strategy

*   **Static TypeScript Arrays**: All portfolio data (projects, skills, timeline, terminal commands) is stored as typed arrays in `src/lib/`. This is a deliberate choice: the data is simple, changes rarely, and benefits from type safety without the overhead of a database query or file system read at runtime.
*   **Optional Database**: The PostgreSQL integration is for future features (like analytics or a blog) and is explicitly optional. The app must never fail to start due to a missing `DATABASE_URL`.

## Key Architectural Decisions

1.  **SPA over MPA**: The portfolio is a single, immersive experience, not a collection of separate pages. The hash-based routing and persistent shell reinforce this.
2.  **`ssr: false` is Intentional**: The `PortfolioApp` relies on browser APIs (`localStorage`, `window.location.hash`) from the very first render. SSR is disabled to avoid hydration mismatches and to preserve the "native desktop application" feel.
3.  **No React Router**: The custom `useRouteHash` hook is simpler and more aligned with the project's SPA philosophy than a full routing library.
4.  **Static Data First**: For a portfolio, static data is faster, simpler, and more reliable than a database. The optional DB is for future expansion, not core functionality.
5.  **Tailwind v4 CSS-First**: All design tokens (colors, fonts, spacing, etc.) are defined in `globals.css` using the `@theme` directive. This is the single source of truth for the visual system. **Do not use `tailwind.config.ts` for design tokens.**
6.  **Theme Duality**: The application supports a Day (cream) and Night (dark) theme, toggled via `data-theme` on the `<html>` element. All colors are defined as CSS custom properties in `globals.css` with overrides for each theme.

## What You Must Never Do

*   **Do not** use `border-radius` > 0. Anywhere. For any reason.
*   **Do not** introduce `react-router`, `next/navigation` (for routing), or any other routing library. The hash-based system is the project's standard.
*   **Do not** modify the `PortfolioApp.tsx` shell structure (the `.terminal-window`, `.title-bar`, `.status-bar`, `.content-area`) without explicit instruction. It is the core of the user experience.
*   **Do not** use Tailwind `@apply` directives for simple, one-off styles. Use inline utility classes or `globals.css` for global tokens.
*   **Do not** use generic, off-the-shelf component libraries (e.g., Shadcn, Radix) without a full audit of their default styles to ensure they don't violate the core visual axioms.
*   **Do not** change the fundamental architecture (SPA orchestrator, hash routing, static data) without a formal proposal.
*   **Do not** use `next/image` for portraits. The design calls for specific aspect ratios and styling that are easier to control with a standard `<img>` tag or a custom component.
*   **Do not** add `border-radius` to the scrollbar. The scrollbar is a structural element and must have `border-radius: 0`.

## API Design Notes

### Contact Form (`POST /api/contact`)

The contact endpoint accepts a JSON body with the following fields:

```typescript
interface ContactFormBody {
  name: string;
  email: string;
  message: string;
}
```

*   **Validation**: Server-side validation checks for presence and basic format.
*   **Rate Limiting**: An in-memory, per-IP sliding window rate limiter is active (5 requests per 60 seconds).
*   **Response**: The endpoint returns a `ContactApiResponse` discriminated union (`{ success: true, message: string }` | `{ success: false, error: string }`).
*   **Delivery**: Currently logs to the server console. Must be integrated with an email service (e.g., Resend) before production use.

### Health Check (`GET /api/health`)

*   Returns `{ status: 'ok', db: true/false }`.
*   The `db` field is `true` if `DATABASE_URL` is set and the connection is healthy; `false` otherwise.
*   This endpoint is unauthenticated and is intended for use by deployment platforms (e.g., Vercel, Render).
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat AGENT.md"}}
</tool_call>
<tool_result>
# AGENT.md — The Engineered Soul (v2.0)

You are an expert full-stack engineer. Your task is to build a personal portfolio website for Nicholas Yun, a software engineer. The portfolio should be a high-end, avant-garde digital installation that is both visually striking and technically sound.

## The Design Philosophy: The Engineered Soul

The project's aesthetic is **Tactile Brutalism** balanced with **High-End Editorial** design. It is not a "website"; it is a "digital installation."

### Core Visual Axioms

1.  **Zero Border Radius**: `border-radius: 0` everywhere. The design language is built on rigid, geometric forms. No soft edges, no pills, no rounded corners—anywhere.
2.  **Visible Structure**: A 28px mathematical grid is visible in the background. All spacing, padding, and alignment must adhere to this underlying structure.
3.  **Grid Paper Overlay**: The background must feature a faint grid overlay that reinforces the architectural blueprint aesthetic. The effect is subtle but present—it should evoke a drafting table or a terminal, not a blank canvas.
4.  **High-Contrast Dark Mode**: The primary theme is a high-contrast dark mode. The background is a deep, near-black (e.g., `#0d0d0d`), with a single, sharp accent color (e.g., `#e8c547` or `#3b82f6`) and clean white or cream text for high readability.
5.  **Typographic Hierarchy**: Use a pairing of a distinctive serif or display font (like *Cormorant Garamond* or *Playfair Display*) for large headings and a clean monospaced font (like *IBM Plex Mono* or *JetBrains Mono*) for labels, stats, and code-like text.

## Architectural Blueprint

### The SPA Orchestrator Model

The entire front-end is a **single-page application (SPA)** orchestrator embedded within the Next.js App Router.

*   **`src/app/PortfolioApp.tsx`**: This is the client-side "conductor." It renders a persistent shell (a full-screen terminal layout with a title bar and a draggable status window) and conditionally renders the active section. It is **not** a standard Next.js page; it is the heart of the SPA.
*   **`page.tsx`**: The Next.js entry point is a simple Client Component (`"use client"`) that dynamically imports `PortfolioApp.tsx` with `ssr: false`. This is intentional.
*   **Hash-Based Routing**: Navigation is handled by a custom `useRouteHash` hook that listens for changes in `window.location.hash`. This avoids React Router and keeps the application feeling like a native desktop application with view switching, not a multi-page website.

### Server-Side Architecture

*   **API Routes**: `src/app/api/contact/route.ts` handles form submissions. It includes basic server-side validation, an in-memory rate limiter, and a placeholder for email delivery.
*   **Database (Optional)**: A Drizzle ORM setup connects to a PostgreSQL database. The database is an **optional feature**; the application must run gracefully without it (e.g., health checks degrade to a non-DB version).
*   **Health Check**: `src/app/api/health/route.ts` provides a liveness probe that verifies both the application status and (optionally) database connectivity.

### Data Strategy

*   **Static TypeScript Arrays**: All portfolio data (projects, skills, timeline, terminal commands) is stored as typed arrays in `src/lib/`. This is a deliberate choice: the data is simple, changes rarely, and benefits from type safety without the overhead of a database query or file system read at runtime.
*   **Optional Database**: The PostgreSQL integration is for future features (like analytics or a blog) and is explicitly optional. The app must never fail to start due to a missing `DATABASE_URL`.

## Key Architectural Decisions

1.  **SPA over MPA**: The portfolio is a single, immersive experience, not a collection of separate pages. The hash-based routing and persistent shell reinforce this.
2.  **`ssr: false` is Intentional**: The `PortfolioApp` relies on browser APIs (`localStorage`, `window.location.hash`) from the very first render. SSR is disabled to avoid hydration mismatches and to preserve the "native desktop application" feel.
3.  **No React Router**: The custom `useRouteHash` hook is simpler and more aligned with the project's SPA philosophy than a full routing library.
4.  **Static Data First**: For a portfolio, static data is faster, simpler, and more reliable than a database. The optional DB is for future expansion, not core functionality.
5.  **Tailwind v4 CSS-First**: All design tokens (colors, fonts, spacing, etc.) are defined in `globals.css` using the `@theme` directive. This is the single source of truth for the visual system. **Do not use `tailwind.config.ts` for design tokens.**
6.  **Theme Duality**: The application supports a Day (cream) and Night (dark) theme, toggled via `data-theme` on the `<html>` element. All colors are defined as CSS custom properties in `globals.css` with overrides for each theme.

## What You Must Never Do

*   **Do not** use `border-radius` > 0. Anywhere. For any reason.
*   **Do not** introduce `react-router`, `next/navigation` (for routing), or any other routing library. The hash-based system is the project's standard.
*   **Do not** modify the `PortfolioApp.tsx` shell structure (the `.terminal-window`, `.title-bar`, `.status-bar`, `.content-area`) without explicit instruction. It is the core of the user experience.
*   **Do not** use Tailwind `@apply` directives for simple, one-off styles. Use inline utility classes or `globals.css` for global tokens.
*   **Do not** use generic, off-the-shelf component libraries (e.g., Shadcn, Radix) without a full audit of their default styles to ensure they don't violate the core visual axioms.
*   **Do not** change the fundamental architecture (SPA orchestrator, hash routing, static data) without a formal proposal.
*   **Do not** use `next/image` for portraits. The design calls for specific aspect ratios and styling that are easier to control with a standard `<img>` tag or a custom component.
*   **Do not** add `border-radius` to the scrollbar. The scrollbar is a structural element and must have `border-radius: 0`.

## API Design Notes

### Contact Form (`POST /api/contact`)

The contact endpoint accepts a JSON body with the following fields:

```typescript
interface ContactFormBody {
  name: string;
  email: string;
  message: string;
}
```

*   **Validation**: Server-side validation checks for presence and basic format.
*   **Rate Limiting**: An in-memory, per-IP sliding window rate limiter is active (5 requests per 60 seconds).
*   **Response**: The endpoint returns a `ContactApiResponse` discriminated union (`{ success: true, message: string }` | `{ success: false, error: string }`).
*   **Delivery**: Currently logs to the server console. Must be integrated with an email service (e.g., Resend) before production use.

### Health Check (`GET /api/health`)

*   Returns `{ status: 'ok', db: true/false }`.
*   The `db` field is `true` if `DATABASE_URL` is set and the connection is healthy; `false` otherwise.
*   This endpoint is unauthenticated and is intended for use by deployment platforms (e.g., Vercel, Render).
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat docs/status_4.md"}}
</tool_call>
<tool_result>
# Status Report — The Engineered Soul (v2.0)

## Executive Summary

The portfolio project has been systematically upgraded across four remediation phases. All critical issues identified in the initial audit have been resolved. The project is in a **stable, buildable state** with passing TypeScript checks, ESLint compliance, and a clean production build.

## Phase Status

| Phase | Status | Key Deliverables |
| --- | --- | --- |
| **0: Design System** | Complete | `globals.css` with `@theme` tokens, day/night theme overrides, keyframes |
| **1: Core Logic** | Complete | Hooks (`useRouteHash`, `useReducedMotion`) |
| **2: Components** | Complete | 17 active + 14 archived components |
| **3: Data Layer** | Complete | Static content arrays, consolidated `Project` type, Drizzle schema |
| **4: Orchestration** | Complete | `PortfolioApp.tsx` with ErrorBoundary + Suspense wrapping per section |
| **5: Entry Point** | Complete | `page.tsx` with client-side dynamic import + `react-error-boundary` |
| **6: Remediation 1** | Complete | 40 files updated, build errors resolved, typecheck passing |
| **7: Remediation 2** | Complete | 14 files updated, `Project` type consolidated, `noUncheckedIndexedAccess` enabled, 34 type errors resolved |
| **8: Remediation 3** | Complete | All 14 missing CSS variables defined, hash routing aligned, theme target unified, system preference detection added, site config centralized, contact API with rate limiting, dead code archived |
| **9: Remediation 4** | Complete | Scrollbar border-radius fixed, Drizzle config converted to TS, env example created, discriminated union for API responses, removed unused `prefersHighContrast`, `useReducedMotion` adopted in animation components, WCAG AA contrast ratios fixed, focus management added to `useRouteHash`, ARIA attributes verified |

## Active Components (17)

1. `ContactForm.tsx` — Server-validated contact form with loading/error states
2. `ErrorBoundary.tsx` — Global error fallback component
3. `Footer.tsx` — Footer with social links from `site-config.ts`
4. `GrainOverlay.tsx` — Film grain texture effect (CSS-only)
5. `GridBackground.tsx` — 28px visible mathematical grid
6. `HeroKinetic.tsx` — Hero section with kinetic text animation (respects `prefers-reduced-motion`)
7. `LoadingState.tsx` — Terminal-style loading animation
8. `Navigation.tsx` — Hash-based navigation with `aria-current` indicators
9. `ScrollReveal.tsx` — IntersectionObserver-based reveal animation (respects `prefers-reduced-motion`)
10. `SectionHeading.tsx` — Standardized section header with `id` for hash routing and focus management
11. `ShowcaseCard.tsx` — Project card with tech stack display
12. `SkillBar.tsx` — Animated skill proficiency bar
13. `SkillsGrid.tsx` — Grid layout for skills by category
14. `Terminal.tsx` — Interactive terminal component with command history
15. `Timeline.tsx` — Vertical timeline with alternating layout
16. `TitleBar.tsx` — macOS-style window chrome
17. `WindowControls.tsx` — Traffic light window controls (close/minimize/maximize)

## Database Schema (Drizzle ORM)

### Contact Submissions
- `id` (serial, PK)
- `name` (text, not null)
- `email` (text, not null)
- `message` (text, not null)
- `created_at` (timestamp, default now)

### Analytics
- `id` (serial, PK)
- `page` (text, not null)
- `referrer` (text, nullable)
- `user_agent` (text, nullable)
- `created_at` (timestamp, default now)

### Users
- `id` (serial, PK)
- `email` (text, unique, not null)
- `name` (text, not null)
- `created_at` (timestamp, default now)

## Build Verification

```bash
npm run typecheck  # TypeScript validation (runs before build) — PASSING
npm run lint       # ESLint check — PASSING
npm run build      # Production build (runs typecheck + next build) — PASSING
```

## Environment Configuration

```env
# Optional — app runs without it
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat docs/Code_Review_Report_4.md"}}
</tool_call>
<tool_result>
# Code Review Report — Remediation 4

## Summary

This report documents the fourth and final remediation phase for "The Engineered Soul" portfolio project. The focus was on final polish, accessibility hardening, and eliminating the last class of build warnings and type safety gaps.

## Changes Made

### 1. Scrollbar Border Radius Fix
- **File**: `src/app/globals.css`
- **Issue**: The scrollbar pseudo-elements had `border-radius: 3px`, violating the project's core "zero border-radius" axiom.
- **Fix**: Changed to `border-radius: 0` on both `::-webkit-scrollbar-thumb` and `::-webkit-scrollbar-track`.
- **Impact**: Restores brutalist consistency on all scrollbar renders.

### 2. Drizzle Config Conversion
- **File**: `drizzle.config.ts` (was `drizzle.config.json`)
- **Issue**: The JSON config had hardcoded credentials (`postgres:postgres`) in plaintext.
- **Fix**: Converted to TypeScript config that reads `process.env.DATABASE_URL`. Throws a descriptive error if the variable is missing.
- **Impact**: Eliminates security risk; aligns with `.env.example` pattern.

### 3. Environment Example File
- **File**: `.env.example`
- **Issue**: No documentation of required/optional environment variables.
- **Fix**: Created `.env.example` with commented descriptions for all variables.
- **Impact**: Simplifies onboarding for new developers.

### 4. ContactApiResponse Discriminated Union
- **File**: `src/lib/types.ts`, `src/app/api/contact/route.ts`
- **Issue**: The contact API response was untyped, allowing access to `error` on success and `message` on error.
- **Fix**: Added `ContactApiResponse = ContactApiSuccess | ContactApiError` with a `success` discriminant field. Updated the route to return the correct branch.
- **Impact**: Enables TypeScript narrowing. `if (data.success)` now correctly narrows to `ContactApiSuccess`.

### 5. Removed `prefersHighContrast`
- **File**: `src/components/AccessibilityProvider.tsx`
- **Issue**: `prefersHighContrast` was defined in the provider but never consumed by any component. No high-contrast color palette existed.
- **Fix**: Removed the property entirely. Simplified the provider to expose only `prefersReducedMotion`.
- **Impact**: Eliminates dead API surface that implied functionality that didn't work.

### 6. `useReducedMotion` Adoption
- **Files**: `src/components/HeroKinetic.tsx`, `src/components/ScrollReveal.tsx`
- **Issue**: Both components had inline `window.matchMedia('(prefers-reduced-motion: reduce)')` checks instead of using the centralized `useReducedMotion` hook.
- **Fix**: Replaced inline media queries with `useReducedMotion()` hook imports.
- **Impact**: Centralizes motion preference logic; ensures consistent behavior across all animated components.

### 7. WCAG AA Contrast Ratios
- **File**: `src/app/globals.css`
- **Issue**: `--color-text-muted` values failed WCAG AA in both themes:
  - Night: `#6b6560` on `#0d0d0d` = 3.45:1 (fails AA, requires 4.5:1)
  - Day: `#8a8478` on `#f5f1eb` = 3.28:1 (fails AA, requires 4.5:1)
- **Fix**:
  - Night: Changed to `#918983` = 5.76:1 on `#0d0d0d` (passes AA)
  - Day: Changed to `#6b6560` = 5.06:1 on `#f5f1eb` (passes AA)
- **Impact**: All muted text now meets WCAG AA contrast requirements in both themes.

### 8. Focus Management in `useRouteHash`
- **File**: `src/hooks/useRouteHash.ts`
- **Issue**: Hash-based navigation scrolled to the section but didn't move keyboard focus. Users who Tab after navigation were stuck on the previous section.
- **Fix**: After scrolling, the hook now finds the target element, sets `tabindex="-1"` if needed, and calls `focus()`.
- **Impact**: Keyboard users are properly relocated after hash navigation.

### 9. ARIA Attributes Audit
- **Files**: `src/components/Terminal.tsx`, `src/components/ContactForm.tsx`, `src/components/Navigation.tsx`
- **Issue**: Incomplete ARIA roles and attributes on interactive widgets.
- **Fix**:
  - `Terminal`: Added `role="log"`, `aria-live="polite"`, `aria-label` on the terminal region.
  - `ContactForm`: Verified all inputs have associated `<label>` elements; added `aria-describedby` for error messages.
  - `Navigation`: Verified `aria-current="page"` is set correctly on the active hash link.
- **Impact**: Screen reader users receive accurate context for all interactive elements.

## Verification

All changes were verified by:
1. `npm run typecheck` — 0 errors
2. `npm run lint` — 0 warnings
3. `npm run build` — Clean production build
4. Manual review of all modified files for adherence to the project's design axioms

## Lessons Learnt (New in Remediation 4)

1. **Contrast ratios must be verified in both themes** — The same hex value can pass WCAG AA on a dark background but fail on a light background (or vice versa). Always test both themes independently.
2. **Remove unused features rather than leaving them half-implemented** — `prefersHighContrast` was defined but never consumed. Removing it entirely was cleaner than leaving a dead toggle.
3. **Focus management is essential for keyboard navigation** — Hash-based routing that scrolls without moving focus creates a keyboard trap. Adding `tabindex="-1"` + `focus()` on the target heading resolves this.
4. **Never hardcode credentials in config files** — `drizzle.config.json` had plaintext credentials. Converting to TypeScript with environment variable references eliminated the security risk.
5. **Discriminated unions for API responses prevent type errors** — Adding a `success` discriminant enables TypeScript narrowing, preventing access to error-only properties on success responses.
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat docs/brutalist-portfolio-nextjs_SKILL_v4.md"}}
</tool_call>
<tool_result>
# Brutalist Portfolio — Next.js Skill Document (v4.0)

## The Design Philosophy: The Engineered Soul

The project's aesthetic is **Tactile Brutalism** balanced with **High-End Editorial** design. It is not a "website"; it is a "digital installation."

### Core Visual Axioms

1.  **Zero Border Radius**: `border-radius: 0` everywhere. The design language is built on rigid, geometric forms. No soft edges, no pills, no rounded corners—anywhere.
2.  **Visible Structure**: A 28px mathematical grid is visible in the background. All spacing, padding, and alignment must adhere to this underlying structure.
3.  **Grid Paper Overlay**: The background must feature a faint grid overlay that reinforces the architectural blueprint aesthetic. The effect is subtle but present—it should evoke a drafting table or a terminal, not a blank canvas.
4.  **High-Contrast Dark Mode**: The primary theme is a high-contrast dark mode. The background is a deep, near-black (e.g., `#0d0d0d`), with a single, sharp accent color (e.g., `#e8c547` or `#3b82f6`) and clean white or cream text for high readability.
5.  **Typographic Hierarchy**: Use a pairing of a distinctive serif or display font (like *Cormorant Garamond* or *Playfair Display*) for large headings and a clean monospaced font (like *IBM Plex Mono* or *JetBrains Mono*) for labels, stats, and code-like text.

## Architecture

### SPA Orchestrator Model

The front-end is a **single-page application (SPA)** orchestrator embedded within the Next.js App Router.

*   **`src/app/PortfolioApp.tsx`**: The client-side "conductor." Renders a persistent shell (full-screen terminal layout with title bar and draggable status window) and conditionally renders the active section.
*   **`page.tsx`**: Client Component (`"use client"`) that dynamically imports `PortfolioApp.tsx` with `ssr: false`.
*   **Hash-Based Routing**: Navigation via custom `useRouteHash` hook that listens for `window.location.hash` changes.

### Server-Side Architecture

*   **API Routes**: Contact form handler with server-side validation, in-memory rate limiter, and placeholder for email delivery.
*   **Database (Optional)**: Drizzle ORM with PostgreSQL. The app runs gracefully without a database.
*   **Health Check**: Liveness probe that verifies application status and optional database connectivity.

### Data Strategy

*   **Static TypeScript Arrays**: All portfolio data stored as typed arrays in `src/lib/`.
*   **Optional Database**: PostgreSQL integration for future features; the app must never fail to start due to a missing `DATABASE_URL`.

## Tech Stack

| Layer | Technology | Version | Purpose |
| --- | --- | --- | --- |
| **Framework** | Next.js | 16.2.9 | App Router, Server Components |
| **Runtime** | React | 19.2.7 | UI Library |
| **Styling** | Tailwind CSS | 4.1.17 | CSS-first utility styling |
| **Database** | PostgreSQL | 17+ | Persistent storage (optional) |
| **ORM** | Drizzle | 0.45.2 | Type-safe database management |
| **Language** | TypeScript | 5.9.3 | Type safety (`strict` + `noUncheckedIndexedAccess`) |

## Design Tokens

All design tokens are defined in `globals.css` using the `@theme` directive. This is the single source of truth.

### Typography
- `--font-editorial` / `--font-serif` / `--font-display`: Cormorant Garamond
- `--font-utility` / `--font-mono`: IBM Plex Mono
- `--font-body` / `--font-sans`: DM Sans

### Spacing
- `--spacing-grid`: 28px
- `--spacing-half`: 14px
- `--spacing-quarter`: 7px

### Colors (Night Theme)
- `--color-bg`: #0d0d0d
- `--color-surface`: #1a1a1a
- `--color-accent`: #e8c547
- `--color-text-primary`: #f0ece4
- `--color-text-muted`: #918983
- `--color-border`: #2a2520

### Colors (Day Theme)
- `--color-bg`: #f5f1eb
- `--color-surface`: #ebe5db
- `--color-accent`: #b8860b
- `--color-text-primary`: #1a1512
- `--color-text-muted`: #6b6560
- `--color-border`: #d4cdc4

### Motion
- `--transition-fast`: 150ms ease
- `--transition-normal`: 300ms ease
- `--transition-slow`: 500ms ease

### Shadows
- `--shadow-brutal`: 4px 4px 0px var(--color-border)
- `--shadow-brutal-lg`: 8px 8px 0px var(--color-border)

### Z-Index Scale
- `--z-index-grain`: 100
- `--z-index-machine`: 200
- `--z-index-status`: 300

## Component Architecture

### Active Components (17)

Each component follows these conventions:
- TypeScript strict mode (no `any`)
- Interface-first type definitions
- CSS-only animations (no JS animation libraries)
- Respects `prefers-reduced-motion`
- ARIA attributes for accessibility
- Single responsibility

### Component Hierarchy

```
page.tsx
└── PortfolioApp.tsx
    ├── TitleBar.tsx
    │   └── WindowControls.tsx
    ├── Navigation.tsx
    ├── Content Area (conditional by route hash)
    │   ├── HeroKinetic.tsx
    │   ├── ShowcaseCard.tsx (×N)
    │   ├── SkillsGrid.tsx
    │   │   └── SkillBar.tsx (×N)
    │   ├── Timeline.tsx
    │   ├── Terminal.tsx
    │   └── ContactForm.tsx
    ├── Footer.tsx
    ├── GrainOverlay.tsx
    └── GridBackground.tsx
```

## Routing

### Hash-Based Routing

Navigation uses `window.location.hash` with the following valid sections:
- `#hero` (default)
- `#projects`
- `#skills`
- `#timeline`
- `#terminal`
- `#contact`

The `useRouteHash` hook:
- Listens for `hashchange` events
- Scrolls to the target section
- Moves focus to the section heading (accessibility)
- Returns `[currentHash, navigateTo]`

### Focus Management

After hash navigation:
1. Find the target element by ID
2. Set `tabindex="-1"` if the element is not naturally focusable
3. Call `.focus()` on the element
4. Keyboard users are properly relocated

## Accessibility

### WCAG AA Compliance

All text meets minimum 4.5:1 contrast ratio:
- Night theme muted text: `#918983` on `#0d0d0d` = 5.76:1
- Day theme muted text: `#6b6560` on `#f5f1eb` = 5.06:1

### Motion Safety

All animated components check `prefers-reduced-motion`:
- `HeroKinetic`: Skips kinetic text animation, shows static text
- `ScrollReveal`: Shows content immediately without reveal animation
- `GrainOverlay`: Hides grain effect

### Screen Reader Support

- `Navigation`: `aria-current="page"` on active link
- `Terminal`: `role="log"`, `aria-live="polite"`
- `ContactForm`: All inputs have associated `<label>` elements, `aria-describedby` for error messages
- `SectionHeading`: Has `id` attribute for hash navigation and focus management

## Security

### Rate Limiting

The contact API endpoint uses an in-memory sliding window rate limiter:
- 5 requests per 60 seconds per IP
- Uses `Map` storage (does not persist across restarts)
- Suitable for single-instance deployments only

### Environment Variables

```env
# Required for database features (optional — app runs without it)
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Testing Strategy

- **Command**: `npm test`
- **Convention**: Test behavior over implementation
- **Mocks**: Use mocks for database operations
- **Coverage**: Focus on API routes, hooks, and component interactions

## Deployment

### Build

```bash
npm run build
```

### Environment

The application runs on any Node.js hosting platform:
- Vercel (recommended)
- Render
- Railway
- Docker

### Health Check

`GET /api/health` returns:
```json
{ "status": "ok", "db": true }
```

The `db` field is `true` if the database is connected, `false` otherwise.
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat README.md"}}
</tool_call>
<tool_result>
# Nicholas Yun — "The Engineered Soul" (v2.0)

An avant-garde digital installation balancing **Tactile Brutalism** with **High-End Editorial** design. This project is a meticulous port of the Nicholas Yun portfolio from a Vite SPA to the **Next.js 16 App Router**, preserving architectural integrity and design fidelity.

## Overview

* **The Problem**: Transitioning a highly interactive, kinetic Vite SPA to a server-rendered Next.js environment without losing performance or design precision.
* **The Solution**: A Client-Side SPA Orchestrator model embedded within the Next.js App Router, utilizing hash-based routing and static TypeScript data ingestion to maintain the original "digital installation" feel.

## Tech Stack

| Layer | Technology | Version | Purpose |
| --- | --- | --- | --- |
| **Framework** | Next.js | 16.2.9 | App Router, Server Components |
| **Runtime** | React | 19.2.7 | UI Library |
| **Styling** | Tailwind CSS | 4.1.17 | CSS-first utility styling |
| **Database** | PostgreSQL | 17+ | Persistent storage (optional) |
| **ORM** | Drizzle | 0.45.2 | Type-safe database management |
| **Language** | TypeScript | 5.9.3 | Type safety (`strict` + `noUncheckedIndexedAccess`) |

## Design System

* **Core Aesthetic**: Tactile Brutalism (Zero border-radius globally, including scrollbars, visible grids).
* **Mathematical Grid**: 28px visible background grid governing all spacing (`--spacing-grid`).
* **Typography Hierarchy**:
  + **Editorial**: *Cormorant Garamond* — Heading/Narrative (`--font-editorial` / `--font-serif` / `--font-display`).
  + **Utility**: *IBM Plex Mono* — Labels/Machine Mode (`--font-utility` / `--font-mono`).
  + **Body**: *DM Sans* — General content (`--font-body` / `--font-sans`), replaces Inter for anti-generic identity.
* **Dual Theme**: High-contrast "Night" (Dark) and warm "Day" (Cream) modes, toggled via `data-theme` attribute on `<html>`. FOUC prevention via inline `ThemeScript` in `layout.tsx`. System preference detection (`prefers-color-scheme`) when no stored value exists. All text-muted colors pass WCAG AA contrast ratios in both themes.

## File Hierarchy

* `src/app/` — Next.js entry points (`layout.tsx`, `page.tsx`, `error.tsx`, `not-found.tsx`), global design system (`globals.css`), the SPA orchestrator (`PortfolioApp.tsx`), and API routes (`/api/contact`, `/api/health`).
* `src/components/` — 17 active brutalist UI components. 15 archived components in `src/components/_archive/` (dormant from earlier iterations, awaiting integration or removal).
* `src/hooks/` — Custom interaction logic: 2 active (`useRouteHash`, `useReducedMotion`), 2 archived in `src/hooks/_archive/`.
* `src/lib/` — Static content arrays (`projects.ts`, `skills.ts`, `timeline.ts`), TypeScript interfaces (`types.ts`), centralized site config (`site-config.ts`), rate limiting utility (`rate-limit.ts`). 5 archived files in `src/lib/_archive/`.
* `src/db/` — Drizzle schema and database configuration (optional — app runs without `DATABASE_URL`).
* `drizzle.config.ts` — Drizzle Kit configuration, reads `DATABASE_URL` from environment (converted from hardcoded JSON in Remediation 4).
* `public/` — Static assets (favicon only; portrait assets pending).

## Quick Start

### Prerequisites

* Node.js >= 20
* PostgreSQL (for database-dependent features; the app runs without it)

### Installation

```
npm install
cp .env.example .env.local   # Configure your database URL and site URL (all optional)
```

### Development

```
npm run dev
```

### Verification

```
npm run typecheck  # TypeScript validation (runs before build)
npm run lint       # ESLint check
npm run build      # Production build (runs typecheck + next build)
```

## Project Status

| Phase | Status | Key Deliverables |
| --- | --- | --- |
| **0: Design System** | Complete | `globals.css` with `@theme` tokens, day/night theme overrides, keyframes |
| **1: Core Logic** | Complete | Hooks (`useRouteHash`, `useReducedMotion`) |
| **2: Components** | Complete | 17 active + 14 archived components |
| **3: Data Layer** | Complete | Static content arrays, consolidated `Project` type, Drizzle schema |
| **4: Orchestration** | Complete | `PortfolioApp.tsx` with ErrorBoundary + Suspense wrapping per section |
| **5: Entry Point** | Complete | `page.tsx` with client-side dynamic import + `react-error-boundary` |
| **6: Remediation 1** | Complete | 40 files updated, build errors resolved, typecheck passing |
| **7: Remediation 2** | Complete | 14 files updated, `Project` type consolidated, `noUncheckedIndexedAccess` enabled, 34 type errors resolved |
| **8: Remediation 3** | Complete | All 14 missing CSS variables defined in `@theme` with day overrides, hash routing aligned, theme target unified on `<html>`, system preference detection added, site config centralized (`site-config.ts`), contact API endpoint with rate limiting, dead code archived to `_archive/` directories |
| **9: Remediation 4** | Complete | Scrollbar `border-radius` fixed to 0, `drizzle.config.json` converted to `.ts` with env vars, `.env.example` created, `ContactApiResponse` discriminated union added, `prefersHighContrast` removed, `useReducedMotion` hook adopted in animation components, text-muted contrast ratios fixed to WCAG AA, focus management added to `useRouteHash`, ARIA attributes verified on interactive widgets |

## Testing

* **Command**: `npm test` (TDD preferred)
* **Convention**: Test behavior over implementation; use mocks for DB operations.

## Troubleshooting

### Build Errors

| Symptom | Cause | Fix |
| --- | --- | --- |
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

### Visual Issues

| Symptom | Cause | Fix |
| --- | --- | --- |
| Text appears too faint in Night theme | Pre-Remediation 4 `--color-text-muted` was `#6b6560` (3.45:1 on dark bg) | Now fixed to `#918983` (5.76:1) — ensure you have the latest `globals.css` |
| Text appears too faint in Day theme | Pre-Remediation 4 `--color-text-muted` was `#8a8478` (3.28:1 on light bg) | Now fixed to `#6b6560` (5.06:1) — ensure you have the latest `globals.css` |
| Keyboard focus doesn't move after hash navigation | Pre-Remediation 4 `useRouteHash` had no focus management | Now fixed — `useRouteHash` moves focus to the section heading via `tabindex="-1"` + `focus()` |
| Scrollbar has rounded corners | Pre-Remediation 4 used `border-radius: 3px` | Now fixed to `border-radius: 0` — ensure you have the latest `globals.css` |

### CSS Variables Not Resolving

The project uses a single canonical `--color-` prefix convention defined in `globals.css` `@theme` block (e.g., `--color-border`, `--color-text-primary`). All 14 previously undefined variables (`--font-display`, `--spacing-half`, `--transition-fast`, `--shadow-brutal`, `--color-text-inverse`, etc.) have been defined as of Remediation 3. Archived components in `_archive/` directories still use shorthand names (`--border-color`, `--text-primary`) that are **not defined**. If integrating archived components, either add alias variables in `globals.css` or rewrite them to use the `--color-` prefix convention.

### Tailwind Utility Classes Not Working

Archived components use custom Tailwind classes (`font-utility`, `font-editorial`, `font-body`, `z-grain`, `z-machine`, etc.) that are defined in the `@theme` block as `--font-*` and `--z-index-*` variables. Tailwind v4 maps these to `font-editorial`, `font-utility`, `font-body` utility classes and `z-grain`, `z-machine` etc. — verify the mapping works correctly before relying on them.

### Theme Not Persisting

The theme system uses `localStorage` with the key `"theme"`. `ThemeScript` (inline in `layout.tsx`) reads from localStorage and falls back to system preference (`prefers-color-scheme`). Both `ThemeScript` and `PortfolioApp` now target `document.documentElement` consistently. If theme fails to persist, check that localStorage is available (not blocked by private browsing).

### Drizzle Config Fails Without DATABASE_URL

The `drizzle.config.ts` file throws an error if `DATABASE_URL` is not set. This is intentional — Drizzle Kit commands (`push`, `studio`, `generate`) require a database connection. The main application runs fine without it (DB features are optional), but Drizzle Kit itself needs the URL.

## Known Issues

### Moderate

1. **Contact API logs to console** — The `/api/contact` endpoint validates and rate-limits requests, but only logs submissions to the server console (see `TODO` in `route.ts`). A real email service (Resend, SendGrid, etc.) needs to be integrated before production use.
2. **No error reporting** — `error.tsx` has a `console.error` placeholder for Sentry or similar. No structured error reporting exists.
3. **Analytics table never written to** — The `analytics` table schema exists and the health endpoint checks DB connectivity, but no code ever inserts rows.
4. **Missing portrait assets** — Archived `data.ts` references `/portraits/*.webp` files that don't exist in `public/`.
5. **No SSR** — `page.tsx` is a Client Component with `ssr: false`, so search engines see only the loading state. Consider re-enabling SSR with `Suspense` boundaries for SEO.

### Low

6. **`useAccessibility()` hook still not consumed** — `AccessibilityProvider` was simplified in Remediation 4 (removed unused `prefersHighContrast`), and `HeroKinetic`/`ScrollReveal` now use `useReducedMotion()` directly instead of inline `window.matchMedia`. However, no component consumes the context hook from `AccessibilityProvider` — the two systems (`useAccessibility` context vs. standalone `useReducedMotion` hook) remain redundant.
7. **Archived components use old CSS variable names** — Components in `_archive/` reference shorthand variable names (`--border-color`, `--text-primary`, etc.) that don't exist in `@theme`. Must be updated before reintegration.
8. **In-memory rate limiting only** — `rate-limit.ts` uses a `Map` that doesn't persist across server instances or restarts. Suitable for single-instance deployments only; replace with Redis/Upstash for production multi-instance deployments.

## Lessons Learnt

1. **Verify npm versions before pinning** — Remediation specified `@types/react-dom@^19.2.6` which didn't exist (max was 19.2.3). Always check with `npm view <pkg> dist-tags` before updating `package.json`.
2. **CSS import order is critical** — In Tailwind v4, `@import "tailwindcss"` expands to `@layer` rules. Any `@import url()` for external fonts **must** come before it, or the CSS optimizer will reject it.
3. **Next.js 16 removes `optimizeFonts`** — This `next.config.ts` option no longer exists. Font optimization is automatic.
4. **`ssr: false` requires Client Components** — In Next.js 16, `next/dynamic` with `ssr: false` cannot be used in Server Components. The page must have `"use client"`.
5. **Two design token systems create technical debt** — Archived components use shorthand CSS variable names (`--border-color`) while `@theme` uses `--color-` prefix (`--color-border`). Must reconcile before integration. Moving dormant code to `_archive/` directories prevents confusion about what's active.
6. **Null-safe database access** — Since `DATABASE_URL` is optional, `db` can be `null`. Any API route using `db` must include a null guard.
7. **`noUncheckedIndexedAccess` catches real bugs** — Enabling this strict TypeScript option revealed 6+ places where array index access could return `undefined`, including `commandHistory[newIndex]`, `columns[i]`, and `CHARS[index]`. Always use `?.` or `??` for index access.
8. **`react-error-boundary` v4 changed `FallbackProps.error` type** — The `error` prop changed from `Error` to `unknown`. Custom fallback components must type it as `unknown` and use `instanceof Error` to access `.message`.
9. **`PortfolioApp.tsx` location matters** — It lives in `src/app/`, not `src/components/`. The import in `page.tsx` must be `@/app/PortfolioApp`, not `@/components/PortfolioApp`. The App Router co-locates the orchestrator with the route.
10. **Undefined CSS variables silently fail** — When `var(--font-display)` resolves to `unset`, there's no error or warning — the property just doesn't apply. Always audit `var()` references against `@theme` definitions after any refactoring. The solution is to define every referenced variable in `@theme` with appropriate defaults and day-theme overrides.
11. **Centralize configuration early** — Contact info, site name, and social links were hardcoded in 4+ places (Footer, Terminal, layout.tsx, Navigation). Creating `site-config.ts` as a single source of truth eliminated drift risk and simplified future changes.
12. **Theme target must be consistent** — Setting `data-theme` on different DOM elements (`<html>` vs `<body>`) causes CSS selectors to break. Pick one target (`<html>`) and use it everywhere — both in `ThemeScript` (initial paint) and `PortfolioApp` (runtime toggle).
13. **Hash routing section names must match actual IDs** — When `VALID_SECTIONS` in `useRouteHash` diverges from actual section IDs in `PortfolioApp`, `aria-current` indicators and active link highlighting silently break for mismatched sections. Keep these in sync.
14. **Rate limiting is essential for public API routes** — Without rate limiting, the contact form endpoint is vulnerable to abuse. Even a simple in-memory sliding window algorithm (as implemented in `rate-limit.ts`) provides meaningful protection for single-instance deployments.
15. **Archiving dormant code reduces confusion** — Moving unused components, hooks, and lib files to `_archive/` directories makes it immediately clear what code is active vs. dormant, reducing the risk that developers accidentally import dead code.
16. **Remediation docs may reference files that don't exist** — Remediation_4.md was written without access to the actual codebase and referenced ~15 files that don't exist in the project (e.g., `ParticleField.tsx`, `CustomCursor.tsx`, `DayNightToggle.tsx`, `AccessibilityMenu.tsx`, `useAccessibility.ts`, `projectsData.ts`). Always validate each remediation proposal against the actual file structure before applying changes.
17. **Discriminated unions for API responses prevent type errors** — Adding `ContactApiResponse = ContactApiSuccess | ContactApiError` with a `success` discriminant field enables TypeScript narrowing. Code that checks `if (data.success)` automatically narrows to the correct branch, preventing access to `error` on success responses and `message` on error responses.
18. **Contrast ratios must be verified in both themes** — The same hex value can pass WCAG AA on a dark background but fail on a light background (or vice versa). The Night theme needed a *lighter* muted text (`#918983`) while the Day theme needed a *darker* muted text (`#6b6560`). Always test both themes independently.
19. **Remove unused features rather than leaving them half-implemented** — `prefersHighContrast` was defined in `AccessibilityProvider` but never consumed, and no high-contrast color palette existed. Removing it entirely was cleaner than leaving a dead toggle that implied functionality that didn't work.
20. **Focus management is essential for keyboard navigation** — Hash-based routing that scrolls without moving focus creates a trap for keyboard users who must Tab through all intermediate elements. Adding `tabindex="-1"` + `focus()` on the target heading after navigation brings keyboard users directly to the new section.
21. **Never hardcode credentials in config files** — `drizzle.config.json` had `postgres:postgres` in plaintext. Converting to `drizzle.config.ts` with `process.env.DATABASE_URL` eliminated the security risk and aligned with the `.env.example` pattern. The config now throws a clear error message if the variable is missing.

## Recommendations

1. **Integrate an email service** — Replace the `console.log` in `/api/contact/route.ts` with a real email provider (Resend, SendGrid, etc.) before deploying to production.
2. **Add error reporting** — Integrate Sentry or a similar service in `error.tsx` and the global error boundary.
3. **Consolidate `useAccessibility()` and `useReducedMotion()`** — `AccessibilityProvider` provides `prefersReducedMotion` via context, but `HeroKinetic` and `ScrollReveal` import `useReducedMotion()` directly. Either have all components consume the context hook, or remove `AccessibilityProvider` and use the standalone hook everywhere.
4. **Reconcile CSS variable naming for archived components** — If reintegrating any archived components, either add alias variables in `globals.css` or rewrite them to use the `--color-` prefix convention.
5. **Add portrait assets** — Place webp images in `public/portraits/` if needed, or remove references from archived `data.ts`.
6. **Consider re-enabling SSR** — Replace `ssr: false` with `Suspense` boundaries for better SEO while keeping interactive features client-side.
7. **Write to analytics table** — Either implement middleware to track page views or remove the unused `analytics` table schema.
8. **Replace in-memory rate limiting for production** — The current `rate-limit.ts` uses a `Map` which doesn't persist across instances. For multi-instance deployments (Vercel, Docker), replace with Redis/Upstash rate limiting.

## License

Proprietary — All rights reserved.
</tool_result>

Now let me also read the remediation docs and examine the actual source code structure:

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && find src -type f | sort"}}
</tool_call>
<tool_result>
src/app/PortfolioApp.tsx
src/app/api/contact/route.ts
src/app/api/health/route.ts
src/app/error.tsx
src/app/globals.css
src/app/layout.tsx
src/app/not-found.tsx
src/app/page.tsx
src/components/AccessibilityProvider.tsx
src/components/ContactForm.tsx
src/components/ErrorBoundary.tsx
src/components/Footer.tsx
src/components/GrainOverlay.tsx
src/components/GridBackground.tsx
src/components/HeroKinetic.tsx
src/components/LoadingState.tsx
src/components/Navigation.tsx
src/components/ScrollReveal.tsx
src/components/SectionHeading.tsx
src/components/ShowcaseCard.tsx
src/components/SkillBar.tsx
src/components/SkillsGrid.tsx
src/components/Terminal.tsx
src/components/Timeline.tsx
src/components/TitleBar.tsx
src/components/WindowControls.tsx
src/components/_archive/BlogPreview.tsx
src/components/_archive/CursorGlow.tsx
src/components/_archive/DrilldownOverlay.tsx
src/components/_archive/GlitchText.tsx
src/components/_archive/HorizontalScroll.tsx
src/components/_archive/ParallaxLayer.tsx
src/components/_archive/ProjectCard.tsx
src/components/_archive/ScrollProgress.tsx
src/components/_archive/SectionShell.tsx
src/components/_archive/SkillMeter.tsx
src/components/_archive/StatusIndicator.tsx
src/components/_archive/TestimonialCarousel.tsx
src/components/_archive/Typewriter.tsx
src/components/_archive/WaveText.tsx
src/db/index.ts
src/db/schema.ts
src/hooks/_archive/useScrollSpy.ts
src/hooks/_archive/useTypewriter.ts
src/hooks/useReducedMotion.ts
src/hooks/useRouteHash.ts
src/lib/_archive/achievements.ts
src/lib/_archive/constants.ts
src/lib/_archive/data.ts
src/lib/_archive/social.ts
src/lib/_archive/testimonials.ts
src/lib/projects.ts
src/lib/rate-limit.ts
src/lib/site-config.ts
src/lib/skills.ts
src/lib/timeline.ts
src/lib/types.ts
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat package.json"}}
</tool_call>
<tool_result>
{
  "name": "personal-portfolio-next",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "npm run typecheck && next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  },
  "dependencies": {
    "drizzle-orm": "^0.45.2",
    "next": "^16.2.9",
    "pg": "^8.16.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "react-error-boundary": "^4.1.2"
  },
  "devDependencies": {
    "@types/node": "^24.0.1",
    "@types/pg": "^8.15.4",
    "@types/react": "^19.2.6",
    "@types/react-dom": "^19.2.3",
    "drizzle-kit": "^0.31.1",
    "eslint": "^9.29.0",
    "eslint-config-next": "^16.2.9",
    "tailwindcss": "^4.1.17",
    "@tailwindcss/postcss": "^4.1.17",
    "typescript": "^5.9.3",
    "vitest": "^3.2.1"
  }
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat tsconfig.json"}}
</tool_call>
<tool_result>
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    },
    "noUncheckedIndexedAccess": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat next.config.ts"}}
</tool_call>
<tool_result>
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* No optimizeFonts — removed in Next.js 16; font optimization is automatic */
};

export default nextConfig;
</tool_result>

Now let me read through all the critical source files:

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/app/layout.tsx"}}
</tool_call>
<tool_result>
import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

function ThemeScript() {
  const code = `
    (function() {
      try {
        var stored = localStorage.getItem('theme');
        if (stored === 'day' || stored === 'night') {
          document.documentElement.setAttribute('data-theme', stored);
          return;
        }
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'night' : 'day');
      } catch(e) {
        document.documentElement.setAttribute('data-theme', 'night');
      }
    })();
  `;
  // eslint-disable-next-line @nextnext/no-html-link-for-pages
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="night">
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/app/page.tsx"}}
</tool_call>
<tool_result>
'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

const PortfolioApp = dynamic(() => import('./PortfolioApp'), {
  ssr: false,
  loading: () => <LoadingFallback />,
});

function LoadingFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'var(--font-mono)',
        color: 'var(--color-text-muted)',
      }}
    >
      <span>INITIALIZING SYSTEM...</span>
    </div>
  );
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'var(--font-mono)',
        color: '#e8c547',
        padding: '2rem',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        SYSTEM ERROR
      </h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        {message}
      </p>
      <button
        onClick={resetErrorBoundary}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'transparent',
          border: '2px solid #e8c547',
          color: '#e8c547',
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          borderRadius: 0,
        }}
      >
        RETRY
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <PortfolioApp />
    </ErrorBoundary>
  );
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/app/PortfolioApp.tsx"}}
</tool_call>
<tool_result>
'use client';

import { useState, useCallback, Suspense, useEffect } from 'react';
import { useRouteHash } from '@/hooks/useRouteHash';
import { siteConfig } from '@/lib/site-config';
import TitleBar from '@/components/TitleBar';
import Navigation from '@/components/Navigation';
import HeroKinetic from '@/components/HeroKinetic';
import ShowcaseCard from '@/components/ShowcaseCard';
import SkillsGrid from '@/components/SkillsGrid';
import Timeline from '@/components/Timeline';
import Terminal from '@/components/Terminal';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';
import GridBackground from '@/components/GridBackground';
import LoadingState from '@/components/LoadingState';
import { projects } from '@/lib/projects';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorBoundaryFallback from '@/components/ErrorBoundary';

const SECTIONS: Record<string, { label: string; component: React.ComponentType }> = {
  hero: { label: 'Home', component: HeroKinetic },
  projects: { label: 'Projects', component: () => (
    <section id="projects" className="py-8">
      <h2 className="text-2xl font-[family-name:var(--font-editorial)] mb-8 text-[var(--color-accent)]" tabIndex={-1}>
        Featured Projects
      </h2>
      <div className="grid gap-6">
        {projects.map((project, index) => (
          <ShowcaseCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  )},
  skills: { label: 'Skills', component: SkillsGrid },
  timeline: { label: 'Timeline', component: Timeline },
  terminal: { label: 'Terminal', component: Terminal },
  contact: { label: 'Contact', component: ContactForm },
};

function DraggableStatus({ sectionLabel }: { sectionLabel: string }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };
    const handleUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, offset]);

  return (
    <div
      className="status-bar"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      <span>SECTION: {sectionLabel.toUpperCase()}</span>
      <span>SITE: {siteConfig.name}</span>
      <span>STATUS: OPERATIONAL</span>
    </div>
  );
}

export default function PortfolioApp() {
  const [currentHash, navigateTo] = useRouteHash();
  const activeSection = currentHash in SECTIONS ? currentHash : 'hero';
  const ActiveComponent = SECTIONS[activeSection]?.component ?? HeroKinetic;

  return (
    <div className="terminal-window">
      <TitleBar />
      <Navigation
        currentHash={activeSection}
        onNavigate={navigateTo}
        sections={SECTIONS}
      />
      <DraggableStatus sectionLabel={SECTIONS[activeSection]?.label ?? 'Home'} />
      <div className="content-area">
        <GridBackground />
        <GrainOverlay />
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Suspense fallback={<LoadingState />}>
            <ActiveComponent />
          </Suspense>
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/app/globals.css"}}
</tool_call>
<tool_result>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;700&display=swap');
@import "tailwindcss";

@theme {
  /* Typography */
  --font-editorial: 'Cormorant Garamond', serif;
  --font-serif: 'Cormorant Garamond', serif;
  --font-display: 'Cormorant Garamond', serif;
  --font-utility: 'IBM Plex Mono', monospace;
  --font-mono: 'IBM Plex Mono', monospace;
  --font-body: 'DM Sans', sans-serif;
  --font-sans: 'DM Sans', sans-serif;

  /* Spacing */
  --spacing-grid: 28px;
  --spacing-half: 14px;
  --spacing-quarter: 7px;

  /* Colors — Night (default) */
  --color-bg: #0d0d0d;
  --color-surface: #1a1a1a;
  --color-accent: #e8c547;
  --color-text-primary: #f0ece4;
  --color-text-muted: #918983;
  --color-text-inverse: #0d0d0d;
  --color-border: #2a2520;
  --color-error: #e74c3c;
  --color-success: #2ecc71;

  /* Shadows */
  --shadow-brutal: 4px 4px 0px var(--color-border);
  --shadow-brutal-lg: 8px 8px 0px var(--color-border);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;

  /* Z-Index Scale */
  --z-index-grain: 100;
  --z-index-machine: 200;
  --z-index-status: 300;
}

/* Day theme overrides */
[data-theme="day"] {
  --color-bg: #f5f1eb;
  --color-surface: #ebe5db;
  --color-accent: #b8860b;
  --color-text-primary: #1a1512;
  --color-text-muted: #6b6560;
  --color-text-inverse: #f5f1eb;
  --color-border: #d4cdc4;
  --color-error: #c0392b;
  --color-success: #27ae60;
  --shadow-brutal: 4px 4px 0px var(--color-border);
  --shadow-brutal-lg: 8px 8px 0px var(--color-border);
}

/* === Base Styles === */
*,
*::before,
*::after {
  border-radius: 0 !important;
  box-sizing: border-box;
}

html {
  font-family: var(--font-body);
  color: var(--color-text-primary);
  background: var(--color-bg);
}

body {
  margin: 0;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Scrollbar — zero radius, brutalist */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--color-surface);
  border-radius: 0;
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 0;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent);
}

/* Selection */
::selection {
  background: var(--color-accent);
  color: var(--color-text-inverse);
}

/* === Layout Shell === */
.terminal-window {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-quarter) var(--spacing-half);
  background: var(--color-surface);
  border-bottom: 2px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: var(--z-index-status);
}

.status-bar {
  display: flex;
  gap: var(--spacing-grid);
  padding: var(--spacing-quarter) var(--spacing-half);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  user-select: none;
  z-index: var(--z-index-machine);
}

.content-area {
  flex: 1;
  position: relative;
  padding: var(--spacing-grid);
}

/* === Animations === */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes typewriter-cursor {
  0%, 100% { border-right-color: var(--color-accent); }
  50% { border-right-color: transparent; }
}

/* Motion safety */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus styles */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* === Utility Classes === */
.brutal-shadow {
  box-shadow: var(--shadow-brutal);
}

.brutal-shadow-lg {
  box-shadow: var(--shadow-brutal-lg);
}

.font-editorial {
  font-family: var(--font-editorial);
}

.font-utility {
  font-family: var(--font-utility);
}

.font-body {
  font-family: var(--font-body);
}

.z-grain {
  z-index: var(--z-index-grain);
}

.z-machine {
  z-index: var(--z-index-machine);
}

.z-status {
  z-index: var(--z-index-status);
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/app/error.tsx"}}
</tool_call>
<tool_result>
'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // TODO: Integrate Sentry or error reporting service
  console.error('[GlobalError]', error);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'var(--font-mono)',
        color: '#e8c547',
        padding: '2rem',
        background: '#0d0d0d',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        APPLICATION ERROR
      </h1>
      <p style={{ color: '#918983', marginBottom: '2rem', textAlign: 'center', maxWidth: '60ch' }}>
        {error.message || 'An unexpected error occurred. The system needs attention.'}
      </p>
      <button
        onClick={reset}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'transparent',
          border: '2px solid #e8c547',
          color: '#e8c547',
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
        }}
      >
        REINITIALIZE
      </button>
    </div>
  );
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/app/not-found.tsx"}}
</tool_call>
<tool_result>
export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'var(--font-mono)',
        color: '#e8c547',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '0.2em' }}>
        404
      </h1>
      <p style={{ color: '#918983', marginBottom: '2rem' }}>
        SIGNAL NOT FOUND
      </p>
      <a
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          background: 'transparent',
          border: '2px solid #e8c547',
          color: '#e8c547',
          fontFamily: 'var(--font-mono)',
          textDecoration: 'none',
        }}
      >
        RETURN HOME
      </a>
    </div>
  );
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/hooks/useRouteHash.ts"}}
</tool_call>
<tool_result>
'use client';

import { useState, useEffect, useCallback } from 'react';

const VALID_SECTIONS = ['hero', 'projects', 'skills', 'timeline', 'terminal', 'contact'] as const;
type ValidSection = (typeof VALID_SECTIONS)[number];

function isValidSection(value: string): value is ValidSection {
  return VALID_SECTIONS.includes(value as ValidSection);
}

export function useRouteHash(): [string, (section: string) => void] {
  const getHash = useCallback((): string => {
    if (typeof window === 'undefined') return 'hero';
    const hash = window.location.hash.replace('#', '');
    return isValidSection(hash) ? hash : 'hero';
  }, []);

  const [currentHash, setCurrentHash] = useState<string>(getHash);

  const navigateTo = useCallback((section: string) => {
    if (!isValidSection(section)) return;
    window.location.hash = section;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validHash = isValidSection(hash) ? hash : 'hero';
      setCurrentHash(validHash);

      // Focus management: move keyboard focus to the target section
      const target = document.getElementById(validHash);
      if (target) {
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
        }
        target.focus({ preventScroll: true });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Sync on mount in case hash was set before hydration
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return [currentHash, navigateTo];
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/hooks/useReducedMotion.ts"}}
</tool_call>
<tool_result>
'use client';

import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/lib/types.ts"}}
</tool_call>
<tool_result>
export interface Project {
  title: string;
  description: string;
  tech: string[];
  links: {
    repo?: string;
    live?: string;
  };
  image?: string;
}

export interface Skill {
  name: string;
  level: number; // 0–100
  category: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  company: string;
  description: string;
  highlights?: string[];
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  email: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
  location: string;
}

export interface ContactFormBody {
  name: string;
  email: string;
  message: string;
}

export interface ContactApiSuccess {
  success: true;
  message: string;
}

export interface ContactApiError {
  success: false;
  error: string;
}

export type ContactApiResponse = ContactApiSuccess | ContactApiError;
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/lib/site-config.ts"}}
</tool_call>
<tool_result>
import type { SiteConfig } from './types';

export const siteConfig: SiteConfig = {
  name: 'Nicholas Yun',
  title: 'Nicholas Yun — The Engineered Soul',
  description:
    'A software engineer building at the intersection of design and engineering. This is my digital installation.',
  email: 'nicholas@example.com',
  social: {
    github: 'https://github.com/nicholasyun',
    linkedin: 'https://linkedin.com/in/nicholasyun',
    twitter: 'https://twitter.com/nicholasyun',
  },
  location: 'Singapore',
};
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/lib/projects.ts"}}
</tool_call>
<tool_result>
import type { Project } from './types';

export const projects: Project[] = [
  {
    title: 'The Engineered Soul',
    description:
      'An avant-garde digital portfolio balancing Tactile Brutalism with High-End Editorial design. Built with Next.js 16, React 19, and Tailwind CSS v4.',
    tech: ['Next.js', 'React 19', 'Tailwind CSS v4', 'TypeScript', 'Drizzle ORM'],
    links: {
      repo: 'https://github.com/nordeim/personal-portfolio-next',
    },
  },
  {
    title: 'Sentinel',
    description:
      'A real-time threat detection dashboard with WebSocket-driven data streams, anomaly visualization, and a command-line interface for rapid incident response.',
    tech: ['React', 'Node.js', 'WebSocket', 'PostgreSQL', 'D3.js'],
    links: {
      repo: 'https://github.com/nicholasyun/sentinel',
      live: 'https://sentinel.nicholasyun.dev',
    },
  },
  {
    title: 'Architect',
    description:
      'A system design and architecture visualization tool. Drag-and-drop components to model distributed systems, then export diagrams as code.',
    tech: ['Svelte', 'TypeScript', 'Canvas API', 'SQLite'],
    links: {
      repo: 'https://github.com/nicholasyun/architect',
    },
  },
  {
    title: 'Chronicle',
    description:
      'A developer journal and knowledge base with Markdown-first authoring, bidirectional linking, and full-text search across entries.',
    tech: ['Next.js', 'MDX', 'PostgreSQL', 'tRPC'],
    links: {
      repo: 'https://github.com/nicholasyun/chronicle',
      live: 'https://chronicle.nicholasyun.dev',
    },
  },
];
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/lib/skills.ts"}}
</tool_call>
<tool_result>
import type { Skill } from './types';

export const skills: Skill[] = [
  { name: 'TypeScript', level: 95, category: 'Languages' },
  { name: 'Python', level: 85, category: 'Languages' },
  { name: 'Rust', level: 70, category: 'Languages' },
  { name: 'Go', level: 65, category: 'Languages' },
  { name: 'SQL', level: 80, category: 'Languages' },

  { name: 'React', level: 95, category: 'Frontend' },
  { name: 'Next.js', level: 90, category: 'Frontend' },
  { name: 'Tailwind CSS', level: 92, category: 'Frontend' },
  { name: 'Svelte', level: 75, category: 'Frontend' },
  { name: 'Three.js', level: 60, category: 'Frontend' },

  { name: 'Node.js', level: 90, category: 'Backend' },
  { name: 'PostgreSQL', level: 85, category: 'Backend' },
  { name: 'Redis', level: 78, category: 'Backend' },
  { name: 'Docker', level: 82, category: 'Backend' },
  { name: 'AWS', level: 75, category: 'Backend' },

  { name: 'Git', level: 95, category: 'Tools' },
  { name: 'CI/CD', level: 85, category: 'Tools' },
  { name: 'Linux', level: 88, category: 'Tools' },
  { name: 'Figma', level: 70, category: 'Tools' },
  { name: 'Neovim', level: 80, category: 'Tools' },
];
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/lib/timeline.ts"}}
</tool_call>
<tool_result>
import type { TimelineEntry } from './types';

export const timeline: TimelineEntry[] = [
  {
    year: '2024',
    title: 'Senior Software Engineer',
    company: 'Acme Corp',
    description:
      'Leading frontend architecture for the core product platform, driving performance improvements and design system adoption.',
    highlights: [
      'Reduced LCP by 40% through code splitting and image optimization',
      'Built a component library used across 6 product teams',
      'Mentored 3 junior engineers',
    ],
  },
  {
    year: '2022',
    title: 'Software Engineer',
    company: 'TechStart',
    description:
      'Full-stack development on a B2B SaaS platform. Built real-time features and improved system reliability.',
    highlights: [
      'Implemented WebSocket-based real-time collaboration',
      'Reduced API latency by 60% through query optimization',
      'Led migration from REST to tRPC',
    ],
  },
  {
    year: '2020',
    title: 'Junior Developer',
    company: 'Digital Agency',
    description:
      'Built websites and web applications for clients across various industries.',
    highlights: [
      'Delivered 12+ client projects on time',
      'Introduced TypeScript to the team',
      'Built internal tooling for project scaffolding',
    ],
  },
  {
    year: '2019',
    title: 'Computer Science Graduate',
    company: 'National University of Singapore',
    description:
      'Bachelor of Computing in Computer Science. Focus areas: software engineering, distributed systems, and human-computer interaction.',
    highlights: [
      'Final year project: Real-time code collaboration tool',
      'Teaching assistant for CS2103 Software Engineering',
    ],
  },
];
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/lib/rate-limit.ts"}}
</tool_call>
<tool_result>
interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

/**
 * In-memory sliding window rate limiter.
 * @param key - The rate limit key (e.g., IP address)
 * @param limit - Max requests allowed in the window
 * @param windowMs - Window duration in milliseconds
 * @returns Object with `success` (boolean) and `retryAfterMs` (number, 0 if allowed)
 */
export function rateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60_000
): { success: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { timestamps: [now] });
    return { success: true, retryAfterMs: 0 };
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    const oldestInWindow = entry.timestamps[0]!;
    const retryAfterMs = windowMs - (now - oldestInWindow);
    return { success: false, retryAfterMs };
  }

  entry.timestamps.push(now);
  return { success: true, retryAfterMs: 0 };
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/db/schema.ts"}}
</tool_call>
<tool_result>
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  page: text('page').notNull(),
  referrer: text('referrer'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/db/index.ts"}}
</tool_call>
<tool_result>
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const DATABASE_URL = process.env.DATABASE_URL;

let db: ReturnType<typeof drizzle> | null = null;

if (DATABASE_URL) {
  const pool = new Pool({ connectionString: DATABASE_URL });
  db = drizzle(pool, { schema });
}

export { db };
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/app/api/contact/route.ts"}}
</tool_call>
<tool_result>
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { db } from '@/db';
import { contactSubmissions } from '@/db/schema';
import type { ContactApiResponse, ContactFormBody } from '@/lib/types';

function validate(body: unknown): body is ContactFormBody {
  if (typeof body !== 'object' || body === null) return false;
  const { name, email, message } = body as Record<string, unknown>;
  if (typeof name !== 'string' || name.trim().length === 0) return false;
  if (typeof email !== 'string' || !email.includes('@')) return false;
  if (typeof message !== 'string' || message.trim().length === 0) return false;
  return true;
}

export async function POST(request: NextRequest): Promise<NextResponse<ContactApiResponse>> {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
  const { success, retryAfterMs } = rateLimit(ip);

  if (!success) {
    return NextResponse.json(
      { success: false, error: `Rate limit exceeded. Retry in ${Math.ceil(retryAfterMs / 1000)}s.` },
      { status: 429 }
    );
  }

  // Parse and validate
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  if (!validate(body)) {
    return NextResponse.json(
      { success: false, error: 'Missing or invalid fields: name, email, message.' },
      { status: 400 }
    );
  }

  const { name, email, message } = body;

  // Persist (optional)
  if (db) {
    try {
      await db.insert(contactSubmissions).values({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
    } catch (err) {
      console.error('[Contact API] DB insert failed:', err);
      // Continue — don't fail the request if DB is down
    }
  }

  // TODO: Integrate email delivery (Resend, SendGrid, etc.)
  console.log('[Contact API] New submission:', { name, email, message: message.substring(0, 100) });

  return NextResponse.json(
    { success: true, message: 'Message received. Thank you!' },
    { status: 200 }
  );
}
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat src/app/api/health/route.ts"}}
</tool_call>
<tool_result>
import { NextResponse } from 'next/server';
import { db } from '@/db';

export async function GET() {
  let dbHealthy = false;

  if (db) {
    try {
      // Simple query to check connectivity
      const { sql } = await import('drizzle-orm');
      await db.execute(sql`SELECT 1`);
      dbHealthy = true;
    } catch {
      dbHealthy = false;
    }
  }

  return NextResponse.json({
    status: 'ok',
    db: dbHealthy,
  });
}
</tool_result>

Now let me read all 17 active components:

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && for f in src/components/TitleBar.tsx src/components/WindowControls.tsx src/components/Navigation.tsx src/components/HeroKinetic.tsx src/components/ShowcaseCard.tsx src/components/SkillsGrid.tsx src/components/SkillBar.tsx src/components/Timeline.tsx src/components/Terminal.tsx src/components/ContactForm.tsx src/components/Footer.tsx src/components/GrainOverlay.tsx src/components/GridBackground.tsx src/components/LoadingState.tsx src/components/SectionHeading.tsx src/components/ScrollReveal.tsx src/components/AccessibilityProvider.tsx src/components/ErrorBoundary.tsx; do echo \"========== $f ==========\"; cat \"$f\"; echo; done"}}
</tool_call>
<tool_result>
========== src/components/TitleBar.tsx ==========
'use client';

import { useCallback, useEffect, useState } from 'react';
import WindowControls from './WindowControls';
import { siteConfig } from '@/lib/site-config';

export default function TitleBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'day' ? 'night' : 'day';
    html.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // localStorage not available
    }
  }, []);

  return (
    <div className="title-bar">
      <WindowControls />
      <span className="font-utility text-xs tracking-widest text-[var(--color-text-muted)]">
        {siteConfig.name} — {siteConfig.title}
      </span>
      <div className="flex items-center gap-4">
        <span className="font-utility text-xs text-[var(--color-text-muted)]">
          {time}
        </span>
        <button
          onClick={handleThemeToggle}
          className="font-utility text-xs px-2 py-1 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
          aria-label="Toggle day/night theme"
        >
          THEME
        </button>
      </div>
    </div>
  );
}

========== src/components/WindowControls.tsx ==========
'use client';

export default function WindowControls() {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Window controls">
      <button
        className="w-3 h-3 bg-[#ff5f57] border border-[var(--color-border)]"
        aria-label="Close window"
      />
      <button
        className="w-3 h-3 bg-[#febc2e] border border-[var(--color-border)]"
        aria-label="Minimize window"
      />
      <button
        className="w-3 h-3 bg-[#28c840] border border-[var(--color-border)]"
        aria-label="Maximize window"
      />
    </div>
  );
}

========== src/components/Navigation.tsx ==========
'use client';

interface NavigationProps {
  currentHash: string;
  onNavigate: (section: string) => void;
  sections: Record<string, { label: string }>;
}

export default function Navigation({ currentHash, onNavigate, sections }: NavigationProps) {
  return (
    <nav
      className="flex gap-1 px-[var(--spacing-half)] py-[var(--spacing-quarter)] bg-[var(--color-surface)] border-b border-[var(--color-border)] font-utility text-xs"
      role="navigation"
      aria-label="Main navigation"
    >
      {Object.entries(sections).map(([key, { label }]) => (
        <button
          key={key}
          onClick={() => onNavigate(key)}
          className={`px-3 py-1.5 transition-colors ${
            currentHash === key
              ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
          aria-current={currentHash === key ? 'page' : undefined}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

========== src/components/HeroKinetic.tsx ==========
'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const TITLES = [
  'Software Engineer',
  'Systems Architect',
  'Design Technologist',
  'Code Craftsman',
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

function scramble(text: string, progress: number): string {
  return text
    .split('')
    .map((char, i) => {
      if (i < progress) return char;
      if (char === ' ') return ' ';
      return CHARS[Math.floor(Math.random() * CHARS.length)] ?? char;
    })
    .join('');
}

export default function HeroKinetic() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [progress, setProgress] = useState(0);
  const prefersReduced = useReducedMotion();

  const currentTitle = TITLES[titleIndex] ?? TITLES[0] ?? '';

  useEffect(() => {
    if (prefersReduced) {
      setDisplayText(currentTitle);
      return;
    }

    if (progress <= currentTitle.length) {
      const timer = setTimeout(() => {
        setDisplayText(scramble(currentTitle, progress));
        setProgress((p) => p + 1);
      }, 50);
      return () => clearTimeout(timer);
    }

    // Hold, then advance to next title
    const holdTimer = setTimeout(() => {
      setTitleIndex((i) => (i + 1) % TITLES.length);
      setProgress(0);
    }, 2000);
    return () => clearTimeout(holdTimer);
  }, [progress, currentTitle, prefersReduced]);

  return (
    <section
      id="hero"
      className="flex flex-col justify-center min-h-[60vh]"
      aria-label="Hero section"
    >
      <p className="font-utility text-xs text-[var(--color-accent)] tracking-[0.3em] uppercase mb-4">
        {'>'} Hello, World
      </p>
      <h1
        className="font-editorial text-5xl md:text-7xl font-light text-[var(--color-text-primary)] mb-4"
        tabIndex={-1}
      >
        Nicholas Yun
      </h1>
      <p
        className="font-utility text-lg md:text-xl text-[var(--color-accent)] min-h-[2em]"
        aria-live="polite"
      >
        {displayText}
        <span className="inline-block w-[2px] h-[1.2em] bg-[var(--color-accent)] ml-1 animate-pulse" />
      </p>
      <p className="font-body text-sm text-[var(--color-text-muted)] mt-8 max-w-xl leading-relaxed">
        I build at the intersection of design and engineering — crafting
        digital experiences that are precise, intentional, and unapologetically
        bold. Currently based in Singapore.
      </p>
    </section>
  );
}

========== src/components/ShowcaseCard.tsx ==========
'use client';

import type { Project } from '@/lib/types';
import ScrollReveal from './ScrollReveal';

interface ShowcaseCardProps {
  project: Project;
  index: number;
}

export default function ShowcaseCard({ project, index }: ShowcaseCardProps) {
  return (
    <ScrollReveal delay={index * 100}>
      <article className="border border-[var(--color-border)] bg-[var(--color-surface)] brutal-shadow p-[var(--spacing-grid)] hover:border-[var(--color-accent)] transition-[border-color] duration-[var(--transition-fast)]">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-editorial text-2xl text-[var(--color-text-primary)] mb-2">
              {project.title}
            </h3>
            <p className="font-body text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-utility text-[10px] px-2 py-1 border border-[var(--color-border)] text-[var(--color-text-muted)] uppercase tracking-wider"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-utility text-xs px-3 py-1.5 border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverse)] transition-colors"
              >
                SOURCE
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="font-utility text-xs px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                LIVE
              </a>
            )}
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}

========== src/components/SkillsGrid.tsx ==========
'use client';

import { skills } from '@/lib/skills';
import SkillBar from './SkillBar';
import SectionHeading from './SectionHeading';

export default function SkillsGrid() {
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="py-8">
      <SectionHeading>Technical Proficiencies</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-grid)]">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="font-utility text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4 border-b border-[var(--color-border)] pb-2">
              {category}
            </h3>
            <div className="space-y-3">
              {skills
                .filter((s) => s.category === category)
                .map((skill) => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

========== src/components/SkillBar.tsx ==========
'use client';

import { useEffect, useRef, useState } from 'react';
import type { Skill } from '@/lib/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SkillBarProps {
  skill: Skill;
}

export default function SkillBar({ skill }: SkillBarProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="font-utility text-xs text-[var(--color-text-primary)]">
          {skill.name}
        </span>
        <span className="font-utility text-[10px] text-[var(--color-text-muted)]">
          {skill.level}%
        </span>
      </div>
      <div className="h-2 bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
        <div
          className="h-full bg-[var(--color-accent)] transition-all"
          style={{
            width: visible ? `${skill.level}%` : '0%',
            transitionDuration: prefersReduced ? '0ms' : '800ms',
          }}
        />
      </div>
    </div>
  );
}

========== src/components/Timeline.tsx ==========
'use client';

import { timeline } from '@/lib/timeline';
import ScrollReveal from './ScrollReveal';
import SectionHeading from './SectionHeading';

export default function Timeline() {
  return (
    <section id="timeline" className="py-8">
      <SectionHeading>Career Trajectory</SectionHeading>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--color-border)]" />

        <div className="space-y-8">
          {timeline.map((entry, index) => (
            <ScrollReveal key={entry.year + entry.title} delay={index * 150}>
              <div
                className={`relative pl-12 md:pl-0 md:flex md:gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot on the line */}
                <div className="absolute left-[10px] md:left-1/2 md:-translate-x-1/2 top-1 w-3 h-3 bg-[var(--color-accent)] border-2 border-[var(--color-border)]" />

                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:pl-8'}`}>
                  <span className="font-utility text-xs text-[var(--color-accent)] tracking-[0.2em]">
                    {entry.year}
                  </span>
                  <h3 className="font-editorial text-xl text-[var(--color-text-primary)] mt-1">
                    {entry.title}
                  </h3>
                  <p className="font-utility text-xs text-[var(--color-text-muted)] uppercase tracking-wider mt-1">
                    {entry.company}
                  </p>
                  <p className="font-body text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">
                    {entry.description}
                  </p>
                  {entry.highlights && (
                    <ul className={`mt-2 space-y-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      {entry.highlights.map((h) => (
                        <li key={h} className="font-body text-xs text-[var(--color-text-muted)]">
                          <span className="text-[var(--color-accent)] mr-1">—</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

========== src/components/Terminal.tsx ==========
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { siteConfig } from '@/lib/site-config';
import SectionHeading from './SectionHeading';

interface HistoryEntry {
  input: string;
  output: string;
}

const COMMANDS: Record<string, (args: string[]) => string> = {
  help: () =>
    `Available commands:\n  about     — About me\n  skills    — Technical skills\n  projects  — Featured projects\n  contact   — Contact info\n  clear     — Clear terminal\n  help      — Show this message`,
  about: () =>
    `${siteConfig.name} — Software Engineer\nBased in ${siteConfig.location}\n\nI build at the intersection of design and engineering,\ncrafting digital experiences that are precise, intentional,\nand unapologetically bold.`,
  skills: () =>
    `TypeScript ████████████████████ 95%\nReact      ████████████████████ 95%\nNext.js    ██████████████████   90%\nNode.js    ██████████████████   90%\nPostgreSQL █████████████████    85%\nDocker     ████████████████     82%`,
  projects: () =>
    `1. The Engineered Soul — Avant-garde portfolio\n2. Sentinel — Threat detection dashboard\n3. Architect — System design tool\n4. Chronicle — Developer journal\n\nType "open <name>" for details.`,
  contact: () =>
    `Email:    ${siteConfig.email}\nGitHub:   ${siteConfig.social.github}\nLinkedIn: ${siteConfig.social.linkedin}`,
  clear: () => '__CLEAR__',
};

export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { input: '', output: `Welcome to ${siteConfig.name}'s terminal. Type "help" for available commands.` },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim().toLowerCase();
      if (!trimmed) return;

      const [cmd, ...args] = trimmed.split(/\s+/);
      const command = cmd ?? '';

      if (command === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      const handler = COMMANDS[command];
      const output = handler
        ? handler(args)
        : `Command not found: ${command}. Type "help" for available commands.`;

      setHistory((prev) => [...prev, { input: trimmed, output }]);
      setInput('');
    },
    [input]
  );

  return (
    <section id="terminal" className="py-8">
      <SectionHeading>Interactive Terminal</SectionHeading>
      <div
        className="border border-[var(--color-border)] bg-[var(--color-surface)] brutal-shadow font-utility text-xs"
        role="log"
        aria-live="polite"
        aria-label="Interactive terminal"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal output */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          {history.map((entry, i) => (
            <div key={i}>
              {entry.input && (
                <div className="text-[var(--color-accent)]">
                  <span className="text-[var(--color-text-muted)]">{'>'}</span>{' '}
                  {entry.input}
                </div>
              )}
              <pre className="text-[var(--color-text-muted)] whitespace-pre-wrap">
                {entry.output}
              </pre>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-[var(--color-border)] p-3 flex items-center gap-2">
          <span className="text-[var(--color-accent)]">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[var(--color-text-primary)] font-utility text-xs"
            aria-label="Terminal input"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </section>
  );
}

========== src/components/ContactForm.tsx ==========
'use client';

import { useState, useCallback } from 'react';
import SectionHeading from './SectionHeading';
import type { ContactApiResponse } from '@/lib/types';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data: ContactApiResponse = await res.json();

      if (data.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setErrorMsg(data.error);
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  }, []);

  return (
    <section id="contact" className="py-8">
      <SectionHeading>Get in Touch</SectionHeading>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg space-y-4 border border-[var(--color-border)] bg-[var(--color-surface)] brutal-shadow p-[var(--spacing-grid)]"
      >
        <div>
          <label htmlFor="contact-name" className="block font-utility text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            className="w-full bg-transparent border border-[var(--color-border)] px-3 py-2 text-[var(--color-text-primary)] font-body text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors"
            aria-describedby={status === 'error' ? 'contact-error' : undefined}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block font-utility text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            className="w-full bg-transparent border border-[var(--color-border)] px-3 py-2 text-[var(--color-text-primary)] font-body text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors"
            aria-describedby={status === 'error' ? 'contact-error' : undefined}
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block font-utility text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            className="w-full bg-transparent border border-[var(--color-border)] px-3 py-2 text-[var(--color-text-primary)] font-body text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors resize-none"
            aria-describedby={status === 'error' ? 'contact-error' : undefined}
          />
        </div>

        {status === 'error' && (
          <p id="contact-error" className="font-utility text-xs text-[var(--color-error)]" role="alert">
            {errorMsg}
          </p>
        )}
        {status === 'success' && (
          <p className="font-utility text-xs text-[var(--color-success)]" role="status">
            Message sent successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full font-utility text-xs uppercase tracking-[0.2em] px-4 py-3 border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverse)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
        </button>
      </form>
    </section>
  );
}

========== src/components/Footer.tsx ==========
'use client';

import { siteConfig } from '@/lib/site-config';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--spacing-grid)] py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="font-utility text-xs text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
        <div className="flex gap-4">
          {Object.entries(siteConfig.social).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-utility text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider"
            >
              {key}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

========== src/components/GrainOverlay.tsx ==========
'use client';

export default function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-grain opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
      aria-hidden="true"
    />
  );
}

========== src/components/GridBackground.tsx ==========
'use client';

export default function GridBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(var(--color-border) 1px, transparent 1px),
          linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px',
        opacity: 0.08,
      }}
      aria-hidden="true"
    />
  );
}

========== src/components/LoadingState.tsx ==========
'use client';

import { useState, useEffect } from 'react';

const FRAMES = ['|', '/', '-', '\\'];

export default function LoadingState() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % FRAMES.length);
    }, 150);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-[40vh] font-utility text-sm text-[var(--color-text-muted)]"
      role="status"
      aria-label="Loading"
    >
      <span className="mr-2 text-[var(--color-accent)]">{FRAMES[frame]}</span>
      <span>LOADING SECTION...</span>
    </div>
  );
}

========== src/components/SectionHeading.tsx ==========
'use client';

interface SectionHeadingProps {
  children: React.ReactNode;
}

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2
      className="font-editorial text-3xl md:text-4xl text-[var(--color-text-primary)] mb-8 border-b border-[var(--color-border)] pb-4"
      tabIndex={-1}
    >
      {children}
    </h2>
  );
}

========== src/components/ScrollReveal.tsx ==========
'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export default function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: prefersReduced
          ? 'none'
          : `opacity 500ms ease ${delay}ms, transform 500ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

========== src/components/AccessibilityProvider.tsx ==========
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContext {
  prefersReducedMotion: boolean;
}

const AccessibilityCtx = createContext<AccessibilityContext>({
  prefersReducedMotion: false,
});

export function useAccessibility() {
  return useContext(AccessibilityCtx);
}

export default function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <AccessibilityCtx.Provider value={{ prefersReducedMotion }}>
      {children}
    </AccessibilityCtx.Provider>
  );
}

========== src/components/ErrorBoundary.tsx ==========
'use client';

interface ErrorBoundaryFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

export default function ErrorBoundaryFallback({
  error,
  resetErrorBoundary,
}: ErrorBoundaryFallbackProps) {
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred.';

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[40vh] p-8"
      role="alert"
    >
      <h2 className="font-utility text-sm text-[var(--color-accent)] uppercase tracking-[0.2em] mb-4">
        Section Error
      </h2>
      <p className="font-body text-sm text-[var(--color-text-muted)] mb-6 text-center max-w-md">
        {message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="font-utility text-xs px-4 py-2 border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverse)] transition-colors"
      >
        RETRY
      </button>
    </div>
  );
}

</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat drizzle.config.ts"}}
</tool_call>
<tool_result>
import type { Config } from 'drizzle-kit';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. ' +
    'Copy .env.example to .env.local and configure your database URL. ' +
    'Drizzle Kit commands (push, studio, generate) require a database connection.'
  );
}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
} satisfies Config;
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat .env.example"}}
</tool_call>
<tool_result>
# Optional — database connection for Drizzle ORM
# The app runs without this; only needed for DB-dependent features
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio

# Optional — public site URL for canonical references
NEXT_PUBLIC_SITE_URL=http://localhost:3000
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat postcss.config.mjs 2>/dev/null || echo 'No postcss.config.mjs found'; cat postcss.config.js 2>/dev/null || echo 'No postcss.config.js found'; ls *.config.* 2>/dev/null"}}
</tool_call>
<tool_result>
No postcss.config.mjs found
No postcss.config.js found
.env.example
drizzle.config.ts
eslint.config.mjs
next.config.ts
package.json
postcss.config.mjs
tsconfig.json
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat postcss.config.mjs"}}
</tool_call>
<tool_result>
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat eslint.config.mjs"}}
</tool_call>
<tool_result>
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && find . -name '*.test.*' -o -name '*.spec.*' | head -20"}}
</tool_call>
<tool_result>

</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && wc -l $(find src -name '*.tsx' -o -name '*.ts' | sort) 2>/dev/null"}}
</tool_call>
<tool_result>
   28 src/app/PortfolioApp.tsx
    6 src/app/api/contact/route.ts
   17 src/app/api/contact/route.ts
   23 src/app/api/health/route.ts
   42 src/app/error.tsx
  205 src/app/globals.css
   36 src/app/layout.tsx
   28 src/app/not-found.tsx
   46 src/app/page.tsx
   30 src/components/AccessibilityProvider.tsx
   82 src/components/ContactForm.tsx
   32 src/components/ErrorBoundary.tsx
   27 src/components/Footer.tsx
   15 src/components/GrainOverlay.tsx
   17 src/components/GridBackground.tsx
   71 src/components/HeroKinetic.tsx
   30 src/components/LoadingState.tsx
   29 src/components/Navigation.tsx
   40 src/components/ScrollReveal.tsx
   14 src/components/SectionHeading.tsx
   39 src/components/ShowcaseCard.tsx
   43 src/components/SkillBar.tsx
   32 src/components/SkillsGrid.tsx
   88 src/components/Terminal.tsx
   58 src/components/Timeline.tsx
   38 src/components/TitleBar.tsx
   14 src/components/WindowControls.tsx
   39 src/components/_archive/BlogPreview.tsx
   28 src/components/_archive/CursorGlow.tsx
   42 src/components/_archive/DrilldownOverlay.tsx
   25 src/components/_archive/GlitchText.tsx
   32 src/components/_archive/HorizontalScroll.tsx
   20 src/components/_archive/ParallaxLayer.tsx
   35 src/components/_archive/ProjectCard.tsx
   22 src/components/_archive/ScrollProgress.tsx
   28 src/components/_archive/SectionShell.tsx
   45 src/components/_archive/SkillMeter.tsx
   15 src/components/_archive/StatusIndicator.tsx
   50 src/components/_archive/TestimonialCarousel.tsx
   22 src/components/_archive/Typewriter.tsx
   20 src/components/_archive/WaveText.tsx
   17 src/db/index.ts
   33 src/db/schema.ts
   18 src/hooks/_archive/useScrollSpy.ts
   25 src/hooks/_archive/useTypewriter.ts
   22 src/hooks/useReducedMotion.ts
   55 src/hooks/useRouteHash.ts
   21 src/lib/_archive/achievements.ts
   44 src/lib/_archive/constants.ts
   67 src/lib/_archive/data.ts
   18 src/lib/_archive/social.ts
   33 src/lib/_archive/testimonials.ts
   29 src/lib/projects.ts
   41 src/lib/rate-limit.ts
   19 src/lib/site-config.ts
   27 src/lib/skills.ts
   42 src/lib/timeline.ts
   43 src/lib/types.ts
 1736 total
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && find . -name 'node_modules' -prune -o -name '*.test.*' -print -o -name '*.spec.*' -print -o -name 'vitest*' -print -o -name 'jest*' -print | grep -v node_modules"}}
</tool_call>
<tool_result>

</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && cat docs/remediation_1.md | head -80"}}
</tool_call>
<tool_result>
# Remediation 1 — Build Error Resolution

## Summary

40 files were updated to resolve all TypeScript build errors, ESLint warnings, and CSS compilation issues after the initial Vite-to-Next.js port.

## Key Changes

### TypeScript Fixes
1. Replaced all `any` types with proper types or `unknown`
2. Added missing type imports
3. Fixed component prop interfaces
4. Resolved `noUncheckedIndexedAccess` violations
5. Added null guards for optional database access

### CSS Fixes
1. Moved `@import url()` for Google Fonts before `@import "tailwindcss"`
2. Defined all missing CSS custom properties in `@theme` block
3. Added day/night theme overrides for all color variables
4. Fixed scrollbar border-radius to 0

### Architecture Fixes
1. Ensured `page.tsx` has `"use client"` directive
2. Fixed import path for `PortfolioApp` (from `@/components/` to `@/app/`)
3. Added `react-error-boundary` dependency
4. Created `ErrorBoundaryFallback` component with `unknown` error type

### ARIA & Accessibility
1. Added `aria-current="page"` to active navigation items
2. Added `role="log"` and `aria-live="polite"` to terminal
3. Added `aria-label` to form inputs
4. Added `aria-hidden="true"` to decorative elements

## Files Modified

- `src/app/layout.tsx` — ThemeScript inline, metadata from site-config
- `src/app/page.tsx` — Client Component, ErrorBoundary wrapping
- `src/app/PortfolioApp.tsx` — DraggableStatus, Suspense wrapping per section
- `src/app/globals.css` — Complete @theme token system, day overrides
- `src/app/error.tsx` — Global error handler
- `src/app/not-found.tsx` — Brutalist 404 page
- `src/app/api/contact/route.ts` — Validation, rate limiting, DB insert
- `src/app/api/health/route.ts` — Optional DB connectivity check
- `src/hooks/useRouteHash.ts` — Hash-based routing with validation
- `src/hooks/useReducedMotion.ts` — Media query hook
- All 17 active components — Type fixes, accessibility improvements
- `src/lib/types.ts` — Consolidated Project type, ContactApiResponse
- `src/lib/site-config.ts` — Centralized configuration
- `src/lib/rate-limit.ts` — Sliding window rate limiter
- `src/db/index.ts` — Optional database connection
- `src/db/schema.ts` — Drizzle table definitions
</tool_result>

Now let me look at the archived components to understand the full picture:

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && head -5 src/components/_archive/*.tsx"}}
</tool_call>
<tool_result>
==> src/components/_archive/BlogPreview.tsx <==
'use client';

import { useState } from 'react';

==> src/components/_archive/CursorGlow.tsx <==
'use client';

import { useEffect, useState, useRef } from 'react';

==> src/components/_archive/DrilldownOverlay.tsx <==
'use client';

import { useState, useCallback, useEffect } from 'react';

==> src/components/_archive/GlitchText.tsx <==
'use client';

==> src/components/_archive/HorizontalScroll.tsx <==
'use client';

import { useRef, useEffect, useState } from 'react';

==> src/components/_archive/ParallaxLayer.tsx <==
'use client';

import { useEffect, useState } from 'react';

==> src/components/_archive/ProjectCard.tsx <==
'use client';

import type { Project } from '@/lib/types';

==> src/components/_archive/ScrollProgress.tsx <==
'use client';

import { useEffect, useState } from 'react';

==> src/components/_archive/SectionShell.tsx <==
'use client';

import ScrollReveal from '@/components/ScrollReveal';

==> src/components/_archive/SkillMeter.tsx <==
'use client';

import { useEffect, useRef, useState } from 'react';

==> src/components/_archive/StatusIndicator.tsx <==
'use client';

export default function StatusIndicator() {

==> src/components/_archive/TestimonialCarousel.tsx <==
'use client';

import { useState, useEffect, useCallback } from 'react';

==> src/components/_archive/Typewriter.tsx <==
'use client';

==> src/components/_archive/WaveText.tsx <==
'use client';

==> src/components/_archive/WaveText.tsx <==
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && grep -rn '\\-\\-border-color\\|\\-\\-text-primary\\|\\-\\-text-muted\\|\\-\\-bg-color\\|\\-\\-accent-color' src/components/_archive/ | head -30"}}
</tool_call>
<tool_result>
src/components/_archive/DrilldownOverlay.tsx:18:          borderColor: 'var(--border-color)',
src/components/_archive/DrilldownOverlay.tsx:25:          color: 'var(--text-primary)',
src/components/_archive/DrilldownOverlay.tsx:31:          color: 'var(--text-muted)',
src/components/_archive/GlitchText.tsx:12:      color: 'var(--accent-color)',
src/components/_archive/HorizontalScroll.tsx:28:          borderColor: 'var(--border-color)',
src/components/_archive/HorizontalScroll.tsx:43:          color: 'var(--text-muted)',
src/components/_archive/ParallaxLayer.tsx:10:        color: 'var(--text-primary)',
src/components/_archive/ProjectCard.tsx:15:          borderColor: 'var(--border-color)',
src/components/_archive/ProjectCard.tsx:21:          borderColor: 'var(--border-color)',
src/components/_archive/ProjectCard.tsx:25:          color: 'var(--text-muted)',
src/components/_archive/ProjectCard.tsx:38:          color: 'var(--text-muted)',
src/components/_archive/ProjectCard.tsx:49:          borderColor: 'var(--border-color)',
src/components/_archive/ScrollProgress.tsx:11:        background: 'var(--accent-color)',
src/components/_archive/SectionShell.tsx:17:          borderColor: 'var(--border-color)',
src/components/_archive/SectionShell.tsx:27:          color: 'var(--accent-color)',
src/components/_archive/SkillMeter.tsx:18:          color: 'var(--text-muted)',
src/components/_archive/SkillMeter.tsx:25:          borderColor: 'var(--border-color)',
src/components/_archive/SkillMeter.tsx:28:          background: 'var(--accent-color)',
src/components/_archive/TestimonialCarousel.tsx:17:          borderColor: 'var(--border-color)',
src/components/_archive/TestimonialCarousel.tsx:24:          color: 'var(--text-muted)',
src/components/_archive/TestimonialCarousel.tsx:30:          color: 'var(--accent-color)',
src/components/_archive/TestimonialCarousel.tsx:48:          borderColor: 'var(--border-color)',
src/components/_archive/TestimonialCarousel.tsx:50:          color: 'var(--text-muted)',
src/components/_archive/Typewriter.tsx:15:        color: 'var(--accent-color)',
src/components/_archive/WaveText.tsx:11:        color: 'var(--text-primary)',
src/components/_archive/StatusIndicator.tsx:9:      borderColor: 'var(--border-color)',
src/components/_archive/BlogPreview.tsx:22:          borderColor: 'var(--border-color)',
src/components/_archive/BlogPreview.tsx:28:          color: 'var(--text-muted)',
src/components/_archive/BlogPreview.tsx:42:          color: 'var(--accent-color)',
src/components/_archive/BlogPreview.tsx:48:          borderColor: 'var(--border-color)',
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && grep -rn 'AccessibilityProvider' src/ --include='*.tsx' --include='*.ts' | grep -v '_archive'"}}
</tool_call>
<tool_result>
src/components/AccessibilityProvider.tsx:14:export function useAccessibility() {
src/components/AccessibilityProvider.tsx:16:export default function AccessibilityProvider({ children }: { children: React.ReactNode }) {
</tool_result>

<tool_call>
{"name": "shell", "arguments": {"command": "cd /home/user/personal-portfolio-next && du -sh src/ && find src -name '*.tsx' -o -name '*.ts' | wc -l"}}
</tool_call>
<tool_result>
148K	src/
55
</tool_result>

Now I have a comprehensive understanding of the entire codebase. Let me compile the audit plan.

---

# Phase 1: ANALYZE — Deep Codebase Audit Report

## Executive Summary

I have completed a meticulous review of the entire "The Engineered Soul" v2.0 portfolio codebase — 55 TypeScript/TSX files across 1,736 lines of active source code, plus 14 archived components. The project is a **Next.js 16 App Router** portfolio using a **Client-Side SPA Orchestrator model** with hash-based routing, a **Tactile Brutalism** design system, and an optional **Drizzle + PostgreSQL** backend.

The project is in a **stable, buildable state** after four remediation phases. However, I've identified a range of issues spanning **security, architecture, accessibility, performance, type safety, and maintainability** that need attention.

---

## Phase 2: PLAN — Structured Audit Roadmap

### Audit Dimensions

I will organize findings across **8 audit dimensions**, ranked by severity:

| # | Dimension | Severity | Findings |
|---|-----------|----------|----------|
| 1 | **Security** | Critical-Moderate | 4 findings |
| 2 | **Type Safety & TypeScript Strictness** | High-Low | 5 findings |
| 3 | **Architecture & Design Consistency** | High-Low | 6 findings |
| 4 | **Accessibility (WCAG)** | Moderate-Low | 5 findings |
| 5 | **Performance** | Moderate-Low | 3 findings |
| 6 | **Code Quality & Maintainability** | Moderate-Low | 6 findings |
| 7 | **Testing** | High | 1 finding |
| 8 | **Design System Integrity** | Moderate-Low | 3 findings |

---

### DIMENSION 1: SECURITY

#### Finding S1 — Critical: Contact API body parsing has no size limit
**File**: `src/app/api/contact/route.ts:25-29`
**Issue**: `request.json()` accepts an unbounded body. An attacker can send a multi-gigabyte JSON payload, consuming server memory and potentially causing OOM.
**Fix**: Use `request.json()` with a byte limit check via `Content-Length` header, or implement a streaming parser with a size cap. At minimum, validate `Content-Length` against a reasonable max (e.g., 10KB).

#### Finding S2 — High: Email validation is trivially bypassed
**File**: `src/app/api/contact/route.ts:13`
**Issue**: `email.includes('@')` accepts `@`, `@b`, `@@@@@`, etc. No RFC 5322 compliance, no length limit, no normalization.
**Fix**: Use a proper email validation regex or library (e.g., a Zod schema). At minimum: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` with a max length check.

#### Finding S3 — Moderate: Rate limiter uses `x-forwarded-for` without trust boundary
**File**: `src/app/api/contact/route.ts:22`
**Issue**: `x-forwarded-for` is trivially spoofable. Without a trust proxy configuration, any client can set arbitrary IPs and bypass rate limiting entirely.
**Fix**: Document the trust boundary. On Vercel/Render, this is handled by the platform. For custom deployments, implement IP extraction with a trusted proxy list.

#### Finding S4 — Low: Contact form has no CSRF protection
**File**: `src/app/api/contact/route.ts`
**Issue**: The POST endpoint accepts requests from any origin. While Next.js API routes have some built-in protections, a `Content-Type: application/json` header provides implicit CSRF protection for now — but this is fragile.
**Fix**: Add explicit origin validation or CSRF token for production.

---

### DIMENSION 2: TYPE SAFETY & TYPESCRIPT STRICTNESS

#### Finding T1 — High: `error.tsx` types `error` as `Error` but Next.js may pass `unknown`
**File**: `src/app/error.tsx:5-8`
**Issue**: The props type declares `error: Error & { digest?: string }`, but Next.js 16 App Router `error.tsx` receives `error: unknown` in practice (consistent with the project's own lesson about `react-error-boundary` v4). If a non-Error is thrown, `error.message` will throw at runtime.
**Fix**: Type as `error: unknown` and add an `instanceof Error` guard, exactly as done in `page.tsx`'s `ErrorFallback`.

#### Finding T2 — Moderate: `SECTIONS` Record in `PortfolioApp.tsx` uses inline anonymous components
**File**: `src/app/PortfolioApp.tsx:22-35`
**Issue**: The `projects` section uses an anonymous arrow function `() => ( ... )` in the SECTIONS map. This creates a new component reference on every render, causing the `ErrorBoundary` and `Suspense` to unmount/remount the projects section every time. The anonymous function also has no `displayName`, making React DevTools debugging harder.
**Fix**: Extract the projects section into a named `ProjectsSection` component.

#### Finding T3 — Low: `DraggableStatus` re-renders on every mouse move
**File**: `src/app/PortfolioApp.tsx:44-73`
**Issue**: `setPos` on every `mousemove` event triggers a re-render of the entire `PortfolioApp` tree (not just the status bar). The `pos` state is defined in the parent component.
**Fix**: Memoize the `DraggableStatus` component with `React.memo`, or use `useRef` for position tracking and only set state on `mouseup`.

#### Finding T4 — Low: `SkillBar` doesn't guard against `null` observer entry
**File**: `src/components/SkillBar.tsx:22`
**Issue**: `([entry]) => { if (entry?.isIntersecting)` — the `entry` parameter in `IntersectionObserver` callback is typed as `IntersectionObserverEntry | undefined` with `noUncheckedIndexedAccess`, but the optional chaining is correct. However, the disconnect happens inside the check, so if entry is ever undefined, the observer is never disconnected, causing a memory leak.
**Fix**: Add an `else return` or disconnect in cleanup regardless.

#### Finding T5 — Moderate: `Terminal` component `key` in history array uses index
**File**: `src/components/Terminal.tsx:70`
**Issue**: `{history.map((entry, i) => (<div key={i}>...` — Using array index as key for a mutable list that can be cleared and rebuilt. If entries are added/removed out of order (e.g., the `clear` command), React may incorrectly reuse DOM nodes.
**Fix**: Use a monotonically increasing ID counter or timestamp as the key.

---

### DIMENSION 3: ARCHITECTURE & DESIGN CONSISTENCY

#### Finding A1 — High: `AccessibilityProvider` is defined but never mounted
**File**: `src/components/AccessibilityProvider.tsx`
**Issue**: The component exists, exports `useAccessibility()`, but is never imported or used in `layout.tsx`, `page.tsx`, or `PortfolioApp.tsx`. The `useReducedMotion` hook is used directly in 4 components instead. This creates confusion about which pattern is canonical.
**Fix**: Either mount `AccessibilityProvider` in `layout.tsx` and have all components use `useAccessibility()`, or delete `AccessibilityProvider.tsx` entirely and standardize on the standalone `useReducedMotion` hook. The latter is cleaner given current adoption.

#### Finding A2 — High: `not-found.tsx` has no `"use client"` directive but uses no server features
**File**: `src/app/not-found.tsx`
**Issue**: This is a Server Component by default. It uses hardcoded styles (not CSS variables from the design system) with colors `#e8c547` and `#918983` that will work, but `font-family: 'var(--font-mono)'` resolves through the CSS cascade rather than the Tailwind system. More critically, the `<a href="/">` link will cause a full page reload instead of hash-based navigation, breaking the SPA illusion.
**Fix**: Add `"use client"` directive and use the Tailwind utility classes for consistency.

#### Finding A3 — Moderate: Duplicate `ErrorBoundary` components
**File**: `src/components/ErrorBoundary.tsx` and `src/app/page.tsx`
**Issue**: There are two error fallback implementations — `ErrorBoundaryFallback` in `src/components/ErrorBoundary.tsx` (used in `PortfolioApp.tsx`) and an inline `ErrorFallback` in `page.tsx`. They have similar structure but different styling (the inline one uses raw hex values and inline styles; the component uses Tailwind classes and CSS variables).
**Fix**: Consolidate into a single reusable component with a `level` prop (`"page"` vs `"section"`) to control styling.

#### Finding A4 — Moderate: `error.tsx` hardcodes colors instead of using CSS variables
**File**: `src/app/error.tsx:16-30`
**Issue**: The global error page uses `background: '#0d0d0d'`, `color: '#e8c547'`, `color: '#918983'` — these are raw hex values that will be wrong in Day theme. If a user in Day theme hits a global error, they'll see a dark-themed error page on a light-themed site.
**Fix**: Use CSS custom properties (`var(--color-bg)`, `var(--color-accent)`, etc.) so the error page respects the active theme.

#### Finding A5 — Low: `SECTIONS` map recreates objects on every render
**File**: `src/app/PortfolioApp.tsx:19-36`
**Issue**: The `SECTIONS` constant is defined inside the component body, so a new Record is created on every render. This isn't a performance bottleneck but is a pattern smell.
**Fix**: Move `SECTIONS` outside the component or wrap in `useMemo`.

#### Finding A6 — Low: `GridBackground` and `GrainOverlay` are always rendered even for non-visible sections
**File**: `src/app/PortfolioApp.tsx:83-84`
**Issue**: Both are `position: fixed` overlays that render regardless of which section is active. This is correct for the design intent (they're global backgrounds) but the grain overlay in particular generates a heavy SVG filter on every paint.
**Fix**: Already optimized with `pointer-events: none` and low opacity. Acceptable, but note that the SVG `feTurbulence` filter can cause GPU strain on lower-end devices. Consider making grain togglable.

---

### DIMENSION 4: ACCESSIBILITY (WCAG)

#### Finding A11 — Moderate: `WindowControls` buttons are non-functional
**File**: `src/components/WindowControls.tsx`
**Issue**: The traffic light buttons (close/minimize/maximize) are purely decorative but are real `<button>` elements with `aria-label`. A screen reader user will expect them to perform the labeled actions. When they don't, this creates confusion.
**Fix**: Either add `tabIndex={-1}` and `aria-hidden="true"` to make them truly decorative, or implement minimal behavior (e.g., minimize = collapse content, close = navigate to a "closed" state).

#### Finding A12 — Moderate: `Terminal` input has no submit button for screen readers
**File**: `src/components/Terminal.tsx:82-93`
**Issue**: The terminal input relies on pressing Enter to submit, but there's no visible submit button. Screen reader users navigating in forms mode may not realize Enter is the submit mechanism.
**Fix**: Add a visually hidden submit button: `<button type="submit" className="sr-only">Execute</button>`.

#### Finding A13 — Low: `HeroKinetic` announces scrambled text to screen readers
**File**: `src/components/HeroKinetic.tsx:49`
**Issue**: The `aria-live="polite"` region announces every intermediate scrambled state (e.g., "S0FTWARE 3NG1NE3R", then "S0FTWARE ENGINE3R", etc.). This creates a noisy, confusing experience for screen reader users.
**Fix**: Only announce the final resolved text. Use a separate `aria-live` element that only updates when the text is fully resolved, or move `aria-live` to a visually hidden element that receives only the final text.

#### Finding A14 — Low: `DraggableStatus` has no keyboard equivalent
**File**: `src/app/PortfolioApp.tsx:45-72`
**Issue**: The status bar is draggable by mouse but has no keyboard interaction. Keyboard-only users cannot reposition it.
**Fix**: This is a cosmetic feature. Either remove the draggable behavior and make it static, or add arrow key handlers with `role="application"`.

#### Finding A15 — Low: `GrainOverlay` SVG inline may not be recognized by all AT
**File**: `src/components/GrainOverlay.tsx:6-9`
**Issue**: The data URI SVG used as a background image is purely decorative and has `aria-hidden="true"`, which is correct. No issue, but worth noting that some older screen readers may still try to describe SVG backgrounds.
**Status**: Acceptable as-is.

---

### DIMENSION 5: PERFORMANCE

#### Finding P1 — Moderate: No font-display strategy for Google Fonts
**File**: `src/app/globals.css:1`
**Issue**: The `@import url(...)` loads Google Fonts with `display=swap` in the URL, which is correct. However, importing fonts via CSS `@import` rather than `<link>` in the HTML `<head>` delays font discovery. The browser must first download and parse the CSS before it knows about the fonts.
**Fix**: Move font loading to a `<link>` tag in `layout.tsx` `<head>` for earlier discovery. The CSS `@import` can remain as a fallback.

#### Finding P2 — Low: `HeroKinetic` scramble effect runs at 50ms intervals (20fps) regardless of visibility
**File**: `src/components/HeroKinetic.tsx:42-51`
**Issue**: The scramble `setTimeout` continues running even when the user navigates away from the hero section. The effect cleanup only runs when the component unmounts (which happens if the user navigates to a different hash section). This is acceptable since the component unmounts on navigation, but if the SPA model changes to keep all sections mounted, this would leak.
**Fix**: Currently acceptable. Document the assumption.

#### Finding P3 — Low: SVG noise filter in GrainOverlay causes repaints
**File**: `src/components/GrainOverlay.tsx:7-8`
**Issue**: The `feTurbulence` SVG filter is computationally expensive. On lower-end devices, it can cause visible jank during scrolling. The effect is subtle (0.04 opacity) but the GPU cost is non-trivial.
**Fix**: Consider caching the noise pattern as a static PNG tile in `public/` and using `background-image` instead. This trades a few KB of bandwidth for zero GPU computation.

---

### DIMENSION 6: CODE QUALITY & MAINTAINABILITY

#### Finding C1 — Moderate: Inconsistent coding style between `error.tsx` and `ErrorBoundary.tsx`
**File**: `src/app/error.tsx` vs `src/components/ErrorBoundary.tsx`
**Issue**: `error.tsx` uses inline `style` objects with raw hex values. `ErrorBoundary.tsx` uses Tailwind utility classes with CSS variable references. This inconsistency suggests different authors or different points in the remediation cycle.
**Fix**: Standardize on Tailwind utility classes everywhere.

#### Finding C2 — Moderate: No test suite exists
**File**: `package.json` declares `"test": "vitest"` but no test files exist.
**Issue**: Despite the README and skill document stating "TDD preferred" and "Test behavior over implementation", there are zero test files. The `vitest` dependency is installed but completely unused.
**Fix**: This is the single biggest quality gap. See Dimension 7.

#### Finding C3 — Low: `Terminal` commands object is defined at module level
**File**: `src/components/Terminal.tsx:17-32`
**Issue**: `COMMANDS` references `siteConfig` at module scope. If `siteConfig` were to become dynamic (e.g., fetched from an API), this would break. Currently fine since `siteConfig` is a static import.
**Status**: Acceptable as-is.

#### Finding C4 — Low: `_archive` directories contain dead imports
**File**: `src/components/_archive/SectionShell.tsx:3`
**Issue**: `import ScrollReveal from '@/components/ScrollReveal';` — this works currently but if `ScrollReveal` is ever moved or renamed, the archived files will cause confusing build errors.
**Fix**: This is why they're archived. No action needed unless reintegrating.

#### Finding C5 — Low: `site-config.ts` has placeholder email and social URLs
**File**: `src/lib/site-config.ts`
**Issue**: `nicholas@example.com` is not a real email. Social URLs are also placeholder. If deployed as-is, the contact form would send to a non-existent email.
**Fix**: Document that these must be updated before production deployment.

#### Finding C6 — Low: `not-found.tsx` uses `<a href="/">` instead of Next.js `<Link>`
**File**: `src/app/not-found.tsx:26`
**Issue**: The "RETURN HOME" link uses a plain `<a>` tag, causing a full page reload. While this is a Server Component (no `"use client"`), Next.js `<Link>` works in both server and client components.
**Fix**: Import and use `next/link` for client-side navigation.

---

### DIMENSION 7: TESTING — CRITICAL GAP

#### Finding TEST1 — High: Zero test coverage
**Scope**: Entire project
**Issue**: The project has `vitest` as a dependency and `npm test` as a script, but there are **zero test files** anywhere in the codebase. The README claims "TDD preferred" and the skill document references "Test behavior over implementation; use mocks for DB operations." This is a complete gap.

**Minimum Viable Test Suite**:
1. `src/lib/rate-limit.ts` — Unit tests for the sliding window algorithm (boundary cases: exactly at limit, expired window, new key)
2. `src/hooks/useRouteHash.ts` — Unit tests for hash parsing, invalid sections, default fallback
3. `src/hooks/useReducedMotion.ts` — Unit tests for media query listener
4. `src/app/api/contact/route.ts` — Integration tests for validation, rate limiting, response format
5. `src/app/api/health/route.ts` — Integration tests for DB and non-DB paths
6. `src/components/Terminal.tsx` — Component tests for command execution, clear, unknown command
7. `src/components/ContactForm.tsx` — Component tests for form submission, loading state, error state, success state

---

### DIMENSION 8: DESIGN SYSTEM INTEGRITY

#### Finding D1 — Moderate: `not-found.tsx` and `error.tsx` bypass the design token system
**Files**: `src/app/not-found.tsx`, `src/app/error.tsx`
**Issue**: Both use raw hex colors (`#e8c547`, `#918983`, `#0d0d0d`) and inline `style` props instead of Tailwind utility classes referencing CSS custom properties. This means:
- Day theme will look broken (dark colors on light background)
- Any future color token changes won't cascade to these pages

#### Finding D2 — Low: Archived components use `var(--border-color)` etc. — known debt
**Files**: All `_archive/` components
**Issue**: 30+ references to undefined CSS variables. Already documented. No action needed unless reintegrating.

#### Finding D3 — Low: `window.location.hash` set directly in `navigateTo`
**File**: `src/hooks/useRouteHash.ts:18`
**Issue**: `window.location.hash = section` triggers a browser scroll-into-view behavior that may conflict with smooth scrolling or fixed headers. The hook handles focus management but not scroll position (it relies on browser default).
**Fix**: Use `history.pushState` or `history.replaceState` with manual scroll control for more predictable behavior, especially with the sticky title bar.

---

## Deliverable Summary

Here is the consolidated audit plan with prioritized action items:

### Phase 1 — Critical (Do First)
| # | Finding | File | Action |
|---|---------|------|--------|
| S1 | No request body size limit | `api/contact/route.ts` | Add Content-Length validation |
| S2 | Trivial email validation | `api/contact/route.ts` | Implement proper regex/Zod validation |
| T1 | `error.tsx` types `error` as `Error` not `unknown` | `app/error.tsx` | Fix type + add instanceof guard |
| TEST1 | Zero test coverage | Entire project | Add vitest + minimum viable test suite |

### Phase 2 — High Priority
| # | Finding | File | Action |
|---|---------|------|--------|
| A1 | `AccessibilityProvider` unused | `components/AccessibilityProvider.tsx` | Delete or integrate |
| A3 | Duplicate error fallbacks | `page.tsx` + `components/ErrorBoundary.tsx` | Consolidate |
| A4 | `error.tsx` hardcoded colors | `app/error.tsx` | Use CSS variables |
| D1 | `not-found.tsx`/`error.tsx` bypass design tokens | `not-found.tsx`, `error.tsx` | Convert to Tailwind + CSS vars |
| T2 | Anonymous inline component in SECTIONS | `PortfolioApp.tsx` | Extract named component |

### Phase 3 — Moderate Priority
| # | Finding | File | Action |
|---|---------|------|--------|
| A2 | `not-found.tsx` no `"use client"`, uses `<a>` | `not-found.tsx` | Add directive + use `next/link` |
| A11 | `WindowControls` misleading labels | `WindowControls.tsx` | Make decorative or functional |
| A12 | Terminal no visible submit | `Terminal.tsx` | Add sr-only submit button |
| A13 | Hero announces scrambled text | `HeroKinetic.tsx` | Only announce final text |
| P1 | Font loading via CSS @import | `globals.css` + `layout.tsx` | Move to `<link>` tag |
| T5 | Terminal history uses index key | `Terminal.tsx` | Use monotonic ID |
| S3 | Rate limiter IP spoofing | `api/contact/route.ts` | Document trust boundary |

### Phase 4 — Low Priority
| # | Finding | File | Action |
|---|---------|------|--------|
| T3 | DraggableStatus re-renders on mousemove | `PortfolioApp.tsx` | Memoize or use ref |
| T4 | SkillBar observer edge case | `SkillBar.tsx` | Add null guard |
| A5 | SECTIONS recreated on render | `PortfolioApp.tsx` | Move outside component |
| A6 | GrainOverlay GPU cost | `GrainOverlay.tsx` | Consider static PNG |
| P3 | SVG noise filter repaints | `GrainOverlay.tsx` | Cache as PNG tile |
| C1 | Inline style vs Tailwind inconsistency | `error.tsx` | Standardize |
| C5 | Placeholder email in site-config | `site-config.ts` | Document |
| C6 | Plain `<a>` in not-found | `not-found.tsx` | Use next/link |
| D3 | Direct hash assignment | `useRouteHash.ts` | Consider history API |

---

## Phase 3: VALIDATE — Confirmation Checkpoint

This is where I pause for your review. Here's what I'm proposing:

**Would you like me to proceed with implementing fixes for all findings?** I suggest tackling them in the priority order above:

1. **First pass**: Security + Type Safety + Test scaffolding (Critical)
2. **Second pass**: Architecture cleanup + Design token compliance (High)
3. **Third pass**: Accessibility improvements (Moderate)
4. **Fourth pass**: Performance + Code quality polish (Low)

Alternatively, if you'd like me to focus on a specific dimension (e.g., "just fix security and add tests"), I can scope accordingly.
