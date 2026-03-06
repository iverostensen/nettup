# Phase 11: Enhanced Price Calculator with Multi-Step Needs Assessment - Research

**Researched:** 2026-03-05
**Domain:** React state machine / Framer Motion wizard UX / Norwegian web agency pricing copy
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Replace the current "which service?" opening with a goal-first question: "Hva er målet ditt?"
- 3 goal options that route to services: e.g. "Få flere kunder til bedriften" -> nettside, "Selge produkter på nett" -> nettbutikk, "Markedsføre en kampanje" -> landingsside
- After goal selection, show a brief service recommendation step ("Vi anbefaler: [Service]" with name + tagline) before narrowing questions
- 2 narrowing questions per service (up from 1) to give a tighter estimate
- Step counter during narrowing: "Sporsmal 1 av 2" (keep existing pattern)
- Wizard covers only the 3 core services: nettside, nettbutikk, landingsside
- Specialist services (webapp, SEO, AI, vedlikehold) are NOT part of the wizard
- Exactly 3 goal options -- no "Noe annet" fallback option
- Add 3-4 "hva er inkludert" bullet points per service, hardcoded in the component (not from services.ts)
- Keep existing: service name, tagline, price estimate, monthly note, "Kom i gang" CTA
- Add secondary text link "Les mer om [Service]" -> /tjenester/[slug] alongside the CTA
- "Start pa nytt" button remains
- Add intro/framing text above the goal question -- not a separate step, just contextual copy
- Include time estimate in intro: e.g. "Svar pa 2-3 sporsmal og fa et prisestimat -- tar under ett minutt"
- No extra "I don't know" path beyond the 3 goal options

### Claude's Discretion
- Exact wording of goal options and intro text
- Specific bullet points for "hva er inkludert" per service
- Exact 2nd narrowing question per service and price estimates for each option
- Animation transitions between the new recommendation step and narrowing steps

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

---

## Summary

This phase is a self-contained rewrite of `PrisKalkulatorIsland.tsx`. No new dependencies, no backend changes, no services.ts changes. The existing Framer Motion `AnimatePresence mode="wait"` + `slideVariants` pattern extends naturally to 4 phases instead of 3. The new `recommend` phase is the only structural addition to the state machine.

The primary design challenge is content: goal option wording, 2nd narrowing questions per service, price estimates, "hva er inkludert" bullets, and recommendation step copy. All of this is hardcoded in the component. The research below provides concrete copy ready for implementation.

The price model uses standalone Q2 prices -- Q2 adds a new dimension (CMS vs static, integrations vs standalone, campaign vs permanent) rather than combining with Q1 multiplicatively. This keeps the implementation simple while still delivering the "tighter estimate" requirement. The `handleNarrowOption` logic already supports multiple questions -- only the last question's price is stored as the result.

**Primary recommendation:** Extend the existing state machine to 4 phases (`goal -> recommend -> narrow -> result`), add a second narrowing question to each service's `narrowingQuestions` array, and hardcode content (bullets, copy, goal options) directly in the component.

---

## Standard Stack

### Core (unchanged -- no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | existing | Component state management | Already in project |
| Framer Motion | existing | Animated phase transitions | Already used in this component |
| TypeScript strict | existing | Type safety for state machine | Project requirement |

**No new installations required.** This phase adds no dependencies.

---

## Architecture Patterns

### State Machine Shape

Current state machine has 3 phases: `pick -> narrow -> result`

New state machine: `goal -> recommend -> narrow -> result`

```typescript
type Phase = 'goal' | 'recommend' | 'narrow' | 'result';

interface State {
  phase: Phase;
  selectedService: ServiceSlug | null;
  narrowStep: number;
  priceEstimate: string | null;
  monthlyNote?: string;
}
```

No additional state fields needed. Q1 and Q2 operate independently -- Q2's `priceEstimate` is the final result price. The existing `handleNarrowOption` already only stores price when `nextStep >= questions.length`, so adding Q2 to each service's question array works without logic changes.

### Phase Transition Logic

```
goal      -> user clicks goal option       -> set selectedService, advance to 'recommend'
recommend -> user clicks "Se sporsmaalene" -> advance to 'narrow' (narrowStep: 0)
narrow    -> option at narrowStep 0        -> narrowStep = 1 (no price stored yet)
narrow    -> option at narrowStep 1        -> advance to 'result', set priceEstimate from Q2 option
result    -> "Start pa nytt"               -> reset to initialState (goal phase)
```

No "back" button. Only "Start pa nytt" resets to the beginning.

### Animation Key Strategy

```typescript
const animKey =
  state.phase === 'goal'      ? 'goal'
  : state.phase === 'recommend' ? 'recommend'
  : state.phase === 'narrow'    ? `narrow-${state.narrowStep}`
  : 'result';
```

This ensures `AnimatePresence mode="wait"` triggers a new animation on every phase and step change. Direction is always forward (`1`) for goal -> recommend -> narrow -> result. Direction `-1` only on reset.

### Recommendation Step Pattern

Same `slideVariants` + `springs.gentle` as all other phases. Not a modal or overlay -- it is a full phase transition with the same card shell. Single "Se sporsmaalene" button to proceed (no auto-advance).

---

## Concrete Content Specification

### Goal Options (Phase: goal)

**Intro text** (rendered above the buttons within the goal card, not a separate step):
> Svar pa 2-3 sporsmal og fa et prisestimat -- tar under ett minutt.

**Question heading:**
> Hva er malet ditt?

**Goal options:**

| Label | Sub-label | Routes to |
|-------|-----------|-----------|
| Fa flere kunder til bedriften | Profesjonell nettside som konverterer besokende | nettside |
| Selge produkter pa nett | Komplett nettbutikk med betaling og lagerstyring | nettbutikk |
| Markedsfore en kampanje eller tilbud | En fokusert landingsside som overbeviser | landingsside |

**Confidence:** HIGH -- derived from services.ts taglines and CONTEXT.md examples.

### Recommendation Step (Phase: recommend)

**Label** (small caps, brand color): `Vi anbefaler`
**Content:** Service name (large) + tagline (muted)
**Reassurance:** `Basert pa malet ditt er dette det beste utgangspunktet. La oss finne riktig pris.`
**CTA button:** `Se sporsmaalene ->` (outline style, not filled brand button)

### Narrowing Questions (2 per service)

```
nettside:
  Q1: "Hvor mange sider trenger du?"
      - "1-5 sider (enkel presentasjon)"
      - "6-15 sider (komplett nettsted)"
      - "16+ sider (stort nettsted)"
  Q2: "Trenger du a kunne oppdatere innholdet selv?"
      - "Nei, jeg bytter sjelden innhold"    -> fra 8 000 kr
      - "Ja, med et enkelt CMS-panel"        -> fra 12 000 kr

nettbutikk:
  Q1: "Hvor mange produkter skal du selge?"
      - "Under 50 produkter"
      - "50-500 produkter"
      - "500+ produkter"
  Q2: "Trenger du integrasjon med eksisterende systemer?"
      - "Nei, jeg starter fra scratch"                   -> fra 15 000 kr
      - "Ja, koble til regnskapsprogram eller ERP"       -> fra 28 000 kr

landingsside:
  Q1: "Trenger du integrasjoner? (booking, betaling, skjema)"
      - "Nei, bare tekst og bilder"
      - "Ja, en eller flere integrasjoner"
  Q2: "Hva er formalet med siden?"
      - "Kampanjeside (for annonser, kortvarig)"  -> fra 4 500 kr
      - "Permanent side med SEO-fokus"            -> fra 7 500 kr
```

**Price model:** Q2 prices are standalone -- they represent the final estimate shown on the result screen. Q1 captures scope context (size, complexity) but does not influence the displayed price. The existing `handleNarrowOption` stores price only from the last question, so Q1 options should have `priceEstimate: ''` (empty string, never displayed).

### "Hva er inkludert" Bullets (Result Screen)

Sourced from existing Inkludert.astro sections. 3-4 high-value items per service:

**nettside** (4 bullets):
1. Responsivt design -- mobil, tablet og desktop
2. Skreddersydd design -- ingen maler
3. Grunnleggende SEO og kontaktskjema
4. 30 dagers support etter lansering

**nettbutikk** (4 bullets):
1. Shopify-oppsett med Vipps og kortbetaling
2. Produktkatalog og handlekurv
3. Lagerstyring og ordrehandtering
4. 30 dagers support etter lansering

**landingsside** (3 bullets):
1. Konverteringsfokusert layout
2. Hurtig lasting -- under 1 sekund
3. Kontaktskjema eller lead-capture

**Confidence:** HIGH -- sourced directly from Inkludert.astro files in the codebase.

---

## Code Examples

### Goal Options Data Shape

```typescript
// Source: PrisKalkulatorIsland.tsx pattern
interface GoalOption {
  label: string;
  subLabel: string;
  service: ServiceSlug;
}

const goalOptions: GoalOption[] = [
  {
    label: 'Fa flere kunder til bedriften',
    subLabel: 'Profesjonell nettside som konverterer besokende',
    service: 'nettside',
  },
  {
    label: 'Selge produkter pa nett',
    subLabel: 'Komplett nettbutikk med betaling og lagerstyring',
    service: 'nettbutikk',
  },
  {
    label: 'Markedsfore en kampanje eller tilbud',
    subLabel: 'En fokusert landingsside som overbeviser',
    service: 'landingsside',
  },
];
```

### Included Items Data Shape

```typescript
const includedItems: Record<ServiceSlug, string[]> = {
  nettside: [
    'Responsivt design -- mobil, tablet og desktop',
    'Skreddersydd design -- ingen maler',
    'Grunnleggende SEO og kontaktskjema',
    '30 dagers support etter lansering',
  ],
  nettbutikk: [
    'Shopify-oppsett med Vipps og kortbetaling',
    'Produktkatalog og handlekurv',
    'Lagerstyring og ordrehandtering',
    '30 dagers support etter lansering',
  ],
  landingsside: [
    'Konverteringsfokusert layout',
    'Hurtig lasting -- under 1 sekund',
    'Kontaktskjema eller lead-capture',
  ],
};
```

### Checkmark SVG Icon (for included items list)

Reuse the exact SVG from Inkludert.astro sections:

```tsx
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5 shrink-0 text-brand" aria-hidden="true">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
</svg>
```

Note: JSX uses `strokeWidth`, `strokeLinecap`, `strokeLinejoin` (camelCase) vs Astro's `stroke-width` etc.

### Recommendation Step JSX Pattern

```tsx
// Source: existing component pattern (PrisKalkulatorIsland.tsx)
{state.phase === 'recommend' && selectedServiceData && (
  <motion.div
    key="recommend"
    custom={direction}
    variants={slideVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={springs.gentle}
    className="rounded-md border border-white/10 bg-surface-raised p-8"
  >
    <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand">
      Vi anbefaler
    </p>
    <h3 className="mb-1 text-xl font-bold text-text">{selectedServiceData.name}</h3>
    <p className="mb-4 text-text-muted">{selectedServiceData.tagline}</p>
    <p className="mb-6 text-sm text-text-muted">
      Basert pa malet ditt er dette det beste utgangspunktet. La oss finne riktig pris.
    </p>
    <button
      onClick={handleRecommendContinue}
      className="w-full rounded-md border border-white/10 bg-surface-raised p-4 text-center font-semibold text-text transition-colors hover:border-brand/40 hover:bg-surface-raised/80"
    >
      Se sporsmaalene ->
    </button>
  </motion.div>
)}
```

### Result Screen Additions

Included items list between price and CTA:

```tsx
<ul className="mb-6 flex flex-col gap-2">
  {includedItems[state.selectedService!].map((item) => (
    <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4 shrink-0 text-brand" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
      {item}
    </li>
  ))}
</ul>
```

"Les mer" link in CTA row (alongside "Kom i gang" and "Start pa nytt"):

```tsx
<a
  href={`/tjenester/${selectedServiceData.slug}`}
  className="text-sm text-text-muted underline-offset-2 transition-colors hover:text-text hover:underline"
>
  Les mer om {selectedServiceData.name.toLowerCase()}
</a>
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Animated transitions | Custom CSS keyframes | Framer Motion (already present) | Already in project, handles reduced motion |
| State machine | XState or custom reducer | `useState` with explicit phase field | Wizard is simple enough; useState is readable and already used |
| Checkmark icon | Icon library import | Inline SVG path | Matches existing Inkludert.astro pattern, no dependency |

**Key insight:** The wizard has 4 linear phases with no branching complexity beyond goal->service routing. `useState` + explicit `phase` field is correct -- no need for a state machine library.

---

## Common Pitfalls

### Pitfall 1: animKey collision between phases
**What goes wrong:** If `goal` and `recommend` use the same key, `AnimatePresence` won't trigger exit/enter animations -- content just swaps instantly.
**Why it happens:** Developer forgets to add a unique key for new phases.
**How to avoid:** Ensure `animKey` covers all 4 phases with unique strings.
**Warning signs:** Phase transition appears instant (no slide animation) when moving goal -> recommend.

### Pitfall 2: Q1 price stored prematurely
**What goes wrong:** If `handleNarrowOption` stores `option.priceEstimate` at Q1 and Q1 options have placeholder prices, the result screen shows the wrong price.
**Why it happens:** The existing logic only stores price when `nextStep >= questions.length` -- this is correct. But Q1 options should have `priceEstimate: ''` to prevent confusion.
**How to avoid:** Set Q1 `priceEstimate` to empty string. Only Q2 options carry real prices.

### Pitfall 3: Old "Hvilken tjeneste?" heading left in JSX
**What goes wrong:** The old `pick` phase heading appears instead of the new goal question.
**Why it happens:** Copy-paste from old phase.
**How to avoid:** Delete the `pick` phase JSX entirely. Replace with `goal` phase.

### Pitfall 4: "Les mer om" link capitalization
**What goes wrong:** "Les mer om Nettside" (capital N from services.ts) looks odd mid-sentence.
**Why it happens:** `selectedServiceData.name` is title-cased.
**How to avoid:** Use `.toLowerCase()`: `Les mer om ${selectedServiceData.name.toLowerCase()}`.

### Pitfall 5: SVG attributes not camelCased in JSX
**What goes wrong:** `stroke-width`, `stroke-linecap`, `stroke-linejoin` cause React warnings.
**Why it happens:** Copying SVG from Astro (HTML attributes) into React (JSX attributes).
**How to avoid:** Use `strokeWidth`, `strokeLinecap`, `strokeLinejoin` in JSX.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Service-first wizard ("Which service?") | Goal-first wizard ("What's your goal?") | Phase 11 | Better conversion -- users identify with goals, not product names |
| 1 narrowing question | 2 narrowing questions | Phase 11 | Tighter price estimate, more trust in result |
| No "what's included" in result | 3-4 bullet points in result | Phase 11 | Reduces uncertainty before clicking "Kom i gang" |
| No service recommendation step | Explicit "Vi anbefaler" confirmation | Phase 11 | Builds trust, visitor not surprised at result service |

---

## Open Questions

1. **Should Q1 answers influence Q2 prices?**
   - What we know: CONTEXT.md says "tighter estimate" but does not specify a price matrix
   - What's unclear: Whether Q1 x Q2 combined pricing is expected or just two independent dimensions
   - Recommendation: Use standalone Q2 prices. The "tighter estimate" is achieved by Q2 adding a new dimension. If combined pricing is needed later, add a `q1ChoiceIndex` to state and use a lookup table. Leave a code comment noting this option.

---

## Sources

### Primary (HIGH confidence)
- `src/components/islands/PrisKalkulatorIsland.tsx` -- current component: state shape, animation pattern, handler logic, JSX structure
- `src/config/services.ts` -- service data: slugs, names, taglines, monthlyPriceLabel (3 core services only in working copy)
- `src/lib/animation.ts` -- animation presets: springs.gentle, fadeIn, fadeUp, slideVariants pattern
- `src/pages/tjenester/nettside/_sections/Inkludert.astro` -- nettside included features (8 items, 4 selected)
- `src/pages/tjenester/nettbutikk/_sections/Inkludert.astro` -- nettbutikk included features (8 items, 4 selected)
- `src/pages/tjenester/landingsside/_sections/Inkludert.astro` -- landingsside included features (8 items, 3 selected)
- `.planning/phases/11-enhanced-price-calculator-with-multi-step-needs-assessment/11-CONTEXT.md` -- locked decisions and discretion areas

### Secondary (MEDIUM confidence)
- Project CLAUDE.md -- animation usage guidance (Framer Motion, useReducedMotion pattern)
- STATE.md -- accumulated decisions (services.ts role, ?tjeneste= param, maxPrice:0 pattern)

### Tertiary (LOW confidence)
None -- all research based on codebase inspection, not web search.

---

## Metadata

**Confidence breakdown:**
- State machine shape: HIGH -- derived from existing code, extends cleanly
- Content copy (goal options, bullets): HIGH -- sourced from existing Inkludert.astro and services.ts
- Price estimates: MEDIUM -- consistent with existing ranges but exact figures are business judgment
- Animation approach: HIGH -- directly mirrors existing patterns in the component

**Research date:** 2026-03-05
**Valid until:** Stable -- no external dependencies; valid until component is refactored
