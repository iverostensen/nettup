# Phase 11: Enhanced price calculator with multi-step needs assessment - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Enhance the existing PrisKalkulator wizard from a service-first, 1-question-per-service flow into a goal-first, multi-step needs assessment that routes visitors to the right service and gives a tighter price estimate. Scope: the PrisKalkulatorIsland.tsx component only. No new pages, no form integrations, no backend.

</domain>

<decisions>
## Implementation Decisions

### Assessment structure
- Replace the current "which service?" opening with a goal-first question: "Hva er målet ditt?"
- 3 goal options that route to services: e.g. "Få flere kunder til bedriften" → nettside, "Selge produkter på nett" → nettbutikk, "Markedsføre en kampanje" → landingsside
- After goal selection, show a brief service recommendation step ("Vi anbefaler: [Service]" with name + tagline) before narrowing questions
- 2 narrowing questions per service (up from 1) to give a tighter estimate
- Step counter during narrowing: "Spørsmål 1 av 2" (keep existing pattern)

### Service coverage
- Wizard covers only the 3 core services: nettside, nettbutikk, landingsside
- Specialist services (webapp, SEO, AI, vedlikehold) are NOT part of the wizard
- Exactly 3 goal options — no "Noe annet" fallback option

### Result screen
- Add 3-4 "hva er inkludert" bullet points per service, hardcoded in the component (not from services.ts)
- Keep existing: service name, tagline, price estimate, monthly note, "Kom i gang" CTA
- Add secondary text link "Les mer om [Service]" → /tjenester/[slug] alongside the CTA
- "Start på nytt" button remains

### Unknown needs path / Entry framing
- Add intro/framing text above the goal question — not a separate step, just contextual copy
- Include time estimate in intro: e.g. "Svar på 2–3 spørsmål og få et prisestimat — tar under ett minutt"
- No extra "I don't know" path beyond the 3 goal options

### Claude's Discretion
- Exact wording of goal options and intro text
- Specific bullet points for "hva er inkludert" per service
- Exact 2nd narrowing question per service and price estimates for each option
- Animation transitions between the new recommendation step and narrowing steps

</decisions>

<specifics>
## Specific Ideas

- The goal question framing should feel like "What are you trying to achieve?" not "What product do you want to buy?"
- The service recommendation step builds trust — visitor shouldn't be surprised at the result screen to learn which service they're getting priced for
- Intro text should set expectations: quick, 2-3 questions, gets you a real estimate

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PrisKalkulatorIsland.tsx`: 3-phase state machine (pick → narrow → result) with Framer Motion. Full rewrite or extension of this component.
- `src/config/services.ts`: Service interface with slug, name, tagline, priceRange, ctaParam, monthlyPriceLabel — used in the result screen. No changes needed to services.ts.
- `src/lib/animation.ts`: `springs.gentle`, `fadeIn`, `fadeUp` exports used for transitions.

### Established Patterns
- Framer Motion `AnimatePresence mode="wait"` keyed by phase+step for slide transitions
- `slideVariants` with direction (1/-1) for forward/back animations
- `useReducedMotion` guard on all animations
- Dark card style: `rounded-md border border-white/10 bg-surface-raised p-8`
- Button style: `w-full rounded-md border border-white/10 bg-surface-raised p-4 text-left transition-colors hover:border-brand/40 hover:bg-surface-raised/80`

### Integration Points
- Result CTA links to `/kontakt?tjeneste={ctaParam}` — no change needed
- New "Les mer" link to `/tjenester/{slug}` — straightforward
- Component lives on /tjenester page (embedded via Astro island)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 11-enhanced-price-calculator-with-multi-step-needs-assessment*
*Context gathered: 2026-03-05*
