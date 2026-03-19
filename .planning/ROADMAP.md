# Roadmap: Nettup v1.6 Landingsside & Google Ads

## Overview

Rebuild `/nettside-for-bedrift` from its current state into a conversion-optimized subscription landing page (0 kr oppstart + 399 kr/mnd), with full Google Ads readiness. The build order follows strict dependency chains: tracking infrastructure first (ads cannot run without Consent Mode v2), then config foundation and conversion flow (sections import from subscriptionOffer.ts), then the content rebuild itself, and finally ad campaign documentation (ad copy must match the final page).

## Phases

**Phase Numbering:**
- Integer phases (31, 32, 33, 34): Planned milestone work (continuing from v1.5 phase 30)
- Decimal phases (31.1, 32.1): Urgent insertions (marked with INSERTED)

- [ ] **Phase 31: Tracking Infrastructure** - Consent Mode v2 upgrade and noindex to prepare for paid traffic
- [ ] **Phase 32: Config & Conversion Flow** - subscriptionOffer.ts config, thank-you page, form redirect, UTM capture
- [ ] **Phase 33: Landing Page Content Rebuild** - Full section rebuild with subscription pricing, reduced form, honest trust signals
- [ ] **Phase 34: Google Ads Campaign Docs** - Keyword research, ad copy, extensions, and campaign structure matching final page

## Phase Details

### Phase 31: Tracking Infrastructure
**Goal**: Google Ads can collect conversion data legally and the landing page does not cannibalize organic rankings
**Depends on**: Nothing (first phase in v1.6)
**Requirements**: TRACK-01, TRACK-04
**Success Criteria** (what must be TRUE):
  1. gtag loads immediately on page load with all consent states set to `denied` by default, and updates to `granted` when user consents (Consent Mode v2 advanced mode)
  2. `ad_user_data` and `ad_personalization` consent parameters are present in the gtag consent config
  3. `/nettside-for-bedrift` has `noindex` meta tag preventing search engine indexing
**Plans**: TBD

Plans:
- [ ] 31-01: TBD

### Phase 32: Config & Conversion Flow
**Goal**: The subscription offer data model exists as single source of truth and form submissions reliably trigger conversion events via a dedicated thank-you page
**Depends on**: Phase 31
**Requirements**: LP-02, TRACK-02, TRACK-03, TRACK-05
**Success Criteria** (what must be TRUE):
  1. `subscriptionOffer.ts` exists and exports all offer details (price, features, scarcity, upsell services) that landing page sections will consume
  2. `/nettside-for-bedrift/takk` page exists and fires both gtag conversion event and Plausible event on page load
  3. Form submission on the landing page redirects the user to `/nettside-for-bedrift/takk` instead of showing an inline success message
  4. UTM parameters (source, medium, campaign) are captured from the URL and included in form submission data
**Plans**: TBD

Plans:
- [ ] 32-01: TBD
- [ ] 32-02: TBD

### Phase 33: Landing Page Content Rebuild
**Goal**: A visitor arriving from Google Ads sees a single clear subscription offer, honest trust signals, and a frictionless 3-field form -- no fake social proof, no mixed pricing signals
**Depends on**: Phase 32
**Requirements**: LP-01, LP-03, LP-04, LP-05, LP-06, LP-07, LP-08
**Success Criteria** (what must be TRUE):
  1. Hero section presents the subscription offer (0 kr oppstart + 399 kr/mnd) as the single primary CTA, anchored against one-time cost
  2. Contact form shows only name, email, and phone fields (pakke, tjeneste, and melding fields removed in b2b context)
  3. Static scarcity counter and unverifiable 4.9-star rating are removed, replaced with honest approach
  4. FAQ section addresses subscription-specific objections (cancellation, ownership, "paying forever", what's included)
  5. PricingSummary shows one primary subscription card with a "Trenger du mer?" upsell section for larger services below
**Plans**: TBD

Plans:
- [ ] 33-01: TBD
- [ ] 33-02: TBD
- [ ] 33-03: TBD

### Phase 34: Google Ads Campaign Docs
**Goal**: A complete, ready-to-launch Google Ads campaign package with ad copy that matches the final landing page content
**Depends on**: Phase 33
**Requirements**: ADS-01, ADS-02, ADS-03, ADS-04
**Success Criteria** (what must be TRUE):
  1. Keyword research file exists with Norwegian search terms, estimated volumes, and bid suggestions organized by intent
  2. 3-5 ad copy variants exist with headlines and descriptions that reference the subscription offer visible on the landing page
  3. Ad extensions (sitelinks, callouts, structured snippets) are prepared and reference real page content
  4. Campaign structure document defines ad groups, budget recommendations, and negative keywords
**Plans**: TBD

Plans:
- [ ] 34-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 31 -> 32 -> 33 -> 34

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 31. Tracking Infrastructure | 0/? | Not started | - |
| 32. Config & Conversion Flow | 0/? | Not started | - |
| 33. Landing Page Content Rebuild | 0/? | Not started | - |
| 34. Google Ads Campaign Docs | 0/? | Not started | - |
