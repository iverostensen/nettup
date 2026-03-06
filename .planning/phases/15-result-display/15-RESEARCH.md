# Phase 15: Result Display - Research

**Researched:** 2026-03-06
**Domain:** React component (wizard result step), price formatting, clipboard API
**Confidence:** HIGH

## Summary

This phase builds a single React component -- `ResultStep` -- that renders the price estimate from `calculateEstimate()` inside the existing wizard. All data types, the calculation engine, and the wizard infrastructure are already in place. The work is primarily UI composition: formatting line items by category, rendering discount presentation, and wiring three action buttons.

The existing codebase provides strong patterns to follow. Step components are simple functional components receiving props. Price formatting uses `toLocaleString('nb-NO')` consistently. Framer Motion with the project's `animation.ts` presets handles transitions. The contact form already accepts `?tjeneste=` query params; accepting `?estimat=` is deferred to Phase 16.

**Primary recommendation:** Build a single `ResultStep.tsx` component that receives `WizardState` and computes the estimate inline, grouping line items by category and rendering discount/CTA/clipboard sections.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Line-item breakdown grouped by category: Storrelse, Funksjoner, Integrasjoner, Design
- Hide empty categories (if no integrations selected, skip that group)
- Size tier shows min-max range inline: "6-15 sider: 15 000 - 25 000 kr"
- Add-ons show fixed price: "CMS: 3 000 kr"
- Summary total line at bottom with horizontal separator above it
- Discount: "Lanseringstilbud" badge + crossed-out original price + discounted price in brand color
- Explicit savings line: "Spar X 000 - Y 000 kr" in green
- When discount inactive: show clean price only -- no strikethrough, no badge, no savings line
- Three actions: Primary "Kontakt oss for tilbud" -> /kontakt?tjeneste={serviceType}&estimat={min}-{max}, Secondary "Beregn pa nytt" resets wizard, Tertiary "Kopier estimat" copies plain text summary to clipboard
- Contact link navigates in same tab
- Clipboard format: readable plain text with service type, selections, total, and nettup.no/kontakt URL
- Monthly cost: separate section below one-time total, visually distinct, label "Drift og hosting", NOT subject to launch discount
- Disclaimer: short muted text "Dette er et estimat -- endelig pris avhenger av prosjektets omfang."

### Claude's Discretion
- Exact layout spacing and typography within the result card
- Animation for result appearance (entrance transition)
- Clipboard copy feedback (toast, icon change, etc.)
- Exact wording of CTA button labels

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PRIS-03 | Result displays a min-max range estimate with "estimat" disclaimer | `EstimateResult.oneTime` provides min/max; disclaimer text is locked in CONTEXT.md |
| RES-01 | Line-item breakdown showing each selected add-on with price contribution | `EstimateResult.lineItems` array with category, label, price fields; group by `category` field |
| RES-02 | CTA links to /kontakt with service type pre-filled | Contact form already handles `?tjeneste=` param; `?estimat=` handling is Phase 16 |
| RES-03 | Launch discount shown as crossed-out original + discounted price | `EstimateResult.discountActive`, `oneTime`, `discounted`, `discountPercent` provide all data |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19 (existing) | Component rendering | Already in project |
| Framer Motion | (existing) | Entrance animation for result | Already used by all wizard steps |
| clsx | (existing) | Conditional class composition | Already used in WizardStepper |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Clipboard API | Browser native | Copy estimate to clipboard | `navigator.clipboard.writeText()` |

No new dependencies needed. Everything is already installed.

## Architecture Patterns

### Recommended File Structure
```
src/components/islands/wizard/steps/
  ResultStep.tsx          # Main result display component
```

Single file. The component is self-contained. No sub-components needed -- the result display is one screen of content rendered conditionally.

### Pattern 1: Step Component Props
**What:** Each wizard step receives specific props from the parent `SmartPrisKalkulator`
**When to use:** Always -- this is the established pattern

The `ResultStep` should receive the full `WizardState` plus callbacks:
```typescript
interface ResultStepProps {
  state: WizardState;       // All selections needed for calculateEstimate()
  onReset: () => void;      // Dispatches RESET action
}
```

The component calls `calculateEstimate()` internally with the state data. This keeps the parent simple (no need to compute the estimate in `SmartPrisKalkulator`).

### Pattern 2: Price Formatting
**What:** Norwegian locale price formatting with `toLocaleString('nb-NO')`
**When to use:** All price displays

Established throughout the codebase:
```typescript
// Fixed price
price.toLocaleString('nb-NO')  // "3 000"

// Range
`${min.toLocaleString('nb-NO')} – ${max.toLocaleString('nb-NO')} kr`
```

### Pattern 3: Line Item Grouping by Category
**What:** Group the flat `lineItems` array into display categories
**When to use:** Rendering the breakdown

The `LineItem.category` field has four values: `'size' | 'feature' | 'integration' | 'design'`. Group them for display with Norwegian labels:

```typescript
const CATEGORY_LABELS: Record<LineItem['category'], string> = {
  size: 'Storrelse',
  feature: 'Funksjoner',
  integration: 'Integrasjoner',
  design: 'Design',
};

const CATEGORY_ORDER: LineItem['category'][] = ['size', 'feature', 'integration', 'design'];
```

Filter out empty groups (no items in category = skip the heading).

### Pattern 4: Size Line Item Special Handling
**What:** Size tier needs min-max range, not just the `price` field from the line item
**When to use:** Rendering the size category

The `lineItems` array stores only `minPrice` in the `price` field for the size item. To show the full range ("6-15 sider: 15 000 - 25 000 kr"), the component needs to look up the size tier from `pricingConfig` to get `maxPrice`:

```typescript
const service = pricingConfig.services[estimate.serviceType];
const sizeTier = service.sizes.find(s => s.id === sizeLineItem.id);
// Use sizeTier.minPrice and sizeTier.maxPrice for display
```

### Pattern 5: Clipboard Text Formatting
**What:** Build a plain-text summary for clipboard copy
**When to use:** "Kopier estimat" button click

```typescript
function buildClipboardText(estimate: EstimateResult): string {
  // Service type, line items, total range, monthly, nettup.no/kontakt URL
  const lines: string[] = [];
  lines.push(`Prisestimat fra Nettup`);
  lines.push(`Tjeneste: ${estimate.serviceType}`);
  lines.push('');
  // ... line items grouped by category
  lines.push(`Totalt: ${formatRange(estimate.discounted)} kr`);
  if (estimate.monthly > 0) {
    lines.push(`Drift og hosting: ${estimate.monthly} kr/mnd`);
  }
  lines.push('');
  lines.push('Kontakt oss: https://nettup.no/kontakt');
  return lines.join('\n');
}
```

### Pattern 6: Entrance Animation
**What:** Staggered fade-up for result sections
**When to use:** When result step mounts

Use existing `fadeUp` + `staggerContainer` from `@/lib/animation`:
```typescript
import { fadeUp, staggerContainer, springs } from '@/lib/animation';

<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  <motion.div variants={fadeUp} transition={springs.gentle}>
    {/* each section */}
  </motion.div>
</motion.div>
```

This provides a clean staggered reveal as sections appear.

### Anti-Patterns to Avoid
- **Separate result page/route:** The result is a step inside the existing wizard card, not a new page
- **Passing pre-computed estimate as prop:** Let ResultStep call `calculateEstimate()` internally -- keeps the parent simple
- **Using PriceDisplay.astro:** That's an Astro component. ResultStep is React. Replicate the visual pattern in JSX
- **Animated counting numbers:** Explicitly out of scope per REQUIREMENTS.md

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Price calculation | Custom math in UI | `calculateEstimate()` from `@/lib/calculate-estimate.ts` | Already tested, handles all edge cases |
| Clipboard copy | Custom clipboard polyfill | `navigator.clipboard.writeText()` | Browser API, supported in all target browsers |
| Number formatting | Manual string manipulation | `toLocaleString('nb-NO')` | Norwegian locale with proper spacing |
| Animation | Custom CSS transitions | Framer Motion + `@/lib/animation` presets | Consistent with rest of wizard |

## Common Pitfalls

### Pitfall 1: Size Line Item Shows Only Min Price
**What goes wrong:** Displaying the size line item shows just minPrice (e.g., "15 000 kr") instead of the range
**Why it happens:** `LineItem.price` for size category stores only `minPrice`. The `maxPrice` isn't in the line item.
**How to avoid:** For category `'size'`, look up the full `SizeTier` from `pricingConfig` to get both min and max
**Warning signs:** Size row shows a single number instead of "15 000 - 25 000 kr"

### Pitfall 2: Discount Conditional Rendering
**What goes wrong:** Showing strikethrough/badge when discount is inactive, or missing it when active
**Why it happens:** Not checking `discountActive` boolean
**How to avoid:** Branch rendering: if `discountActive`, show badge + strikethrough + savings; otherwise show `oneTime` range cleanly
**Warning signs:** Prices look wrong when `discount.active` is toggled in config

### Pitfall 3: Monthly Cost Subject to Discount
**What goes wrong:** Applying discount to monthly price
**Why it happens:** Assuming discount applies everywhere
**How to avoid:** Monthly cost is always `service.monthlyPrice` -- the engine returns it unmodified. Never apply `discountPercent` to it
**Warning signs:** Monthly price changes when discount is toggled

### Pitfall 4: RESET Action Direction
**What goes wrong:** Wizard resets but slide animation goes wrong direction
**Why it happens:** Not aware that `RESET` action already sets `direction: -1` in the reducer
**How to avoid:** Just dispatch `{ type: 'RESET' }` -- the reducer handles direction correctly
**Warning signs:** Result slides right (forward direction) when resetting back to start

### Pitfall 5: Clipboard API Requires Secure Context
**What goes wrong:** `navigator.clipboard.writeText()` fails on HTTP
**Why it happens:** Clipboard API requires HTTPS or localhost
**How to avoid:** Dev runs on localhost (fine). Production on HTTPS (fine). Add a try/catch with fallback message
**Warning signs:** Copy button silently fails

### Pitfall 6: Query Parameter Encoding
**What goes wrong:** Special characters in URL break navigation
**Why it happens:** Service type values are plain strings like "nettside" (safe), but the estimat range contains a hyphen
**How to avoid:** Use `encodeURIComponent()` or template the URL carefully. The values are simple ASCII so this is low risk
**Warning signs:** URL with unexpected encoding

## Code Examples

### ResultStep Integration in SmartPrisKalkulator
```typescript
// In SmartPrisKalkulator.tsx, replace the placeholder:
case 'result':
  if (!state.serviceType || !state.sizeId || !state.designId) return null;
  return (
    <ResultStep
      state={state}
      onReset={() => dispatch({ type: 'RESET' })}
    />
  );
```

### Line Item Category Grouping
```typescript
function groupByCategory(lineItems: LineItem[]): Map<LineItem['category'], LineItem[]> {
  const groups = new Map<LineItem['category'], LineItem[]>();
  for (const item of lineItems) {
    const existing = groups.get(item.category) ?? [];
    existing.push(item);
    groups.set(item.category, existing);
  }
  return groups;
}
```

### Clipboard Copy with Feedback
```typescript
async function handleCopy(text: string, setIsCopied: (v: boolean) => void) {
  try {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  } catch {
    // Fallback: do nothing, button stays in default state
  }
}
```

### CTA Link Construction
```typescript
function buildContactUrl(serviceType: ServiceType, discounted: { min: number; max: number }): string {
  return `/kontakt?tjeneste=${serviceType}&estimat=${discounted.min}-${discounted.max}`;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `document.execCommand('copy')` | `navigator.clipboard.writeText()` | 2020+ | Async, promise-based, cleaner |
| PriceDisplay.astro | React JSX equivalent | This phase | Astro components can't be used inside React islands |

## Open Questions

1. **Contact form `?estimat=` parameter**
   - What we know: Contact form already handles `?tjeneste=` but NOT `?estimat=`
   - What's unclear: Whether to add `?estimat=` handling now or in Phase 16
   - Recommendation: Phase 15 generates the URL with both params. Phase 16 handles making the contact form read and display `?estimat=`. The URL works now -- it just won't pre-fill the estimate field until Phase 16.

## Sources

### Primary (HIGH confidence)
- Direct code inspection of `src/lib/calculate-estimate.ts` -- full API surface
- Direct code inspection of `src/config/pricing-config.ts` -- all types and data
- Direct code inspection of `src/components/islands/SmartPrisKalkulator.tsx` -- integration point
- Direct code inspection of `src/components/islands/wizard/` -- step component patterns
- Direct code inspection of `src/pages/kontakt/_sections/ContactForm.tsx` -- existing query param handling
- Direct code inspection of `src/components/ui/PriceDisplay.astro` -- visual pattern reference
- Direct code inspection of `src/lib/animation.ts` -- animation presets

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already in project, no new dependencies
- Architecture: HIGH - follows established wizard step patterns exactly
- Pitfalls: HIGH - derived from direct code inspection of data types and existing patterns

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable, internal project)
