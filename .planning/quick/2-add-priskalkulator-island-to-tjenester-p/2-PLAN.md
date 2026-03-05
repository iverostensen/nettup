---
phase: quick-2
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/islands/PrisKalkulatorIsland.tsx
  - src/pages/tjenester/_sections/PrisKalkulator.astro
  - src/pages/tjenester/index.astro
autonomous: true
requirements: []

must_haves:
  truths:
    - "User can answer 4–5 yes/no questions in sequence"
    - "Wizard recommends one of the three services with price shown"
    - "CTA links to /kontakt with ?tjeneste= pre-filled"
    - "Step transitions use Framer Motion slide animation"
    - "prefers-reduced-motion is respected"
  artifacts:
    - path: "src/components/islands/PrisKalkulatorIsland.tsx"
      provides: "Multi-step wizard React component"
    - path: "src/pages/tjenester/_sections/PrisKalkulator.astro"
      provides: "Section wrapper for the island"
    - path: "src/pages/tjenester/index.astro"
      provides: "Tjenester page with PrisKalkulator section inserted"
  key_links:
    - from: "src/pages/tjenester/_sections/PrisKalkulator.astro"
      to: "src/components/islands/PrisKalkulatorIsland.tsx"
      via: "client:visible hydration"
    - from: "PrisKalkulatorIsland result screen"
      to: "/kontakt"
      via: "?tjeneste={ctaParam} query param"
---

<objective>
Add a PrisKalkulator (price calculator) section to /tjenester. A multi-step wizard that asks 4–5 yes/no questions, narrows down to a recommended service (nettside/nettbutikk/landingsside), and shows the estimated one-time and monthly price. A CTA links to /kontakt with the service pre-filled via ?tjeneste= param. Framer Motion handles step-to-step transitions.

Purpose: Convert undecided visitors into leads by helping them self-qualify and arrive at /kontakt with context.
Output: PrisKalkulatorIsland.tsx + PrisKalkulator.astro section + updated tjenester/index.astro
</objective>

<execution_context>
@/Users/iverostensen/.claude/get-shit-done/workflows/execute-plan.md
@/Users/iverostensen/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@/Users/iverostensen/nettup/.planning/STATE.md
@/Users/iverostensen/nettup/src/config/services.ts
@/Users/iverostensen/nettup/src/lib/animation.ts
@/Users/iverostensen/nettup/src/pages/tjenester/index.astro
@/Users/iverostensen/nettup/src/pages/tjenester/_sections/TjenesterOversikt.astro
@/Users/iverostensen/nettup/src/components/islands/TjenesterOversiktIsland.tsx

<interfaces>
<!-- Key types and contracts the executor needs. -->

From src/config/services.ts:
```typescript
export interface Service {
  slug: string;
  name: string;
  tagline: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  ctaParam: string;
  description: string;
  monthlyPrice?: number;
  monthlyPriceLabel?: string;
  related?: string[];
  featured?: boolean;
}
export const services: Service[] = [
  { slug: 'nettside',    minPrice: 15000, monthlyPrice: 250,  ctaParam: 'nettside',    ... },
  { slug: 'nettbutikk',  minPrice: 25000, monthlyPrice: 500,  ctaParam: 'nettbutikk',  ... },
  { slug: 'landingsside',minPrice: 8000,  monthlyPrice: 250,  ctaParam: 'landingsside',... },
];
```

From src/lib/animation.ts:
```typescript
export const springs = {
  gentle: { type: 'spring', stiffness: 200, damping: 28 },
};
export const fadeUp: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
export const slideLeft: Variants  = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };
export const slideRight: Variants = { hidden: { opacity: 0, x: 20  }, visible: { opacity: 1, x: 0 } };
export const staggerContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
```

Section wrapper pattern (from TjenesterOversikt.astro):
```astro
---
import Section from '@/components/ui/Section.astro';
import SectionHeader from '@/components/ui/SectionHeader.astro';
import MyIsland from '@/components/islands/MyIsland';
---
<Section>
  <SectionHeader title="..." subtitle="..." />
  <MyIsland client:visible ... />
</Section>
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Build PrisKalkulatorIsland React component</name>
  <files>src/components/islands/PrisKalkulatorIsland.tsx</files>
  <action>
Create a multi-step wizard React component using Framer Motion for step transitions. The wizard uses a question tree to recommend one of the three services.

**Question tree (4 questions, branching logic):**

Step 1 — "Skal du selge produkter direkte på nettsiden?"
  - Ja → recommend nettbutikk (stop)
  - Nei → Step 2

Step 2 — "Har du en eksisterende bedrift med flere sider med innhold (om oss, kontakt, tjenester osv.)?"
  - Ja → recommend nettside (stop)
  - Nei → Step 3

Step 3 — "Skal du drive trafikk fra annonser eller kampanjer til én fokusert side?"
  - Ja → recommend landingsside (stop)
  - Nei → Step 4

Step 4 — "Er du en liten bedrift som trenger å etablere en profesjonell tilstedeværelse på nett?"
  - Ja → recommend nettside (stop)
  - Nei → recommend landingsside (default fallback)

**Component state:**
```typescript
type WizardStep = { question: string; yes: 'nettbutikk' | 'nettside' | 'landingsside' | 'next'; no: 'nettbutikk' | 'nettside' | 'landingsside' | 'next' };
```
- `currentStep: number` (0-indexed)
- `result: string | null` — slug of recommended service, null while answering
- `direction: 1 | -1` — for slide direction animation

**Animation:**
- Step transition: `AnimatePresence mode="wait"` with `motion.div` per step
- Slide in from right (new step): x from 40 to 0, opacity 0 to 1
- Slide out to left (old step): x from 0 to -40, opacity 1 to 0
- Use `springs.gentle` as transition
- `useReducedMotion()` — if true, use `fadeIn` variants (no x movement)
- Import `springs`, `fadeIn` from `@/lib/animation`

**Result screen:**
- Show recommended service name, tagline, priceRange, and monthlyPriceLabel
- One-time price in large text: `"fra X kr"`
- Monthly hosting line below: `"+ fra X kr/mnd hosting og support"` (only if monthlyPriceLabel exists)
- Primary CTA button: `"Kom i gang"` → href `/kontakt?tjeneste={service.ctaParam}`
- Secondary link: `"Ta meg tilbake"` — resets wizard (sets currentStep=0, result=null)
- Fade-up entrance animation for result screen

**Progress indicator:**
- Show dots or a `"Spørsmål {n} av 4"` counter above each question
- Style: `text-xs text-text-muted`

**Layout:**
- Outer container: `max-w-2xl mx-auto`
- Step card: `rounded-md border border-white/10 bg-surface-raised p-8`
- Question text: `text-lg font-semibold text-text mb-6`
- Yes/No buttons: two side-by-side buttons
  - Yes: primary style — `bg-brand text-white rounded px-6 py-3 font-semibold hover:bg-brand-light transition-colors`
  - No: ghost style — `border border-white/20 text-text-muted rounded px-6 py-3 font-semibold hover:border-brand/40 hover:text-text transition-colors`
- Button row: `flex gap-4`

**Data:** Import `services` from `@/config/services` — look up recommended service by slug for result screen display.

TypeScript: no `any`, strict types throughout.
  </action>
  <verify>
    <automated>cd /Users/iverostensen/nettup && npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>PrisKalkulatorIsland.tsx exists, TypeScript compiles without errors, build passes</done>
</task>

<task type="auto">
  <name>Task 2: Create section wrapper and wire into tjenester page</name>
  <files>src/pages/tjenester/_sections/PrisKalkulator.astro, src/pages/tjenester/index.astro</files>
  <action>
**Create src/pages/tjenester/_sections/PrisKalkulator.astro:**

Follow the TjenesterOversikt.astro pattern exactly:

```astro
---
import Section from '@/components/ui/Section.astro';
import SectionHeader from '@/components/ui/SectionHeader.astro';
import PrisKalkulatorIsland from '@/components/islands/PrisKalkulatorIsland';
---

<Section>
  <SectionHeader
    title="Hva passer for deg?"
    subtitle="Svar på fire enkle spørsmål, så finner vi riktig løsning — og viser deg hva det koster."
  />
  <PrisKalkulatorIsland client:visible />
</Section>
```

**Update src/pages/tjenester/index.astro:**

Insert `PrisKalkulator` between `TjenesterOversikt` and `FAQ`. The import and usage must follow the exact pattern of the other section imports already present in that file.

Final section order in `<main>`:
1. `<TjenesterOversikt />`
2. `<PrisKalkulator />` ← new
3. `<FAQ />`
4. `<TjenesterCTA />`
  </action>
  <verify>
    <automated>cd /Users/iverostensen/nettup && npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>PrisKalkulator.astro exists, tjenester/index.astro imports and renders PrisKalkulator between TjenesterOversikt and FAQ, build passes cleanly</done>
</task>

</tasks>

<verification>
After both tasks:
- `npm run build` passes with 0 errors
- `npm run dev` — visit http://localhost:4321/tjenester
- PrisKalkulator section visible below the service cards
- Clicking Ja/Nei steps through questions with slide animation
- Result screen shows correct service name, price, and a working link to /kontakt?tjeneste={slug}
- "Ta meg tilbake" resets the wizard to question 1
- `prefers-reduced-motion` in browser settings removes x-axis slide (fade only)
</verification>

<success_criteria>
- Wizard reaches a result screen for all question paths (no dead ends)
- /kontakt?tjeneste= param is set correctly for all three services
- TypeScript strict — 0 errors, 0 `any`
- Build passes: `npm run build` clean
- Mobile layout at 375px: buttons stacked or side-by-side without overflow
</success_criteria>

<output>
After completion, create `.planning/quick/2-add-priskalkulator-island-to-tjenester-p/2-SUMMARY.md`
</output>
