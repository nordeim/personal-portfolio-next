### Phase 8: ThemeSwitch Hydration Fix
- **ISSUE**: After removing `ssr: false`, `ThemeSwitch` caused a hydration mismatch because it read `localStorage`/`matchMedia` during render (server renders `"day"`, client could render `"night"`)
- **FIX**: Implemented two-pass render pattern:
  - SSR + first client render: always render `"day"` safe default
  - After hydration: `useEffect` + `requestAnimationFrame` reads `data-theme` DOM attribute (set by `ThemeScript.tsx`) and re-renders with actual theme
- `requestAnimationFrame` defers state update to next paint, avoiding React 19 `setState-in-effect` ESLint error
- Visual cue: `opacity: 0.6` and `aria-disabled` during pre-hydration state
- **PATTERN**: This two-pass render strategy generalizes to ANY component that needs client-only state after SSR is enabled. Safe default on server -> sync to actual value after hydration.