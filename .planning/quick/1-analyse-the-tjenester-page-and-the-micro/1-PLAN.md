---
phase: quick-1
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/styles/global.css
  - src/components/ui/Card.astro
  - src/pages/tjenester/_sections/TjenesterOversikt.astro
  - src/pages/tjenester/_sections/FAQ.astro
  - src/components/islands/TjenesterOversiktIsland.tsx
autonomous: true
requirements: []
must_haves:
  truths:
    - "Service cards animate in with a soft staggered entrance on scroll — not all at once"
    - "Card hover feels polished: icon lifts, glow deepens, 'Les mer' text gets an animated underline"
    - "Featured cards (nettside, nettbutikk) have a distinct ambient brand glow that pulses on hover"
    - "Scroll reveal uses exponential ease-out — elements decelerate smoothly, not linearly"
    - "FAQ items cascade in with staggered delay"
    - "prefers-reduced-motion users see no animation at all"
  artifacts:
    - path: "src/components/islands/TjenesterOversiktIsland.tsx"
      provides: "Framer Motion scroll-triggered stagger grid for service cards"
    - path: "src/styles/global.css"
      provides: "Refined reveal-on-scroll easing and new utility classes"
  key_links:
    - from: "src/pages/tjenester/_sections/TjenesterOversikt.astro"
      to: "src/components/islands/TjenesterOversiktIsland.tsx"
      via: "client:visible hydration"
---

<objective>
Refine animations and hover effects on /tjenester to feel "wow" but minimal and polished.

Current state: Service cards use generic `reveal-on-scroll` (0.5s ease-out, 16px travel) with simultaneous entry. Card hover is `-translate-y-1 shadow-xl` — functional but abrupt. No icon interaction, no stagger on viewport entry.

Target state: Cards stagger-reveal using Framer Motion (scroll-triggered via `whileInView`), hover states include icon micro-animations and smooth glow deepening, reveal easing uses exponential curve for a much softer landing.

Purpose: This is Nettup's showcase — the /tjenester page sells services. Polish here directly signals quality.
Output: Updated CSS, Card component, TjenesterOversikt (now delegates to React island), TjenesterOversiktIsland.tsx, FAQ section.
</objective>

<execution_context>
@/Users/iverostensen/.claude/get-shit-done/workflows/execute-plan.md
@/Users/iverostensen/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md

Key animation infrastructure already in place:
- `src/lib/animation.ts` — Framer Motion variant presets: `fadeUp`, `staggerContainer`, `springs.gentle`, `springs.snappy`
- `src/styles/global.css` — `reveal-on-scroll` class (currently: `opacity 0.5s ease-out, transform 0.5s ease-out`, 16px travel)
- `src/components/ui/Card.astro` — `hover:border-brand/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5`
- `src/pages/tjenester/_sections/TjenesterOversikt.astro` — Static Astro, uses `reveal-on-scroll delay-{n}` on each card
- Hero uses Framer Motion with `staggerContainer` + `fadeUp` — proven pattern to follow

Current problem areas:
1. `reveal-on-scroll` easing is linear-ish `ease-out` — elements land hard, no deceleration elegance
2. Cards all enter simultaneously (delay classes on CSS transition don't work correctly with IntersectionObserver-driven `.revealed` class addition)
3. Card hover `-translate-y-1` is 4px — too subtle to feel polished; the shadow is generic
4. Icon has no hover state — static, no micro-feedback
5. "Les mer" badge has border hover but feels disconnected from card hover intent
6. Featured cards (brand border) have no extra "premium" feel on hover
7. FAQ items have no stagger — all pop in together

Interfaces available in src/lib/animation.ts:
```typescript
export const staggerContainer: Variants  // staggerChildren: 0.08, delayChildren: 0.1
export const fadeUp: Variants            // hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }
export const springs: {
  snappy: Transition  // stiffness: 400, damping: 30
  gentle: Transition  // stiffness: 200, damping: 28
  pop: Transition     // stiffness: 500, damping: 25
}
```
</context>

<tasks>

<task type="auto">
  <name>Task 1: Refine global reveal-on-scroll and add stagger-aware delay utilities</name>
  <files>src/styles/global.css</files>
  <action>
Update the `.reveal-on-scroll` animation system to use a softer exponential ease-out curve and slightly more vertical travel. Add per-item stagger delay utilities for IntersectionObserver-revealed elements.

Changes to make in `src/styles/global.css`:

1. Update `.reveal-on-scroll` transition:
   - Change from `0.5s ease-out` to `0.65s cubic-bezier(0.16, 1, 0.3, 1)` for both opacity and transform
   - Change `translateY(16px)` to `translateY(24px)` for more expressive entry
   - This cubic-bezier is "exponential ease-out" — sharp start, very soft landing — makes elements feel like they settle into place rather than stopping abruptly

2. Add stagger delay utilities that work with the IntersectionObserver pattern. These should apply `transition-delay` (not `animation-delay`) so they trigger AFTER `.revealed` is added by the observer:
```css
.reveal-stagger-1 { transition-delay: 0ms; }
.reveal-stagger-2 { transition-delay: 80ms; }
.reveal-stagger-3 { transition-delay: 160ms; }
.reveal-stagger-4 { transition-delay: 240ms; }
.reveal-stagger-5 { transition-delay: 320ms; }
.reveal-stagger-6 { transition-delay: 400ms; }
.reveal-stagger-7 { transition-delay: 480ms; }
```

3. Under `@media (prefers-reduced-motion: reduce)`, add these new classes to the existing reset block (add `[class*='reveal-stagger-']` to reset transition-delay to 0ms).

4. Add a new `@keyframes shimmer-glow` and `.animate-shimmer-glow` utility for featured card ambient glow:
```css
@keyframes shimmer-glow {
  0%, 100% { box-shadow: 0 0 20px 0px rgba(6, 182, 212, 0.08); }
  50%       { box-shadow: 0 0 32px 4px rgba(6, 182, 212, 0.18); }
}
.card-featured-glow {
  animation: shimmer-glow 3s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .card-featured-glow { animation: none; }
}
```

Do NOT change `animate-fade-up`, `animate-fade-in`, or other keyframe animations — those are used by hero and other sections.
  </action>
  <verify>npm run build 2>&1 | tail -5</verify>
  <done>Build passes. `.reveal-on-scroll` uses 0.65s cubic-bezier(0.16, 1, 0.3, 1) with 24px travel. `.reveal-stagger-1` through `.reveal-stagger-7` exist in CSS. `.card-featured-glow` keyframe exists.</done>
</task>

<task type="auto">
  <name>Task 2: Create TjenesterOversiktIsland.tsx with Framer Motion stagger cards</name>
  <files>src/components/islands/TjenesterOversiktIsland.tsx, src/pages/tjenester/_sections/TjenesterOversikt.astro</files>
  <action>
Create a new React island that replaces the static card grid in TjenesterOversikt.astro, using Framer Motion `whileInView` for scroll-triggered stagger. Then update TjenesterOversikt.astro to use it.

**Create `src/components/islands/TjenesterOversiktIsland.tsx`:**

```tsx
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, springs } from '@/lib/animation';

// Identical icon data as in TjenesterOversikt.astro (copy the Record<string, string>)
const icons: Record<string, string> = {
  nettside: 'M12 21a9.004 ...',  // copy exact d= values from TjenesterOversikt.astro
  // ... all 7 icons
};

interface Service {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceRange: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
  featured?: boolean;
  shouldReduceMotion: boolean;
}

function ServiceCard({ service, index, featured = false, shouldReduceMotion }: ServiceCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.a
      href={`/tjenester/${service.slug}`}
      variants={cardVariants}
      transition={{ ...springs.gentle, delay: shouldReduceMotion ? 0 : index * 0.08 }}
      aria-label={`Les mer om ${service.name}`}
      className={[
        'group flex flex-col rounded-md border bg-surface-raised p-8',
        'transition-all duration-normal',
        featured
          ? 'border-brand/50 ring-1 ring-brand/30 card-featured-glow hover:border-brand hover:ring-brand/50 hover:shadow-2xl hover:shadow-brand/15'
          : 'border-white/10 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5',
        'hover:-translate-y-1.5',
      ].join(' ')}
    >
      {/* Icon with micro-lift on card hover */}
      <div className="mb-4 transition-transform duration-normal group-hover:-translate-y-0.5 group-hover:scale-110">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={[
            'h-8 w-8 transition-colors duration-normal',
            featured ? 'text-brand group-hover:text-brand-light' : 'text-brand group-hover:text-brand-light',
          ].join(' ')}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icons[service.slug]} />
        </svg>
      </div>

      <h3 className="mb-1 text-lg font-semibold">{service.name}</h3>
      <p className="mb-3 text-sm text-brand">{service.tagline}</p>
      <p className="mb-4 flex-1 text-sm text-text-muted">{service.description}</p>
      <p className="mb-4 text-sm font-semibold text-text">{service.priceRange}</p>

      {/* Animated underline "Les mer" — replaces the border badge */}
      <span
        aria-hidden="true"
        className="link-underline mt-auto text-sm font-semibold text-text-muted transition-colors duration-normal group-hover:text-text"
      >
        Les mer
      </span>
    </motion.a>
  );
}

interface Props {
  group1: Service[];
  group2: Service[];
  featured: string[];
}

export default function TjenesterOversiktIsland({ group1, group2, featured }: Props) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {group1.map((service, i) => (
          <ServiceCard
            key={service.slug}
            service={service}
            index={i}
            featured={featured.includes(service.slug)}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </motion.div>

      <motion.div
        className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {group2.map((service, i) => (
          <ServiceCard
            key={service.slug}
            service={service}
            index={i}
            featured={false}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </motion.div>
    </>
  );
}
```

Key implementation notes:
- `whileInView` with `once: true` — triggers once when grid enters viewport, no re-animation on scroll back
- `viewport: { margin: '-60px' }` — starts animating when grid is 60px into viewport, not at edge
- Icon uses CSS `group-hover` (Tailwind `group` on parent `<a>`) for hover micro-animation — no JS needed for hover, only Framer for entry
- "Les mer" uses the existing `link-underline` class from global.css (the animated underline utility already exists)
- Featured cards use the new `.card-featured-glow` CSS class from Task 1
- `shouldReduceMotion` collapses all delays to 0 and y-travel to 0

**Update `src/pages/tjenester/_sections/TjenesterOversikt.astro`:**

Replace the two card grids with the island. Keep the section wrapper, SectionHeader, and h2 subheadings — only the card grids become the island.

```astro
---
import { services } from '@/config/services';
import Section from '@/components/ui/Section.astro';
import SectionHeader from '@/components/ui/SectionHeader.astro';
import TjenesterOversiktIsland from '@/components/islands/TjenesterOversiktIsland';

const group1Slugs = ['nettside', 'nettbutikk', 'landingsside', 'webapp'];
const group2Slugs = ['seo', 'ai', 'vedlikehold'];

const group1 = group1Slugs.map((slug) => services.find((s) => s.slug === slug)!);
const group2 = group2Slugs.map((slug) => services.find((s) => s.slug === slug)!);

const featured = ['nettside', 'nettbutikk'];
---

<Section>
  <SectionHeader title="Tjenester" subtitle="Vi tilbyr et komplett spekter av webtjenester — fra enkel nettside til skreddersydd webapp." />

  <h2 class="reveal-on-scroll mb-6 font-display text-xl font-semibold text-text-muted">
    Nettsteder &amp; Applikasjoner
  </h2>

  <TjenesterOversiktIsland
    client:visible
    group1={group1}
    group2={group2}
    featured={featured}
  />

  <h2 class="reveal-on-scroll mt-16 mb-6 font-display text-xl font-semibold text-text-muted">
    Løpende tjenester
  </h2>
</Section>
```

Wait — the two h2 subheadings need to wrap the grids, not sit above both. The island renders both grids internally (group1 grid + h2 separator + group2 grid pattern won't work this way). Instead, keep both h2s in Astro and pass a `showGroup2Heading` flag, OR restructure the island to accept the heading text.

Simplest approach: Remove the "Løpende tjenester" h2 from Astro and render it inside the island between the two grids, as a `<h2>` with a className prop. The island already knows where group1 ends and group2 begins.

Add to island, between the two motion.divs:
```tsx
<h2 className="reveal-on-scroll mb-6 mt-16 font-display text-xl font-semibold text-text-muted">
  Løpende tjenester
</h2>
```

Note: `reveal-on-scroll` in a React component is fine — the global IntersectionObserver in BaseLayout picks up all `.reveal-on-scroll` elements including those rendered by React islands after hydration (via `astro:page-load` event listener pattern already in BaseLayout.astro).
  </action>
  <verify>npm run build 2>&1 | tail -10</verify>
  <done>Build passes cleanly. TjenesterOversiktIsland.tsx exists. TjenesterOversikt.astro imports and uses it with `client:visible`. Service data (all 7 services, icons) is passed as props. Both card grids render with Framer Motion stagger variants. Icon SVG paths are identical to original.</done>
</task>

<task type="auto">
  <name>Task 3: Refine FAQ reveal stagger and TjenesterCTA entrance</name>
  <files>src/pages/tjenester/_sections/FAQ.astro, src/pages/tjenester/_sections/TjenesterCTA.astro</files>
  <action>
Apply the new `reveal-stagger-{n}` utilities from Task 1 to FAQ items so they cascade in rather than all appearing simultaneously. Refine TjenesterCTA to feel more intentional.

**Update `src/pages/tjenester/_sections/FAQ.astro`:**

Change the FAQ map to use `reveal-stagger-{n}` delay classes:

```astro
{faqs.map((faq, index) => (
  <div class={`reveal-on-scroll reveal-stagger-${index + 1} py-6 first:pt-0 last:pb-0`}>
    <h3 class="font-semibold">{faq.question}</h3>
    <p class="mt-2 text-text-muted">{faq.answer}</p>
  </div>
))}
```

Since there are 6 FAQs and we have `reveal-stagger-1` through `reveal-stagger-7`, this covers all items (index 0–5 → stagger-1 through stagger-6).

Also add a subtle left accent bar to each FAQ item to add visual interest without motion:
- Add `border-l-2 border-transparent pl-4 transition-colors duration-normal hover:border-brand/40` to the FAQ item div
- This gives a gentle visual cue on hover — a brand-color left border appears

**Update `src/pages/tjenester/_sections/TjenesterCTA.astro`:**

The CTA section currently has the entire block as one `reveal-on-scroll`. Break it into staggered elements:

```astro
<Section background="raised">
  <div class="mx-auto max-w-2xl text-center">
    <h2 class="reveal-on-scroll text-3xl font-bold md:text-4xl">
      Usikker på hvilken tjeneste?
    </h2>
    <p class="reveal-on-scroll reveal-stagger-2 mt-4 text-lg text-text-muted">
      Ta kontakt så hjelper vi deg å finne riktig løsning for din bedrift.
    </p>
    <div class="reveal-on-scroll reveal-stagger-3 mt-8">
      <Button href="/kontakt?kilde=tjenester" size="lg">Ta en uforpliktende prat</Button>
    </div>
  </div>
</Section>
```

This makes the CTA text and button cascade in (h2 → p → button), rather than the entire block appearing at once.
  </action>
  <verify>npm run build 2>&1 | tail -5</verify>
  <done>Build passes. FAQ items each have `reveal-stagger-{n}` classes (1 through 6). FAQ items have hover left border accent. TjenesterCTA heading, paragraph and button each have separate `reveal-on-scroll` with stagger delays.</done>
</task>

</tasks>

<verification>
After all tasks:

1. `npm run build` passes with 0 errors
2. `npm run dev` — visit http://localhost:4321/tjenester
3. Scroll down to service cards — they should stagger in with a soft exponential ease (not all at once)
4. Hover a card — icon should lift slightly, "Les mer" should get an underline, card should rise with a glow
5. Hover nettside/nettbutikk featured cards — should have a stronger brand glow effect
6. Scroll to FAQ — items should cascade in with ~80ms stagger between each
7. Scroll to CTA — heading, text, and button should sequence in
8. In DevTools: set `prefers-reduced-motion: reduce` and reload — all animations should be absent, elements immediately visible
</verification>

<success_criteria>
- `npm run build` exits 0
- /tjenester service cards animate with Framer Motion stagger via `whileInView` (not simultaneous CSS reveal)
- Card hover: icon scales + lifts, "Les mer" gets link-underline animation, card elevation increases
- Featured cards have ambient glow animation and stronger hover glow
- `reveal-on-scroll` uses `cubic-bezier(0.16, 1, 0.3, 1)` — soft exponential ease
- FAQ items stagger with 80ms delay between each
- `prefers-reduced-motion` fully respected — no transitions, no delays, no animation
</success_criteria>

<output>
After completion, create `.planning/quick/1-analyse-the-tjenester-page-and-the-micro/1-SUMMARY.md` with what was done, files changed, and any decisions made.
</output>
