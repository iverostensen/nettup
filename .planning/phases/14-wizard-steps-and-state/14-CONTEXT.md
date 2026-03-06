# Phase 14: Wizard Steps and State - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Multi-step wizard UI with category-based flow (Goal -> Size -> Features -> Integrations -> Design -> Result), back navigation with preserved selections, progress indicator, and appropriate selection modes per step. Result display and page integration are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Selection UI patterns
- Toggle cards for multi-select steps (features, integrations) — card toggles on/off with check icon and brand border highlight
- Price shown on each card (e.g. "+ 3 000 kr" for features/integrations)
- "Neste" button below options for multi-select steps — always visible even with 0 selections (features are optional)
- Single-select for size and design steps — Claude's discretion on auto-advance vs manual

### Progress indicator
- Numbered stepper bar with circles connected by lines, 6 steps total (including Result)
- Current step highlighted in brand color, completed steps filled
- Completed steps are clickable for back-navigation (jump to any previous step)
- Labels shown on desktop ("Mal", "Storrelse", "Funksjoner", etc.), numbers only on mobile
- Result included as step 6 in the stepper for visual closure

### Step transitions & flow
- Remove the old "recommend" intermediate step — go straight from Goal -> Size
- Flow: Goal (1) -> Size (2) -> Features (3) -> Integrations (4) -> Design (5) -> Result (6)
- Reverse slide direction on back-navigation (forward = slide left, back = slide right) using Framer Motion
- Dedicated "Tilbake" button shown alongside clickable stepper for easy one-step-back on mobile
- Goal step keeps current 3-card layout with label + sublabel for service type selection

### Option presentation
- Cards show label + price (no descriptions — that's a v1.3 candidate per RES-FUTURE-02)
- Size cards show the min-max price range (e.g. "8 000 - 12 000 kr")
- Long feature lists (up to 10 items) displayed in 2-column grid on desktop, 1-column on mobile — all visible, no hiding
- Step headings use question format (e.g. "Hvor stor er nettsiden?", "Hvilke funksjoner trenger du?") — conversational tone

### Claude's Discretion
- Single-select advance behavior (auto-advance on click vs manual "Neste")
- Exact card dimensions, spacing, and responsive breakpoints
- Animation timing and spring config
- Step heading wording for each step
- "Tilbake" button placement and styling
- How to visually indicate toggle state on selected cards

</decisions>

<specifics>
## Specific Ideas

- Keep the existing card style from the old wizard (rounded, border-white/10, hover:border-brand/40) for consistency
- Question format matches old wizard tone ("Hva er malet ditt?", "Hvor mange sider trenger du?")
- The pricing-config.ts already has all data structured per step — wizard reads directly from config

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PrisKalkulatorIsland.tsx`: Existing wizard with Framer Motion AnimatePresence, slide variants, direction state — can be refactored/replaced
- `pricing-config.ts`: Full typed config with sizes[], features[], integrations[], designs[] per ServiceType — wizard reads from this directly
- `calculate-estimate.ts`: Takes EstimateRequest (serviceType, sizeId, featureIds[], integrationIds[], designId) — wizard state maps 1:1 to this interface
- Framer Motion `springs.gentle` and `fadeUp`/`fadeIn` variants from `@/lib/animation`

### Established Patterns
- React islands in `src/components/islands/` with `client:load` or `client:visible`
- Dark theme: `bg-surface-raised`, `border-white/10`, `text-brand` for accents
- `useReducedMotion()` hook for accessibility
- Button-card pattern: `rounded-md border border-white/10 bg-surface-raised p-4 hover:border-brand/40`

### Integration Points
- Wizard component lives in `src/components/islands/` as a React island
- Consumed by `src/pages/tjenester/_sections/PrisKalkulator.astro`
- EstimateResult from calculate-estimate.ts feeds into Phase 15 (Result Display)
- Goal step service selection maps to `ServiceType` from pricing-config

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 14-wizard-steps-and-state*
*Context gathered: 2026-03-06*
