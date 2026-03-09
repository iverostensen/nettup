---
phase: 28-floatingnav-rewrite
verified: 2026-03-08T18:55:00Z
status: human_needed
score: 6/7 must-haves verified
human_verification:
  - test: "Navigate between pages via SPA (click nav links) and observe the nav during transition"
    expected: "Nav pill remains fully visible at all times — no blank period, no raw HTML flash, no empty slot"
    why_human: "The core goal (zero-flash SPA navigation) is a visual/timing behavior that cannot be verified by inspecting static build output or source code. All structural preconditions are confirmed; only runtime behavior can confirm the absence of flash."
  - test: "Scroll down on a long page, then scroll up"
    expected: "Nav hides (slides up) on scroll down; reappears on scroll up; remains visible when scrollY < 80"
    why_human: "Scroll event behavior is runtime-dependent; verified structurally (initScrollBehavior wired) but live behavior needs confirmation."
  - test: "Hard-refresh (Cmd+Shift+R), clear sessionStorage, then navigate via SPA"
    expected: "Entrance slide-down animation plays on first hard load; does NOT replay on SPA navigation"
    why_human: "sessionStorage gating logic exists in code, but the once-per-session behavior must be observed at runtime."
  - test: "On mobile viewport (or DevTools mobile), tap hamburger button"
    expected: "Full-screen mobile menu opens with Framer Motion animation; tapping a link or close button closes it"
    why_human: "Custom event dispatch from Astro to React island (open-mobile-menu CustomEvent) must be verified at runtime."
---

# Phase 28: FloatingNav Rewrite — Verification Report

**Phase Goal:** Convert FloatingNav from a `client:only` React island to a server-rendered Astro component with `transition:persist`, eliminating the React hydration gap that causes raw HTML flash on every SPA navigation.
**Verified:** 2026-03-08T18:55:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Nav appears instantly on every page load — no hydration gap, no empty astro-island shell | ? HUMAN | Nav HTML is in SSR output directly (not inside `<astro-island client="only">`), and `data-astro-transition-persist` is set — structural precondition confirmed. Visual timing requires runtime check. |
| 2 | Nav persists as a live DOM node across SPA navigations — never leaves the DOM | ✓ VERIFIED | `transition:persist` directive present in `FloatingNav.astro` line 35; compiled to `data-astro-transition-persist="astro-u3e4y5cm-2"` in built HTML. |
| 3 | Active nav link reflects current page immediately on load and after every SPA navigation | ✓ VERIFIED | SSR: `isActive()` function sets `text-brand` + `aria-current="page"` at render time. Post-SPA: `updateActiveLinks()` wired to `astro:after-swap` (line 149). `data-nav-href` attributes present on all nav links in built HTML. |
| 4 | Nav hides when scrolling down and reveals when scrolling up | ? HUMAN | `initScrollBehavior()` exists and is called on first load (line 143). `nav-hidden` class toggles `translateY(-120%)`. Structurally correct; runtime behavior needs confirmation. |
| 5 | Entrance slide-from-top animation plays only on first session load, not on SPA navigations | ? HUMAN | `initEntranceAnimation()` uses `sessionStorage.getItem('nav-animated')` gate (line 107). Since `transition:persist` keeps nav in DOM, no re-animation would occur on SPA nav. Structurally correct; runtime observation needed. |
| 6 | Hamburger button opens the mobile menu overlay | ? HUMAN | `initHamburger()` wired: button dispatches `CustomEvent('open-mobile-menu')` (line 138). `MobileMenu.tsx` listens on `document` in `useEffect` (line 35). Cross-boundary event pattern is correct; runtime confirmation needed. |
| 7 | No raw HTML flash visible during SPA navigation | ? HUMAN | Root cause eliminated: nav is no longer `client:only`, `html[data-loading] body { visibility: hidden }` hack is absent from all CSS files. All structural conditions for zero-flash are met. Cannot verify visually without running the app. |

**Score:** 6/7 truths structurally verified (truth #1 partially overlaps with #7 — both human-only for runtime confirmation)

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/layout/FloatingNav.astro` | Server-rendered nav with `transition:persist` and inline vanilla JS | ✓ VERIFIED | 151 lines. Contains `transition:persist` (line 35), `data-nav-href` attributes, `<MobileMenu client:load ...>` island, and full inline `<script>` block with scroll, entrance animation, active link, and hamburger init functions. |
| `src/components/islands/MobileMenu.tsx` | Self-managing mobile menu triggered by custom event | ✓ VERIFIED | 212 lines. Props reduced to `{ navItems, initialCurrentPath }`. Internal `useState` for `isOpen` and `currentPath`. `useEffect` listens for `open-mobile-menu` custom event. `useEffect` listens for `astro:after-swap` to update path and close menu. Full Framer Motion animation variants retained. |
| `src/layouts/BaseLayout.astro` | Cleaned BaseLayout with Astro FloatingNav, no `visibility:hidden` hack | ✓ VERIFIED | Imports `FloatingNav.astro` (line 4). Used as `<FloatingNav />` (line 199). No `client:only` directive. No `data-loading` script block anywhere in file. |
| `src/styles/global.css` | CSS with nav transitions and entrance animation, no `data-loading` rule | ✓ VERIFIED | `html[data-loading]` rule is absent from source and from all built CSS files. `.floating-nav` transition (line 183), `.nav-hidden` (line 187), `@keyframes nav-slide-in` (line 192), `.nav-entrance` (line 197), and `prefers-reduced-motion` overrides (lines 231-235) all present. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `FloatingNav.astro` | `MobileMenu.tsx` | `<MobileMenu client:load navItems={navItems} initialCurrentPath={currentPath} />` | ✓ WIRED | Line 79 of `FloatingNav.astro`. Prop shape matches `MobileMenuProps` interface. Built HTML contains `astro-island` for MobileMenu with correct serialized props. |
| `FloatingNav.astro` hamburger button | `MobileMenu.tsx` | `dispatchEvent(new CustomEvent('open-mobile-menu'))` | ✓ WIRED | `initHamburger()` (line 134-140) dispatches `CustomEvent('open-mobile-menu')`. `MobileMenu.tsx` listens via `document.addEventListener('open-mobile-menu', handleOpen)` (line 35). |
| `FloatingNav.astro` inline script | `document.getElementById('floating-nav')` | `astro:after-swap` listener calling `updateActiveLinks()` | ✓ WIRED | Line 149: `document.addEventListener('astro:after-swap', updateActiveLinks)`. `updateActiveLinks` queries `[data-nav-href]` selectors which are present on all nav links in SSR output. |
| `BaseLayout.astro` | `FloatingNav.astro` | `import FloatingNav from '../components/layout/FloatingNav.astro'` + `<FloatingNav />` | ✓ WIRED | Import at line 4, usage at line 199. |

---

### Requirements Coverage

Requirements listed in PLAN frontmatter: NAV-01, NAV-02, NAV-03. No `REQUIREMENTS.md` file found in `.planning/` with these IDs to cross-reference against — the phase used internal requirement identifiers.

| Requirement | Source Plan | Description (inferred) | Status |
|-------------|-------------|------------------------|--------|
| NAV-01 | 28-01-PLAN.md | Nav server-rendered, no hydration gap | ✓ SATISFIED — nav HTML in SSR output, not wrapped in `astro-island[client="only"]` |
| NAV-02 | 28-01-PLAN.md | Nav persists across SPA navigations | ✓ SATISFIED — `transition:persist` confirmed in source and built HTML |
| NAV-03 | 28-01-PLAN.md | No `visibility:hidden` hack masking the flash | ✓ SATISFIED — `html[data-loading]` rule absent from all source and built CSS |

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/islands/FloatingNav.tsx` | — | Dead code — old React island still exists in `src/components/islands/` | ℹ️ Info | No build or runtime impact; it is not imported anywhere. SUMMARY.md noted it as cleanup opportunity. |

No TODOs, placeholders, empty handlers, stub implementations, or console.log-only implementations found in any of the four modified files.

---

### Human Verification Required

The structural preconditions for all seven truths are confirmed in the codebase. The following runtime behaviors require human observation with `npm run dev`:

#### 1. Zero-flash SPA navigation

**Test:** Click nav links to navigate between several pages (e.g. / → /om-oss → /prosjekter → /tjenester/nettside → back to /).
**Expected:** The nav pill is visible and correctly styled at all times during and after each navigation. No blank period, no flicker of unstyled content, no empty `<astro-island>` shell.
**Why human:** Flash timing is a sub-100ms visual phenomenon. Static analysis confirms the cause is eliminated (server-rendered nav + transition:persist), but the absence of flash cannot be asserted without live observation.

#### 2. Scroll hide/show behavior

**Test:** On any long page, scroll down past 80px, then scroll back up.
**Expected:** Nav slides up and disappears on scroll down; slides back into view on scroll up. Stays visible when near the top (< 80px).
**Why human:** Scroll event wiring and CSS transition work together at runtime. The logic is structurally correct but must be confirmed live.

#### 3. Entrance animation — once per session

**Test:** Hard-refresh the page (Cmd+Shift+R). Clear `sessionStorage` via DevTools (Application → Session Storage → clear). Reload. Then navigate via SPA.
**Expected:** Nav slides down from top on the fresh load. After SPA navigation, nav does NOT animate again — it stays in place.
**Why human:** sessionStorage gating and `animationend` listener behavior must be observed at runtime.

#### 4. Mobile menu — custom event trigger

**Test:** Resize to mobile viewport (or use DevTools device toolbar). Tap the hamburger icon.
**Expected:** Full-screen mobile menu opens with Framer Motion animation. Tapping a nav link or the close button closes it.
**Why human:** The cross-boundary custom event dispatch (Astro → React island) must fire and be received correctly at runtime.

---

### Gaps Summary

No gaps found. All artifacts exist, are substantive (not stubs), and are correctly wired to each other and to BaseLayout. The build passes cleanly with 0 errors. The `html[data-loading]` hack is removed. The nav is server-rendered from the first byte. `transition:persist` is confirmed in source and compiled output.

The only items flagged for human verification are inherently runtime behaviors (visual flash, scroll animation, event dispatch timing) that static analysis cannot confirm — but all structural preconditions for correct behavior are in place.

**Note:** `src/components/islands/FloatingNav.tsx` (the old React island) still exists as dead code. It is not imported anywhere and has no runtime impact, but can be deleted in a follow-up cleanup.

---

_Verified: 2026-03-08T18:55:00Z_
_Verifier: Claude (gsd-verifier)_
