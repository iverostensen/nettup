# Nettup.no

## What This Is

Nettup er et norsk fullservice-webyrå som bygger nettsider, nettbutikker, webapplikasjoner og AI-integrasjoner for norske bedrifter. Nettsiden er byråets eget utstillingsvindu og primære salgskanal — besøkende skal raskt forstå hva vi tilbyr, finne tjenesten som passer dem, og ta kontakt.

## Core Value

En potensiell kunde som lander på siden skal umiddelbart forstå at Nettup leverer moderne nettsider raskt — og at kvaliteten beviser det.

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
- ✓ SEO-optimalisering for norske småbedrifter — BreadcrumbList, Service-schemas, per-side metadata — v1.0
- ✓ UX/UI-forbedringer som øker konvertering — kontekstuelle CTAer, pre-fill, 44px touch targets — v1.0
- ✓ Tydelig verdiforslag: "rask levering + moderne teknologi" — HeroDeliveryAnimation 14-dagers loop — v1.0

### Active

## Current Milestone: v1.1 Tjenesteutvidelse

**Goal:** Utvide /tjenester til fullverdig tjenestekatalog med dedikerte undersider per tjenestetype, logiske prisintervaller og ikke-teknisk kundefokusert språk.

**Target features:**
- /tjenester oversiktsside redesignet som tjenestekatalog
- Dedikert underside per tjeneste (7 sider)
- Prisintervaller (fra–til) med scope-forklaring per tjeneste
- Norsk, kundefokusert innhold — outcomes, ikke features
- Service JSON-LD schema per tjenesteunderside
- CTA-flyt fra tjenesteside → kontaktskjema med pre-fill

### Active (v1.1)

- [ ] /tjenester oversiktsside som tjenestekatalog med 7 servicekort
- [ ] Dedikert underside: /tjenester/nettside
- [ ] Dedikert underside: /tjenester/landingsside
- [ ] Dedikert underside: /tjenester/nettbutikk (Shopify)
- [ ] Dedikert underside: /tjenester/webapp
- [ ] Dedikert underside: /tjenester/seo
- [ ] Dedikert underside: /tjenester/ai
- [ ] Dedikert underside: /tjenester/vedlikehold
- [ ] Prisintervaller (fra–til) med scope-forklaring på alle tjenester
- [ ] Ikke-teknisk, kundefokusert innhold på alle tjenestesider
- [ ] Service JSON-LD schema per tjenesteunderside
- [ ] CTA-flyt med ?tjeneste= pre-fill til kontaktskjema

### Deferred (post v1.1)

- [ ] Ekte kundeuttalelser — erstatt plassholder-testimonials
- [ ] Flere prosjekter i porteføljen — kun iGive nå
- [ ] Google Business Profile

### Out of Scope

- Blogg/innholdsmarkedsføring — for mye vedlikehold, ikke kjerneprodukt
- Flerspråklig støtte — norsk er primærmarked nå
- Ny fargepall — token-system fungerer, kan evalueres ved behov

## Context

**Current state (v1.1 start):** v1.0 shipped — brand, hero animations, SEO, conversion flow. /tjenester har 3 generiske prisnivåer (Enkel/Standard/Premium). Skal omstruktureres til 7 dedikerte tjenestesider.
- **Stack:** Astro 5 + Tailwind 4 + React islands + Framer Motion
- **LOC:** ~6,136 TypeScript/TSX/Astro
- **Tier 3 (Expressive):** Animasjoner og React er tillatt — dette er showpiece
- **Målgruppe:** Norske bedrifter — teknisk ukyndige beslutningstakere
- **Posisjonering:** Fullservice-webyrå, rask levering, moderne teknologi
- **Konverteringsmål:** Besøkende → riktig tjenesteside → kontaktskjema
- **Kompetanse:** Nettsider, nettbutikk (Shopify), webapplikasjoner, SEO, AI-integrasjoner
- **Known gap:** Testimonials are placeholder — must replace before heavy traffic

## Constraints

- **Språk:** Norsk (bokmål) — all innhold på norsk
- **Performance:** LCP < 2s tross animasjoner
- **Accessibility:** `prefers-reduced-motion` må respekteres
- **Stack:** Ingen nye avhengigheter uten god grunn

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Merkevareidentitet defineres før visuell implementering | Alt annet (farger, animasjoner, copy) følger av brand | ✓ Good — brand doc became Phase 2/3/4 foundation |
| Animasjoner: balanse mellom show-off og presisjon | Demonstrerer kompetanse uten å virke overdrevet | ✓ Good — spring physics + delivery loop landed well |
| Zero new dependencies — use existing Framer Motion deeper | Keeps bundle lean, forces creative use of existing tools | ✓ Good — useAnimate loop was the right call |
| Design token system in brand.ts → Tailwind config | Single source of truth for all visual values | ✓ Good — eliminated all hardcoded animation values |
| useAnimate imperative API for HeroDeliveryAnimation loop | Springs have no fixed duration, break await chains | ✓ Good — reliable 14-step loop with clean unmount |
| Testimonials use placeholder copy with TODO comment | Defer real client testimonials to production ops | ⚠️ Revisit — replace before launch traffic |
| BreadcrumbList computed at build time from Astro.url.pathname | No per-page config required | ✓ Good — zero maintenance, always correct |
| ContactForm pre-fill via ?pakke= URL param | Zero form changes needed, works with existing ContactForm | ✓ Good — CONV-02 shipped with no form rework |

| Service-sider strukturert som undersider av /tjenester | Bedre SEO per tjenstetype, mer plass til dybdeinnhold, logiske brukerreiser | — Pending |
| Prisintervaller (fra–til) fremfor fastpriser | Reflekterer reell prosjektvariasjoner, færre overraskelser for kunde | — Pending |
| Kundefokusert språk — outcomes, ikke features | Primærkundegruppen er teknisk ukyndig, outcomes-framing konverterer bedre | — Pending |

---
*Last updated: 2026-03-04 after v1.1 milestone start*
