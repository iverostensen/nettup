# Architecture: Smart Additive Price Calculator (v1.2)

**Domain:** Multi-step additive pricing wizard for web agency services
**Researched:** 2026-03-06
**Confidence:** HIGH (based on direct analysis of existing codebase -- all decisions grounded in current patterns)

## Current State Analysis

The existing `PrisKalkulatorIsland.tsx` is a **single 379-line React component** with:
- Hardcoded questions and prices inline (not config-driven)
- Simple linear flow: goal -> recommend -> narrow (2-3 questions) -> result
- Pricing logic embedded in the last narrowing option's `priceEstimate` string
- State managed via single `useState<State>` with phase/step tracking
- No calculation engine -- the price is a static string on the final option

**What works well and must be preserved:**
- AnimatePresence slide transitions with `springs.gentle` from `lib/animation.ts`
- `useReducedMotion` accessibility support
- Integration pattern: Astro Section wraps `<PrisKalkulatorIsland client:visible />`
- Connection to `services.ts` for service metadata (name, tagline, CTA param)
- CTA flow linking to `/kontakt?tjeneste=`
- Card-style UI with `bg-surface-raised`, `border-white/10`, hover states

**What must change:**
- Questions and options must come from config, not hardcoded arrays
- Pricing must be computed additively (base + sum of adjustments), not stored as a string on the final option
- Result must show a line-item breakdown with min-max range
- Monthly costs must also be additive
- More question categories (4 vs current 2-3)
- Back navigation needed (users currently can only go forward or reset)
- Component must work both embedded on /tjenester and standalone on /priskalkulator

**Existing config files that change:**
- `src/config/pricing.ts` -- currently defines old `Pakke` interface (Enkel/Standard/Premium tiers). Will be **replaced** with additive pricing config. The Pakke model is no longer used anywhere meaningful.

## Recommended Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Config Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ pricing.ts   │  │ services.ts  │  │launchOffer.ts│  │
│  │ (REPLACE)    │  │ (unchanged)  │  │ (unchanged)  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │           │
├─────────┴─────────────────┴──────────────────┴──────────┤
│                  Calculation Layer                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │ lib/pricing-engine.ts (NEW)                      │   │
│  │ Pure functions: selections + config → estimate   │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                                │
├─────────────────────────┴───────────────────────────────┤
│                    State Layer                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │ priskalkulator/useWizardState.ts (NEW)           │   │
│  │ useReducer: actions → state transitions          │   │
│  │ Derives estimate on every selection change       │   │
│  └──────────────────────┬───────────────────────────┘   │
│                         │                                │
├─────────────────────────┴───────────────────────────────┤
│                    UI Layer                               │
│  ┌─────────────────────────────────────────────────────┐│
│  │ PrisKalkulatorIsland.tsx (REWRITE — thin shell)    ││
│  │   ├── WizardShell.tsx (progress + AnimatePresence) ││
│  │   ├── GoalStep.tsx (service selection)             ││
│  │   ├── QuestionStep.tsx (generic category renderer) ││
│  │   └── ResultView.tsx (line-item breakdown + CTA)   ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
├──────────────────────────────────────────────────────────┤
│                   Mount Points                            │
│  ┌────────────────────┐  ┌─────────────────────────┐    │
│  │/tjenester (section)│  │/priskalkulator (page)   │    │
│  │ client:visible     │  │ client:visible          │    │
│  └────────────────────┘  └─────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### Component Decomposition

```
src/
├── config/
│   └── pricing.ts              ← REPLACE: Additive pricing config
│                                  (replaces old Pakke tier model)
├── lib/
│   └── pricing-engine.ts       ← NEW: Pure calculation functions
│                                  No React, no UI — just math
├── components/
│   ├── islands/
│   │   └── PrisKalkulatorIsland.tsx  ← REWRITE: Thin orchestrator
│   │
│   └── priskalkulator/         ← NEW: Sub-components (not islands)
│       ├── types.ts             ← Shared TypeScript types
│       ├── useWizardState.ts    ← Custom hook with useReducer
│       ├── WizardShell.tsx      ← AnimatePresence + progress bar
│       ├── GoalStep.tsx         ← Service selection (3 cards)
│       ├── QuestionStep.tsx     ← Renders any question category
│       └── ResultView.tsx       ← Line-item breakdown + CTAs
│
└── pages/
    ├── priskalkulator/
    │   └── index.astro          ← NEW: Dedicated calculator page
    └── tjenester/
        └── _sections/
            └── PrisKalkulator.astro  ← MINOR UPDATE: subtitle text
```

**Why this decomposition:**
- The current 379-line monolith will grow to 800+ with 4 question categories, multi-select, back navigation, and a line-item result. Splitting is necessary.
- Sub-components go in `components/priskalkulator/` (not `islands/`) because they are not independently hydrated -- only the top-level island is the hydration boundary.
- `pricing-engine.ts` as a pure module enables: (a) unit testing without React, (b) internal use by Nettup for quoting, (c) potential server-side reuse.
- `useWizardState` hook separates state logic from rendering.

### Component Responsibilities

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `pricing.ts` (config) | All prices, questions, options, adjustments | Read by useWizardState |
| `pricing-engine.ts` (lib) | Pure calculation: config + selections -> estimate | Called by useWizardState |
| `useWizardState.ts` (hook) | State machine via useReducer, derives estimate | Drives all sub-components |
| `PrisKalkulatorIsland.tsx` | Top-level island, hydration boundary, mode prop | Mounts WizardShell with hook |
| `WizardShell.tsx` | AnimatePresence wrapper, progress indicator | Renders current step component |
| `GoalStep.tsx` | Service selection UI (3 goal cards) | Dispatches SELECT_SERVICE |
| `QuestionStep.tsx` | Renders any question category (single or multi) | Dispatches SELECT/DESELECT_OPTION |
| `ResultView.tsx` | Line-item breakdown, price range, CTAs | Reads estimate from hook |
| `services.ts` (existing) | Service metadata (name, tagline, slug) | Read by GoalStep + ResultView |
| `launchOffer.ts` (existing) | Remaining launch slots | Read by ResultView for urgency |

## Pricing Config Structure

Replace the current `pricing.ts` (Pakke interface) with a service-centric additive model:

```typescript
// src/config/pricing.ts

type ServiceSlug = 'nettside' | 'nettbutikk' | 'landingsside';

interface PricingConfig {
  services: Record<ServiceSlug, ServicePricing>;
  launchDiscount: number; // 0.4 = 40%
}

interface ServicePricing {
  basePriceRange: { min: number; max: number };
  baseMonthly: number;
  categories: QuestionCategory[];
}

interface QuestionCategory {
  id: string;              // 'size' | 'features' | 'integrations' | 'design'
  label: string;           // Norwegian display name for progress bar
  question: string;        // The question text shown to user
  type: 'single' | 'multi'; // Single-select (radio) or multi-select (checkbox)
  options: PricingOption[];
}

interface PricingOption {
  id: string;
  label: string;
  description?: string;     // Optional sub-label
  priceAdjustment: { min: number; max: number }; // Added to running total
  monthlyAdjustment?: number;                     // Added to base monthly
}
```

**Why this structure:**
- `basePriceRange` with min/max produces range estimates from the start
- Each option's `priceAdjustment` is also a range -- these naturally sum to a final min-max
- `monthlyAdjustment` is optional because not all choices affect monthly cost
- `type: 'multi'` allows features/integrations to be multi-select (checkboxes) while size/design remain single-select
- Categories are ordered in the array -- the wizard renders them in sequence
- Plain TypeScript object -- update prices by editing one file, no component changes

**Why NOT multipliers:** For 3 services with 4 categories, additive adjustments are simpler, more transparent to users ("CMS adds 3000-5000 kr"), and easier to maintain. A multiplier system adds complexity without benefit when prices are already min-max ranges. If a future service needs multiplicative pricing, add an optional `multiplier` field to PricingOption later -- the engine can handle it then.

## Calculation Engine

```typescript
// src/lib/pricing-engine.ts

interface PriceEstimate {
  oneTime: { min: number; max: number };
  monthly: number;
  lineItems: LineItem[];
  discountedOneTime: { min: number; max: number };
}

interface LineItem {
  category: string;       // Category label (Norwegian)
  selection: string;      // Selected option label(s)
  priceRange: { min: number; max: number };
  monthlyAdd: number;
}

function calculateEstimate(
  serviceConfig: ServicePricing,
  selections: Map<string, string[]>,  // categoryId -> selected optionId(s)
  discount: number
): PriceEstimate {
  // 1. Start with base price range
  // 2. For each category with selections, sum adjustments
  // 3. Multi-select: sum all selected options' adjustments
  // 4. Single-select: use the one selected option's adjustment
  // 5. Apply discount to one-time total
  // 6. Return estimate with line items for breakdown display
}
```

**Design decisions:**
- Pure function, no side effects -- takes config + selections, returns estimate
- Returns `lineItems` so ResultView can show exactly what the user chose and what each costs
- Handles both single-select and multi-select (multi = sum all selected adjustments)
- Discount applied as a separate step, keeping pre-discount visible for price anchoring

## State Management

Use `useReducer` instead of the current `useState`:

```typescript
// src/components/priskalkulator/useWizardState.ts

type WizardPhase = 'goal' | 'questions' | 'result';

interface WizardState {
  phase: WizardPhase;
  selectedService: ServiceSlug | null;
  currentCategoryIndex: number;
  selections: Map<string, string[]>;  // categoryId -> optionId(s)
  estimate: PriceEstimate | null;
  direction: 1 | -1;                  // For animation direction
}

type WizardAction =
  | { type: 'SELECT_SERVICE'; service: ServiceSlug }
  | { type: 'SELECT_OPTION'; categoryId: string; optionId: string; multi: boolean }
  | { type: 'DESELECT_OPTION'; categoryId: string; optionId: string }
  | { type: 'NEXT_CATEGORY' }
  | { type: 'PREV_CATEGORY' }
  | { type: 'GO_BACK' }              // Navigate to previous step
  | { type: 'RESET' };

function useWizardState(config: PricingConfig) {
  // Reducer recalculates estimate on every selection change
  // Derives current question from config + currentCategoryIndex
  // Exposes: state, dispatch, currentCategory, totalCategories, canGoBack
}
```

**Why useReducer over useState:**
- Current code already has implicit state machine logic spread across 4 handler functions
- With 4 categories, multi-select, and back navigation, state transitions get complex enough that a reducer prevents stale-state bugs
- Actions are dispatchable from any sub-component without prop drilling multiple callbacks
- The `GO_BACK` action is trivial in a reducer (decrement index, set direction = -1) but messy with useState

**Why NOT external state management (Zustand, Context, etc.):**
- The calculator is a single React island. No state crosses the island boundary.
- React Context would be overkill for one component tree of 5 components.
- Adding a state library dependency violates the "no new deps without good reason" constraint.

## Sharing Between Pages

The component is already sharable via the existing React island pattern. Same component, two mount points:

**On /tjenester (embedded section) -- existing pattern, minimal change:**
```astro
<!-- src/pages/tjenester/_sections/PrisKalkulator.astro -->
<Section>
  <SectionHeader
    title="Hva koster det?"
    subtitle="Velg tjeneste og svar paa noen sporsmal — sa far du et prisestimat."
  />
  <PrisKalkulatorIsland client:visible />
</Section>
```

**On /priskalkulator (dedicated page) -- NEW:**
```astro
<!-- src/pages/priskalkulator/index.astro -->
<BaseLayout
  title="Priskalkulator | Nettup"
  description="Fa et prisestimat for nettside, nettbutikk eller landingsside."
>
  <main>
    <Section>
      <SectionHeader
        title="Priskalkulator"
        subtitle="Svar paa noen sporsmal og fa et detaljert prisestimat — tar under to minutter."
      />
      <PrisKalkulatorIsland client:visible mode="full" />
    </Section>
  </main>
</BaseLayout>
```

**Differences between contexts via `mode` prop:**
- `mode="compact"` (default, /tjenester): `max-w-2xl`, streamlined layout
- `mode="full"` (/priskalkulator): `max-w-3xl`, wider result breakdown, optional sticky progress sidebar on large screens
- One component, one codebase -- the `mode` prop controls minor layout variations
- No need for separate components or complex conditional rendering

## Progress Indicator

The current wizard shows "Sporsmaal X av Y" as plain text. The new version needs a visual progress bar because 4+ categories need orientation:

```
[Mal] --- [Storrelse] --- [Funksjoner] --- [Integrasjoner] --- [Design] --- [Resultat]
  ●          ●               ●                  ○                ○             ○
```

Implementation in `WizardShell.tsx`:
- Completed steps: `text-brand` dot
- Current step: `bg-brand` filled dot with label
- Upcoming steps: `border-white/10` empty dot
- Connecting lines: `bg-white/10` (completed: `bg-brand/40`)
- On mobile (< 640px): show only "Steg X av Y" text (dots too cramped)

## Data Flow

```
pricing.ts (config)
    |
    v
useWizardState (hook)
    |  - Reads config to get categories for selected service
    |  - Tracks selections per category via useReducer
    |  - Calls pricing-engine.calculateEstimate on each change
    |  - Exposes: state, dispatch, derived values
    |
    |--- GoalStep
    |       User selects service -> dispatch SELECT_SERVICE
    |       -> phase becomes 'questions', categoryIndex = 0
    |
    |--- QuestionStep (rendered for each category in sequence)
    |       User selects option(s) -> dispatch SELECT_OPTION
    |       User clicks "Neste" -> dispatch NEXT_CATEGORY
    |       User clicks "Tilbake" -> dispatch PREV_CATEGORY / GO_BACK
    |       -> categoryIndex increments/decrements
    |       -> estimate recalculated after each selection
    |
    |--- ResultView
    |       Reads estimate.lineItems for breakdown table
    |       Reads estimate.discountedOneTime for headline price
    |       Reads estimate.monthly for monthly cost
    |       Shows "Kom i gang" -> /kontakt?tjeneste=[slug]
    |       Shows "Start pa nytt" -> dispatch RESET
    |
    v
WizardShell wraps everything in AnimatePresence
    - key = phase + categoryIndex
    - direction from state drives slide animation direction
    - Progress bar reads currentCategoryIndex + totalCategories
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Monolith Component
**What:** Putting all 4 question categories, calculation logic, and result display in one file.
**Why bad:** Current 379-line component is at the maintainability edge. Adding 4 categories with multi-select, back navigation, progress bar, and line-item results would push it to 1000+ lines.
**Instead:** Decompose into hook + shell + step components as described.

### Anti-Pattern 2: Config Inside Components
**What:** Defining pricing data, question text, or option lists inside React component files.
**Why bad:** When Nettup updates prices (will happen regularly), they should edit one config file, not hunt through component code.
**Instead:** All pricing data in `src/config/pricing.ts`. Components are pure renderers of config data.

### Anti-Pattern 3: Derived State Stored as State
**What:** Storing the calculated estimate in reducer state and manually recalculating it in specific actions.
**Why bad:** Easy to forget recalculation in one action handler, leading to stale estimates.
**Instead:** Calculate estimate as a derived value from selections -- either in the reducer (recalculate on every action that touches selections) or as a `useMemo` in the hook that depends on selections.

### Anti-Pattern 4: Separate Components Per Service
**What:** Creating `NettsideQuestions.tsx`, `NettbutikkQuestions.tsx`, `LandingssideQuestions.tsx`.
**Why bad:** Duplicates rendering logic. Questions differ in data (from config), not in UI structure.
**Instead:** One generic `QuestionStep.tsx` that renders any `QuestionCategory` from config.

### Anti-Pattern 5: Separate Islands for Steps
**What:** Making GoalStep, QuestionStep, ResultView each their own `client:visible` islands.
**Why bad:** They share state (selections, estimate). Separate islands cannot share React state. Would require external state management or URL params for communication.
**Instead:** One island (`PrisKalkulatorIsland`) is the hydration boundary. Sub-components are regular React components inside it.

## Integration Points Summary

### New Files (9)

| File | Purpose |
|------|---------|
| `src/config/pricing.ts` | Additive pricing config (replaces Pakke model) |
| `src/lib/pricing-engine.ts` | Pure calculation: selections -> estimate |
| `src/components/priskalkulator/types.ts` | Shared TypeScript types for wizard |
| `src/components/priskalkulator/useWizardState.ts` | State management hook (useReducer) |
| `src/components/priskalkulator/WizardShell.tsx` | AnimatePresence + progress indicator |
| `src/components/priskalkulator/GoalStep.tsx` | Service selection step |
| `src/components/priskalkulator/QuestionStep.tsx` | Generic question category renderer |
| `src/components/priskalkulator/ResultView.tsx` | Line-item breakdown + CTAs |
| `src/pages/priskalkulator/index.astro` | Dedicated calculator page |

### Modified Files (2)

| File | Change |
|------|--------|
| `src/components/islands/PrisKalkulatorIsland.tsx` | REWRITE -- becomes thin orchestrator importing hook + sub-components |
| `src/pages/tjenester/_sections/PrisKalkulator.astro` | MINOR -- update title/subtitle text |

### Untouched Files

- `src/config/services.ts` -- still used for service metadata in GoalStep + ResultView
- `src/config/launchOffer.ts` -- still used for remaining slots urgency in ResultView
- `src/lib/animation.ts` -- still used for springs, fadeUp, fadeIn variants
- `src/layouts/BaseLayout.astro` -- no changes needed (new /priskalkulator page uses it as-is)
- All other pages and components

### No New Dependencies

- `useReducer` -- standard React hook
- `Intl.NumberFormat('nb-NO')` -- built-in browser API for Norwegian number formatting (e.g., "12 000 kr")
- All animation via existing Framer Motion
- All styling via existing Tailwind classes

## Build Order

Dependency chain determines the correct sequence. Each step is independently testable:

| Order | What to Build | Depends On | How to Test |
|-------|--------------|------------|-------------|
| 1 | `types.ts` -- shared interfaces | Nothing | TypeScript compiles |
| 2 | `pricing.ts` -- config with real data | types.ts | Type-check, import in REPL |
| 3 | `pricing-engine.ts` -- calculation functions | types.ts, pricing.ts shape | Unit test: mock selections -> verify estimate |
| 4 | `useWizardState.ts` -- reducer + hook | pricing.ts, pricing-engine.ts | Test reducer transitions, verify estimate derivation |
| 5 | `GoalStep.tsx` + `QuestionStep.tsx` | types.ts | Render with mock data, visual review |
| 6 | `ResultView.tsx` | types.ts (PriceEstimate) | Render with mock estimate, visual review |
| 7 | `WizardShell.tsx` -- progress + animation | GoalStep, QuestionStep, ResultView | Full visual integration |
| 8 | `PrisKalkulatorIsland.tsx` rewrite | All above | Works on /tjenester (replace existing) |
| 9 | `/priskalkulator/index.astro` | PrisKalkulatorIsland | New route builds and works |

**Critical path:** Steps 1-3 are pure logic (no UI). Steps 5-6 are pure UI (no business logic). Step 4 bridges them. Steps 7-8 wire everything together. Step 9 is a thin page wrapper.

**Parallelizable:** Steps 5+6 can run in parallel once types exist. Step 9 can start as soon as step 8 works.

## Scalability Considerations

| Concern | Now (3 services, 4 categories) | Future (7+ services) |
|---------|-------------------------------|---------------------|
| Config size | ~150 lines | ~400 lines -- still one file |
| Question categories | 4 per service | Same 4, different options per service |
| Component code | Unchanged | Data-driven -- no code changes for new services |
| Adding a service | Add entry to pricing.ts config | Same pattern, same components |
| Conditional categories | Not needed yet | Add optional `condition` field to QuestionCategory if a category only applies to some services |

## Sources

- Direct codebase analysis: `src/components/islands/PrisKalkulatorIsland.tsx` (current implementation, 379 lines)
- Direct codebase analysis: `src/config/pricing.ts` (current Pakke model to be replaced)
- Direct codebase analysis: `src/config/services.ts` (Service interface, used by GoalStep/ResultView)
- Direct codebase analysis: `src/config/launchOffer.ts` (launch discount slots)
- Direct codebase analysis: `src/lib/animation.ts` (springs, fadeUp, fadeIn -- reused in new components)
- Direct codebase analysis: `src/pages/tjenester/_sections/PrisKalkulator.astro` (current mount pattern)
- Direct codebase analysis: `src/pages/tjenester/index.astro` (page structure, Section/SectionHeader usage)
- React useReducer: standard React API for complex state management (HIGH confidence)
- Framer Motion AnimatePresence: already used successfully in current component (HIGH confidence)

---
*Architecture research for: v1.2 Smart Priskalkulator -- Additive pricing calculator integration*
*Researched: 2026-03-06*
