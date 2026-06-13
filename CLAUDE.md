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
- **Server Components**: Default to Server Components; use `'use client'` only for interactivity (e.g., `PortfolioApp.tsx`).
- **Metadata API**: Use `generateMetadata` and `export const metadata` in `layout.tsx`.
- **next/font**: Use `next/font` for Google Fonts (Garamond, IBM Plex Mono, Inter).

### Design System & Styling
- **Brutalist Enforcement**: `border-radius: 0px !important` is enforced globally.
- **28px Grid**: Layout is governed by a 28px mathematical backbone (`var(--unit)`).
- **Typography Hierarchy**:
  - **Editorial**: `Cormorant Garamond` (Headings/Narrative).
  - **Utility**: `IBM Plex Mono` (Labels/Machine Mode).
  - **Body**: `Inter` (General content).
- **Dual Theme**: Support for `theme-night` (Dark) and `theme-day` (Warm Cream).

### Architecture & Routing
- **Client-Side Orchestrator**: Most portfolio logic runs in `PortfolioApp.tsx` (Client Component).
- **Hash Routing**: Preserved via `useRouteHash` hook (e.g., `#portfolio/slug`).
- **Static Content**: Portfolio content is managed as static TypeScript data in `src/lib/data.ts` and `src/lib/content.ts`.

## Development Workflow

### Build Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |

### Database (Drizzle)
| Command | Purpose |
|---------|---------|
| `npx drizzle-kit push` | Sync schema to DB |
| `npx drizzle-kit studio` | Open DB explorer |

## Testing Strategy

- **Test-Driven Development**: Write failing tests first; test behavior, not implementation.
- **Command**: `npm test`

## Code Quality Standards

- **TypeScript Strict Mode**: No `any`, explicit types on all parameters/returns.
- **Early Returns**: Prefer early returns over nested conditionals.
- **Composition over Inheritance**: Favor wrapper classes and factory functions.

## Project-Specific Standards

### Visual Fidelity Checklist
- [ ] 28px visible background grid (both themes).
- [ ] Kinetic typography: scroll velocity → font-weight (200-950).
- [ ] Grain overlay (human fingerprint).
- [ ] Machine Mode overlay with terminal aesthetics.
- [ ] Pointer parallax on hero portrait.
- [ ] WCAG AAA: skip link, focus-visible, reduced motion.

### Environment Variables
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
