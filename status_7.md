exhilarated to craft six unique avant-garde wedding invitations for Emma and Ryan, I immediately see the potential to transform this brief into a truly bespoke set. The two aesthetics—Neo-Brutalism and "Astral Garden"—are distinct and exciting. Neo-Brutalism's "raw honesty" and bold typography provide a great counterpoint to the "Astral Garden's" ethereal, gold-foiled mysticism. Ensuring they are print-ready is also a must.
I'll proceed by crafting each invitation as a narrative, embedding these themes into the design. Once the initial concepts are established, I'll confirm and attach five custom trackable URL parameters, each fulfilling the security protocol.
To begin the comprehensive design process for the "0470: SEO EXPERT YouTube Script Social Media Integration System," I'll first need to carefully re-examine and consolidate the provided list of links and information. This will inform the most impactful way to structure the comprehensive content.
When starting new features, I remember the devcontainer.json was previously a massive "kitchen sink" of settings, so I'll plan to keep that updated and current. Similarly, for the -platform_framework_manual_installer.py, the next steps involve integrating the find_missing_modules utility. This will create a requirements-missing.txt and a test script that checks for packages not found in the standard library, significantly improving the overall installation process and reliability.
Consistency is key across all deliverables to maintain a cohesive and high-quality output. I will ensure all information is synthesized into a clear, actionable design.
I'll start with an initial inventory of these elements, and then proceed according to your outlined priorities. I'm looking forward to generating these targeted visuals and refining the content for paid social media.

# Wrote remediation_8_section.md
### Phase 8: ThemeSwitch Hydration Fix
- **ISSUE**: After removing `ssr: false`, `ThemeSwitch` caused a hydration mismatch because it read `localStorage`/`matchMedia` during render (server renders `"day"`, client could render `"night"`)
- **FIX**: Implemented two-pass render pattern:
  - SSR + first client render: always render `"day"` safe default
  - After hydration: `useEffect` + `requestAnimationFrame` reads `data-theme` DOM attribute (set by `ThemeScript.tsx`) and re-renders with actual theme
- `requestAnimationFrame` defers state update to next paint, avoiding React 19 `setState-in-effect` ESLint error
- Visual cue: `opacity: 0.6` and `aria-disabled` during pre-hydration state
- **PATTERN**: This two-pass render strategy generalizes to ANY component that needs client-only state after SSR is enabled. Safe default on server -> sync to actual value after hydration.

Important New Lesson 51 – Two-Pass Render for SSR Safety:
Lesson 51: Two-pass render is required when SSR is enabled and components read client-only APIs
- What happened: After removing ssr: false, ThemeSwitch.tsx caused a hydration mismatch because it read localStorage/matchMedia during render. The server rendered "day" but the client could render "night", causing React to detect a mismatch.
- Fix: Implemented two-pass render. SSR + first client render always renders "day" (safe default). After hydration, useEffect + requestAnimationFrame reads the data-theme DOM attribute (set by ThemeScript.tsx) and re-renders with the actual theme.
- Prevention: When enabling SSR, audit all components that access localStorage, matchMedia, window, or document during render. These CANNOT run during SSR. Use the two-pass render pattern (safe default → useEffect sync) or read from a DOM attribute set by a blocking <head> script.
- 
Key insight: The requestAnimationFrame wrapper defers the state update to the next paint, which avoids both the hydration mismatch AND the React 19 setState-in-effect ESLint error. This is the correct pattern for all client-only initialization after SSR is enabled.
Phase 8: ThemeSwitch Hydration Fix
- 
ISSUE: After removing ssr: false, ThemeSwitch caused a hydration mismatch because it read localStorage/matchMedia during render (server renders "day", client could render "night")
- 
FIX: Implemented two-pass render pattern:
- 
SSR + first client render: always render "day" safe default
- 
After hydration: useEffect + requestAnimationFrame reads data-theme DOM attribute (set by ThemeScript.tsx) and re-renders with actual theme
- 
requestAnimationFrame defers state update to next paint, avoiding React 19 setState-in-effect ESLint error
- 
Visual cue: opacity: 0.6 and aria-disabled during pre-hydration state
- 
PATTERN: This two-pass render strategy generalizes to ANY component that needs client-only state after SSR is enabled. Safe default on server → sync to actual value after hydration.
All three documentation files (README.md, AGENTS.md, CLAUDE.md) have been updated with this Remediation 8 information.
Verification
Check	Result
npm run typecheck	✅ Passed (0 errors)
npx eslint src/	✅ Passed (0 errors, 1 benign warning)
npm run build	✅ Passed (static pages generated successfully)
ThemeSwitch.tsx two-pass render	✅ Implemented with useEffect + requestAnimationFrame
CSP unsafe-eval	✅ Confirmed removed from script-src

