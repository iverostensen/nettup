# Phase 36: Meta Pixel & Full-Site Event Tracking - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 36-meta-pixel-full-site-event-tracking
**Areas discussed:** Pixel loading strategy, Retargeting events, Consent integration, UTM expansion

---

## Pixel Loading Strategy

### Q1: Where should Meta Pixel base code live?

| Option | Description | Selected |
|--------|-------------|----------|
| BaseLayout only | Add fbq to BaseLayout.astro so pixel fires site-wide. Move consent banner from LandingPageLayout into BaseLayout. | ✓ |
| Both layouts | Add fbq to both BaseLayout and LandingPageLayout independently. Two consent IIFEs to maintain. | |
| BaseLayout + keep LP separate | Add fbq to BaseLayout for site-wide coverage. Keep LandingPageLayout's existing gtag-only IIFE as-is. | |

**User's choice:** BaseLayout only
**Notes:** None

### Q2: Layout relationship after moving consent to BaseLayout

| Option | Description | Selected |
|--------|-------------|----------|
| LP stays independent | LandingPageLayout keeps its own HTML/head but imports the same shared consent+pixel script. | ✓ |
| LP wraps BaseLayout | Refactor LandingPageLayout to use BaseLayout as base. Single source for head scripts. | |
| You decide | Claude picks the approach that minimizes changes. | |

**User's choice:** LP stays independent
**Notes:** None

### Q3: Consent banner scope

| Option | Description | Selected |
|--------|-------------|----------|
| All pages | Consent banner in BaseLayout shows on every page. Required for legal compliance since pixel fires site-wide. | ✓ |
| Landing pages only | Banner stays on LandingPageLayout pages. Organic visitors never see the banner. | |
| You decide | Claude picks based on Norwegian E-Com Act / Datatilsynet requirements. | |

**User's choice:** All pages
**Notes:** None

### Q4: Meta Pixel ID source

| Option | Description | Selected |
|--------|-------------|----------|
| Use env var | Read pixel ID from PUBLIC_META_PIXEL_ID env var. Supports kill switch. | ✓ |
| Hardcode it | Hardcode the pixel ID directly in the script. | |
| I have the ID ready | Provide the actual pixel ID now. | |

**User's choice:** Use env var
**Notes:** None

---

## Retargeting Events

### Q1: content_name structure for ViewContent events

| Option | Description | Selected |
|--------|-------------|----------|
| Service slug | content_name matches the service: 'Priskalkulator', 'Nettside', etc. Clean segments in Ads Manager. | ✓ |
| Full page path | content_name is the URL path: '/priskalkulator', '/tjenester/nettside', etc. | |
| You decide | Claude picks naming that works best for Meta custom audiences. | |

**User's choice:** Service slug
**Notes:** None

### Q2: Additional high-intent pages

| Option | Description | Selected |
|--------|-------------|----------|
| Success criteria only | Stick to the 4 specified pages + landing page + /takk. Expand later based on data. | ✓ |
| Add /kontakt + case studies | Also fire ViewContent on /kontakt and /prosjekter/*. | |
| You decide | Claude decides which additional pages are worth tracking. | |

**User's choice:** Success criteria only
**Notes:** None

### Q3: Event placement implementation

| Option | Description | Selected |
|--------|-------------|----------|
| Inline scripts per page | Consent-gated `<script is:inline>` block per page. Same pattern as /takk. | ✓ |
| Shared tracking module | Create src/lib/meta-events.ts with typed functions. | |
| You decide | Claude picks the approach that fits existing patterns best. | |

**User's choice:** Inline scripts per page
**Notes:** None

---

## Consent Integration

### Q1: Consent script structure

| Option | Description | Selected |
|--------|-------------|----------|
| Single unified IIFE | One script block handles both gtag and fbq consent together. | ✓ |
| Separate scripts | Keep gtag IIFE as-is, add a second fbq IIFE reading the same localStorage key. | |
| You decide | Claude picks the cleanest approach. | |

**User's choice:** Single unified IIFE
**Notes:** None

### Q2: Consent button parity timing

| Option | Description | Selected |
|--------|-------------|----------|
| Fix in Phase 36 | Fix button parity now since we're touching the banner. CSS change only. | ✓ |
| Defer to Phase 38 | Phase 38 also mentions button parity. Keep Phase 36 focused on pixel/events. | |
| You decide | Claude decides based on minimal-change principle. | |

**User's choice:** Fix in Phase 36
**Notes:** None

---

## UTM Expansion

### Q1: UTM param usage

| Option | Description | Selected |
|--------|-------------|----------|
| Formspree + sessionStorage | Expand to 5 params, store in sessionStorage AND send as hidden form fields. | ✓ |
| sessionStorage only | Store all 5 params but don't change form payloads. | |
| You decide | Claude picks based on what's most useful for Facebook ad attribution. | |

**User's choice:** Formspree + sessionStorage
**Notes:** None

### Q2: UTM forwarding to /takk

| Option | Description | Selected |
|--------|-------------|----------|
| sessionStorage is enough | sessionStorage persists across same-tab navigation. No URL forwarding needed. | ✓ |
| Forward via URL params | Append UTM params to the /takk redirect URL. | |
| You decide | Claude picks the simplest reliable approach. | |

**User's choice:** sessionStorage is enough
**Notes:** None

---

## Claude's Discretion

- Exact script ordering within the unified consent IIFE
- Consent banner copy wording adjustments for Meta Pixel mention
- Whether to extract consent script into a shared .astro partial

## Deferred Ideas

None -- discussion stayed within phase scope.
