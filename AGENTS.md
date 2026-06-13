# Agent Instructions: Nicholas Yun Portfolio (v2.0)

This is a high-signal brief for agents working on "The Engineered Soul" portfolio.

## Core Identity
- **Stack**: Next.js 16 (App Router), Tailwind CSS v4, Drizzle ORM, PostgreSQL.
- **Aesthetic**: "Tactile Brutalism" + "High-End Editorial".
- **Primary Design Constraint**: **Zero border-radius** globally. Use the **28px mathematical grid** for all spacing.

## Operational Gotchas
- **State Discrepancy**: `IMPLEMENTATION_PLAN.md` marks the port as complete, but **`src/app/page.tsx` is still the starter template** and the orchestrator **`src/components/PortfolioApp.tsx` is missing**.
- **Routing**: This is a Client-Side SPA Orchestrator model inside Next.js. Use hash-based routing (#work, #about) via `useRouteHash.ts`.
- **Content**: Managed as static TypeScript data in `src/lib/data.ts` and `src/lib/content.ts`. Do not use `import.meta.glob`.

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
  - Wrap entire app in `LayoutShell.tsx` for perimeter borders.
- **Styling**: Tailwind v4 with CSS variables from `globals.css`. Support `theme-night` and `theme-day` classes on `<html>`.

## Critical "Never" List
- **Never** use `border-radius` (unless explicitly requested for a specific non-UI element).
- **Never** use `any` in TypeScript.
- **Never** use Vite-specific features like `import.meta.glob`.
- **Never** add speculative "AI slop" or safe defaults (e.g., rounded cards, Inter-only typography).
