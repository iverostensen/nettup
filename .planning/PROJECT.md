# Nettup.no

## What This Is

Nettup er et norsk fullservice-webyra som bygger nettsider, nettbutikker, webapplikasjoner og AI-integrasjoner for norske bedrifter. Nettsiden er byraets eget utstillingsvindu og primaere salgskanal — med en fullverdig tjenestekatalog, mal-forst priskalkulator, og AI chatbot-radgiver som leder besoekende fra oppdagelse til kontakt.

## Core Value

En potensiell kunde som lander pa siden skal umiddelbart forsta at Nettup leverer moderne nettsider raskt — og at kvaliteten beviser det.

## Requirements

### Validated

- ✓ 5 sider bygget og fungerende (/, /tjenester, /om-oss, /prosjekter, /kontakt) — existing
- ✓ Kontaktskjema fungerer via Formspree — existing
- ✓ Mobilresponsivt design — existing
- ✓ Grunnleggende tilgjengelighet (focus states, reduced motion, semantic HTML) — existing
- ✓ Sitemap, robots.txt, JSON-LD schema — existing
- ✓ OG-bilde konfigurert — existing
- ✓ Definert og konsistent merkevareidentitet (BRAND.md, tone of voice, kontrast-tabell) — v1.0
- ✓ Visuell profil som skiller seg ut — Space Grotesk, design-token-system, gradient hero — v1.0
- ✓ Animasjoner som demonstrerer teknisk kompetanse — HeroIsland spring-sekvens, HeroDeliveryAnimation loop — v1.0
- ✓ SEO-optimalisering for norske smabedrifter — BreadcrumbList, Service-schemas, per-side metadata — v1.0
- ✓ UX/UI-forbedringer som oker konvertering — kontekstuelle CTAer, pre-fill, 44px touch targets — v1.0
- ✓ Tydelig verdiforslag: "rask levering + moderne teknologi" — HeroDeliveryAnimation 14-dagers loop — v1.0
- ✓ Tjenestekatalog med 7 dedikerte undersider — outcome-first innhold, prisintervaller — v1.1
- ✓ services.ts som single source of truth for tjenestemetadata — v1.1
- ✓ /tjenester oversiktsside redesignet som 7-tjeneste katalog — v1.1
- ✓ Service JSON-LD + FAQPage JSON-LD pa alle 7 undersider — v1.1
- ✓ CTA-flyt med ?tjeneste= pre-fill til kontaktskjema — v1.1
- ✓ Mal-forst priskalkulator — 4-fase wizard med innsnevring — v1.1
- ✓ AI chatbot-widget — Claude-drevet radgiver med streaming og lead capture — v1.1
- ✓ Cross-linking mellom relaterte tjenester — v1.1
- ✓ Breadcrumbs og aktiv nav-state pa alle undersider — v1.1

### Active

## Current Milestone: v1.2 Smart Priskalkulator

**Goal:** Erstatte den enkle priskalkulator-wizarden med en dyp, additiv prisestimator som dekker alle 3 tjenester med detaljerte sporsmaal om storrelse, funksjonalitet, integrasjoner og designniva — drevet av en konfigurerbar prisfil.

**Target features:**
- Additiv prismodell: grunnpris + tillegg per feature/integrasjon/storrelse/design
- Dype sporsmaal pa tvers av 4 kategorier (storrelse, features, integrasjoner, designniva)
- Konfigurerbar prisfil (TS/JSON) for enkel oppdatering av priser
- Resultat som prisintervall (min–maks) med linjeoversikt
- Maanedlige kostnader ogsa additive basert pa valg
- Dedikert /priskalkulator-side + seksjon pa /tjenester
- Brukes internt av Nettup for kundeprising

### Deferred

- [ ] Ekte kundeuttalelser — erstatt plassholder-testimonials
- [ ] Flere prosjekter i portefoljen — kun iGive na
- [ ] Google Business Profile for lokal SEO

### Out of Scope

- Blogg/innholdsmarkedsforing — for mye vedlikehold, ikke kjerneprodukt
- Flerspraklig stotte — norsk er primaermarked na
- Ny fargepall — token-system fungerer, kan evalueres ved behov
- Booking-system — ikke relevant for presentasjonsside
- Kundepanel / innlogging — ut av scope for markedsside

## Context

**Current state (post v1.1):** Fullverdig tjenestekatalog med 7 dedikerte undersider, mal-forst priskalkulator, og AI chatbot-radgiver. Komplett konverteringsflyt fra oppdagelse til kontakt.
- **Stack:** Astro 5 + Tailwind 4 + React islands + Framer Motion + Vercel (hybrid)
- **LOC:** ~8,112 TypeScript/TSX/Astro
- **Tier 3 (Expressive):** Animasjoner og React er tillatt — dette er showpiece
- **Malgruppe:** Norske bedrifter — teknisk ukyndige beslutningstakere
- **Posisjonering:** Fullservice-webyra, rask levering, moderne teknologi
- **Konverteringsmal:** Besoekende → riktig tjenesteside → kontaktskjema (eller chatbot)
- **Kompetanse:** Nettsider, nettbutikk (Shopify), webapplikasjoner, SEO, AI-integrasjoner, vedlikehold
- **Known gap:** Testimonials are placeholder — must replace before heavy traffic
- **Known gap:** Shopify platform fee figure and Partner status unverified

## Constraints

- **Sprak:** Norsk (bokmal) — all innhold pa norsk
- **Performance:** LCP < 2s tross animasjoner
- **Accessibility:** `prefers-reduced-motion` ma respekteres
- **Stack:** Ingen nye avhengigheter uten god grunn
- **API keys:** Server-side only (Vercel serverless for chat endpoint)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Merkevareidentitet defineres for visuell implementering | Alt annet folger av brand | ✓ Good — brand doc became Phase 2/3/4 foundation |
| Animasjoner: balanse mellom show-off og presisjon | Demonstrerer kompetanse uten a virke overdrevet | ✓ Good — spring physics + delivery loop landed well |
| Zero new dependencies — use existing Framer Motion deeper | Keeps bundle lean | ✓ Good — useAnimate loop was the right call |
| Design token system in brand.ts → Tailwind config | Single source of truth for visual values | ✓ Good — eliminated all hardcoded animation values |
| Testimonials use placeholder copy | Defer real client testimonials to production ops | ⚠️ Revisit — replace before launch traffic |
| Individual index.astro per service (not [slug].astro) | Services need structurally different sections | ✓ Good — webapp has Prosess, AI has GDPR FAQ |
| services.ts drives overview cards + CTA links only | Not section composition — pages are independent | ✓ Good — clean separation of config vs content |
| ?tjeneste= param replaces ?pakke= for service sub-pages | Better semantics for dedicated service pages | ✓ Good — ContactForm extended cleanly |
| FAQPage JSON-LD co-located in FAQ.astro (not index) | Structured data near the content it describes | ✓ Good — consistent pattern across all 7 pages |
| Goal-first wizard for PrisKalkulator | Users think in goals, not services | ✓ Good — natural flow from need to recommendation |
| Vercel adapter with static + per-route serverless | Only /api/chat needs runtime | ✓ Good — no performance cost to static pages |
| Claude Haiku for chat endpoint | Cost-efficient for conversational UI | ✓ Good — fast responses, low cost |
| In-chat lead capture after 3rd response | Balance engagement vs interruption | ✓ Good — natural conversation timing |
| transition:persist on ChatWidget | Cross-page conversation persistence | ✓ Good — conversations survive navigation |

---
*Last updated: 2026-03-06 after v1.2 milestone start*
