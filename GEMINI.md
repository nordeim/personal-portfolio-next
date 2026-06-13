# Nicholas Yun Portfolio — "The Engineered Soul" (v2.0)

A digital installation balancing **Tactile Brutalism** with **High-End Editorial**. This project is a port of the Nicholas Yun portfolio from a Vite SPA to the **Next.js 16 App Router**, preserving all design fidelity, interactions, and content.

## Project Overview

- **Purpose:** Personal portfolio and digital archive for Nicholas Yun, Creative Technologist.
- **Architecture:** Next.js 16 (App Router) with a Client-Side SPA Orchestrator (`PortfolioApp.tsx`).
- **Tech Stack:**
  - **Framework:** Next.js 16.2.6
  - **Styling:** Tailwind CSS 4.0 + PostCSS (Brutalist defaults)
  - **Database:** PostgreSQL with Drizzle ORM (0.45.2)
  - **Language:** TypeScript 5.9.3
  - **Icons:** Custom SVG and Lucide-style React components.

## Building and Running

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Quality Control
```bash
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript type checking
```

### Database (Drizzle)
```bash
npx drizzle-kit push  # Sync schema to DB
npx drizzle-kit studio # Open DB explorer
```

## Development Conventions

### 1. Design Philosophy: "Tactile Brutalism + High-End Editorial"
- **Brutalist Enforcement:** `border-radius: 0px !important` is enforced globally in `globals.css`. Do not use rounded corners.
- **The 28px Grid:** The layout is governed by a 28px mathematical unit. Use `var(--unit)` or `28px` for spacing and alignment.
- **Typography Hierarchy:**
  - **Editorial:** `Cormorant Garamond` (Serif) — for headings and narrative.
  - **Utility:** `IBM Plex Mono` (Monospace) — for labels, stats, and "Machine Mode".
  - **Body:** `Inter` (Sans-serif) — for general content.
- **Dual Theme:** Support for `theme-night` (Dark) and `theme-day` (Warm Cream). Use CSS variables defined in `globals.css` (e.g., `var(--bg-primary)`, `var(--text-primary)`).

### 2. Implementation Rules
- **Client-Side Orchestration:** Most portfolio logic runs as a Client Component (`"use client"`) to preserve complex animations and hash-based routing.
- **Routing:** Use hash-based routing (e.g., `#portfolio/slug`) handled by the `useRouteHash` hook.
- **Content Strategy:** Content is managed as static TypeScript data in `src/lib/data.ts` and `src/lib/content.ts`.
- **Accessibility (WCAG AAA):**
  - Always include a skip link (provided in `globals.css`).
  - Use `focus-visible` for keyboard navigation.
  - Respect `prefers-reduced-motion` for all animations.

### 3. Component Architecture
- **Stateless Primitives:** Keep core UI components in `src/components/` as stateless as possible.
- **Interactions:** Use custom hooks in `src/hooks/` for velocity-based scrolling, hash management, and motion detection.

## Project Structure
- `src/app/`: Next.js App Router entry points and global styles.
- `src/components/`: Modular UI components (BentoGrid, HeroKinetic, AboutFlow, etc.).
- `src/hooks/`: Custom interaction logic.
- `src/lib/`: Types, static data, and content arrays.
- `src/db/`: Drizzle schema and database client.
- `public/`: Static assets (portraits, icons).

---

*Note: This GEMINI.md is a living document. Update it as the project evolves.*
