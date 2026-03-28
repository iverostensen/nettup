# Project Retrospective: Nettup.no

*A living document updated after each milestone. Lessons feed forward into future planning.*

---

## Milestone: v1.0 — Launch

**Shipped:** 2026-03-04
**Phases:** 5 | **Plans:** 15 | **Timeline:** 2 days (2026-03-03 → 2026-03-04)

### What Was Built
- Brand identity system: BRAND.md, design token system (brand.ts → Tailwind), Space Grotesk typography
- Animation showcase: HeroIsland.tsx with orchestrated spring physics, HeroDeliveryAnimation 14-day delivery loop
- SEO coverage: BreadcrumbList, 3× Service schemas, per-page OG metadata and titles across all 5 pages
- Conversion layer: Contextual CTAs on /om-oss and /prosjekter, pricing pre-fill via ?pakke= URL param, WCAG 44px touch targets site-wide
- Testimonials section with typed config (placeholder copy — needs real testimonials before launch)

### What Worked
- **Brand-first sequencing:** Writing BRAND.md in Phase 1 gave Phase 2–4 concrete anchors — tone rules, contrast table, and visual values references (Framer, Resend) were used directly in subsequent phases
- **Token system eliminates drift:** `src/config/brand.ts` → Tailwind pattern meant Phase 4 had zero design inconsistencies to fix — all components already used tokens from Phase 1
- **useAnimate for animation loops:** Choosing imperative API over declarative variants was correct — springs have no fixed duration and would have broken await chains in the delivery loop
- **Human verification checkpoints:** Build-in human visual checkpoints (02.1-02, 04-02) caught real issues that automated checks can't (animation timing, 375px feel)
- **Config-driven data:** `src/config/projects.ts` and `src/config/testimonials.ts` pattern makes content additions zero-code — same pattern as existing `pricing.ts`

### What Was Inefficient
- Phase 02.1 was inserted as an urgent phase mid-milestone — the initial Phase 2 hero plan (stats card) was replaced entirely. Better upfront scoping of what "impressive hero animation" means would have avoided a rework phase
- Testimonials placeholder copy means this feature ships incomplete — should have surfaced this constraint earlier and either left it for v1.1 or built real content into scope

### Patterns Established
- `useAnimate + cancelled flag pattern` for unmount-safe async loops (see HeroDeliveryAnimation.tsx)
- `min-h-11 flex items-center` for inline anchor tap targets (44px WCAG minimum)
- `config/*.ts → Astro section` data flow for all content that might change (projects, testimonials, pricing)
- Brand token classes (`duration-fast`, `rounded-md`, `delay-N`) — never hardcode in component files

### Key Lessons
1. **Define "impressive" concretely before animating.** Phase 2 built a stats card; Phase 2.1 replaced it with a delivery story. Upfront time asking "what feeling should this create?" would save a rework phase.
2. **Content operations are part of feature shipping.** Testimonials shipped technically complete but content-incomplete. Either ship with real content or don't ship the feature — placeholder = tech debt.
3. **The token system is architecture.** Brand.ts is not just config — it's the constraint system that makes all downstream phases consistent without coordination overhead. Establish it first, always.
4. **Astro islands are the right default.** Pure Astro sections for static content, React islands only when animation sequencing is needed. This boundary held cleanly throughout v1.0.

### Cost Observations
- Model: Claude Sonnet 4.6 throughout (quality profile)
- All plans completed in 1–5 min average execution time
- Notable: Phase 02.1 was the most expensive phase (2 plans, but conceptually the heaviest — new animation architecture)

---

## Milestone: v1.1 — Tjenesteutvidelse

**Shipped:** 2026-03-06
**Phases:** 7 | **Plans:** 18 | **Timeline:** 3 days (2026-03-04 → 2026-03-06)

### What Was Built
- Tjenestekatalog: 7 dedikerte undersider under /tjenester med outcome-first innhold, prisintervaller, og JSON-LD (Service + FAQPage)
- services.ts: Single source of truth for tjenestemetadata — slug, priser, included, FAQ, cross-links
- /tjenester oversikt redesignet fra 3-nivaa pristabell til grupperte servicekort
- Mal-forst priskalkulator: 4-fase wizard (mal → anbefaling → innsnevring → resultat) med Framer Motion
- AI chatbot-widget: Claude Haiku-drevet radgiver med SSE streaming, sidebevissthet, og in-chat lead capture via Formspree
- Infrastruktur: ?tjeneste= pre-fill, breadcrumbs, aktiv nav-state, Vercel hybrid adapter

### What Worked
- **services.ts som single source of truth:** Config-drevet moenster fra v1.0 (projects.ts, testimonials.ts) skalerte perfekt — overview cards, JSON-LD, CTA-lenker og cross-links drives alle fra samme config
- **4-seksjons sidemal:** Hero + Inkludert + FAQ + CTA-moensteret ble etablert i Phase 8 og gjenbrukt konsistent gjennom Phase 9 — specialist-sidene gikk pa skinner
- **Parallel phase execution:** Phases 8–9 (tjenestesider) hadde klar avhengighetsstruktur som tillot rask sekvensering
- **Inkrementell infrastruktur:** Phase 6 la grunnlaget (nav, breadcrumbs, contactform) slik at Phase 7+ aldri trengte a endre infrastruktur
- **Goal-first wizard UX:** Brukere tenker i mal ("jeg trenger kunder"), ikke tjenester — wizard-UX konverterer dette naturlig

### What Was Inefficient
- Phase 10 (cross-linking) var planlagt med TBD planer — scope ble klart forst etter Phase 9. Tidligere definisjon ville spart planleggingstid
- Quick tasks (1-4) overlappet delvis med Phase 11 scope — priskalkulator ble bygget inkrementelt via quick tasks for formal fase-planlegging. Fungerte, men dobbelt planlegging
- RelaterteTjenester ble bygget i Phase 10 og fjernet i quick-4 — wasted work. Bedre a evaluere behovet grundigere for building

### Patterns Established
- `services.ts` config-drevet tjenestekatalog — alt fra overview til JSON-LD til chatbot-prompt leser herfra
- 4-seksjons sidemal (Hero + Inkludert + FAQ + CTA) for alle tjenestesider
- FAQPage JSON-LD co-located i FAQ.astro (nyer index.astro) — data naer innholdet det beskriver
- Vercel hybrid rendering: statisk site + per-rute serverless (prerender = false)
- SSE streaming med TextDecoder buffer parsing for chat
- transition:persist for React island state pa tvers av sidenavigasjon

### Key Lessons
1. **Config-drevet arkitektur skalerer.** v1.0 etablerte moensteret, v1.1 beviste det — 7 sider, 1 config-fil. Nye tjenester krever kun et objekt i services.ts + en index.astro.
2. **TBD-planer forsinker.** Phases med "Plans: TBD" krever en ekstra planleggingsrunde nar de starter. Bedre a definere plan-scope under requirements selv om detaljer endres.
3. **Quick tasks og formelle faser bor ikke overlappe.** Enten gjor det som quick task eller som fase — ikke begge. Quick-task #2/#3 bygget priskalkulator som Phase 11 forst formaliserte.
4. **Evaluer "nice to have" features grundig.** RelaterteTjenester ble bygget og fjernet — spar tid ved a sp "trenger brukeren dette?" for implementering.
5. **AI-integrasjon krever hybrid hosting.** Vercel adapter-migrering var smertefri, men ma planlegges fra start om serverless er nodvendig.

### Cost Observations
- Model: Claude Sonnet 4.6 for execution, quality profile
- 18 plans completed in ~3 days
- Notable: Phase 12 (chatbot) var mest kompleks — SSE streaming + React island + lead capture. Phase 8-9 (7 tjenestesider) var mest repetitivt men raskest per plan

---

## Milestone: v1.2 — Smart Priskalkulator

**Shipped:** 2026-03-06
**Phases:** 5 | **Plans:** 7 | **Timeline:** ~10 min (single session, 2026-03-06)

### What Was Built
- Typed pricing config (`src/config/pricing-config.ts`) — 10 typer, komplett prisdata for nettside, nettbutikk, landingsside
- Ren additiv kalkulasjonsmotor (`calculateEstimate()`) med 15 Vitest-tester (TDD-workflow)
- Wizard-infrastruktur: `useReducer` med nedstrøms reset, `WizardStepper`, `SelectableCard`, `GoalCard`
- 5 steg-komponenter + `SmartPrisKalkulator` island med `AnimatePresence` retningsbevisste slide-transitions
- `ResultStep` med kategorisert linjeoppstilling, lanseringsrabatt, månedlig kost, kontakt-CTA, clipboard-kopi
- Dedikert `/priskalkulator`-side + `pageLabels`-oppføring for breadcrumb JSON-LD; gammel `PrisKalkulatorIsland` fjernet
- Phase 16.1 (inserted): Forenklet ResultStep — ingen per-element priser, total som visuelt ankerpunkt

### What Worked
- **Config-first-tilnærming:** Prisfilen ble definert og testet (Phase 13) før noe UI ble bygget — wizard-komponentene importerte ferdig-validerte typer og feilet aldri på prislogikk
- **TDD for kalkulasjonsmotoren:** 15 tester skrevet før implementering fanget edge cases (f.eks. landing page size IDs ≠ standard size IDs) — ingen regresjoner i Phase 14-16
- **Liten tilstandsmaskin:** `useReducer` med nedstrøms reset er kompakt og forutsigbar — back-navigasjon og goal-switch virket feilfritt i Phase 14 verifisering
- **Phase 16.1 som urgent insert:** Problemet ble identifisert etter fase 16, løst umiddelbart som 16.1 i stedet for å leve med det som tech debt — raskere enn å planlegge ny fase

### What Was Inefficient
- Phase 15 success criterion #2 ("each add-on shows individual price contribution") ble raskt snudd i Phase 16.1 — raskere brukeropplevelse ville ha forkortet Phase 15 scope
- Vitest test-infrastruktur hadde ingen eksisterende mal — `vitest.config.ts` med `@/` alias krevde iterasjon

### Patterns Established
- `src/config/pricing-config.ts` — prisdata som single source of truth; aldri hardkod priser i UI
- `src/lib/__tests__/` — test-mappe for pure functions; Vitest med `@/` alias via `vitest.config.ts`
- Wizard reducer pattern: `useReducer` + `GO_TO_STEP` bare bakover — forhindrer hoppet fremover
- Steg-komponent-mønster: mottar `dispatch`-callbacks + relevant state, leser config-data internt
- Resultatvisning: navn-kun item-liste + tydelig total som visuelt fokus (per-item priser er noise)

### Key Lessons
1. **Bygg datakontrakten og test den før UI.** Phase 13 (config + engine med TDD) ga Phase 14-16 stabile fundament — ingen wizard-komponent trengte å reparere prislogikk.
2. **"Success criterion" bør speile brukeropplevelse, ikke teknisk output.** "Viser per-element priser" er teknisk korrekt men UX-feil — formuler kriterier fra brukerens perspektiv.
3. **Hurtig insertion er bedre enn tech debt.** Phase 16.1 tok 3 min å planlegge og utføre. Alternativet var å leve med et forvirrende resultatskjerm til v1.3.
4. **Animasjoner bør defineres som komponist-egenskaper, ikke inline magic numbers.** `40px` x-offset er en beslutning som bor i config, ikke spedd ut i `AnimatePresence`-kode.

### Cost Observations
- Model: Claude Sonnet 4.6, quality profile
- 7 planer fullført på ~10 min total (1–3 min per plan)
- Raskeste milestone til nå — veldefinert domene (priskalkulator), klare faser, og eksisterende infrastruktur

---

## Milestone: v1.3 — Automatisk Blogg

**Shipped:** 2026-03-07
**Phases:** 3 | **Plans:** 5 | **Timeline:** 2 days (2026-03-06 → 2026-03-07)

### What Was Built
- Astro Content Collection for blogg — legacy API schema med 8 felt, `title` (H1) vs `seoTitle` (`<title>`) mønster, `ArticleCard`, `RelatedArticles` med undefined type guard
- `/blogg`-listeside + `/blogg/[slug]`-artikkelside med BlogPosting + FAQPage + BreadcrumbList JSON-LD, footer-lenke, og 3 cross-lenkede seed-artikler
- Genereringspipeline (7 filer): topic selection med kø-logikk, to-kall Claude-generering (~2000 ord), to-trinns kvalitetsport (AI-vurdering + automatiserte sjekker), Octokit PR-publisering
- blog-generate.yml workflow: Monday 08:00 UTC cron + `workflow_dispatch`, PAT-autentisering, exit-0 ved avvisning/feil
- Post-ship iterasjoner: review+revision-løkke, ban på em-dash, SEO/GEO gap-closing, sterkere kvalitetsporter — pipeline produserte 2 ekte artikler i produksjon

### What Worked
- **To-kall Claude-mønster:** Innhold i kall 1, JSON-metadata i kall 2 — eliminerte JSON-avkorting som systematisk sviktet ved ~2000 ord i enkelt-kall
- **LIX ≤ 55 (ikke 45):** Tidlig validering mot norsk faginnhold avdekket at 45 ville avvist nesten alt. Høyere terskel på plass fra dag 1 — ingen tid mistet på systematiske falske avvisninger
- **Exit-0 mønster:** Kvalitetsavvisning er forventet utfall, ikke feil — ingen CI-varslingsepost ved avvisning. Tydelig avgrensning mellom "forventet avvisning" og "systemfeil"
- **Kø-forst-logikk:** Avviste tema persisteres og retryes på neste kjøring — ingen tapt innsats fra delvis generering
- **PAT-mønster for CI-triggering:** GITHUB_TOKEN-loopblokkering er ikke intuitivt — løst ved PAT + GITHUB_TOKEN env override. Mønsteret er nå dokumentert og gjenbrukbart

### What Was Inefficient
- Phase 19 hadde to uventede GitHub Free-begrensninger (branch protection + auto-merge) som krevde workarounds. Disse er plattformspesifikke og vanskelige å oppdage uten å prøve — men en rask sjekk av GitHub-plan-krav i Phase 19-forskning ville avdekket dem
- Post-ship hadde 6 commit-iterasjoner (fix/refactor) for pipeline-bugs og SEO/GEO-hull. De fleste var enkle, men viser at pipeline ikke ble end-to-end testet lokalt med ekte API-kall før deploy. En manuell testkjøring i Phase 18 ville fanget flere av disse

### Patterns Established
- `title` (konversasjonell H1) vs `seoTitle` (søkeord-forst `<title>`-tag) — standardmønster for alle bloggartikler
- To-kall Claude-mønster: kall 1 returnerer innholdet, kall 2 returnerer strukturert JSON — hindrer avkorting på store responser
- `writeJobSummary` + `exit 0` for pipeline-avvisninger — skiller forventet avvisning fra systemfeil
- `import.meta.url + fileURLToPath` for cwd-uavhengige scriptpaths (queue-fil, repo-root)
- PAT-checkout-mønster for CI-triggering når workflow oppretter PRs
- `.prose-article` manuell CSS — tilstrekkelig for artikkelformatering uten ny avhengighet

### Key Lessons
1. **Test end-to-end med ekte API-kall.** 6 post-ship fixar kunne vært fanget i en lokal testkjøring av `npx tsx scripts/blog/index.ts` mot virkelige Claude og GitHub API-er i Phase 18.
2. **Sjekk GitHub plan-begrensninger tidlig.** Branch protection og auto-merge er Pro-features for private repos. 15 min research i Phase 19-planlegging ville avdekket dette og satt riktige forventninger.
3. **Kø-forst-mønsteret er verdifullt.** Å persistere og retrye avviste tema er billig å implementere og hindrer at mislykkede kjøringer kaster bort tidligere innsats. Gjenbruk i fremtidige pipeline-prosjekter.
4. **Separate JSON-metadata fra innholdsgenerering.** Blanding av ~2000 ords markdown og strukturert JSON i ett kall er skjørt. To-kall-mønsteret er det riktige standardvalget for Claude-pipelines med store outputs.
5. **Astro legacy mode er trivielt å sette opp.** `legacy: { collections: true }` + `astro sync` er alt som trengs — dokumentert i STATE.md og ROADMAP. Ikke la Astro 5 Content Layer-endringer skremme fra legacy-bruk der det passer.

### Cost Observations
- Model: Claude Sonnet 4.6 for all execution, quality profile
- 5 plans + 6 post-ship fix commits
- Notable: Selve pipeline-koden (Phase 18, 2 planer) var raskest å skrive (~13 min) men genererte mest post-ship iterasjon — kompleksiteten lå i integrasjonspunktene (Claude API + GitHub API + git), ikke i koden selv

---

## Milestone: v1.4 — Portefølje 2.0

**Shipped:** 2026-03-08
**Phases:** 4 | **Plans:** TBD | **Timeline:** 1 day (2026-03-07 → 2026-03-08)

### What Was Built
- Utvidet `projects.ts` med `slug`, `techStack[]`, `metrics{}`, `gallery[]`, `testimonialId`, `metaTitle`, `metaDescription`, `publishedAt`
- `/prosjekter` redesignet fra inline showcase til kortnettverk med lenker til slug-baserte URLs
- Dynamisk `/prosjekter/[slug].astro` med 10-seksjons kasustudie-layout (sammendrag, utfordring, løsning, teknologi, leveranser, metrics, testimonial, live-lenke)
- Fullverdig kasusstudie for iGive og Blom Company med GEO-optimalisert norsk kopitekst og verifiserte Lighthouse-scorer
- `CreativeWork` + `BreadcrumbList` JSON-LD på begge sider, sitemap-dekning bekreftet
- Chat-drevet sidenavigasjon: chatbot kan foreslå sidebytte via navigationChip i chat-tråden (quick task, levert i v1.4-perioden)

### What Worked
- **Config-driven data skalerte til portefølje:** Samme mønster fra services.ts og projects.ts — ett objekt per prosjekt gir full kasusstudie-side uten nye infrastrukturendringer
- **Dynamisk rute eliminerte kodeduplisering:** `[slug].astro` med `getStaticPaths()` betyr at Blom Company-siden var gratis etter iGive var satt opp
- **GEO-optimalisert kopitekst med betongtall:** Åpningsavsnitt skrevet slik at en AI-assistent kan sitere det uten kontekst — verifiserte Lighthouse-scorer gir troverdighet
- **Chat-navigasjon som quick task:** NavigationChip-funksjonen ble levert raskere som quick task enn som formell fase — riktig vurdering gitt scope

### What Was Inefficient
- Fase-planene ble ikke formelt dokumentert (alle faser merket "Plans: TBD" og fullførte uten PLAN.md-filer) — fungerte, men ingen sporbar plan å referere til i ettertid
- ROADMAP.md-statusen ble ikke oppdatert løpende — alle faser sto som "Not started" selv etter fullføring

### Patterns Established
- `projects.ts` med full kasusstudie-interface — slug, techStack, metrics, gallery, testimonialId, metaTitle, metaDescription
- 10-seksjons kasusstudie-layout som gjenbrukbar mal for fremtidige prosjekter
- `CreativeWork` JSON-LD med `creator: { "@id": "https://nettup.no/#business" }` — ikke re-deklarer Organization-felt inline
- NavigationChip-mønster for chatbot-rute-forslag: tool use → chip i chat → sessionStorage-persistering

### Key Lessons
1. **Oppdater ROADMAP-status løpende.** Alle fire faser ble fullført uten at progress-tabellen ble oppdatert — skapt forvirring ved neste sesjon. Merk "Complete" samme dag som fasen leveres.
2. **Skriv PLAN.md selv for quick-turnaround faser.** "Plans: TBD" gir ingen sporbarhet. Selv en 10-linjers plan er bedre enn ingenting for fremtidig referanse.
3. **Dynamiske ruter betaler seg umiddelbart.** iGive-kasusstudie-arbeidet "betalte" for Blom Company nesten gratis — config-first + dynamisk rute er riktig arkitektur for portefølje-innhold.

### Cost Observations
- Model: Claude Sonnet 4.6, quality profile
- Levert raskt (~1 dag) takket være veletablert config-infrastruktur fra v1.0–v1.3

---

## Milestone: v1.5 — Lokale SEO-sider

**Shipped:** 2026-03-13
**Phases:** 7 (24–30) | **Plans:** 12 | **Timeline:** 5 days (2026-03-08 → 2026-03-13)

### What Was Built
- `locations.ts` TypeScript-interface med V1/V2/V3-klar datamodell + dynamisk `/steder/[location].astro` for 8 Tier 1-bysider
- Håndskrevet, differensiert innhold per by: intro-tekst, by-spesifikt FAQ, nabobyer, metadatavariasjoner
- Lokal SEO-schema: `Service` JSON-LD med `areaServed` + `FAQPage` JSON-LD fra `city.faq` på alle bysider
- Sitemap-dekning bekreftet (8 `/steder/*`-URLer, prioritet 0.8) + V2-promotionkriterier dokumentert
- Plausible Analytics — CDN-script i begge layouts, `analytics.ts` wrapper med 7 Goals, alle konverteringshendelser koblet
- FloatingNav rewritet fra `client:only` React island til server-rendert Astro-komponent med `transition:persist` — eliminerer hydration-flash
- Gap-closure fase (29): FAQPage JSON-LD tilbakelagt + død kode fjernet + Phase 27 VERIFICATION.md produsert
- Traceability-fase (30): ANAL/NAV-krav backfilled i REQUIREMENTS.md + Phase 28 human runtime-verifisering

### What Worked
- **Audit-first workflow:** Milestone-audit avdekket reelle hull (FAQPage JSON-LD manglet, Phase 27 VERIFICATION.md manglet) før arkivering. To dedikerte gap-closure-faser lukket alt — ingen tech debt sluppet gjennom.
- **Human verification checkpoint for perception-avhengige krav:** Phase 28 (FloatingNav flash-eliminering) krevde menneskelig bekreftelse — visuell timing kan ikke bekreftes av statisk analyse. Gaten fungerte: bruker bekreftet alle 4 browser-tester.
- **Tier-gated arkitektur fra dag 1:** `ACTIVE_TIER`-konstant betyr V2 er én linjeskift. Ingen arkitektonisk gjeld.
- **`is:inline` IIFE for city CTA tracking:** Riktig valg da ES module imports er inkompatible med `is:inline`-scripts. Oppdaget og løst i Phase 29 — ikke etter V2-skalering.

### What Was Inefficient
- **Tre separate traceability-/verifikasjonsrunder:** Phase 29 produserte Phase 27 VERIFICATION.md, og Phase 30 backfillet ANAL/NAV i REQUIREMENTS.md. Ideelt hadde dette skjedd løpende under implementeringsfasene — men audit-gaten fanget det.
- **SUMMARY frontmatter har ikke `requirements_completed`-felt:** Alle 12 SUMMARY-filer mangler dette feltet — requirements coverage fastslått via VERIFICATION.md og REQUIREMENTS.md traceability, ikke SUMMARY. Fremtidige milestones bør popuelere dette for full 3-kilde-auditabilitet.

### Patterns Established
- `locations.ts` config med V1/V2/V3 tier-gate — én konstant styrer all statisk generering og schema
- `Service` JSON-LD med `"provider": {"@id": ".../#business"}` (ikke re-deklarer `LocalBusiness` per side)
- `analytics.ts` single-source wrapper: SSR-guard (`typeof window === 'undefined'`) + optional chain (`window.plausible?.()`) for adblocker-sikkerhet
- `is:inline` IIFE for Plausible events i Astro-komponenter (ikke ES-module-import)
- Human verification checkpoint for perception-avhengige krav (flash, timing, animasjon)
- Gap-closure-faser som eksplisitt del av milestonestruktur — ikke skjult tech debt

### Key Lessons
1. **Audit før arkivering avdekker ekte hull.** To gap-closure-faser lukket reelle mangler (FAQPage JSON-LD, VERIFICATION.md) som ikke var synlige fra implementeringsfaser alene. Audit-gaten er verdt kostnaden.
2. **Dokumenter traceability løpende, ikke bare ved audit.** Backfilling 6 krav-rader i Phase 30 var unødvendig overhead — REQUIREMENTS.md bør oppdateres i implementeringsfasen.
3. **`is:inline`-begrensingen i Astro er en skjult felle.** ES module imports fungerer ikke i `is:inline`-scripts. Avklar dette i Phase-planlegging for fremtidige Astro-analytics-integrasjoner.
4. **V2-gate er arkitektur, ikke prosess.** `ACTIVE_TIER`-konstanten og `LINK-04` (promotionkriterier) gjør V2-eskalering forutsigbar og risikofri — dette er riktig å bygge inn i V1.
5. **Cookieless analytics er riktig valg for norsk B2B.** Plausible eliminerte behovet for samtykke-banner — enklere UX og GDPR-kompatibel uten compliance-overhead.

### Cost Observations
- Model: Claude Sonnet 4.6, quality profile
- 7 faser, 12 planer over 5 dager
- Notable: Milestone krevde 7 faser men leverte robust gap-closure + audit-trail. Phase 28 (FloatingNav) var mest teknisk kompleks; Phase 30 var raskest (dokumentasjon og human sign-off).

---

## Milestone: v1.6 — Landingsside & Google Ads

**Shipped:** 2026-03-28
**Phases:** 5 (31-35) | **Plans:** 10 | **Timeline:** 2 days (2026-03-19 → 2026-03-20)

### What Was Built
- Consent Mode v2 advanced: gtag loads with denied defaults, updates on consent, 4 consent params, noIndex on landing page
- subscriptionOffer.ts as single source of truth replacing launchOffer.ts + pricing.ts — one offer, no tiers
- /nettside-for-bedrift/takk thank-you page with dual conversion events (gtag + Plausible) + UTM capture in payloads
- Full landing page rebuild: price-anchored hero, 3-field b2b form, subscription FAQ with JSON-LD, upsell to /tjenester
- Google Ads campaign docs: keyword research (14 primary + 17 negatives), 5 RSA variants, extensions, campaign structure with 3-phase bidding
- 10-step setup guide for Google Ads console with conversion verification and first-week monitoring plan

### What Worked
- **Strict dependency chain:** Tracking → config → content → ad docs → setup guide. Each phase built on verified outputs from the previous one — no rework needed
- **subscriptionOffer.ts as SSOT worked immediately:** Hero, PricingSummary, WhyUs, UpsellSection, and meta tags all imported from one config file — the config-first pattern from v1.0 continues to scale
- **Consent Mode v2 advanced as first phase:** Legal/tracking compliance before any content work prevented the "ship then fix compliance" anti-pattern
- **Ad docs as documentation, not code:** Campaign structure, keywords, and ad copy as .md files in .planning — enables human review and iteration without touching codebase
- **3-phase bidding strategy:** Manual CPC → Maximize Clicks → Maximize Conversions with clear transition criteria gives a small-budget advertiser a concrete plan instead of "use Smart Bidding"

### What Was Inefficient
- **PricingSummary hardcodes prices instead of importing subscriptionOffer.ts fields:** The SSOT pattern was established in Phase 32 but PricingSummary bypassed it in Phase 33 — caught by audit, not by execution
- **Ad copy references non-existent page content:** Description #3 references "Andre tar 15 000+ kr" price anchor, but the rendered landing page does not display this text. Message match table in ad-copy.md is inaccurate
- **trackB2BLead() exported but never imported:** Analytics wrapper function created in Phase 32 but takk.astro fires plausible() directly instead of using it — dead code
- **SUMMARY frontmatter still inconsistent:** 32-02-SUMMARY.md missing TRACK-02 and TRACK-03 from requirements_completed — same issue flagged in v1.5 retro

### Patterns Established
- Consent Mode v2 advanced: denied defaults → consent update → modeled conversions for Google Ads
- redirect-to-/takk conversion pattern: form submit → Formspree 200 → redirect → dual event fire
- UTM sessionStorage capture: captureUtmParams on landing → getUtmParams spread in form payload
- subscriptionOffer.ts for single-product landing pages — price, features, terms, upsellLinks in one export
- Ad campaign documentation as .planning/ markdown files — separates campaign content from codebase
- Message match verification: ad copy ↔ landing page content cross-reference table

### Key Lessons
1. **Verify SSOT compliance in the same phase.** PricingSummary hardcoding prices while subscriptionOffer.ts exists is the exact failure mode SSOT prevents. Phase 33 should have caught this in verification, not the milestone audit.
2. **Ad copy must be written against the rendered page, not assumptions.** Description #3's price anchor does not exist on the live page. Write ad copy last, cross-reference against actual page content.
3. **Dead exports are a code smell.** trackB2BLead() was created "for later" but never used. Either use it immediately or don't create it — Phase 32 should not have shipped it without a consumer.
4. **SUMMARY frontmatter discipline needs enforcement.** Same gap flagged in v1.5. Consider making `requirements_completed` a required field in the summary template.
5. **Two-day milestone execution with 10 plans is achievable.** Strict dependency chains and config-first architecture enabled rapid sequential execution without rework.

### Cost Observations
- Model: Claude Sonnet 4.6, quality profile
- 10 plans in ~25 min total execution (1-3 min per plan)
- Notable: Phase 34 (campaign docs) generated the most planning/doc artifacts but had the simplest execution — writing structured markdown is fast. Phase 33 (content rebuild) was most complex with 3 plans touching 8 Astro sections.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Timeline | Key Change |
|-----------|--------|-------|----------|------------|
| v1.0 | 5 | 15 | 2 days | Established brand-first sequencing and token system pattern |
| v1.1 | 7 | 18 | 3 days | Config-driven service catalog, AI integration, hybrid hosting |
| v1.2 | 5 | 7 | ~10 min | TDD-first engine, wizard reducer pattern, urgent phase insert |
| v1.3 | 3 | 5 | 2 days | Automated blog pipeline, two-call Claude pattern, exit-0 CI discipline |
| v1.4 | 4 | - | 1 day | Dynamic portfolio with slug-based case studies, GEO-optimized copy, chat navigation |
| v1.5 | 7 | 12 | 5 days | Local SEO city pages (8 Tier 1), Plausible Analytics, FloatingNav SSR rewrite, gap-closure audit |
| v1.6 | 5 | 10 | 2 days | Single-offer landing page rebuild, Consent Mode v2, Google Ads campaign docs + setup guide |

### Top Lessons (Verified Across Milestones)

1. **Config-driven data is architecture** — brand.ts (v1.0), services.ts (v1.1), pricing-config.ts (v1.2). Every content domain benefits from a typed config file as single source of truth
2. **Brand identity first** — all visual/copy decisions become easier with concrete anchors (v1.0, reused in v1.1–v1.2)
3. **Content operations are feature work** — don't ship placeholder content without a plan to replace it (testimonials still unresolved)
4. **Define scope before "TBD"** — phases with undefined plan counts cause planning overhead at execution time (v1.1 Phases 8-10)
5. **Don't build features you'll remove** — evaluate user need before implementing (RelaterteTjenester built then removed; per-item pricing shipped then simplified)
6. **Test pure functions before UI** — TDD on calculation engine (v1.2) prevented any pricing bug reaching the wizard UI
7. **Urgent inserts beat tech debt** — Phase 16.1 resolved a UX issue in 3 min rather than carrying it to v1.3
8. **Test integration points end-to-end before shipping** — pipeline code is fast to write; the complexity is in Claude API + GitHub API interactions (v1.3)
9. **Two-call pattern for large Claude outputs** — mixing ~2000-word markdown and structured JSON in one call is fragile; split into content call then metadata call (v1.3)
10. **Check platform plan limitations during research** — GitHub Free blocks branch protection on private repos; discover early to set correct expectations (v1.3)
11. **Verify SSOT compliance in same phase** — creating a config file and then hardcoding values that should come from it defeats the purpose; catch in phase verification, not audit (v1.6)
12. **Write ad copy against rendered page, not assumptions** — message match tables should reference actual DOM content; discrepancies caught late are harder to fix (v1.6)
