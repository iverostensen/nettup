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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Timeline | Key Change |
|-----------|--------|-------|----------|------------|
| v1.0 | 5 | 15 | 2 days | Established brand-first sequencing and token system pattern |
| v1.1 | 7 | 18 | 3 days | Config-driven service catalog, AI integration, hybrid hosting |
| v1.2 | 5 | 7 | ~10 min | TDD-first engine, wizard reducer pattern, urgent phase insert |

### Top Lessons (Verified Across Milestones)

1. **Config-driven data is architecture** — brand.ts (v1.0), services.ts (v1.1), pricing-config.ts (v1.2). Every content domain benefits from a typed config file as single source of truth
2. **Brand identity first** — all visual/copy decisions become easier with concrete anchors (v1.0, reused in v1.1–v1.2)
3. **Content operations are feature work** — don't ship placeholder content without a plan to replace it (testimonials still unresolved)
4. **Define scope before "TBD"** — phases with undefined plan counts cause planning overhead at execution time (v1.1 Phases 8-10)
5. **Don't build features you'll remove** — evaluate user need before implementing (RelaterteTjenester built then removed; per-item pricing shipped then simplified)
6. **Test pure functions before UI** — TDD on calculation engine (v1.2) prevented any pricing bug reaching the wizard UI
7. **Urgent inserts beat tech debt** — Phase 16.1 resolved a UX issue in 3 min rather than carrying it to v1.3
