# Architecture Patterns

**Domain:** Web agency marketing site (brand identity system, animation system, SEO layer)
**Researched:** 2026-03-03
**Confidence:** MEDIUM (based on codebase analysis + established patterns in Astro/Tailwind/Framer Motion ecosystem; no live web search available to verify latest practices)

## Current State Analysis

The existing codebase already has a functional architecture. The three systems to layer on top are:

1. **Brand Identity System** -- design tokens, visual consistency, component theming
2. **Animation System** -- choreography, reduced motion, performance budgets
3. **SEO Infrastructure** -- structured data, metadata, local SEO

Each integrates differently with the Astro island architecture. The critical insight: Astro's static-first model means most of this lives in **build-time configuration and Astro components**, not in React runtime code.

---

## Recommended Architecture

### High-Level System Map

```
src/
  config/
    brand.ts          -- Design tokens (colors, spacing, typography, motion)
    seo.ts            -- Site-wide SEO defaults, schema templates
    pricing.ts        -- (existing) pricing data
    launchOffer.ts    -- (existing) launch offer config

  styles/
    global.css        -- (existing) base styles + animations

  lib/
    utils.ts          -- (existing) cn() utility
    seo.ts            -- Schema.org generator functions
    animation.ts      -- Shared animation presets (Framer Motion variants)

  components/
    ui/               -- (existing) Brand-aware primitive components
    sections/         -- (existing) Shared sections
    islands/          -- (existing) React interactive components
    layout/           -- (existing) Footer, nav structure
    seo/              -- NEW: SEO components (JsonLd.astro, PageHead.astro)

  layouts/
    BaseLayout.astro  -- (existing) Consumes SEO components + brand tokens
    LandingPageLayout.astro  -- (existing) Conversion-focused variant
```

### Component Boundaries

| Component | Responsibility | Communicates With | Runtime |
|-----------|---------------|-------------------|---------|
| `config/brand.ts` | Single source of truth for design tokens | Consumed by `tailwind.config.ts`, Astro components, React islands | Build-time |
| `tailwind.config.ts` | Maps brand tokens to Tailwind utilities | Consumes `config/brand.ts`; consumed by all `.astro` and `.tsx` files | Build-time |
| `styles/global.css` | CSS animations (Level 0-1), base styles | Consumes Tailwind theme; consumed by layouts | Build-time |
| `lib/animation.ts` | Framer Motion variant presets | Consumed by React islands only | Client-side |
| `lib/seo.ts` | Schema.org JSON-LD generators | Consumed by SEO components | Build-time |
| `config/seo.ts` | Site-wide SEO defaults | Consumed by `lib/seo.ts` and layout `<head>` | Build-time |
| `components/seo/` | Astro components for `<head>` injection | Consumed by layouts | Build-time |
| `components/ui/` | Brand-aware UI primitives | Consume Tailwind classes (which come from brand tokens) | Build-time (Astro) |
| `components/islands/` | Interactive elements with Framer Motion | Consume `lib/animation.ts` presets + Tailwind brand classes | Client-side (React) |

---

## System 1: Brand Identity Architecture

### Problem

Currently, brand values are scattered:
- Colors defined in `tailwind.config.ts` (the authoritative source)
- Hardcoded hex values in some components (e.g., `#06b6d4` in theme-color meta)
- Typography weights specified inline in Google Fonts URL
- No documented spacing scale, radius conventions, or shadow patterns
- Button variants have inline Tailwind classes that encode brand decisions

### Recommended Pattern: Design Tokens Source File

Create a single TypeScript file that holds all brand decisions. Both Tailwind config and components reference it.

```
config/brand.ts  ──>  tailwind.config.ts  ──>  All Tailwind classes
                 ──>  BaseLayout.astro (meta theme-color, font URLs)
                 ──>  components/ui/* (variant definitions reference tokens)
```

**Why a TS file, not CSS variables:**
- Type-safe -- TypeScript catches misreferences at build time
- Astro components can import and use values in `<head>` meta tags and JSON-LD
- Tailwind 4 can consume the values via config
- React islands get the values via Tailwind classes (no extra import needed)
- CSS custom properties should be a *generated output* of the tokens, not the source

### Component Architecture

```typescript
// config/brand.ts - THE source of truth
export const brand = {
  colors: {
    brand: { DEFAULT: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
    surface: { DEFAULT: '#020617', raised: '#0F172A' },
    text: { DEFAULT: '#F8FAFC', muted: '#94A3B8' },
  },
  font: {
    family: 'Inter',
    weights: [400, 500, 600, 700],
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  spacing: {
    section: { sm: 'py-12 md:py-16', md: 'py-16 md:py-24', lg: 'py-24 md:py-32' },
    container: { maxWidth: '1280px' },
  },
  meta: {
    themeColor: '#06b6d4',
    siteName: 'Nettup',
  },
} as const;
```

### Data Flow: Brand Tokens

```
brand.ts
  |
  +-- tailwind.config.ts (colors, fonts, extends)
  |     |
  |     +-- Every .astro and .tsx file via utility classes
  |
  +-- BaseLayout.astro (theme-color, font preload URL, JSON-LD logo color)
  |
  +-- LandingPageLayout.astro (same head values)
  |
  +-- global.css (references via theme() function -- already works)
```

### Anti-Pattern: Dual Source of Truth

Do NOT define colors in both `brand.ts` and `tailwind.config.ts`. The Tailwind config should import from `brand.ts`:

```typescript
// tailwind.config.ts
import { brand } from './src/config/brand';

export default {
  theme: {
    extend: {
      colors: brand.colors,
      fontFamily: { sans: [brand.font.family, 'system-ui', 'sans-serif'] },
    },
  },
} satisfies Config;
```

---

## System 2: Animation Architecture

### Current Animation Levels (Already Established)

The codebase already defines a clear hierarchy in `global.css`:

| Level | Technology | Used For | Runtime |
|-------|-----------|----------|---------|
| 0 | CSS `@keyframes` | Fade-up, scale-in, slide-in (one-shot) | Zero JS |
| 1 | IntersectionObserver + CSS | Scroll reveals with `.reveal-on-scroll` | ~1KB inline JS |
| 2 | Framer Motion | Sequenced animations, `AnimatePresence` | React island JS |
| 3 | Complex Framer Motion | Hero animation with state machine | React island JS |

This hierarchy is sound. The architectural improvement is to **systematize the Framer Motion layer** (Levels 2-3) the same way CSS animations are already systematized.

### Recommended Pattern: Animation Presets Module

```
lib/animation.ts  ──>  components/islands/*.tsx (import presets)
global.css        ──>  All .astro components (CSS classes)
BaseLayout.astro  ──>  IntersectionObserver script (Level 1 driver)
```

```typescript
// lib/animation.ts
import type { Variants, Transition } from 'framer-motion';

// Shared transition curves
export const transitions = {
  smooth: { duration: 0.5, ease: 'easeOut' } as Transition,
  snappy: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } as Transition,
  spring: { type: 'spring', stiffness: 300, damping: 30 } as Transition,
} as const;

// Reusable variant sets
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitions.smooth },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.smooth },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: transitions.snappy },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

// Reduced motion fallbacks
export function withReducedMotion(variants: Variants): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0 } },
  };
}
```

### Choreography Architecture

For animations that need sequencing (like the hero code-to-website transform), the pattern is a **state machine inside the React island**:

```
[Idle] → [Phase 1: Type Code] → [Phase 2: Transform] → [Phase 3: Show Stats]
```

This is already implemented well in `LandingHeroAnimation.tsx`. The architectural principle: **state machines stay inside the island that owns the animation sequence**. Do not try to coordinate animations across multiple islands -- Astro's island architecture means they hydrate independently.

### Component Boundary: CSS vs Framer Motion

Decision rule:
- **One-shot, non-interactive** (fade in on scroll, stagger children) --> CSS Level 0-1
- **Interactive or sequenced** (respond to state, orchestrated multi-step) --> Framer Motion Level 2-3
- **Shared across islands** --> Extract to `lib/animation.ts` presets
- **Unique to one island** --> Keep inline in that component

### Reduced Motion Architecture

Currently handled in three places (correctly):
1. `global.css` -- CSS `@media (prefers-reduced-motion: reduce)` for Level 0-1
2. `LandingHeroAnimation.tsx` -- custom `useReducedMotion()` hook
3. `FloatingNav.tsx` -- Framer Motion's built-in `useReducedMotion()`

**Consolidation:** The custom `useReducedMotion()` hook in `LandingHeroAnimation.tsx` duplicates Framer Motion's built-in one. All React islands should use Framer Motion's `useReducedMotion()` from the import. The CSS media query handles non-React animations automatically.

### Performance Budget

```
Animation JS Budget:
  framer-motion (shared): ~58 kB gzipped (already loaded for FloatingNav)
  lib/animation.ts presets: <1 kB
  Per-island animation code: <2 kB each

  Total animation overhead: ~61 kB (acceptable -- framer-motion is already a dependency)

CSS Animation Budget:
  global.css animations: 0 kB JS (pure CSS)
  IntersectionObserver: ~0.5 kB inline (already in layout)
```

Since `framer-motion` is already bundled for `FloatingNav` (which loads on every page via `client:load`), additional React islands that use animation presets add minimal overhead -- the library is already cached.

---

## System 3: SEO Infrastructure Architecture

### Current State

SEO is already partially implemented:
- `BaseLayout.astro`: title, meta description, OG tags, canonical URL, Organization + LocalBusiness + Offer JSON-LD
- `LandingPageLayout.astro`: Same meta tags, Organization JSON-LD, noindex option
- `@astrojs/sitemap`: Auto-generates sitemap
- `robots.txt`: Exists
- Google Fonts: Loaded with display=swap

### Problem

SEO configuration is **embedded directly in layout files** as raw JSON objects. This creates:
- Duplication between `BaseLayout.astro` and `LandingPageLayout.astro`
- Hard to add page-specific schemas (Service, FAQ, BreadcrumbList)
- Business info (address, phone, email) hardcoded in multiple places

### Recommended Pattern: SEO Component Layer

```
config/seo.ts (site defaults)
  |
  +-- lib/seo.ts (schema generators)
  |     |
  |     +-- components/seo/JsonLd.astro (renders <script type="application/ld+json">)
  |     +-- components/seo/PageHead.astro (renders all <head> meta tags)
  |
  +-- BaseLayout.astro (uses PageHead + JsonLd)
  +-- LandingPageLayout.astro (uses PageHead + JsonLd)
  +-- Individual pages (can add page-specific JsonLd)
```

### SEO Config Architecture

```typescript
// config/seo.ts
export const siteDefaults = {
  siteName: 'Nettup',
  siteUrl: 'https://nettup.no',
  defaultDescription: 'Nettup lager moderne, raske nettsider for norske bedrifter.',
  defaultImage: '/images/og-image.jpg',
  locale: 'nb_NO',
  language: 'nb',

  business: {
    name: 'Nettup',
    email: 'post@nettup.no',
    phone: '+47 413 27 136',
    address: {
      street: 'Trollaasveien 4',
      city: 'Trollaasen',
      postalCode: '1414',
      region: 'Viken',
      country: 'NO',
    },
    geo: { lat: '59.7833', lng: '10.7833' },
    priceRange: '2500-10000 NOK',
  },
} as const;
```

```typescript
// lib/seo.ts
import { siteDefaults } from '@/config/seo';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteDefaults.business.name,
    url: siteDefaults.siteUrl,
    // ... generated from config
  };
}

export function localBusinessSchema() { /* ... */ }
export function serviceSchema(service: { name: string; description: string }) { /* ... */ }
export function faqSchema(items: Array<{ question: string; answer: string }>) { /* ... */ }
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) { /* ... */ }
```

### Page-Level SEO Data Flow

```
Page file (e.g., /tjenester/index.astro)
  |
  +-- Sets title, description, image via layout props
  |
  +-- Optionally adds page-specific JSON-LD:
  |     <JsonLd schema={faqSchema(faqItems)} />
  |     <JsonLd schema={serviceSchema(serviceData)} />
  |
  +-- Layout handles:
        +-- <PageHead> renders title, meta, OG, canonical
        +-- <JsonLd> renders Organization + LocalBusiness (site-wide)
```

### Per-Page Schema Strategy

| Page | Schema Types | Why |
|------|-------------|-----|
| `/` (Homepage) | Organization, LocalBusiness, Offer | Establishes business identity + current offer |
| `/tjenester` | Service (x3), Offer | Each pricing tier as a Service; launch offer |
| `/om-oss` | Organization, AboutPage | Enriches business identity |
| `/prosjekter` | Organization, ItemList | Portfolio as structured list |
| `/kontakt` | ContactPage, LocalBusiness | Contact info + address for local SEO |
| `/nettside-for-bedrift` | Service, Offer, FAQ, BreadcrumbList | Landing page with rich results potential |

### Local SEO Specifics for Norwegian Market

For "webdesign oslo" and similar searches:
- `LocalBusiness` schema with geo coordinates (already present)
- `areaServed` with specific Norwegian cities/regions (already present)
- `knowsLanguage: "nb"` (already present)
- **Missing:** `BreadcrumbList` schema for pages deeper than root
- **Missing:** `FAQPage` schema on pages with FAQ sections (tjenester, nettside-for-bedrift)
- **Missing:** Per-service `Service` schemas

---

## Cross-System Integration

### How The Three Systems Connect

```
Brand Tokens (config/brand.ts)
  |
  +----> Tailwind Config --> Component styling (all files)
  |
  +----> Animation System: brand colors in glow effects,
  |      shadow-brand/25 in hover states
  |
  +----> SEO System: brand name, logo URL, theme-color

Animation System (global.css + lib/animation.ts)
  |
  +----> UI Components: scroll reveals via CSS classes
  |
  +----> React Islands: Framer Motion presets
  |
  +----> Layouts: IntersectionObserver bootstrap script

SEO System (config/seo.ts + lib/seo.ts + components/seo/)
  |
  +----> Layouts: <head> meta tags + JSON-LD
  |
  +----> Pages: page-specific schemas
  |
  +----> Brand: site name, colors, business info
```

### Shared Data Concerns

Business information (name, phone, email, address) appears in:
- SEO schemas (JSON-LD)
- Footer component
- Contact page
- Landing page header
- Landing page form section

**Solution:** `config/seo.ts` holds business info. All components import from there. This is already partially true for pricing (`config/pricing.ts`) -- extend the pattern.

---

## Patterns to Follow

### Pattern 1: Config-Driven Components

**What:** All brand decisions flow from config files, never hardcoded in components.
**When:** Any time a value appears in more than one place (colors, business info, pricing).
**Example:**

```astro
---
// Footer.astro
import { siteDefaults } from '@/config/seo';
---
<a href={`tel:${siteDefaults.business.phone.replace(/\s/g, '')}`}>
  {siteDefaults.business.phone}
</a>
```

### Pattern 2: Progressive Enhancement Animation

**What:** Animations work in three tiers: CSS-only base, IntersectionObserver scroll, Framer Motion interactive. Each tier is independent.
**When:** Always. Never require JS for content to be visible.
**Example:** Elements start with `opacity: 0` via `.reveal-on-scroll`, transition to visible via IntersectionObserver. If JS fails, content should still be readable (consider adding a `<noscript>` style override or using `opacity: 0` only after JS confirms support).

### Pattern 3: Schema-per-Page

**What:** Each page declares its own JSON-LD schemas as Astro component slots, with site-wide schemas handled by the layout.
**When:** Any page that has structured content (FAQ, services, contact).
**Example:**

```astro
---
// /tjenester/index.astro
import { faqSchema } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd.astro';
---
<BaseLayout title="...">
  <JsonLd schema={faqSchema(faqItems)} slot="head" />
  <!-- page content -->
</BaseLayout>
```

### Pattern 4: Island Isolation

**What:** React islands own their own animation state. No cross-island animation coordination.
**When:** Always. Astro islands hydrate independently; timing between them is unreliable.
**Why:** Astro's partial hydration means Island A might hydrate at a different time than Island B. Trying to synchronize animations across islands creates race conditions.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: CSS Variable Sprawl

**What:** Defining dozens of CSS custom properties that duplicate Tailwind's theme.
**Why bad:** Tailwind 4 already generates utility classes from the config. Adding a parallel CSS variable system creates maintenance overhead and two sources of truth.
**Instead:** Use `brand.ts` --> `tailwind.config.ts` --> Tailwind classes. Only use CSS custom properties for values that genuinely need runtime dynamism (e.g., user-selected theme -- not relevant here).

### Anti-Pattern 2: Animation Library for Simple Reveals

**What:** Using Framer Motion for basic scroll-reveal animations.
**Why bad:** Adds React hydration cost for something CSS handles at zero JS cost. Each Framer Motion reveal is a React island that needs to hydrate.
**Instead:** Use `.reveal-on-scroll` CSS class + the existing IntersectionObserver. Reserve Framer Motion for interactive/sequenced animations.

### Anti-Pattern 3: Centralized Animation Controller

**What:** A global animation orchestrator that coordinates timing across all page sections.
**Why bad:** Fights Astro's architecture. Islands hydrate independently. A "page animation timeline" would need all islands loaded before starting, negating partial hydration benefits.
**Instead:** Each section handles its own entrance. Use CSS `animation-delay` for stagger within a section. Accept that sections animate independently.

### Anti-Pattern 4: Duplicated Schema Data

**What:** Copy-pasting JSON-LD objects into each layout/page.
**Why bad:** Business info changes (new phone, new address) require updating multiple files. Easy to miss one.
**Instead:** Generate all schemas from `config/seo.ts` via `lib/seo.ts` helper functions.

---

## Scalability Considerations

| Concern | Current (5 pages) | At 10 pages | At 20+ pages |
|---------|-------------------|-------------|--------------|
| Brand consistency | Manual -- devs read docs | Token file prevents drift | Same -- tokens scale linearly |
| Animation perf | Fine (3 React islands) | Watch bundle size if adding islands | Consider `client:visible` over `client:load` for non-critical islands |
| SEO schemas | 3 schemas in layout | Per-page schemas via component | Schema generator functions keep it manageable |
| Build time | 1.1s | ~2s | ~3-4s (Astro static scales well) |

---

## Build Order (Dependencies Between Components)

The three systems have clear dependency ordering:

### Phase 1: Brand Identity Foundation (must come first)

1. Create `config/brand.ts` with all design tokens
2. Refactor `tailwind.config.ts` to import from brand config
3. Extract business info into `config/seo.ts`

**Why first:** Everything else depends on having a single source of truth for brand values. Without this, the animation and SEO work will reference hardcoded values that later need refactoring.

### Phase 2: SEO Infrastructure (can proceed independently after Phase 1)

1. Create `lib/seo.ts` with schema generator functions
2. Create `components/seo/JsonLd.astro` component
3. Refactor layouts to use generated schemas instead of inline JSON
4. Add page-specific schemas (FAQ, Service, BreadcrumbList)

**Why second:** SEO changes are build-time only, no client-side impact, low risk. They reference brand config (site name, colors, business info) so Phase 1 must be complete.

### Phase 3: Animation System (can proceed independently after Phase 1)

1. Create `lib/animation.ts` with Framer Motion presets
2. Consolidate `useReducedMotion` across islands (use Framer Motion's built-in)
3. Refactor existing islands to use shared presets
4. Add new choreographed animations where brand identity calls for them

**Why third:** Animation changes have client-side impact and are harder to test. They should build on established brand tokens (e.g., animation curves that match brand personality). The existing animations work fine -- this is refinement, not critical path.

### Parallel Opportunities

- Phase 2 and Phase 3 can run in parallel after Phase 1 completes
- Within Phase 1, brand tokens and SEO config extraction are independent tasks
- UI component refinement (making Button/Section/Card use brand tokens more explicitly) can happen alongside any phase

### Dependency Graph

```
Phase 1: Brand Tokens
  |
  +---> Phase 2: SEO Infrastructure
  |       |
  |       +---> Page-specific schemas
  |
  +---> Phase 3: Animation System
          |
          +---> New choreographed animations

Phase 1 tasks (internal):
  config/brand.ts --> tailwind.config.ts refactor --> UI component audit
  config/seo.ts (business info extraction) -- independent of above
```

---

## Summary: Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| `brand.ts` as token source, not CSS vars | Type-safe, usable in Astro frontmatter + meta tags + Tailwind config |
| CSS animations for reveals, Framer Motion for interaction | Matches Astro's static-first model; avoids unnecessary hydration |
| Schema generators in `lib/seo.ts` | DRY; business info changes propagate automatically |
| No cross-island animation coordination | Respects Astro's partial hydration architecture |
| Per-page schema components via slots | Extensible without layout changes |
| Build brand tokens first | Everything else depends on having single source of truth |
