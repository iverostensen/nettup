# Nettup.no

## What This Is

Nettup er et norsk fullservice-webyra som bygger nettsider, nettbutikker, webapplikasjoner og AI-integrasjoner for norske bedrifter. Nettsiden er byraets eget utstillingsvindu og primaere salgskanal — med en fullverdig tjenestekatalog, mal-forst priskalkulator, AI chatbot-radgiver, og skalerbart lokalt SEO-system (8 Tier 1-bysider) som leder besoekende fra oppdagelse til kontakt.

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

- ✓ Additiv priskalkulator med konfigurerbar prisfil og ren kalkulasjonsmotor — v1.2
- ✓ 6-stegs wizard (mål → størrelse → features → integrasjoner → design → resultat) med AnimatePresence-overganger — v1.2
- ✓ Resultatvisning med min/maks prisintervall, lanseringsrabatt, linjeoppstilling og kontakt-CTA — v1.2
- ✓ Dedikert /priskalkulator-side + seksjon på /tjenester, gammel wizard fjernet — v1.2

- ✓ Astro Content Collection for blogg — schema, listeside, artikkelside, komponenter med JSON-LD — v1.3
- ✓ Automatisk innholdsgenerasjonspipeline — topic selection, to-kall Claude-generering, to-trinns kvalitetsport, PR-publisering — v1.3
- ✓ GitHub Actions cron-workflow — Monday 08:00 UTC, PAT-autentisering, exit-0 ved avvisning — v1.3
- ✓ SEO/GEO-optimalisert artikkelmal — Article + FAQPage + BreadcrumbList JSON-LD, seoTitle vs title-mønster — v1.3
- ✓ Redaksjonelle temakonfigurasjoner — 4 clusters (priser, teknologi, smb-tips, lokal-seo) i config.ts — v1.3

- ✓ Dedikerte kasusstudie-sider for iGive og Blom Company via dynamisk `/prosjekter/[slug].astro` — v1.4
- ✓ Utvidet `projects.ts` med slug, techStack, metrics, gallery, testimonialId, metaTitle, metaDescription — v1.4
- ✓ `/prosjekter` redesignet som kortnettverk med lenker til kasusstudie-sider — v1.4
- ✓ `CreativeWork` + `BreadcrumbList` JSON-LD på begge kasusstudie-sider, sitemap-dekning — v1.4
- ✓ GEO-optimalisert norsk kopitekst med verifiserte Lighthouse-scorer og betongtall — v1.4
- ✓ Chat-drevet sidenavigasjon — chatbot kan foreslå sidebytte via navigationChip i chat-tråden — v1.4

- ✓ `locations.ts` TypeScript-interface med V1/V2/V3-klar datamodell (tier, slug, intro, faq, nearbyAreas) + `ACTIVE_TIER`-konstant — v1.5
- ✓ Dynamisk `/steder/[location].astro` via `getStaticPaths()` — 8 Tier 1-bysider generert statisk — v1.5
- ✓ 8 Tier 1-bysider med genuint differensiert håndskrevet innhold (Oslo, Drammen, Asker, Bærum, Lillestrøm, Sandvika, Ski, Moss) — v1.5
- ✓ `Service` JSON-LD med `areaServed` per by + `FAQPage` JSON-LD fra `city.faq` på alle bysider — v1.5
- ✓ Unik `<title>`, `<meta description>`, `og:title`, og canonical URL per by — v1.5
- ✓ Footer "Områder vi dekker"-kolonne + `/kontakt` regional dekningsetning — v1.5
- ✓ Sitemap-dekning bekreftet (8 `/steder/*`-URLer, prioritet 0.8) + V2-promotionkriterier dokumentert — v1.5
- ✓ Plausible Analytics CDN i BaseLayout + LandingPageLayout — cookieless, GDPR-kompatibel — v1.5
- ✓ `analytics.ts` wrapper med 7 typede tracker-funksjoner, alle konverteringshendelser koblet — v1.5
- ✓ FloatingNav rewritet til server-rendert Astro-komponent med `transition:persist` — eliminerer hydration-flash — v1.5

<!-- v2.0 Hub/Cluster Pages — prerequisite: ≥3 articles per cluster -->

- ✓ Consent Mode v2 advanced: gtag loads med denied defaults, updates on consent, 4 consent params -- v1.6
- ✓ subscriptionOffer.ts som single source of truth for abonnementstilbud (0 kr oppstart + 399 kr/mnd) -- v1.6
- ✓ /nettside-for-bedrift/takk konverteringsside med gtag + Plausible dual events + UTM capture -- v1.6
- ✓ Landingsside ombygget: prisforankret hero, 3-felt b2b-skjema, abonnements-FAQ, upsell til /tjenester -- v1.6
- ✓ noindex pa /nettside-for-bedrift for a unnga SEO-kannibalisering med /tjenester/nettside -- v1.6
- ✓ Google Ads kampanjedokumentasjon: sokeordanalyse, 5 RSA-varianter, annonsetillegg, kampanjestruktur -- v1.6
- ✓ 10-stegs Google Ads oppsettguide med konverteringsverifisering og forste-ukes overvakingsplan -- v1.6

### Active

## Current Milestone: v1.7 Multi-Channel Ad Campaign

**Goal:** Ship everything buildable in code for a Facebook/Instagram-led ad campaign: Meta Pixel tracking, ad creative templates, ad copy, multi-channel strategy docs, and audience/targeting specs.

**Target features:**
- Meta Pixel integration with consent-aware loading (extending Consent Mode v2)
- ViewContent + Lead conversion events on landing page and /takk
- UTM expansion (utm_content + utm_term) for Facebook attribution
- 4x static ad image templates (1080x1080) in brand colors
- 2x story/reel templates (1080x1920)
- Custom OG image for /nettside-for-bedrift with price offer
- Facebook ad copy document (all variants with hook/body/CTA)
- Lead form specification (exact fields, thank-you screen)
- Multi-channel strategy doc (Facebook > Google long-tail > TikTok phasing)
- Audience targeting definitions (Business Page admins, job titles, interests)
- A/B testing plan with kill criteria and scaling rules
- Privacy page updated with Meta Pixel disclosure
- Retargeting event infrastructure via pixel events

### Deferred

- [ ] Ekte kundeuttalelser — erstatt plassholder-testimonials
- [ ] Flere prosjekter i portefoljen — kun iGive og Blom Company na
- [ ] Google Business Profile for lokal SEO
- [ ] V2 bysider (30–50 norske byer) — gated på V1 indekseringsbekreftelse i Search Console

### Out of Scope

- Manuell blogg — for mye vedlikehold; erstattet av automatisert pipeline i v1.3
- Flerspraklig stotte — norsk er primaermarked na
- Ny fargepall — token-system fungerer, kan evalueres ved behov
- Booking-system — ikke relevant for presentasjonsside
- Kundepanel / innlogging — ut av scope for markedsside

## Context

**Current state (post v1.6):** Alt fra v1.5 pluss konverteringsoptimalisert landingsside for Google Ads med single-offer abonnement (0 kr oppstart + 399 kr/mnd), Consent Mode v2, dedikert /takk-konverteringsside, og komplett kampanjedokumentasjon klar for lansering.
- **Stack:** Astro 5 + Tailwind 4 + React islands + Framer Motion + Vercel (hybrid) + GitHub Actions + Plausible Analytics + Google Ads (Consent Mode v2) + Meta Pixel (v1.7)
- **LOC:** ~11,100 TypeScript/TSX/Astro (22 React islands, 22+ ruter inkl. 8 bysider)
- **Tier 3 (Expressive):** Animasjoner og React er tillatt — dette er showpiece
- **Malgruppe:** Norske bedrifter — teknisk ukyndige beslutningstakere
- **Posisjonering:** Fullservice-webyra, rask levering, moderne teknologi, lokal tilstedeværelse
- **Konverteringsmal:** Facebook/Instagram Ad → Lead Form (instant) → oppfolging innen 24t | Facebook Ad (retarget) → /nettside-for-bedrift → skjema → /takk | Google Ads (long-tail) → /nettside-for-bedrift → skjema → /takk | Organisk → tjenesteside / byside → kontaktskjema (eller chatbot)
- **Kompetanse:** Nettsider, nettbutikk (Shopify), webapplikasjoner, SEO, AI-integrasjoner, vedlikehold
- **Blog pipeline:** Operasjonell i produksjon — LIX ≤ 55, PAT-mønster for CI-triggering fungerer
- **Analytics:** Plausible (cookieless, GDPR) med 7 Goals aktive. Google Ads Consent Mode v2 (advanced). Vercel Analytics beholdt for Web Vitals.
- **Google Ads:** Kampanjedokumentasjon ferdig (sokeord, annonsekopi, tillegg, struktur, oppsettguide). Lansering venter pa manuell oppsett i Google Ads-konsollen. Konkurranseanalyse viser mettet marked (50+ byraer, 25-40 NOK CPC) — demotert til fase 2-kanal med kun long-tail sokeord.
- **Facebook/Instagram Ads:** v1.7 leverer Meta Pixel, annonsekreativ (4 statiske + 2 story), kopitekst, malgruppespesifikasjoner og flerkanals strategi. Facebook CPC i Norge ~8.50 NOK, 29% under globalt snitt.
- **Known gap:** Testimonials er placeholder — erstatt for tung trafikk
- **Known gap:** Shopify platform fee og Partner-status uverifisert
- **Known gap:** Auto-merge krever GitHub Pro for private repo — manuell merge fungerer
- **Known tech debt:** 6 low-severity items from v1.6 audit (see milestones/v1.6-MILESTONE-AUDIT.md)

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
| Pricing config as single TS file (not JSON) | Type safety + IDE support for pricing data | ✓ Good — types flow through engine and UI without duplication |
| useReducer with downstream reset on goal change | Different services have different option sets | ✓ Good — state stays coherent across goal switches |
| Direction-aware AnimatePresence slide transitions | Polished back/forward navigation feel | ✓ Good — 40px offset gives clear spatial orientation |
| /priskalkulator not in FloatingNav | Tool page, not a top-level site section | ✓ Good — keeps nav focused, page still reachable via CTA |
| Item rows show name only (no per-item prices) | Per-item prices created decision friction, shifted focus from total | ✓ Good — users focus on total estimate, not component costs |
| TDD for calculation engine | Engine is pure function with no UI dependencies — easy to test | ✓ Good — 15 tests caught edge cases before UI was built |
| Two-call Claude pattern for article generation | Single call truncates JSON at ~2000 words | ✓ Good — body then metadata prevents truncation |
| LIX threshold 55 not 45 | Norwegian technical content is compounding language — 45 causes systematic rejections | ✓ Good — pipeline produces approvable articles in production |
| title (H1) vs seoTitle (<title>) as separate schema fields | SEO best practice for blog | ✓ Good — clean pattern across all articles |
| PAT (GH_PAT) for checkout in blog-generate.yml | GITHUB_TOKEN loop-prevention blocks CI on self-created PRs | ✓ Good — PRs trigger CI correctly |
| Exit-0 pattern for pipeline failures | Quality rejections are expected flow, not CI failures | ✓ Good — no false alarm emails |
| Manual .prose-article CSS over @tailwindcss/typography | Avoid new dependency for a single use case | ✓ Good — sufficient for article formatting |
| ASCII-only URL slugs for Norwegian city names (æ→ae, ø→o, å→a) | Display names keep diacritics; slugs must be URL-safe | ✓ Good — established in Phase 24, consistent across all 8 cities |
| `Service` JSON-LD with `areaServed` (not duplicate `LocalBusiness`) | Duplicate `LocalBusiness` blocks dilute Knowledge Graph entity | ✓ Good — `"provider": {"@id": "https://nettup.no/#business"}` pattern is correct |
| `ACTIVE_TIER` constant for tier-gated `getStaticPaths()` | V2 promotion is a one-line change — no structural refactoring | ✓ Good — V2 gated on indexing confirmation per LINK-04 |
| Plausible CDN (cookieless) as analytics layer | GDPR compliance, no consent banner needed | ✓ Good — 7 Goals active; Vercel Analytics kept for Web Vitals |
| `analytics.ts` single-source wrapper for all plausible() calls | All callsites go through named functions; SSR guard + optional chain guard | ✓ Good — adblocker-safe, no throws |
| `trackCityCtaClicked` removed; use `is:inline` IIFE | ES module imports incompatible with `is:inline` scripts in Astro | ✓ Good — inline IIFE fires plausible() directly |
| FloatingNav as Astro component + `transition:persist` | Eliminate React hydration gap that caused raw HTML flash on SPA nav | ✓ Good — human-verified 2026-03-13, zero flash in all 4 browser tests |
| Custom DOM event (`open-mobile-menu`) as cross-boundary trigger | Astro hamburger → React MobileMenu without prop drilling or shared state | ✓ Good — clean boundary, MobileMenu stays React for complex animation |
| Phase 28 runtime verification delegated to human | Visual/timing behaviors (flash, scroll animation, SPA transition) cannot be confirmed by static analysis | ✓ Good — human sign-off is the right gate for perception-dependent requirements |
| Consent Mode v2 advanced: gtag always loads with denied defaults | Recovers ~70% conversion data from non-consenting users via modeled conversions | ✓ Good — legal compliance + maximum data recovery |
| subscriptionOffer.ts replaces launchOffer.ts + pricing.ts | Single offer = single config file; no tier arrays, no package selection | ✓ Good — all sections import from one source |
| Form redirect to /takk instead of inline success | Google-recommended conversion tracking pattern; cleaner attribution | ✓ Good — dual events (gtag + Plausible) fire reliably |
| One service, one campaign: 399 kr/mnd subscription only | Cold ad traffic needs one clear yes/no decision; upsells go to /tjenester | ✓ Good — zero decision friction on landing page |
| 3-phase bidding: Manual CPC → Maximize Clicks → Maximize Conversions | Small-budget strategy; needs data before Smart Bidding works | ✓ Good — documented with transition criteria |
| Price anchoring against "15 000+ kr" competitor reference | Frames 399 kr/mnd as dramatically cheaper than typical one-time cost | ⚠️ Revisit — ad copy references this but landing page does not show it consistently (INT-01) |

---
*Last updated: 2026-03-28 after v1.7 milestone start*
