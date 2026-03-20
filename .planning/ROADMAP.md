# Roadmap: Nettup v1.6 Landingsside & Google Ads

## Overview

**One service, one campaign.** Rebuild `/nettside-for-bedrift` into a single-offer subscription landing page (0 kr oppstart + 399 kr/mnd for a 5-page website) with full Google Ads readiness. No tiers, no package selection -- one clear "yes/no" decision for cold ad traffic. Visitors who need more get linked to `/tjenester`.

Build order follows strict dependency chains: tracking infrastructure first (ads cannot run without Consent Mode v2), then config foundation and conversion flow (sections import from subscriptionOffer.ts), then the content rebuild itself, and finally ad campaign documentation (ad copy must match the final page).

## Phases

**Phase Numbering:**
- Integer phases (31, 32, 33, 34): Planned milestone work (continuing from v1.5 phase 30)
- Decimal phases (31.1, 32.1): Urgent insertions (marked with INSERTED)

- [x] **Phase 31: Tracking Infrastructure** - Consent Mode v2 upgrade and noindex to prepare for paid traffic (completed 2026-03-19)
- [x] **Phase 32: Config & Conversion Flow** - subscriptionOffer.ts config for the single offer, thank-you page, form redirect, UTM capture (completed 2026-03-19)
- [x] **Phase 33: Landing Page Content Rebuild** - Single-offer page: one subscription card, reduced form, honest trust signals, upsell links to /tjenester (completed 2026-03-20)
- [ ] **Phase 34: Google Ads Campaign Docs** - Single-service campaign: keyword research, ad copy, extensions targeting 399 kr/mnd offer (gap closure in progress)

## Phase Details

### Phase 31: Tracking Infrastructure
**Goal**: Google Ads can collect conversion data legally and the landing page does not cannibalize organic rankings
**Depends on**: Nothing (first phase in v1.6)
**Requirements**: TRACK-01, TRACK-04
**Success Criteria** (what must be TRUE):
  1. gtag loads immediately on page load with all consent states set to `denied` by default, and updates to `granted` when user consents (Consent Mode v2 advanced mode)
  2. `ad_user_data` and `ad_personalization` consent parameters are present in the gtag consent config
  3. `/nettside-for-bedrift` has `noindex` meta tag preventing search engine indexing
**Plans:** 1/1 plans complete

Plans:
- [ ] 31-01-PLAN.md -- Consent Mode v2 upgrade, noIndex default, sitemap exclusion, privacy page update

### Phase 32: Config & Conversion Flow
**Goal**: The single subscription offer data model exists as single source of truth and form submissions reliably trigger conversion events via a dedicated thank-you page
**Depends on**: Phase 31
**Requirements**: LP-02, TRACK-02, TRACK-03, TRACK-05
**Success Criteria** (what must be TRUE):
  1. `subscriptionOffer.ts` exists and exports the single offer (price, features, terms, upsell links to /tjenester) -- no tiers, no package array
  2. `/nettside-for-bedrift/takk` page exists and fires both gtag conversion event and Plausible event on page load
  3. Form submission on the landing page redirects the user to `/nettside-for-bedrift/takk` instead of showing an inline success message
  4. UTM parameters (source, medium, campaign) are captured from the URL and included in form submission data
**Plans:** 2/2 plans complete

Plans:
- [ ] 32-01-PLAN.md -- subscriptionOffer.ts config, importer migration, launchOffer deletion, analytics + UTM utilities
- [ ] 32-02-PLAN.md -- Thank-you page with conversion events, form redirects, inline gtag removal, UTM in payloads

### Phase 33: Landing Page Content Rebuild
**Goal**: A visitor arriving from Google Ads sees one offer, one decision, and a frictionless 3-field form -- no tiers, no fake social proof, no mixed pricing signals
**Depends on**: Phase 32
**Requirements**: LP-01, LP-03, LP-04, LP-05, LP-06, LP-07, LP-08
**Success Criteria** (what must be TRUE):
  1. Hero section presents the single subscription offer (0 kr oppstart + 399 kr/mnd, 5-page website) as the only CTA -- no tier selection, no package comparison
  2. Contact form shows only name, email, and phone fields (no pakke selector needed -- there is only one service)
  3. Static scarcity counter and unverifiable 4.9-star rating are removed, replaced with honest approach
  4. FAQ section addresses subscription-specific objections (cancellation, ownership, "paying forever", what's included)
  5. PricingSummary replaced with single offer card + "Trenger du mer?" section that links to `/tjenester` for custom websites and e-commerce -- these are upsell paths, not campaign offers
**Plans:** 3/3 plans complete

Plans:
- [ ] 33-01-PLAN.md -- Hero price anchoring, VisualProof website previews, HeroMicroForm button update
- [ ] 33-02-PLAN.md -- PricingSummary guarantee, WhyUs subscription cards, FAQ rewrite, UpsellSection creation
- [ ] 33-03-PLAN.md -- FormSection simplification, ContactForm b2b field reduction, index.astro wiring, stale reference cleanup

### Phase 34: Google Ads Campaign Docs
**Goal**: A single-service Google Ads campaign ready to launch, targeting the 399 kr/mnd subscription offer exclusively
**Depends on**: Phase 33
**Requirements**: ADS-01, ADS-02, ADS-03, ADS-04
**Success Criteria** (what must be TRUE):
  1. Keyword research file exists with Norwegian search terms targeting the single service (affordable business website), with volumes and bid suggestions
  2. 3-5 ad copy variants exist, all focused on the 399 kr/mnd offer -- no mention of multiple tiers or packages
  3. Ad extensions prepared: sitelinks to `/tjenester` subpages as upsell paths (not as campaign alternatives), callouts matching the single offer
  4. Single campaign structure with one primary ad group for the subscription offer, budget recommendations, and negative keywords to filter non-target traffic (e.g., "gratis nettside", "wordpress")
**Plans:** 3 plans (2 complete, 1 gap closure)

Plans:
- [ ] 34-01-PLAN.md -- Keyword research and ad copy variants (keywords.md + ad-copy.md)
- [ ] 34-02-PLAN.md -- Ad extensions and campaign structure (extensions.md + campaign-structure.md)
- [ ] 34-03-PLAN.md -- Gap closure: add missing "24t Respons" callout to extensions.md (ADS-03)

## Progress

**Execution Order:**
Phases execute in numeric order: 31 -> 32 -> 33 -> 34

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 31. Tracking Infrastructure | 1/1 | Complete    | 2026-03-19 |
| 32. Config & Conversion Flow | 2/2 | Complete    | 2026-03-19 |
| 33. Landing Page Content Rebuild | 3/3 | Complete    | 2026-03-20 |
| 34. Google Ads Campaign Docs | 2/3 | Gap Closure | - |
