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

