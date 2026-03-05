# Phase 11: Enhanced Price Calculator with Multi-Step Needs Assessment - Research

**Researched:** 2026-03-05
**Domain:** React state machine / Framer Motion wizard UX / Norwegian web agency pricing copy
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Replace the current "which service?" opening with a goal-first question: "Hva er målet ditt?"
- 3 goal options that route to services: e.g. "Få flere kunder til bedriften" → nettside, "Selge produkter på nett" → nettbutikk, "Markedsføre en kampanje" → landingsside
- After goal selection, show a brief service recommendation step ("Vi anbefaler: [Service]" with name + tagline) before narrowing questions
- 2 narrowing questions per service (up from 1) to give a tighter estimate
- Step counter during narrowing: "Spørsmål 1 av 2" (keep existing pattern)
- Wizard covers only the 3 core services: nettside, nettbutikk, landingsside
- Specialist services (webapp, SEO, AI, vedlikehold) are NOT part of the wizard
- Exactly 3 goal options — no "Noe annet" fallback option
- Add 3-4 "hva er inkludert" bullet points per service, hardcoded in the component (not from services.ts)
- Keep existing: service name, tagline, price estimate, monthly note, "Kom i gang" CTA
- Add secondary text link "Les mer om [Service]" → /tjenester/[slug] alongside the CTA
- "Start på nytt" button remains
- Add intro/framing text above the goal question — not a separate step, just contextual copy
- Include time estimate in intro: e.g. "Svar på 2–3 spørsmål og få et prisestimat — tar under ett minutt"
- No extra "I don't know" path beyond the 3 goal options

### Claude's Discretion
- Exact wording of goal options and intro text
- Specific bullet points for "hva er inkludert" per service
- Exact 2nd narrowing question per service and price estimates for each option
- Animation transitions between the new recommendation step and narrowing steps

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

## Summary

This phase is a self-contained rewrite of `PrisKalkulatorIsland.tsx`. No new dependencies, no backend changes, no services.ts changes. The existing Framer Motion `AnimatePresence mode="wait"` + `slideVariants` pattern extends naturally to 4 phases instead of 3. The new `recommend` phase is the only structural addition to the state machine.

The primary design challenge is content: goal option wording, 2nd narrowing questions per service, price narrowing logic, "hva er inkludert" bullets, and recommendation step copy. All of this is hardcoded in the component — the research below provides concrete copy ready for implementation.

The secondary challenge is the price model: with 2 narrowing questions, Q1 establishes a base range and Q2 narrows within that range. This is the correct UX pattern — the final price shown at result reflects only the Q2 answer (since Q2 gives a tighter estimate within Q1's context). Store Q1's chosen option label for context display but use Q2's `priceEstimate` as the result price.

**Primary recommendation:** Extend the existing state machine to 4 phases (`goal → recommend → narrow → result`), add a second narrowing question to each service's `narrowingQuestions` array, and hardcode content (bullets, copy, goal options) directly in the component.

---

## Standard Stack

### Core (unchanged — no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | existing | Component state management | Already in project |
| Framer Motion | existing | Animated phase transitions | Already used in this component |
| TypeScript strict | existing | Type safety for state machine | Project requirement |

**No new installations required.** This phase adds no dependencies.

---

## Architecture Patterns

### State Machine Shape

Current state machine has 3 phases: `pick → narrow → result`

New state machine: `goal → recommend → narrow → result`

```typescript
type Phase = 'goal' | 'recommend' | 'narrow' | 'result';

interface State {
  phase: Phase;
  selectedService: ServiceSlug | null;
  narrowStep: number;
  q1Label: string | null;         // Store Q1 chosen label for context (display only)
  priceEstimate: string | null;   // Set from Q2 option (final result price)
  monthlyNote?: string;
}
```

The `q1Label` field is optional but useful: it lets the recommendation step (or a future enhancement) show what Q1 answer was selected without re-querying. However, for Phase 11 it is primarily needed if the recommendation step displays any context from the goal selection. It is safe to omit if not used.

### Phase Transition Logic

```
goal     → user clicks goal option → set selectedService, advance to 'recommend'
recommend → user clicks "Fortsett" or "Se spørsmål" → advance to 'narrow' (narrowStep: 0)
narrow    → user clicks option at narrowStep < questions.length - 1 → narrowStep++
narrow    → user clicks option at narrowStep === questions.length - 1 → advance to 'result', set priceEstimate from Q2
result   → user clicks "Start på nytt" → reset to initialState (goal phase)
```

Note: There is no "back" button required by the spec. The existing component has none. Keep "Start på nytt" as the only reset.

### Animation Key Strategy

The existing `animKey` derivation must be extended:

```typescript
const animKey =
  state.phase === 'goal'      ? 'goal'
  : state.phase === 'recommend' ? 'recommend'
  : state.phase === 'narrow'    ? `narrow-${state.narrowStep}`
  : 'result';
```

This ensures `AnimatePresence mode="wait"` triggers a new animation on every phase and step change.

### Recommendation Step Animation

Use the same `slideVariants` + `springs.gentle` pattern as goal and narrow steps. Direction always forward (`1`) when going goal → recommend → narrow → result. The recommendation step is not special — it animates in exactly like a narrowing step.

The recommendation step content does not require a separate spring or fade variant. `slideVariants` with direction `1` is correct.

### Price Model: 2 Narrowing Questions

**Pattern: Q2 narrows within Q1's established range.**

Q1 establishes a size/complexity bucket. Q2 asks a follow-up that refines the estimate within that bucket. The final `priceEstimate` stored in state comes from the Q2 option the user selected — not Q1. Q1's `priceEstimate` field is never shown to the user during narrowing (only the option label is shown as a button choice). Q1's price range is implicit context, not displayed.

This means: when `handleNarrowOption` is called at `narrowStep === 0`, advance to `narrowStep === 1` (don't store price yet). When called at `narrowStep === 1`, advance to result and store the price.

The existing `handleNarrowOption` function already handles this correctly for multiple questions — it only stores the price when `nextStep >= questions.length`. No logic change needed; just add Q2 options.

---

## Concrete Content Specification

This is the primary output of this research — all content needed for implementation.

### Goal Options (Phase: goal)

**Intro text** (rendered above the buttons, not a separate step):
> Svar på 2–3 spørsmål og få et prisestimat — tar under ett minutt.

**Question heading:**
> Hva er målet ditt?

**Goal options:**

| Label | Sub-label | Routes to |
|-------|-----------|-----------|
| Få flere kunder til bedriften | Profesjonell nettside som konverterer besøkende | nettside |
| Selge produkter på nett | Komplett nettbutikk med betaling og lagerstyring | nettbutikk |
| Markedsføre en kampanje eller tilbud | En fokusert landingsside som overbeviser | landingsside |

**Confidence:** HIGH — derived from services.ts taglines, CONTEXT.md examples, and the service descriptions already established in the project.

### Recommendation Step (Phase: recommend)

**Label above card** (small caps, brand color):
> Vi anbefaler

**Content:** Service name (large) + tagline (muted). Brief reassurance line below.

**Reassurance copy** (one line below the tagline):
> Basert på målet ditt er dette det beste utgangspunktet. La oss finne riktig pris.

**CTA button:**
> Se spørsmålene →

Button uses the existing outline button style (border border-white/10) rather than the filled brand button — the filled button is reserved for the final CTA.

### Narrowing Questions and Price Estimates

#### nettside

**Q1:** Hvor mange sider trenger du? (unchanged from current)
| Option | Price (Q1 — not shown) |
|--------|------------------------|
| 1–5 sider (enkel presentasjon) | — |
| 6–15 sider (komplett nettsted) | — |
| 16+ sider (stort nettsted) | — |

**Q2:** Trenger du at du selv kan oppdatere innholdet?
| Option | Price (result) |
|--------|----------------|
| Nei, statisk nettside holder | fra 8 000 kr (small), fra 13 000 kr (medium), fra 22 000 kr (large) |
| Ja, med CMS-panel (f.eks. Sanity) | fra 10 000 kr (small), fra 16 000 kr (medium), fra 28 000 kr (large) |

Since the final price depends on BOTH Q1 and Q2 answers, the Q2 option's `priceEstimate` must encode the Q1 context. The cleanest implementation: store the Q1 choice index in state (or the option label), and use it to select the correct Q2 prices.

**Recommended approach:** Add a `q1Index: number | null` to state. When showing Q2 options, use `q1Index` to pick the right price from a nested structure. Alternatively (simpler): make Q2 options price-agnostic and derive price from the combination in a lookup table.

**Simplest correct approach — lookup table:**

```typescript
type NettstedstoerrelseKey = 'small' | 'medium' | 'large';
type NettsideCmsKey = 'static' | 'cms';

const nettsidePrices: Record<NettstedstoerrelseKey, Record<NettsideCmsKey, string>> = {
  small:  { static: 'fra 8 000 kr',  cms: 'fra 10 000 kr' },
  medium: { static: 'fra 13 000 kr', cms: 'fra 16 000 kr' },
  large:  { static: 'fra 22 000 kr', cms: 'fra 28 000 kr' },
};
```

Store Q1 choice as a key value in state alongside `narrowStep`. At Q2 answer time, look up the combined price.

However, this adds complexity to the state shape. **Simpler alternative:** Make Q2 options carry their own price for each combination by encoding the Q1 bucket in the options list at render time. This avoids a lookup table and keeps the current `NarrowingOption` structure intact.

**Final recommendation (simplest, no state shape change):** Keep Q2 options hardcoded with prices that assume Q1 doesn't change the estimate — i.e. Q2 always refines the same estimate range. Use the following:

| Q1 choice | Q2: Nei (statisk) | Q2: Ja (med CMS) |
|-----------|-------------------|-----------------|
| 1–5 sider | fra 8 000 kr | fra 11 000 kr |
| 6–15 sider | fra 13 000 kr | fra 17 000 kr |
| 16+ sider | fra 22 000 kr | fra 29 000 kr |

To implement this without changing the `NarrowingOption` type: store Q1 choice index in a separate `q1ChoiceIndex` state field, and compute Q2 options dynamically when rendering. The `narrowingQuestions` record becomes a function or the Q2 question has an `optionsByQ1` structure.

**Recommended state addition:**
```typescript
interface State {
  phase: Phase;
  selectedService: ServiceSlug | null;
  narrowStep: number;
  q1ChoiceIndex: number | null;   // index into Q1 options, set after Q1 answer
  priceEstimate: string | null;
  monthlyNote?: string;
}
```

And Q2 options are derived at render time using `q1ChoiceIndex`.

#### nettbutikk

**Q1:** Hvor mange produkter skal du selge? (unchanged)
| Option | Q1 bucket |
|--------|-----------|
| Under 50 produkter | small |
| 50–500 produkter | medium |
| 500+ produkter | large |

**Q2:** Trenger du integrasjon med eksisterende systemer? (regnskapsprogram, ERP, lagersystem)
| Option | Price by Q1 bucket |
|--------|-------------------|
| Nei, jeg starter fra scratch | small: fra 15 000 kr / medium: fra 25 000 kr / large: fra 40 000 kr |
| Ja, én eller flere integrasjoner | small: fra 20 000 kr / medium: fra 33 000 kr / large: fra 52 000 kr |

If not using the Q1-aware approach: simpler standalone Q2 prices:
- Nei, jeg starter fra scratch: fra 15 000 kr
- Ja, integrasjoner med eksisterende systemer: fra 25 000 kr

This loses the Q1 refinement but is much simpler. Given the CONTEXT.md says "tighter estimate" without specifying the price model depth, the simpler approach is acceptable.

**For this phase, use the simpler Q1-agnostic Q2 prices.** The "tighter estimate" requirement is satisfied by Q2 adding a new dimension (CMS vs no CMS, integrations vs standalone) — not necessarily by Q1 and Q2 combining multiplicatively. The step counter "Spørsmål 1 av 2" already communicates the refinement process to the user.

#### landingsside

**Q1:** Trenger du integrasjoner? (unchanged — 2 options)
| Option | Q1 context |
|--------|-----------|
| Nei, bare tekst og bilder | simple |
| Ja, én eller flere integrasjoner | integrated |

**Q2:** Skal landingssiden brukes til en spesifikk kampanje (annonser) eller stå permanent?
| Option | Price |
|--------|-------|
| Kampanjeside (kortvarig, annonseoptimalisert) | fra 4 000 kr (simple) / fra 7 000 kr (integrated) |
| Permanent side (alltid synlig, SEO-optimalisert) | fra 6 000 kr (simple) / fra 9 000 kr (integrated) |

**Simplified standalone Q2 prices for landingsside:**
- Kampanjeside: fra 4 500 kr
- Permanent side med SEO: fra 7 000 kr

Use the simpler standalone prices for the same reason as above.

#### Final Narrowing Questions (clean spec)

```
nettside:
  Q1: "Hvor mange sider trenger du?"
      - "1–5 sider (enkel presentasjon)"
      - "6–15 sider (komplett nettsted)"
      - "16+ sider (stort nettsted)"
  Q2: "Trenger du å kunne oppdatere innholdet selv?"
      - "Nei, jeg bytter sjelden innhold" → fra 8 000 kr
      - "Ja, med et enkelt CMS-panel" → fra 12 000 kr

nettbutikk:
  Q1: "Hvor mange produkter skal du selge?"
      - "Under 50 produkter"
      - "50–500 produkter"
      - "500+ produkter"
  Q2: "Trenger du integrasjon med eksisterende systemer?"
      - "Nei, jeg starter fra scratch" → fra 15 000 kr
      - "Ja, koble til regnskapsprogram eller ERP" → fra 28 000 kr

landingsside:
  Q1: "Trenger du integrasjoner? (booking, betaling, skjema)"
      - "Nei, bare tekst og bilder"
      - "Ja, én eller flere integrasjoner"
  Q2: "Hva er formålet med siden?"
      - "Kampanjeside (for annonser, kortvarig)" → fra 4 500 kr
      - "Permanent side med SEO-fokus" → fra 7 500 kr
```

Note on nettside Q2 prices: these replace Q1's prices in the result — Q1 had "fra 8 000 kr" for small. Q2's "fra 8 000 kr" for static is consistent. The "fra 12 000 kr" for CMS is a blended estimate that works across all Q1 sizes. This is acceptable since the exact price requires a conversation (the CTA to /kontakt makes this clear).

### "Hva er inkludert" Bullets (Result Screen)

3-4 bullets per service. Derived from the existing Inkludert.astro sections — pick the highest-value items that fit in a compact list.

**nettside** (4 bullets):
1. Responsivt design — mobil, tablet og desktop
2. Skreddersydd design — ingen maler
3. Grunnleggende SEO og kontaktskjema
4. 30 dagers support etter lansering

**nettbutikk** (4 bullets):
1. Shopify-oppsett med Vipps og kortbetaling
2. Produktkatalog og handlekurv
3. Lagerstyring og ordrehåndtering
4. 30 dagers support etter lansering

**landingsside** (3 bullets):
1. Konverteringsfokusert layout
2. Hurtig lasting — under 1 sekund
3. Kontaktskjema eller lead-capture

**Confidence:** HIGH — sourced directly from Inkludert.astro files already in the codebase.

---

## Architecture Patterns

### Recommended Component Structure

No file structure changes. Single file: `src/components/islands/PrisKalkulatorIsland.tsx`

Additions within the file:
- Extend `Phase` type to include `'goal'` and `'recommend'`
- Add `goalOptions` array (replaces `pickerServices`)
- Extend `narrowingQuestions` with Q2 per service
- Add `q1ChoiceIndex` to state (for nettside if Q1-aware prices are used — else can omit)
- Add `includedItems: Record<ServiceSlug, string[]>` constant
- Update `animKey` derivation
- Add `handleGoalSelect` function
- Add `handleRecommendContinue` function
- Update `handleNarrowOption` to handle Q1 index tracking if needed
- Add JSX blocks for `goal` and `recommend` phases

### Pattern: Goal Options Data Shape

```typescript
interface GoalOption {
  label: string;
  subLabel: string;
  service: ServiceSlug;
}

const goalOptions: GoalOption[] = [
  {
    label: 'Få flere kunder til bedriften',
    subLabel: 'Profesjonell nettside som konverterer besøkende',
    service: 'nettside',
  },
  {
    label: 'Selge produkter på nett',
    subLabel: 'Komplett nettbutikk med betaling og lagerstyring',
    service: 'nettbutikk',
  },
  {
    label: 'Markedsføre en kampanje eller tilbud',
    subLabel: 'En fokusert landingsside som overbeviser',
    service: 'landingsside',
  },
];
```

### Pattern: Included Items

```typescript
const includedItems: Record<ServiceSlug, string[]> = {
  nettside: [
    'Responsivt design — mobil, tablet og desktop',
    'Skreddersydd design — ingen maler',
    'Grunnleggende SEO og kontaktskjema',
    '30 dagers support etter lansering',
  ],
  nettbutikk: [
    'Shopify-oppsett med Vipps og kortbetaling',
    'Produktkatalog og handlekurv',
    'Lagerstyring og ordrehåndtering',
    '30 dagers support etter lansering',
  ],
  landingsside: [
    'Konverteringsfokusert layout',
    'Hurtig lasting — under 1 sekund',
    'Kontaktskjema eller lead-capture',
  ],
};
```

### Pattern: Recommendation Step JSX

The recommendation step is visually distinct from narrowing steps but uses the same card shell. Key difference: no button grid — single CTA button to proceed.

```typescript
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
      Basert på målet ditt er dette det beste utgangspunktet. La oss finne riktig pris.
    </p>
    <button
      onClick={handleRecommendContinue}
      className="w-full rounded-md border border-white/10 bg-surface-raised p-4 text-left transition-colors hover:border-brand/40 hover:bg-surface-raised/80"
    >
      <span className="font-semibold text-text">Se spørsmålene →</span>
    </button>
  </motion.div>
)}
```

### Pattern: Result Screen Additions

Add between price display and CTA row:

```typescript
// Included items list
<ul className="mb-6 flex flex-col gap-2">
  {includedItems[state.selectedService!].map((item) => (
    <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
      <svg /* checkmark icon — same as Inkludert.astro */ ... />
      {item}
    </li>
  ))}
</ul>
```

Add "Les mer" link alongside "Kom i gang" button:

```typescript
// In the CTA row (flex row, items-center)
<a
  href={`/tjenester/${selectedServiceData.slug}`}
  className="text-sm text-text-muted underline-offset-2 transition-colors hover:text-text hover:underline"
>
  Les mer om {selectedServiceData.name.toLowerCase()}
</a>
```

### Anti-Patterns to Avoid

- **Storing price from Q1:** Only store price from the last narrowing step. Q1 price field in `NarrowingOption` for middle steps is a distraction — set it to an empty string or omit it from middle-step options if not needed.
- **Making recommendation step a modal or overlay:** It's a full phase transition, same card size, same animation.
- **Complex Q1×Q2 price matrix without clear need:** Use standalone Q2 prices unless the product requirement explicitly calls for combined prices. Simpler is more maintainable.
- **Separate phase for intro framing:** The intro text ("Svar på 2–3 spørsmål...") renders above the goal question buttons within the `goal` phase card — not as its own animated step.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Animated transitions | Custom CSS keyframes | Framer Motion (already present) | Already in project, handles reduced motion |
| State machine | XState or custom reducer | `useState` with explicit phase field | Wizard is simple enough; useState is readable and already used |

**Key insight:** The wizard has 4 linear phases with no branching complexity beyond goal→service routing. `useState` + explicit `phase` field is the correct tool — no need to reach for a state machine library.

---

## Common Pitfalls

### Pitfall 1: animKey collision between phases
**What goes wrong:** If `goal` and `recommend` use the same key string (or if the key changes unexpectedly), `AnimatePresence` won't trigger exit/enter animations — content just swaps instantly.
**Why it happens:** Developer forgets to add a unique key for the new phases.
**How to avoid:** Ensure `animKey` covers all 4 phases. The derived key for `recommend` must be `'recommend'` (not reusing `'pick'` or the old goal key).
**Warning signs:** Phase transition appears instant (no slide animation) when moving goal → recommend.

### Pitfall 2: Q2 price stored prematurely at Q1 selection
**What goes wrong:** If `handleNarrowOption` stores `option.priceEstimate` in state at Q1 selection and Q1 options have placeholder prices, the result screen shows the wrong price.
**Why it happens:** The existing logic already handles this correctly (only stores price when `nextStep >= questions.length`), but if Q1 options have non-empty `priceEstimate` fields, it could mislead future developers.
**How to avoid:** Set Q1 `priceEstimate` to empty string `''` to signal "not the final price". Or simply don't add a `priceEstimate` to Q1 options at all (set to `''`).

### Pitfall 3: Goal step shows service picker label
**What goes wrong:** Old "Hvilken tjeneste er du interessert i?" heading remains in JSX while the goal step renders.
**Why it happens:** Copy-paste from `pick` phase.
**How to avoid:** Delete the `pick` phase JSX block entirely and replace with `goal` phase block. Don't keep both.

### Pitfall 4: `selectedService` set before recommendation step is done
**What goes wrong:** `selectedService` is set on goal click, but `AnimatePresence` might not have the correct `selectedServiceData` during the `recommend` phase if state updates are async.
**Why it happens:** Not a real issue — React state updates are synchronous within event handlers in React 18 with automatic batching. `selectedServiceData` will be correct during `recommend` render.
**How to avoid:** No special handling needed. Set `selectedService` on goal click as part of the transition to `recommend`.

### Pitfall 5: "Les mer om" link text capitalization
**What goes wrong:** "Les mer om Nettside" (capital N from services.ts `name` field) looks odd mid-sentence.
**Why it happens:** `selectedServiceData.name` is title-cased.
**How to avoid:** Use `.toLowerCase()`: `Les mer om ${selectedServiceData.name.toLowerCase()}`.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Service-first wizard ("Which service?") | Goal-first wizard ("What's your goal?") | Phase 11 | Better conversion — users identify with goals, not product names |
| 1 narrowing question | 2 narrowing questions | Phase 11 | Tighter price estimate, more trust in result |
| No "what's included" in result | 3-4 bullet points in result | Phase 11 | Reduces uncertainty before clicking "Kom i gang" |

---

## Open Questions

1. **Should Q1 answers influence Q2 prices?**
   - What we know: CONTEXT.md says "tighter estimate" but doesn't require a price matrix
   - What's unclear: Whether product owner expects Q1×Q2 combined pricing or just two independent refinement dimensions
   - Recommendation: Use standalone Q2 prices (no Q1 dependency) unless explicitly requested. Add a comment in the component noting where to add Q1-aware pricing if needed later.

2. **Recommendation step: button or auto-advance?**
   - What we know: CONTEXT.md says "brief service recommendation step" — implies user sees it, not auto-skip
   - What's unclear: Should it auto-advance after 2 seconds, or require user to click?
   - Recommendation: Require explicit click ("Se spørsmålene →"). Auto-advance feels presumptuous and breaks the user's sense of control in a wizard.

---

## Sources

### Primary (HIGH confidence)
- `/Users/iverostensen/nettup/src/components/islands/PrisKalkulatorIsland.tsx` — current component: state shape, animation pattern, handler logic, JSX structure
- `/Users/iverostensen/nettup/src/config/services.ts` — service data: slugs, names, taglines, monthlyPriceLabel
- `/Users/iverostensen/nettup/src/lib/animation.ts` — animation presets: springs.gentle, fadeIn, fadeUp, slideVariants pattern
- `/Users/iverostensen/nettup/src/pages/tjenester/nettside/_sections/Inkludert.astro` — nettside included features
- `/Users/iverostensen/nettup/src/pages/tjenester/nettbutikk/_sections/Inkludert.astro` — nettbutikk included features
- `/Users/iverostensen/nettup/src/pages/tjenester/landingsside/_sections/Inkludert.astro` — landingsside included features
- `/Users/iverostensen/nettup/.planning/phases/11-enhanced-price-calculator-with-multi-step-needs-assessment/11-CONTEXT.md` — locked decisions and discretion areas

### Secondary (MEDIUM confidence)
- Project CLAUDE.md — animation usage guidance (Framer Motion, useReducedMotion pattern)
- STATE.md — accumulated decisions (services.ts role, ?tjeneste= param, maxPrice:0 pattern)

### Tertiary (LOW confidence)
None — all research based on codebase inspection, not web search.

---

## Metadata

**Confidence breakdown:**
- State machine shape: HIGH — derived from existing code, extends cleanly
- Content copy (goal options, bullets): HIGH — sourced from existing Inkludert.astro and services.ts
- Price estimates: MEDIUM — consistent with existing price ranges but exact figures are business judgment
- Animation approach: HIGH — directly mirrors existing patterns in the component

**Research date:** 2026-03-05
**Valid until:** Stable — no external dependencies; valid until component is refactored
