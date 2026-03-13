# Phase 26: SEO og intern lenking - Research

**Researched:** 2026-03-08
**Domain:** JSON-LD schema, Astro sitemap configuration, SEO documentation
**Confidence:** HIGH

## Summary

Phase 26 is a small, tightly scoped cleanup phase. All content and per-page JSON-LD is already live from Phase 25. The remaining work is two mechanical changes plus two documentation tasks: (1) make the global `LocalBusiness.areaServed` dynamic so it auto-includes all tier-1 cities, and (2) add `/steder/*` sitemap priority rules to `astro.config.mjs`. Both are single-file edits with known patterns already in the codebase.

LINK-03 (sitemap verification) is a manual post-deploy check, not a code change. LINK-04 (V2 promotion criteria) is a JSDoc comment in `locations.ts`. Neither requires research — both have fully specified implementation details in CONTEXT.md.

**Primary recommendation:** Two code edits (BaseLayout.astro + astro.config.mjs), two documentation items (JSDoc in locations.ts + post-deploy verification note). No new dependencies. No new patterns. ~30 minutes total execution time.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**LocalBusiness JSON-LD**
- Oppdater `areaServed`-arrayen i BaseLayout.astro til å inkludere alle aktive tier-1 byer dynamisk
- Importer `cities` og `ACTIVE_TIER` fra `locations.ts` — filtrer på tier, slik at nye byer automatisk inkluderes uten manuell oppdatering
- Eksisterende `Service` + `FAQPage` JSON-LD per byside beholdes — ingen per-by LocalBusiness (unødvendig for v1)

**Sitemap-prioritet**
- `/steder/` oversiktsside: `priority: 0.9`, `changefreq: 'monthly'`
- `/steder/*` individuelle bysider: `priority: 0.8`, `changefreq: 'monthly'`
- Legg til regler i `astro.config.mjs` sitemap `serialize()`-funksjonen

**V2-promoteringskriterier**
- Primærkriterium: ≥10 organiske inntrykk i Google Search Console per måned for bysiden
- Vurderes individuelt per by — Oslo kan promoteres til tier 2 uavhengig av andre byer
- Dokumenteres som JSDoc-kommentar direkte i `locations.ts` over `ACTIVE_TIER`-konstanten

**Sitemap-verifisering (LINK-03)**
- Manuell engangssjekk etter første deploy: `curl https://nettup.no/sitemap-index.xml` og bekreft at alle `/steder/*`-URLer er til stede
- Resultatet dokumenteres (screenshot eller notat) — ingen CI-automatisering nødvendig for v1

### Claude's Discretion

Ingen — alle beslutninger er låst.

### Deferred Ideas (OUT OF SCOPE)

Ingen — diskusjonen holdt seg innenfor phase-scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LINK-03 | All city pages appear in `sitemap-index.xml` after first deploy (verified manually) | Sitemap serialize() rules in astro.config.mjs ensure `/steder/*` URLs are included with correct priority; manual curl verification is the gate |
| LINK-04 | V2 promotion criteria documented as measurable thresholds before V2 work begins | JSDoc comment above `ACTIVE_TIER` in locations.ts is the documentation target; criteria are defined (≥10 GSC impressions/month per city) |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@astrojs/sitemap` | already installed | Generates sitemap-index.xml from static routes | Project already uses it; `serialize()` hook supports custom priority/changefreq per URL pattern |

### Supporting

No new dependencies required. Everything needed is already in the project.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@astrojs/sitemap` serialize() | Custom sitemap endpoint | Endpoint gives full control but is unnecessary here — serialize() covers the use case cleanly |

**Installation:** None required.

---

## Architecture Patterns

### Recommended Project Structure

No new files or directories needed. Two existing files are modified:

```
src/
└── layouts/
    └── BaseLayout.astro     ← Add cities import, replace hardcoded areaServed

astro.config.mjs             ← Add /steder/ priority rules to serialize()

src/config/
└── locations.ts             ← Add JSDoc above ACTIVE_TIER (V2 criteria docs)
```

### Pattern 1: Dynamic areaServed in BaseLayout

**What:** Import `cities` and `ACTIVE_TIER` from `locations.ts` in the BaseLayout frontmatter, then compute a dynamic `areaServed` array in the `LocalBusiness` JSON-LD block.

**When to use:** Any time schema data needs to stay in sync with the config source of truth.

**Current state (hardcoded, to be replaced):**
```typescript
"areaServed": [
  { "@type": "City", "name": "Oslo" },
  { "@type": "AdministrativeArea", "name": "Oslo-området" },
  { "@type": "Country", "name": "Norway" }
]
```

**Target pattern (dynamic):**
```typescript
// Source: src/config/locations.ts — same filter used in getStaticPaths()
import { cities, ACTIVE_TIER } from '../config/locations';

const activeCities = cities
  .filter(c => c.tier <= ACTIVE_TIER)
  .map(c => ({ "@type": "City", "name": c.name }));

// In LocalBusiness JSON-LD:
"areaServed": activeCities
```

### Pattern 2: Sitemap serialize() for /steder/

**What:** Add URL pattern rules to the existing `serialize()` function in `astro.config.mjs`. The existing blog rules are the established pattern.

**Current state:**
```javascript
serialize(item) {
  if (item.url === 'https://nettup.no/blogg/') {
    return { ...item, changefreq: 'weekly', priority: 0.8 };
  }
  if (item.url.startsWith('https://nettup.no/blogg/')) {
    return { ...item, changefreq: 'monthly', priority: 0.7 };
  }
  return item;
}
```

**Target — add before `return item`:**
```javascript
if (item.url === 'https://nettup.no/steder/') {
  return { ...item, changefreq: 'monthly', priority: 0.9 };
}
if (item.url.startsWith('https://nettup.no/steder/')) {
  return { ...item, changefreq: 'monthly', priority: 0.8 };
}
```

**Note:** There is currently no `/steder/` index page (`src/pages/steder/` only contains `[location].astro`). The `/steder/` rule is future-safe but will have no effect until that page exists. The individual `/steder/*` rules are what matter for v1.

### Pattern 3: JSDoc for V2 promotion criteria

**What:** Add a JSDoc comment directly above the `ACTIVE_TIER` export in `locations.ts`.

**Target location:** `/Users/iverostensen/nettup/src/config/locations.ts`, line 6.

**Example:**
```typescript
/**
 * V2-promoteringskriterier:
 * En by promoteres fra tier 1 til tier 2 når:
 * - Bysiden har ≥10 organiske inntrykk per måned i Google Search Console
 * - Vurderes individuelt — Oslo kan promoteres uavhengig av andre byer
 *
 * Øk ACTIVE_TIER til 2 for å aktivere tier-2-byer.
 */
export const ACTIVE_TIER = 1;
```

### Anti-Patterns to Avoid

- **Duplicate LocalBusiness declarations:** The per-city pages already use `Service` JSON-LD with `"provider": {"@id": "https://nettup.no/#business"}`. Do NOT add a second `LocalBusiness` block per city page. BaseLayout already has the canonical one.
- **Hardcoded city lists in multiple places:** The whole point of this change is that BaseLayout derives its list from `locations.ts`, not from a manually maintained array.
- **Skipping the sitemap verification step:** LINK-03 is formally incomplete until a post-deploy `curl` confirms URLs are present.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap URL inclusion | Custom sitemap endpoint | `@astrojs/sitemap` serialize() | Already handles static route discovery; custom endpoint adds complexity with no benefit |
| Schema validation | Manual JSON-LD linter | Google's Rich Results Test (manual) | No npm install needed; manual post-deploy check is sufficient for v1 |

---

## Common Pitfalls

### Pitfall 1: /steder/ index page doesn't exist

**What goes wrong:** The sitemap rule for `item.url === 'https://nettup.no/steder/'` will never match because there is no index page at that route. The rule is harmless but inert.

**Why it happens:** CONTEXT.md specifies adding this rule, but `/steder/` index is out of scope for v1 (per REQUIREMENTS.md "Out of Scope" section).

**How to avoid:** Add the rule anyway (future-safe, zero cost), but document that it only activates when a `/steder/` index page is added in v2+. Don't create the index page as part of this phase.

### Pitfall 2: BaseLayout import causes build errors

**What goes wrong:** BaseLayout.astro doesn't currently import from `locations.ts`. Adding the import is straightforward, but the frontmatter runs at build time — if the import path alias (`@/config/locations`) vs relative path (`../config/locations`) differs from what Astro resolves, build fails.

**Why it happens:** Other pages use `@/config/locations` (e.g., `[location].astro` line 2). BaseLayout uses relative imports for other imports (`../styles/global.css`, `../components/islands/...`).

**How to avoid:** Use the same import style as the existing BaseLayout imports (relative path: `'../config/locations'`), or verify alias `@/` is configured — it is, since `[location].astro` uses `@/config/locations` successfully.

**Recommendation:** Use `@/config/locations` to match the pattern established in `[location].astro`.

### Pitfall 3: areaServed array loses the Country and AdministrativeArea entries

**What goes wrong:** Replacing the hardcoded `areaServed` with only city names drops `{ "@type": "Country", "name": "Norway" }` and `{ "@type": "AdministrativeArea", "name": "Oslo-området" }`.

**Why it happens:** The dynamic filter only produces `City` entries.

**How to avoid:** Append a static Country entry after the dynamic city list:
```typescript
const areaServed = [
  ...activeCities,
  { "@type": "Country", "name": "Norway" }
];
```
The "Oslo-området" AdministrativeArea entry is redundant once actual city entries cover the region — omitting it is fine.

---

## Code Examples

### Complete BaseLayout areaServed replacement

```typescript
// In BaseLayout.astro frontmatter — add import
import { cities, ACTIVE_TIER } from '@/config/locations';

// Compute once
const areaServedCities = cities
  .filter(c => c.tier <= ACTIVE_TIER)
  .map(c => ({ "@type": "City" as const, "name": c.name }));

const areaServed = [
  ...areaServedCities,
  { "@type": "Country" as const, "name": "Norway" }
];

// In LocalBusiness JSON-LD block — replace the hardcoded array:
"areaServed": areaServed,
```

### Complete sitemap serialize() additions

```javascript
// astro.config.mjs — add these two rules inside serialize() before `return item`
if (item.url === 'https://nettup.no/steder/') {
  return { ...item, changefreq: 'monthly', priority: 0.9 };
}
if (item.url.startsWith('https://nettup.no/steder/')) {
  return { ...item, changefreq: 'monthly', priority: 0.8 };
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded areaServed | Dynamic from locations.ts | Phase 26 | New cities auto-included; no manual maintenance |
| No sitemap priority for /steder/ | Explicit priority 0.8 | Phase 26 | Crawlers signal city pages are high-value |

---

## Open Questions

1. **Should "Oslo-området" AdministrativeArea be retained?**
   - What we know: It's currently in the hardcoded array; the dynamic replacement won't include it
   - What's unclear: Whether Google uses AdministrativeArea alongside City entries for the same region
   - Recommendation: Drop it. Once Oslo (City) is in the list, the AdministrativeArea is redundant and adds noise. Keep Country: Norway as the only non-City entry.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection: `src/layouts/BaseLayout.astro` (lines 142–155) — current hardcoded areaServed
- Direct codebase inspection: `astro.config.mjs` (lines 14–24) — existing serialize() pattern
- Direct codebase inspection: `src/config/locations.ts` — ACTIVE_TIER, cities array, filter pattern
- Direct codebase inspection: `src/pages/steder/[location].astro` — confirmed no /steder/ index page exists

### Secondary (MEDIUM confidence)
- CONTEXT.md decisions — user-locked choices, treated as authoritative for this phase

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all patterns verified in existing code
- Architecture: HIGH — both edit targets and their current state confirmed by file inspection
- Pitfalls: HIGH — import path issue and missing index page confirmed by direct inspection

**Research date:** 2026-03-08
**Valid until:** 2026-06-08 (stable patterns, Astro sitemap API unlikely to change)
