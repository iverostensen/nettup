# Requirements: Nettup.no

**Defined:** 2026-03-04
**Core Value:** En potensiell kunde som lander på siden skal umiddelbart forstå at Nettup leverer moderne nettsider raskt — og at kvaliteten beviser det.

## v1.1 Requirements

### Infrastructure

- [x] **INFRA-01**: ContactForm.tsx støtter `?tjeneste=` URL-param pre-fill ved siden av eksisterende `?pakke=`
- [x] **INFRA-02**: FloatingNav og MobileMenu bruker `startsWith` for aktiv-tilstand — fikser ødelagt nav-highlight på alle 7 undersider
- [x] **INFRA-03**: BaseLayout `pageLabels`-map inkluderer alle 7 `/tjenester/[slug]`-ruter for korrekte norske brødsmule-etiketter

### Data Config

- [x] **CONFIG-01**: `src/config/services.ts` opprettet med alle 7 tjenesteobjekter (slug, name, tagline, priceRange, included, faq, ctaParam)
- [x] **CONFIG-02**: Prisintervaller bruker JSON-LD `PriceSpecification` med `minPrice`/`maxPrice` (ikke eksisterende enkelt `price`-felt)

### Service Catalog Overview

- [ ] **OVERVIEW-01**: `/tjenester` redesignet som tjenestekatalog med 7 servicekort
- [ ] **OVERVIEW-02**: Hvert kort viser: tjenestenavn, én setnings outcome, prisintervall og lenke til underside
- [ ] **OVERVIEW-03**: Gammelt 3-nivå-prisavsnitt (Enkel/Standard/Premium) fjernet fra oversiktsside

### Service Sub-Pages

- [ ] **PAGES-01**: `/tjenester/nettside` — dedikert tjenesteside
- [ ] **PAGES-02**: `/tjenester/landingsside` — dedikert tjenesteside
- [ ] **PAGES-03**: `/tjenester/nettbutikk` — dedikert tjenesteside (Shopify)
- [ ] **PAGES-04**: `/tjenester/webapp` — dedikert tjenesteside
- [ ] **PAGES-05**: `/tjenester/seo` — dedikert tjenesteside
- [ ] **PAGES-06**: `/tjenester/ai` — dedikert tjenesteside
- [ ] **PAGES-07**: `/tjenester/vedlikehold` — dedikert tjenesteside

### Content

- [ ] **CONTENT-01**: Hver side har struktur: hero (outcome + prissignal) → hva som er inkludert → FAQ → CTA-seksjon
- [ ] **CONTENT-02**: All copy bruker outcome-first språk — ikke teknisk sjargong i primærsekvenser
- [ ] **CONTENT-03**: Hver side har minimum 500 ord med substansielt innhold (ingen tynne sider)
- [ ] **CONTENT-04**: Nettbutikk-siden adresserer Shopify-plattformavgifter transparent

### SEO & Schema

- [ ] **SEO-01**: Hver underside har `@type: Service` JSON-LD med `PriceSpecification`
- [ ] **SEO-02**: Hver underside har unik meta-tittel og beskrivelse
- [ ] **SEO-03**: FAQPage JSON-LD-schema på hver underside

### Conversion

- [ ] **CTA-01**: Hver tjenesteside CTA lenker til `/kontakt?tjeneste=[slug]`
- [x] **CTA-02**: Kontaktskjema-innsending inkluderer valgt tjeneste i Formspree-data

## v2 Requirements

### Content & Trust

- **TRUST-01**: Ekte kundeuttalelser på relevante tjenestesider
- **TRUST-02**: Flere caseprosjekter i porteføljen (mål: 3–5 totalt)
- **TRUST-03**: Google Business Profile for lokal SEO

### Discovery

- **DISC-01**: FAQ-seksjoner markert opp med FAQPage JSON-LD (for Google-snippets på søk)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blogg/innholdsmarkedsføring | For mye vedlikehold, ikke kjerneprodukt |
| Flerspråklig støtte | Norsk er primærmarked nå |
| Ny fargepall | Token-system fungerer, kan evalueres ved behov |
| Booking-system | Ikke relevant for presentasjonsside |
| Kundepanel / innlogging | Ut av scope for markedsside |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 6 | Complete |
| INFRA-02 | Phase 6 | Complete |
| INFRA-03 | Phase 6 | Complete |
| CONFIG-01 | Phase 6 | Complete |
| CONFIG-02 | Phase 6 | Complete |
| CTA-02 | Phase 6 | Complete |
| OVERVIEW-01 | Phase 7 | Pending |
| OVERVIEW-02 | Phase 7 | Pending |
| OVERVIEW-03 | Phase 7 | Pending |
| PAGES-01 | Phase 8 | Pending |
| PAGES-02 | Phase 8 | Pending |
| PAGES-03 | Phase 8 | Pending |
| CONTENT-01 | Phase 8 | Pending |
| CONTENT-02 | Phase 8 | Pending |
| CONTENT-03 | Phase 8 | Pending |
| CONTENT-04 | Phase 8 | Pending |
| SEO-02 | Phase 8 | Pending |
| CTA-01 | Phase 8 | Pending |
| PAGES-04 | Phase 9 | Pending |
| PAGES-05 | Phase 9 | Pending |
| PAGES-06 | Phase 9 | Pending |
| PAGES-07 | Phase 9 | Pending |
| SEO-01 | Phase 10 | Pending |
| SEO-03 | Phase 10 | Pending |

**Coverage:**
- v1.1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0 ✓

Note: CONTENT-01, CONTENT-02, CONTENT-03, CTA-01, and SEO-02 are assigned to Phase 8 (where they first become verifiable). Phase 9 pages must satisfy the same standards — compliance verified in Phase 10.

---
*Requirements defined: 2026-03-04*
*Last updated: 2026-03-04 — traceability finalized after roadmap creation*
