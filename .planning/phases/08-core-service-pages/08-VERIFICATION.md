---
phase: 08-core-service-pages
verified: 2026-03-05T12:10:30Z
status: passed
score: 21/21 must-haves verified
re_verification: false
---

# Phase 8: Core Service Pages Verification Report

**Phase Goal:** Build individual service detail pages for nettside, nettbutikk, and landingsside — each with unique, conversion-focused content, structured markup, and SEO metadata.
**Verified:** 2026-03-05T12:10:30Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth                                                                                         | Status     | Evidence                                                                 |
|----|-----------------------------------------------------------------------------------------------|------------|--------------------------------------------------------------------------|
| 1  | /tjenester/nettside loads with outcome headline and price signal above the fold               | VERIFIED   | Hero.astro h1 animate-fade-up; "fra 15 000 kr" branded price signal     |
| 2  | Nettside inkludert section lists 6+ service-specific items                                   | VERIFIED   | 8 features in Inkludert.astro (Responsivt design → 30 dagers support)   |
| 3  | Nettside FAQ has 4–5 service-specific questions not found on /tjenester                      | VERIFIED   | 5 nettside-specific questions (CMS, domene, bilder, support, utvidbarhet)|
| 4  | Nettside CTA button links to /kontakt?tjeneste=nettside                                      | VERIFIED   | Both Hero.astro and CTA.astro href="/kontakt?tjeneste=nettside"          |
| 5  | Nettside page has unique meta title and description passed to BaseLayout                     | VERIFIED   | title="Nettside for bedrift | Profesjonell og rask | Nettup"             |
| 6  | Service JSON-LD with PriceSpecification injected in nettside page head                      | VERIFIED   | Fragment slot="head" with minPrice: 15000, no maxPrice (open-ended)      |
| 7  | FAQPage JSON-LD inline in nettside FAQ.astro                                                 | VERIFIED   | <script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} /> |
| 8  | /tjenester/nettbutikk loads with outcome headline and price signal above the fold            | VERIFIED   | Hero.astro animate-fade-up h1; "fra 25 000 kr" price signal             |
| 9  | Nettbutikk inkludert includes produktkatalog, checkout, Vipps/kort, ordrehåndtering          | VERIFIED   | All 4 items present as distinct features in features array               |
| 10 | Shopify fee disclosure appears below the inkludert grid                                      | VERIFIED   | "* Shopify lisens (fra 299 kr/mnd) faktureres separat av Shopify."       |
| 11 | "Slik fungerer det" 3-step sequence present in nettbutikk Inkludert                         | VERIFIED   | h3 + ol with 3 numbered steps (butikken, betaling, lansering)            |
| 12 | Nettbutikk FAQ has 4–5 questions including one about Shopify licensing cost                  | VERIFIED   | 5 questions; "Hva koster Shopify-lisensen?" explicitly present           |
| 13 | Nettbutikk CTA button links to /kontakt?tjeneste=nettbutikk                                 | VERIFIED   | Both Hero.astro and CTA.astro href="/kontakt?tjeneste=nettbutikk"        |
| 14 | Nettbutikk page has unique meta title and description passed to BaseLayout                   | VERIFIED   | title="Nettbutikk med Shopify | Komplett oppsett | Nettup"               |
| 15 | Service JSON-LD with PriceSpecification injected in nettbutikk page head                    | VERIFIED   | Fragment slot="head" with minPrice: 25000, no maxPrice                   |
| 16 | /tjenester/landingsside loads with outcome headline and price signal above the fold          | VERIFIED   | Hero.astro animate-fade-up h1; "fra 8 000 kr" price signal              |
| 17 | Landingsside inkludert lists konverteringsfokusert layout, A/B-klar, hurtig lasting, annonse-integrasjon | VERIFIED | All 4 items present in features array with substantive descriptions |
| 18 | Landingsside FAQ has 4–5 questions specific to landing pages/ads                            | VERIFIED   | 5 questions covering Google Ads, A/B-testing, CRM-integrasjon, konverteringssporing |
| 19 | Landingsside CTA button links to /kontakt?tjeneste=landingsside                             | VERIFIED   | Both Hero.astro and CTA.astro href="/kontakt?tjeneste=landingsside"      |
| 20 | Landingsside page has unique meta title and description passed to BaseLayout                 | VERIFIED   | title="Landingsside for annonser og kampanjer | Fra 8 000 kr | Nettup"  |
| 21 | Service JSON-LD with PriceSpecification injected in landingsside page head                  | VERIFIED   | Fragment slot="head" with minPrice: 8000, no maxPrice                    |

**Score:** 21/21 truths verified

---

### Required Artifacts

| Artifact                                                          | Provides                                          | Status     | Details                                          |
|-------------------------------------------------------------------|---------------------------------------------------|------------|--------------------------------------------------|
| `src/pages/tjenester/nettside/index.astro`                        | Page root: meta, Service JSON-LD, section composition | VERIFIED | 51 lines; imports all 4 sections; Service JSON-LD in Fragment slot="head" |
| `src/pages/tjenester/nettside/_sections/Hero.astro`               | Outcome headline + price signal + breadcrumbs + CTA | VERIFIED | animate-fade-up h1; price signal; /kontakt?tjeneste=nettside |
| `src/pages/tjenester/nettside/_sections/Inkludert.astro`          | Checkmark grid with nettside-specific features    | VERIFIED   | 8 features; substantive descriptions; correct SVG checkmark |
| `src/pages/tjenester/nettside/_sections/FAQ.astro`                | Service-specific FAQ + inline FAQPage JSON-LD     | VERIFIED   | 5 questions; FAQPage JSON-LD inline with is:inline |
| `src/pages/tjenester/nettside/_sections/CTA.astro`                | Section CTA linking to /kontakt?tjeneste=nettside | VERIFIED   | href="/kontakt?tjeneste=nettside" |
| `src/pages/tjenester/nettbutikk/index.astro`                      | Page root: meta, Service JSON-LD, section composition | VERIFIED | 51 lines; imports all 4 sections; Service JSON-LD in Fragment slot="head" |
| `src/pages/tjenester/nettbutikk/_sections/Hero.astro`             | Outcome headline + price signal + breadcrumbs + CTA | VERIFIED | animate-fade-up h1; "fra 25 000 kr"; /kontakt?tjeneste=nettbutikk |
| `src/pages/tjenester/nettbutikk/_sections/Inkludert.astro`        | Checkmark grid + 3-step process + Shopify fee note | VERIFIED  | 8 features; 3-step ol; Shopify fee footnote below grid |
| `src/pages/tjenester/nettbutikk/_sections/FAQ.astro`              | Nettbutikk-specific FAQ + inline FAQPage JSON-LD  | VERIFIED   | 5 questions; FAQPage JSON-LD inline |
| `src/pages/tjenester/nettbutikk/_sections/CTA.astro`              | Section CTA linking to /kontakt?tjeneste=nettbutikk | VERIFIED | href="/kontakt?tjeneste=nettbutikk" |
| `src/pages/tjenester/landingsside/index.astro`                    | Page root: meta, Service JSON-LD, section composition | VERIFIED | 51 lines; imports all 4 sections; Service JSON-LD in Fragment slot="head" |
| `src/pages/tjenester/landingsside/_sections/Hero.astro`           | Outcome headline + price signal + breadcrumbs + CTA | VERIFIED | animate-fade-up h1; "fra 8 000 kr"; /kontakt?tjeneste=landingsside |
| `src/pages/tjenester/landingsside/_sections/Inkludert.astro`      | Checkmark grid with landingsside-specific features | VERIFIED  | 8 features including all 4 required conversion-specific items |
| `src/pages/tjenester/landingsside/_sections/FAQ.astro`            | Landingsside-specific FAQ + inline FAQPage JSON-LD | VERIFIED  | 5 ads-specific questions; FAQPage JSON-LD inline |
| `src/pages/tjenester/landingsside/_sections/CTA.astro`            | Section CTA linking to /kontakt?tjeneste=landingsside | VERIFIED | href="/kontakt?tjeneste=landingsside" |

---

### Key Link Verification

| From                                           | To                              | Via                                        | Status   | Details                                                       |
|------------------------------------------------|---------------------------------|--------------------------------------------|----------|---------------------------------------------------------------|
| `nettside/index.astro`                         | `src/config/services.ts`        | `services.find(s => s.slug === 'nettside')`| WIRED    | services.ts exports slug 'nettside' with minPrice: 15000      |
| `nettside/_sections/CTA.astro`                 | `/kontakt?tjeneste=nettside`    | Button href prop                           | WIRED    | href="/kontakt?tjeneste=nettside" confirmed in file           |
| `nettside/_sections/Hero.astro`                | `/kontakt?tjeneste=nettside`    | Button href prop                           | WIRED    | href="/kontakt?tjeneste=nettside" confirmed in file           |
| `nettbutikk/_sections/Inkludert.astro`         | Shopify fee disclosure          | p.text-sm.text-text-muted below grid       | WIRED    | "* Shopify lisens (fra 299 kr/mnd) faktureres separat av Shopify." |
| `nettbutikk/_sections/CTA.astro`               | `/kontakt?tjeneste=nettbutikk`  | Button href prop                           | WIRED    | href="/kontakt?tjeneste=nettbutikk" confirmed in file         |
| `nettbutikk/index.astro`                       | `src/config/services.ts`        | `services.find(s => s.slug === 'nettbutikk')` | WIRED | services.ts exports slug 'nettbutikk' with minPrice: 25000   |
| `landingsside/_sections/CTA.astro`             | `/kontakt?tjeneste=landingsside`| Button href prop                           | WIRED    | href="/kontakt?tjeneste=landingsside" confirmed in file       |
| `landingsside/index.astro`                     | `src/config/services.ts`        | `services.find(s => s.slug === 'landingsside')` | WIRED | services.ts exports slug 'landingsside' with minPrice: 8000  |

---

### Requirements Coverage

| Requirement | Source Plan | Description                                                        | Status    | Evidence                                                         |
|-------------|-------------|--------------------------------------------------------------------|-----------|------------------------------------------------------------------|
| PAGES-01    | 08-01       | /tjenester/nettside — dedikert tjenesteside                        | SATISFIED | Page exists, builds cleanly, full content implementation         |
| PAGES-02    | 08-03       | /tjenester/landingsside — dedikert tjenesteside                    | SATISFIED | Page exists, builds cleanly, full content implementation         |
| PAGES-03    | 08-02       | /tjenester/nettbutikk — dedikert tjenesteside (Shopify)            | SATISFIED | Page exists, builds cleanly, Shopify-specific content present    |
| CONTENT-01  | 08-01       | Hero (outcome + prissignal) → inkludert → FAQ → CTA per page       | SATISFIED | All 3 pages follow 4-section structure exactly as required       |
| CONTENT-02  | 08-01       | Outcome-first language in primary sequences                        | SATISFIED | H1s: "jobber for deg", "uten å bekymre deg", "overbeviser besøkende" |
| CONTENT-03  | 08-01       | Minimum 500 words of substantive content per page                  | SATISFIED | Each page has 8-feature inkludert + 5-answer FAQ + hero/CTA copy; well above 500 words |
| CONTENT-04  | 08-02       | Nettbutikk addresses Shopify platform fees transparently           | SATISFIED | "* Shopify lisens (fra 299 kr/mnd) faktureres separat av Shopify." below grid |
| SEO-02      | 08-01       | Each sub-page has unique meta title and description                | SATISFIED | Three distinct titles; none duplicate each other or /tjenester   |
| CTA-01      | 08-01       | Each service page CTA links to /kontakt?tjeneste=[slug]            | SATISFIED | All 6 CTAs (Hero + CTA section for each page) correctly pre-fill |

All 9 required requirement IDs accounted for. No orphaned requirements for Phase 8 found.

**Note on SEO-03:** FAQPage JSON-LD is implemented on all 3 pages (inline in FAQ.astro) but SEO-03 is assigned to Phase 10 per REQUIREMENTS.md. Phase 08 has delivered this ahead of schedule. No action needed.

---

### Anti-Patterns Found

No anti-patterns detected across all 15 files. Scanned for:
- TODO/FIXME/HACK/placeholder comments
- Empty return values (return null, return {}, return [])
- Console.log-only implementations
- Stub handlers

Result: Clean.

---

### Build Verification

```
[build] 10 page(s) built in 1.41s
[build] Complete!
```

All three service pages (/tjenester/nettside, /tjenester/nettbutikk, /tjenester/landingsside) appear in build output with no errors or warnings.

---

### Human Verification Required

#### 1. Animation rendering — above-fold content visibility

**Test:** Open each service page in a browser. Verify the hero headline and price signal are immediately visible without scrolling.
**Expected:** H1 and price signal visible on load; they should fade in via `animate-fade-up`, not stay invisible waiting for scroll.
**Why human:** CSS animation behavior requires visual inspection; can't verify from static markup alone.

#### 2. Breadcrumb navigation — correct hierarchy display

**Test:** Visit /tjenester/nettside, /tjenester/nettbutikk, /tjenester/landingsside in a browser.
**Expected:** Breadcrumb trail shows "Hjem > Tjenester > [Sidenavn]" with the first two links active and last item non-linked.
**Why human:** Breadcrumbs.astro rendering requires visual confirmation.

#### 3. Contact form pre-fill — tjeneste parameter on arrival

**Test:** Click any CTA button on a service page. Check the contact form on /kontakt.
**Expected:** The form pre-selects or acknowledges the service type from the URL parameter `?tjeneste=nettside` (etc.).
**Why human:** Depends on ContactForm island behavior with URL parameters; requires interactive testing.

---

## Gaps Summary

No gaps found. All 21 truths verified, all 15 artifacts substantive and wired, all 9 requirement IDs satisfied, no anti-patterns detected, build passes cleanly.

---

_Verified: 2026-03-05T12:10:30Z_
_Verifier: Claude (gsd-verifier)_
