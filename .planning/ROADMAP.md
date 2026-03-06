# Roadmap: Nettup.no

## Milestones

- ✅ **v1.0 Launch** — Phases 1-4 (shipped 2026-03-04)
- ✅ **v1.1 Tjenesteutvidelse** — Phases 6-12 (shipped 2026-03-06)
- 🚧 **v1.2 Smart Priskalkulator** — Phases 13-16 (in progress)

## Phases

<details>
<summary>✅ v1.0 Launch (Phases 1-4) — SHIPPED 2026-03-04</summary>

- [x] Phase 1: Brand Identity (4/4 plans) — completed 2026-03-03
- [x] Phase 2: Animation & Interaction (3/3 plans) — completed 2026-03-03
- [x] Phase 2.1: Hero animation rework — delivery story (2/2 plans) — completed 2026-03-03 (INSERTED)
- [x] Phase 3: SEO & Portfolio (4/4 plans) — completed 2026-03-04
- [x] Phase 4: Conversion Optimization (2/2 plans) — completed 2026-03-04

See archive: `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>✅ v1.1 Tjenesteutvidelse (Phases 6-12) — SHIPPED 2026-03-06</summary>

- [x] Phase 6: Infrastructure (3/3 plans) — completed 2026-03-04
- [x] Phase 7: Tjenesteoversikt (2/2 plans) — completed 2026-03-05
- [x] Phase 8: Core Service Pages (3/3 plans) — completed 2026-03-05
- [x] Phase 9: Specialist Service Pages (5/5 plans) — completed 2026-03-05
- [x] Phase 10: Cross-linking & Validation (2/2 plans) — completed 2026-03-05
- [x] Phase 11: Enhanced Price Calculator (1/1 plan) — completed 2026-03-05
- [x] Phase 12: AI Chatbot Widget (2/2 plans) — completed 2026-03-06

See archive: `.planning/milestones/v1.1-ROADMAP.md`

</details>

### 🚧 v1.2 Smart Priskalkulator (In Progress)

**Milestone Goal:** Erstatte den enkle priskalkulator-wizarden med en dyp, additiv prisestimator drevet av en konfigurerbar prisfil -- med detaljerte sporsmaal, linjeoversikt og prisintervall.

- [x] **Phase 13: Pricing Config and Calculation Engine** - Typed pricing data model and pure additive calculation logic (completed 2026-03-06)
- [x] **Phase 14: Wizard Steps and State** - Multi-step wizard UI with back navigation and selection modes (completed 2026-03-06)
- [x] **Phase 15: Result Display** - Line-item breakdown, discount presentation, and contact CTA (completed 2026-03-06)
- [ ] **Phase 16: Page Integration and Swap** - Dedicated /priskalkulator page, /tjenester embed, old wizard replaced

## Phase Details

### Phase 13: Pricing Config and Calculation Engine
**Goal**: All pricing data lives in a single typed config file and a pure engine computes additive estimates from any set of user selections
**Depends on**: Nothing (first phase of v1.2)
**Requirements**: PRIS-01, PRIS-02, PRIS-04
**Success Criteria** (what must be TRUE):
  1. A TypeScript config file defines base prices, add-on options with prices, and monthly costs for all 3 services (nettside, nettbutikk, webapp)
  2. A pure calculation function accepts a service type and set of selections, returning a min-max estimate with individual line items
  3. Launch discount (40%) is applied correctly to one-time prices in the calculation output
  4. Adding or changing a price requires editing only the config file -- zero UI code changes needed
**Plans:** 2/2 plans complete

Plans:
- [x] 13-01-PLAN.md — Typed pricing config with service data for all 3 services
- [x] 13-02-PLAN.md — Additive calculation engine with TDD

### Phase 14: Wizard Steps and State
**Goal**: Users can walk through a multi-step wizard selecting service type, size, features, integrations, and design level with full back navigation and preserved selections
**Depends on**: Phase 13
**Requirements**: WIZARD-01, WIZARD-02, WIZARD-03, WIZARD-04
**Success Criteria** (what must be TRUE):
  1. User follows a category-based flow: Goal -> Size -> Features -> Integrations -> Design -> Result
  2. User can navigate back to any previous step and all prior selections remain intact
  3. A progress indicator shows the current step and total steps
  4. Features and integrations steps allow multi-select; size and design steps enforce single-select
**Plans:** 2/2 plans complete

Plans:
- [x] 14-01-PLAN.md — Wizard types, state reducer, stepper, and card components
- [x] 14-02-PLAN.md — Step components and SmartPrisKalkulator assembly with animations

### Phase 15: Result Display
**Goal**: Users see a transparent, itemized price estimate with launch discount and a clear path to contact Nettup
**Depends on**: Phase 14
**Requirements**: PRIS-03, RES-01, RES-02, RES-03
**Success Criteria** (what must be TRUE):
  1. Result shows a min-max price range clearly labeled as "estimat" (not a binding quote)
  2. Each selected add-on appears as a line item showing its individual price contribution
  3. Launch discount is displayed as crossed-out original price next to the discounted price
  4. A CTA button links to /kontakt with the selected service type pre-filled via query parameter
**Plans:** 1/1 plans complete

Plans:
- [ ] 15-01-PLAN.md — ResultStep component with line-item breakdown, discount, CTA, and clipboard copy

### Phase 16: Page Integration and Swap
**Goal**: The new calculator is live on a dedicated page and embedded on /tjenester, fully replacing the old wizard
**Depends on**: Phase 15
**Requirements**: PAGE-01, PAGE-02, PAGE-03
**Success Criteria** (what must be TRUE):
  1. /priskalkulator exists as a dedicated page with the full calculator, page metadata, and navigation
  2. The same calculator component is embedded as a section on /tjenester with identical behavior
  3. The old PrisKalkulatorIsland is replaced -- no remnants of the old wizard code remain in production
**Plans**: TBD

Plans:
- [ ] 16-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 13 -> 14 -> 15 -> 16

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Brand Identity | v1.0 | 4/4 | Complete | 2026-03-03 |
| 2. Animation & Interaction | v1.0 | 3/3 | Complete | 2026-03-03 |
| 2.1. Hero animation rework | v1.0 | 2/2 | Complete | 2026-03-03 |
| 3. SEO & Portfolio | v1.0 | 4/4 | Complete | 2026-03-04 |
| 4. Conversion Optimization | v1.0 | 2/2 | Complete | 2026-03-04 |
| 6. Infrastructure | v1.1 | 3/3 | Complete | 2026-03-04 |
| 7. Tjenesteoversikt | v1.1 | 2/2 | Complete | 2026-03-05 |
| 8. Core Service Pages | v1.1 | 3/3 | Complete | 2026-03-05 |
| 9. Specialist Service Pages | v1.1 | 5/5 | Complete | 2026-03-05 |
| 10. Cross-linking & Validation | v1.1 | 2/2 | Complete | 2026-03-05 |
| 11. Enhanced Price Calculator | v1.1 | 1/1 | Complete | 2026-03-05 |
| 12. AI Chatbot Widget | v1.1 | 2/2 | Complete | 2026-03-06 |
| 13. Pricing Config and Calculation Engine | v1.2 | 2/2 | Complete | 2026-03-06 |
| 14. Wizard Steps and State | v1.2 | 2/2 | Complete | 2026-03-06 |
| 15. Result Display | 1/1 | Complete    | 2026-03-06 | - |
| 16. Page Integration and Swap | v1.2 | 0/1 | Not started | - |
