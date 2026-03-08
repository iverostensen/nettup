---
phase: 28-floatingnav-rewrite
plan: 01
subsystem: ui
tags: [astro, react, framer-motion, navigation, transition-persist, ssr]

requires: []
provides:
  - Server-rendered FloatingNav Astro component with transition:persist
  - Self-managing MobileMenu React island via custom event
  - Zero-flash SPA navigation (no visibility:hidden hack)
affects: [BaseLayout, all pages using BaseLayout]

tech-stack:
  added: []
  patterns:
    - "Astro component with transition:persist for persistent server-rendered UI"
    - "Custom DOM event (open-mobile-menu) as cross-boundary trigger from Astro to React island"
    - "Vanilla JS inline script in Astro component for scroll, active links, and entrance animation"

key-files:
  created:
    - src/components/layout/FloatingNav.astro
  modified:
    - src/components/islands/MobileMenu.tsx
    - src/layouts/BaseLayout.astro
    - src/styles/global.css

key-decisions:
  - "FloatingNav converted from client:only React island to Astro component + transition:persist — eliminates hydration gap that caused raw HTML flash"
  - "MobileMenu stays React island (Framer Motion animations) but receives open trigger via CustomEvent('open-mobile-menu') dispatched by Astro hamburger button"
  - "Tjenester sub-page label (e.g. 'Nettside') is correct on initial SSR load; after SPA navigation updateActiveLinks correctly highlights Tjenester as active but label reverts to 'Tjenester' — acceptable tradeoff, color state is correct"
  - "sessionStorage key 'nav-animated' gates the entrance slide-down — only plays once per browser session, never on SPA navigations where nav persists in DOM"
  - "Scroll hide/show uses raw scroll Y delta + 80px threshold (not scrollYProgress) — simpler, no Framer Motion dependency in vanilla script"
  - "html[data-loading] visibility:hidden hack removed entirely — no longer needed now that nav is server-rendered and visible from first byte"

patterns-established:
  - "Astro + React island boundary: Astro dispatches CustomEvent, React island listens via document.addEventListener in useEffect"
  - "data-nav-href attribute on anchor tags enables vanilla JS active link updates post-SPA navigation without React re-render"

requirements-completed: [NAV-01, NAV-02, NAV-03]

duration: 5min
completed: 2026-03-08
---

# Phase 28 Plan 01: FloatingNav Rewrite Summary

**Server-rendered Astro FloatingNav with transition:persist replacing client:only React island, eliminating SPA navigation flash without visibility:hidden hack**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-08T17:45:13Z
- **Completed:** 2026-03-08T17:50:00Z
- **Tasks:** 2 of 3 (Task 3 is human-verify checkpoint — awaiting approval)
- **Files modified:** 4

## Accomplishments
- Created `FloatingNav.astro` — nav is in SSR HTML from first byte, no async mount, no hydration gap
- MobileMenu refactored to self-manage open state via `open-mobile-menu` CustomEvent
- Removed `html[data-loading] body { visibility: hidden }` hack — was masking the symptom; now the cause is eliminated
- Nav scroll hide/show, entrance animation (once per session), and active link updates all work via inline vanilla JS

## Task Commits

1. **Task 1: Refactor MobileMenu to self-manage open state via custom event** - `7a16d13` (refactor)
2. **Task 2: Create FloatingNav.astro and clean up BaseLayout + global.css** - `a87ae0d` (feat)
3. **Task 3: Human verification checkpoint** - awaiting user approval

## Files Created/Modified
- `src/components/layout/FloatingNav.astro` - New server-rendered nav with transition:persist and inline JS
- `src/components/islands/MobileMenu.tsx` - Self-managing open state via custom event and astro:after-swap
- `src/layouts/BaseLayout.astro` - Imports Astro FloatingNav, removed data-loading script block
- `src/styles/global.css` - Added .floating-nav transitions + nav-entrance keyframe; removed html[data-loading] rule

## Decisions Made

- **transition:persist approach:** Astro's `transition:persist` keeps the nav as a live DOM node across all SPA navigations — it never unmounts/remounts, so there is no window where the nav is missing.
- **Tjenester label tradeoff:** On initial server render the specific service name (e.g. "Nettside") is shown in the nav when on a tjenester sub-page. After SPA navigation to such a page, the label reverts to "Tjenester" (the active color is still correct). This is intentional — implementing real-time label updates via vanilla JS would require duplicating the service name lookup in client-side JS, adding complexity for a minor visual detail.
- **sessionStorage for entrance animation:** `sessionStorage.getItem('nav-animated')` gates the slide-in animation. Since `transition:persist` keeps the nav in the DOM across navigations, the `animationend` listener fires once and the class is removed — it won't re-animate. The sessionStorage check is a safety net for hard refreshes in the same session.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

Human verification checkpoint (Task 3) pending. Once approved, the plan is fully complete.

- Nav behavior to verify: no flash on SPA navigation, active links, scroll hide/show, entrance animation once, mobile menu open/close, no console errors.
- FloatingNav.tsx (`src/components/islands/FloatingNav.tsx`) is now dead code — can be deleted in a follow-up cleanup if desired.

---
*Phase: 28-floatingnav-rewrite*
*Completed: 2026-03-08*
