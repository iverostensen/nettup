# Phase 1: Brand Identity - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Define Nettup's brand personality and implement it through a code-level design token system and distinctive heading typography. The goal is a documented brand + a `config/brand.ts` that drives Tailwind config — not a site redesign. Animation presets and visual showcasing belong to Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Heading typography
- **Font:** Space Grotesk replaces Inter for H1 and H2 only
- **H3 and body text** stay Inter
- **H1 weight:** 700 (bold), **H2 weight:** 600 (semibold) — weight creates hierarchy
- **Letter spacing:** default (0) — Space Grotesk is designed to work at default tracking

### Brand personality
- **Primary audience:** Small local businesses (cafés, tradespeople, clinics) now — but brand should not feel cheap or local-only; it should hold up when pitching growth-stage SMBs later
- **Tone of voice:** Direct but warm — punchy headlines, friendly and plain-language explanations
- **Core values:** Speed, honesty, modern, revolutionizing the web agency landscape
- **Positioning strategy:** Bold mission statement ("vi revolusjonerer webbyråbransjen" or similar) lives on `/om-oss`. Homepage copy stays focused on concrete client benefit — show the mission, don't just claim it.

### Token system
- **Location:** `src/config/brand.ts` — imported into `tailwind.config.ts`. No CSS variables needed.
- **Typography tokens:** font families (Space Grotesk, Inter), heading weights (700/600)
- **Border radius tokens:** Unified scale — `radius.sm / md / lg / full`. Replaces current inconsistency (buttons `rounded-full`, cards `rounded-xl` — these get mapped to the scale)
- **Animation tokens:** `duration.fast / normal / slow`, `easing.default / snappy / gentle`, `delay.1–5` — replaces hardcoded `0.5s`, `0.3s`, `200ms` and the `reveal-delay-*` CSS classes

### Visual signature
- **Style reference:** Framer / Resend — dark base, brand color moments, subtle gradients, premium details. Not ultra-minimal (Vercel), not heavy (generic SaaS).
- **Typography does the heavy lifting** — Space Grotesk + intentional sizing
- **Gradient moments (sparingly):** Only on the rotating hero word (gradient text: cyan to white or similar) and primary CTA button glow on hover. Not scattered across sections.
- **Everything else stays clean** — the grain texture and dark bg remain, no new decorative elements added in this phase

### Claude's Discretion
- Exact gradient values (start/end colors for the rotating word gradient)
- Specific easing curve values (e.g. exact cubic-bezier for `easing.snappy`)
- Shadow definition for CTA glow (intensity, spread, color opacity)
- Whether brand.ts exports a typed object or individual named exports

</decisions>

<specifics>
## Specific Ideas

- "Revolutionizing the web agency landscape" — the big idea. Show it through craft, don't just say it everywhere.
- Visual reference: Framer.com and Resend.com — note the dark base with moments of color, clean typography, premium feel without being cold
- The rotating word in the hero is the brand moment — that's where the gradient lives

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `tailwind.config.ts`: Already has `brand`, `surface`, `text` color tokens — migrate these into `brand.ts` rather than rewriting
- `src/components/ui/Button.astro`: Uses `rounded-full` and `transition-all duration-200` hardcoded — update to use radius and duration tokens
- `src/components/ui/SectionHeader.astro`: Uses `text-3xl font-bold md:text-4xl` hardcoded — update to use typography tokens
- `src/components/ui/Card.astro`: Likely uses `rounded-xl` — map to radius token
- `global.css`: Has `reveal-delay-1` through `reveal-delay-6` CSS classes and hardcoded animation values — replace with delay tokens from brand.ts

### Established Patterns
- Tailwind config already extended via `theme.extend` — brand.ts tokens slot in as additional extensions
- Fonts loaded via Google Fonts in `BaseLayout.astro` — add Space Grotesk to existing font preload/load pattern
- Animation level system (0=CSS, 1=IntersectionObserver, 2=Framer Motion) should be respected — tokens live at level 0

### Integration Points
- `tailwind.config.ts` imports brand.ts and spreads tokens into `theme.extend`
- `BaseLayout.astro` font preload updated to include Space Grotesk
- All UI components (`Button`, `Card`, `SectionHeader`) updated to consume radius/duration tokens
- `global.css` animation delays updated to reference delay tokens (or removed if Tailwind covers them)
- Brand document written as `.planning/BRAND.md` — referenced during Phase 3 copy work

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-brand-identity*
*Context gathered: 2026-03-03*
