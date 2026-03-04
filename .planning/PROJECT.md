# Nettup.no

## What This Is

Nettup er et norsk webyrå som bygger profesjonelle nettsider for lokale småbedrifter på 2 uker til fastpris. Nettsiden er byråets eget utstillingsvindu — selve produktet vi selger gjenspeiles i kvaliteten på denne siden. Besøkende skal ha lyst til å ta kontakt etter å ha sett hva vi kan levere.

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

- [ ] Ekte kundeuttalelser — erstatt plassholder-testimonials i `src/config/testimonials.ts`
- [ ] Flere prosjekter i porteføljen — kun iGive nå, mål 3-5 prosjekter
- [ ] Google Business Profile — krav for lokal SEO

### Out of Scope

- Blogg/innholdsmarkedsføring — for mye vedlikehold, ikke kjerneprodukt
- E-handel eller booking — ikke relevant for en presentasjonsside
- Flerspråklig støtte — norsk er primærmarked nå
- Ny fargepall — token-system fungerer med eksisterende farger; kan evalueres ved behov

## Context

**Current state (v1.0):** Site fully launched with brand identity, animation showcase, SEO coverage, and conversion optimization.
- **Stack:** Astro 5 + Tailwind 4 + React islands + Framer Motion
- **LOC:** ~6,136 TypeScript/TSX/Astro
- **Tier 3 (Expressive):** Animasjoner og React er tillatt — dette er showpiece
- **Målgruppe:** Norske lokale småbedrifter som trenger nettside, ikke teknisk innsikt
- **Posisjonering:** Rask levering + genuint moderne teknologi (ikke templates, ikke treg byråprosess)
- **Konverteringsmål:** Besøkende → kontaktskjema
- **Known gap:** Testimonials are placeholder — must replace before production traffic

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

---
*Last updated: 2026-03-04 after v1.0 milestone*
