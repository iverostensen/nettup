# Phase 33: Landing Page Content Rebuild - Research

**Researched:** 2026-03-20
**Domain:** Astro landing page content rebuild (static sections, React form islands)
**Confidence:** HIGH

## Summary

This phase is a content-level rebuild of `/nettside-for-bedrift`, converting it from a multi-tier launch offer page to a single-subscription landing page. The work is entirely within established patterns: Astro `.astro` sections, one React island (ContactForm), and the existing `subscriptionOffer.ts` config as single source of truth. No new libraries, no architectural changes, no new patterns needed.

The primary challenge is surgical: 9 existing section files need modification or removal, 1 new section file created ("Trenger du mer?"), and ContactForm.tsx needs conditional field reduction for `context="b2b"`. All old tier/package references (Enkel/Standard/Premium, pricing.ts imports, pakke URL params) must be purged from the landing page path without breaking the `/kontakt` page which still uses the full form.

**Primary recommendation:** Work section-by-section in page order, using `subscriptionOffer.ts` for all pricing/feature data. Modify ContactForm.tsx to conditionally render reduced fields when `context="b2b"`, keeping full form for `context="contact"`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Hero: price anchoring ("Andre tar 15 000+ kr"), remove 4.9 star rating, trust badges "30 dagers garanti" + "Ingen bindingstid", scroll indicator "Se hva som er inkludert", HeroMicroForm stays, LandingHeroAnimation stays
- Social proof: VisualProof replaces Lighthouse scores with visual website previews, LogoCloud removed entirely, Testimonial kept as dedicated section, scarcity text-only near CTA form
- FAQ: 5-6 questions rewritten for subscription model, specific priority order defined, ownership answer with benefits-first framing, guarantee reframed as risk-free trial, remove all tier references, keep FAQPage JSON-LD
- Page section order: Hero > Visual Preview > Offer Card > WhyUs > Testimonial > FAQ > "Trenger du mer?" > Form Section
- Form: offer-reinforcing static heading, 3 fields only (name, email, phone), remove pakkeNames and dynamic heading script, scarcity text near form
- "Trenger du mer?" upsell section with 2-3 links to /tjenester subpages from subscriptionOffer.upsellLinks
- Meta tags from subscriptionOffer.meta

### Claude's Discretion
- WhyUs card content: keep applicable cards, rewrite/replace for subscription benefits
- Visual Preview section: which website examples/screenshots and presentation
- Exact Norwegian copy for all sections
- "Sann jobber vi" process overview: keep, update, or remove
- Guarantee banner in PricingSummary: update wording or simplify to FAQ-only
- Whether to keep guarantee banner or simplify to FAQ-only mention

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LP-01 | Single subscription offer as hero: 0 kr oppstart + 399 kr/mnd, anchored against one-time cost | Hero.astro rewrite with price anchoring from subscriptionOffer.ts; remove old tier pricing |
| LP-03 | Reduced form: name, email, phone only | ContactForm.tsx conditional rendering for context="b2b"; remove pakke/tjeneste/melding fields |
| LP-04 | Remove fake social proof: scarcity counter, 4.9-star rating | Hero.astro: remove star rating block; FormSection.astro: add text-only scarcity |
| LP-05 | FAQ rewritten for subscription model | FAQ.astro: new faqs array with subscription-focused Q&A, keep JSON-LD pattern |
| LP-06 | Meta title/description updated | index.astro: use subscriptionOffer.meta values in LandingPageLayout props |
| LP-07 | WhyUs updated for subscription value props | WhyUs.astro: rewrite reasons array for subscription benefits |
| LP-08 | PricingSummary replaced + "Trenger du mer?" upsell | PricingSummary.astro: rebuild as single offer card; new UpsellSection.astro using subscriptionOffer.upsellLinks |
</phase_requirements>

## Standard Stack

No new dependencies. This phase uses the existing stack exclusively.

### Core (already installed)
| Library | Purpose | Relevance |
|---------|---------|-----------|
| Astro 5 | Static sections in `.astro` files | All section files are Astro components |
| React | ContactForm and HeroMicroForm islands | Form field modification |
| Tailwind 4 | Styling | All sections use Tailwind classes |
| Framer Motion | ContactForm animations | Already used, no changes needed |

### Config Files (single source of truth)
| File | Purpose | Usage in Phase 33 |
|------|---------|-------------------|
| `src/config/subscriptionOffer.ts` | Price, features, terms, upsell links, meta | Import in Hero, PricingSummary, FAQ, index.astro |
| `src/config/pricing.ts` | Old tier pricing (Enkel/Standard/Premium) | Remove import from ContactForm for b2b context |

## Architecture Patterns

### Current Project Structure (unchanged)
```
src/pages/nettside-for-bedrift/
├── index.astro                    # Section imports and ordering
├── _sections/
│   ├── Hero.astro                 # MODIFY: price anchoring, remove stars
│   ├── VisualProof.astro          # MODIFY: website previews instead of Lighthouse
│   ├── LogoCloud.astro            # REMOVE from imports (file can stay)
│   ├── Testimonial.astro          # KEEP as-is (maybe add micro-testimonial variant)
│   ├── WhyUs.astro                # MODIFY: subscription value props
│   ├── PricingSummary.astro       # REBUILD: single offer card + guarantee
│   ├── FAQ.astro                  # REWRITE: subscription Q&A
│   ├── FormSection.astro          # SIMPLIFY: static heading, remove pakke script
│   └── Results.astro              # UNUSED (already replaced by VisualProof)
├── takk/
│   └── index.astro                # KEEP (Phase 32, no changes)
```

### New file needed
```
src/pages/nettside-for-bedrift/_sections/UpsellSection.astro  # "Trenger du mer?" links
```

### Pattern: Section Data from Config
All pricing/feature data must come from `subscriptionOffer.ts`, not hardcoded. This is already the established pattern from Phase 32.

```astro
---
import { subscriptionOffer } from '@/config/subscriptionOffer';
---
<span>{subscriptionOffer.price.monthlyPrice} kr/mnd</span>
```

### Pattern: Conditional Form Fields (ContactForm.tsx)
ContactForm already has `context` prop. For `context="b2b"`:
- Show only: navn, epost, telefon
- Hide: pakke (hidden input), tjeneste (hidden input), melding (textarea)
- Remove PAKKE_INFO badge rendering
- Remove pricing.ts import (only needed for PAKKE_INFO)
- Keep: honeypot, UTM params, Formspree submission, redirect to /takk

```tsx
// Conditional rendering approach
{context !== 'b2b' && (
  <div>
    <label>Melding</label>
    <textarea ... />
  </div>
)}
```

### Pattern: Scroll Animations
All sections use `reveal-on-scroll` and `delay-N` CSS classes. Keep this pattern for new/modified sections.

### Anti-Patterns to Avoid
- **Hardcoding prices:** Always import from `subscriptionOffer.ts`
- **Breaking /kontakt form:** ContactForm.tsx changes must be conditional on `context="b2b"` -- the `/kontakt` page uses `context="contact"` and needs all fields
- **Leaving stale references:** Search for "2 500", "7 000", "Enkel", "Standard", "Premium", "lanseringstilbud", "pakke" across all landing page files

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pricing data | Hardcoded values in sections | `subscriptionOffer.ts` imports | Single source of truth, consistency |
| Form spam protection | Custom solution | Existing honeypot `_gotcha` field | Already working |
| FAQ schema | Manual JSON-LD | Existing co-located pattern in FAQ.astro | Keep `faqSchema` generation pattern |
| Scroll animations | New animation system | `reveal-on-scroll` + `delay-N` classes | Established, tested, respects `prefers-reduced-motion` |

## Common Pitfalls

### Pitfall 1: Breaking the /kontakt form
**What goes wrong:** Removing fields from ContactForm.tsx breaks the full contact form at `/kontakt`
**Why it happens:** ContactForm is shared between landing page and contact page
**How to avoid:** All field removal must be conditional on `context="b2b"`. Test both `/kontakt` and `/nettside-for-bedrift` after changes.
**Warning signs:** Missing fields on `/kontakt` page

### Pitfall 2: Stale pricing references in text
**What goes wrong:** Old prices ("2 500 kr", "7 000 kr") or tier names ("Enkel-pakken") remain in copy
**How to avoid:** After all section changes, grep the entire `nettside-for-bedrift/` directory for: "2.500", "7.000", "4.500", "15.000", "10.000", "25.000", "Enkel", "Standard", "Premium", "lanseringstilbud", "50% ved"
**Warning signs:** Inconsistent pricing between sections

### Pitfall 3: Missing section in index.astro
**What goes wrong:** New section order doesn't match CONTEXT.md decisions
**Why it happens:** Forgetting to update imports and ordering in index.astro
**How to avoid:** index.astro must be updated to match decided order: Hero > VisualPreview > PricingSummary (offer card) > WhyUs > Testimonial > FAQ > UpsellSection > FormSection. LogoCloud import removed.

### Pitfall 4: HeroMicroForm still sends pakke param
**What goes wrong:** HeroMicroForm reads `pakke` from URL params and sends it to Formspree
**Why it happens:** The code at line 47-48 of HeroMicroForm.tsx reads pakke param
**How to avoid:** The pakke param in HeroMicroForm is harmless (sends "Ikke valgt" when no param) -- leave it. But update the button text from "Fa gratis tilbud" to something subscription-aligned.

### Pitfall 5: pricing.ts import in ContactForm
**What goes wrong:** Build may fail if pricing.ts is eventually removed
**Why it happens:** ContactForm imports `pakker` from pricing.ts for PAKKE_INFO badge
**How to avoid:** For b2b context, don't render PAKKE_INFO badge. But keep the import for now since `/kontakt` page still uses it. Add a comment noting this dependency.

### Pitfall 6: JSON-LD schema mismatch
**What goes wrong:** FAQ questions change but JSON-LD schema still references old content
**Why it happens:** Schema is auto-generated from `faqs` array, but someone might add schema separately
**How to avoid:** Keep the existing pattern where `faqSchema` is generated from the `faqs` array. No separate schema definition needed.

## Code Examples

### index.astro - Updated section order and meta
```astro
---
import LandingPageLayout from '@/layouts/LandingPageLayout.astro';
import { subscriptionOffer } from '@/config/subscriptionOffer';
import Hero from './_sections/Hero.astro';
import VisualPreview from './_sections/VisualProof.astro';
import PricingSummary from './_sections/PricingSummary.astro';
import WhyUs from './_sections/WhyUs.astro';
import Testimonial from './_sections/Testimonial.astro';
import FAQ from './_sections/FAQ.astro';
import UpsellSection from './_sections/UpsellSection.astro';
import FormSection from './_sections/FormSection.astro';
---

<LandingPageLayout
  title={subscriptionOffer.meta.title}
  description={subscriptionOffer.meta.description}
>
  <main>
    <Hero />
    <VisualPreview />
    <PricingSummary />
    <WhyUs />
    <Testimonial />
    <FAQ />
    <UpsellSection />
    <FormSection />
  </main>
</LandingPageLayout>
```

### UpsellSection.astro - New "Trenger du mer?" section
```astro
---
import { subscriptionOffer } from '@/config/subscriptionOffer';
---

<section class="py-12 md:py-16 bg-surface">
  <div class="container mx-auto px-4">
    <div class="reveal-on-scroll mx-auto max-w-2xl text-center">
      <h2 class="text-2xl font-bold md:text-3xl">Trenger du mer enn 5 sider?</h2>
      <p class="mt-4 text-text-muted">
        Se vare skreddersydde losninger for storre prosjekter.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-4">
        {subscriptionOffer.upsellLinks.map((link) => (
          <a
            href={link.href}
            class="rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-text transition-colors hover:border-brand/30 hover:text-brand"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </div>
</section>
```

### ContactForm.tsx - Conditional b2b field reduction
```tsx
// Key changes for context="b2b":
// 1. Don't render pakke selector, tjeneste, or melding fields
// 2. Don't render PAKKE_INFO badge
// 3. Keep hidden inputs for backward compatibility with Formspree

{context !== 'b2b' && (
  <>
    <input type="hidden" name="pakke" value={formData.pakke} />
    <input type="hidden" name="tjeneste" value={formData.tjeneste} />
    <div>
      <label htmlFor="melding" className={labelClasses}>
        Melding <span className="text-text-muted/50">(valgfritt)</span>
      </label>
      <textarea ... />
    </div>
  </>
)}
```

## Inventory of Changes

### Files to MODIFY
| File | What Changes | Risk |
|------|-------------|------|
| `index.astro` | Remove LogoCloud import, add UpsellSection import, reorder sections, use subscriptionOffer.meta for title/desc | LOW |
| `Hero.astro` | Remove star rating, add price anchoring, update trust badges ("Ingen bindingstid" replaces "24t responstid"), add micro-testimonial below form, update scroll indicator text | MEDIUM |
| `VisualProof.astro` | Replace Lighthouse score metrics with visual website previews/screenshots | MEDIUM |
| `WhyUs.astro` | Rewrite reasons array for subscription value props, update/remove process overview | MEDIUM |
| `PricingSummary.astro` | Already interim single-card from Phase 32; update guarantee banner wording for subscription | LOW |
| `FAQ.astro` | Complete rewrite of faqs array (5-6 subscription questions), JSON-LD auto-regenerates | LOW |
| `FormSection.astro` | Static heading, remove pakkeNames/script, add scarcity text | LOW |
| `ContactForm.tsx` | Conditional field rendering for b2b context (hide melding, pakke badge) | MEDIUM |
| `HeroMicroForm.tsx` | Update button text for subscription context | LOW |

### Files to CREATE
| File | Purpose |
|------|---------|
| `UpsellSection.astro` | "Trenger du mer?" section with upsell links |

### Files to REMOVE from imports (not delete)
| File | Reason |
|------|--------|
| `LogoCloud.astro` | Too few logos (2), remove from index.astro imports |

## Open Questions

1. **Micro-testimonial in hero**
   - What we know: CONTEXT.md says "short snippet, not the full quote" from iGive below the form
   - What's unclear: The current testimonial in Testimonial.astro may be a placeholder (STATE.md notes "iGive testimonial quote is placeholder")
   - Recommendation: Use the existing quote text, shortened. Flag that real quote still needs client outreach.

2. **VisualProof website previews**
   - What we know: Replace Lighthouse scores with "visual website previews/screenshots" -- more relatable for non-technical SMB
   - What's unclear: Which website screenshots to use. Currently only have `igive-hero.png`.
   - Recommendation: Keep iGive screenshot as primary, present it as a "website preview" without the metrics overlay. Can add Blom Company if screenshot exists.

3. **Guarantee banner placement**
   - What we know: PricingSummary currently has a large "Fornoyd-eller-pengene-tilbake-garanti" banner
   - What's unclear: Whether to keep it (with subscription wording) or simplify to FAQ-only
   - Recommendation: Keep a slimmer version in PricingSummary ("Ikke fornoyd etter forste maned? Du betaler ingenting.") and reinforce in FAQ. Two touchpoints > one.

## Sources

### Primary (HIGH confidence)
- Direct code analysis of all 9 section files in `src/pages/nettside-for-bedrift/_sections/`
- `src/config/subscriptionOffer.ts` -- verified shape and values
- `src/config/pricing.ts` -- verified old tier data still present
- `src/components/islands/ContactForm.tsx` -- verified context prop and field structure
- `src/components/islands/HeroMicroForm.tsx` -- verified pakke param handling

### Secondary (HIGH confidence)
- `.planning/phases/33-landing-page-content-rebuild/33-CONTEXT.md` -- all user decisions
- `.planning/REQUIREMENTS.md` -- LP-01 through LP-08 requirements
- `.planning/STATE.md` -- Phase 32 decisions about interim PricingSummary

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, all existing code
- Architecture: HIGH - follows established section-based Astro patterns
- Pitfalls: HIGH - identified from direct code analysis of shared components
- Content decisions: HIGH - all locked in CONTEXT.md

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable, no external dependencies)
