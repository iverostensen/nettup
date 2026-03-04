# Phase 1: Brand Identity - Research

**Researched:** 2026-03-03
**Domain:** Design token system, typography upgrade, brand documentation — Tailwind v4 + Astro 5
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Heading typography:**
- Font: Space Grotesk replaces Inter for H1 and H2 only
- H3 and body text stay Inter
- H1 weight: 700 (bold), H2 weight: 600 (semibold) — weight creates hierarchy
- Letter spacing: default (0) — Space Grotesk is designed to work at default tracking

**Brand personality:**
- Primary audience: Small local businesses (cafés, tradespeople, clinics) now — but brand should not feel cheap or local-only; it should hold up when pitching growth-stage SMBs later
- Tone of voice: Direct but warm — punchy headlines, friendly and plain-language explanations
- Core values: Speed, honesty, modern, revolutionizing the web agency landscape
- Positioning strategy: Bold mission statement ("vi revolusjonerer webbyråbransjen" or similar) lives on `/om-oss`. Homepage copy stays focused on concrete client benefit — show the mission, don't just claim it.

**Token system:**
- Location: `src/config/brand.ts` — imported into `tailwind.config.ts`. No CSS variables needed.
- Typography tokens: font families (Space Grotesk, Inter), heading weights (700/600)
- Border radius tokens: Unified scale — `radius.sm / md / lg / full`. Replaces current inconsistency (buttons `rounded-full`, cards `rounded-xl` — these get mapped to the scale)
- Animation tokens: `duration.fast / normal / slow`, `easing.default / snappy / gentle`, `delay.1–5` — replaces hardcoded `0.5s`, `0.3s`, `200ms` and the `reveal-delay-*` CSS classes

**Visual signature:**
- Style reference: Framer / Resend — dark base, brand color moments, subtle gradients, premium details. Not ultra-minimal (Vercel), not heavy (generic SaaS).
- Typography does the heavy lifting — Space Grotesk + intentional sizing
- Gradient moments (sparingly): Only on the rotating hero word (gradient text: cyan to white or similar) and primary CTA button glow on hover. Not scattered across sections.
- Everything else stays clean — the grain texture and dark bg remain, no new decorative elements added in this phase

### Claude's Discretion
- Exact gradient values (start/end colors for the rotating word gradient)
- Specific easing curve values (e.g. exact cubic-bezier for `easing.snappy`)
- Shadow definition for CTA glow (intensity, spread, color opacity)
- Whether brand.ts exports a typed object or individual named exports

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| BRAND-01 | Site reflects a defined brand personality — tone, values, and personality are documented and consistently expressed in copy and design | Brand document structure, Norwegian tone guidelines, copy audit approach |
| BRAND-02 | Design token system implemented in code (`config/brand.ts` → Tailwind config) covering colors, typography scale, spacing, animation timing, and border radius conventions | Tailwind v4 + @config pattern, brand.ts typed object structure, integration with existing tailwind.config.ts |
| BRAND-03 | Typography upgraded with a distinct heading font that signals craft and differentiates from generic dark-theme sites | Space Grotesk loading via Google Fonts API, font-family token in tailwind.config.ts, targeted H1/H2 application |
</phase_requirements>

---

## Summary

This phase has two distinct tracks: (1) a creative/editorial track producing a brand document and auditing site copy against it, and (2) a technical track creating `src/config/brand.ts` and wiring it into the existing Tailwind config. Both tracks are self-contained and can be parallelized.

The technical track is low-risk. The project already uses Tailwind v4 with a `tailwind.config.ts` connected via `@config '../../tailwind.config.ts'` in `global.css`. The existing `theme.extend` pattern works and is confirmed by a passing build. Adding `brand.ts` as an import into `tailwind.config.ts` follows the exact same pattern as the existing `launchOffer.ts` config in `src/config/`. Space Grotesk loads via Google Fonts with the same preload/defer pattern already established for Inter.

The creative track requires intentional decisions. The brand document (`.planning/BRAND.md`) needs to articulate Nettup's personality concretely enough that it can constrain copy choices in Phase 3. The RotatingText component in the hero already uses Framer Motion with `AnimatePresence` — adding gradient text is a Tailwind class change on that component, not a component refactor.

**Primary recommendation:** Create `brand.ts` as a strongly-typed const object, import it into `tailwind.config.ts` via `theme.extend`, add Space Grotesk to BaseLayout's font preload, apply `font-display` Tailwind class to H1/H2 selectors globally, and write `.planning/BRAND.md` as the brand source of truth.

---

## Standard Stack

### Core (already installed — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.x | Utility CSS, token consumption | Already in project; `@config` directive supports JS/TS config |
| TypeScript | 5.x | Type-safe brand.ts | Already in project; strict mode |
| Astro | 5.x | HTML layout, font loading in BaseLayout | Already in project |
| Framer Motion | 12.x | Rotating text gradient animation | Already in project |

### Supporting (no installation needed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Google Fonts API v2 | N/A | Space Grotesk variable font delivery | Same CDN pattern as existing Inter; supports `wght` axis |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Google Fonts CDN | `@fontsource-variable/space-grotesk` npm package | npm package avoids CDN dependency, self-hosts; tradeoff is one more dependency and manual subset management. Google Fonts CDN is simpler and consistent with existing Inter loading — stick with it. |
| `tailwind.config.ts` import | CSS `@theme` in global.css | Tailwind v4's preferred CSS-first approach, but CONTEXT.md explicitly locked `src/config/brand.ts` → `tailwind.config.ts`. The `@config` directive keeps this working correctly. |

**Installation:** No new packages needed. Zero new dependencies.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── config/
│   ├── brand.ts          # NEW: single source of truth for all design tokens
│   ├── launchOffer.ts    # existing
│   └── pricing.ts        # existing
├── styles/
│   └── global.css        # MODIFIED: remove reveal-delay CSS classes (replaced by tokens)
├── layouts/
│   └── BaseLayout.astro  # MODIFIED: add Space Grotesk preload + font load
└── components/ui/
    ├── Button.astro       # MODIFIED: use radius/duration tokens
    ├── Card.astro         # MODIFIED: use radius/duration tokens
    └── SectionHeader.astro # MODIFIED: use font-display class on h2
.planning/
└── BRAND.md              # NEW: brand personality document
```

### Pattern 1: Brand Token File (brand.ts)

**What:** A strongly-typed TypeScript const that exports all design tokens. Imported into `tailwind.config.ts` via `theme.extend`.

**When to use:** Always — this is the single source of truth. Components reference Tailwind classes derived from these tokens, not the file directly.

**Example:**
```typescript
// src/config/brand.ts
// Source: based on existing tailwind.config.ts pattern + CONTEXT.md decisions

export const brand = {
  fonts: {
    display: 'Space Grotesk, system-ui, sans-serif',   // H1, H2
    body: 'Inter, system-ui, sans-serif',               // H3, body
  },
  fontWeight: {
    h1: '700',
    h2: '600',
  },
  radius: {
    sm: '0.375rem',    // 6px — small elements (badges, tags)
    md: '0.75rem',     // 12px — cards, inputs
    lg: '1.5rem',      // 24px — larger containers
    full: '9999px',    // buttons (maps existing rounded-full)
  },
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'ease-out',
    snappy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',   // slight overshoot
    gentle: 'cubic-bezier(0.4, 0, 0.2, 1)',         // standard ease
  },
  delay: {
    1: '100ms',
    2: '200ms',
    3: '300ms',
    4: '400ms',
    5: '500ms',
  },
} as const;

export type Brand = typeof brand;
```

### Pattern 2: Tailwind Config Integration

**What:** Import `brand` and spread into `theme.extend`.

**Example:**
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { brand } from './src/config/brand';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
          dark: '#0891b2',
        },
        surface: {
          DEFAULT: '#020617',
          raised: '#0F172A',
        },
        text: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        display: [brand.fonts.display],   // → font-display class
        sans: [brand.fonts.body],         // → font-sans class (unchanged)
      },
      borderRadius: {
        sm: brand.radius.sm,
        md: brand.radius.md,
        lg: brand.radius.lg,
        full: brand.radius.full,
      },
      transitionDuration: {
        fast: brand.duration.fast,
        normal: brand.duration.normal,
        slow: brand.duration.slow,
      },
      transitionDelay: {
        1: brand.delay[1],
        2: brand.delay[2],
        3: brand.delay[3],
        4: brand.delay[4],
        5: brand.delay[5],
      },
      transitionTimingFunction: {
        snappy: brand.easing.snappy,
        gentle: brand.easing.gentle,
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### Pattern 3: Space Grotesk Font Loading (BaseLayout.astro)

**What:** Add Space Grotesk to existing Google Fonts preload chain alongside Inter. Use variable font with `wght` axis to cover both 600 and 700 in one request.

**Example:**
```astro
<!-- In BaseLayout.astro <head> — add alongside existing Inter block -->

<!-- Combine into one request for performance -->
<link
  rel="preload"
  href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
  as="style"
/>
<link
  href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
  media="print"
  onload="this.media='all'"
/>
<noscript>
  <link
    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</noscript>
```

### Pattern 4: Applying font-display to H1/H2

**What:** Apply `font-display` Tailwind class to all H1 and H2 headings. Two locations: SectionHeader.astro (shared H2) and each page Hero section's H1. Do NOT use a global CSS `h1, h2` selector — the targeted class approach is more predictable in Astro's scoped styles.

**Example:**
```astro
<!-- SectionHeader.astro -->
<h2 class="reveal-on-scroll font-display text-3xl font-semibold md:text-4xl">
  {title}
</h2>

<!-- Page Hero H1 (e.g., src/pages/_home/Hero.astro) -->
<h1 class="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl xl:text-7xl">
```

### Pattern 5: Gradient Text for RotatingText (RotatingText.tsx)

**What:** Replace solid `text-brand` with CSS gradient text on the rotating word. Standard CSS technique: `background-clip: text; -webkit-background-clip: text; color: transparent` with a background gradient.

**When to use:** ONLY on the RotatingText component — this is the single brand gradient moment in Phase 1.

**Recommended gradient:** Cyan (#06b6d4) → white (#F8FAFC). The direction should go from left to right or bottom-left to top-right to give it lift.

**Example:**
```tsx
// RotatingText.tsx — replace className="inline-block text-brand" with:
className="inline-block bg-gradient-to-r from-brand to-white bg-clip-text text-transparent"

// Tailwind classes: bg-gradient-to-r from-brand to-text bg-clip-text text-transparent
// bg-clip-text is Tailwind's utility for -webkit-background-clip: text
// text-transparent sets color: transparent
```

Note: The Tailwind class `bg-clip-text` generates both `background-clip: text` and `-webkit-background-clip: text`. `text-transparent` sets `color: transparent`. This is a standard, well-supported technique.

### Pattern 6: Component Token Migration

**What:** Update UI components to use Tailwind classes generated from brand tokens instead of hardcoded values.

**Migration map:**
| Component | Before | After |
|-----------|--------|-------|
| Button.astro | `rounded-full` | `rounded-full` (maps to `brand.radius.full` → same value, no visual change) |
| Button.astro | `duration-200` | `duration-fast` (maps to `brand.duration.fast = 150ms`) or `duration-normal` (300ms) |
| Card.astro | `rounded-xl` | `rounded-lg` (maps to `brand.radius.lg = 1.5rem = 24px`; Tailwind's `xl` = 0.75rem, so this is a visible change — verify visually) |
| Card.astro | `duration-300` | `duration-normal` |
| global.css | `.reveal-delay-1` through `.reveal-delay-6` | Remove — replaced by `delay-1` through `delay-5` Tailwind utilities |
| SectionHeader.astro | `font-bold` on h2 | `font-semibold` (per CONTEXT.md: H2 = 600) |

### Pattern 7: Brand Document Structure (.planning/BRAND.md)

**What:** A markdown document that defines Nettup's brand personality for internal reference. Consumed during Phase 3 copy work.

**Recommended sections:**
```markdown
# Nettup Brand

## The Mission
[The big idea — "vi revolusjonerer webbyråbransjen"]

## Who We're For
[Primary: small local businesses. Secondary readiness: growth-stage SMBs]

## Tone of Voice
[Direct but warm. Punchy headlines, plain-language explanations. Rules + examples.]

## What We Say / What We Don't Say
[Contrast table: on-brand vs off-brand phrases]

## Visual Values
[Dark, premium, focused. References: Framer.com, Resend.com]

## Copy Principles
[Max 3 rules with examples — e.g., "Lead with benefit, not feature"]
```

### Anti-Patterns to Avoid

- **Global `h1, h2` CSS rule for font-family:** Causes unexpected overrides in Astro scoped styles. Use explicit `font-display` Tailwind classes instead.
- **Spreading tokens as arbitrary CSS variables:** CONTEXT.md explicitly says "no CSS variables needed" — keep tokens in the TS layer only.
- **Replacing all `duration-300` class instances blindly:** The `duration-normal` token needs to match the old value (300ms = `normal`). If `duration.fast` = 150ms, components currently using `duration-200` should move to `duration-fast` (close enough at 150ms) or stay explicit.
- **Gradient text everywhere:** Only on RotatingText. No other elements get gradient text in Phase 1.
- **Changing the color palette:** REQUIREMENTS.md explicitly says "Ny fargepall i v1" is out of scope. Existing colors migrate into brand.ts as-is.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font subsetting | Custom font subsetting/WOFF2 generation | Google Fonts `wght@600;700` query param | GFonts automatically subsets; no build tooling needed |
| CSS variable sync | Script to sync brand.ts values to CSS vars | Tailwind config import | brand.ts IS the source; Tailwind generates classes from it |
| Type-safe class names | Custom TypeScript utility for Tailwind class names | Direct Tailwind class strings | Adds complexity with no real benefit at this codebase size |
| Brand doc templates | Custom tooling | Plain markdown `.planning/BRAND.md` | Simplest thing that works; consumed by humans, not machines |

**Key insight:** The existing infrastructure (Tailwind @config, Google Fonts preload pattern, theme.extend) handles everything. This phase is configuration, not engineering.

---

## Common Pitfalls

### Pitfall 1: Card.astro radius visual regression

**What goes wrong:** `rounded-xl` in Tailwind is `0.75rem` (12px). If `brand.radius.lg` is set to `1.5rem` (24px), cards will visually get rounder — which may or may not be desired.
**Why it happens:** Tailwind's built-in `rounded-xl` doesn't equal any custom radius token by default.
**How to avoid:** Set `brand.radius.lg` to `0.75rem` to match existing `rounded-xl` exactly, OR consciously accept the larger radius as a brand decision. Confirm the intended value before setting it.
**Warning signs:** Cards look noticeably more rounded post-migration than expected.

### Pitfall 2: Combining Inter and Space Grotesk in a single Google Fonts URL

**What goes wrong:** If font families are split into separate `<link>` tags, each creates an extra network round-trip. The existing code has Inter in its own link tag.
**Why it happens:** Naive copy-paste of existing Inter block to add Space Grotesk.
**How to avoid:** Merge both families into one Google Fonts URL: `?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600;700&display=swap`. Replace the existing Inter link tag entirely.
**Warning signs:** Two separate Google Fonts `<link rel="preload">` tags in the HTML.

### Pitfall 3: font-display class conflicts with Tailwind built-in

**What goes wrong:** Tailwind v4 has a built-in `font-display` utility that controls `font-display` CSS property (e.g., `font-display: swap`), not the font-family.
**Why it happens:** Naming collision between the token name `fontFamily.display` and Tailwind's utility for the `font-display` CSS property.
**How to avoid:** Verify the generated Tailwind class. In `fontFamily.display`, the generated class is `font-display` (font-family utility), which does NOT conflict with Tailwind's `font-display: swap` utility (that would be a CSS property utility, not a font-family utility). They are separate namespaces in Tailwind's utility system. Confirm by checking that `class="font-display"` renders with `font-family: "Space Grotesk"`.
**Warning signs:** Headings don't switch to Space Grotesk after adding `font-display` class.

### Pitfall 4: animation-delay utilities not generated

**What goes wrong:** `delay-1`, `delay-2` etc. are not Tailwind built-ins — they require the custom `transitionDelay` extension to be defined in tailwind.config.ts.
**Why it happens:** Assuming Tailwind generates numeric delay utilities by default.
**How to avoid:** Confirm `transitionDelay` keys are set in `theme.extend.transitionDelay` in tailwind.config.ts. After building, verify `delay-1` generates a CSS class `transition-delay: 100ms`.
**Warning signs:** `reveal-delay-*` CSS classes removed from global.css but elements no longer stagger.

### Pitfall 5: H1 on interior pages not updated

**What goes wrong:** Only the homepage Hero H1 gets `font-display`, but other page heroes (om-oss, prosjekter, etc.) retain Inter for H1.
**Why it happens:** Forgetting that each page has its own `_sections/Hero.astro`.
**How to avoid:** Search for all `<h1` tags across `src/pages/` and apply `font-display` consistently.
**Warning signs:** Typography looks inconsistent between homepage and inner pages.

---

## Code Examples

Verified patterns from official sources and codebase analysis:

### Google Fonts combined URL for Inter + Space Grotesk

```html
<!-- Single request for both fonts — replaces existing Inter-only block -->
https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600;700&display=swap
```

### Gradient text (CSS technique, Tailwind classes)

```tsx
// Standard cross-browser gradient text — Tailwind utilities
// bg-clip-text generates: background-clip: text; -webkit-background-clip: text
// text-transparent generates: color: transparent
// bg-gradient-to-r from-brand to-white: background: linear-gradient(to right, #06b6d4, #F8FAFC)

className="bg-gradient-to-r from-brand to-text bg-clip-text text-transparent"
```

### Tailwind config with brand.ts import

```typescript
// tailwind.config.ts — verified pattern consistent with @config directive in global.css
import type { Config } from 'tailwindcss';
import { brand } from './src/config/brand';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: [brand.fonts.display],
        sans: [brand.fonts.body],
      },
      borderRadius: {
        sm: brand.radius.sm,
        md: brand.radius.md,
        lg: brand.radius.lg,
        // full: inherits Tailwind default '9999px' — or set explicitly
      },
      transitionDuration: {
        fast: brand.duration.fast,
        normal: brand.duration.normal,
        slow: brand.duration.slow,
      },
      transitionDelay: {
        1: brand.delay[1],
        2: brand.delay[2],
        3: brand.delay[3],
        4: brand.delay[4],
        5: brand.delay[5],
      },
    },
  },
} satisfies Config;
```

### Easing curve recommendations (Claude's Discretion)

```typescript
easing: {
  default: 'ease-out',                              // standard — most transitions
  snappy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',     // spring-like, slight overshoot — button hovers
  gentle: 'cubic-bezier(0.4, 0, 0.2, 1)',           // Material Design standard ease — scroll reveals
}
```

### CTA button glow shadow (Claude's Discretion)

```css
/* Recommended values for hover:shadow-brand/25 on Button primary variant */
/* Already partially implemented: hover:shadow-lg hover:shadow-brand/25 */
/* Phase 1 adds nothing here — existing hover shadow is sufficient */
/* The "glow on hover" is already present in Button.astro */
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` auto-detected | Must use `@config` directive in CSS, or stays as-is if already linked | Tailwind v4 (2024) | Existing project already has `@config '../../tailwind.config.ts'` in global.css — no change needed |
| `theme.extend.fontFamily` in JS config | `@theme { --font-display: ... }` in CSS | Tailwind v4 (2024) | Both still work if `@config` is present; CONTEXT.md uses JS config approach — fine |
| Separate Google Fonts requests | Combined family in one URL | Not changed — always been supported | Performance: fewer network round-trips |
| Hardcoded magic numbers in components | Token-referenced Tailwind classes | This phase | Maintainability: change once in brand.ts, propagates everywhere |

**Deprecated/outdated:**
- `reveal-delay-1` through `reveal-delay-6` CSS classes in `global.css`: These are replaced by `delay-1` through `delay-5` Tailwind utilities generated from `brand.delay` tokens. Remove from global.css after migration.
- Hardcoded `duration-200`, `duration-300` in components: Replace with `duration-fast`, `duration-normal` tokens.

---

## Open Questions

1. **Exact border radius for cards (brand.radius.lg)**
   - What we know: `Card.astro` currently uses `rounded-xl` = `0.75rem`. The token `radius.lg` is unspecified.
   - What's unclear: Should `radius.lg` match exactly (0.75rem) or introduce a larger radius (e.g., 1rem or 1.5rem)?
   - Recommendation: Set `radius.lg = '0.75rem'` to match existing — preserves visual consistency. If wanting a rounder look, `1rem` is a safe incremental change. Planner should specify this.

2. **Tailwind class naming for delay tokens**
   - What we know: `transitionDelay: { 1: '100ms' }` generates class `delay-1`.
   - What's unclear: Does Tailwind v4 with `@config` correctly generate numeric-keyed custom transition-delay utilities? Not directly tested.
   - Recommendation: Treat as HIGH confidence (follows established Tailwind `theme.extend` pattern), but add a build verification step after implementing.

3. **font-display Tailwind class collision check**
   - What we know: Tailwind v4 may have a built-in `font-display` utility for the CSS `font-display` property.
   - What's unclear: Whether there's an actual naming collision in practice.
   - Recommendation: After implementing, run `npm run build` and inspect generated CSS to confirm `font-display` class applies `font-family: "Space Grotesk"` not `font-display: auto`.

---

## Sources

### Primary (HIGH confidence)
- Official Tailwind v4 docs (https://tailwindcss.com/docs/theme) — @theme directive, theme variable namespaces
- Official Tailwind font-family docs (https://tailwindcss.com/docs/font-family) — custom font via theme extension
- Official Tailwind v4 release blog (https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, @config directive
- Codebase analysis — `global.css` line 2 `@config '../../tailwind.config.ts'` confirms JS config is active and working; `npm run build` passes (1.57s, 7 pages)

### Secondary (MEDIUM confidence)
- GitHub Discussion #16152 (tailwindlabs/tailwindcss) — confirms `theme.extend` still works with `@config` directive in v4
- Fontsource (https://fontsource.org/fonts/space-grotesk) — Space Grotesk variable font, weights 300–700
- Google Fonts CSS2 API docs — combined font URL format with `wght` axis

### Tertiary (LOW confidence)
- WebSearch: `font-display` class collision risk — not verified against Tailwind v4 generated output; flagged as open question

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all tools already in project and confirmed working with build
- Architecture (brand.ts structure): HIGH — TypeScript const object is standard pattern, directly informed by existing codebase conventions (launchOffer.ts pattern)
- Tailwind token integration: HIGH — `@config` directive confirmed working; `theme.extend` pattern verified
- Font loading: HIGH — Google Fonts combined URL is standard; existing preload pattern is established
- Gradient text technique: HIGH — standard CSS, covered by Tailwind's `bg-clip-text` and `text-transparent` utilities
- Pitfalls: MEDIUM — identified from codebase analysis; some (e.g., radius values) require human decision

**Research date:** 2026-03-03
**Valid until:** 2026-04-03 (Tailwind v4 is stable; Astro 5 is stable)
