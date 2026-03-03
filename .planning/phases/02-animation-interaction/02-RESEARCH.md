# Phase 2: Animation & Interaction - Research

**Researched:** 2026-03-03
**Domain:** Framer Motion v12 spring animations, Astro View Transitions (ClientRouter), animation preset architecture
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero animation:**
- Replace the existing 3D MacBook + code-typing animation entirely — do not enhance or keep it
- New hero: orchestrated reveal sequence using Framer Motion spring physics
- Energy level: snappy and confident — fast springs, quick stagger, elements land with authority
- Layout: single-column centered on mobile; two-column with a new right-side visual element on desktop (lg+) — Claude decides what the right-side element is
- The existing `DeviceMockup.tsx` and `LandingHeroAnimation.tsx` components are retired

**Page transitions:**
- Astro View Transitions with a subtle cross-fade (~150ms)
- FloatingNav is excluded from transitions — stays pinned and static between pages
- Fast duration (~150ms) — almost imperceptible, removes the hard-reload feeling without being distracting
- Hero animation always replays on every navigation to the homepage (not skipped on back-navigation)

**Scroll animation system:**
- Hybrid approach: Framer Motion `whileInView` for React islands, CSS reveal classes for Astro sections
- All pages get upgraded scroll animations where applicable (not just homepage)
- Items in grid/card layouts animate with 80ms sequential stagger
- Direction: fade + slight upward (opacity 0→1, translateY 20px→0) — consistent with existing CSS reveal pattern
- The existing `reveal-on-scroll` CSS class and IntersectionObserver in BaseLayout are kept for Astro sections

**Animation preset library (`lib/animation.ts`):**
- Exports: Framer Motion variant presets (`fadeUp`, `fadeIn`, `stagger`, `springPop`, etc.) + timing constants derived from `brand.ts`
- All existing animated components must be migrated: `RotatingText.tsx`, `FloatingNav.tsx`, and any new components
- CSS animation classes in `global.css` (`animate-fade-up`, `animate-fade-in`, etc.) are kept — used by Astro sections
- No shared hooks (useScrollProgress, useParallax) — out of scope for this phase

### Claude's Discretion
- What the right-side desktop element is in the new hero (stats card, browser mockup, abstract visual, etc.)
- Exact spring stiffness and damping values within the "snappy and confident" energy target
- Which specific sections on each page get Framer Motion stagger vs CSS reveals
- Loading skeleton or placeholder behavior during animation

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANIM-01 | Animation preset system established (`lib/animation.ts`) with consistent easing curves and duration tokens used across all animated components | Framer Motion variant pattern + brand.ts token mapping — defines exact exports and migration targets |
| ANIM-02 | Hero section features a show-off Framer Motion animation that demonstrates technical capability (spring physics, scroll-driven, or orchestrated reveal) | Spring physics API (stiffness/damping), orchestrated stagger with variants, new React island hero component architecture |
| ANIM-03 | View Transitions API implemented for smooth page-to-page transitions using Astro's native support | ClientRouter from `astro:transitions`, transition:persist for FloatingNav, fade({ duration }) API |
</phase_requirements>

---

## Summary

This phase has three clearly bounded deliverables: a centralized animation preset library (`lib/animation.ts`), a new hero component with orchestrated Framer Motion spring animations, and Astro's ClientRouter for page transitions. All three are additive — the CSS animation system in `global.css` and the IntersectionObserver in `BaseLayout.astro` survive untouched. What changes is the React-side animation layer: hardcoded values get consolidated into typed exports, and new components use those exports from day one.

Framer Motion v12 (currently at 12.23.26) is already installed and in production use across five components (`RotatingText`, `FloatingNav`, `LandingHeroAnimation`, `DeviceMockup`, `ContactForm`). The API surface we need — `motion`, `AnimatePresence`, `useReducedMotion`, `useScroll`, `variants`, `staggerChildren` — is unchanged from prior versions. The key discipline for the hero is using the **variants pattern** for orchestration (not ad-hoc inline transitions), which allows parent-controls-children stagger to work cleanly. Spring values for "snappy and confident": stiffness 400, damping 30 (fast settle, minimal oscillation).

Astro's `ClientRouter` is the correct import in Astro 5 (`ViewTransitions` was renamed in v5). It goes in `BaseLayout.astro`'s `<head>`. For `FloatingNav`, `transition:persist` keeps the React island alive across navigations. The hero animation replays on every homepage visit because the hero component unmounts/remounts on navigation (it is not persisted), which is the correct behavior by default — no special handling needed.

**Primary recommendation:** Build `lib/animation.ts` first (ANIM-01), then the hero (ANIM-02), then ClientRouter (ANIM-03). The library creates the typed foundation; the hero validates it with the most complex usage; ClientRouter is a one-file change in BaseLayout.

---

## Standard Stack

### Core (already installed — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | 12.23.26 | Spring physics, variant orchestration, whileInView, AnimatePresence | Already in use; React 19 compatible; dominant React animation library |
| astro (ClientRouter) | 5.x (built-in) | Page-to-page view transitions with client-side routing | Native Astro 5 API; no extra package needed |

### Supporting (already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react | 19.2.3 | Runtime for all animated islands | All hero and island animation components |
| tailwind-merge + clsx | current | Class merging in cn() utility | Conditional animation class composition in TSX |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Framer Motion variants | GSAP timelines | GSAP is more precise for complex sequences but adds 30KB+ and isn't already installed |
| ClientRouter (client-side routing) | Native CSS @view-transition | Native approach is simpler but loses transition:persist for FloatingNav state; requires Chromium 126+ |

**Installation:** No new packages needed. All dependencies exist.

---

## Architecture Patterns

### File Structure After Phase 2

```
src/
├── lib/
│   ├── utils.ts              # existing — cn() helper
│   └── animation.ts          # NEW — Framer Motion presets + timing constants
├── components/
│   └── islands/
│       ├── FloatingNav.tsx   # migrate hardcoded values → animation.ts imports
│       ├── RotatingText.tsx  # migrate hardcoded values → animation.ts imports
│       ├── HeroIsland.tsx    # NEW — replaces Hero.astro + DeviceMockup + LandingHeroAnimation
│       └── [other islands]   # MobileMenu, HeroMicroForm — touch only if animated
├── pages/
│   └── _home/
│       ├── Hero.astro        # replaced — now renders <HeroIsland client:load />
│       └── [other sections]  # get whileInView stagger where applicable
└── layouts/
    └── BaseLayout.astro      # add <ClientRouter /> to <head>
```

### Pattern 1: Animation Preset Library (`lib/animation.ts`)

**What:** A single typed module that exports Framer Motion `Variants` objects and numeric timing constants derived from `brand.ts`. Every React component imports from here instead of hardcoding transition values.

**When to use:** Any TSX component that uses `motion.*` must import variants from here.

**Example:**

```typescript
// src/lib/animation.ts
import type { Variants, Transition } from 'framer-motion';

// Timing constants derived from brand.ts (converted to seconds for Framer Motion)
export const duration = {
  fast: 0.15,    // brand: 150ms
  normal: 0.3,   // brand: 300ms
  slow: 0.5,     // brand: 500ms
} as const;

export const delay = {
  1: 0.1,
  2: 0.2,
  3: 0.3,
  4: 0.4,
  5: 0.5,
} as const;

// Spring presets (snappy and confident — fast settle, authority)
export const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 30 } satisfies Transition,
  gentle: { type: 'spring', stiffness: 200, damping: 28 } satisfies Transition,
  pop:    { type: 'spring', stiffness: 500, damping: 25 } satisfies Transition,
} as const;

// Variant presets
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

export const springPop: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

// Stagger container — controls children animation order
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,  // 80ms — per locked decision
      delayChildren: 0.1,
    },
  },
};

// Hero orchestration (faster stagger for snappy feel)
export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};
```

### Pattern 2: Hero Island with Orchestrated Variants

**What:** A new React island (`HeroIsland.tsx`) that replaces `Hero.astro` + `DeviceMockup.tsx` + `LandingHeroAnimation.tsx`. Uses parent-container variants to automatically stagger children.

**When to use:** The hero is the only full-replacement section — all other sections keep their Astro structure.

**Example (skeleton):**

```typescript
// src/components/islands/HeroIsland.tsx
import { motion, useReducedMotion } from 'framer-motion';
import { heroContainer, fadeUp, springs } from '@/lib/animation';

export default function HeroIsland() {
  const shouldReduceMotion = useReducedMotion();

  const containerProps = shouldReduceMotion
    ? {}
    : { variants: heroContainer, initial: 'hidden', animate: 'visible' };

  return (
    <section className="...">
      {/* Left: text content */}
      <motion.div {...containerProps}>
        <motion.h1
          variants={shouldReduceMotion ? {} : fadeUp}
          transition={springs.snappy}
          className="..."
        >
          Nettsider som...
        </motion.h1>
        <motion.p variants={shouldReduceMotion ? {} : fadeUp} transition={springs.gentle}>
          ...
        </motion.p>
        {/* CTA buttons */}
        <motion.div variants={shouldReduceMotion ? {} : fadeUp} transition={springs.snappy}>
          ...
        </motion.div>
      </motion.div>

      {/* Right: desktop visual element */}
      <motion.div
        className="hidden lg:flex"
        variants={shouldReduceMotion ? {} : springPop}
        transition={{ ...springs.gentle, delay: 0.3 }}
      >
        {/* Claude's discretion: stats card / visual element */}
      </motion.div>
    </section>
  );
}
```

### Pattern 3: whileInView Stagger for React Islands

**What:** Grid/card sections that are React islands use `whileInView` + `staggerContainer` + `fadeUp` children.

**When to use:** React islands where sequential card animation is needed (Framer Motion handles the stagger).

**Example:**

```typescript
// Any React island grid
import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, fadeUp, springs } from '@/lib/animation';

export default function CardGrid({ items }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.ul
      variants={shouldReduceMotion ? {} : staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {items.map((item) => (
        <motion.li
          key={item.id}
          variants={shouldReduceMotion ? {} : fadeUp}
          transition={springs.gentle}
        >
          {/* card content */}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Pattern 4: Astro View Transitions (ANIM-03)

**What:** Add `<ClientRouter />` to `BaseLayout.astro` head. Add `transition:persist` to `FloatingNav`. Configure fade duration.

**When to use:** One-time BaseLayout change; applies site-wide.

**Example:**

```astro
---
// BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
---
<head>
  <!-- existing head content -->
  <ClientRouter />
</head>

<!-- FloatingNav gets transition:persist -->
<FloatingNav client:load transition:persist />
```

**Fade duration customization:**

```astro
---
import { fade } from 'astro:transitions';
---
<!-- Applied at the body/main level for site-wide fade -->
<body transition:animate={fade({ duration: '0.15s' })}>
```

**Hero animation replay:** Because `HeroIsland` does NOT have `transition:persist`, it unmounts and remounts on every navigation to `/`. The `initial="hidden"` + `animate="visible"` props ensure the orchestrated reveal plays fresh every time. No special handling needed.

### Anti-Patterns to Avoid

- **Hardcoded transition values in TSX:** `transition={{ duration: 0.4, ease: 'easeOut' }}` inline — always use exports from `animation.ts` instead
- **Skipping `useReducedMotion` check:** Every TSX component with motion must guard; don't pass variants when `shouldReduceMotion` is true
- **transition:persist on the hero:** Would prevent the replay requirement; hero must remount on each page visit
- **staggerChildren on the wrong element:** Must be on the parent `motion.*` container, not the children
- **Mixing CSS reveal-on-scroll with Framer Motion whileInView on the same element:** Pick one per element; CSS for Astro sections, Framer Motion for React islands

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Spring physics "snappy" feel | CSS cubic-bezier approximation | `type: 'spring', stiffness: 400, damping: 30` in Framer Motion | Real spring physics; velocity-sensitive; feels natural |
| Sequential stagger across children | setTimeout chains | `staggerChildren` in parent variant transition | Declarative, synchronized, respects reduced motion via one guard |
| Reduced motion detection | Custom `matchMedia` listener (as done in `LandingHeroAnimation.tsx`) | `useReducedMotion()` from framer-motion | Framer's hook also handles SSR and the initial paint correctly |
| Page fade transitions | JavaScript intercept + CSS class toggle | `ClientRouter` + `transition:animate={fade()}` | Browser-native; progressive enhancement; zero JS overhead on unsupported browsers |
| Element persistence across navigations | Custom SPA router logic | `transition:persist` directive | Built into Astro; handles React island state automatically |

**Key insight:** The `LandingHeroAnimation.tsx` component hand-rolls its own `useReducedMotion` hook — this is exactly the pattern to retire. The project already imports `useReducedMotion` from framer-motion in newer components; all components should use the library's version.

---

## Common Pitfalls

### Pitfall 1: Variants Not Flowing to Children

**What goes wrong:** Parent has `variants={staggerContainer}` but children don't animate — they appear immediately.
**Why it happens:** Children must have `variants` prop set AND must be `motion.*` elements. Plain `<div>` children don't receive variant flow.
**How to avoid:** Every child that should animate must be `<motion.div variants={fadeUp}>` (not `<div>`).
**Warning signs:** Parent animates but children appear without transition.

### Pitfall 2: `whileInView` Replaying on Every Scroll Pass

**What goes wrong:** Elements re-animate every time they enter/exit the viewport.
**Why it happens:** `viewport={{ once: false }}` is the default.
**How to avoid:** Always set `viewport={{ once: true, margin: '-50px' }}`. The `-50px` root margin triggers reveal 50px before the element enters the viewport for a smoother feel.
**Warning signs:** Cards animating on scroll up and down repeatedly.

### Pitfall 3: ClientRouter Breaks Script Re-initialization

**What goes wrong:** Third-party scripts or inline `<script>` tags (like the IntersectionObserver in BaseLayout) stop working after navigation.
**Why it happens:** ClientRouter uses client-side routing — scripts only run once on initial load. After navigation, the DOM updates but scripts don't re-run.
**How to avoid:** The existing IntersectionObserver script in BaseLayout must be wrapped with the `astro:page-load` event to re-run after each navigation.

```astro
<script>
  function initScrollObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });
  }

  // Run on initial load AND after each View Transition navigation
  document.addEventListener('astro:page-load', initScrollObserver);
</script>
```

**Warning signs:** CSS `reveal-on-scroll` elements stay hidden after navigating away and back.

### Pitfall 4: `transition:persist` Causes FloatingNav State Mismatch

**What goes wrong:** FloatingNav shows the wrong `currentPath` after navigation (stays on the previous page's active state).
**Why it happens:** `transition:persist` keeps the React island alive with its existing state; `useEffect` that sets `currentPath` doesn't re-run on navigation.
**How to avoid:** FloatingNav must listen to `astro:page-load` event (or use `document.addEventListener('astro:after-swap', ...)`) to update `currentPath` after navigation.

```typescript
// FloatingNav.tsx — update currentPath on navigation
useEffect(() => {
  const updatePath = () => setCurrentPath(window.location.pathname);
  updatePath(); // initial
  document.addEventListener('astro:page-load', updatePath);
  return () => document.removeEventListener('astro:page-load', updatePath);
}, []);
```

**Warning signs:** Active nav link shows the wrong page highlighted after navigating.

### Pitfall 5: Hero Animation Not Replaying

**What goes wrong:** Hero animation only plays on first load; navigating back to `/` shows static hero.
**Why it happens:** If `HeroIsland` is accidentally given `transition:persist`, it survives navigation and never re-mounts.
**How to avoid:** Never add `transition:persist` to `HeroIsland`. Its default behavior (unmount/remount) is correct.
**Warning signs:** Hero appears instantly (no spring animation) on returning to homepage.

### Pitfall 6: Framer Motion Timing in Seconds, brand.ts in Milliseconds

**What goes wrong:** `duration: brand.duration.fast` (= `'150ms'` string) passed to Framer Motion transition causes it to use 150 seconds.
**Why it happens:** Framer Motion uses **seconds** (numbers), not millisecond strings.
**How to avoid:** `animation.ts` must convert: `fast: 0.15` (not `'150ms'`). Never pass brand.ts string values directly to Framer Motion.
**Warning signs:** Animations play extremely slowly or snap instantly.

---

## Code Examples

Verified patterns from official sources and existing codebase:

### Animation Preset Library Structure

```typescript
// src/lib/animation.ts — full export surface
import type { Variants, Transition } from 'framer-motion';

// Seconds (Framer Motion) — derived from brand.ts ms values
export const duration = { fast: 0.15, normal: 0.3, slow: 0.5 } as const;
export const delay    = { 1: 0.1, 2: 0.2, 3: 0.3, 4: 0.4, 5: 0.5 } as const;

// Spring physics — "snappy and confident"
export const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 30 } satisfies Transition,
  gentle: { type: 'spring', stiffness: 200, damping: 28 } satisfies Transition,
  pop:    { type: 'spring', stiffness: 500, damping: 25 } satisfies Transition,
} as const;

// Reusable variants
export const fadeUp: Variants      = { hidden: { opacity: 0, y: 20 },   visible: { opacity: 1, y: 0 } };
export const fadeIn: Variants      = { hidden: { opacity: 0 },           visible: { opacity: 1 } };
export const springPop: Variants   = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } };
export const slideLeft: Variants   = { hidden: { opacity: 0, x: -20 },  visible: { opacity: 1, x: 0 } };
export const slideRight: Variants  = { hidden: { opacity: 0, x: 20 },   visible: { opacity: 1, x: 0 } };

// Stagger orchestrators
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
```

### Migrating RotatingText.tsx to use animation.ts

```typescript
// Before (hardcoded):
transition={{ duration: 0.4, ease: 'easeOut' }}

// After (from animation.ts):
import { duration } from '@/lib/animation';
transition={{ duration: duration.normal, ease: 'easeOut' }}
```

### ClientRouter in BaseLayout.astro

```astro
---
// BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
import { fade } from 'astro:transitions';
---
<head>
  <!-- ... existing head ... -->
  <ClientRouter />
</head>
<body transition:animate={fade({ duration: '0.15s' })}>
  <FloatingNav client:load transition:persist />
  <!-- ... -->
</body>
```

### FloatingNav navigation-aware path tracking

```typescript
// FloatingNav.tsx — replace the currentPath useEffect
useEffect(() => {
  const updatePath = () => setCurrentPath(window.location.pathname);
  updatePath();
  document.addEventListener('astro:page-load', updatePath);
  return () => document.removeEventListener('astro:page-load', updatePath);
}, []);
```

### BaseLayout IntersectionObserver — page-load aware

```astro
<script>
  function initScrollObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal-on-scroll:not(.revealed)').forEach((el) => {
      observer.observe(el);
    });
  }
  document.addEventListener('astro:page-load', initScrollObserver);
</script>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `ViewTransitions` component | `ClientRouter` from `astro:transitions` | Astro v5.0 (late 2024) | Rename only; API identical — but using old name gives a deprecation warning |
| Hand-rolled `useReducedMotion` hook (as in LandingHeroAnimation.tsx) | `useReducedMotion()` from framer-motion | framer-motion v6+ | Library version handles SSR + initial paint correctly; remove custom implementations |
| Inline transition objects per component | Centralized variant presets in `lib/animation.ts` | Pattern maturity (not a library change) | Consistency, type safety, single place to tune brand feel |
| `framer-motion` npm package name | `motion` (rebranded) | 2024 | Both `framer-motion` and `motion` resolve to the same library; `framer-motion` still works as an alias |

**Deprecated/outdated in this codebase:**
- `LandingHeroAnimation.tsx`: Hand-rolled `useReducedMotion`, old animation pattern — retire entirely
- `DeviceMockup.tsx`: 3D MacBook animation — retire entirely
- Inline `transition={{ duration: 0.4, ease: 'easeOut' }}` patterns in all TSX files — migrate to `animation.ts` exports

---

## Open Questions

1. **Right-side desktop hero element**
   - What we know: Claude has full discretion; "stats card, browser mockup, abstract visual" mentioned as options
   - Recommendation: A floating stats/metrics card (performance score, load time, Lighthouse score) — communicates technical capability without needing an image asset, animates well with springPop, and speaks to the target audience (business owners who care about results). Cards with numbers animate more impressively than static mockups.

2. **Which non-homepage sections get Framer Motion stagger vs keeping CSS reveals**
   - What we know: "All pages get upgraded scroll animations where applicable"; hybrid approach
   - Recommendation: Only add Framer Motion whileInView stagger to sections that are already React islands OR where 80ms sequential card stagger is the explicit effect. For Astro sections (Problem, Solution, Values, Approach, Support, etc.) the existing `reveal-on-scroll delay-{N}` CSS system already achieves sequential reveal and should not be replaced. Framer Motion overhead isn't justified for non-island sections.

3. **astro:page-load vs astro:after-swap for FloatingNav path update**
   - What we know: Both events exist; `astro:page-load` fires after new page content is ready and scripts have run; `astro:after-swap` fires right after the DOM swap
   - Recommendation: Use `astro:page-load` for path updates — it fires after the full transition completes, so `window.location.pathname` reflects the new page.

---

## Validation Architecture

> Skipped — `workflow.nyquist_validation` is not present in `.planning/config.json` (field absent, treated as false).

---

## Sources

### Primary (HIGH confidence)
- https://docs.astro.build/en/guides/view-transitions/ — ClientRouter import, transition:persist, transition:animate fade, lifecycle events (astro:page-load)
- https://docs.astro.build/en/reference/modules/astro-transitions/ — API reference for ClientRouter and fade imports
- Project source: `src/config/brand.ts` — confirmed token names and values (ms strings)
- Project source: `src/components/islands/*.tsx` — confirmed existing Framer Motion import patterns and useReducedMotion usage
- Project source: `src/styles/global.css` — confirmed CSS animation classes and reveal-on-scroll pattern
- Project source: `src/layouts/BaseLayout.astro` — confirmed IntersectionObserver script location
- Project source: `package.json` — confirmed framer-motion@12.23.26, react@19.2.3, astro@5.x

### Secondary (MEDIUM confidence)
- https://github.com/withastro/astro/pull/11980 — confirms ViewTransitions renamed to ClientRouter in Astro v5
- WebSearch results for framer-motion v12 spring/stagger — confirmed spring property names (stiffness, damping, mass), staggerChildren/delayChildren pattern, and that no breaking API changes affect our usage
- https://motion.dev/docs/react-upgrade-guide (via WebSearch summary) — confirmed no breaking changes in v12 affecting motion component, variants, or useReducedMotion
- https://astropatterns.dev/p/react-love/view-transitions-and-react-state — confirmed transition:persist behavior for React islands and astro:page-load event pattern

### Tertiary (LOW confidence)
- Spring presets "snappy: stiffness 400, damping 30" — derived from community patterns and general spring physics knowledge; exact values will need runtime tuning during implementation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — framer-motion and astro:transitions fully confirmed via official docs and existing codebase
- Architecture: HIGH — patterns derived from official Framer Motion variant docs and existing project code
- Pitfalls: HIGH for ClientRouter script re-initialization (documented behavior), MEDIUM for FloatingNav path tracking (confirmed pattern from astropatterns.dev), HIGH for timing unit mismatch (observable in brand.ts)
- Spring values: LOW — community-sourced presets; require runtime tuning

**Research date:** 2026-03-03
**Valid until:** 2026-04-03 (Astro and Framer Motion both stable; 30-day window safe)
