# Phase 15: Result Display - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Users see a transparent, itemized price estimate with launch discount and a clear path to contact Nettup. This phase builds the ResultStep component inside the existing wizard. Page integration and old wizard replacement are Phase 16.

</domain>

<decisions>
## Implementation Decisions

### Line-item breakdown
- Grouped by category: Storrelse, Funksjoner, Integrasjoner, Design
- Hide empty categories (if no integrations selected, skip that group)
- Size tier shows min-max range inline: "6-15 sider: 15 000 - 25 000 kr"
- Add-ons show fixed price: "CMS: 3 000 kr"
- Summary total line at bottom with horizontal separator above it

### Discount presentation
- Highlighted with "Lanseringstilbud" badge + crossed-out original price + discounted price in brand color
- Explicit savings line: "Spar X 000 - Y 000 kr" in green
- When discount is inactive (discount.active = false): show clean price only — no strikethrough, no badge, no savings line

### CTA and actions
- Three actions available:
  1. Primary: "Kontakt oss for tilbud" button linking to /kontakt?tjeneste={serviceType}&estimat={min}-{max}
  2. Secondary: "Beregn pa nytt" to reset wizard
  3. Tertiary: "Kopier estimat" icon/button that copies plain text summary to clipboard
- Contact link navigates in same tab (not new tab)
- Clipboard copy format: readable plain text with service type, selections, total, and nettup.no/kontakt URL

### Monthly cost
- Separate section below the one-time total, visually distinct
- Short label: "Drift og hosting" — no bullet list of what's included
- Monthly cost is NOT subject to the launch discount (one-time prices only, matches current engine)

### Disclaimer
- Short muted text below the estimate: "Dette er et estimat — endelig pris avhenger av prosjektets omfang."

### Claude's Discretion
- Exact layout spacing and typography within the result card
- Animation for result appearance (entrance transition)
- Clipboard copy feedback (toast, icon change, etc.)
- Exact wording of CTA button labels

</decisions>

<specifics>
## Specific Ideas

- Contact CTA pre-fills both service type AND estimate range via query parameters
- Clipboard copy includes a link to nettup.no/kontakt so the recipient can easily reach out
- The result lives inside the existing wizard card container (bg-surface-raised, border-white/10)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `calculateEstimate()` (src/lib/calculate-estimate.ts): Returns lineItems, oneTime, discounted, monthly, discountPercent, discountActive — all data the result needs
- `PriceDisplay.astro` (src/components/ui/PriceDisplay.astro): Has strikethrough + savings + monthly pattern — needs a React equivalent for the wizard island
- `WizardStepper` + slide animation: Result step slot already exists in SmartPrisKalkulator.tsx (case 'result' placeholder)

### Established Patterns
- Wizard steps are React components receiving props from the reducer state
- All wizard content renders inside a rounded card with `bg-surface-raised p-6 sm:p-8`
- Framer Motion slide transitions between steps (AnimatePresence + motion.div)
- Brand color for accent: `text-brand` / `bg-brand` (cyan)

### Integration Points
- SmartPrisKalkulator.tsx case 'result': Replace placeholder with ResultStep component
- WizardState has all selection data needed to call calculateEstimate()
- /kontakt page needs to accept ?tjeneste= and ?estimat= query parameters (Phase 16 may handle the full form pre-fill)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 15-result-display*
*Context gathered: 2026-03-06*
