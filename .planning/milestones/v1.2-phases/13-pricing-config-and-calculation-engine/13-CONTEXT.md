# Phase 13: Pricing Config and Calculation Engine - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

All pricing data lives in a single typed config file and a pure engine computes additive estimates from any set of user selections. Covers three service types: nettside, nettbutikk, landingsside. No UI in this phase — just the data model and calculation logic.

</domain>

<decisions>
## Implementation Decisions

### Config structure
- Create a new `src/config/pricing-config.ts` as the single source of truth for all pricing data
- `services.ts` keeps non-pricing metadata (slug, tagline, description, related services)
- Old `pricing.ts` (package model: Enkel/Standard/Premium) stays alive until Phase 16 removes the old wizard
- Three service types: nettside, nettbutikk, landingsside (not webapp — roadmap mention was shorthand)

### Add-on categories
- Config categories mirror the wizard flow steps: size, features, integrations, design
- **Size** (single-select): Page-count tiers — Small (1-5 sider), Medium (6-15 sider), Large (16+)
  - Each service type has its own size tiers with appropriate labels
- **Features** (multi-select): Broader set including CMS, kontaktskjema, SEO-optimalisering, animasjoner, analytics-oppsett, blogg, flerspraklig, booking-system, nyhetsbrev, brukerpanel/innlogging
  - Available features vary per service type
- **Integrations** (multi-select): Service-specific integration options (e.g., Vipps, regnskap/ERP for nettbutikk)
- **Design** (single-select): Three levels — Standard (clean template-tilpasset), Skreddersydd (custom design), Premium (custom + animasjoner/interaksjoner)

### Price range model
- Each add-on has a **fixed price** (not a range) — clear line items in result
- Min-max range comes from the base/size tier (Claude's discretion on whether size tier has a range or a spread percentage is applied)
- Add-ons contribute to **one-time costs only** — monthly cost breakdown is a v1.3 future requirement
- Engine output includes a **flat monthly cost** per service type (not broken down by add-ons)

### Discount mechanics
- 40% launch discount applied to the **total one-time price** (not per line item)
- Discount config (percentage, label, active flag) lives inside the pricing config file — one file for all pricing changes
- When launch offer expires (active=false): full price, no fallback discount
- Engine output includes **both** original and discounted totals (min-max each), plus discountPercent and discountActive — so Phase 15 can show crossed-out original price

### Claude's Discretion
- Internal config structure (flat vs nested, how categories are organized within the file)
- Whether min-max comes from size tier ranges or a spread percentage on fixed totals
- Exact add-on options and prices per service type (reasonable Norwegian SMB pricing)
- TypeScript type design for the config and engine interfaces
- Test strategy for the pure calculation function

</decisions>

<specifics>
## Specific Ideas

- "Adding or changing a price requires editing only the config file — zero UI code changes needed" (from success criteria)
- Config should be developer-friendly since it IS the internal admin tool (no admin UI planned)
- The engine is a pure function: takes service type + selections in, returns estimate out — no side effects

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/config/services.ts`: Service interface and `LAUNCH_DISCOUNT = 0.4` constant — services.ts keeps metadata, new config takes over pricing
- `src/config/launchOffer.ts`: Launch slot tracker (total/taken) — may be consolidated into new pricing config or kept separate for slot tracking
- `src/lib/utils.ts`: Utility functions available for shared helpers

### Established Patterns
- Config files in `src/config/` with TypeScript interfaces exported alongside data
- React islands pattern for interactive components (`src/components/islands/`)
- Framer Motion for animations with `prefers-reduced-motion` support

### Integration Points
- Phase 14 wizard will import the config to render step options
- Phase 15 result display will consume engine output (line items, totals, discount info)
- Phase 16 will replace `PrisKalkulatorIsland.tsx` and delete old `pricing.ts`
- `services.ts` continues to provide non-pricing metadata (slug, tagline, ctaParam)

</code_context>

<deferred>
## Deferred Ideas

- Monthly cost breakdown per add-on — RES-FUTURE-01, v1.3 candidate
- Descriptions per option explaining what each feature means — RES-FUTURE-02, v1.3 candidate

</deferred>

---

*Phase: 13-pricing-config-and-calculation-engine*
*Context gathered: 2026-03-06*
