---
phase: 26-seo-og-intern-lenking
plan: "01"
subsystem: seo-schema
tags: [schema, sitemap, local-seo, locations]
dependency_graph:
  requires: []
  provides: [LINK-03, LINK-04]
  affects: [BaseLayout.astro, astro.config.mjs, locations.ts]
tech_stack:
  added: []
  patterns: [dynamic-schema-from-config, sitemap-serialize-rules]
key_files:
  created: []
  modified:
    - src/layouts/BaseLayout.astro
    - src/config/locations.ts
    - astro.config.mjs
decisions:
  - "areaServed computed from cities.filter(c => c.tier <= ACTIVE_TIER) — self-maintaining as new city configs are added"
  - "AdministrativeArea Oslo-området entry dropped — redundant once actual city entries cover Oslo"
  - "steder index rule (priority 0.9) added as future-safe — harmless until v2 index page is added"
metrics:
  duration: "~1 min"
  completed: "2026-03-08"
  tasks_completed: 2
  files_modified: 3
---

# Phase 26 Plan 01: Self-maintaining LocalBusiness schema and sitemap config Summary

Dynamic areaServed derived from locations.ts tier filter, V2 promotion criteria documented as JSDoc, and sitemap priority 0.8 configured for all /steder/* routes.

## What Was Built

### Task 1: Dynamic areaServed + V2 JSDoc

**BaseLayout.astro** now imports `cities` and `ACTIVE_TIER` from `@/config/locations` and computes `areaServed` at build time:

```typescript
const areaServedCities = cities
  .filter(c => c.tier <= ACTIVE_TIER)
  .map(c => ({ "@type": "City" as const, "name": c.name }));

const areaServed = [
  ...areaServedCities,
  { "@type": "Country" as const, "name": "Norway" },
];
```

The LocalBusiness JSON-LD block now uses `"areaServed": areaServed` — the hardcoded Oslo/Oslo-området/Norway list is replaced. Adding a new city to `locations.ts` automatically propagates to the schema on the next build.

**locations.ts** has a JSDoc comment above `ACTIVE_TIER` documenting the V2 promotion criterion: ≥10 organic impressions/month in GSC, evaluated individually per city.

### Task 2: Sitemap priority rules for /steder/

`astro.config.mjs` serialize() now handles steder routes:
- `/steder/` index: priority 0.9, monthly (future-safe)
- `/steder/*` city pages: priority 0.8, monthly (active — covers all 8 tier-1 pages)

## Decisions Made

- **areaServed is self-maintaining:** The filter `c.tier <= ACTIVE_TIER` means tier-1 cities appear immediately; tier-2 cities activate when `ACTIVE_TIER` is bumped to 2. No manual schema updates needed when adding cities.
- **AdministrativeArea dropped:** The `"Oslo-området"` entry was a patch for the old hardcoded approach. With actual Oslo City entry present, it's redundant and potentially confusing to crawlers.
- **steder index rule is future-safe:** No `/steder/` index page exists in v1 (out of scope per requirements), but the rule is harmless and will activate automatically when added in v2+.

## Deviations from Plan

None — plan executed exactly as written.

## Verification

```
ACTIVE_TIER in BaseLayout.astro: 2 matches (import + filter usage)
areaServedCities in BaseLayout.astro: 2 matches (declaration + spread)
V2-promoteringskriterier in locations.ts: 1 match (JSDoc)
steder in astro.config.mjs: 2 matches (index + wildcard rules)
npm run build: exits 0
```

## Self-Check: PASSED

- `src/layouts/BaseLayout.astro` — FOUND, contains ACTIVE_TIER import and areaServedCities
- `src/config/locations.ts` — FOUND, contains V2-promoteringskriterier JSDoc
- `astro.config.mjs` — FOUND, contains steder priority rules
- Commit 60e2c9c — FOUND: feat(26-01): dynamic areaServed in LocalBusiness schema + V2 JSDoc
- Commit 0768ff2 — FOUND: feat(26-01): sitemap priority rules for /steder/ routes
- Build passed cleanly
