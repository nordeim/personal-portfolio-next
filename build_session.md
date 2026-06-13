🧠 Deep Analysis — Complete Understanding
Current State (Next.js Sandbox)
The current Next.js sandbox is a bare starter template with PostgreSQL/Drizzle. The source portfolio is a sophisticated React+Vite+TS+Tailwind v4 SPA with:

16 components, 3 hooks, 3 lib files
Tactile Brutalism + High-End Editorial design system
28px grid, kinetic typography, dual theme
Content ingestion via import.meta.glob
Hash-based routing system
Machine Mode overlay
The Challenge
The source is a Vite SPA — the target is Next.js App Router. This requires architectural adaptation:

import.meta.glob → Next.js file system / static data approach
Client-side hash routing → Next.js usePathname / client components
Vite CSS-first Tailwind v4 → Next.js Tailwind v4 (already configured)
No DB dependency needed for portfolio
Implementation Strategy
Port all 16 components as Next.js Client Components (maintaining all design fidelity)
Port all 3 hooks as-is (browser-only, properly gated)
Replace import.meta.glob with static content imports (JSON/inline data) since Next.js doesn't have Vite's glob
Preserve ALL design decisions — design system, typography, interactions, brutalist aesthetics
Adapt routing to use React state + hash routing (same pattern, client-side)
Port content as static TypeScript data structures
