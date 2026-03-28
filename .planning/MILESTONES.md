# Milestones

## v1.6 Landingsside & Google Ads (Shipped: 2026-03-28)

**Phases completed:** 5 phases (31-35), 10 plans, 18 tasks
**Timeline:** 2 days (2026-03-19 → 2026-03-20)
**Files changed:** 62 files, +7,095 / -514
**Git range:** `98f9ee2` (feat(31-01)) → `392ebe5` (docs(35))

**Delivered:** `/nettside-for-bedrift` ombygget til single-offer abonnementslandingsside (0 kr oppstart + 399 kr/mnd) med Consent Mode v2, konverteringssporing via /takk, og komplett Google Ads kampanjedokumentasjon med oppsettguide -- klar for kampanjelansering.

**Key accomplishments:**
1. Consent Mode v2 advanced: gtag loads with denied defaults, updates on consent, 4 consent params + noIndex on landing page
2. subscriptionOffer.ts som single source of truth + /takk konverteringsside med gtag + Plausible events
3. Full landingsside-ombygging: prisforankret hero, 3-felt b2b-skjema, abonnements-FAQ, upsell til /tjenester
4. Google Ads kampanjedokumentasjon: sokeordanalyse, 5 RSA-varianter, annonsetillegg, kampanjestruktur
5. 10-stegs oppsettguide for Google Ads-konsollen med konverteringsverifisering og overvakingsplan

---

## v1.5 Lokale SEO-sider (Shipped: 2026-03-13)

**Phases completed:** 7 phases (24–30), 12 plans
**Timeline:** 5 days (2026-03-08 → 2026-03-13)
**LOC:** ~10,590 TypeScript/TSX/Astro
**Files changed:** 68 files, +6,837 / -393

**Delivered:** Skalerbart lokalt SEO-system med 8 Tier 1-bysider, Plausible Analytics med 7 Goals, og FloatingNav rewritet til Astro for å eliminere hydration-flash — hele systemet arkitektonisk klart for V2 (30–50 byer) uten strukturelle endringer.

**Key accomplishments:**

1. `locations.ts` TypeScript-interface med V1/V2/V3-klar datamodell + dynamisk `/steder/[location].astro` via `getStaticPaths()`
2. 8 Tier 1-bysider live med håndskrevet, differensiert innhold (Oslo, Drammen, Asker, Bærum, Lillestrøm, Sandvika, Ski, Moss)
3. Full lokal SEO-schema: `Service` + `FAQPage` JSON-LD på alle bysider, `areaServed` i global `LocalBusiness`
4. Plausible Analytics instrumentert — 7 Goals, cookieless, GDPR-kompatibel, alle konverteringshendelser koblet
5. FloatingNav rewritet til server-rendert Astro-komponent med `transition:persist` — null hydration flash
6. Sitemap-dekning bekreftet (8 `/steder/*`-URLer, prioritet 0.8) + V2-promotionkriterier dokumentert

---

## v1.4 Portefølje 2.0 (Shipped: 2026-03-08)

**Phases completed:** 4 phases (20–23)
**Timeline:** 2026-03-07 → 2026-03-08 (1 day)
**LOC:** ~9,900 TypeScript/TSX/Astro
**Git range:** `f2efba3` (docs(phase-20)) → `3f4121b` (feat(seo))
**Files changed:** ~28 files, 2,984 insertions, 301 deletions

**Delivered:** `/prosjekter` transformed from single-page inline showcase into a scalable multi-page portfolio system with slug-based dynamic case study pages, GEO-optimized Norwegian copy, and full structured data coverage.

**Key accomplishments:**

1. Extended `projects.ts` interface — `slug`, `techStack[]`, `metrics{}`, `gallery[]`, `testimonialId`, `metaTitle`, `metaDescription`, `publishedAt`
2. `/prosjekter` redesigned as card grid linking to `/prosjekter/[slug]` — both projects as equal peers
3. Dynamic `[slug].astro` with 10-section case study layout (summary, challenge, solution, tech stack, features, metrics, testimonial, live link)
4. Full case studies for iGive and Blom Company with verified Lighthouse scores and GEO-optimized opening paragraphs
5. `CreativeWork` + `BreadcrumbList` JSON-LD on both pages; sitemap coverage confirmed
6. Chat-driven navigation (quick task): chatbot can suggest page changes via navigationChip in chat thread with sessionStorage persistence

---

## v1.3 Automatisk Blogg (Shipped: 2026-03-07)

**Phases completed:** 3 phases (17–19), 5 plans
**Timeline:** 2026-03-06 → 2026-03-07
**LOC:** ~10,643 TypeScript/TSX/Astro
**Git range:** `e44c037` (feat(17-01)) → `0758dea` (fix(blogg))
**Files changed:** 46 files, 7,546 insertions, 208 deletions

**Delivered:** Fullautomatisert SEO-blogg — Astro Content Collections for `/blogg`, to-trinns Claude-drevet genereringspipeline med kvalitetsport, og Monday 08:00 UTC GitHub Actions cron som produserer norske fagartikler og publiserer via PR uten manuell innsats.

**Key accomplishments:**

1. Astro Content Collection for blogg — Legacy API schema med 8 felt, `title` (H1) vs `seoTitle` (`<title>`) mønster, `ArticleCard` og `RelatedArticles` med TypeScript type guards
2. `/blogg`-listeside og `/blogg/[slug]`-artikkelside med BlogPosting + FAQPage + BreadcrumbList JSON-LD og 3 seed-artikler med kryss-referanser
3. Genereringspipeline — to-kall Claude-mønster (innhold, deretter metadata) for ~2000-ords norske fagartikler, LIX ≤ 55-terskel, kø-forst-logikk for feiltema
4. To-trinns kvalitetsport — AI-vurdering (6 kriterier, snitt ≥ 7) + automatiske sjekker (ordtelling, LIX, FAQ-seksjon, Nettup-omtaler ≤ 2); exit 0 ved avvisning
5. GitHub PR-basert publiseringsflyt — `blogg/*`-grener, Octokit PR med kvalitetsscore i PR-body; ingen direkte commits til main
6. blog-generate.yml — Monday 08:00 UTC cron + `workflow_dispatch`, PAT-autentisering, post-ship iterasjoner (review+revision-løkke, SEO/GEO-hull, em-dash-forbud); pipeline produserte 2 ekte artikler

**Known gaps:**

- CI-04 (auto-merge): Branch protection + auto-merge krever GitHub Pro for private repos. Workflow-filen er klar — aktiveres ved oppgradering til Pro eller offentlig repo. Manuell merge fungerer frem til da.

---

## v1.2 Smart Priskalkulator (Shipped: 2026-03-06)

**Phases completed:** 5 phases (13–16.1), 7 plans
**Timeline:** 2026-03-06 (single session — ~10 min execution)
**LOC:** ~9,217 TypeScript/TSX/Astro
**Git range:** `a245256` (feat(13-01)) → `2ebfff6` (feat(wizard))
**Files changed:** 49 files, 5,291 insertions, 488 deletions

**Delivered:** Mål-først priskalkulator erstattet med fullverdig additiv prisestimator — konfigurerbar prisfil, 6-stegs wizard med AnimatePresence-overganger, transparent linjeoppstilling og dedikert /priskalkulator-side.

**Key accomplishments:**

1. Typing system + pricing config (`src/config/pricing-config.ts`) — 10 eksporterte typer og komplett prisdata for 3 tjenester (nettside, nettbutikk, landingsside)
2. Ren additiv kalkulasjonsmotor med 15 TDD-tester — `calculateEstimate()` håndterer grunnpris, tillegg, 40% lanseringsrabatt og min/maks-intervall
3. Wizard-infrastruktur — `useReducer` med nedstrøms reset, `WizardStepper`, `SelectableCard`, `GoalCard`
4. 5 steg-komponenter + `SmartPrisKalkulator` island med `AnimatePresence` retningsbevisste slideoverganger (enkel-valg auto-advance, flervalg med Neste)
5. `ResultStep` med kategorisert linjeoppstilling, rabatt med strikethrough, månedlig kostnad, kontakt-CTA med query params, og clipboard-kopi
6. Dedikert `/priskalkulator`-side live — breadcrumb JSON-LD, gammel wizard fjernet, null dead code

---

## v1.1 Tjenesteutvidelse (Shipped: 2026-03-06)

**Phases completed:** 7 phases (6–12), 18 plans
**Timeline:** 2026-03-04 → 2026-03-06 (3 days)
**LOC:** ~8,112 TypeScript/TSX/Astro
**Git range:** 134 commits

**Delivered:** /tjenester utvidet fra generisk 3-nivå pristabell til fullverdig tjenestekatalog med 7 dedikerte undersider, mål-først priskalkulator, og AI chatbot-widget — komplett konverteringsløp fra oppdagelse til kontakt.

**Key accomplishments:**

1. Tjenestekatalog med 7 dedikerte undersider — outcome-first innhold med prisintervaller og JSON-LD Service + FAQPage schema
2. services.ts som single source of truth for all tjenestemetadata, cross-linking og prisdata
3. Mål-først priskalkulator — 4-fase wizard (mål → anbefaling → innsnevring → resultat) med Framer Motion
4. AI chatbot-widget — Claude-drevet tjenersterådgiver med SSE streaming, sidebevissthet og in-chat lead capture
5. Infrastruktur — ?tjeneste= pre-fill, breadcrumbs, aktiv nav-state på undersider
6. Cross-linking med relaterte tjenester og validert strukturert data på alle sider

---

## v1.0 Launch (Shipped: 2026-03-04)

**Phases completed:** 5 phases (1, 2, 2.1, 3, 4), 15 plans
**Timeline:** 2026-03-03 → 2026-03-04 (2 days)
**LOC:** ~6,136 TypeScript/TSX/Astro
**Git range:** `4a138fe` (feat(01-01)) → `e162a50` (refactor(ui))

**Delivered:** Nettup.no transformed from competent but generic to a polished showcase demonstrating brand identity, technical animation capability, full SEO coverage, and optimized conversion flows.

**Key accomplishments:**

1. Brand personality document written — mission statement, tone of voice rules, contrast table in Norwegian establishing Nettup's identity
2. Design token system (`src/config/brand.ts` → Tailwind) + animation preset library (`src/lib/animation.ts`) eliminating all hardcoded values
3. HeroIsland.tsx with orchestrated Framer Motion spring sequence replaces static hero — demonstrates technical capability on first load
4. HeroDeliveryAnimation — cinematic 14-day delivery story loop makes Nettup's 2-week promise visceral
5. Full SEO suite: BreadcrumbList, 3× Service schemas, per-page OG metadata and unique titles/descriptions across all 5 pages
6. Testimonials section, contextual CTAs on all pages, pricing pre-fill wiring, and WCAG 44px touch targets site-wide

---
