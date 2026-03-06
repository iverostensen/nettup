# Phase 13: Pricing Config and Calculation Engine - Research

**Researched:** 2026-03-06
**Domain:** TypeScript config design, pure calculation functions
**Confidence:** HIGH

## Summary

This phase is a pure data + logic phase with zero UI work. It creates a typed pricing config file (`src/config/pricing-config.ts`) and a pure calculation engine function. The domain is straightforward TypeScript -- no external libraries needed beyond what the project already has.

The existing codebase has three relevant config files: `services.ts` (service metadata + `LAUNCH_DISCOUNT`), `pricing.ts` (old Enkel/Standard/Premium packages), and `launchOffer.ts` (slot tracking). The new `pricing-config.ts` will be the single source of truth for all pricing data. The old `pricing.ts` stays alive until Phase 16.

**Primary recommendation:** Build a single `pricing-config.ts` with strongly typed config objects and a separate `src/lib/calculate-estimate.ts` pure function. No new dependencies needed. Add Vitest for testing the calculation engine.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Create a new `src/config/pricing-config.ts` as the single source of truth for all pricing data
- `services.ts` keeps non-pricing metadata (slug, tagline, description, related services)
- Old `pricing.ts` (package model: Enkel/Standard/Premium) stays alive until Phase 16 removes the old wizard
- Three service types: nettside, nettbutikk, landingsside (not webapp)
- Config categories mirror the wizard flow steps: size, features, integrations, design
- Size (single-select): Page-count tiers -- Small (1-5 sider), Medium (6-15 sider), Large (16+), per service type
- Features (multi-select): CMS, kontaktskjema, SEO-optimalisering, animasjoner, analytics-oppsett, blogg, flerspraklig, booking-system, nyhetsbrev, brukerpanel/innlogging -- available features vary per service type
- Integrations (multi-select): Service-specific (e.g., Vipps, regnskap/ERP for nettbutikk)
- Design (single-select): Standard, Skreddersydd, Premium
- Each add-on has a fixed price (not a range)
- Min-max range comes from the base/size tier
- Add-ons contribute to one-time costs only
- Engine output includes a flat monthly cost per service type (not per add-on)
- 40% launch discount applied to the total one-time price (not per line item)
- Discount config (percentage, label, active flag) lives inside the pricing config file
- When launch offer expires (active=false): full price, no fallback discount
- Engine output includes both original and discounted totals (min-max), plus discountPercent and discountActive

### Claude's Discretion
- Internal config structure (flat vs nested, how categories are organized)
- Whether min-max comes from size tier ranges or a spread percentage on fixed totals
- Exact add-on options and prices per service type (reasonable Norwegian SMB pricing)
- TypeScript type design for the config and engine interfaces
- Test strategy for the pure calculation function

### Deferred Ideas (OUT OF SCOPE)
- Monthly cost breakdown per add-on -- RES-FUTURE-01, v1.3 candidate
- Descriptions per option explaining what each feature means -- RES-FUTURE-02, v1.3 candidate
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PRIS-01 | Pricing config file (TS) defines base prices, add-ons, and monthly costs per service | Config structure pattern with typed interfaces; existing `services.ts` and `pricing.ts` show established pattern |
| PRIS-02 | Additive calculation engine computes total from base + selected add-ons | Pure function pattern in `src/lib/calculate-estimate.ts`; uses discriminated unions for selections |
| PRIS-04 | Launch discount (40%) applied to calculated one-time prices | Discount config within pricing-config.ts; existing `LAUNCH_DISCOUNT = 0.4` in services.ts for reference |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | strict (Astro built-in) | Type safety for config and engine | Already configured via `astro/tsconfigs/strict` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | ^3.x | Unit testing the calculation engine | Testing pure functions -- the engine is the perfect test candidate |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vitest | No tests | Engine correctness is critical for pricing accuracy -- tests are worth the small setup cost |
| Vitest | Jest | Vitest integrates natively with Vite/Astro, zero extra config |

**Installation:**
```bash
npm install -D vitest
```

**Vitest config:** No separate config file needed -- Vitest picks up `tsconfig.json` paths automatically with Astro's Vite setup. Add a test script to `package.json`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── config/
│   ├── pricing-config.ts    # NEW: Single source of truth for all pricing
│   ├── services.ts          # EXISTING: Non-pricing metadata (unchanged)
│   ├── pricing.ts           # EXISTING: Old packages (kept until Phase 16)
│   └── launchOffer.ts       # EXISTING: Slot tracker (unchanged)
├── lib/
│   ├── calculate-estimate.ts  # NEW: Pure calculation engine
│   └── utils.ts               # EXISTING: cn() helper
└── ...
```

### Pattern 1: Typed Config with Discriminated Categories

**What:** Structure the config as a record keyed by service type, each containing categorized options with metadata.
**When to use:** When config must be iterable by Phase 14 wizard AND indexable by calculation engine.

```typescript
// Types for the config

type ServiceType = 'nettside' | 'nettbutikk' | 'landingsside';

interface SizeTier {
  id: string;
  label: string;          // Norwegian label for UI
  minPrice: number;       // Bottom of range for this tier
  maxPrice: number;       // Top of range for this tier
}

interface AddOn {
  id: string;
  label: string;          // Norwegian label for UI
  price: number;          // Fixed one-time price in NOK
}

interface DesignLevel {
  id: string;
  label: string;
  price: number;          // Additional cost on top of base
}

interface ServicePricing {
  sizes: SizeTier[];                // Single-select
  features: AddOn[];                // Multi-select
  integrations: AddOn[];            // Multi-select
  designs: DesignLevel[];           // Single-select
  monthlyPrice: number;             // Flat monthly cost
}

interface DiscountConfig {
  percentage: number;     // 0.4 = 40%
  label: string;          // 'Lanseringstilbud'
  active: boolean;        // Toggle off when launch ends
}

interface PricingConfig {
  discount: DiscountConfig;
  services: Record<ServiceType, ServicePricing>;
}
```

**Why size tier has min-max range (recommendation for Claude's discretion):** Size tiers should have `minPrice` and `maxPrice` rather than a spread percentage. This is more intuitive for developers editing the config -- they see the actual NOK amounts directly. A spread percentage adds indirection and makes it harder to reason about what a customer will see.

### Pattern 2: Pure Calculation Function

**What:** A stateless function that takes service type + selections, returns a complete estimate.
**When to use:** Called by the wizard result step (Phase 15) with the user's collected selections.

```typescript
// Engine input
interface EstimateRequest {
  serviceType: ServiceType;
  sizeId: string;
  featureIds: string[];
  integrationIds: string[];
  designId: string;
}

// Engine output
interface LineItem {
  category: 'size' | 'feature' | 'integration' | 'design';
  id: string;
  label: string;
  price: number;          // For size: uses midpoint or fixed, for others: fixed
}

interface EstimateResult {
  serviceType: ServiceType;
  lineItems: LineItem[];
  oneTime: {
    min: number;
    max: number;
  };
  discounted: {
    min: number;
    max: number;
  };
  monthly: number;
  discountPercent: number;
  discountActive: boolean;
}
```

**Key design decision:** The `oneTime.min` and `oneTime.max` come from summing the size tier's min/max plus all selected add-on fixed prices. This gives a natural range without artificial spread.

### Pattern 3: Config-Driven UI (for downstream phases)

**What:** The config structure is designed so Phase 14 wizard can iterate categories without knowing specifics.
**When to use:** Phase 14 will `Object.entries(config.services[type])` to render steps.

The config categories (`sizes`, `features`, `integrations`, `designs`) directly map to wizard steps. Each has `id` + `label` for rendering and `price` for display. The wizard never needs to know about pricing logic -- it just collects IDs and passes them to the engine.

### Anti-Patterns to Avoid
- **Putting prices in UI components:** All prices must live in the config file. Phase 14/15 read from config, never hardcode amounts.
- **Mutable state in the engine:** The calculation function must be pure -- no side effects, no imports from React state.
- **Coupling engine to services.ts:** The new pricing-config.ts is self-contained. Don't import `LAUNCH_DISCOUNT` from services.ts -- define discount in the new config. (Services.ts will eventually read from pricing-config.ts, but that's Phase 16 cleanup.)
- **String-based price formatting in the engine:** The engine returns numbers. Formatting (e.g., "12 000 kr") happens in the UI layer.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Number formatting for NOK | Custom formatter | `Intl.NumberFormat('nb-NO')` | Handles thousands separators correctly for Norwegian locale |
| Test framework | Manual assertions | Vitest | Pure functions are trivially testable; don't skip tests for pricing logic |

**Key insight:** This phase is intentionally simple -- TypeScript types + a pure function. The complexity is in getting the data model right so Phases 14-16 don't need changes.

## Common Pitfalls

### Pitfall 1: Config Structure That Doesn't Support UI Iteration
**What goes wrong:** Config is structured for calculation convenience but Phase 14 wizard can't easily iterate options to render them.
**Why it happens:** Thinking only about the engine, not about the consumer.
**How to avoid:** Each category (sizes, features, etc.) must be an array of objects with `id` and `label` at minimum. The wizard maps over these arrays to render option cards.
**Warning signs:** If you need a lookup table to convert config keys to display strings, the config is poorly structured.

### Pitfall 2: Forgetting to Validate Selection IDs
**What goes wrong:** Engine receives an invalid `sizeId` or `featureId` and silently produces wrong results.
**Why it happens:** Assuming the wizard always sends valid data.
**How to avoid:** Engine should throw or return an error for unknown IDs. This catches bugs early in development.
**Warning signs:** No error handling in the calculation function.

### Pitfall 3: Discount Applied Per Line Item Instead of Total
**What goes wrong:** Discount math is wrong because it's applied to each line item separately.
**Why it happens:** Seems intuitive but contradicts the locked decision: "40% applied to total one-time price."
**How to avoid:** Calculate full undiscounted total first, then apply discount to the sum.
**Warning signs:** `lineItem.price * (1 - discount)` anywhere in the engine.

### Pitfall 4: Breaking services.ts
**What goes wrong:** Modifying services.ts or removing `LAUNCH_DISCOUNT` breaks existing pages that depend on it.
**Why it happens:** Eager cleanup before Phase 16.
**How to avoid:** Don't touch services.ts in this phase. The new pricing-config.ts is additive only.
**Warning signs:** Any imports from pricing-config.ts in existing components.

### Pitfall 5: Inconsistent Service Types
**What goes wrong:** `services.ts` uses `slug: 'landingsside'` but pricing-config uses a different key.
**Why it happens:** No shared type between the two files.
**How to avoid:** Export `ServiceType` from pricing-config.ts using the same slugs as services.ts: `'nettside' | 'nettbutikk' | 'landingsside'`.
**Warning signs:** Service lookup failures when Phase 14 tries to connect the two.

## Code Examples

### Pricing Config Structure
```typescript
// src/config/pricing-config.ts

export type ServiceType = 'nettside' | 'nettbutikk' | 'landingsside';

export interface SizeTier {
  id: string;
  label: string;
  minPrice: number;
  maxPrice: number;
}

export interface AddOn {
  id: string;
  label: string;
  price: number;
}

export interface DesignLevel {
  id: string;
  label: string;
  price: number;
}

export interface ServicePricing {
  sizes: SizeTier[];
  features: AddOn[];
  integrations: AddOn[];
  designs: DesignLevel[];
  monthlyPrice: number;
}

export interface DiscountConfig {
  percentage: number;
  label: string;
  active: boolean;
}

export interface PricingConfig {
  discount: DiscountConfig;
  services: Record<ServiceType, ServicePricing>;
}

export const pricingConfig: PricingConfig = {
  discount: {
    percentage: 0.4,
    label: 'Lanseringstilbud',
    active: true,
  },
  services: {
    nettside: {
      sizes: [
        { id: 'small', label: '1–5 sider', minPrice: 8000, maxPrice: 12000 },
        { id: 'medium', label: '6–15 sider', minPrice: 15000, maxPrice: 25000 },
        { id: 'large', label: '16+ sider', minPrice: 28000, maxPrice: 45000 },
      ],
      features: [
        { id: 'cms', label: 'CMS (innholdsstyring)', price: 3000 },
        { id: 'kontaktskjema', label: 'Kontaktskjema', price: 1000 },
        { id: 'seo', label: 'SEO-optimalisering', price: 2500 },
        // ... more features
      ],
      integrations: [
        // service-specific integrations
      ],
      designs: [
        { id: 'standard', label: 'Standard', price: 0 },
        { id: 'custom', label: 'Skreddersydd', price: 5000 },
        { id: 'premium', label: 'Premium', price: 10000 },
      ],
      monthlyPrice: 350,
    },
    // ... nettbutikk, landingsside
  },
};
```

### Calculation Engine
```typescript
// src/lib/calculate-estimate.ts

import { pricingConfig, type ServiceType } from '@/config/pricing-config';
import type { EstimateRequest, EstimateResult, LineItem } from '@/config/pricing-config';

export function calculateEstimate(request: EstimateRequest): EstimateResult {
  const service = pricingConfig.services[request.serviceType];
  const { discount } = pricingConfig;

  const lineItems: LineItem[] = [];

  // Size tier (single-select, provides the min-max range)
  const size = service.sizes.find((s) => s.id === request.sizeId);
  if (!size) throw new Error(`Unknown size: ${request.sizeId}`);

  lineItems.push({
    category: 'size',
    id: size.id,
    label: size.label,
    price: size.minPrice, // Use min for line item display
  });

  // Features (multi-select)
  for (const featureId of request.featureIds) {
    const feature = service.features.find((f) => f.id === featureId);
    if (!feature) throw new Error(`Unknown feature: ${featureId}`);
    lineItems.push({ category: 'feature', id: feature.id, label: feature.label, price: feature.price });
  }

  // Integrations (multi-select)
  for (const integrationId of request.integrationIds) {
    const integration = service.integrations.find((i) => i.id === integrationId);
    if (!integration) throw new Error(`Unknown integration: ${integrationId}`);
    lineItems.push({ category: 'integration', id: integration.id, label: integration.label, price: integration.price });
  }

  // Design (single-select)
  const design = service.designs.find((d) => d.id === request.designId);
  if (!design) throw new Error(`Unknown design: ${request.designId}`);
  if (design.price > 0) {
    lineItems.push({ category: 'design', id: design.id, label: design.label, price: design.price });
  }

  // Calculate totals: add-ons are fixed, size provides the range
  const addOnTotal = lineItems
    .filter((item) => item.category !== 'size')
    .reduce((sum, item) => sum + item.price, 0);

  const min = size.minPrice + addOnTotal;
  const max = size.maxPrice + addOnTotal;

  const discountMultiplier = discount.active ? 1 - discount.percentage : 1;

  return {
    serviceType: request.serviceType,
    lineItems,
    oneTime: { min, max },
    discounted: {
      min: Math.round(min * discountMultiplier),
      max: Math.round(max * discountMultiplier),
    },
    monthly: service.monthlyPrice,
    discountPercent: discount.percentage * 100,
    discountActive: discount.active,
  };
}
```

### Test Example
```typescript
// src/lib/__tests__/calculate-estimate.test.ts

import { describe, it, expect } from 'vitest';
import { calculateEstimate } from '../calculate-estimate';

describe('calculateEstimate', () => {
  it('calculates base estimate with no add-ons', () => {
    const result = calculateEstimate({
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: [],
      integrationIds: [],
      designId: 'standard',
    });

    expect(result.oneTime.min).toBe(8000);
    expect(result.oneTime.max).toBe(12000);
    expect(result.discountActive).toBe(true);
    expect(result.discounted.min).toBe(4800);
    expect(result.discounted.max).toBe(7200);
  });

  it('adds features to both min and max', () => {
    const result = calculateEstimate({
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: ['kontaktskjema'],
      integrationIds: [],
      designId: 'standard',
    });

    expect(result.oneTime.min).toBe(9000);  // 8000 + 1000
    expect(result.oneTime.max).toBe(13000); // 12000 + 1000
    expect(result.lineItems).toHaveLength(2); // size + feature
  });

  it('throws on unknown feature ID', () => {
    expect(() =>
      calculateEstimate({
        serviceType: 'nettside',
        sizeId: 'small',
        featureIds: ['nonexistent'],
        integrationIds: [],
        designId: 'standard',
      })
    ).toThrow('Unknown feature: nonexistent');
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Package tiers (Enkel/Standard/Premium) | Additive calculator (base + add-ons) | This phase | More flexible, customer picks exactly what they need |
| Hardcoded prices in pricing.ts | Single config with typed structure | This phase | One file to edit for all price changes |
| `LAUNCH_DISCOUNT` in services.ts | Discount config in pricing-config.ts | This phase | Centralized discount control with active flag |

**Deprecated/outdated:**
- `pricing.ts` (Pakke interface): Kept until Phase 16 for backwards compatibility, then deleted
- `LAUNCH_DISCOUNT` in `services.ts`: Will be superseded but not removed until Phase 16

## Open Questions

1. **Exact pricing for all add-ons**
   - What we know: Size tiers need min-max ranges, features/integrations have fixed prices
   - What's unclear: Exact NOK amounts for each option per service type
   - Recommendation: Use reasonable Norwegian SMB web agency pricing (Claude's discretion per CONTEXT.md). The implementer should fill in realistic numbers. Easy to adjust later since it's config-only changes.

2. **Which features/integrations are available per service type**
   - What we know: Features vary per service type (e.g., booking-system might not apply to landingsside)
   - What's unclear: Exact mapping of which options belong to which service
   - Recommendation: Use common sense -- landingsside gets fewer features (no CMS, no blogg), nettbutikk gets commerce-specific integrations (Vipps, regnskap)

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/config/services.ts`, `src/config/pricing.ts`, `src/config/launchOffer.ts` -- established patterns
- `tsconfig.json` -- confirms strict mode with `@/*` path aliases
- `package.json` -- confirms no existing test framework, Astro 5 + Vite stack

### Secondary (MEDIUM confidence)
- Vitest compatibility with Astro/Vite is well-established (same underlying toolchain)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries needed except Vitest (optional but recommended)
- Architecture: HIGH -- pure TypeScript types + function, follows existing project patterns
- Pitfalls: HIGH -- well-understood domain (config design, pure functions)

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable domain, no moving parts)
