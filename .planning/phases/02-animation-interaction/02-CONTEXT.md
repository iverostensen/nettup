# Phase 2: Animation & Interaction - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a consistent animation system, create a visually impressive hero showcase, and enable smooth page transitions. This phase is about demonstrating technical skill through motion — not adding pages or features.

Three deliverables: (1) `lib/animation.ts` preset library, (2) redesigned hero with orchestrated spring animation, (3) Astro View Transitions for page navigation.

</domain>

<decisions>
## Implementation Decisions

### Hero animation
- Replace the existing 3D MacBook + code-typing animation entirely — do not enhance or keep it
- New hero: orchestrated reveal sequence using Framer Motion spring physics
- Energy level: snappy and confident — fast springs, quick stagger, elements land with authority
- Layout: single-column centered on mobile; two-column with a new right-side visual element on desktop (lg+) — Claude decides what the right-side element is
- The existing `DeviceMockup.tsx` and `LandingHeroAnimation.tsx` components are retired

### Page transitions
- Astro View Transitions with a subtle cross-fade (~150ms)
- FloatingNav is excluded from transitions — stays pinned and static between pages
- Fast duration (~150ms) — almost imperceptible, removes the hard-reload feeling without being distracting
- Hero animation always replays on every navigation to the homepage (not skipped on back-navigation)

### Scroll animation system
- Hybrid approach: Framer Motion `whileInView` for React islands, CSS reveal classes for Astro sections
- All pages get upgraded scroll animations where applicable (not just homepage)
- Items in grid/card layouts animate with 80ms sequential stagger
- Direction: fade + slight upward (opacity 0→1, translateY 20px→0) — consistent with existing CSS reveal pattern
- The existing `reveal-on-scroll` CSS class and IntersectionObserver in BaseLayout are kept for Astro sections

### Animation preset library (`lib/animation.ts`)
- Exports: Framer Motion variant presets (`fadeUp`, `fadeIn`, `stagger`, `springPop`, etc.) + timing constants derived from `brand.ts`
- All existing animated components must be migrated: `RotatingText.tsx`, `FloatingNav.tsx`, and any new components
- CSS animation classes in `global.css` (`animate-fade-up`, `animate-fade-in`, etc.) are kept — used by Astro sections
- No shared hooks (useScrollProgress, useParallax) — out of scope for this phase

### Claude's Discretion
- What the right-side desktop element is in the new hero (stats card, browser mockup, abstract visual, etc.)
- Exact spring stiffness and damping values within the "snappy and confident" energy target
- Which specific sections on each page get Framer Motion stagger vs CSS reveals
- Loading skeleton or placeholder behavior during animation

</decisions>

<specifics>
## Specific Ideas

- "Snappy and confident" is the target feel — think fast spring physics where elements arrive with authority, not bounce or playfulness
- No specific references given — open to Claude's creative direction within the brand personality

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `RotatingText.tsx`: Uses Framer Motion `AnimatePresence` for word cycling — keep, migrate to `lib/animation.ts` timing constants
- `FloatingNav.tsx`: React island, can use `lib/animation.ts` presets
- `brand.ts`: Already has `duration` (fast/normal/slow), `easing` (default/snappy/gentle), `delay` (1-5) tokens — `lib/animation.ts` should derive from these
- `global.css`: `animate-fade-up`, `animate-fade-in`, `animate-scale-in`, `animate-slide-in-left/right`, `reveal-on-scroll` — all stay for Astro sections

### Established Patterns
- Animation levels documented in `global.css`: Level 0 (CSS), Level 1 (IntersectionObserver + CSS), Level 2 (Framer Motion), Level 3 (Aceternity)
- `useReducedMotion` is used in all existing React animation components — must continue in all new work
- Framer Motion already installed and used — no new animation library needed
- IntersectionObserver for scroll reveals is already set up in `BaseLayout.astro` — Astro sections plug into this

### Integration Points
- `BaseLayout.astro`: Add `<ViewTransitions />` component here for site-wide page transitions
- `FloatingNav.tsx`: Add `data-astro-transition:persist` or equivalent to exclude from transitions
- `src/pages/_home/Hero.astro`: Replace entirely with new React island hero component
- `src/lib/`: Create `animation.ts` here (existing `utils.ts` already in this directory)
- All `src/components/islands/*.tsx`: Migrate hardcoded animation values to `lib/animation.ts`

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-animation-interaction*
*Context gathered: 2026-03-03*
