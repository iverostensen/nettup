# Requirements: Nettup v1.7 Multi-Channel Ad Campaign

**Defined:** 2026-03-28
**Core Value:** En potensiell kunde som lander pa siden skal umiddelbart forsta at Nettup leverer moderne nettsider raskt -- og at kvaliteten beviser det.

## v1.7 Requirements

Requirements for multi-channel Facebook/Instagram ad campaign infrastructure.

### Tracking Infrastructure

- [ ] **TRACK-01**: Meta Pixel base code loads in LandingPageLayout with `fbq('consent','revoke')` before `fbq('init')`, matching existing gtag denied-defaults pattern
- [ ] **TRACK-02**: Consent banner accept/decline triggers `fbq('consent','grant')` alongside existing `gtag('consent','update')`, sharing single localStorage key
- [ ] **TRACK-03**: Consent banner buttons have equal visual prominence (solid styling for both accept and decline per E-Com Act)
- [ ] **TRACK-04**: `fbq('track','ViewContent')` fires on /nettside-for-bedrift page load (consent-gated)
- [ ] **TRACK-05**: `fbq('track','Lead')` fires on /nettside-for-bedrift/takk page load alongside existing gtag conversion event
- [ ] **TRACK-06**: UTM capture expanded to 5 params (utm_content + utm_term added to existing source/medium/campaign in utm.ts)

### Privacy & Compliance

- [ ] **PRIV-01**: /personvern page updated with Meta Pixel disclosure (data processor, purpose, consent mechanism)
- [ ] **PRIV-02**: Meta Pixel can be disabled via environment variable or config flag without code changes (kill switch)

### Ad Creative

- [ ] **AD-01**: satori + @resvg/resvg-js build pipeline generates PNG images from JSX templates via `npm run generate:ads`
- [ ] **AD-02**: 4x static ad images (1080x1080) generated: Price Drop, Checklist, Social Proof, Question Hook -- brand colors (#020617 bg, #06b6d4 accent), Space Grotesk + Inter fonts
- [ ] **AD-03**: 2x story/reel templates (1080x1920) generated: The Reveal, Before/After
- [ ] **AD-04**: Custom OG image (1200x630) for /nettside-for-bedrift with price offer, replacing generic og-image

### Campaign Documentation

- [ ] **CAMP-01**: Facebook ad copy document with all 4 variants (primary text, headline, description, CTA) in Norwegian
- [ ] **CAMP-02**: Multi-channel strategy doc with phased rollout (Facebook month 1-2, Google long-tail month 2-3, TikTok month 3+), budget allocation, and KPI targets
- [ ] **CAMP-03**: Audience targeting definitions (Business Page admins, job title stack, interest stack) with estimated sizes
- [ ] **CAMP-04**: Lead form specification (exact fields, pre-fill config, qualifying question, thank-you screen copy)
- [ ] **CAMP-05**: A/B testing plan with test matrix, kill criteria (CPL/CPM/frequency thresholds), and scaling rules

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

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TRACK-01 | Pending | Pending |
| TRACK-02 | Pending | Pending |
| TRACK-03 | Pending | Pending |
| TRACK-04 | Pending | Pending |
| TRACK-05 | Pending | Pending |
| TRACK-06 | Pending | Pending |
| PRIV-01 | Pending | Pending |
| PRIV-02 | Pending | Pending |
| AD-01 | Pending | Pending |
| AD-02 | Pending | Pending |
| AD-03 | Pending | Pending |
| AD-04 | Pending | Pending |
| CAMP-01 | Pending | Pending |
| CAMP-02 | Pending | Pending |
| CAMP-03 | Pending | Pending |
| CAMP-04 | Pending | Pending |
| CAMP-05 | Pending | Pending |

**Coverage:**
- v1.7 requirements: 17 total
- Mapped to phases: 0
- Unmapped: 17

---
*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 after initial definition*
