# Roadmap: v1.5 Lokale SEO-sider

## Overview

Build a scalable local SEO landing page system targeting Norwegian city search queries — architected from day one to expand from V1 (6–8 hand-crafted Tier 1 cities) through V2 (30–50 AI-assisted towns) to V3 (full Norway coverage) without structural changes.

## Phases

- [x] **Phase 24: Infrastruktur** - `locations.ts` config with V1/V2/V3-ready data model + dynamic `[location].astro` route — unblocks all city content (completed 2026-03-08)
- [x] **Phase 25: Tier 1 innhold** - 6–8 Tier 1 city entries with unique hand-written copy (Oslo, Drammen, Asker, Bærum, Lillestrøm, Sandvika, Ski, Moss) (completed 2026-03-08)
- [x] **Phase 26: SEO og intern lenking** - `LocalBusiness` JSON-LD with `areaServed` per city, per-city metadata, footer/contact internal linking, sitemap coverage (completed 2026-03-08)

## Phase Details

### Phase 24: Infrastruktur

**Goal:** Lock `locations.ts` TypeScript interface, URL-struktur, route-skeleton (`src/pages/steder/[location].astro`) og tier-gated `getStaticPaths()`. Verifiser at `npm run build` passerer med stub-entries.

**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04

**Plans:** 1/1 plans complete

Plans:
- [ ] 24-01-PLAN.md — `locations.ts` City-interface + `steder/[location].astro` route med full sidelayout og to stub-entries

**Deliverables:**
- `src/config/locations.ts` med `City` interface, `ACTIVE_TIER` konstant og to stub-entries (Oslo, Bærum)
- `src/pages/steder/[location].astro` med `getStaticPaths()` og komplett sidelayout
- `npm run build` passerer uten feil

---

### Phase 25: Tier 1 innhold

**Goal:** 6–8 Tier 1 city entries med unikt, håndskrevet innhold — intro-tekst, FAQ og nabobyer for hver by.

**Requirements:** CONTENT-01, CONTENT-02, SEO-01, SEO-02, LINK-01, LINK-02

**Deliverables:**
- 6–8 komplette city-entries i `locations.ts`
- Footer oppdatert med "Områder vi dekker"-seksjon
- `/kontakt`-side oppdatert med regional dekning

---

### Phase 26: SEO og intern lenking

**Goal:** `LocalBusiness` JSON-LD med `areaServed` per by, per-by metadata, footer/kontakt intern lenking, sitemap-dekning verifisert.

**Requirements:** LINK-03, LINK-04

**Plans:** 2/2 plans complete

Plans:
- [ ] 26-01-PLAN.md — Dynamic areaServed in BaseLayout + sitemap priority rules + V2 JSDoc
- [ ] 26-02-PLAN.md — Post-deploy sitemap verification checkpoint (LINK-03)

**Deliverables:**
- `Service` JSON-LD på alle bysider med `areaServed`
- V2 promotion-kriterier dokumentert
- Sitemap-verifisering dokumentert

---

## Progress

| Phase | Milestone | Status | Completed |
|-------|-----------|--------|-----------|
| 24. Infrastruktur | 1/1 | Complete    | 2026-03-08 |
| 25. Tier 1 innhold | 3/3 | Complete    | 2026-03-08 |
| 26. SEO og intern lenking | 2/2 | Complete    | 2026-03-08 |

### Phase 27: Plausible Analytics

**Goal:** Plausible Analytics script i begge layouts, thin analytics.ts wrapper med 7 typed tracker-funksjoner, og konverteringshendelser koblet til ContactForm, ChatWidget, wizard ResultStep og bysidens CTA.
**Requirements:** ANAL-01, ANAL-02, ANAL-03
**Depends on:** Phase 26
**Plans:** 2/3 plans executed

Plans:
- [ ] 27-01-PLAN.md — Foundation: analytics.ts + env.d.ts + script tag i BaseLayout og LandingPageLayout
- [ ] 27-02-PLAN.md — React island events: ContactForm (+ B2B context), ChatWidget, ResultStep
- [ ] 27-03-PLAN.md — City CTA inline script + Plausible dashboard Goal registration

---

### Phase 28: FloatingNav Rewrite

**Goal:** Eliminate the SPA navigation flash permanently by converting FloatingNav from a React island (`client:only`) to a native Astro component with `transition:persist` — removing the React hydration gap and Astro's hidden iframe overhead that cause raw HTML to flash on every page navigation.

**Requirements:** NAV-01, NAV-02, NAV-03

**Plans:** 1/1 plans complete

Plans:
- [ ] 28-01-PLAN.md — Astro FloatingNav + MobileMenu custom event refactor + BaseLayout cleanup

**Deliverables:**
- `src/components/layout/FloatingNav.astro` — server-rendered nav with `transition:persist` and inline vanilla JS for scroll hide/show + active link update
- `src/components/islands/MobileMenu.tsx` — kept as React island (complex animated overlay), used only on user tap
- `BaseLayout.astro` — removes `client:only` FloatingNav import, removes `visibility:hidden` body hack, removes `astro:before-swap`/`astro:page-load` event listeners
- `global.css` — removes `html[data-loading]` rule, retains `::view-transition` instant swap rules
- Zero flash on SPA navigation verified

---

### Phase 29: Gap Closure — FAQPage Schema + Phase 27 Verification

**Goal:** Add missing FAQPage JSON-LD to city pages (contradicted by Phase 25 verification), verify Phase 27 (Plausible Analytics) to produce its missing VERIFICATION.md, and remove dead code identified in audit.
**Requirements:** SEO-03 (FAQPage JSON-LD), ANAL-01, ANAL-02, ANAL-03
**Gap Closure:** Closes GAP-INT-01 (FAQPage absent), unverified Phase 27
**Depends on:** Phase 28

Plans:
- [ ] 29-01-PLAN.md — Add FAQPage JSON-LD to `[location].astro` + delete `FloatingNav.tsx` dead code + remove stranded `trackCityCtaClicked` export

**Deliverables:**
- `src/pages/steder/[location].astro` with FAQPage JSON-LD block built from `city.faq`
- `src/components/islands/FloatingNav.tsx` deleted
- `src/lib/analytics.ts` with `trackCityCtaClicked` removed
- `27-VERIFICATION.md` produced by gsd-verifier

---

### Phase 30: Traceability Backfill + Phase 28 Human Verification

**Goal:** Backfill ANAL-01/02/03 and NAV-01/02/03 into REQUIREMENTS.md traceability table, and confirm Phase 28 runtime behaviors in browser to upgrade its status from `human_needed` to `passed`.
**Requirements:** ANAL-01, ANAL-02, ANAL-03, NAV-01, NAV-02, NAV-03
**Gap Closure:** Traceability completeness for phases 27 and 28

Plans:
- [ ] 30-01-PLAN.md — REQUIREMENTS.md backfill for 6 analytics + nav requirements

**Deliverables:**
- `REQUIREMENTS.md` with ANAL-01/02/03 and NAV-01/02/03 entries and traceability rows
- `28-VERIFICATION.md` updated to `passed` after human runtime confirmation

---

*Roadmap updated: 2026-03-13*
*Milestone: v1.5 Lokale SEO-sider*
*Coverage: 12/12 core requirements mapped + 3 analytics + 3 nav + 1 faqpage = 19 total*
