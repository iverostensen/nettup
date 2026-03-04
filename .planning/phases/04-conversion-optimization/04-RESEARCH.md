# Phase 4: Conversion Optimization - Research

**Researched:** 2026-03-04
**Domain:** CTA wiring, URL param pre-fill, mobile UX audit (Astro + React + Tailwind)
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Each page's CTA copy should emerge from what the visitor just read — not artificially different, but naturally relevant
- Claude should derive the copy from the page's content and intent (e.g., /prosjekter CTA follows a portfolio showcase, /om-oss CTA follows a values/approach section)
- Same structural layout as existing `CTA.astro` is fine — only headline and subtext need to be contextual
- Generic fallback: shared `CTA.astro` remains for pages without a natural context
- Claude's Discretion: navigate to `/kontakt?pakke=X` when user clicks a pricing package button
- The form already reads `?pakke=` URL params and shows a confirmation badge — just needs wiring in Pakker.astro
- Valid pakke values: `enkel`, `standard`, `premium` (already handled in ContactForm.tsx)
- The `kilde` param can also be set for tracking (e.g., `?pakke=standard&kilde=tjenester`)
- Claude's Discretion: one well-placed bottom CTA per page is sufficient
- Adding inline CTAs mid-page would be noisy given the site's content density
- CONV-01 is satisfied by making the existing bottom CTAs contextually relevant — not by adding more CTAs
- Simple review and fix — not a deep overhaul
- The mobile layout is broadly fine; no broken elements
- Audit criteria: 44px tap targets, no horizontal scroll, no layout overflow at 375px, forms usable with thumb
- Fix any issues found; skip if none exist

### Claude's Discretion
- Service pre-fill flow: navigate to `/kontakt?pakke=X` when user clicks a pricing package button
- Inline vs. bottom CTAs: one well-placed bottom CTA per page is sufficient

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONV-01 | Every page has a contextually relevant CTA leading toward contact | Each page audit below maps content to CTA copy; existing `CTA.astro` pattern extended with page-specific variants |
| CONV-02 | CTAs from /tjenester pre-fill the contact form with the relevant service selected | `ContactForm.tsx` already reads `?pakke=` on mount; `Pakker.astro` buttons only need `href="/kontakt?pakke={pakke.id}"` |
| CONV-03 | Mobile UX audited and improved — 375px, 44px tap targets, no overflow | Audit checklist in Common Pitfalls section; Tailwind min-h/min-w patterns for tap targets |
</phase_requirements>

---

## Summary

This phase is primarily a wiring and copy exercise, not a new technology problem. The core infrastructure is already complete: `ContactForm.tsx` reads `?pakke=` URL params on mount and shows a confirmation badge for `enkel`, `standard`, and `premium`; `CTA.astro` exists as a shared component used on every page; `Button.astro` accepts `href` and handles routing. The work is: (1) swap generic CTA copy for page-context-aware copy on `/om-oss` and `/prosjekter`, (2) append `?pakke={id}&kilde=tjenester` to the three "Kom i gang" button hrefs in `Pakker.astro`, (3) manually audit every page at 375px and fix any tap target or overflow issues found.

There are no new dependencies needed. No new React islands needed. No new component patterns needed. The existing Astro section pattern (`src/pages/{page}/_sections/`) is sufficient for page-specific CTA variants; or the shared `CTA.astro` can be extended with props. The shared `CTA.astro` structure (Section > div.reveal-on-scroll > h2, p, Button) is the reference layout to replicate.

The only judgment calls are: (a) which pages need a new page-specific CTA file vs. a props-driven shared CTA, and (b) what copy captures the natural continuation of each page's narrative.

**Primary recommendation:** Create page-specific CTA sections for `/om-oss` and `/prosjekter` following `TjenesterCTA.astro` as the pattern; wire `Pakker.astro` button hrefs with `?pakke=` params; run a manual mobile audit at 375px across all 5 pages.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro (existing) | 5.x | Page sections, CTA components | Already in use; `.astro` for static content |
| Tailwind CSS (existing) | 4.x | Layout, sizing, mobile audit fixes | Already in use; `min-h-11`, `min-w-11` for tap targets |
| React (existing) | 19.x | ContactForm already handles URL param pre-fill | Already a React island, no change needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Framer Motion (existing) | 12.x | Already used in ContactForm badge animation | Not needed for new CTAs — static Astro sections suffice |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Page-specific `.astro` CTA files | Props on shared `CTA.astro` | Props approach is DRY but requires modifying shared component and adding prop types; separate files are simpler and follow existing `TjenesterCTA.astro` precedent |

**Installation:**
No new packages required.

---

## Architecture Patterns

### Existing Component Landscape

The phase touches these existing files:

```
src/
├── components/
│   └── sections/
│       └── CTA.astro                    ← shared generic CTA (stays as fallback)
├── pages/
│   ├── index.astro                      ← imports CTA — homepage already has context from Testimonials
│   ├── _home/
│   │   └── Testimonials.astro           ← last section before CTA on homepage
│   ├── om-oss/
│   │   ├── index.astro                  ← imports CTA — needs page-specific CTA
│   │   └── _sections/
│   │       └── Approach.astro           ← last section before CTA on /om-oss
│   ├── prosjekter/
│   │   ├── index.astro                  ← imports CTA — needs page-specific CTA
│   │   └── _sections/
│   │       └── Results.astro            ← last section before CTA on /prosjekter
│   └── tjenester/
│       ├── index.astro                  ← already uses TjenesterCTA (page-specific)
│       └── _sections/
│           ├── Pakker.astro             ← buttons need ?pakke= param
│           └── TjenesterCTA.astro       ← reference pattern for page-specific CTAs
```

### Pattern 1: Page-Specific CTA Section (TjenesterCTA pattern)

**What:** A minimal `.astro` file in `_sections/` that mirrors `CTA.astro`'s structure but with contextual copy.
**When to use:** When the page's final section gives clear narrative context for a distinct CTA headline.

```astro
---
// Source: src/pages/tjenester/_sections/TjenesterCTA.astro (existing reference)
import Section from '@/components/ui/Section.astro';
import Button from '@/components/ui/Button.astro';
---

<Section background="raised">
  <div class="reveal-on-scroll mx-auto max-w-2xl text-center">
    <h2 class="text-3xl font-bold md:text-4xl">
      [Page-contextual headline]
    </h2>
    <p class="mt-4 text-lg text-text-muted">
      [Page-contextual subtext]
    </p>
    <div class="mt-8">
      <Button href="/kontakt" size="lg">[CTA label]</Button>
    </div>
  </div>
</Section>
```

### Pattern 2: Service Pre-Fill URL Wiring

**What:** Append `?pakke={id}&kilde=tjenester` to "Kom i gang" button hrefs in `Pakker.astro`.
**When to use:** For all three package buttons in the pricing grid.

```astro
<!-- Source: src/pages/tjenester/_sections/Pakker.astro — current state (needs change) -->
<Button href="/kontakt" ...>Kom i gang</Button>

<!-- After change -->
<Button href={`/kontakt?pakke=${pakke.id}&kilde=tjenester`} ...>Kom i gang</Button>
```

The `pakke.id` values in `src/config/pricing.ts` are `'enkel' | 'standard' | 'premium'` — these match exactly what `ContactForm.tsx` validates against in its `useEffect`.

### Pattern 3: Contextual CTA Copy by Page

Based on page content audit:

| Page | Last Content Before CTA | Contextual Headline | Contextual Subtext | CTA Label |
|------|------------------------|--------------------|--------------------|-----------|
| `/` (homepage) | Testimonials — social proof from clients | Generic CTA is appropriate: testimonials already establish trust, "Klar for en nettside som funker?" works | Keep shared `CTA.astro` | "Ta kontakt" |
| `/om-oss` | Approach — "vi bygger nettsider som gir resultater" | "Vil du ha en nettside som gir resultater?" | "Vi bygger det som faktisk hjelper bedriften din — rask, tydelig, mobilvennlig. La oss snakke om hva du trenger." | "Start samtalen" |
| `/prosjekter` | Results — Lighthouse scores, tech stack | "Din bedrift kan bli neste suksesshistorie" | "Vi har levert raske, moderne nettsider for norske bedrifter. La oss gjøre det samme for deg." | "Få ditt tilbud" |
| `/tjenester` | FAQ — already has `TjenesterCTA.astro` | "Usikker på hvilken pakke?" (existing) | Already contextual | Already wired |
| `/kontakt` | No CTA needed — this IS the contact page | N/A | N/A | N/A |

### Anti-Patterns to Avoid
- **Adding inline mid-page CTAs:** The CONTEXT.md explicitly rules this out. One bottom CTA per page is sufficient.
- **Modifying shared `CTA.astro` with boolean flags for per-page behavior:** Creates coupling. Follow the `TjenesterCTA.astro` precedent — separate files for page-specific content.
- **Using template literal hrefs in Astro without backticks:** Astro frontmatter requires template literals inside `{}` expressions for dynamic hrefs.
- **Hardcoding pakke values as strings:** Always derive from `pakke.id` from the `pakker` config array to stay in sync with `ContactForm.tsx`'s validation list.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Package pre-selection | Custom form state management, localStorage | `?pakke=` URL param + existing `ContactForm.tsx` `useEffect` | Already implemented — reads param on mount, validates against known values, shows badge |
| Mobile tap target sizing | Custom click area expansion scripts | Tailwind `min-h-11 min-w-11` (44px = 2.75rem) on interactive elements | Standard CSS approach; no JS needed |
| Scroll position after navigation | Smooth scroll JS, anchor hash logic | Default browser behavior — `/kontakt` is a full page, no in-page scroll needed | Keep it simple |

**Key insight:** The form pre-fill is already 100% implemented. The only missing piece is the href attribute on three buttons in `Pakker.astro`.

---

## Common Pitfalls

### Pitfall 1: Template Literal Syntax in Astro
**What goes wrong:** Writing `href="/kontakt?pakke={pakke.id}"` — curly braces in a string attribute in Astro are NOT interpolation; they render literally.
**Why it happens:** Mixing HTML-style attribute syntax with JSX-style interpolation.
**How to avoid:** Use template literal inside JSX expression: `href={`/kontakt?pakke=${pakke.id}&kilde=tjenester`}`
**Warning signs:** Literal `{pakke.id}` appearing in browser URL bar.

### Pitfall 2: Mobile Tap Target Too Small
**What goes wrong:** A button or link renders at less than 44px height/width, failing the WCAG 2.5.5 guideline and CONV-03.
**Why it happens:** Padding-only sizing that collapses when content is short; nav links and footer links are common culprits.
**How to avoid:** Use `min-h-11` (44px in Tailwind 4) on all interactive elements during the audit. Check `FloatingNav.tsx`, `MobileMenu.tsx`, and footer links.
**Warning signs:** Any `<a>` or `<button>` with only `py-1` or `py-2` and short text.

### Pitfall 3: Horizontal Overflow at 375px
**What goes wrong:** A section has a fixed-width element or a grid that doesn't collapse to single column, causing `overflow-x: scroll` on the page body.
**Why it happens:** `grid-cols-3` without responsive prefix, or `min-w` on cards that exceeds viewport.
**How to avoid:** Test at exactly 375px in DevTools (iPhone SE viewport). Look for any element with a fixed `px` width wider than 375px.
**Warning signs:** Scrollbar appearing at bottom of page in mobile view.

### Pitfall 4: ContactForm Badge Not Appearing
**What goes wrong:** User clicks "Kom i gang" with `?pakke=enkel`, lands on `/kontakt`, but no confirmation badge shows.
**Why it happens:** The `useEffect` in `ContactForm.tsx` runs on mount — if the component is hydrated with `client:load` but the URL param check happens before the component mounts, the param is missed. (In practice, `client:load` triggers on page load, so params are available. But if `client:idle` is used, this could be an issue.)
**How to avoid:** Verify `kontakt/index.astro` uses `<ContactForm client:load />` (it does — confirmed in code audit).
**Warning signs:** Badge missing despite correct URL params; check React DevTools for `formData.pakke` state.

### Pitfall 5: CTA copy too generic despite page context
**What goes wrong:** Writing "Ta kontakt for en prat" on every page even though the user just read something very specific.
**Why it happens:** Defaulting to safe, generic copy.
**How to avoid:** The headline should complete the thought the visitor just had. On `/prosjekter`, they just read about Lighthouse scores and delivery — the CTA should acknowledge that and invite them to get the same. On `/om-oss`, they read about the approach — the CTA should connect that approach to their own project.

---

## Code Examples

Verified patterns from codebase audit:

### Service Pre-Fill Wiring (Pakker.astro)
```astro
<!-- BEFORE (current state in src/pages/tjenester/_sections/Pakker.astro) -->
<Button
  href="/kontakt"
  variant={pakke.popular ? 'primary' : 'secondary'}
  class="w-full"
>
  Kom i gang
</Button>

<!-- AFTER (with pre-fill) -->
<Button
  href={`/kontakt?pakke=${pakke.id}&kilde=tjenester`}
  variant={pakke.popular ? 'primary' : 'secondary'}
  class="w-full"
>
  Kom i gang
</Button>
```

### Page-Specific CTA — /om-oss Pattern
```astro
---
// src/pages/om-oss/_sections/OmOssCTA.astro
import Section from '@/components/ui/Section.astro';
import Button from '@/components/ui/Button.astro';
---

<Section background="raised">
  <div class="reveal-on-scroll mx-auto max-w-2xl text-center">
    <h2 class="text-3xl font-bold md:text-4xl">
      Vil du ha en nettside som gir resultater?
    </h2>
    <p class="mt-4 text-lg text-text-muted">
      Vi bygger det som faktisk hjelper bedriften din — rask, tydelig og mobilvennlig.
      La oss snakke om hva du trenger.
    </p>
    <div class="mt-8">
      <Button href="/kontakt" size="lg">Start samtalen</Button>
    </div>
  </div>
</Section>
```

### Page-Specific CTA — /prosjekter Pattern
```astro
---
// src/pages/prosjekter/_sections/ProsjekterCTA.astro
import Section from '@/components/ui/Section.astro';
import Button from '@/components/ui/Button.astro';
---

<Section background="raised">
  <div class="reveal-on-scroll mx-auto max-w-2xl text-center">
    <h2 class="text-3xl font-bold md:text-4xl">
      Din bedrift kan bli neste suksesshistorie
    </h2>
    <p class="mt-4 text-lg text-text-muted">
      Vi har levert raske, moderne nettsider for norske bedrifter.
      La oss gjøre det samme for deg.
    </p>
    <div class="mt-8">
      <Button href="/kontakt" size="lg">Få ditt tilbud</Button>
    </div>
  </div>
</Section>
```

### Mobile Tap Target — Tailwind Fix Pattern
```html
<!-- Ensure interactive elements meet 44px minimum -->
<!-- min-h-11 = 44px in Tailwind (1rem = 4 = 16px, 11 * 4px = 44px) -->
<a href="..." class="min-h-11 min-w-11 flex items-center ...">Nav link</a>
```

### Mobile Audit Checklist (Manual, DevTools 375px)
```
Pages to audit at 375px viewport:
  / (homepage)
  /om-oss
  /prosjekter
  /tjenester
  /kontakt

For each page, check:
  [ ] No horizontal scrollbar (body overflow-x hidden check)
  [ ] All buttons/links at least 44px tall (inspect computed height)
  [ ] Pricing grid collapses to 1 column (grid-cols-3 → md:grid-cols-3)
  [ ] Contact form fields usable with thumb (padding adequate, no tiny hit areas)
  [ ] FloatingNav items have adequate tap area
  [ ] Footer links have adequate tap area
  [ ] Images don't overflow their containers
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Generic "Ta kontakt" on every page | Contextually relevant CTA copy per page | This phase | Visitors feel CTA is a natural next step, not a bolted-on pitch |
| Pricing buttons link to plain `/kontakt` | Buttons link to `/kontakt?pakke=X&kilde=tjenester` | This phase | Form pre-selects package → lower friction → higher conversion |

---

## Open Questions

1. **Homepage CTA: keep generic or make contextual?**
   - What we know: The homepage already ends with Testimonials, which establish trust. The existing generic "Klar for en nettside som funker?" is reasonable.
   - What's unclear: Whether a more specific homepage CTA (e.g., "Klar til å komme i gang på 2 uker?") would convert better.
   - Recommendation: Keep shared `CTA.astro` for the homepage. The copy is already decent, and making it more specific risks overselling after a trust-signal section. Defer to the planner to decide if they want a distinct homepage CTA.

2. **TjenesterCTA: should it also carry a `?kilde=tjenester` param?**
   - What we know: The "Kom i gang" buttons in `Pakker.astro` will get `?pakke=X&kilde=tjenester`. The `TjenesterCTA.astro` bottom CTA currently links to plain `/kontakt`.
   - What's unclear: Whether the bottom CTA button should also track `kilde=tjenester`.
   - Recommendation: Add `?kilde=tjenester` to `TjenesterCTA.astro`'s button href. Low effort, useful for tracking.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase audit — `src/pages/kontakt/_sections/ContactForm.tsx` lines 63-89: URL param reading confirmed in `useEffect`
- Direct codebase audit — `src/config/pricing.ts`: confirms `pakke.id` values are `'enkel' | 'standard' | 'premium'`
- Direct codebase audit — `src/pages/tjenester/_sections/Pakker.astro`: confirms buttons currently use plain `/kontakt` href
- Direct codebase audit — `src/pages/tjenester/_sections/TjenesterCTA.astro`: confirms pattern for page-specific CTAs
- Direct codebase audit — `src/components/sections/CTA.astro`: confirms shared CTA structure
- Direct codebase audit — `src/pages/*/index.astro`: confirms which pages import `CTA` vs page-specific sections

### Secondary (MEDIUM confidence)
- WCAG 2.5.5 (Target Size) — 44x44px minimum for touch targets; aligns with iOS HIG and Android guidelines
- Tailwind CSS docs — `min-h-11` = 2.75rem = 44px in Tailwind's default 4px base unit scale

### Tertiary (LOW confidence)
- CTA copy recommendations are based on narrative analysis of page content — no A/B test data available for this specific site

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; everything is existing codebase
- Architecture: HIGH — patterns directly observed in existing code (`TjenesterCTA.astro`, `ContactForm.tsx`)
- Pitfalls: HIGH — template literal syntax confirmed from Astro docs behavior; tap target sizing from WCAG

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable — no fast-moving dependencies involved)
