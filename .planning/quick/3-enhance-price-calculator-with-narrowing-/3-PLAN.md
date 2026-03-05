---
phase: quick-3
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/islands/PrisKalkulatorIsland.tsx
autonomous: true
requirements: []
must_haves:
  truths:
    - "First question lets user pick a service directly (not yes/no)"
    - "After picking a service, follow-up questions narrow price estimate"
    - "Result shows a specific price estimate, not just the generic priceRange"
    - "User can restart the wizard at any point"
  artifacts:
    - path: "src/components/islands/PrisKalkulatorIsland.tsx"
      provides: "Rewritten wizard: service picker + per-service narrowing questions + price result"
  key_links:
    - from: "PrisKalkulatorIsland.tsx"
      to: "src/config/services.ts"
      via: "services import for name/ctaParam/monthlyPriceLabel"
      pattern: "import.*services.*from.*config/services"
---

<objective>
Replace the binary yes/no decision tree with a two-phase wizard: (1) direct service picker, (2) per-service follow-up questions that narrow down to a specific price estimate.

Purpose: Visitors who already know what they want skip the reasoning tree. Those who don't know get a better-scoped estimate after answering 1-2 targeted questions.
Output: Updated PrisKalkulatorIsland.tsx with service-first flow and price narrowing.
</objective>

<execution_context>
@/Users/iverostensen/.claude/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@/Users/iverostensen/nettup/src/components/islands/PrisKalkulatorIsland.tsx
@/Users/iverostensen/nettup/src/config/services.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Rewrite PrisKalkulatorIsland with service picker and price narrowing</name>
  <files>src/components/islands/PrisKalkulatorIsland.tsx</files>
  <action>
Rewrite the component from scratch. Keep all imports and styling conventions. The new flow has three phases:

**Phase A — Service picker (step 0):**
Render three clickable option buttons (one per service). No yes/no. The question text is "Hvilken tjeneste er du interessert i?". Each button shows the service name and tagline. Clicking a button sets `selectedService` and moves to Phase B.

**Phase B — Narrowing questions (1-2 questions per service):**
Define a `NarrowingQuestion` type:
```ts
interface NarrowingQuestion {
  question: string;
  options: { label: string; priceEstimate: string; monthlyNote?: string }[];
}
```

Define `narrowingQuestions` as a `Record<ServiceSlug, NarrowingQuestion[]>`:

- `nettside` (1 question): "Hvor mange sider trenger du?"
  - "1–5 sider (enkel presentasjon)" → priceEstimate: "fra 15 000 kr"
  - "6–15 sider (komplett nettsted)" → priceEstimate: "fra 22 000 kr"
  - "16+ sider (stort nettsted)" → priceEstimate: "fra 35 000 kr"

- `nettbutikk` (1 question): "Hvor mange produkter skal du selge?"
  - "Under 50 produkter" → priceEstimate: "fra 25 000 kr"
  - "50–500 produkter" → priceEstimate: "fra 40 000 kr"
  - "500+ produkter" → priceEstimate: "fra 60 000 kr"

- `landingsside` (1 question): "Trenger du integrasjoner? (booking, betalingsløsning, skjema)"
  - "Nei, bare tekst og bilder" → priceEstimate: "fra 8 000 kr"
  - "Ja, én eller flere integrasjoner" → priceEstimate: "fra 12 000 kr"

State shape:
```ts
type Phase = 'pick' | 'narrow' | 'result';
interface State {
  phase: Phase;
  selectedService: ServiceSlug | null;
  narrowStep: number;
  priceEstimate: string | null;
  monthlyNote?: string;
}
```

**Phase C — Result:**
Show service name, the specific priceEstimate chosen in Phase B (not `recommendedService.priceRange`), monthly hosting note from the service definition (`service.monthlyPriceLabel`), CTA to `/kontakt?tjeneste={ctaParam}`, and a "Start på nytt" button.

**Animations:**
Keep existing `slideVariants` pattern. Direction is always forward (1) during narrowing, reverse (-1) on reset. Use `AnimatePresence mode="wait"` keyed by phase+step. Keep `useReducedMotion` guard.

**Progress indicator:**
Show "Spørsmål {currentQuestion} av {totalQuestions}" only during narrowing phase (Phase B). Do not show it during picker or result.

**Styling:**
- Service picker buttons: `w-full rounded-md border border-white/10 bg-surface-raised p-4 text-left transition-colors hover:border-brand/40 hover:bg-surface-raised/80`
- Narrowing option buttons: same style as service picker
- Selected/active state: not needed (single click advances immediately)
- Keep the result panel style unchanged from current implementation

Do NOT keep the old `steps: WizardStep[]` array — remove it entirely. Remove `TOTAL_QUESTIONS` constant. Remove `handleYes`/`handleNo` functions.
  </action>
  <verify>
    <automated>cd /Users/iverostensen/nettup && npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>Build passes. Wizard renders service picker as first step, follow-up narrows price, result shows specific estimate. No TypeScript errors.</done>
</task>

</tasks>

<verification>
- `npm run build` exits 0
- `npm run lint` exits 0
- No `any` types introduced
- Component handles all 3 services with narrowing questions
</verification>

<success_criteria>
- First question shows 3 service options (not yes/no)
- Each service shows exactly 1 narrowing question with 2-3 options
- Result panel shows the specific priceEstimate from the chosen option (e.g. "fra 22 000 kr" for 6-15 pages nettside)
- Monthly hosting note sourced from services.ts
- "Start på nytt" resets to service picker
</success_criteria>

<output>
After completion, create `.planning/quick/3-enhance-price-calculator-with-narrowing-/3-SUMMARY.md`
</output>
