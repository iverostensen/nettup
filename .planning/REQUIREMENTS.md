# Requirements: Nettup v1.7 Multi-Channel Ad Campaign

**Defined:** 2026-03-28
**Core Value:** En potensiell kunde som lander pa siden skal umiddelbart forsta at Nettup leverer moderne nettsider raskt -- og at kvaliteten beviser det.

## v1.7 Requirements

Requirements for multi-channel Facebook/Instagram ad campaign infrastructure.

### Tracking Infrastructure

- [x] **TRACK-01**: Meta Pixel base code loads in LandingPageLayout with `fbq('consent','revoke')` before `fbq('init')`, matching existing gtag denied-defaults pattern
- [x] **TRACK-02**: Consent banner accept/decline triggers `fbq('consent','grant')` alongside existing `gtag('consent','update')`, sharing single localStorage key
- [x] **TRACK-03**: Consent banner buttons have equal visual prominence (solid styling for both accept and decline per E-Com Act)
- [x] **TRACK-04**: `fbq('track','ViewContent')` fires on /nettside-for-bedrift page load (consent-gated)
- [x] **TRACK-05**: `fbq('track','Lead')` fires on /nettside-for-bedrift/takk page load alongside existing gtag conversion event
- [x] **TRACK-06**: UTM capture expanded to 5 params (utm_content + utm_term added to existing source/medium/campaign in utm.ts)

### Privacy & Compliance

- [ ] **PRIV-01**: /personvern page updated with Meta Pixel disclosure (data processor, purpose, consent mechanism)
- [ ] **PRIV-02**: Meta Pixel can be disabled via environment variable or config flag without code changes (kill switch)

### Ad Creative

- [ ] **AD-01**: satori + @resvg/resvg-js build pipeline generates PNG images from JSX templates via `npm run generate:ads`
- [ ] **AD-02**: 4x static ad images (1080x1080) generated: Price Drop, Checklist, Social Proof, Question Hook -- brand colors (#020617 bg, #06b6d4 accent), Space Grotesk + Inter fonts
- [ ] **AD-03**: 2x story/reel templates (1080x1920) generated: The Reveal, Before/After
- [ ] **AD-04**: Custom OG image (1200x630) for /nettside-for-bedrift with price offer, replacing generic og-image

### Campaign Documentation

- [ ] **CAMP-01**: Facebook ad copy document with all 4+ variants (primary text, headline, description, CTA) in Norwegian covering awareness/consideration/conversion funnel stages
- [ ] **CAMP-02**: Faceless video creative plan with 5 formats, production specs, scripts/overlays, and tools
- [ ] **CAMP-03**: Carousel ad plan with 2 variants (case study walk-through + DIY vs professional comparison)
- [ ] **CAMP-04**: Audience targeting definitions with 3 layers (cold/warm/hot) including Business Page admins, job title stack, interest stack, and estimated sizes
- [ ] **CAMP-05**: Lead form specification with exact fields, pre-fill config, qualifying question, and thank-you screen copy
- [ ] **CAMP-06**: A/B testing plan with test matrix (2 hooks x 2 audiences), kill criteria (CPL/frequency/CTR thresholds), and scaling rules
- [ ] **CAMP-07**: Weekly content production cadence documented (under 2 hrs/week total)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Tracking

- **CAPI-01**: Meta Conversions API (server-side) via Vercel serverless for improved attribution
- **CAPI-02**: Server-side consent record logging for E-Com Act 5-year retention

### Channel Expansion

- **CHAN-01**: TikTok Pixel integration with consent management
- **CHAN-02**: LinkedIn Ads targeting for enterprise upsell

## Out of Scope

| Feature | Reason |
|---------|--------|
| Meta Conversions API (CAPI) | Unjustified complexity under 1000 EUR/month ad spend; evaluate after 4 weeks of pixel data |
| TikTok Pixel integration | Phase 3 channel; ads run through TikTok Ads Manager without pixel initially |
| Video ad production | Requires tools outside the repo; story templates are static image-based |
| Google Ads campaign changes | v1.6 docs are complete; Google demoted to phase 2 channel with long-tail only |
| Automated lead notification | Formspree already emails on submission; Meta Lead Form notifications are in Ads Manager |
| Consent record server-side logging | E-Com Act requires 5-year retention; proper solution deferred to v1.8+ |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TRACK-01 | Phase 36 | Complete |
| TRACK-02 | Phase 36 | Complete |
| TRACK-03 | Phase 36 | Complete |
| TRACK-04 | Phase 36 | Complete |
| TRACK-05 | Phase 36 | Complete |
| TRACK-06 | Phase 36 | Complete |
| PRIV-01 | Phase 37 | Pending |
| PRIV-02 | Phase 37 | Pending |
| AD-01 | Phase 38 | Pending |
| AD-02 | Phase 38 | Pending |
| AD-03 | Phase 38 | Pending |
| AD-04 | Phase 38 | Pending |
| CAMP-01 | Phase 39 | Pending |
| CAMP-02 | Phase 39 | Pending |
| CAMP-03 | Phase 39 | Pending |
| CAMP-04 | Phase 39 | Pending |
| CAMP-05 | Phase 39 | Pending |
| CAMP-06 | Phase 39 | Pending |
| CAMP-07 | Phase 39 | Pending |

**Coverage:**
- v1.7 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0

---
*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 after Phase 39 planning (added CAMP-06, CAMP-07)*
