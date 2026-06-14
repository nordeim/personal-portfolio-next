I'll start by cloning the repo and then thoroughly reviewing all the specified documentation files to build a deep understanding of the project before planning the audit.
The git clone is consistently timing out. Let me try an alternative approach — downloading as a zip archive which is often faster.
Good, the repo is cloned. Now let me read all the specified documentation files in parallel.
Now let me read the full content of the files that were too large, and also check for AGENT.md with alternative names:
The file is `AGENTS.md` (plural), not `AGENT.md`. Let me read it along with the full skill document:
Now let me explore the actual codebase structure to understand the real file layout before planning the audit:
Excellent. I now have a thorough understanding of the entire codebase. Let me synthesize all findings and create the structured audit plan.
Now let me also verify the build status and run the existing quality checks:
All the TS errors come from the `skills/` directory — not from the portfolio code itself. This is a **critical finding**: the `skills/` directory is unrelated to the portfolio and pollutes the TypeScript compilation. Let me also verify the `drizzle.config.json` that was supposed to be removed:
This is a **critical finding**: `drizzle.config.json` with hardcoded `postgres:postgres` credentials still exists despite Remediation 4 claiming it was converted to `.ts`. Now I have all the data needed for the complete audit plan.
---

# 🔍 Critical Code Review & Audit Plan

## Executive Summary

After meticulously reviewing all 6 documentation files, the full source code (33 active + 22 archived files), configuration, and running live checks, I've identified **47 discrete issues** across 7 domains. The codebase has gone through 6 remediation phases and is in reasonable shape structurally, but several new issues have emerged that were not caught by prior audits, and some "fixed" issues have partially regressed or were incompletely resolved.

---

## Phase 1: ANALYZE — Audit Findings

### 🔴 CRITICAL (Must Fix Before Production)

| # | Category | Finding | File(s) | Detail |
|---|----------|---------|---------|--------|
| **C-01** | **Security** | `drizzle.config.json` with hardcoded credentials still exists | `drizzle.config.json` | Remediation 4 claimed it was "converted to `.ts`" but the old JSON with `postgres:postgres` was never deleted. This is a **credential leak**. |
| **C-02** | **Security** | `skills/` directory pollutes TypeScript compilation with 40+ unrelated modules | `skills/` | Contains scripts importing `z-ai-web-dev-sdk` (not a project dependency) and has its own type errors. This directory should be excluded from `tsconfig.json` or removed entirely. It also bloats the repo significantly. |
| **C-03** | **Security** | CSP uses `'unsafe-inline'` and `'unsafe-eval'` | `next.config.ts` | These directives effectively negate XSS protection from CSP. This is the #1 CSP weakness. Nonces or hashes should be used for inline scripts. |
| **C-04** | **Security** | Rate limiter falls back to shared IP `127.0.0.1` | `rate-limit.ts` | All requests without proxy headers share a single rate-limit bucket. An attacker can bypass rate limiting by omitting headers. |
| **C-05** | **Security** | `setInterval` in rate-limit.ts never clears | `rate-limit.ts` | In serverless (Vercel), each cold start creates an unmanaged interval. Memory leak risk. The `Map` store also doesn't persist across instances. |
| **C-06** | **Data Integrity** | Project links use `"#"` instead of `undefined` | `projects.ts` | All `live` and `repo` links are `"#"`, rendering as broken links that navigate to page top. The type allows `undefined` — should use it. |

### 🟠 HIGH (Significant Quality/Performance Issues)

| # | Category | Finding | File(s) | Detail |
|---|----------|---------|---------|--------|
| **H-01** | **SEO** | Entire app is `ssr: false` | `page.tsx` | Search engines and social crawlers see an empty shell. No SSR = no indexable content for a portfolio site. |
| **H-02** | **SEO** | `og-image.png` referenced in metadata doesn't exist | `layout.tsx` | `openGraph.images` references `/og-image.png` which is not in `public/`. Broken OG images on social shares. |
| **H-03** | **Accessibility** | `not-found.tsx` missing semantic structure | `not-found.tsx` | No `<h1>`, no `<main>` landmark, no `role="alert"`. Screen readers get no error announcement. |
| **H-04** | **Accessibility** | `error.tsx` may expose internal error details | `error.tsx` | Raw error messages from the server could contain stack traces, file paths, or internal state. Should be sanitized in production. |
| **H-05** | **Performance** | Google Fonts via external `<link>` (render-blocking) | `layout.tsx` | 3 font families loaded from `fonts.googleapis.com` — a render-blocking external request. `next/font/google` would self-host and eliminate the FCP penalty. |
| **H-06** | **Architecture** | Duplicate theme initialization logic | `PortfolioApp.tsx` + `ThemeScript.tsx` | Both read `localStorage` and set `data-theme`. `ThemeScript` runs in `<head>` (FOUC prevention), then `PortfolioApp`'s `useEffect` re-reads and re-sets the same attribute. Redundant work + potential flash. |
| **H-07** | **Responsive** | BentoGrid `grid-column: span 2` breaks on narrow viewports | `BentoGrid.tsx` | No media query fallback. On mobile with 1 column, `span 2` causes horizontal overflow. |
| **H-08** | **Type Safety** | `siteConfig` not typed against `SiteConfig` interface | `site-config.ts` | The `as const` object could drift from the `SiteConfig` interface in `types.ts`. Should satisfy the interface. |
| **H-09** | **Type Safety** | `Skill` and `TimelineEntry` defined locally, not in `types.ts` | `skills.ts`, `timeline.ts` | Inconsistent with the codebase pattern where `Project` is in `types.ts`. Local types can't be reused and risk duplication. |
| **H-10** | **API** | Contact form returns success but doesn't send email | `route.ts` | Users believe their message was delivered. Deceptive UX. Should either implement sending or return a "pending" status. |
| **H-11** | **npm Audit** | 6 vulnerabilities (2 HIGH: esbuild RCE) | `package.json` | esbuild ≤0.28.0 has remote code execution vulnerability via `NPM_CONFIG_REGISTRY`. PostCSS has XSS vulnerability. |

### 🟡 MEDIUM (Code Quality / Maintainability)

| # | Category | Finding | File(s) | Detail |
|---|----------|---------|---------|--------|
| **M-01** | **Dead Code** | `generate_report_5.py` — unrelated Python script in root | `generate_report_5.py` | 40KB Python script for report generation. Belongs in a separate tool/repo, not the portfolio. |
| **M-02** | **Dead Code** | `error.txt` in root | `error.txt` | 3KB error log. Should be in `.gitignore` or deleted. |
| **M-03** | **Dead Code** | `drizzle.config.json` (duplicate of `.ts`) | `drizzle.config.json` | See C-01. Also functionally dead since `drizzle-kit` prefers `.ts` config. |
| **M-04** | **Dead Code** | 20+ Markdown files in root (remediation reports, status, skill docs) | Root | `status.md` through `status_5.md`, `Remediation.md` through `Remediation_4.md`, 5 code review reports, `CONSOLIDATED_REMEDIATION_PLAN.md`, `IMPLEMENTATION_PLAN.md`, `Project_Architecture_Document.md`, `build_session.md`, skill files. Massive clutter. |
| **M-05** | **Dead Code** | 5 `*.tar.gz` archives in root | Root | Remediation archives + `claw-code-persona-definition.zip` + `skills-backup.tar.gz`. Should not be in the repo. |
| **M-06** | **Dead Code** | `docx-conversion/` directory | Root | Contains a single `SKILL.md`. Unrelated to portfolio. |
| **M-07** | **Dead Code** | `docs/` directory with prompt files | `docs/` | Contains prompt engineering files for AI reviews. Not part of the application. |
| **M-08** | **Performance** | Pointless `useMemo` wrapping module-level constants | `BentoGrid.tsx`, `Timeline.tsx`, `SkillsSection.tsx` | `useMemo(() => BENTO_ITEMS, [])` — `BENTO_ITEMS` is already a module constant. The memo does nothing. |
| **M-09** | **Performance** | Inline `style` objects recreated every render | All components | 108+ inline `style={{}}` instances across 16 components. Each creates a new object per render. Should be hoisted to module-level constants. |
| **M-10** | **Architecture** | `isErrorLike()` defined inside component body | `error.tsx` | Function is recreated every render. Should be a module-level utility. |
| **M-11** | **Architecture** | Direct DOM access via `getElementById` | `PortfolioApp.tsx` | `document.getElementById("theme-announcement")` is fragile. A React ref would be idiomatic. |
| **M-12** | **Type Safety** | `as ContactPayload` unsafe cast in API route | `route.ts` | No runtime type validation. A malformed body passes the cast silently. Zod/Valibot would provide actual validation. |
| **M-13** | **Type Safety** | `SocialLink.icon` typed as `string?` — should be `SocialIconVariant` | `types.ts` | The `icon` field exists but is never properly typed despite `SocialIconVariant` being defined. |
| **M-14** | **Type Safety** | `VALID_SECTIONS.includes(clean as Section)` uses unsafe cast | `useRouteHash.ts` | TypeScript's `Array.includes` doesn't narrow properly with `readonly` arrays. The cast masks potential bugs. |
| **M-15** | **Responsive** | Navigation mobile menu `top: "60px"` hardcoded | `Navigation.tsx` | If nav height changes, the overlay position breaks. Should use CSS variable or calculated value. |
| **M-16** | **Schema** | Analytics table never written to, no indexes | `schema.ts` | Schema exists but nothing inserts rows. Also stores `userAgent`/`referrer` with GDPR implications and no indexes. |
| **M-17** | **Build** | `tsconfig.json` `include` pattern catches `skills/**/*.ts` | `tsconfig.json` | `**/*.ts` include pattern is too broad — it catches the entire `skills/` directory. Should add `"skills"` to `exclude`. |
| **M-18** | **CSS** | `will-change: transform` on grain overlay with no transforms | `globals.css` | Wastes GPU memory. Should be removed or changed to `will-change: opacity`. |
| **M-19** | **CSS** | `-webkit-scrollbar` styles only work in Blink/WebKit | `globals.css` | Firefox users get default scrollbar styling. Minor cross-browser inconsistency for a brutalist design. |
| **M-20** | **Styling** | `textTransform: "uppercase" as const` — unnecessary cast | `HeroKinetic.tsx` | The `as const` is redundant; `"uppercase"` already satisfies `CSSProperties.textTransform`. |

### 🟢 LOW (Polish / Technical Debt)

| # | Category | Finding | File(s) |
|---|----------|---------|---------|
| **L-01** | Unused | `github` and `linkedin` fields (just usernames) in `siteConfig` appear unused | `site-config.ts` |
| **L-02** | Styling | `marginBottom: "4px"` in Timeline mixes spacing systems | `Timeline.tsx` |
| **L-03** | Testing | `vitest` not installed despite README mentioning `npm test` | `package.json` |
| **L-04** | Data | Placeholder company names in timeline ("Previous Company", "Earlier Role") | `timeline.ts` |
| **L-05** | Data | Missing portrait assets referenced in archived `data.ts` | `public/` |
| **L-06** | A11y | Missing `type="button"` on CTA button in Hero | `HeroKinetic.tsx` |
| **L-07** | A11y | "404" text read by screen readers without `aria-hidden` | `not-found.tsx` |
| **L-08** | Semantic | `SectionBlock` uses `<div>` instead of `<section>` | `SectionBlock.tsx` |
| **L-09** | Semantic | `Footer` outer container is `<div>`, not `<footer>` | `Footer.tsx` |
| **L-10** | Hydration | `CURRENT_YEAR = new Date().getFullYear()` at module scope | `Footer.tsx` |

---

## Phase 2: PLAN — Structured Audit Execution Roadmap

### Audit Phases

```
Phase A: Security Hardening (C-01 → C-05)
   ↓
Phase B: Type Safety & Data Integrity (C-06, H-08, H-09, M-12 → M-14)
   ↓
Phase C: Accessibility & SEO (H-01 → H-04, H-03, L-06 → L-09)
   ↓
Phase D: Performance Optimization (H-05, M-08, M-09, M-18)
   ↓
Phase E: Architecture & Code Quality (H-06, M-10 → M-11, M-15 → M-17, M-19 → M-20)
   ↓
Phase F: Dead Code Cleanup (M-01 → M-07)
   ↓
Phase G: Testing & CI (L-03)
   ↓
Phase H: Production Readiness (H-10, H-11, M-16, L-04 → L-05)
```

### Success Criteria

| Checkpoint | Verification Method |
|---|---|
| Zero TypeScript errors in `src/` | `npx tsc --noEmit` with `skills/` excluded |
| Zero ESLint errors | `npm run lint` |
| No hardcoded credentials | Grep for `postgres:`, passwords in source |
| All ARIA roles present | Manual + automated a11y audit |
| CSP without `unsafe-inline`/`unsafe-eval` | Verify `next.config.ts` headers |
| No `#` links in project data | Grep projects.ts for `"#"` |
| Dead files removed from root | `ls` verification |
| `skills/` excluded from compilation | `tsconfig.json` exclude |

---

## Key Discrepancies With Prior Audits

1. **`drizzle.config.json` was claimed as "fixed" in Remediation 4** — but the file still exists with hardcoded credentials. Only the `.ts` version was created; the old JSON was never deleted.

2. **`skills/` directory not mentioned in any prior audit** — 40+ unrelated skill modules polluting TypeScript compilation, bloating the repo, and causing all `typecheck` runs to fail.

3. **`og-image.png` missing** — No prior audit caught that the OG metadata references a non-existent image.

4. **CSP `unsafe-inline`/`unsafe-eval`** — Remediation 5 added security headers but with weak CSP directives. Prior audits didn't flag this as insufficient.

5. **Contact form deceptive success** — Prior audits noted "no email service" but didn't flag that returning `success: true` without sending is deceptive UX.

6. **`generate_report_5.py`, `error.txt`, `.tar.gz` archives, `docs/` prompts** — No prior audit flagged these as repo clutter.

---

This is my complete analysis. Shall I proceed with implementing the audit fixes in the prioritized order above? I'll await your explicit confirmation before writing any code, per the VALIDATE checkpoint.
The audit plan is complete and awaiting your validation. The 8-phase remediation plan covers **47 issues** across Security, Type Safety, Accessibility, Performance, Architecture, Dead Code, Testing, and Production Readiness — including **6 critical findings** not caught by prior audits (credential leak in `drizzle.config.json`, `skills/` compilation pollution, weak CSP, missing OG image, deceptive contact form success, and repo clutter).
