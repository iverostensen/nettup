---
phase: 09-specialist-service-pages
verified: 2026-03-05T13:31:00Z
status: passed
score: 40/40 must-haves verified
re_verification: false
gaps: []
human_verification:
  - test: "Visually browse /tjenester/webapp, /tjenester/seo, /tjenester/ai, /tjenester/vedlikehold"
    expected: "Pages render correctly, breadcrumbs show proper hierarchy, animations fire on scroll, prices are prominently visible"
    why_human: "Visual rendering and animation behavior cannot be verified by static analysis"
  - test: "Click each CTA button on all four pages"
    expected: "Browser navigates to /kontakt with correct ?tjeneste= query param pre-filling the service badge in the contact form"
    why_human: "End-to-end form pre-fill requires a running browser"
---

# Phase 9: Specialist Service Pages Verification Report

**Phase Goal:** The four specialist service pages are live with outcome-first, non-technical content
**Verified:** 2026-03-05T13:31:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | /tjenester/webapp, /tjenester/seo, /tjenester/ai, /tjenester/vedlikehold each exist and load | VERIFIED | All 4 index.astro files present; build output confirms all 4 routes generated |
| 2 | webapp page describes 4-step process in plain Norwegian without technical jargon in primary copy | VERIFIED | Prosess.astro has steps: Kartlegging, Prototyp, Bygging, Lansering. Hero h1 uses "Spar timer" / ROI framing, no API/CI-CD/React in h1 or first paragraph |
| 3 | AI page includes a GDPR/personvern FAQ section | VERIFIED | ai/_sections/FAQ.astro first question is "Er AI-løsningen GDPR-compliant?" with answer containing "databehandleravtale (DPA)" and locked framing |
| 4 | Each page has 500+ words, outcome-first copy, CTA with pre-fill, unique meta | VERIFIED | All four pages have substantive multi-paragraph content, unique meta titles, CTAs linking to /kontakt?tjeneste=[slug] |
| 5 | Service interface extended with monthlyPrice/monthlyPriceLabel optional fields | VERIFIED | src/config/services.ts lines 10-11 show both optional fields on the interface |
| 6 | webapp, seo, ai, vedlikehold service objects have correct monthly prices | VERIFIED | webapp: 2500, seo: 3000, ai: 1000, vedlikehold: 1500 — all verified in services.ts |
| 7 | Phase 8 services (nettside, nettbutikk, landingsside) do not have monthlyPrice | VERIFIED | services.ts confirms these three objects have no monthlyPrice field |
| 8 | Build passes with 0 errors | VERIFIED | `npm run build` completes with "14 page(s) built in 2.34s", no errors |

**Score:** 8/8 truths verified (all 40 individual must-have checks pass)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/config/services.ts` | Extended interface + monthlyPrice on 4 services | VERIFIED | Interface has monthlyPrice?: number and monthlyPriceLabel?: string. All 4 Phase 9 services populated correctly |
| `src/pages/tjenester/webapp/index.astro` | Meta, Service JSON-LD, 5-section composition | VERIFIED | Service JSON-LD with minPrice: service.minPrice (resolves to 40000). Imports and renders Hero, Prosess, Inkludert, FAQ, CTA |
| `src/pages/tjenester/webapp/_sections/Hero.astro` | ROI outcome h1, both prices, CTA | VERIFIED | h1: "Spar timer hver uke..." (animate-fade-up). "fra 40 000 kr" + "+ fra 2 500 kr/mnd vedlikehold". Button href="/kontakt?tjeneste=webapp" |
| `src/pages/tjenester/webapp/_sections/Prosess.astro` | 4-step process: Kartlegging, Prototyp, Bygging, Lansering | VERIFIED | Exactly 4 steps with locked names, numbered badge pattern, substantive descriptions |
| `src/pages/tjenester/webapp/_sections/Inkludert.astro` | 6+ deliverables with descriptions | VERIFIED | 8 features with multi-sentence descriptions |
| `src/pages/tjenester/webapp/_sections/FAQ.astro` | 5 webapp-specific FAQs + FAQPage JSON-LD | VERIFIED | 5 questions including "Hvem eier koden". faqSchema with FAQPage type. `<script is:inline type="application/ld+json">` present |
| `src/pages/tjenester/webapp/_sections/CTA.astro` | CTA → /kontakt?tjeneste=webapp | VERIFIED | Button href="/kontakt?tjeneste=webapp", text "Fa et gratis tilbud" |
| `src/pages/tjenester/seo/index.astro` | Meta, Service JSON-LD, 4-section composition | VERIFIED | minPrice: service.minPrice (resolves to 3000). Unique title containing "SEO" and "GEO" |
| `src/pages/tjenester/seo/_sections/Hero.astro` | Monthly price primary, GEO/ChatGPT in h1 or first para | VERIFIED | h1: "Bli funnet — pa Google og av AI-søk som ChatGPT". First para names ChatGPT, Perplexity, GEO explicitly. "fra 3 000 kr/mnd" as primary price |
| `src/pages/tjenester/seo/_sections/Inkludert.astro` | Monthly deliverables framing | VERIFIED | Section header "Hva du far hver maned" with subtitle "Konkrete leveranser — ikke vage løfter". 7 monthly deliverables |
| `src/pages/tjenester/seo/_sections/FAQ.astro` | GEO question + FAQPage JSON-LD | VERIFIED | First question "Hva er GEO, og hvorfor er det viktig?" with ChatGPT and Perplexity named in answer |
| `src/pages/tjenester/seo/_sections/CTA.astro` | "Start med en gratis gjennomgang" → /kontakt?tjeneste=seo | VERIFIED | Button href="/kontakt?tjeneste=seo", text matches exactly |
| `src/pages/tjenester/ai/index.astro` | Meta, Service JSON-LD, 4-section composition | VERIFIED | minPrice: service.minPrice (resolves to 20000). Unique title "AI-løsning for bedrift" |
| `src/pages/tjenester/ai/_sections/Hero.astro` | Both prices + outcome framing | VERIFIED | "fra 20 000 kr" + "+ fra 1 000 kr/mnd vedlikehold". h1 outcome-focused |
| `src/pages/tjenester/ai/_sections/Inkludert.astro` | All 3 use cases: chatbot, dokumentbehandling, systemintegrasjoner | VERIFIED | First 3 features are exactly: chatbot og kundestøtte-automatisering, dokumentbehandling og oppsummering, systemintegrasjoner via AI |
| `src/pages/tjenester/ai/_sections/FAQ.astro` | GDPR question first, Zapier/Make comparison, FAQPage JSON-LD | VERIFIED | GDPR first, locked framing "databehandleravtale (DPA)". Zapier/Make question present. JSON-LD schema inline |
| `src/pages/tjenester/ai/_sections/CTA.astro` | "Fa et gratis tilbud" → /kontakt?tjeneste=ai | VERIFIED | Correct button text and href |
| `src/pages/tjenester/vedlikehold/index.astro` | Meta, Service JSON-LD, 4-section composition | VERIFIED | minPrice: service.minPrice (resolves to 1500). Unique title "Vedlikehold av nettside" |
| `src/pages/tjenester/vedlikehold/_sections/Hero.astro` | Reassurance framing, monthly-only price | VERIFIED | h1: "Nettsiden din er i gode hender — vi tar ansvar for alt det tekniske". Only "fra 1 500 kr/mnd", no one-time price |
| `src/pages/tjenester/vedlikehold/_sections/Inkludert.astro` | "hva din månedlige avtale dekker" framing | VERIFIED | Section header "Hva din manedlige avtale dekker", subtitle "Alle Nettup-kunder far dette — ingen skjulte tillegg." No upsell language |
| `src/pages/tjenester/vedlikehold/_sections/FAQ.astro` | Coverage, response time, new features, cancellation, no-maintenance questions + JSON-LD | VERIFIED | All 5 questions present with substantive answers. FAQPage JSON-LD inline |
| `src/pages/tjenester/vedlikehold/_sections/CTA.astro` | "Start med en gratis gjennomgang" → /kontakt?tjeneste=vedlikehold | VERIFIED | Correct button text and href |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `webapp/index.astro` | `src/config/services.ts` | `services.find(s => s.slug === 'webapp')` | WIRED | Line 11: `const service = services.find(s => s.slug === 'webapp')!;` |
| `webapp/_sections/Hero.astro` | webapp service object | monthlyPriceLabel display ("2 500 kr/mnd") | WIRED | Line 23: `+ fra 2 500 kr/mnd vedlikehold` (hardcoded in Hero, consistent with service object value) |
| `webapp/_sections/CTA.astro` | /kontakt?tjeneste=webapp | Button href prop | WIRED | `href="/kontakt?tjeneste=webapp"` confirmed |
| `seo/index.astro` | `src/config/services.ts` | `services.find(s => s.slug === 'seo')` | WIRED | `const service = services.find(s => s.slug === 'seo')!;` |
| `seo/_sections/CTA.astro` | /kontakt?tjeneste=seo | Button href prop | WIRED | `href="/kontakt?tjeneste=seo"` confirmed |
| `ai/index.astro` | `src/config/services.ts` | `services.find(s => s.slug === 'ai')` | WIRED | `const service = services.find(s => s.slug === 'ai')!;` |
| `ai/_sections/CTA.astro` | /kontakt?tjeneste=ai | Button href prop | WIRED | `href="/kontakt?tjeneste=ai"` confirmed |
| `vedlikehold/index.astro` | `src/config/services.ts` | `services.find(s => s.slug === 'vedlikehold')` | WIRED | `const service = services.find(s => s.slug === 'vedlikehold')!;` |
| `vedlikehold/_sections/CTA.astro` | /kontakt?tjeneste=vedlikehold | Button href prop | WIRED | `href="/kontakt?tjeneste=vedlikehold"` confirmed |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| PAGES-04 | 09-02 | /tjenester/webapp — dedikert tjenesteside | SATISFIED | 6 files built, route generated, substantive content with 4-step process, prices, FAQ, JSON-LD |
| PAGES-05 | 09-03 | /tjenester/seo — dedikert tjenesteside | SATISFIED | 5 files built, route generated, GEO differentiator, monthly deliverables, JSON-LD |
| PAGES-06 | 09-04 | /tjenester/ai — dedikert tjenesteside | SATISFIED | 5 files built, route generated, GDPR in FAQ, 3 use cases, both prices, JSON-LD |
| PAGES-07 | 09-05 | /tjenester/vedlikehold — dedikert tjenesteside | SATISFIED | 5 files built, route generated, reassurance framing, monthly-only price, JSON-LD |

**Orphaned requirements check:** REQUIREMENTS.md assigns SEO-01 and SEO-03 to Phase 10, not Phase 9. Phase 9 plans do not claim these. However, all four Phase 9 pages DO implement Service JSON-LD and FAQPage JSON-LD inline — these will be validated formally in Phase 10. No orphaned requirements.

**Cross-standard compliance (CONTENT-01, CONTENT-02, CONTENT-03, CTA-01, SEO-02):** Per REQUIREMENTS.md note, these were established in Phase 8 and Phase 9 pages must satisfy the same standards. Verified:
- CONTENT-01 (hero + inkludert + FAQ + CTA structure): All 4 pages follow this structure
- CONTENT-02 (outcome-first language): Confirmed in h1s and first paragraphs
- CONTENT-03 (500+ words): All pages have 7-8 features with multi-sentence descriptions plus 5 FAQs with substantive answers — well over 500 words
- CTA-01 (CTA links to /kontakt?tjeneste=[slug]): All 4 pages verified
- SEO-02 (unique meta title and description): All 4 pages have unique Norwegian titles and descriptions

### Anti-Patterns Found

No anti-patterns detected across all Phase 9 files.

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | No TODO/FIXME/placeholder found | — | — |
| — | — | No empty return stubs found | — | — |
| — | — | No stub implementations found | — | — |

### Human Verification Required

#### 1. Page Rendering and Animations

**Test:** Browse to /tjenester/webapp, /tjenester/seo, /tjenester/ai, /tjenester/vedlikehold in a real browser
**Expected:** Pages render with correct dark theme, breadcrumbs show "Hjem / Tjenester / [Page]", hero h1 animates in on load with animate-fade-up, below-fold sections reveal on scroll
**Why human:** Visual rendering and CSS animation behavior cannot be verified by static code analysis

#### 2. CTA Pre-fill End-to-end

**Test:** Click the CTA button on each of the four pages
**Expected:** Browser navigates to /kontakt with correct ?tjeneste= query param, and the service badge in the contact form reads the correct service name
**Why human:** Requires a running browser and Formspree interaction to verify form pre-fill behavior

### Gaps Summary

No gaps found. All must-haves across all five plans (09-01 through 09-05) are fully implemented and wired. The build passes cleanly with 0 errors. All four specialist service pages are complete with substantive Norwegian content, correct pricing signals, JSON-LD structured data, and proper routing.

---

_Verified: 2026-03-05T13:31:00Z_
_Verifier: Claude (gsd-verifier)_
