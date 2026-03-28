# Roadmap: Nettup v1.7 Multi-Channel Ad Campaign

## Overview

v1.7 prepares nettup.no for a Facebook/Instagram-led ad campaign. The milestone delivers Meta Pixel tracking with consent-aware loading, expanded conversion events across the full site, landing page improvements for ad-to-page consistency, privacy compliance, a custom OG image for social sharing, and complete campaign strategy documentation including video creative plans, audience targeting, and A/B testing rules.

**Key insight from research:** Video ads outperform static images by 47% in engagement and 80% in brand recall. Product demos shown without a presenter face get 27% higher engagement. The creative strategy uses faceless formats: screen recordings, before/after reveals, bold text-on-screen, coding timelapses, and developer-aesthetic animations. No founder face on camera; voiceover is used where needed.

**Norway-specific:** Facebook CPC in Norway is ~8.50 NOK (24% below global average). Very few Norwegian web agencies run Facebook ads for their own lead generation, meaning low competition and cheap inventory. Summer (June-August) CPCs drop 35-65% below annual averages -- ideal launch window.

**Creative toolkit:** CapCut (free), URLtoVideo (free), OBS Studio (free), Screen Studio ($89 one-time), ElevenLabs Starter ($5/mnd for Norwegian AI voiceover), Mixkit (free music). Total: ~$5/mnd + $89 one-time.

## Milestones

- ✅ **v1.0 Launch** - Phases 1-4 (shipped 2026-03-04)
- ✅ **v1.1 Tjenesteutvidelse** - Phases 6-12 (shipped 2026-03-06)
- ✅ **v1.2 Smart Priskalkulator** - Phases 13-16.1 (shipped 2026-03-06)
- ✅ **v1.3 Automatisk Blogg** - Phases 17-19 (shipped 2026-03-07)
- ✅ **v1.4 Portefolje 2.0** - Phases 20-23 (shipped 2026-03-08)
- ✅ **v1.5 Lokale SEO-sider** - Phases 24-30 (shipped 2026-03-13)
- ✅ **v1.6 Landingsside & Google Ads** - Phases 31-35 (shipped 2026-03-28)
- 🚧 **v1.7 Multi-Channel Ad Campaign** - Phases 36-41 (in progress)

## Phases

- [x] **Phase 36: Meta Pixel & Full-Site Event Tracking** - Consent-aware Meta Pixel, conversion events on landing page + key site pages, retargeting event infrastructure (completed 2026-03-28)
- [x] **Phase 37: Privacy & Compliance** - Privacy page Meta Pixel disclosure, environment-variable kill switch (completed 2026-03-28)
- [x] **Phase 38: Landing Page Ad Consistency** - Price anchoring against competitors, consent banner parity, custom OG image for social sharing (completed 2026-03-28)
- [ ] **Phase 39: Campaign Strategy & Documentation** - Facebook ad copy, video creative plans, audience targeting, lead form spec, A/B testing plan
- [ ] **Phase 40: Multi-Channel Strategy** - Phased rollout plan (Facebook > Google long-tail > TikTok), budget allocation, KPI targets, scaling rules
- [ ] **Phase 41: Lead Magnet & Mid-Funnel Asset** - Email-gated checklist page for cheaper mid-funnel lead capture

## Phase Details

### Phase 36: Meta Pixel & Full-Site Event Tracking
**Goal**: Meta Pixel loads consent-aware across all landing pages, conversion events fire on key pages, retargeting events fire on high-intent pages across the full site, and UTM attribution captures all Facebook ad parameters
**Depends on**: Phase 35 (v1.6 complete -- existing consent IIFE and UTM capture in place)
**Requirements**: TRACK-01, TRACK-02, TRACK-03, TRACK-04, TRACK-05, TRACK-06, TRACK-07
**Success Criteria** (what must be TRUE):
  1. Meta Pixel loads on /nettside-for-bedrift with fbq('consent','revoke') called before fbq('init') -- no pixel fires without user consent
  2. Accepting the consent banner grants both gtag and fbq consent in a single click, using one shared localStorage key
  3. ViewContent event fires on /nettside-for-bedrift page load and Lead event fires on /nettside-for-bedrift/takk page load (both consent-gated)
  4. ViewContent events with content_name fire on /priskalkulator, /tjenester/nettside, /tjenester/nettbutikk, and /tjenester/landingsside for retargeting segmentation
  5. UTM capture on /takk stores all 5 params (source, medium, campaign, content, term) for Facebook attribution
  6. Meta Pixel is loaded via BaseLayout.astro (not just LandingPageLayout) so retargeting events fire site-wide
**Plans:** 2/2 plans complete
Plans:
- [ ] 36-01-PLAN.md -- Consent-aware Meta Pixel infrastructure in both layouts with consent banner
- [ ] 36-02-PLAN.md -- Per-page ViewContent/Lead events and UTM expansion to 5 params

### Phase 37: Privacy & Compliance
**Goal**: Privacy policy documents Meta Pixel usage and a kill switch allows instant pixel removal without code changes -- legal prerequisites satisfied before pixel goes live
**Depends on**: Phase 36 (must know what the pixel does before documenting it)
**Requirements**: PRIV-01, PRIV-02
**Success Criteria** (what must be TRUE):
  1. /personvern page includes Meta Pixel disclosure section listing data processor (Meta), purpose (ad measurement and retargeting), and consent mechanism
  2. Setting an environment variable or config flag to disabled stops Meta Pixel from loading entirely -- no code changes required
**Plans:** 1/1 plans complete
Plans:
- [ ] 37-01-PLAN.md -- Meta Pixel privacy disclosure and kill switch documentation

### Phase 38: Landing Page Ad Consistency
**Goal**: The landing page reinforces what Facebook ads promise -- price anchoring against competitors is visible, the consent banner has equal-prominence buttons, and social sharing shows the subscription offer instead of a generic image
**Depends on**: Phase 36 (pixel must be in place before driving ad traffic)
**Requirements**: LP-01, LP-02, LP-03
**Success Criteria** (what must be TRUE):
  1. PricingSummary section includes a competitor price anchor ("Andre byraer tar 15 000-50 000 kr for en nettside") that frames the 399 kr/mnd offer as dramatically cheaper -- resolves INT-01 gap from v1.6 audit
  2. Consent banner accept and decline buttons have equal visual prominence (both solid styling, no dark patterns)
  3. /nettside-for-bedrift uses a custom OG image (1200x630) showing "0 kr oppstart | 399 kr/mnd" instead of the generic og-image.jpg -- generated once via satori, not a build pipeline
**Plans:** 2/2 plans complete
Plans:
- [ ] 38-01-PLAN.md -- Competitor price anchor + consent banner button parity
- [ ] 38-02-PLAN.md -- Custom OG image wiring for social sharing

### Phase 39: Campaign Strategy & Documentation
**Goal**: Complete Facebook campaign documentation enables launching ads without additional research -- all copy, targeting, creative plans, and testing rules are defined and ready for Ads Manager setup
**Depends on**: Nothing (documentation-only, can run in parallel with code phases)
**Requirements**: CAMP-01, CAMP-02, CAMP-03, CAMP-04, CAMP-05, CAMP-06, CAMP-07
**Success Criteria** (what must be TRUE):
  1. Facebook ad copy document contains 4+ variants with primary text, headline, description, and CTA in Norwegian -- covering awareness (hook), consideration (case study), and conversion (direct offer) funnel stages
  2. Faceless video creative plan documents 5 formats with production specs, scripts/text overlays, and tools:
     - (a) Smooth scroll-through (15-30s): screen-record iGive/Blom Company sites via URLtoVideo or Screen Studio, voiceover optional, text overlays with Lighthouse scores and price
     - (b) Before/after split screen (10-20s): generic template site vs Nettup build, animated metrics comparison (old Lighthouse vs new), cyan divider line
     - (c) Bold text-on-screen (10-15s): line-by-line text reveal on dark background with price anchoring hook, cut to real site scroll, CapCut
     - (d) Coding timelapse (15-30s): OBS screen recording of VS Code at 10-20x speed building a real Astro component, split pane with browser preview, Norwegian text overlay captions
     - (e) Developer aesthetic ad (10-15s): Framer Motion spring animation of UI element materializing on #020617 background, morphing into website screenshot, "399 kr/mnd" fade-in -- built in React, screen-recorded
  3. Carousel ad plan defines 2 carousel variants: (a) case study walk-through (5 cards: iGive, Blom Company, features, price, CTA), (b) DIY vs professional comparison (4 cards: Wix pricing, Nettup pricing, included features, CTA)
  4. Audience targeting document specifies 3 targeting layers: cold (Business Page admins, "Admins of new active businesses 6-24 months", job titles: daglig leder/grunder/eier, age 25-55), warm (video viewers 50%+, site visitors, page engagers), hot (priskalkulator/kontakt/tjenester visitors, form abandoners, lead form openers who didn't submit)
  5. Lead form specification defines exact fields (navn, e-post, telefon, dropdown: Nettside/Nettbutikk/Landingsside/Vet ikke enna), pre-fill config from Facebook profile, and thank-you screen copy
  6. A/B testing plan includes test matrix (2 hooks x 2 audiences minimum), kill criteria (CPL > 950 NOK, frequency > 3, CTR < 0.5%), and scaling rules (increase budget 20% every 3 days on winners)
  7. Weekly content production cadence documented: 2x scroll-throughs (10 min each), 1x bold text hook (10 min), 1x before/after or process clip (30-60 min) -- under 2 hrs/week total
**Plans:** 1/3 plans executed
Plans:
- [ ] 39-01-PLAN.md -- Ad copy variants (6 static + 2 carousel) across all funnel stages
- [x] 39-02-PLAN.md -- Video creative plan (5 formats) and weekly production cadence
- [ ] 39-03-PLAN.md -- Audience targeting (3 layers), lead form spec, and A/B testing plan

### Phase 40: Multi-Channel Strategy
**Goal**: Phased rollout plan across channels with budget allocation, timeline, and KPI targets -- so you know exactly when to activate each channel and how to measure success
**Depends on**: Phase 39 (Facebook strategy must be defined first)
**Requirements**: STRAT-01, STRAT-02
**Success Criteria** (what must be TRUE):
  1. Multi-channel strategy doc defines 3-phase rollout: Facebook months 1-3 (primary, 70% budget), Google Ads long-tail months 2-4 (secondary, 20% budget), TikTok/expansion months 4+ (test, 10% budget)
  2. Budget document specifies starting spend (5 000-10 000 kr/mnd), campaign-level splits (awareness 40% / consideration 30% / conversion 30%), expected CPL ranges (300-950 NOK), and break-even math (1 client/month = profitable)
**Plans**: TBD

### Phase 41: Lead Magnet & Mid-Funnel Asset
**Goal**: A mid-funnel conversion path exists for prospects who aren't ready to buy -- capturing emails at lower CPL than direct-to-contact campaigns, building a nurture list for future follow-up
**Depends on**: Phase 36 (pixel events needed to track lead magnet conversions)
**Requirements**: LEAD-01, LEAD-02
**Success Criteria** (what must be TRUE):
  1. /sjekkliste page exists with a "10 ting nettsiden din trenger i 2026" checklist gated behind a 2-field form (navn, e-post) -- submitted via Formspree to a separate form endpoint
  2. Lead magnet download triggers a Plausible event (LeadMagnetDownload) and Meta Pixel Lead event for conversion tracking
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
- Phase 36 first (pixel infrastructure everything else depends on)
- Phase 37 immediately after 36 (legal gate)
- Phase 38 after 36 (needs pixel in place)
- Phases 39 and 40 are documentation-only and can run in parallel with 36-38
- Phase 41 last (needs pixel + Formspree setup from earlier phases)

Recommended execution: 36 → 37 → 38 → 41, with 39/40 interleaved as parallel documentation work.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 36. Meta Pixel & Full-Site Event Tracking | 0/2 | Complete    | 2026-03-28 |
| 37. Privacy & Compliance | 0/1 | Complete    | 2026-03-28 |
| 38. Landing Page Ad Consistency | 0/2 | Complete    | 2026-03-28 |
| 39. Campaign Strategy & Documentation | 1/3 | In Progress|  |
| 40. Multi-Channel Strategy | 0/TBD | Not started | - |
| 41. Lead Magnet & Mid-Funnel Asset | 0/TBD | Not started | - |
