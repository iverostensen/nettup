# Phase 33: Landing Page Content Rebuild - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Rebuild all content on `/nettside-for-bedrift` so a Google Ads visitor sees one subscription offer (0 kr oppstart + 399 kr/mnd), one decision (yes/no), and a frictionless 3-field form. Remove fake social proof, rewrite FAQ for subscription model, update WhyUs for subscription value props, and add "Trenger du mer?" upsell section. No tracking changes (Phase 31-32), no ad campaign work (Phase 34).

</domain>

<decisions>
## Implementation Decisions

### Hero messaging
- Price anchoring: show what a comparable one-time website costs ("Andre tar 15 000+ kr") then present the subscription as the alternative
- Remove 4.9/5 star rating (LP-04) -- replace with micro-testimonial from iGive below the form (short snippet, not the full quote)
- Trust badges: "30 dagers garanti" + "Ingen bindingstid" (two badges, replacing "24t responstid" with "Ingen bindingstid")
- Scroll indicator text: "Se hva som er inkludert" (replaces "Se vare pakker")
- HeroMicroForm stays as primary above-fold CTA
- LandingHeroAnimation stays

### Social proof strategy
- VisualProof section: replace Lighthouse scores with visual website previews/screenshots (more relatable for non-technical SMB owners)
- LogoCloud section: remove entirely (two logos feels sparse -- wait until 4-5 clients)
- Testimonial section: keep full iGive testimonial as dedicated section (separate from the hero micro-testimonial)
- Scarcity: remove counter/badge. Add text-only mention near CTA form: "Vi tar inn et begrenset antall kunder om gangen" -- honest capacity statement, not fake urgency

### FAQ rewrite
- 5-6 focused questions (down from 7), all rewritten for subscription model
- Question priority order: (1) "Hva far jeg for 399 kr/mnd?" -- what's included first, (2) ownership/cancellation, (3) guarantee, (4) timeline, (5-6) other subscription-specific objections
- Ownership answer: transparent with positive framing -- lead with benefits ("Du slipper a tenke pa hosting, oppdateringer og sikkerhet. Vi tar oss av alt sa lenge du er kunde.") then mention cancellation honestly
- Guarantee: "Ikke fornoyd etter forste maned? Du betaler ingenting." -- first month free if unhappy (0 kr setup means risk is just 399 kr)
- Remove all references to old tiers (Enkel/Standard/Premium), one-time pricing, and "50% ved oppstart"
- Keep FAQPage JSON-LD schema

### Page section order (offer-first flow)
1. Hero (anchor price + micro-form + micro-testimonial)
2. Visual Preview (website examples -- replaces VisualProof)
3. Offer Card (399 kr/mnd details + features -- rebuilt PricingSummary)
4. WhyUs (subscription value props)
5. Testimonial (iGive full quote)
6. FAQ (subscription objections)
7. "Trenger du mer?" (upsell links to /tjenester)
8. Form Section (full 3-field form + scarcity text)

### Form section
- Heading: offer-reinforcing, static -- "Fa din nettside - 0 kr oppstart" or similar (no dynamic pakke-based heading)
- Fields: name, email, phone only (LP-03) -- remove pakke selector, tjeneste, melding
- Remove all pakke references from FormSection.astro (dynamic heading script, pakkeNames)
- Scarcity text near form: "Vi tar inn et begrenset antall kunder om gangen"

### "Trenger du mer?" upsell section (LP-08)
- Subtle section with 2-3 links to /tjenester subpages
- Framing: "Trenger du mer enn 5 sider? Se vare skreddersydde losninger."
- Links from subscriptionOffer.upsellLinks (Skreddersydd nettside, Nettbutikk, Landingsside)
- Secondary to the main offer -- should not distract from subscription CTA

### Meta tags (LP-06)
- Title: "Nettside for Bedrift | 0 kr Oppstart, 399 kr/mnd | Nettup" (from subscriptionOffer.meta)
- Description: from subscriptionOffer.meta.description

### Claude's Discretion
- WhyUs card content: keep cards that still apply (Raske leveranser, Moderne teknologi, Norsk support), rewrite/replace the rest for subscription benefits (Du eier alt -> something else, Fra 2 500 kr -> subscription pricing)
- Visual Preview section: which website examples/screenshots to show and how to present them
- Exact Norwegian copy for all sections (within the constraints above)
- "Sasnn jobber vi" process overview in WhyUs: keep, update, or remove
- Guarantee banner in PricingSummary: update wording for subscription model
- Whether to keep the "Fornøyd-eller-pengene-tilbake-garanti" banner or simplify to FAQ-only mention

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` -- LP-01 through LP-08 requirements for this phase

### Config (single source of truth)
- `src/config/subscriptionOffer.ts` -- The one subscription offer: price, features, terms, upsellLinks, meta. All content must align with this.

### Landing page (files being modified)
- `src/pages/nettside-for-bedrift/index.astro` -- Page structure (section imports and order)
- `src/pages/nettside-for-bedrift/_sections/Hero.astro` -- Hero with old pricing, star rating, trust badges
- `src/pages/nettside-for-bedrift/_sections/VisualProof.astro` -- Lighthouse scores (being replaced with visual previews)
- `src/pages/nettside-for-bedrift/_sections/LogoCloud.astro` -- Being removed
- `src/pages/nettside-for-bedrift/_sections/Testimonial.astro` -- iGive testimonial (keeping)
- `src/pages/nettside-for-bedrift/_sections/WhyUs.astro` -- Value props (being rewritten)
- `src/pages/nettside-for-bedrift/_sections/PricingSummary.astro` -- Interim card (being rebuilt)
- `src/pages/nettside-for-bedrift/_sections/FAQ.astro` -- Old tier-based FAQ (being rewritten)
- `src/pages/nettside-for-bedrift/_sections/FormSection.astro` -- Form wrapper with pakke references (being simplified)

### Forms
- `src/components/islands/HeroMicroForm.tsx` -- Hero micro-form (stays, but context may need update)
- `src/pages/kontakt/_sections/ContactForm.tsx` -- Full form with context="b2b" (fields being reduced for b2b context)

### Prior phase context
- `.planning/phases/32-config-conversion-flow/32-CONTEXT.md` -- subscriptionOffer.ts shape, conversion flow decisions, pricing.ts kept for ContactForm until this phase

### Layout
- `src/layouts/LandingPageLayout.astro` -- Landing page layout with gtag + consent (unchanged)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `subscriptionOffer.ts`: Single source of truth for all pricing, features, terms. Import this everywhere instead of hardcoding values.
- `Testimonial.astro`: Existing iGive testimonial section -- keep and reuse.
- `LandingHeroAnimation`: React island for code-to-website animation -- stays in hero.
- `HeroMicroForm`: React island for email micro-form -- stays as primary hero CTA.
- `reveal-on-scroll` CSS class: Established scroll animation pattern across all sections.
- `Section`, `SectionHeader` UI components in `src/components/ui/` -- available but landing page uses custom markup.

### Established Patterns
- Astro sections in `_sections/` directory with individual `.astro` files
- `reveal-on-scroll` + `delay-N` classes for staggered scroll animations
- JSON-LD schema co-located in FAQ.astro (keep this pattern)
- Config files in `src/config/` as single source of truth
- SVG icons inline in Astro templates (not an icon library)

### Integration Points
- `index.astro` imports and orders all sections -- update import list and order
- `ContactForm.tsx` with `context="b2b"` -- needs field reduction for b2b context (name, email, phone only)
- `pricing.ts` imported by ContactForm for pakke dropdown -- can be removed once form is simplified
- `FormSection.astro` has `pakkeNames` and dynamic heading script -- remove entirely
- `subscriptionOffer.upsellLinks` array -- use for "Trenger du mer?" section links

</code_context>

<specifics>
## Specific Ideas

- Price anchoring in hero: "Andre tar 15 000+ kr. Hos oss: 0 kr oppstart, kun 399 kr/mnd."
- Micro-testimonial in hero below form: short iGive snippet, separate from full testimonial section
- Ownership FAQ: lead with benefits ("Du slipper a tenke pa..."), then honest cancellation mention
- Guarantee: "Ikke fornoyd etter forste maned? Du betaler ingenting." -- reframe from refund to risk-free trial
- Scarcity near form: "Vi tar inn et begrenset antall kunder om gangen" -- honest, not countdown-based
- Form heading: "Fa din nettside - 0 kr oppstart" -- reinforces offer at conversion point

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 33-landing-page-content-rebuild*
*Context gathered: 2026-03-20*
