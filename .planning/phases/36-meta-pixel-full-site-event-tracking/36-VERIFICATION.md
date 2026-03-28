---
phase: 36-meta-pixel-full-site-event-tracking
verified: 2026-03-28T18:34:00Z
status: passed
score: 9/9 must-haves verified
re_verification: false
human_verification:
  - test: "Meta Pixel fires PageView on non-landing-page BaseLayout routes"
    expected: "Facebook Pixel Helper shows PageView event on /om-oss, /tjenester, etc. when PUBLIC_META_PIXEL_ID is set"
    why_human: "Pixel ID env var is empty in dev; runtime SDK presence cannot be verified without a live pixel ID and browser extension"
  - test: "Consent banner appears and accept/decline buttons grant/revoke fbq consent correctly"
    expected: "Clicking 'Godta' causes fbq('consent','grant') to fire; clicking 'Avslå' keeps pixel revoked; banner disappears in both cases"
    why_human: "localStorage state machine and fbq SDK consent flow require browser testing"
  - test: "ViewContent fires on /tjenester/nettside, /nettbutikk, /landingsside, /priskalkulator after user accepts consent"
    expected: "Facebook Pixel Helper shows ViewContent with correct content_name on each page after accepting banner"
    why_human: "Consent gate requires localStorage state; data-astro-rerun behavior requires view transition navigation in browser"
---

# Phase 36: Meta Pixel Full-Site Event Tracking Verification Report

**Phase Goal:** Implement consent-aware Meta Pixel tracking across the full Nettup site -- base code in both layouts, ViewContent retargeting events on high-value pages, Lead conversion event on the thank-you page, and 5-param UTM capture for Facebook attribution.
**Verified:** 2026-03-28T18:34:00Z
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths (Plan 01)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Meta Pixel loads on every page using BaseLayout with `fbq('consent','revoke')` before `fbq('init')` | VERIFIED | BaseLayout.astro line 221 (revoke) before line 247 (init), both inside `if (pixelId)` guard |
| 2 | Meta Pixel loads on LandingPageLayout pages with same consent revoke-before-init order | VERIFIED | LandingPageLayout.astro line 214 (revoke) before line 240 (init) |
| 3 | Accepting the consent banner grants both gtag and fbq consent in a single click | VERIFIED | Both layouts: accept handler calls `gtag('consent','update',...)` + `fbq('consent','grant')` together |
| 4 | Consent banner appears on all pages (BaseLayout), not just landing pages | VERIFIED | BaseLayout.astro lines 299-324 contain `id="cookie-banner"` with `transition:persist` |
| 5 | Consent banner decline and accept buttons have equal solid styling | VERIFIED | Both buttons use solid backgrounds: decline `bg-slate-700`, accept `bg-brand` -- no ghost style |
| 6 | Pixel ID is injected from PUBLIC_META_PIXEL_ID env var, not hardcoded | VERIFIED | `const pixelId = import.meta.env.PUBLIC_META_PIXEL_ID \|\| ''` in both layout frontmatter sections; passed via `define:vars={{ pixelId }}` |

### Observable Truths (Plan 02)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 7 | ViewContent event fires on /nettside-for-bedrift, /priskalkulator, and 3 tjenester pages with content_name | VERIFIED | All 5 pages contain consent-gated `fbq('track','ViewContent',{content_name:...})` with correct values |
| 8 | Lead event fires on /nettside-for-bedrift/takk alongside existing gtag conversion and Plausible events | VERIFIED | takk.astro lines 71-85 contain all three: `gtag('event','conversion',...)`, `plausible('B2B Lead')`, `fbq('track','Lead')` |
| 9 | UTM capture stores all 5 params in sessionStorage; form components spread them into submissions | VERIFIED | utm.ts UTM_KEYS has 5 entries; HeroMicroForm.tsx and ContactForm.tsx both call `getUtmParams()` spread |

**Score:** 9/9 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/layouts/BaseLayout.astro` | Unified consent IIFE with gtag+fbq, consent banner, Meta Pixel base code | VERIFIED | All patterns present; fbq revoke at line 221, init at 247, banner at 299-324 |
| `src/layouts/LandingPageLayout.astro` | Updated consent IIFE with fbq alongside gtag | VERIFIED | fbq loader, revoke, grant in accept handler, init + PageView all present |
| `src/pages/nettside-for-bedrift/index.astro` | ViewContent event for B2B landing page | VERIFIED | Contains `fbq('track', 'ViewContent', { content_name: 'B2B Landingsside' })` |
| `src/pages/nettside-for-bedrift/takk.astro` | Lead conversion event | VERIFIED | Contains `fbq('track', 'Lead')` alongside gtag and Plausible |
| `src/pages/priskalkulator/index.astro` | ViewContent event with data-astro-rerun | VERIFIED | `content_name: 'Priskalkulator'`, `data-astro-rerun` present |
| `src/pages/tjenester/nettside/index.astro` | ViewContent event with data-astro-rerun | VERIFIED | `content_name: 'Nettside'`, `data-astro-rerun` present |
| `src/pages/tjenester/nettbutikk/index.astro` | ViewContent event with data-astro-rerun | VERIFIED | `content_name: 'Nettbutikk'`, `data-astro-rerun` present |
| `src/pages/tjenester/landingsside/index.astro` | ViewContent event with data-astro-rerun | VERIFIED | `content_name: 'Landingsside'`, `data-astro-rerun` present |
| `src/lib/utm.ts` | 5-param UTM capture | VERIFIED | UTM_KEYS: `['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']` |
| `src/lib/__tests__/utm.test.ts` | Vitest tests for 5-param UTM | VERIFIED | 4 tests, all passing (`vitest run` exits 0) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| BaseLayout.astro | connect.facebook.net/en_US/fbevents.js | dynamic createElement in IIFE | VERIFIED | Pixel loader IIFE at line 212-218 |
| BaseLayout.astro | localStorage nettup_ads_consent | accept/decline handlers | VERIFIED | Accept sets 'granted', decline sets 'denied'; stored value checked on load |
| LandingPageLayout.astro | connect.facebook.net/en_US/fbevents.js | dynamic createElement in IIFE | VERIFIED | Same pixel loader IIFE at lines 205-213 |
| takk.astro | window.fbq | inline script Lead event | VERIFIED | `fbq('track', 'Lead')` at line 84, guarded by consent + fbq existence checks |
| utm.ts | form components (HeroMicroForm, ContactForm) | getUtmParams() spread into form data | VERIFIED | HeroMicroForm.tsx line 60, ContactForm.tsx line 149 spread getUtmParams() |

### Data-Flow Trace (Level 4)

Not applicable. All artifacts are tracking scripts that push to external SDKs (fbq, gtag), not components that render dynamic data from a data source.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| UTM tests pass (5-param capture + retrieval) | `npx vitest run src/lib/__tests__/utm.test.ts` | 4 tests passed in 5ms | PASS |
| Production build completes without errors | `npm run build` | "Complete!" in 2.92s | PASS |
| BaseLayout contains fbq revoke before init | grep line numbers for revoke (221) vs init (247) | 221 < 247 | PASS |
| LandingPageLayout contains fbq revoke before init | grep line numbers for revoke (214) vs init (240) | 214 < 240 | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| TRACK-01 | 36-01 | fbq('consent','revoke') before fbq('init') in layouts | SATISFIED | Both layouts: revoke at lower line number than init, inside same `if (pixelId)` block |
| TRACK-02 | 36-01 | Accept handler triggers fbq('consent','grant') alongside gtag update | SATISFIED | Both layout accept handlers contain `fbq('consent','grant')` after gtag update |
| TRACK-03 | 36-01 | Consent banner buttons have equal solid styling | SATISFIED | Both buttons use solid backgrounds (`bg-slate-700` decline, `bg-brand` accept) |
| TRACK-04 | 36-02 | fbq('track','ViewContent') fires on /nettside-for-bedrift (consent-gated) | SATISFIED | index.astro has consent-gated ViewContent with `content_name: 'B2B Landingsside'` |
| TRACK-05 | 36-02 | fbq('track','Lead') fires on /takk alongside gtag conversion | SATISFIED | takk.astro has all three tracking events in single script block |
| TRACK-06 | 36-02 | UTM capture expanded to 5 params (utm_content + utm_term) | SATISFIED | utm.ts UTM_KEYS has 5 entries; tests pass |
| TRACK-07 | 36-01 | Meta Pixel loaded via BaseLayout for site-wide retargeting (undocumented in REQUIREMENTS.md, interpreted from Phase 36 roadmap success criterion 6) | SATISFIED | BaseLayout.astro contains full fbq pixel loader, revoke/init sequence, and PageView tracking |

**Note on TRACK-07:** This requirement ID appears in 36-01-PLAN.md but is absent from REQUIREMENTS.md. The RESEARCH.md file (line 351-354) documents this gap and defines its scope as "pixel in BaseLayout, consent banner in BaseLayout." Both are implemented. No REQUIREMENTS.md update is needed -- the requirement table only lists TRACK-01 through TRACK-06.

**Orphaned requirements check:** REQUIREMENTS.md maps TRACK-01 through TRACK-06 to Phase 36 (all accounted for). TRACK-07 is in the plan but not REQUIREMENTS.md (documented gap, not a blocker).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None found | - | - | - | - |

Checked all 9 modified/created files for TODO/FIXME, placeholder content, empty returns, and hardcoded stubs. None found. The `if (pixelId)` guard is intentional -- it makes the pixel a no-op when `PUBLIC_META_PIXEL_ID` is unset in dev, not a stub.

### Human Verification Required

#### 1. Meta Pixel PageView on BaseLayout pages

**Test:** Set `PUBLIC_META_PIXEL_ID` to a real pixel ID. Open /om-oss or /kontakt in Chrome with Facebook Pixel Helper installed. Open Pixel Helper popup.
**Expected:** Pixel Helper shows Pixel Initialized and PageView event for the pixel.
**Why human:** `PUBLIC_META_PIXEL_ID` is not set in dev; the `if (pixelId)` guard correctly suppresses the SDK in that environment. Runtime SDK verification requires a live pixel ID and a browser extension.

#### 2. Consent banner functionality

**Test:** Clear localStorage. Load any BaseLayout page (e.g., /tjenester). Verify the cookie banner appears at the bottom. Click 'Avslå'. Reload the page and verify banner does not reappear. Clear localStorage again, load the page, click 'Godta'. Open browser console and check that `fbq` has been called with 'consent','grant'.
**Expected:** Banner appears on first visit, respects both choices, does not reappear after a choice is stored.
**Why human:** LocalStorage state machine and banner animation require a live browser session.

#### 3. ViewContent retargeting events with view transitions

**Test:** Accept consent banner. Navigate from homepage to /tjenester/nettside via the FloatingNav (a view transition, not a full page load). Check Facebook Pixel Helper for a ViewContent event with content_name 'Nettside'.
**Expected:** ViewContent fires on navigation even though the page renders via Astro's ClientRouter view transition. The `data-astro-rerun` attribute should re-execute the inline script.
**Why human:** `data-astro-rerun` behavior can only be verified in a live browser with ClientRouter active.

### Gaps Summary

No gaps. All 9 must-have truths are verified in the codebase. All 7 requirement IDs (TRACK-01 through TRACK-07) are satisfied. Build passes cleanly. UTM tests pass. Three items require human verification due to browser-runtime dependencies (live pixel ID, localStorage state, view transitions), but these do not indicate implementation gaps.

---

_Verified: 2026-03-28T18:34:00Z_
_Verifier: Claude (gsd-verifier)_
