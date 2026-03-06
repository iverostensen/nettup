# Phase 14: Wizard Steps and State - Research

**Researched:** 2026-03-06
**Domain:** React multi-step wizard with Framer Motion transitions
**Confidence:** HIGH

## Summary

Phase 14 replaces the existing `PrisKalkulatorIsland.tsx` wizard with a new 6-step category-based flow that reads from the Phase 13 `pricing-config.ts`. The existing wizard already demonstrates the core animation pattern (AnimatePresence + directional slides + springs.gentle), the established card styling, and the `useReducedMotion` accessibility hook. The new wizard needs: (1) a proper state object tracking all selections across 6 steps, (2) a stepper progress bar, (3) toggle-card multi-select for features/integrations, and (4) single-select for size/design/goal.

The implementation is straightforward React state management. The data layer (pricing-config.ts) already structures options exactly per step (sizes[], features[], integrations[], designs[] per ServiceType). The calculate-estimate.ts interface (EstimateRequest) maps 1:1 to wizard state. No new dependencies are needed.

**Primary recommendation:** Build a single `SmartPrisKalkulator.tsx` React island with useReducer for state, reading all step data from `pricing-config.ts`, reusing established animation patterns from `@/lib/animation`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Toggle cards for multi-select steps (features, integrations) -- card toggles on/off with check icon and brand border highlight
- Price shown on each card (e.g. "+ 3 000 kr" for features/integrations)
- "Neste" button below options for multi-select steps -- always visible even with 0 selections (features are optional)
- Numbered stepper bar with circles connected by lines, 6 steps total (including Result)
- Current step highlighted in brand color, completed steps filled
- Completed steps are clickable for back-navigation (jump to any previous step)
- Labels shown on desktop ("Mal", "Storrelse", "Funksjoner", etc.), numbers only on mobile
- Result included as step 6 in the stepper for visual closure
- Remove the old "recommend" intermediate step -- go straight from Goal -> Size
- Flow: Goal (1) -> Size (2) -> Features (3) -> Integrations (4) -> Design (5) -> Result (6)
- Reverse slide direction on back-navigation (forward = slide left, back = slide right) using Framer Motion
- Dedicated "Tilbake" button shown alongside clickable stepper for easy one-step-back on mobile
- Goal step keeps current 3-card layout with label + sublabel for service type selection
- Cards show label + price (no descriptions)
- Size cards show the min-max price range (e.g. "8 000 - 12 000 kr")
- Long feature lists (up to 10 items) displayed in 2-column grid on desktop, 1-column on mobile -- all visible, no hiding
- Step headings use question format (e.g. "Hvor stor er nettsiden?", "Hvilke funksjoner trenger du?") -- conversational tone
- Keep the existing card style from the old wizard (rounded, border-white/10, hover:border-brand/40) for consistency

### Claude's Discretion
- Single-select advance behavior (auto-advance on click vs manual "Neste")
- Exact card dimensions, spacing, and responsive breakpoints
- Animation timing and spring config
- Step heading wording for each step
- "Tilbake" button placement and styling
- How to visually indicate toggle state on selected cards

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| WIZARD-01 | Category-based flow: Goal -> Size -> Features -> Integrations -> Design -> Result | pricing-config.ts has sizes[], features[], integrations[], designs[] per ServiceType; wizard state maps directly to this structure |
| WIZARD-02 | User can navigate back to any previous step without losing selections | useReducer state preserves all selections; stepper allows jump-to-step; direction state handles reverse animations |
| WIZARD-03 | Progress indicator shows current step and total steps | Stepper component with 6 numbered circles, brand color highlighting, clickable completed steps |
| WIZARD-04 | Multi-select for features/integrations, single-select for size/design | Toggle cards with check icon for multi-select; auto-advance or click-to-select for single-select |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.2.3 | Component framework | Already installed, project standard |
| framer-motion | ^12.23.26 | Step transitions, AnimatePresence | Already installed, project standard |
| clsx | ^2.1.1 | Conditional CSS classes | Already installed, project standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwind-merge | ^3.4.0 | Merge Tailwind classes safely | When composing card styles with selected state |

No new dependencies needed. Everything required is already in the project.

## Architecture Patterns

### Recommended Component Structure
```
src/components/islands/
├── SmartPrisKalkulator.tsx       # Main wizard island (default export)
└── wizard/                       # Wizard internals
    ├── WizardStepper.tsx          # Progress stepper bar
    ├── steps/
    │   ├── GoalStep.tsx           # Step 1: Service type selection
    │   ├── SizeStep.tsx           # Step 2: Size tier (single-select)
    │   ├── FeaturesStep.tsx       # Step 3: Feature add-ons (multi-select)
    │   ├── IntegrationsStep.tsx   # Step 4: Integration add-ons (multi-select)
    │   └── DesignStep.tsx         # Step 5: Design level (single-select)
    ├── cards/
    │   ├── SelectableCard.tsx     # Reusable card with toggle/select behavior
    │   └── GoalCard.tsx           # Goal card with label + sublabel
    └── wizard-types.ts            # WizardState type, step enum, actions
```

### Pattern 1: useReducer for Wizard State

**What:** A single reducer managing all wizard selections and current step. Selections persist across step navigation.

**When to use:** Always -- this is the core state pattern.

**Example:**
```typescript
type WizardStep = 'goal' | 'size' | 'features' | 'integrations' | 'design' | 'result';

interface WizardState {
  currentStep: WizardStep;
  serviceType: ServiceType | null;
  sizeId: string | null;
  featureIds: string[];
  integrationIds: string[];
  designId: string | null;
  direction: 1 | -1;
}

type WizardAction =
  | { type: 'SELECT_GOAL'; serviceType: ServiceType }
  | { type: 'SELECT_SIZE'; sizeId: string }
  | { type: 'TOGGLE_FEATURE'; featureId: string }
  | { type: 'TOGGLE_INTEGRATION'; integrationId: string }
  | { type: 'SELECT_DESIGN'; designId: string }
  | { type: 'NEXT_STEP' }
  | { type: 'GO_TO_STEP'; step: WizardStep }
  | { type: 'RESET' };

const STEP_ORDER: WizardStep[] = ['goal', 'size', 'features', 'integrations', 'design', 'result'];

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SELECT_GOAL':
      return {
        ...state,
        serviceType: action.serviceType,
        // Reset downstream selections when goal changes
        sizeId: null,
        featureIds: [],
        integrationIds: [],
        designId: null,
        currentStep: 'size',
        direction: 1,
      };
    case 'TOGGLE_FEATURE': {
      const ids = state.featureIds.includes(action.featureId)
        ? state.featureIds.filter((id) => id !== action.featureId)
        : [...state.featureIds, action.featureId];
      return { ...state, featureIds: ids };
    }
    case 'GO_TO_STEP': {
      const currentIdx = STEP_ORDER.indexOf(state.currentStep);
      const targetIdx = STEP_ORDER.indexOf(action.step);
      return {
        ...state,
        currentStep: action.step,
        direction: targetIdx > currentIdx ? 1 : -1,
      };
    }
    // ... etc
  }
}
```

### Pattern 2: Directional Slide Animation (Existing Pattern)

**What:** AnimatePresence with custom direction prop for forward/backward slide transitions.

**When to use:** All step transitions.

**Example (already established in PrisKalkulatorIsland.tsx):**
```typescript
const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: prefersReducedMotion ? 0 : dir * 40,
  }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({
    opacity: 0,
    x: prefersReducedMotion ? 0 : dir * -40,
  }),
};

<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={currentStep}
    custom={direction}
    variants={slideVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={springs.gentle}
  >
    {/* step content */}
  </motion.div>
</AnimatePresence>
```

### Pattern 3: Data-Driven Steps from pricing-config.ts

**What:** Steps read options directly from `pricingConfig.services[serviceType]` -- no duplicated data.

**When to use:** Size, Features, Integrations, and Design steps.

**Example:**
```typescript
import { pricingConfig, type ServiceType } from '@/config/pricing-config';

// In SizeStep:
const sizes = pricingConfig.services[serviceType].sizes;
// Each size has: { id, label, minPrice, maxPrice }

// In FeaturesStep:
const features = pricingConfig.services[serviceType].features;
// Each feature has: { id, label, price }
```

### Pattern 4: Toggle Card for Multi-Select

**What:** A card component that toggles between selected/unselected states with visual feedback.

**When to use:** Features and Integrations steps.

**Example:**
```typescript
interface SelectableCardProps {
  label: string;
  price: number;
  selected: boolean;
  onToggle: () => void;
}

function SelectableCard({ label, price, selected, onToggle }: SelectableCardProps) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        'w-full rounded-md border p-4 text-left transition-colors',
        selected
          ? 'border-brand bg-brand/10'
          : 'border-white/10 bg-surface-raised hover:border-brand/40'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-text">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand">+ {formatPrice(price)} kr</span>
          {selected && (
            <svg /* check icon */ className="h-5 w-5 text-brand" />
          )}
        </div>
      </div>
    </button>
  );
}
```

### Anti-Patterns to Avoid
- **Storing derived data in state:** Do not store the total price in wizard state. Calculate on demand from selections using `calculateEstimate()`.
- **Resetting all state on back navigation:** Only reset selections if the user changes goal (service type), since that invalidates all downstream options.
- **Separate state per step:** Use a single flat state object, not per-step state slices. The wizard needs to read any selection from any step.
- **Duplicating pricing data:** Never hardcode option labels/prices in wizard components. Always read from `pricing-config.ts`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Step transition animations | Custom CSS transitions | Framer Motion AnimatePresence (already in project) | Direction-aware enter/exit, reduced motion support, spring physics |
| Price formatting | Manual string formatting | `Intl.NumberFormat('nb-NO')` or simple `toLocaleString('nb-NO')` | Handles Norwegian number formatting (space as thousands separator) |
| Conditional class merging | Template literal concatenation | `clsx()` (already in project) | Handles falsy values, arrays, objects cleanly |

## Common Pitfalls

### Pitfall 1: Goal Change Invalidates Downstream Selections
**What goes wrong:** User selects nettside, picks features specific to nettside, goes back to Goal, selects nettbutikk. Now featureIds reference nettside features that don't exist in nettbutikk config.
**Why it happens:** State preserves selections across service type changes.
**How to avoid:** In the reducer, when `SELECT_GOAL` fires, reset sizeId, featureIds, integrationIds, and designId to their initial values.
**Warning signs:** `calculateEstimate()` throwing "Unknown featureId" errors.

### Pitfall 2: AnimatePresence Key Must Change
**What goes wrong:** Step transitions don't animate -- content just swaps.
**Why it happens:** AnimatePresence requires a unique `key` prop on direct children to trigger enter/exit animations.
**How to avoid:** Use `key={currentStep}` on the motion.div wrapping each step's content.

### Pitfall 3: Stepper Click Allowing Forward Jumps
**What goes wrong:** User on Step 2 clicks Step 5 in the stepper, skipping required selections.
**Why it happens:** Stepper click handler doesn't validate step order.
**How to avoid:** Only completed steps (index < current step index) should be clickable. Current and future steps should not be interactive.

### Pitfall 4: Mobile Stepper Overflow
**What goes wrong:** 6 steps with labels don't fit on mobile screens.
**Why it happens:** Labels like "Funksjoner" and "Integrasjoner" are long Norwegian words.
**How to avoid:** Per user decision: numbers only on mobile, labels on desktop. Use a responsive breakpoint (sm: or md:) to toggle label visibility.

### Pitfall 5: Forgetting prefers-reduced-motion
**What goes wrong:** Accessibility violation for users with motion sensitivity.
**Why it happens:** Slide animations can cause discomfort.
**How to avoid:** Use the established `useReducedMotion()` hook from framer-motion. When active, set x offset to 0 (fade only). The existing wizard already demonstrates this pattern.

## Code Examples

### Price Formatting (Norwegian)
```typescript
function formatPrice(price: number): string {
  return price.toLocaleString('nb-NO');
}
// 8000 -> "8 000"
// 15000 -> "15 000"
```

### Price Range Display for Size Cards
```typescript
function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} - ${formatPrice(max)} kr`;
}
// (8000, 12000) -> "8 000 - 12 000 kr"
```

### Stepper Component Skeleton
```typescript
const STEP_LABELS = ['Mal', 'Storrelse', 'Funksjoner', 'Integrasjoner', 'Design', 'Resultat'];

interface StepperProps {
  currentStepIndex: number;
  onStepClick: (index: number) => void;
}

function WizardStepper({ currentStepIndex, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center justify-between">
      {STEP_LABELS.map((label, i) => {
        const isCompleted = i < currentStepIndex;
        const isCurrent = i === currentStepIndex;
        return (
          <div key={label} className="flex items-center">
            <button
              onClick={() => isCompleted && onStepClick(i)}
              disabled={!isCompleted}
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                isCurrent && 'bg-brand text-white',
                isCompleted && 'bg-brand/20 text-brand cursor-pointer hover:bg-brand/30',
                !isCompleted && !isCurrent && 'bg-white/5 text-text-muted'
              )}
            >
              {i + 1}
            </button>
            <span className={clsx(
              'ml-2 text-xs hidden md:inline',
              isCurrent ? 'text-text' : 'text-text-muted'
            )}>
              {label}
            </span>
            {i < STEP_LABELS.length - 1 && (
              <div className={clsx(
                'mx-2 h-px w-6 sm:w-8',
                i < currentStepIndex ? 'bg-brand/40' : 'bg-white/10'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
```

### Wizard State to EstimateRequest Mapping
```typescript
import type { EstimateRequest } from '@/config/pricing-config';

function stateToRequest(state: WizardState): EstimateRequest | null {
  if (!state.serviceType || !state.sizeId || !state.designId) return null;
  return {
    serviceType: state.serviceType,
    sizeId: state.sizeId,
    featureIds: state.featureIds,
    integrationIds: state.integrationIds,
    designId: state.designId,
  };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| PrisKalkulatorIsland with hardcoded narrowing questions | SmartPrisKalkulator reading from pricing-config.ts | Phase 14 (now) | Single source of truth, consistent with calculation engine |
| Recommend intermediate step | Direct Goal -> Size flow | Phase 14 (now) | Fewer steps, less friction |
| Price estimates shown only on last narrowing question | Price shown on every card | Phase 14 (now) | Transparency, informed decisions |

## Open Questions

1. **Auto-advance vs manual "Neste" for single-select steps (Claude's discretion)**
   - What we know: Multi-select steps use "Neste" button. Goal step already auto-advances on click in current wizard.
   - Recommendation: Auto-advance for single-select steps (Goal, Size, Design) since there's no reason to pause after a single choice. This matches the existing Goal step behavior and reduces clicks. The stepper provides easy back-navigation if the user changes their mind.

2. **Container width for new wizard**
   - What we know: Current wizard uses `max-w-2xl` (672px). Feature step has up to 10 items in 2-column grid.
   - Recommendation: Widen to `max-w-3xl` (768px) to accommodate 2-column feature grids comfortably. The stepper also benefits from wider space.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis: `PrisKalkulatorIsland.tsx`, `pricing-config.ts`, `calculate-estimate.ts`, `animation.ts`
- Established project patterns: card styling, animation variants, `useReducedMotion` usage
- `package.json`: Confirmed versions of react (^19.2.3), framer-motion (^12.23.26), clsx (^2.1.1)

### Secondary (MEDIUM confidence)
- Framer Motion AnimatePresence pattern verified from existing working implementation in codebase

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed and in use
- Architecture: HIGH - follows established island pattern, data structures already defined
- Pitfalls: HIGH - based on direct analysis of existing code and data model

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable -- no external dependencies changing)
