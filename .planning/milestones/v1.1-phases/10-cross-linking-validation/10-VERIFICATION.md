---
phase: 10-cross-linking-validation
verified: 2026-03-05T14:12:00Z
status: human_needed
score: 5/6 must-haves verified
re_verification: false
human_verification:
  - test: "Open each of the 7 service pages in Google Rich Results Test (https://search.google.com/test/rich-results) using the HTML paste method: run `npm run build && npm run preview`, copy page source for each URL, paste as Code Snippet."
    expected: "Each of the 7 pages shows detected Service rich result (no errors) AND detected FAQ rich result (no errors). No warnings about missing required fields on either schema type."
    why_human: "Google Rich Results Test requires a browser UI or API call. Structural verification (schema fields present in source) passes automated checks, but actual Google validator behavior — including whether priceCurrency/minPrice satisfy their requirements — cannot be confirmed without the tool."
---

# Phase 10: Cross-Linking and Validation Verification Report

**Phase Goal:** Add "Relaterte tjenester" cross-links to all 7 service pages and validate sitemap + JSON-LD schemas
**Verified:** 2026-03-05T14:12:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | `services.ts` has `related?: string[]` on the interface with locked pairings on all 7 service objects | VERIFIED | `related?: string[]` on line 12 of `services.ts`; all 7 objects have exactly 2 slugs matching plan spec |
| 2 | `RelaterteTjenester.astro` exists, is substantive, resolves slugs with guard | VERIFIED | File at `src/components/sections/RelaterteTjenester.astro`; imports `services`, resolves with `find + filter(Boolean)`, guards on `relatedServices.length > 0` |
| 3 | Section wired between FAQ and CTA on all 7 service pages | VERIFIED | All 7 `index.astro` files import component (line 8 each) and render `<RelaterteTjenester related={service.related ?? []} />` between `<FAQ />` and `<CTA />` |
| 4 | Production build exits 0 with 14 pages generated | VERIFIED | `npm run build` completed in 1.97s, 14 pages built, sitemap generated |
| 5 | All 7 `/tjenester/[slug]/` URLs appear in `dist/sitemap-0.xml` | VERIFIED | `grep -o 'tjenester/[^<]*' dist/sitemap-0.xml` returns all 7 slugs: ai, landingsside, nettbutikk, nettside, seo, vedlikehold, webapp |
| 6 | All 7 pages pass Google Rich Results Test for Service + FAQPage JSON-LD (SEO-01, SEO-03) | NEEDS HUMAN | Structural checks pass (schema fields present, FAQPage has 5 mainEntity items each, no duplicate tags), but actual validator behavior requires human-run Google Rich Results Test |

**Score:** 5/6 truths verified (automated), 1 pending human verification

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/config/services.ts` | `related?: string[]` interface field; all 7 objects with 2 locked slugs | VERIFIED | Interface has `related?: string[]` on line 12; pairings verified: nettside→[seo,vedlikehold], nettbutikk→[nettside,vedlikehold], landingsside→[seo,nettside], webapp→[ai,nettside], seo→[nettside,landingsside], ai→[webapp,seo], vedlikehold→[nettside,nettbutikk] |
| `src/components/sections/RelaterteTjenester.astro` | Shared component resolving slugs to cards | VERIFIED | 31 lines; imports services, Card, Section, SectionHeader; renders grid of Card-as-anchor with h3/p content (no nested anchors) |
| `src/pages/tjenester/nettside/index.astro` | Import + placement between FAQ and CTA | VERIFIED | Line 8 import, line 50 usage between FAQ (49) and CTA (51) |
| `src/pages/tjenester/nettbutikk/index.astro` | Import + placement between FAQ and CTA | VERIFIED | Line 8 import, line 50 usage between FAQ (49) and CTA (51) |
| `src/pages/tjenester/landingsside/index.astro` | Import + placement between FAQ and CTA | VERIFIED | Line 8 import, line 50 usage between FAQ (49) and CTA (51) |
| `src/pages/tjenester/webapp/index.astro` | Import + placement between FAQ and CTA | VERIFIED | Line 9 import, line 52 usage between FAQ (51) and CTA (53) — webapp has extra Prosess section |
| `src/pages/tjenester/seo/index.astro` | Import + placement between FAQ and CTA | VERIFIED | Line 8 import, line 50 usage between FAQ (49) and CTA (51) |
| `src/pages/tjenester/ai/index.astro` | Import + placement between FAQ and CTA | VERIFIED | Line 8 import, line 50 usage between FAQ (49) and CTA (51) |
| `src/pages/tjenester/vedlikehold/index.astro` | Import + placement between FAQ and CTA | VERIFIED | Line 8 import, line 50 usage between FAQ (49) and CTA (51) |
| `dist/sitemap-0.xml` | All 7 tjenester slugs present | VERIFIED | All 7 URLs confirmed after `npm run build` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| All 7 `index.astro` files | `RelaterteTjenester.astro` | `import` + JSX render | WIRED | Import on line 8 (or 9 for webapp), rendered with `related={service.related ?? []}` |
| `RelaterteTjenester.astro` | `src/config/services.ts` | `import { services }` | WIRED | Line 2 imports services; slug resolution via `services.find(s => s.slug === slug)` |
| `RelaterteTjenester.astro` | `Card.astro` | `as="a" href={...}` prop | WIRED | Card renders as `<a>` element; inner content is h3/p only — no nested anchors |
| Each `index.astro` | `services.ts` `related` field | `service.related ?? []` | WIRED | Reads optional field safely; passes array to component |
| All 7 `_sections/FAQ.astro` | FAQPage JSON-LD | `faqSchema` with `mainEntity` | WIRED | Each FAQ has 5 questions; mainEntity populated dynamically from `faqs` array |
| All 7 `index.astro` | Service JSON-LD | `serviceSchema` with `PriceSpecification` | WIRED | `minPrice: service.minPrice`, `priceCurrency: "NOK"` present in all 7 pages |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| SEO-01 | 10-01, 10-02 | Hver underside har `@type: Service` JSON-LD med `PriceSpecification` | SATISFIED (structural) / NEEDS HUMAN (validator) | `@type: Service` + `PriceSpecification` with `minPrice` and `priceCurrency: "NOK"` confirmed in all 7 `index.astro` files. Google Rich Results Test pending human verification. |
| SEO-03 | 10-01, 10-02 | FAQPage JSON-LD-schema på hver underside | SATISFIED (structural) / NEEDS HUMAN (validator) | `@type: FAQPage` in each `_sections/FAQ.astro`; `mainEntity` populated with 5 `Question` objects each. Google Rich Results Test pending human verification. |

Both SEO-01 and SEO-03 are mapped to Phase 10 in REQUIREMENTS.md traceability table — both are covered by plans 10-01 and 10-02. No orphaned requirements.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/ui/index.ts` | 4-8 | Pre-existing TS errors: cannot find `.astro` module declarations | Info | Pre-existing, unrelated to Phase 10. Does not affect Astro build (exits 0). Noted `tsc --noEmit` fails but `npm run build` succeeds. |
| `src/components/islands/DeviceMockup.tsx` | 152 | Pre-existing Framer Motion `Variants` type incompatibility | Info | Pre-existing, unrelated to Phase 10. Build unaffected. |

No anti-patterns introduced by Phase 10 changes. The `RelaterteTjenester.astro` and `services.ts` changes are clean.

### Human Verification Required

#### 1. Google Rich Results Test — All 7 Service Pages

**Test:**
1. Run `npm run build && npm run preview` (serves at `http://localhost:4321`)
2. For each of these 7 URLs, open in browser, view page source, copy full HTML:
   - `http://localhost:4321/tjenester/nettside/`
   - `http://localhost:4321/tjenester/nettbutikk/`
   - `http://localhost:4321/tjenester/landingsside/`
   - `http://localhost:4321/tjenester/webapp/`
   - `http://localhost:4321/tjenester/seo/`
   - `http://localhost:4321/tjenester/ai/`
   - `http://localhost:4321/tjenester/vedlikehold/`
3. Go to https://search.google.com/test/rich-results, click "Code snippet", paste HTML, run test

**Expected:** Each page shows detected "Service" rich result (no errors) AND detected "FAQ" rich result (no errors). No warnings about missing required fields.

**Why human:** Google Rich Results Test requires browser UI interaction. Automated grep confirms schema fields are structurally present in source, but the actual validator parses rendered HTML and applies Google's own schema rules — this cannot be replicated programmatically without the official tool.

**What to watch for:**
- Duplicate FAQPage schemas (should not occur — FAQPage is only in `_sections/FAQ.astro`)
- Missing `priceCurrency` field — present in source, should pass
- Empty `mainEntity` array — all pages have 5 questions, should pass

### Gaps Summary

No gaps blocking automated verification. The single outstanding item is human-run Google Rich Results Test for SEO-01 and SEO-03 validation — this is inherent to the plan design (Plan 10-02 Task 2 was explicitly a `checkpoint:human-verify` task).

All structural preconditions for passing the Rich Results Test are confirmed:
- Service schema: `@type: Service`, `PriceSpecification` with `minPrice` and `priceCurrency: "NOK"` on all 7 pages
- FAQPage schema: `@type: FAQPage`, `mainEntity` with 5 `Question` objects on all 7 pages
- No duplicate schema tags (1 ld+json script per `index.astro`, FAQPage in `FAQ.astro`)
- Build passes, sitemap complete

---

_Verified: 2026-03-05T14:12:00Z_
_Verifier: Claude (gsd-verifier)_
