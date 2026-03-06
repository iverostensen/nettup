# Technology Stack

**Project:** v1.2 Smart Priskalkulator (additive pricing engine)
**Researched:** 2026-03-06
**Confidence:** HIGH

> Scope: additive pricing engine, config-driven pricing file, multi-step question wizard, range estimate calculation. The existing stack handles everything. Zero new dependencies needed.

---

## Recommendation: Zero New Dependencies

| Requirement | Solution | Already Installed |
|-------------|----------|-------------------|
| Multi-step wizard UI | React 19 + Framer Motion AnimatePresence | Yes |
| Complex step state | React `useReducer` (upgrade from `useState`) | Yes (React built-in) |
| Additive calculation | Pure TypeScript functions | Yes |
| Config-driven pricing | TypeScript file (`.ts`) with typed constants | Yes (pattern from `services.ts`) |
| Step animations | Framer Motion slide variants | Yes (pattern from current `PrisKalkulatorIsland`) |
| Range estimates (min-max) | TypeScript arithmetic | Yes |
| Line-item breakdown | Derived from state + config, rendered as list | Yes |
| Monthly cost accumulation | Same additive pattern as setup cost | Yes |

---

## Key Decision: TypeScript Config Over JSON

**Use `src/config/pricing.ts`, not `pricing.json`.**

| Criterion | TypeScript (.ts) | JSON (.json) |
|-----------|------------------|--------------|
| Type safety | Full — interfaces enforce structure at build time | None — needs runtime validation |
| Computed values | Yes — `Math.round(base * (1 - LAUNCH_DISCOUNT))` | No — must duplicate values |
| Shared constants | Yes — import `LAUNCH_DISCOUNT` from `services.ts` | No — stringly typed |
| IDE support | Full autocomplete and refactor | Partial |
| Import pattern | Matches existing `services.ts` | Different pattern |
| Non-dev editing | Requires TS knowledge | Slightly more accessible |

Non-dev editing is irrelevant: PROJECT.md states this is "brukes internt av Nettup for kundeprising" — the team is technical. TypeScript wins on every criterion that matters.

### Recommended Config Structure

```typescript
// src/config/pricing.ts

export interface PricingOption {
  id: string;
  label: string;
  subLabel?: string;
  setupPrice: number;      // One-time cost addition in NOK (can be 0)
  monthlyPrice: number;    // Monthly cost addition in NOK (can be 0)
}

export interface PricingQuestion {
  id: string;
  question: string;
  helpText?: string;       // Optional explainer shown below question
  options: PricingOption[];
}

export interface ServicePricing {
  serviceSlug: string;
  baseSetupPrice: number;    // Starting point before additions
  baseMonthlyPrice: number;  // Starting monthly before additions
  questions: PricingQuestion[];
}

export const pricing: Record<string, ServicePricing> = {
  nettside: {
    serviceSlug: 'nettside',
    baseSetupPrice: 8000,
    baseMonthlyPrice: 350,
    questions: [
      {
        id: 'size',
        question: 'Hvor mange sider trenger du?',
        options: [
          { id: 'small', label: '1-5 sider', subLabel: 'Enkel presentasjon', setupPrice: 0, monthlyPrice: 0 },
          { id: 'medium', label: '6-15 sider', subLabel: 'Komplett nettsted', setupPrice: 4000, monthlyPrice: 100 },
          { id: 'large', label: '16+ sider', subLabel: 'Stort nettsted', setupPrice: 10000, monthlyPrice: 200 },
        ],
      },
      {
        id: 'cms',
        question: 'Trenger du a kunne oppdatere innholdet selv?',
        options: [
          { id: 'no', label: 'Nei, dere oppdaterer for meg', setupPrice: 0, monthlyPrice: 0 },
          { id: 'yes', label: 'Ja, med et enkelt CMS-panel', setupPrice: 3000, monthlyPrice: 100 },
        ],
      },
      // ... design level, integrations, etc.
    ],
  },
  // nettbutikk, landingsside...
};
```

**Why this shape works for additive pricing:**

```typescript
// Calculation is trivial:
const totalSetup = pricing.baseSetupPrice
  + selections.reduce((sum, sel) => sum + sel.setupPrice, 0);

const totalMonthly = pricing.baseMonthlyPrice
  + selections.reduce((sum, sel) => sum + sel.monthlyPrice, 0);

// Range estimate: apply variance
const estimate = {
  min: Math.round(totalSetup * 0.9),
  max: Math.round(totalSetup * 1.15),
};
```

No engine library needed. This is integer arithmetic on NOK values.

---

## Key Decision: useReducer Over useState

The current `PrisKalkulatorIsland` uses `useState` with a flat state object. This will not scale to 8-12 questions with back-navigation and accumulated selections.

**Use `useReducer` because:**
1. State transitions are explicit and predictable (dispatch actions, not setState mutations)
2. Back-navigation requires undoing the last selection — reducer makes this clean
3. All selections must be tracked for the line-item breakdown — reducer accumulates naturally
4. Price is derived (computed from state + config), never stored in state, preventing desync

### Recommended State Shape

```typescript
interface CalcState {
  service: string | null;       // Selected service slug
  currentStep: number;          // Index into questions array
  selections: Map<string, PricingOption>;  // questionId -> selected option
  phase: 'service' | 'questions' | 'result';
}

type CalcAction =
  | { type: 'SELECT_SERVICE'; service: string }
  | { type: 'SELECT_OPTION'; questionId: string; option: PricingOption }
  | { type: 'GO_BACK' }
  | { type: 'RESET' };

function calcReducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case 'SELECT_SERVICE':
      return { ...state, service: action.service, phase: 'questions', currentStep: 0, selections: new Map() };
    case 'SELECT_OPTION': {
      const newSelections = new Map(state.selections);
      newSelections.set(action.questionId, action.option);
      const questions = pricing[state.service!].questions;
      const nextStep = state.currentStep + 1;
      return nextStep >= questions.length
        ? { ...state, selections: newSelections, phase: 'result' }
        : { ...state, selections: newSelections, currentStep: nextStep };
    }
    case 'GO_BACK': {
      if (state.phase === 'result') {
        // Go back to last question
        const questions = pricing[state.service!].questions;
        const lastQ = questions[questions.length - 1];
        const newSelections = new Map(state.selections);
        newSelections.delete(lastQ.id);
        return { ...state, phase: 'questions', currentStep: questions.length - 1, selections: newSelections };
      }
      if (state.currentStep > 0) {
        const questions = pricing[state.service!].questions;
        const prevQ = questions[state.currentStep - 1];
        const newSelections = new Map(state.selections);
        newSelections.delete(prevQ.id);
        return { ...state, currentStep: state.currentStep - 1, selections: newSelections };
      }
      return { ...state, phase: 'service', service: null, selections: new Map() };
    }
    case 'RESET':
      return initialState;
  }
}
```

**Price is a derived value, not state:**

```typescript
function calculatePrice(service: string, selections: Map<string, PricingOption>): {
  setupTotal: number;
  monthlyTotal: number;
  lineItems: Array<{ label: string; setup: number; monthly: number }>;
} {
  const config = pricing[service];
  const lineItems = Array.from(selections.values()).map(opt => ({
    label: opt.label,
    setup: opt.setupPrice,
    monthly: opt.monthlyPrice,
  }));
  return {
    setupTotal: config.baseSetupPrice + lineItems.reduce((s, i) => s + i.setup, 0),
    monthlyTotal: config.baseMonthlyPrice + lineItems.reduce((s, i) => s + i.monthly, 0),
    lineItems,
  };
}
```

---

## Integration Points

### With existing `services.ts`
`pricing.ts` references service slugs from `services.ts` but does NOT duplicate service metadata (name, tagline, description). Import `services` to look up display names. `LAUNCH_DISCOUNT` should be defined once (keep in `services.ts`, import into `pricing.ts` and the calculator component).

### With existing `PrisKalkulatorIsland.tsx`
**Rewrite, not extend.** The current architecture (hardcoded narrowing questions, price stored on the last option only) cannot support additive pricing. Preserve the animation patterns (slideVariants, AnimatePresence `mode="wait"`, `useReducedMotion`) but replace state management and data source entirely.

### With `/priskalkulator` page (new)
New Astro page at `src/pages/priskalkulator/index.astro`. Imports the React island with `client:load`. Fully static page — calculator runs client-side.

### With `/tjenester` section (existing)
The same island component can be embedded on `/tjenester` too. The island is self-contained and works wherever mounted.

### With chat endpoint
The pricing config is importable server-side. The chat endpoint could reference `pricing.ts` to give accurate price quotes in conversation. This is a future opportunity, not a v1.2 requirement.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| State management | `useReducer` | Zustand | Overkill for single-island state. No cross-component sharing needed. Adds a dependency for zero benefit. |
| State management | `useReducer` | XState | State machine formalism is elegant but heavy for a linear wizard. The "machine" here is just step index + selections map. |
| Pricing config | TypeScript file | JSON file | No type safety, no computed values, different import pattern from `services.ts`. |
| Pricing config | TypeScript file | Database / CMS | Massive overkill. Prices change quarterly at most. File deploy is fine. |
| Calculation | Pure functions | dinero.js / currency.js | Integer NOK arithmetic. No currency conversion, no floating point, no locale formatting beyond `toLocaleString('nb-NO')`. `a + b` is sufficient. |
| Form handling | Direct React | React Hook Form | Not a form. Single-choice button selections per step. No text inputs, no validation rules, no submission. RHF adds complexity for zero value. |
| Validation | TypeScript interfaces | Zod | Config is authored by developers, not user input. TypeScript catches structural errors at build time. Zod would validate at runtime — unnecessary. |
| Animation | Framer Motion (existing) | View Transitions API | Already using FM with established patterns. Switching adds inconsistency. |
| Visualization | Styled HTML list | Chart library (chart.js, recharts) | A line-item price breakdown is text, not a chart. 3-8 items rendered as a list is clearer than any chart. |

---

## What NOT to Add

| Library | Why People Suggest It | Why Not Here |
|---------|----------------------|--------------|
| Zustand / Jotai / Redux | "State management" | Single component, no shared state. `useReducer` is sufficient and built-in. |
| React Hook Form / Formik | "Multi-step form" | This is not a form. No text inputs, no validation, no submission to an API. |
| XState | "State machine for wizard" | Linear wizard with back button is not complex enough. Would triple the code for the same behavior. |
| dinero.js / currency.js | "Money calculations" | Integer NOK only. No currency conversion. No floating point. Basic arithmetic. |
| Zod | "Validate pricing config" | TypeScript interfaces validate at build time. Config is dev-authored, not user input. |
| chart.js / recharts | "Visualize pricing" | A styled list of line items is clearer than any chart for 3-8 items. |
| @tanstack/react-table | "Display pricing breakdown" | A plain HTML table/list with Tailwind is simpler and smaller. No sorting, filtering, or pagination needed. |

---

## Installation

```bash
# No installation needed. Zero new dependencies.
# The existing stack covers all v1.2 requirements.

npm run dev    # Development
npm run build  # Production build
```

---

## New Files to Create

| File | Purpose |
|------|---------|
| `src/config/pricing.ts` | Additive pricing config — questions, options, base prices per service |
| `src/lib/pricing.ts` | Pure calculation functions — `calculatePrice()`, `formatNOK()`, discount logic |
| `src/components/islands/PrisKalkulatorIsland.tsx` | Rewritten calculator with useReducer + additive engine |
| `src/pages/priskalkulator/index.astro` | Dedicated calculator page |

---

## Sources

- Codebase: `src/components/islands/PrisKalkulatorIsland.tsx` — current 380 LOC useState-based wizard, confirms rewrite needed
- Codebase: `src/config/services.ts` — establishes TypeScript config pattern with typed interfaces
- Codebase: `package.json` — React 19.2.3, Framer Motion 12.23.26, TypeScript 5 already installed
- React docs: `useReducer` is a stable built-in hook since React 16.8, no version concerns
- Confidence: HIGH — all recommendations based on existing codebase patterns and standard React patterns, no external dependencies to verify

---
*Stack research for: v1.2 Smart Priskalkulator — additive pricing engine*
*Researched: 2026-03-06*
