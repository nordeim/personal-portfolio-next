I'll start by cloning the repo and then diving into the documentation files to build a deep understanding before planning the audit.
Now let me read all the key documentation files in parallel:
Now let me read the full Code_Review_Report_4.md and the SKILL_v4.md since they were truncated:
Now let me read the actual source code files to deeply understand the current state of the codebase before planning the audit:
Now let me read the remaining critical components:
Let me read the remaining key files:
Now let me read the remaining data and config files:
Now let me also check the config files and run a baseline build:
Excellent — typecheck passes and build succeeds. Now let me also run some diagnostic scans:
Good — no vulnerabilities. Now I have a complete picture. Let me write the comprehensive audit plan.
---

## Phase 1: ANALYZE — Complete ✅

I have now meticulously read all 6 documentation files and **every single active source file** (30+ files) in the codebase. Here's my synthesized understanding:

### WHAT — Project Identity

**"The Engineered Soul" (v2.0)** is Nicholas Yun's personal portfolio — an avant-garde digital installation built with **Tactile Brutalism** (zero border-radius globally, 28px mathematical grid, raw structural honesty) paired with **High-End Editorial** typography (Cormorant Garamond / DM Sans / IBM Plex Mono). It was ported from a Vite SPA to **Next.js 16 App Router** using a Client-Side SPA Orchestrator pattern that preserves kinetic interactivity at the cost of SSR/SEO.

### WHY — Architectural Trade-offs

1. **SPA Orchestrator pattern** — All routing is hash-based client-side. `page.tsx` is `"use client"` with `ssr: false`. Metadata from the Server Component `layout.tsx` still works. This is a deliberate trade-off: "digital installation" feel over SSR SEO.
2. **Static data ingestion** — Content in TypeScript arrays, no CMS. Database is optional (for contact form + unused analytics).
3. **Four remediation phases** — 50+ TypeScript errors, 14 undefined CSS variables, theme inconsistencies, accessibility gaps, and security vulnerabilities were resolved across 4 remediation cycles.
4. **15 archived components** — Dormant code moved to `_archive/` directories with unresolved CSS variable references.

### HOW — Technical Stack

| Layer | Implementation |
|---|---|
| Framework | Next.js 16.2.9 App Router |
| Runtime | React 19.2.7 |
| Styling | Tailwind CSS v4.1.17 + `@theme` tokens in `globals.css` |
| Database | Optional PostgreSQL via Drizzle 0.45.2 |
| Language | TypeScript 5.9.3 (strict + noUncheckedIndexedAccess) |
| API | `/api/contact` (rate-limited), `/api/health` (DB check) |
| Error Handling | Dual system: `react-error-boundary` v4 (page) + class `ErrorBoundary` (sections) |

### Baseline Verification ✅

| Check | Result |
|---|---|
| TypeScript typecheck | ✅ 0 errors |
| Next.js production build | ✅ Compiled in 2.1s, 4 routes |
| `any` types | ✅ Zero found |
| `@ts-ignore` / `@ts-expect-error` | ✅ Zero found |
| `npm audit` | ✅ 0 vulnerabilities |
| `dangerouslySetInnerHTML` | ⚠️ 2 uses (JSON-LD + ThemeScript — both safe) |
| `border-radius` violations | ✅ Only `0` in active code |
| `console.log` / `console.error` | ⚠️ 3 uses (contact TODO, error placeholder, DB warn) |
| `TODO` / `FIXME` | ⚠️ 1 TODO in contact route |

---

## Phase 2: PLAN — Critical Code Review & Audit Strategy

Based on my deep analysis of every source file and all documentation, here is the structured audit plan across **8 domains** with **67 individual checks**:

---

### DOMAIN 1: Architecture & Pattern Integrity (8 checks)

| # | Check | What I Found in Pre-Analysis | Severity |
|---|---|---|---|
| 1.1 | `PortfolioApp.tsx` orchestrator — ErrorBoundary + Suspense per section | ✅ Correct: Every section wrapped in custom `ErrorBoundary` + `Suspense` with `SectionSkeleton` fallback | — |
| 1.2 | `useRouteHash` — `VALID_SECTIONS` matches section IDs | ✅ Aligned: `["hero","about","projects","skills","experience","blog","terminal","contact"]` matches `PortfolioApp.tsx` section IDs | — |
| 1.3 | Hash routing edge cases — invalid hash, empty hash, back/forward | ⚠️ **Issue found**: `getHashFromWindow()` is only called once on mount. If user navigates to `#invalid`, it falls back to `"hero"` but the `hashchange` listener doesn't validate the same way — the hash still changes in the URL even though state is correct | Low |
| 1.4 | `page.tsx` correctly uses `"use client"` + `ssr: false` | ✅ Correct | — |
| 1.5 | `layout.tsx` — ThemeScript, metadata, font loading | ✅ Correct: Server Component, exports metadata/viewport, preconnect + stylesheet for fonts | — |
| 1.6 | `error.tsx` and `not-found.tsx` — proper error boundaries | ✅ Both implemented correctly with brutalist styling | — |
| 1.7 | `PortfolioApp.tsx` location — `src/app/` not `src/components/` | ✅ Correct | — |
| 1.8 | No Server/Client Component boundary violations | ⚠️ **Issue found**: `not-found.tsx` has `"use client"` but doesn't need it — no hooks, no event handlers, no browser APIs. Should be a Server Component for better streaming. Also, `ThemeScript.tsx` doesn't have `"use client"` but renders JSX — it works because `layout.tsx` imports it as a Server Component. This is fine but worth noting. | Low |

### DOMAIN 2: TypeScript Strictness & Type Safety (7 checks)

| # | Check | What I Found | Severity |
|---|---|---|---|
| 2.1 | `npm run typecheck` — zero errors | ✅ Passes | — |
| 2.2 | No `any` types | ✅ Zero found | — |
| 2.3 | Array index accesses use `?.` or `??` | ✅ Correct: `commandHistory[newIndex] ?? ""`, `focusable[0]?.focus()`, `entries[0]` in IntersectionObserver (safe — always exists when callback fires) | — |
| 2.4 | `Project` type consolidated | ✅ Single definition in `types.ts`, re-exported from `projects.ts` | — |
| 2.5 | `FallbackProps.error` typed as `unknown` | ✅ Correct in `page.tsx` `ErrorFallback` | — |
| 2.6 | All function params/returns explicitly typed | ⚠️ **Issue found**: Several callback parameters rely on implicit inference: `handleChange` in `ContactSection` returns `(e: ChangeEvent<...>) => void` implicitly; `executeCommand` in `Terminal` has no explicit return type; React component props are well-typed though | Low |
| 2.7 | No `@ts-ignore` or `@ts-expect-error` | ✅ Zero found | — |

### DOMAIN 3: Design System Fidelity (9 checks)

| # | Check | What I Found | Severity |
|---|---|---|---|
| 3.1 | All `var()` references resolve to `@theme` tokens | ✅ All active component references match `@theme` definitions | — |
| 3.2 | No `border-radius` violations | ✅ Only `border-radius: 0` in active code | — |
| 3.3 | Typography hierarchy correct | ✅ Cormorant Garamond (display/editorial), IBM Plex Mono (utility/mono), DM Sans (body/sans) | — |
| 3.4 | 28px grid compliance | ⚠️ **Issue found**: Some components use non-grid spacing: Navigation uses `gap: "8px"` for dots; Terminal uses `gap: "8px"` for input line; Footer `gap` uses `var(--spacing-half)` correctly but Navigation header area uses hardcoded `gap: "8px"` instead of `var(--spacing-quarter)` or `var(--spacing-half)`. Minor grid violations. | Low |
| 3.5 | Day/Night theme — all colors have both variants | ✅ All 14 semantic tokens have day overrides | — |
| 3.6 | FOUC prevention — ThemeScript before paint | ✅ Inline script in `<head>` via `layout.tsx` | — |
| 3.7 | `data-theme` consistently targets `<html>` | ✅ Both `ThemeScript` and `PortfolioApp` use `document.documentElement` | — |
| 3.8 | No forbidden fonts (Inter, Roboto, etc.) | ✅ Only Cormorant Garamond, DM Sans, IBM Plex Mono | — |
| 3.9 | Scrollbar `border-radius: 0` | ✅ Fixed in Remediation 4 | — |

### DOMAIN 4: Component Quality & React Best Practices (9 checks)

| # | Check | What I Found | Severity |
|---|---|---|---|
| 4.1 | All UI states handled (loading, error, empty, success) | ⚠️ **Issues found**: (a) `BlogSection` has only a "Coming Soon" placeholder — no loading/error state handling; (b) `Terminal` has no empty state for when there are no lines (after `clear`); (c) `Footer` has no error boundary wrapping (it's wrapped in Suspense only) | Moderate |
| 4.2 | `useAccessibility()` vs `useReducedMotion()` — redundancy | ⚠️ **Known issue**: `AccessibilityProvider` provides context but no component consumes it via `useAccessibility()`. `HeroKinetic` and `ScrollReveal` import `useReducedMotion()` directly. `BentoGrid` also uses `useReducedMotion()` directly. The context and the standalone hook duplicate each other. | Moderate |
| 4.3 | No memory leaks — event listeners/intervals cleaned up | ⚠️ **Issue found**: `rate-limit.ts` has a `setInterval` for cleanup that is never cleared — it runs for the lifetime of the server process. Acceptable for server-side code, but worth noting. | Low |
| 4.4 | `key` props correct on mapped elements | ⚠️ **Issue found**: `Terminal.tsx` line 209 uses `key={index}` for terminal output lines — this is fine because lines are append-only (no reordering/deletion except `clear`), but it's not ideal React practice. The `clear` command sets `lines` to `[]` which is fine. | Low |
| 4.5 | No unnecessary re-renders | ⚠️ **Issue found**: `Navigation.tsx` `handleChange` callback in `ContactSection` depends on `errors` in its dependency array, causing the callback to be recreated on every error state change. This triggers re-renders of the entire form on each keystroke after first validation. Also `ProjectsSection`'s `ALL_TAGS` is computed at module level (good), but `filteredProjects` re-creates on every `activeTag` change which is correct. | Moderate |
| 4.6 | `useReducedMotion` respected in all animation components | ✅ `HeroKinetic`, `ScrollReveal`, `BentoGrid` all check reduced motion | — |
| 4.7 | Components use `--color-` prefix convention | ✅ All active components use `--color-` prefix | — |
| 4.8 | ARIA attributes present on interactive widgets | ✅ Verified: `ThemeSwitch` has `role="switch"` + `aria-checked`, `Navigation` has `aria-current`, `Terminal` has `role="log"` + `aria-live="polite"`, `ContactSection` has `aria-invalid` + `aria-describedby` | — |
| 4.9 | No inline styles that should be CSS classes | ⚠️ **Major finding**: Nearly **every component** uses extensive inline styles instead of Tailwind CSS utility classes. This is a significant departure from the project's stated stack (Tailwind CSS v4). While `globals.css` defines the design system tokens, components use `style={{...}}` with `var()` references instead of Tailwind utilities like `bg-[var(--color-surface)]` or custom classes. This defeats the purpose of having Tailwind as a dependency and makes styling harder to maintain, override, and compose. | **High** |

### DOMAIN 5: Security & API Hardening (8 checks)

| # | Check | What I Found | Severity |
|---|---|---|---|
| 5.1 | `/api/contact` — Input validation | ✅ Good: validates name (1-100 chars), email (regex), message (10-5000 chars), checks body type | — |
| 5.2 | Rate limiting correctness | ⚠️ **Issue found**: (a) The `setInterval` cleanup in `rate-limit.ts` uses `60_000` (1 minute) as the staleness threshold, but `RateLimitConfig.windowMs` can be any value — the cleanup threshold should be at least `windowMs`, not hardcoded. (b) The sliding window algorithm isn't a true sliding window — it's a token bucket with refill. The naming is misleading. (c) `getClientIp` falls back to `"127.0.0.1"` which means all requests without proxy headers share the same rate limit bucket — a potential DoS vector if the app runs behind a proxy that doesn't set `x-forwarded-for`. | Moderate |
| 5.3 | No hardcoded credentials | ✅ `drizzle.config.ts` uses env vars; `site-config.ts` has no secrets | — |
| 5.4 | CORS configuration | ✅ No CORS headers needed (same-origin API). Next.js default is same-origin. | — |
| 5.5 | No `dangerouslySetInnerHTML` without sanitization | ✅ Two uses: JSON-LD (safe — static data from `siteConfig`), ThemeScript (safe — static inline script). Both are appropriate. | — |
| 5.6 | Environment variable handling | ✅ `.env.example` exists, `drizzle.config.ts` reads env vars | — |
| 5.7 | Database queries parameterized | ✅ Drizzle ORM uses parameterized queries. The only raw SQL is `sql\`select 1\`` which is safe. | — |
| 5.8 | Error responses don't leak internal details | ✅ Contact API returns generic messages; health endpoint returns minimal info | — |

### DOMAIN 6: Performance & Bundle Analysis (8 checks)

| # | Check | What I Found | Severity |
|---|---|---|---|
| 6.1 | `npm run build` — succeeds without warnings | ✅ Build succeeds, no warnings | — |
| 6.2 | Dynamic imports for heavy components | ✅ 8 sections + Footer use `React.lazy()` | — |
| 6.3 | Image optimization | ⚠️ **Issue found**: `ProjectCard` uses raw `<img>` tag instead of Next.js `Image` component. This misses automatic optimization, lazy loading is manual, and there's no `srcset`/responsive sizing. The `width`/`height` props are set but serve only as layout hints, not actual optimization. | Moderate |
| 6.4 | Font loading — preconnect + display: swap | ✅ Preconnect + stylesheet in `<head>`, fonts use `display=swap` | — |
| 6.5 | No unnecessary client-side JS for static content | ⚠️ **Issue found**: `BlogSection` is a purely static "Coming Soon" placeholder with `"use client"` — it doesn't need to be a Client Component. Same for `Footer` — it's purely static except `new Date().getFullYear()` which could be passed as a prop or computed server-side. These add unnecessary JS to the client bundle. | Moderate |
| 6.6 | No redundant CSS/unused classes | ✅ Minimal CSS — mostly inline styles (which is a different problem — see 4.9) | — |
| 6.7 | Animation performance — CSS-only preferred | ⚠️ **Issue found**: `HeroKinetic` uses JavaScript-driven animations (`useState` + inline `transition` on `opacity` and `transform`). The `requestAnimationFrame` pattern adds unnecessary JS overhead for what could be a CSS-only animation using `@keyframes` from `globals.css`. `ScrollReveal` uses `IntersectionObserver` (correct) but toggles `willChange` which is good. | Low |
| 6.8 | Error boundary wrapping — no unnecessary duplication | ✅ Dual system is intentional: `react-error-boundary` at page level (catastrophic), class `ErrorBoundary` per section (isolated) | — |

### DOMAIN 7: Accessibility — WCAG AAA Target (8 checks)

| # | Check | What I Found | Severity |
|---|---|---|---|
| 7.1 | Semantic HTML — heading hierarchy | ✅ One `h1` in Hero, `h2` in SectionBlock, `h3` in BentoGrid/SkillsSection/Timeline/ProjectCard | — |
| 7.2 | Color contrast ratios in both themes | ✅ Night: `--color-text-muted` = 5.76:1, Day: `--color-text-muted` = 5.06:1 (both pass AA) | — |
| 7.3 | Keyboard navigation — all interactive elements focusable | ⚠️ **Issue found**: The "View Work →" link in `HeroKinetic` uses `href="#projects"` but doesn't call `onNavigate` — it's a plain anchor that relies on hash scrolling, not the `useRouteHash` navigation system. This means clicking it scrolls to the section but doesn't update `currentHash` state, so the Navigation component doesn't highlight "Projects" as active. The `preventScroll: true` in focus management also means keyboard users clicking this link won't get scrolled to the target. | Moderate |
| 7.4 | `prefers-reduced-motion` respected globally | ✅ CSS rule in `globals.css` + `useReducedMotion` hook in animation components + `AccessibilityProvider` context | — |
| 7.5 | ARIA attributes on custom widgets | ✅ Verified — all interactive widgets have proper ARIA | — |
| 7.6 | Focus management on hash route changes | ✅ Implemented in `useRouteHash` via `requestAnimationFrame` + `tabindex="-1"` + `focus()` | — |
| 7.7 | Screen reader compatibility — no hidden traps | ⚠️ **Issue found**: The "View Work →" link in `HeroKinetic` doesn't integrate with the hash routing system. A screen reader user clicking this link would get scrolled to `#projects` but the `aria-current` state on navigation links wouldn't update to reflect the current section. Also, the mobile menu overlay in `Navigation` uses `role="dialog"` + `aria-modal="true"` but doesn't trap focus within the dialog (tab key can escape to background elements). | Moderate |
| 7.8 | Form accessibility — labels, errors, required | ✅ Contact form: proper labels, `aria-invalid`, `aria-describedby`, `role="alert"` on errors, `aria-busy` on submit button, disabled during submission | — |

### DOMAIN 8: Technical Debt & Dead Code Audit (9 checks)

| # | Check | What I Found | Severity |
|---|---|---|---|
| 8.1 | `_archive/` directories — catalog and assess | ⚠️ 15 archived components, 5 archived lib files, 2 archived hooks. All have unresolved CSS variable references. None are imported by active code. Decision needed: reintegrate or delete. | Moderate |
| 8.2 | `console.log/error/warn` — should be replaced | ⚠️ 3 instances: `console.log` in contact route (TODO for email service), `console.error` in error.tsx (placeholder for Sentry), `console.warn` in db/index.ts (acceptable for DB warnings) | Low |
| 8.3 | `TODO`/`FIXME`/`HACK` comments | ⚠️ 1 TODO in contact route for email service integration | Low |
| 8.4 | Unused imports | ✅ No unused imports detected (typecheck passes with strict settings) | — |
| 8.5 | Hardcoded credentials | ✅ Resolved in Remediation 4 — `drizzle.config.ts` uses env vars | — |
| 8.6 | Analytics table — write or remove | ⚠️ **Known issue**: Schema exists in `db/schema.ts`, health endpoint checks DB, but nothing writes to it. Dead schema. | Moderate |
| 8.7 | Missing portrait assets | ⚠️ **Known issue**: Archived `data.ts` references `/portraits/*.webp` that don't exist | Low |
| 8.8 | Dependency audit | ✅ `npm audit` = 0 vulnerabilities | — |
| 8.9 | `AccessibilityProvider` vs `useReducedMotion` duplication | ⚠️ **Known issue**: Context provides `prefersReducedMotion` but no component consumes it. `HeroKinetic`, `ScrollReveal`, `BentoGrid` use standalone hook. Either consolidate or remove the provider. | Moderate |

---

### Summary of Findings by Severity

| Severity | Count | Key Issues |
|---|---|---|
| **🔴 Critical** | 0 | No critical issues found — the codebase is in solid shape after 4 remediations |
| **🟠 High** | 1 | **D4.9**: Nearly all components use inline styles instead of Tailwind CSS — defeats the purpose of the Tailwind dependency and makes styling harder to maintain |
| **🟡 Moderate** | 8 | Accessibility gaps (focus trap in mobile menu, "View Work" link not wired to routing), ContactSection callback dependency causing unnecessary re-renders, raw `<img>` tag instead of Next.js `Image`, static components as Client Components, rate limiter edge cases, analytics dead schema, AccessibilityProvider redundancy, BlogSection/Terminal empty states |
| **🔵 Low** | 7 | Non-grid spacing in Navigation/Terminal, `not-found.tsx` unnecessarily client-side, hash routing URL vs state mismatch for invalid hashes, Terminal `key={index}`, rate-limiter setInterval never cleared, console.log placeholders, minor typing gaps |

### Proposed Execution Order

1. **Domain 1** (Architecture) → Foundational — must be verified first
2. **Domain 2** (TypeScript) → Already clean but verify edge cases
3. **Domain 5** (Security) → Important for production readiness
4. **Domain 7** (Accessibility) → Critical for the project's WCAG AAA commitment
5. **Domain 4** (Component Quality) → Largest domain, most findings
6. **Domain 3** (Design System) → Visual consistency
7. **Domain 6** (Performance) → Optimization opportunities
8. **Domain 8** (Technical Debt) → Cleanup recommendations

---

This is my complete audit plan. Shall I proceed to execute the full audit and compile a comprehensive **Code Review Report 5**? I want your explicit confirmation before writing any findings to a deliverable.

Key decisions I need from you:
1. **Should I proceed with the full audit now?**
2. **For the inline styles issue (D4.9) — should I flag it as a recommended migration to Tailwind utilities, or is the inline style approach intentional for this project?** (The documentation says Tailwind CSS v4 is the styling framework, but the actual implementation is almost entirely inline styles with CSS custom properties.)
3. **Should the audit report include concrete fix recommendations with code examples, or just identify the issues?**
