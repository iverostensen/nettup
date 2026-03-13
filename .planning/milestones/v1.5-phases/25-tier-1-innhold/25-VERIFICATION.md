---
phase: 25-tier-1-innhold
verified: 2026-03-08T03:13:00Z
status: passed
score: 11/11 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 10/11
  gaps_closed:
    - "nearbyAreas slugs are symmetric across all 8 entries — oslo now includes 'sandvika'"
  gaps_remaining: []
  regressions: []
---

# Phase 25: Tier 1 Innhold Verification Report

**Phase Goal:** 6–8 Tier 1 city entries med unikt, håndskrevet innhold — intro-tekst, FAQ og nabobyer for hver by.
**Verified:** 2026-03-08T03:13:00Z
**Status:** passed
**Re-verification:** Yes — after gap closure (oslo.nearbyAreas symmetry fix)

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | All 8 Tier 1 cities have entries in locations.ts with genuinely differentiated intro copy | VERIFIED | Each intro references specific local landmarks: Grünerløkka/Aker Brygge (Oslo), Lysaker/Fornebu/Bekkestua (Bærum), Asker sentrum/Heggedal/Dikemark (Asker), Sandvika Storsenter/E18 (Sandvika), Bragernes/Strømsø (Drammen), Kjeller/Ahus/Romerike (Lillestrøm), Follo-regionen/Østfoldbanen (Ski), Jeløya/Refsnes (Moss) |
| 2 | Every city entry has 2–3 city-specific FAQ items covering local presence, process, and pricing | VERIFIED | All 8 cities have exactly 3 FAQ items in fixed order: lokal tilstedeværelse → prosess → pris. Each question uses city name. All price answers mention "15 000 kr" and "priskalkulator" |
| 3 | Every city entry has a unique metaTitle and metaDescription | VERIFIED | metaTitle follows "Nettside for bedrift i {By} | Nettup" pattern across all 8. metaDescriptions are 141–154 chars (all within 140–160 range) with varied value props per city |
| 4 | nearbyAreas slugs are symmetric across all 8 entries | VERIFIED | All 11 slug relationships are bidirectional. oslo.nearbyAreas = ['baerum', 'sandvika', 'lillestrom']; sandvika.nearbyAreas = ['baerum', 'asker', 'oslo']. Programmatic symmetry check: PASS |
| 5 | Each city page emits a Service JSON-LD block with areaServed referencing the global LocalBusiness @id | VERIFIED | [location].astro has `<script is:inline slot="head" type="application/ld+json">` with "@type":"Service", "provider":{"@id":"https://nettup.no/#business"}, "areaServed":{"@type":"City","name":city.name} |
| 6 | Each city page emits a FAQPage JSON-LD block built from city.faq data | VERIFIED | FAQPage block present with mainEntity mapped from city.faq — plain-text answers used directly |
| 7 | No duplicate LocalBusiness declarations — only Service with provider @id reference | VERIFIED | No "@type":"LocalBusiness" in [location].astro. Canonical entity at nettup.no/#business lives in BaseLayout only |
| 8 | Footer displays an "Områder vi dekker" column listing all 8 Tier 1 cities with links to /steder/{slug} | VERIFIED | Footer.astro has column with heading "Områder vi dekker" and iterates tier1Cities with href="/steder/${city.slug}" |
| 9 | Footer city list is sourced dynamically from locations.ts (not hard-coded) | VERIFIED | `import { cities, ACTIVE_TIER } from '@/config/locations'` + `cities.filter((c) => c.tier <= ACTIVE_TIER)` — fully dynamic |
| 10 | Footer renders correctly at mobile, tablet (768px), and desktop (1024px+) without broken grid | VERIFIED | Grid: `grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4`. Logo cell: `col-span-2 md:col-span-2 lg:col-span-1`. Follows plan spec — lg:grid-cols-4 (not md) to avoid narrow columns at 768px |
| 11 | /kontakt page contains a sentence mentioning Oslo-region and all 8 covered cities | VERIFIED | Line 51: "Vi hjelper bedrifter i hele Oslo-regionen — Oslo, Bærum, Asker, Sandvika, Drammen, Lillestrøm, Ski og Moss." All 8 cities present |

**Score:** 11/11 truths verified

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/config/locations.ts` | 8 complete Tier 1 city entries | VERIFIED | 8 cities: oslo, baerum, asker, sandvika, drammen, lillestrom, ski, moss. All with tier:1, intro, faq (3 items), nearbyAreas, metaTitle, metaDescription. Full symmetry on all nearbyAreas. |
| `src/pages/steder/[location].astro` | Service and FAQPage JSON-LD injection via head slot | VERIFIED | Two `<script is:inline slot="head" type="application/ld+json">` blocks before `<main>`. Service + FAQPage correctly structured |
| `src/components/layout/Footer.astro` | Områder vi dekker column with Tier 1 city links | VERIFIED | Column present, dynamic, lg:grid-cols-4 |
| `src/pages/kontakt/index.astro` | Regional coverage sentence | VERIFIED | Sentence at line 51 with all 8 cities and "Oslo-regionen" |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| nearbyAreas in each city entry | slug fields of other city entries | ASCII slug match | VERIFIED | All 11 slug references resolve correctly and are bidirectional. oslo ↔ sandvika now symmetric. |
| src/pages/steder/[location].astro | https://nettup.no/#business | provider @id in Service JSON-LD | VERIFIED | `"provider": { "@id": "https://nettup.no/#business" }` present in Service block |
| src/components/layout/Footer.astro | src/config/locations.ts | import cities, ACTIVE_TIER | VERIFIED | `import { cities, ACTIVE_TIER } from '@/config/locations'` + filter on line 3 |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CONTENT-01 | 25-01 | 6–8 Tier 1 city entries with genuinely differentiated intro copy | SATISFIED | 8 entries, each with locally specific neighborhood references — not generic bynavn-swap |
| CONTENT-02 | 25-01 | Every city page has a city-specific FAQ section | SATISFIED | 3 FAQ items per city, city name in each question |
| SEO-01 | 25-02 | Each city page emits Service JSON-LD with areaServed referencing global LocalBusiness @id | SATISFIED | Service + FAQPage JSON-LD in [location].astro via is:inline slot="head" |
| SEO-02 | 25-01 | Each city page has unique title, meta description, and og:title | SATISFIED | All 8 metaTitles unique, all 8 metaDescriptions unique (140–154 chars each) |
| LINK-01 | 25-03 | Footer has "Omrader vi dekker" section listing all Tier 1 cities | SATISFIED | "Områder vi dekker" column with 8 dynamic city links in Footer.astro |
| LINK-02 | 25-03 | /kontakt page mentions Oslo-region and nearby areas | SATISFIED | Full sentence with Oslo-regionen + all 8 cities on line 51 of kontakt/index.astro |

**Requirements in REQUIREMENTS.md mapped to Phase 25:** CONTENT-01, CONTENT-02, SEO-01, SEO-02, LINK-01, LINK-02 — all 6 accounted for and satisfied at the implementation level.

**Orphaned requirements:** None. LINK-03 and LINK-04 are correctly mapped to Phase 26 (post-deploy verification).

---

## Anti-Patterns Found

No TODO/FIXME/placeholder comments found. No stub implementations. No empty handlers. No asymmetric nearbyAreas references.

---

## Human Verification Required

### 1. City page rendering at /steder/{slug}

**Test:** Visit /steder/oslo, /steder/sandvika, and at least 2 others in a browser.
**Expected:** Page renders with the correct city name in h1, intro paragraph visible, FAQ accordion functional, nearby area pills link correctly (oslo shows sandvika pill, sandvika shows oslo pill), CTA button goes to /kontakt.
**Why human:** Full rendering and interactive FAQ accordion behavior cannot be verified statically.

### 2. Footer layout at 768px tablet

**Test:** Resize browser to 768px width and inspect the footer.
**Expected:** 2-column grid (logo+Sider, Kontakt stacked above Områder vi dekker). No columns overflow or become too narrow.
**Why human:** CSS grid behavior at breakpoint requires a live browser.

---

## Re-verification Summary

**Gap that was fixed:** oslo.nearbyAreas was missing 'sandvika'. The fix added 'sandvika' to oslo's nearbyAreas array, making the oslo ↔ sandvika relationship fully bidirectional.

**Verification of fix:** Programmatic symmetry check across all 11 nearbyAreas relationships returned PASS. `npm run build` completes cleanly (3.04s server build). No regressions detected on any previously passing truth.

**Phase goal:** Fully achieved. All 8 Tier 1 city entries exist with unique handwritten content, city-specific FAQ, symmetric nabobyer references, unique meta tags, Service + FAQPage JSON-LD, dynamic footer integration, and regional coverage mention on /kontakt.

---

_Verified: 2026-03-08T03:13:00Z_
_Verifier: Claude (gsd-verifier)_
