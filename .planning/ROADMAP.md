# Roadmap: v1.5 Lokale SEO-sider

## Overview

Build a scalable local SEO landing page system targeting Norwegian city search queries — architected from day one to expand from V1 (6–8 hand-crafted Tier 1 cities) through V2 (30–50 AI-assisted towns) to V3 (full Norway coverage) without structural changes.

## Phases

- [ ] **Phase 24: Infrastruktur** - `locations.ts` config with V1/V2/V3-ready data model + dynamic `[location].astro` route — unblocks all city content
- [ ] **Phase 25: Tier 1 innhold** - 6–8 Tier 1 city entries with unique hand-written copy (Oslo, Drammen, Asker, Bærum, Lillestrøm, Sandvika, Ski, Moss)
- [ ] **Phase 26: SEO og intern lenking** - `LocalBusiness` JSON-LD with `areaServed` per city, per-city metadata, footer/contact internal linking, sitemap coverage

## Phase Details

### Phase 24: Infrastruktur

**Goal:** Lock `locations.ts` TypeScript interface, URL-struktur, route-skeleton (`src/pages/steder/[location].astro`) og tier-gated `getStaticPaths()`. Verifiser at `npm run build` passerer med stub-entries.

**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04

**Plans:** 1 plan

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

**Deliverables:**
- `Service` JSON-LD på alle bysider med `areaServed`
- V2 promotion-kriterier dokumentert
- Sitemap-verifisering dokumentert

---

## Progress

| Phase | Milestone | Status | Completed |
|-------|-----------|--------|-----------|
| 24. Infrastruktur | v1.5 | Planned | - |
| 25. Tier 1 innhold | v1.5 | Not started | - |
| 26. SEO og intern lenking | v1.5 | Not started | - |

---
*Roadmap updated: 2026-03-08*
*Milestone: v1.5 Lokale SEO-sider*
*Coverage: 12/12 requirements mapped*
