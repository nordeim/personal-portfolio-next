# Implementation Plan: Nicholas Yun Portfolio — Next.js Port
## "The Engineered Soul" (v2.0) → Next.js 16 App Router

### Executive Summary
Port the avant-garde Tactile Brutalism + High-End Editorial portfolio from a Vite SPA 
to the Next.js 16 App Router, preserving ALL design fidelity, interactions, and content.

---

## Architecture Decisions

### 1. Content Strategy
- Replace `import.meta.glob` with **static TypeScript data** in `src/lib/`
- Inline all markdown content as TypeScript string constants
- Portrait images served from `/public/portraits/`

### 2. Routing Strategy  
- All portfolio logic runs as a **Client Component** (`"use client"`)
- Hash-based routing preserved via `useRouteHash` hook
- Next.js App Router used only as entry point

### 3. Component Strategy
- All 16 components ported to `src/components/`
- All 3 hooks ported to `src/hooks/`
- Design system ported to `src/app/globals.css`

---

## ToDo List (Validated)

### Phase 0: Design System & Fonts ✅
- [x] Port `src/styles/index.css` → `src/app/globals.css` (full @theme, grid, animations)
- [x] Update `src/app/layout.tsx` with Google Fonts + metadata + theme class
- [x] Copy portrait images to `public/portraits/`

### Phase 1: Types & Static Data ✅
- [x] Create `src/lib/types.ts` — all TypeScript interfaces
- [x] Create `src/lib/data.ts` — heroSlides, aboutPillars, socialLinks, collectionDefinitions
- [x] Create `src/lib/content.ts` — static content arrays (portfolio, collections)

### Phase 2: Hooks ✅
- [x] Create `src/hooks/useWeightedScroll.ts`
- [x] Create `src/hooks/useRouteHash.ts`
- [x] Create `src/hooks/useReducedMotion.ts`

### Phase 3: Core Components ✅
- [x] Create `src/components/BrandMark.tsx`
- [x] Create `src/components/SocialIcon.tsx`
- [x] Create `src/components/ThemeToggle.tsx`
- [x] Create `src/components/GrainOverlay.tsx`
- [x] Create `src/components/LayoutShell.tsx`
- [x] Create `src/components/Navigation.tsx`
- [x] Create `src/components/MobileDrawer.tsx`

### Phase 4: Section Components ✅
- [x] Create `src/components/HeroKinetic.tsx`
- [x] Create `src/components/AboutFlow.tsx`
- [x] Create `src/components/BentoTile.tsx`
- [x] Create `src/components/BentoGrid.tsx`
- [x] Create `src/components/ContentBody.tsx`
- [x] Create `src/components/ArchiveItemCard.tsx`
- [x] Create `src/components/ArchiveSpread.tsx`
- [x] Create `src/components/ContactSection.tsx`
- [x] Create `src/components/MachineOverlay.tsx`

### Phase 5: Main App ✅
- [x] Create `src/components/PortfolioApp.tsx` — main client-side SPA orchestrator
- [x] Update `src/app/page.tsx` — render PortfolioApp

### Phase 6: Validation ✅
- [x] Run `npx next typegen`
- [x] Run `tsc --noEmit`
- [x] Run `npm run build`
- [x] Run `build_and_start`

---

## Design Fidelity Checklist

- [ ] 28px visible background grid (both themes)
- [ ] Cormorant Garamond (editorial) + IBM Plex Mono (utility) + Inter (body)
- [ ] Kinetic typography: scroll velocity → font-weight (200-950)
- [ ] Tactile Brutalism: 0px border-radius everywhere
- [ ] Grain overlay (human fingerprint)
- [ ] Dual theme: Night (dark) + Day (warm cream)
- [ ] Machine Mode overlay with terminal aesthetics
- [ ] Pointer parallax on hero portrait
- [ ] Auto-rotating hero slides (10s interval)
- [ ] AboutFlow with stable-height pillar swap animation
- [ ] Asymmetric Bento Grid with category textures
- [ ] Archive spread with collection + item detail views
- [ ] Hash-based routing (#collection/slug, #portfolio/slug)
- [ ] WCAG AAA: skip link, focus-visible, reduced motion
- [ ] Mobile drawer navigation
