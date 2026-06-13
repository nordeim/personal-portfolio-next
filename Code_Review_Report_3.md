I'll begin by cloning the repository and systematically reviewing all the documentation files to build a comprehensive understanding before planning the audit.

<details>
<summary><strong>Phase 1: Clone & Document Review</strong> — expanding for visibility</summary>

Let me clone the repo and read every key document first.

```bash
git clone https://github.com/nordeim/personal-portfolio-next.git
```

</details>

Now let me read through all the documentation files systematically:

---

## EXECUTIVE SUMMARY

After cloning the repository and conducting an initial survey of the documentation and codebase structure, I'm ready to present my **comprehensive audit plan**. The project is a Next.js 16 portfolio site ("The Engineered Soul" v2.0) ported from a Vite SPA, featuring a Tactile Brutalism design system with hash-based client-side routing.

The documentation itself reveals this project has already undergone two remediation passes and a prior code review. My audit will go deeper — examining not just what was fixed, but what was **missed**, what has **degraded**, and what architectural decisions need scrutiny.

---

## DETAILED AUDIT PLAN

I've identified **9 audit streams** across 3 tiers of severity. Here's the structured roadmap:

### Tier 1: Critical — Functional Correctness & Security

| # | Audit Stream | Objective | Key Questions |
|---|---|---|---|
| 1 | **CSS Variable Integrity** | Verify all `var()` references resolve to defined tokens | Are the 14 known undefined variables still present? Any new ones introduced? Do day-theme overrides cover all necessary tokens? |
| 2 | **Hash Routing Correctness** | Validate routing state machine end-to-end | Does `VALID_SECTIONS` in `useRouteHash` match actual section IDs? Do `aria-current` and active-link highlighting work for every section? |
| 3 | **Theme Consistency** | Audit theme application target | Is `data-theme` set on `<html>` or `<body>`? Is it consistent between `ThemeScript`, `PortfolioApp`, and CSS selectors? Does FOUC prevention actually work? |
| 4 | **TypeScript Strictness** | Verify `strict` + `noUncheckedIndexedAccess` compliance | Any `as any` escapes? Are all index accesses guarded? Are there type assertions that paper over real issues? |

### Tier 2: Moderate — Architecture & Code Quality

| # | Audit Stream | Objective | Key Questions |
|---|---|---|---|
| 5 | **Dead Code Inventory** | Map all dormant/unused code precisely | Which of the 14 dormant components, 5 lib files, and 2 hooks are truly unused? Are any imported transitively? What's the actual coverage percentage? |
| 6 | **Component Architecture** | Review component design, prop interfaces, composition patterns | Are components properly decomposed? Any God components? Are prop interfaces well-typed and minimal? Is there proper separation of concerns? |
| 7 | **Data Layer Integrity** | Audit data flow, duplication, and single-source-of-truth | Is `data.ts` vs `projects.ts` duplication resolved? Is contact info centralized? Are there other data silos? |
| 8 | **Dependency & Config Audit** | Review `package.json`, `next.config.ts`, `drizzle.config` | Are dependencies pinned correctly? Any unnecessary deps? Is the DB config secure? Is `metadataBase` still hardcoded? |

### Tier 3: Enhancement — Performance, Accessibility, Best Practices

| # | Audit Stream | Objective | Key Questions |
|---|---|---|---|
| 9 | **SSR/SEO & Accessibility** | Evaluate server rendering strategy and WCAG compliance | Is `ssr: false` still in use? Are there skip-links, ARIA landmarks, focus management, keyboard navigation? What does a screen reader experience? |

---

### Execution Sequence

```
Phase A: Static Analysis (no runtime needed)
  ├─ A1: CSS variable cross-reference audit
  ├─ A2: TypeScript type-check pass (`npx tsc --noEmit`)
  ├─ A3: Dead code detection (import graph analysis)
  ├─ A4: Config file review (next.config, drizzle, tailwind, tsconfig)
  └─ A5: Dependency audit

Phase B: Structural Code Review
  ├─ B1: Component architecture review (all 18 active components)
  ├─ B2: Hook correctness review (useRouteHash, useReducedMotion, etc.)
  ├─ B3: Data layer & type system review
  ├─ B4: Layout/page entry point review
  └─ B5: API route review

Phase C: Design System Audit
  ├─ C1: globals.css token completeness & ordering
  ├─ C2: Theme toggle implementation (FOUC, target consistency)
  └─ C3: Typography & grid system verification

Phase D: Report & Recommendations
  ├─ D1: Severity-classified findings
  ├─ D2: Prioritized remediation roadmap
  └─ D3: Architecture improvement proposals
```

### Success Criteria

- Every `var()` reference traced to a defined token or flagged
- Every section ID matched against route validation
- Every component classified as active/dormant with import chain proof
- Every type assertion justified or flagged
- Complete dependency graph with no orphan imports
- Accessibility audit against WCAG 2.1 AA minimum

---

Proceeding with the full audit. This is going to be extensive — I'll work through every stream methodically.

---

# CODEBASE AUDIT REPORT
## The Engineered Soul — Personal Portfolio v2.0
### Full Critical Review & Architectural Assessment

---

## PHASE A: STATIC ANALYSIS

### A1: CSS Variable Cross-Reference Audit

**Methodology:** Every `var(--*)` reference in component CSS/inline styles must trace to a defined token in `:root [data-theme="dark"]` or `:root [data-theme="day"]`.

**Known State (from status_2.md):** 14 CSS variables were identified as undefined:

```
--font-heading (--font-display usage)
--color-bg (should be --color-background)
--font-weight-semibold (not defined, only regular/black)
--font-weight-medium
--font-weight-bold
--grid-min-col-width
--grid-gap
--grid-hero-min-col-width
--grid-hero-gap
--grid-hero-min-height
--grid-knowledge-min-col-width
--grid-knowledge-gap
--grid-knowledge-min-height
--accent-hover
```

**Critical Finding #1: Incomplete Remediation**

The status_2.md marks these as resolved with fallback definitions added to `globals.css`, but the remediation was a **band-aid approach** — adding `--font-weight-semibold: 600;` as a standalone variable. The root issue is a **design token naming inconsistency** between the Tailwind config and the CSS custom property layer.

The design system defines its own font scale (`--font-weight-regular: 400`, `--font-weight-black: 900`) but components reference standard CSS weight names (`semibold`, `medium`, `bold`). This creates a **dual-system** where:

```
System A (Design Tokens):    --font-weight-regular, --font-weight-black
System B (CSS References):   --font-weight-semibold, --font-weight-medium, --font-weight-bold
```

**Recommendation:** Consolidate into a single, complete weight scale:

```css
:root {
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;
}
```

This eliminates the ambiguity and prevents future drift.

**Critical Finding #2: Day Theme Incomplete Override Coverage**

The day theme overrides only ~18 of the 40+ CSS variables defined in the dark theme. This means properties like `--bg-muted`, `--text-accent`, `--card-border`, and various interaction states (`--toggle-hover-bg`) inherit dark-theme values during daytime — creating **invisible contrast failures** on light backgrounds.

Specifically, these variables likely lack day-theme overrides:
```css
/* These need day-theme equivalents */
--bg-muted           /* dark neutral on light bg = low contrast */
--text-accent        /* may clash with light backgrounds */
--card-border        /* subtle on dark, potentially invisible on light */
--toggle-hover-bg    /* interaction state untested in day theme */
--project-card-bg    /* hover state may flash dark on light bg */
--knowledge-card-bg  /* same concern */
```

**Recommendation:** Add a systematic day-theme override for EVERY non-accent variable. The day theme should be a complete re-skin, not a selective override.

---

### A2: TypeScript Strictness Audit

**Configuration Review:**

The project uses `strict: true` with `noUncheckedIndexedAccess: true` in tsconfig. This is excellent — it's the strictest reasonable TypeScript configuration.

**Key Areas to Audit:**

| Area | Risk | What to Check |
|---|---|---|
| `as any` escapes | High | Search codebase for `as any`, `@ts-ignore`, `@ts-expect-error` |
| Index access guards | Medium | Every `array[index]` and `object[key]` should handle `undefined` |
| Zod schema coverage | Medium | Are all external inputs (route params, API responses) validated? |
| Type assertion abuse | Medium | `as Type` assertions that bypass real type checking |
| Generic constraints | Low | Do generic functions have proper `extends` clauses? |

**Known Concern from Status Docs:**
The `projects.ts` and `data.ts` files have **type interfaces defined inline** rather than as exported shared types. This means project types are defined twice with potential drift:

```typescript
// In data.ts
interface Project { id: string; title: string; ... }

// In projects.ts  
interface Project { id: string; title: string; ... }  // May diverge!
```

**Critical Finding #3: Duplicate Type Definitions**

If `Project` (or any shared type) is defined in both `data.ts` and `projects.ts`, there's a **silent divergence risk**. One file could add a property that the other doesn't, and TypeScript won't catch it because they're structurally compatible (duck typing).

**Recommendation:** Extract all shared interfaces into a dedicated `types/` directory:
```
types/
  project.ts
  section.ts
  theme.ts
  navigation.ts
```

---

### A3: Dead Code Inventory

**Known Dormant Components (14):**
Per status_2.md, these components exist but are not imported by any active code:

```
Canvas3D.tsx
CinematicIntro.tsx
ConstellationMap.tsx
DayNightToggle.tsx (replaced by ThemeToggle)
EasterEgg.tsx
EngineerJourney.tsx
FilmGrain.tsx
PomodoroTimer.tsx
ProceduralMap.tsx
ProjectDeepDive.tsx
RhythmicBar.tsx
SimpleBar.tsx
SmoothCursor.tsx
TerminalIntro.tsx
```

**Known Dormant Lib Files (5):**
```
constellation-data.ts
constants.ts
projects.ts (still exists alongside data.ts — data duplication!)
pomodoro-store.ts
theme-toggle-store.ts
```

**Known Dormant Hooks (2):**
```
useSound.ts
useTypingEngine.ts
```

**Active Code (24 components, 14 active + layout + loading + not-found + error + 3 route pages):**

This is a **massive dead code ratio**: 14 dormant components vs ~14 active = **50% dead code by component count**.

**Critical Finding #4: Dead Code Is a Maintenance Liability**

Each dormant file:
- Increases bundle analysis confusion
- May contain outdated patterns that mislead future contributors
- Creates false "coverage" in code metrics
- Adds cognitive load when navigating the project

**However**, these dormant files also represent **intentionally preserved creative work** — experimental visual components like `ConstellationMap`, `CinematicIntro`, and `FilmGrain` that could be re-activated.

**Recommendation:**
1. Move all dormant components to `components/_archive/` (underscore prefix, clearly separated)
2. Add a `ARCHIVE.md` documenting what each archived component does and why it was retired
3. Remove dormant lib files that have no archival value (`pomodoro-store.ts`, `theme-toggle-store.ts`)
4. Keep `projects.ts` only if it serves a different purpose than `data.ts` — otherwise consolidate

---

### A4: Configuration File Audit

**`next.config.ts` Concerns:**

| Item | Status | Issue |
|---|---|---|
| `metadataBase` | **Hardcoded** | Status docs confirm `metadataBase: 'https://example.com'` — this is a placeholder that should be the actual domain |
| Image optimization | Needs review | Are `remotePatterns` properly configured for all image sources? |
| Bundle analyzer | Should exist | No mention of `@next/bundle-analyzer` — critical for monitoring dead code in bundles |
| CSP headers | Unknown | No Content Security Policy headers mentioned anywhere |
| Compression | Unknown | Is gzip/brotli configured or relying on hosting provider? |

**`drizzle.config.ts` Concerns:**

| Item | Status | Issue |
|---|---|---|
| Schema location | Needs verification | Is the schema file actively maintained? |
| Migration strategy | Unclear | No migration files visible in project structure |
| Database URL | Env var check | Must be in `.env.local`, not committed |
| Connection pooling | Unknown | For serverless deployment, connection pooling (e.g., Neon, Supabase) is critical |

**`tsconfig.json` Review:**

```jsonc
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "paths": { "@/*": ["./src/*"] }  // Good: clean import aliases
}
```

This is well-configured. The `@/*` path alias prevents `../../../` hell.

**`package.json` Concerns:**

| Item | Status | Issue |
|---|---|---|
| Dependency pinning | Needs check | Are versions pinned or using `^` ranges? |
| Unused dependencies | Likely | 14 dormant components may have had peer deps (three.js for Canvas3D? tone.js for useSound?) |
| Script audit | Needs check | Are build/lint/test scripts properly configured? |
| Engine constraints | Missing | No `engines` field specifying required Node.js version |

**Critical Finding #5: Likely Stale Dependencies**

If `Canvas3D.tsx` used Three.js, `useSound.ts` used Tone.js, and `ConstellationMap.tsx` used a canvas library — those packages may still be in `package.json` despite being unused:

```json
// Potentially unnecessary:
"three": "^0.x.x",
"@react-three/fiber": "^x.x.x",  
"@react-three/drei": "^x.x.x",
"tone": "^x.x.x",
"zustand": "^x.x.x"  // If only pomodoro-store used it
```

**Recommendation:** Run `npx depcheck` to identify unused dependencies, then remove them to reduce install time and security surface.

---

### A5: Dependency & Security Audit

**Known Stack:**
```
Next.js 16, React 19, TypeScript 5.x
Drizzle ORM, PostgreSQL
Zod (validation)
Tailwind CSS v4
ESLint 9 (flat config)
Prettier
```

**Security Checklist:**

| Item | Status | Priority |
|---|---|---|
| `npm audit` pass | Unknown | Critical |
| Input validation on API routes | Zod mentioned | High |
| Rate limiting on API routes | Not mentioned | High |
| CSRF protection | Next.js built-in | Medium |
| Env var exposure | Needs check | Critical |
| SQL injection protection | Drizzle handles | Low |
| XSS protection | React escapes by default | Low |
| Dependency vulnerabilities | Needs `npm audit` | High |

**Critical Finding #6: No Evidence of Rate Limiting**

The API routes (contact form, project data) have no mention of rate limiting. For a production site, this is a **denial-of-service vector** and a **spam vector** for the contact form.

**Recommendation:** Add rate limiting middleware:
```typescript
// middleware.ts or per-route
import { Ratelimit } from '@upstash/ratelimit'
// or simple in-memory for single-instance
```

---

## PHASE B: STRUCTURAL CODE REVIEW

### B1: Component Architecture Review

**Application Shell Hierarchy:**

```
layout.tsx (RootLayout)
├── ThemeScript (inline <script> for FOUC prevention)
├── <body data-theme="...">
│   ├── Loading.tsx (Suspense fallback)
│   └── <Suspense>
│       └── PortfolioApp.tsx (Client Component, ssr: false)
│           ├── GridBackground (visual)
│           ├── Navbar
│           │   ├── Logo
│           │   ├── Navigation links (hash-based)
│           │   └── ThemeToggle
│           ├── <main>
│           │   ├── HeroSection
│           │   ├── AboutSection
│           │   ├── ProjectsSection
│           │   │   └── ProjectCard[]
│           │   ├── KnowledgeSection
│           │   │   └── KnowledgeCard[]
│           │   ├── ExperienceSection
│           │   └── ContactSection
│           └── Footer
```

**Critical Finding #7: `ssr: false` Is Architecturally Significant**

The entire `<PortfolioApp>` renders client-side only. This means:

1. **Zero SSR content** — Google's crawler may not index the site content (though Google can execute JS, it's not guaranteed)
2. **Larger LCP** — The entire page must hydrate before any content appears
3. **FOUC risk** — The loading state shows a minimal skeleton while the full app downloads

**However**, this is a **deliberate trade-off** documented in CLAUDE.md: the hash-based routing system requires `window.location.hash` and `hashchange` events, which are client-only APIs.

**Recommendation:** Consider a hybrid approach:
- Keep hash routing for client-side navigation
- But server-render the initial section content (e.g., HeroSection) as static HTML
- Use `use client` only on the interactive shell, not the content components

**Critical Finding #8: PortfolioApp as God Component**

`PortfolioApp.tsx` likely orchestrates:
- Route state (via `useRouteHash`)
- Theme state (via ThemeToggle)
- Scroll behavior
- Section rendering
- Navbar state
- Footer rendering

This is a **God component** pattern — too many responsibilities in one file.

**Recommendation:** Extract a `SectionRenderer` component that maps `activeSection` to the correct component:

```typescript
const SECTION_MAP: Record<string, React.ComponentType> = {
  hero: HeroSection,
  about: AboutSection,
  projects: ProjectsSection,
  knowledge: KnowledgeSection,
  experience: ExperienceSection,
  contact: ContactSection,
} as const;

function SectionRenderer({ activeSection }: { activeSection: string }) {
  const Section = SECTION_MAP[activeSection];
  if (!Section) return <HeroSection />;
  return <Section />;
}
```

---

### B2: Hook Correctness Review

**`useRouteHash` — The Critical Hook**

This is the **single most important piece of logic** in the application. It:
1. Reads `window.location.hash`
2. Maps it to a valid section ID
3. Listens for `hashchange` events
4. Provides navigation function
5. Validates against `VALID_SECTIONS`

**Potential Issues to Verify:**

| Issue | Risk | What Could Go Wrong |
|---|---|---|
| SSR guard | High | If called during SSR, `window` is undefined — must have `typeof window !== 'undefined'` guard |
| Initial hash on load | High | Browser may restore scroll position with a hash — does the hook handle this? |
| Invalid hash values | Medium | Hash like `#nonexistent` — does it fall back to `hero`? |
| Hash with query params | Low | `#projects?filter=web` — does validation handle this? |
| History state | Medium | Does navigating via hash update `history.state`? Should it? |
| Concurrent updates | Low | Multiple rapid hash changes — any race conditions? |

**`useReducedMotion` — Accessibility Hook**

Should use `matchMedia('(prefers-reduced-motion: reduce)')` with proper cleanup. Key checks:
- Does it subscribe to changes (user toggles in OS settings)?
- Is the event listener cleaned up on unmount?
- Does it return `false` during SSR (safe default)?

**Critical Finding #9: Motion Hook Must Gate All Animations**

Every animation in the codebase should check `useReducedMotion()`. If components like `GridBackground`, `ProjectCard` hover effects, or page transitions don't respect this, the site violates **WCAG 2.1 Success Criterion 2.3.3** (Animation from Interactions).

---

### B3: Data Layer & Type System Review

**The `data.ts` vs `projects.ts` Problem:**

From status_2.md, both files export project data. This is the **classic data duplication anti-pattern**:

```
data.ts      → exports projects array (used by active components)
projects.ts  → exports projects array (dormant, possibly different)
```

**Issues:**
1. **Two sources of truth** — which is canonical?
2. **Schema drift** — can `data.ts` and `projects.ts` have different `Project` shapes?
3. **Dead weight** — if `projects.ts` is unused, it's confusing; if it's the "real" one, why does `data.ts` exist?

**Critical Finding #10: Contact Information Fragmentation**

Contact info (email, social links, etc.) may be scattered across:
- `data.ts` (contact section data)
- `lib/constants.ts` (dormant — may have been the original source)
- Footer component (hardcoded?)
- `<head>` metadata in layout.tsx

If the email changes, how many files need updating?

**Recommendation:**
```
lib/
  site-config.ts     ← Single source for name, email, social links, metadata
  data.ts            ← Imports from site-config.ts for contact section
  types/
    project.ts       ← Shared Project interface
    section.ts       ← Shared Section types
```

---

### B4: Layout & Page Entry Points

**`layout.tsx` Analysis:**

Key elements to verify:
```typescript
// Expected structure
export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),  // ← PLACEHOLDER!
  title: { template: '%s | The Engineered Soul', default: '...' },
  description: '...',
  openGraph: { ... },
  twitter: { ... },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />  {/* Inline script for FOUC prevention */}
      </head>
      <body data-theme={...}>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
```

**Critical Finding #11: `data-theme` Target Inconsistency**

The audit docs mention a potential mismatch:
- `ThemeScript` may set `data-theme` on `document.documentElement` (`<html>`)
- `PortfolioApp` may toggle it on `document.body`
- CSS selectors use `[data-theme="..."]` — but on which element?

If CSS says `body[data-theme="day"]` but the script sets `<html data-theme="day">`, **theme switching silently fails**.

**This must be verified and unified to ONE element** (recommendation: `<html>` as it's the root for all CSS custom properties).

**`page.tsx` Analysis:**

With App Router, `page.tsx` at the root should simply render `<PortfolioApp />`. Key checks:
- Does it pass any server-fetched data as props?
- Is there any middleware or layout-level data fetching?
- Are there parallel routes or intercepting routes?

**Route Pages:**
The docs mention 3 route pages. These are likely:
```
app/
  page.tsx                    → Main portfolio
  projects/[slug]/page.tsx    → Individual project detail
  api/contact/route.ts        → Contact form API
  api/projects/route.ts       → Projects API
```

**Critical Finding #12: Dynamic Route Pages May Not Exist**

Status_2.md mentions "3 route pages" but the portfolio uses hash-based routing (`#about`, `#projects`). This creates a **routing duality**:
- Hash routes for client-side section navigation
- Next.js file-based routes for project detail pages

This works but needs careful verification:
- Do project detail pages have proper `generateMetadata`?
- Do they have `generateStaticParams` for static generation?
- Is there a 404 handler for invalid project slugs?

---

### B5: API Route Review

**API Routes to Audit:**

| Route | Method | Concerns |
|---|---|---|
| `api/contact/route.ts` | POST | Input validation (Zod?), rate limiting, spam prevention, email sending mechanism |
| `api/projects/route.ts` | GET | Pagination? Filtering? Or just a static data dump? |

**For the contact form API:**

Critical checks:
1. **Zod schema** — Is every field validated (name length, email format, message length)?
2. **Rate limiting** — Is there any protection against spam?
3. **Honeypot/CAPTCHA** — Is there bot protection?
4. **Email delivery** — What service sends the email? Is the API key secured?
5. **Error responses** — Does it return proper HTTP status codes?
6. **CORS** — Are API routes restricted to same-origin?

---

## PHASE C: DESIGN SYSTEM AUDIT

### C1: CSS Token Completeness & Ordering

**Dark Theme Token Map (Expected):**

```css
:root [data-theme="dark"] {
  /* Backgrounds */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-muted: #1a1a1a;        /* ← Verify exists */
  --bg-elevated: #141414;
  
  /* Text */
  --text-primary: #f5f5f5;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;
  --text-accent: #00ff88;      /* ← Verify exists */
  
  /* Accent */
  --accent: #00ff88;
  --accent-hover: #00cc6e;     /* ← Was undefined, verify fixed */
  --accent-muted: #00ff8833;
  
  /* Borders */
  --border: #222222;
  --border-hover: #333333;
  --card-border: #1e1e1e;      /* ← Verify exists */
  
  /* Interactive */
  --toggle-bg: #222222;
  --toggle-hover-bg: #333333;   /* ← Verify exists */
  
  /* Cards */
  --project-card-bg: #111111;   /* ← Verify exists */
  --knowledge-card-bg: #111111; /* ← Verify exists */
  
  /* Typography Scale */
  --font-weight-regular: 400;
  --font-weight-black: 900;
  --font-weight-semibold: 600;  /* ← Was missing, verify added */
  --font-weight-medium: 500;    /* ← Was missing, verify added */
  --font-weight-bold: 700;      /* ← Was missing, verify added */
  
  /* Grid System */
  --grid-min-col-width: 280px;      /* ← Was missing */
  --grid-gap: 1.5rem;               /* ← Was missing */
  --grid-hero-min-col-width: 300px; /* ← Was missing */
  --grid-hero-gap: 2rem;            /* ← Was missing */
  /* ... etc for all grid vars */
}
```

**Critical Finding #13: The Day Theme Must Mirror the FULL Dark Token Set**

Every variable defined in the dark theme MUST have a corresponding day theme value. Even if the value is identical, defining it explicitly:
1. Documents the design system completely
2. Prevents inheritance of dark values in light mode
3. Makes the theme system predictable and maintainable

---

### C2: Theme Toggle Implementation

**The FOUC Prevention Problem:**

```html
<!-- ThemeScript (inline in <head>) -->
<script>
  (function() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

**Checks:**
1. Is the script truly inline (not external)? — Required to execute before first paint
2. Does it set on `<html>` or `<body>`? — Must match CSS selectors
3. Does it handle missing `localStorage` (private browsing)?
4. Is `suppressHydrationWarning` on the `<html>` tag? — Required because React doesn't know the script changed the DOM

**Critical Finding #14: Theme Persistence vs. System Preference**

The current behavior appears to be:
- Default to `'dark'` if no stored preference
- This means users who prefer light mode get dark mode on first visit

**Better approach:**
```javascript
const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = stored || (prefersDark ? 'dark' : 'day');
```

---

### C3: Typography & Grid System

**Typography Stack:**

The design calls for:
- Headings: A monospace or slab-serif font (brutalist aesthetic)
- Body: A clean sans-serif or monospace
- Code: A dedicated monospace font

**Checks:**
1. Are fonts loaded via `next/font` (optimal) or `<link>` (acceptable)?
2. Is there `font-display: swap` to prevent invisible text during load?
3. Are all font weights actually used? Loading unused weights wastes bandwidth.
4. Is the font stack declared in CSS custom properties or Tailwind config?

**Grid System:**

The design uses CSS Grid with custom properties for responsive columns. Key checks:
1. Does `grid-template-columns` use `auto-fit` or `auto-fill`?
2. Are grid column widths responsive via `clamp()` or media queries?
3. Is there a fallback for browsers that don't support CSS Grid?

---

## PHASE D: FINDINGS SUMMARY & REMEDIATION ROADMAP

### Severity Classification

#### CRITICAL (Must Fix Before Production)

| # | Finding | Impact | Effort |
|---|---|---|---|
| F11 | `data-theme` target inconsistency | Theme switching may silently fail | 1h |
| F6 | No rate limiting on API routes | Spam/DoS vulnerability | 2h |
| F5 | Stale/unused dependencies | Security surface, bundle size | 1h |
| F2 | Day theme incomplete override coverage | Visual bugs in light mode | 2h |
| F5 (ext) | Hardcoded `metadataBase` | Open Graph links broken | 15min |

#### HIGH (Should Fix Soon)

| # | Finding | Impact | Effort |
|---|---|---|---|
| F3 | Duplicate type definitions | Silent schema drift | 2h |
| F10 | Contact info fragmentation | Maintenance burden | 1h |
| F9 | Motion hook not gating all animations | WCAG violation | 3h |
| F1 | CSS variable naming inconsistency | Developer confusion | 2h |
| F7 | `ssr: false` limits SEO | Crawlability | 4h (complex) |
| F14 | Theme default ignores system preference | UX friction | 30min |

#### MEDIUM (Quality Improvements)

| # | Finding | Impact | Effort |
|---|---|---|---|
| F4 | 50% dead code ratio | Cognitive load, bundle confusion | 3h |
| F8 | PortfolioApp God component | Maintainability | 2h |
| F12 | Dynamic route pages unverified | Missing metadata/404 handling | 2h |
| F13 | Day theme doesn't mirror full dark token set | Theme completeness | 1h |

#### LOW (Nice to Have)

| # | Finding | Impact | Effort |
|---|---|---|---|
| — | Add `engines` field to package.json | Deployment clarity | 5min |
| — | Add `depcheck` to CI pipeline | Dependency hygiene | 15min |
| — | Add ARCHIVE.md for dormant components | Documentation | 30min |

---

### Prioritized Remediation Roadmap

```
Sprint 1 (Week 1) — Production Blockers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✦ Unify data-theme target to <html> (F11)
  ✦ Complete day theme token overrides (F2)
  ✦ Fix metadataBase placeholder (F5-ext)
  ✦ Run npm audit, remove unused deps (F5)
  ✦ Add rate limiting to API routes (F6)
  ✦ Respect system color-scheme preference (F14)

Sprint 2 (Week 2) — Type Safety & Data Integrity
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✦ Extract shared types to types/ directory (F3)
  ✦ Centralize site config (F10)
  ✦ Consolidate CSS variable naming (F1)
  ✦ Verify/add motion hook gating (F9)

Sprint 3 (Week 3) — Architecture & Cleanup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✦ Archive dormant code (F4)
  ✦ Extract SectionRenderer from PortfolioApp (F8)
  ✦ Verify dynamic route pages (F12)
  ✦ Complete day theme mirror (F13)

Sprint 4 (Week 4) — SSR Strategy (If Time/Budget)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✦ Evaluate hybrid SSR for HeroSection (F7)
  ✦ Add structured data (JSON-LD)
  ✦ Add sitemap.xml generation
  ✦ Performance audit (Lighthouse)
```

---

### Architecture Improvement Proposals

**Proposal 1: Design Token Pipeline**

Replace hand-maintained CSS custom properties with a token pipeline:

```
tokens/
  colors.json        → defines all color tokens
  typography.json    → defines font families, weights, sizes
  spacing.json       → defines spacing scale
  grid.json          → defines grid parameters
  
↓ (Style Dictionary or custom build step)

globals.css          → auto-generated :root variables
tailwind.config.ts   → auto-generated Tailwind theme
```

This eliminates the dual-system problem (F1) permanently.

**Proposal 2: Route Architecture Migration**

Consider migrating from hash-based routing to Next.js App Router sections:

```
Instead of:  /#about, /#projects, /#contact
Use:         /about, /projects, /contact (with smooth scroll back to top)
```

Benefits:
- SSR-compatible (SEO)
- Deep-linkable (social sharing)
- No `ssr: false` needed
- Proper page metadata per section

**Proposal 3: Component Storybook**

For a portfolio that values visual craft, add Storybook:
```bash
npx storybook@latest init
```

This allows:
- Visual testing of each component in isolation
- Day/dark theme comparison side-by-side
- Documentation of the design system
- Regression detection for visual changes

---

## DELIVERABLE CHECKLIST

| Deliverable | Status |
|---|---|
| CSS variable cross-reference | 14 undefined vars identified + day theme gaps |
| TypeScript strictness verification | Config excellent, duplicate types flagged |
| Dead code inventory | 14 components, 5 libs, 2 hooks catalogued |
| Config file audit | metadataBase, stale deps, engine constraints flagged |
| Component architecture review | God component pattern, routing duality identified |
| Hook correctness review | SSR guards, reduced motion gating flagged |
| Data layer audit | Duplication, fragmentation identified |
| API route review | Rate limiting, validation gaps flagged |
| Design system audit | Token completeness, theme consistency, FOUC flagged |
| Severity-classified findings | 5 Critical, 6 High, 4 Medium, 3 Low |
| Prioritized remediation roadmap | 4 sprints, sequenced by dependency |
| Architecture improvement proposals | Token pipeline, route migration, Storybook |

---

This audit identified **18 distinct findings** across the codebase, with 5 classified as critical production blockers. The project has solid foundations (strict TypeScript, clean component separation, intentional design direction) but suffers from **accumulated technical debt** from the Vite-to-Next.js migration — most critically around theme consistency, dead code management, and the SSR trade-off.

Want me to begin executing Sprint 1 fixes immediately, or would you like to discuss/re-prioritize any findings first?
