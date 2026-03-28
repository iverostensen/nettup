# Roadmap: Nettup v1.7 Multi-Channel Ad Campaign

## Overview

v1.7 extends the existing landing page and consent infrastructure with Meta Pixel tracking for Facebook/Instagram campaigns, code-generated ad creative images, and multi-channel campaign documentation. The milestone delivers everything buildable in code before campaign launch in Meta Ads Manager: consent-aware pixel loading, conversion events, ad image templates via satori pipeline, and complete strategy/targeting/testing documentation.

## Milestones

- ✅ **v1.0 Launch** - Phases 1-4 (shipped 2026-03-04)
- ✅ **v1.1 Tjenesteutvidelse** - Phases 6-12 (shipped 2026-03-06)
- ✅ **v1.2 Smart Priskalkulator** - Phases 13-16.1 (shipped 2026-03-06)
- ✅ **v1.3 Automatisk Blogg** - Phases 17-19 (shipped 2026-03-07)
- ✅ **v1.4 Portefolje 2.0** - Phases 20-23 (shipped 2026-03-08)
- ✅ **v1.5 Lokale SEO-sider** - Phases 24-30 (shipped 2026-03-13)
- ✅ **v1.6 Landingsside & Google Ads** - Phases 31-35 (shipped 2026-03-28)
- 🚧 **v1.7 Multi-Channel Ad Campaign** - Phases 36-39 (in progress)

## Phases

- [ ] **Phase 36: Meta Pixel & Consent Integration** - Consent-aware Meta Pixel loading, conversion events, UTM expansion, and consent banner legal parity
- [ ] **Phase 37: Privacy & Compliance** - Privacy page Meta Pixel disclosure and environment-variable kill switch
- [ ] **Phase 38: Ad Creative Pipeline** - satori/resvg-js build pipeline generating brand-consistent ad images and custom OG image
- [ ] **Phase 39: Campaign Strategy & Documentation** - Ad copy, multi-channel strategy, audience targeting, lead form spec, and A/B testing plan

## Phase Details

### Phase 36: Meta Pixel & Consent Integration
**Goal**: Landing page visitors are tracked via Meta Pixel with full GDPR consent compliance, conversion events fire on key pages, and UTM attribution captures all Facebook ad parameters
**Depends on**: Phase 35 (v1.6 complete -- existing consent IIFE and UTM capture in place)
**Requirements**: TRACK-01, TRACK-02, TRACK-03, TRACK-04, TRACK-05, TRACK-06
**Success Criteria** (what must be TRUE):
  1. Meta Pixel loads on /nettside-for-bedrift with fbq('consent','revoke') called before fbq('init') -- no pixel fires without user consent
  2. Accepting the consent banner grants both gtag and fbq consent in a single click, using one shared localStorage key
  3. Consent banner accept and decline buttons have equal visual prominence (both solid styling, no dark patterns)
  4. ViewContent event fires on /nettside-for-bedrift page load and Lead event fires on /nettside-for-bedrift/takk page load (both consent-gated)
  5. UTM capture on /takk stores all 5 params (source, medium, campaign, content, term) for Facebook attribution
**Plans**: TBD

### Phase 37: Privacy & Compliance
**Goal**: Privacy policy documents Meta Pixel usage and a kill switch allows instant pixel removal without code changes -- legal prerequisites satisfied before pixel goes live
**Depends on**: Phase 36 (must know what the pixel does before documenting it)
**Requirements**: PRIV-01, PRIV-02
**Success Criteria** (what must be TRUE):
  1. /personvern page includes Meta Pixel disclosure section listing data processor (Meta), purpose (ad measurement and retargeting), and consent mechanism
  2. Setting an environment variable or config flag to disabled stops Meta Pixel from loading entirely -- no code changes required
**Plans**: TBD

### Phase 38: Ad Creative Pipeline
**Goal**: Brand-consistent ad images are generated from code via a repeatable build pipeline, producing ready-to-upload creative assets for Facebook/Instagram campaigns
**Depends on**: Nothing (independent of pixel/privacy work -- can run in parallel with Phase 36-37)
**Requirements**: AD-01, AD-02, AD-03, AD-04
**Success Criteria** (what must be TRUE):
  1. Running `npm run generate:ads` produces PNG files from JSX templates using satori + resvg-js
  2. 4 static ad images (1080x1080) exist in brand colors with correct dimensions: Price Drop, Checklist, Social Proof, Question Hook
  3. 2 story/reel templates (1080x1920) exist in brand colors with correct dimensions: The Reveal, Before/After
  4. /nettside-for-bedrift uses a custom OG image (1200x630) showing the price offer instead of the generic og-image
**Plans**: TBD
**UI hint**: yes

### Phase 39: Campaign Strategy & Documentation
**Goal**: Complete campaign documentation enables launching Facebook ads without additional research -- all copy, targeting, strategy, and testing rules are defined and ready for Ads Manager setup
**Depends on**: Nothing (documentation-only, can run in parallel with all code phases)
**Requirements**: CAMP-01, CAMP-02, CAMP-03, CAMP-04, CAMP-05
**Success Criteria** (what must be TRUE):
  1. Facebook ad copy document contains all 4 variants with primary text, headline, description, and CTA in Norwegian
  2. Multi-channel strategy doc defines phased rollout (Facebook months 1-2, Google long-tail months 2-3, TikTok months 3+) with budget allocation and KPI targets
  3. Audience targeting document specifies Business Page admins, job title stacks, and interest stacks with estimated audience sizes
  4. Lead form specification defines exact fields, pre-fill config, qualifying question, and thank-you screen copy
  5. A/B testing plan includes test matrix, kill criteria (CPL/CPM/frequency thresholds), and scaling rules

## Progress

**Execution Order:**
Phases 36 and 37 are sequential (37 depends on 36). Phases 38 and 39 are independent and can run in parallel with 36-37.

Recommended order: 36 → 37 → 38 → 39 (or 38/39 interleaved with 36-37)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 36. Meta Pixel & Consent Integration | 0/TBD | Not started | - |
| 37. Privacy & Compliance | 0/TBD | Not started | - |
| 38. Ad Creative Pipeline | 0/TBD | Not started | - |
| 39. Campaign Strategy & Documentation | 0/TBD | Not started | - |
