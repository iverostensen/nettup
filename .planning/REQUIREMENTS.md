# Requirements: Nettup v1.6

**Defined:** 2026-03-19
**Updated:** 2026-03-19
**Core Value:** En potensiell kunde som lander pa siden skal umiddelbart forsta at Nettup leverer moderne nettsider raskt -- og at kvaliteten beviser det.

## Strategic Focus

**One service, one campaign.** This landing page sells exactly one thing: a 5-page subscription website (0 kr oppstart + 399 kr/mnd). The entire Google Ads campaign drives traffic to this single offer. There are no tiers, no packages, no choices on this page.

If a visitor needs something bigger (custom website, e-commerce, more pages), the page links them to `/tjenester` -- but the campaign itself is not about those services. They are upsell paths, not campaign targets.

## v1.6 Requirements

Requirements for the Landingsside & Google Ads milestone. Each maps to roadmap phases.

### Tracking

- [x] **TRACK-01**: Consent Mode v2 upgrade -- load gtag immediately with denied defaults, update on consent (recovers ~70% conversion data)
- [x] **TRACK-02**: Dedicated `/nettside-for-bedrift/takk` thank-you page fires gtag conversion + Plausible event on page load
- [x] **TRACK-03**: Form submission redirects to `/takk` instead of inline success state (b2b context only)
- [x] **TRACK-04**: Landing page has `noindex` meta to prevent SEO cannibalization with `/tjenester/nettside`
- [x] **TRACK-05**: UTM parameters captured from URL and stored in form submission (source, medium, campaign)

### Landing Page

- [x] **LP-01**: Single subscription offer as hero: 0 kr oppstart + 399 kr/mnd for 5-siders nettside, anchored against one-time cost -- no tiers, no package selector
- [x] **LP-02**: `subscriptionOffer.ts` replaces `launchOffer.ts` + `pricing.ts` as single source of truth for the one offer (price, features, terms, upsell links)
- [ ] **LP-03**: Reduced form: name, email, phone only (remove pakke, tjeneste, melding fields -- there is only one service to inquire about)
- [x] **LP-04**: Remove fake social proof: static scarcity counter replaced with honest approach, unverifiable 4.9-star rating removed
- [x] **LP-05**: FAQ rewritten for subscription model (cancellation, ownership, "paying forever" objection, what's included)
- [x] **LP-06**: Meta title/description updated: "Nettside for Bedrift | 0 kr Oppstart, 399 kr/mnd | Nettup"
- [x] **LP-07**: WhyUs section updated for subscription value props (ongoing support, no large upfront investment, everything included)
- [x] **LP-08**: PricingSummary replaced with single offer card (not a tier grid) + "Trenger du mer?" upsell section linking to `/tjenester` for custom websites and e-commerce

### Google Ads

- [ ] **ADS-01**: Keyword research targeting one service: "nettside for bedrift", "billig nettside", "nettside pris", "nettside abonnement" with volumes and bid suggestions
- [ ] **ADS-02**: 3-5 ad copy variants -- all focused on the single 399 kr/mnd offer (headlines + descriptions)
- [ ] **ADS-03**: Ad extensions: sitelinks to `/tjenester` subpages as upsell paths, callouts ("0 kr oppstart", "24t respons", "30 dagers garanti")
- [ ] **ADS-04**: Single campaign structure -- one ad group for the subscription offer, budget recommendations, negative keywords to filter non-target traffic

## Future Requirements

### Post-Launch Optimization

- **OPT-01**: A/B testing via Google Ads Experiments (needs 2-4 weeks baseline data)
- **OPT-02**: Dynamic keyword insertion in landing page headline
- **OPT-03**: Retargeting campaign for visitors who didn't convert

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multiple service tiers on landing page | One offer = one decision. Visitors who need more get linked to /tjenester |
| Real-time scarcity counter (database-backed) | 10 spots can be managed manually; overkill for initial launch |
| Site-wide pricing model change | Subscription is landing-page-only; /tjenester keeps existing pricing |
| Priskalkulator changes | Separate tool, not affected by landing page subscription model |
| Chatbot pricing updates | Chatbot references /tjenester pricing, not landing page offer |
| New testimonials | Requires client outreach; use existing iGive testimonial |
| Separate ad groups for custom/e-commerce services | Campaign targets one service only; upsell happens on-page via links |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TRACK-01 | Phase 31 | Complete |
| TRACK-02 | Phase 32 | Complete |
| TRACK-03 | Phase 32 | Complete |
| TRACK-04 | Phase 31 | Complete |
| TRACK-05 | Phase 32 | Complete |
| LP-01 | Phase 33 | Complete |
| LP-02 | Phase 32 | Complete |
| LP-03 | Phase 33 | Pending |
| LP-04 | Phase 33 | Complete |
| LP-05 | Phase 33 | Complete |
| LP-06 | Phase 33 | Complete |
| LP-07 | Phase 33 | Complete |
| LP-08 | Phase 33 | Complete |
| ADS-01 | Phase 34 | Pending |
| ADS-02 | Phase 34 | Pending |
| ADS-03 | Phase 34 | Pending |
| ADS-04 | Phase 34 | Pending |

**Coverage:**
- v1.6 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0

---
*Requirements defined: 2026-03-19*
*Last updated: 2026-03-19 after roadmap creation*
