# Requirements: Nettup v1.6

**Defined:** 2026-03-19
**Core Value:** En potensiell kunde som lander pa siden skal umiddelbart forsta at Nettup leverer moderne nettsider raskt -- og at kvaliteten beviser det.

## v1.6 Requirements

Requirements for the Landingsside & Google Ads milestone. Each maps to roadmap phases.

### Tracking

- [ ] **TRACK-01**: Consent Mode v2 upgrade -- load gtag immediately with denied defaults, update on consent (recovers ~70% conversion data)
- [ ] **TRACK-02**: Dedicated `/nettside-for-bedrift/takk` thank-you page fires gtag conversion + Plausible event on page load
- [ ] **TRACK-03**: Form submission redirects to `/takk` instead of inline success state (b2b context only)
- [ ] **TRACK-04**: Landing page has `noindex` meta to prevent SEO cannibalization with `/tjenester/nettside`
- [ ] **TRACK-05**: UTM parameters captured from URL and stored in form submission (source, medium, campaign)

### Landing Page

- [ ] **LP-01**: Single subscription offer as hero: 0 kr oppstart + 399 kr/mnd for 5-siders nettside, anchored against one-time cost
- [ ] **LP-02**: `subscriptionOffer.ts` replaces `launchOffer.ts` + `pricing.ts` as single source of truth for offer details
- [ ] **LP-03**: Reduced form: name, email, phone only (remove pakke, tjeneste, melding fields for b2b context)
- [ ] **LP-04**: Remove fake social proof: static scarcity counter replaced with honest approach, unverifiable 4.9-star rating removed
- [ ] **LP-05**: FAQ rewritten for subscription model (cancellation, ownership, "paying forever" objection, what's included)
- [ ] **LP-06**: Meta title/description updated: "Nettside for Bedrift | 0 kr Oppstart, 399 kr/mnd | Nettup"
- [ ] **LP-07**: WhyUs section updated for subscription value props (ongoing support, no large upfront investment)
- [ ] **LP-08**: PricingSummary rewritten as single primary card + "Trenger du mer?" upsell section for larger services

### Google Ads

- [ ] **ADS-01**: Keyword research file with Norwegian search terms, volumes, and bid suggestions
- [ ] **ADS-02**: 3-5 ad copy variants (headlines + descriptions) matching landing page offer
- [ ] **ADS-03**: Ad extensions prepared: sitelinks, callouts, structured snippets
- [ ] **ADS-04**: Campaign structure document with ad groups, budget recommendations, negative keywords

## Future Requirements

### Post-Launch Optimization

- **OPT-01**: A/B testing via Google Ads Experiments (needs 2-4 weeks baseline data)
- **OPT-02**: Dynamic keyword insertion in landing page headline
- **OPT-03**: Retargeting campaign for visitors who didn't convert

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time scarcity counter (database-backed) | 10 spots can be managed manually; overkill for initial launch |
| Site-wide pricing model change | Subscription is landing-page-only; /tjenester keeps existing pricing |
| Priskalkulator changes | Separate tool, not affected by landing page subscription model |
| Chatbot pricing updates | Chatbot references /tjenester pricing, not landing page offer |
| New testimonials | Requires client outreach; use existing iGive testimonial |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TRACK-01 | Phase 31 | Pending |
| TRACK-02 | Phase 32 | Pending |
| TRACK-03 | Phase 32 | Pending |
| TRACK-04 | Phase 31 | Pending |
| TRACK-05 | Phase 32 | Pending |
| LP-01 | Phase 33 | Pending |
| LP-02 | Phase 32 | Pending |
| LP-03 | Phase 33 | Pending |
| LP-04 | Phase 33 | Pending |
| LP-05 | Phase 33 | Pending |
| LP-06 | Phase 33 | Pending |
| LP-07 | Phase 33 | Pending |
| LP-08 | Phase 33 | Pending |
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
