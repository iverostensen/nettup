---
phase: 13-pricing-config-and-calculation-engine
plan: 01
subsystem: config
tags: [typescript, pricing, config, norwegian]

requires: []
provides:
  - "Typed pricing config with ServiceType, SizeTier, AddOn, DesignLevel, ServicePricing, PricingConfig types"
  - "pricingConfig constant with pricing data for nettside, nettbutikk, landingsside"
  - "EstimateRequest/EstimateResult/LineItem types for calculation engine contract"
affects: [13-02-calculation-engine, 14-wizard-ui, 15-result-display, 16-page-integration]

tech-stack:
  added: []
  patterns: ["Single config file as pricing source of truth", "Iterable arrays with id+label for UI rendering"]

key-files:
  created: [src/config/pricing-config.ts]
  modified: []

key-decisions:
  - "Size tiers use min/max range (not fixed price) to reflect project complexity variance"
  - "Nettbutikk design levels priced higher than nettside (7k/15k vs 5k/10k) reflecting commerce complexity"
  - "Landingsside has unique size IDs (single/multi/extended) vs small/medium/large for other services"

patterns-established:
  - "Pricing config pattern: typed interfaces + exported const config object in same file"
  - "All pricing labels in Norwegian bokmal"

requirements-completed: [PRIS-01]

duration: 1min
completed: 2026-03-06
---

# Phase 13 Plan 01: Pricing Config Summary

**Typed pricing config file with 10 exported types and complete pricing data for 3 service types (nettside, nettbutikk, landingsside)**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-06T11:21:04Z
- **Completed:** 2026-03-06T11:22:02Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Created complete type system for pricing: ServiceType, SizeTier, AddOn, DesignLevel, ServicePricing, DiscountConfig, PricingConfig, EstimateRequest, LineItem, EstimateResult
- Populated pricing data for all 3 services with realistic Norwegian SMB web agency pricing
- Each service has sizes (3 tiers), features (6-10 options), integrations (3-5 options), designs (3 levels), and monthly price
- Discount config set to 40% lanseringstilbud, matching existing LAUNCH_DISCOUNT in services.ts

## Task Commits

Each task was committed atomically:

1. **Task 1: Define types and interfaces for pricing system** - `a245256` (feat)

## Files Created/Modified
- `src/config/pricing-config.ts` - Complete pricing type definitions and config data for all 3 services

## Decisions Made
- Size tiers use min/max price ranges rather than fixed prices, reflecting the natural variance in project scope within each tier
- Nettbutikk design levels priced higher (7k/15k skreddersydd/premium) vs nettside (5k/10k) to reflect added commerce design complexity
- Landingsside uses distinct size IDs (single/multi/extended) instead of small/medium/large since the concept is page count, not complexity tier
- Features and integrations are service-specific subsets rather than a shared pool, keeping each service's options focused and relevant

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All types exported and ready for Plan 02 (calculation engine) to import
- EstimateRequest/EstimateResult types define the engine's input/output contract
- Config structure supports both UI iteration (arrays with id+label) and engine calculation (prices on every item)
- No modifications to existing services.ts or pricing.ts

---
*Phase: 13-pricing-config-and-calculation-engine*
*Completed: 2026-03-06*
