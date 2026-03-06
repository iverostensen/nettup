# Project Research Summary

**Project:** Nettup v1.2 Smart Priskalkulator
**Domain:** Additive pricing calculator for Norwegian web agency
**Researched:** 2026-03-06
**Confidence:** HIGH

## Executive Summary

The v1.2 milestone replaces the existing 4-phase pricing wizard (goal-first, hardcoded prices, "fra X kr" output) with a config-driven additive pricing calculator. The existing codebase already contains everything needed: React 19, Framer Motion, TypeScript, and established patterns for islands, animation, and service configuration. Zero new dependencies are required. The core technical challenge is not technology selection but data model design -- getting the pricing config structure right determines whether the calculator feels trustworthy to users and maintainable for the team.

The recommended approach is a 4-layer architecture: pricing config (TypeScript file with typed interfaces), pure calculation engine (selections + config = estimate), state management hook (useReducer for multi-step wizard with back navigation), and decomposed UI components (thin island shell + generic question renderer + result breakdown). The existing PrisKalkulatorIsland should be left untouched during development; the new calculator is built alongside it and swapped in only when complete.

The primary risk is decision fatigue killing completion rates. The current wizard works because it asks 2-3 questions and takes under a minute. Moving to 4 categories with multiple options per category could easily reach 10+ questions, causing abandonment. The mitigation is strict: cap at 5-6 questions per service path, use smart defaults, and show a running total for immediate feedback. The secondary risk is the pricing config growing into a complex nested structure with conditional logic -- keep it flat, additive, and per-service.

## Key Findings

### Recommended Stack

No new dependencies. The existing stack (React 19 + Framer Motion + TypeScript) handles everything. The key architectural decisions are internal: use `useReducer` over `useState` for wizard state, use a TypeScript config file over JSON for type safety and computed values, and derive price from state rather than storing it.

**Core technologies (all existing):**
- **React 19 useReducer:** Multi-step wizard state with back navigation, explicit action-based transitions
- **TypeScript config file (`pricing.ts`):** Typed additive pricing data, type-checked at build time, matches existing `services.ts` pattern
- **Framer Motion AnimatePresence:** Step transitions only (not price animations), reusing existing slideVariants and springs
- **Pure calculation functions (`pricing-engine.ts`):** Config + selections = estimate, testable without React, reusable server-side

### Expected Features

**Must have (table stakes):**
- Service type selection (goal-first, existing pattern)
- Price range result (min-max, not a single binding number)
- Line-item breakdown showing what drives the price
- Monthly cost display (separate from one-time, also additive)
- Progress indicator for 5-step flow
- Back navigation without losing selections
- Mobile-first layout (375px tap targets)
- Launch discount display (40% crossed-out pattern)
- CTA to `/kontakt?tjeneste=X`

**Should have (differentiators):**
- Additive pricing model (transparent per-item costs -- rare among Norwegian agencies)
- Config-driven pricing (single source of truth for public calculator and internal quoting)
- Running total updating live as selections change
- Category-based flow (Storrelse, Funksjoner, Integrasjoner, Designniva)
- "Hva er inkludert" descriptions per selection
- "Kopier estimat" button on results

**Defer (v2+):**
- PDF/email summary (requires email infrastructure)
- Preset packages as quick-select shortcuts
- Internal quoting UI beyond the config file itself
- A/B testing calculator vs simple pricing

### Architecture Approach

A 4-layer architecture separating config, calculation, state, and UI. The existing 379-line monolith component becomes a thin orchestrator importing from dedicated sub-modules. Sub-components live in `components/priskalkulator/` (not as separate islands -- they share state within one hydration boundary). The calculator mounts identically on both `/tjenester` and the new `/priskalkulator` page with zero behavior-changing props.

**Major components (9 new files, 2 modified):**
1. **`src/config/pricing.ts`** -- Replaces old Pakke tier model with additive per-service pricing config
2. **`src/lib/pricing-engine.ts`** -- Pure calculation: selections + config = estimate with line items
3. **`src/components/priskalkulator/useWizardState.ts`** -- useReducer hook managing phase, selections, and derived estimate
4. **`src/components/priskalkulator/QuestionStep.tsx`** -- Generic category renderer handling both single-select and multi-select
5. **`src/components/priskalkulator/ResultView.tsx`** -- Line-item breakdown, discount display, CTAs
6. **`src/components/priskalkulator/WizardShell.tsx`** -- AnimatePresence wrapper + visual progress bar
7. **`src/components/priskalkulator/GoalStep.tsx`** -- Service selection (reuses goal-first pattern)
8. **`src/components/islands/PrisKalkulatorIsland.tsx`** -- Rewritten as thin orchestrator (swap only when ready)
9. **`src/pages/priskalkulator/index.astro`** -- Dedicated calculator page

### Critical Pitfalls

1. **Decision fatigue kills completion** -- Cap at 5-6 questions per service. Use smart defaults. Show running total for motivation. Group related choices into single compound questions.
2. **Pricing config becomes a second codebase** -- Flat additive model only (fixed NOK amounts). No conditional logic, no cross-option dependencies. Keep under 150 lines. Separate per service.
3. **Price ranges so wide they're meaningless** -- Target max 2x spread on final range. Use fixed additions per option; range comes from base price only. Line items justify the spread.
4. **State management breaks on back navigation** -- Use useReducer from the start. Store all selections keyed by category. Derive price on every render. Never incrementally update a running total.
5. **Replacing the working wizard too early** -- Build new component with new name alongside existing one. Swap only when complete and tested. One-line change in Astro wrapper.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Pricing Config and Calculation Engine

**Rationale:** Everything depends on the data model. UI cannot be built until the config structure is defined and the calculation engine works. This phase has zero UI and can be fully unit-tested.
**Delivers:** `pricing.ts` config with all 3 services, `pricing-engine.ts` with `calculateEstimate()`, shared `types.ts`
**Addresses:** Config-driven pricing, additive model, line-item breakdown data, monthly cost calculation
**Avoids:** Config complexity (Pitfall 2), wide ranges (Pitfall 3), decision fatigue (Pitfall 1 -- question count is locked here)

### Phase 2: Wizard State and Core UI Components

**Rationale:** With config and engine ready, build the state management and individual step components. Each component can be developed and visually reviewed independently before wiring together.
**Delivers:** `useWizardState` hook, `GoalStep`, `QuestionStep`, `ResultView` components
**Addresses:** Back navigation, multi-select support, running total, line-item result display, launch discount integration
**Avoids:** State management bugs (Pitfall 4), monolith component (Architecture anti-pattern), dual-use paralysis (Pitfall 5 -- customer-first, no internal mode)

### Phase 3: Integration, Polish, and Page Creation

**Rationale:** Wire everything together in `WizardShell` and the island orchestrator. Create the dedicated `/priskalkulator` page. Polish animations and progress indicator. Test on both mount points.
**Delivers:** Complete working calculator on both `/tjenester` and `/priskalkulator`, progress bar, step animations, mobile optimization
**Addresses:** Two-page sharing, progress indicator, mobile layout, animation polish, reduced motion support
**Avoids:** Over-animation (Pitfall 8), two-page drift (Pitfall 6), replacing wizard too early (Pitfall 7 -- swap happens at end of this phase)

### Phase 4: Swap and Cleanup

**Rationale:** Only after the new calculator is complete and tested, swap it into production and remove the old component.
**Delivers:** Live additive calculator replacing old wizard, old component removed
**Addresses:** Production deployment, old code cleanup
**Avoids:** Broken live site during development (Pitfall 7)

### Phase Ordering Rationale

- Config-first because every other layer reads from it. A wrong config schema cascades into UI rework.
- State + components before integration because individual pieces are testable in isolation.
- Integration last because it is mostly wiring, not logic. Problems at this stage are layout/animation issues, not architectural.
- Separate swap phase because the old wizard must remain live until the new one is verified.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Needs careful design of actual pricing numbers per service. The config structure is well-defined but the specific prices, question wording, and option sets require business input from Nettup. This is a content/business decision, not a technical one.

Phases with standard patterns (skip research-phase):
- **Phase 2:** useReducer wizard state is a well-documented React pattern. Sub-component decomposition follows established island architecture.
- **Phase 3:** Framer Motion AnimatePresence with existing patterns. Astro page creation is boilerplate.
- **Phase 4:** One-line component swap. No research needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies. All recommendations verified against existing codebase (React 19.2.3, FM 12.23.26, TS 5). |
| Features | MEDIUM-HIGH | Table stakes well-grounded in competitor analysis (4 Norwegian agencies analyzed). Specific pricing numbers are illustrative, not final. |
| Architecture | HIGH | Directly based on analysis of existing 379-line component, established React patterns, and current Astro island architecture. |
| Pitfalls | HIGH | All pitfalls grounded in existing codebase limitations and well-known multi-step wizard UX patterns. |

**Overall confidence:** HIGH

### Gaps to Address

- **Actual pricing data:** Research provides illustrative prices. Nettup must define real base prices, add-on costs, and category options per service before Phase 1 can produce the final config.
- **Question wording in Norwegian:** The config will contain user-facing Norwegian text. Final copy should be reviewed for tone and clarity with non-technical test users.
- **Multi-select UX on mobile:** The architecture supports multi-select (checkboxes) for Features and Integrations categories. The exact mobile interaction pattern (checkboxes vs toggle buttons vs cards) needs visual design validation during Phase 2.
- **Old Pakke model deprecation:** The existing `pricing.ts` with Enkel/Standard/Premium packages will be replaced. Any other code referencing the old Pakke interface needs to be identified and updated.

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `PrisKalkulatorIsland.tsx`, `services.ts`, `pricing.ts`, `launchOffer.ts`, `animation.ts`, `PrisKalkulator.astro`
- React useReducer documentation (stable API since React 16.8)
- Framer Motion AnimatePresence (already in use in codebase)
- NNGroup wizard design guidelines (under 10 steps, progress indicators, back navigation)

### Secondary (MEDIUM confidence)
- Nettsidelab, WebPluss, Drobak Design, Webaas pricing calculators (Norwegian competitor analysis)
- Shakuro project calculator (international reference for wizard-based pricing)
- Eleken wizard UI pattern guide (progress indicators, mobile optimization)
- CPQ (Configure, Price, Quote) enterprise pattern adapted for consumer use

---
*Research completed: 2026-03-06*
*Ready for roadmap: yes*
