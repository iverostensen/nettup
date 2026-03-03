# Domain Pitfalls

**Domain:** Web agency marketing site upgrade (brand, animation, SEO, UX/conversion)
**Project:** Nettup.no
**Researched:** 2026-03-03
**Overall confidence:** HIGH (based on codebase analysis, established web performance principles, and domain expertise in agency marketing sites)

## Critical Pitfalls

Mistakes that cause rewrites, performance regressions, or actively harm the business goal (converting visitors into contact form submissions).

---

### Pitfall 1: Animation Over-Engineering Kills Performance

**What goes wrong:** The site already ships ~58 KB gzipped React client plus Framer Motion. Adding more animated React islands pushes JavaScript payload higher, increasing Time to Interactive and potentially exceeding the LCP < 2s constraint. Animated blur gradients (`GradientBackground.tsx` with 600px blur-[120px] elements) are GPU-heavy. More of these across pages will cause frame drops on mid-range phones.

**Why it happens:** Agency sites treat themselves as a tech demo. "We should show what we can build" becomes license to add animations everywhere. Every section gets a reveal, every heading gets a stagger, every background gets a floating orb.

**Consequences:**
- LCP regression above 2s (violates project constraint)
- CLS from late-loading animated elements
- Battery drain on mobile, fans spin on older laptops
- Potential visitors bounce before the contact form even loads
- Ironic: a web agency's own site being slow undermines its entire sales pitch

**Prevention:**
- Set a hard JavaScript budget: current ~65 KB total client JS is healthy; cap at 80 KB gzipped
- Animation audit rule: every new Framer Motion component must justify why CSS animation cannot achieve the same effect
- Limit `client:load` usage; prefer `client:visible` or `client:media` for non-critical animations (already done well with DeviceMockup using `client:media`)
- Test on a throttled 4G connection with CPU 4x slowdown in Chrome DevTools before merging any animation work
- The hero video (neural-network-dark-blue.mp4) with `preload="none"` is correctly implemented; don't regress by adding `preload="auto"` or loading more video assets

**Detection:**
- Lighthouse Performance score drops below 90
- LCP exceeds 2s on mobile emulation
- More than 3 React islands load per page
- Any `client:load` on decorative (non-interactive) components

**Phase relevance:** Animation polish phase. Set the budget BEFORE starting work, not after.

---

### Pitfall 2: Brand Identity Without Decision Framework

**What goes wrong:** The PROJECT.md explicitly states "Merkevaren er udefinert." Starting visual implementation (colors, typography, animation personality) before defining brand values and personality leads to inconsistent design decisions. Different sections feel like different websites. Colors get tweaked per-page. Copy tone varies between sections.

**Why it happens:** It's more fun to design than to write brand strategy documents. Developers skip the "boring" brand definition and jump straight into Tailwind config changes and component styling.

**Consequences:**
- Multiple rounds of visual rework as brand direction shifts mid-implementation
- Tailwind config becomes a graveyard of commented-out color experiments
- Different pages have subtly different visual treatments that erode trust
- The site ends up looking like a template because there's no coherent personality driving decisions

**Prevention:**
- Define brand personality in a single document BEFORE any visual changes: 3-5 brand attributes (e.g., "modern but approachable," "technical but not cold")
- Lock the color palette decision: the current cyan-on-slate is functional but generic. Decide if it stays or changes, and commit
- Define a "brand voice" for Norwegian copy: formal/informal balance, use of "du" vs "dere," humor tolerance
- Create a simple brand checklist that every component change gets reviewed against

**Detection:**
- Color values appear in component files instead of Tailwind config
- Copy tone shifts between pages (formal on one, casual on another)
- Design decisions justified by "it looks cool" rather than "it reinforces [brand attribute]"

**Phase relevance:** Brand definition must be its own phase, completed BEFORE any visual implementation phases. This is the single most important ordering decision for the roadmap.

---

### Pitfall 3: SEO Over-Optimization for Wrong Keywords

**What goes wrong:** Norwegian small business market is a narrow search landscape. Optimizing for broad keywords like "webdesign" or "nettside" means competing against Squarespace, Wix, and established Norwegian agencies with huge domain authority. Effort goes into meta tags and heading optimization for keywords that will never rank.

**Why it happens:** SEO guides are written for English-language markets. They recommend keyword research and on-page optimization as if Norwegian search volumes are comparable. In reality, "webdesign oslo" might get 500 searches/month, but the top 10 results are dominated by established players.

**Consequences:**
- Hours spent optimizing meta descriptions and H1 tags for competitive keywords with zero ranking improvement
- Neglecting the actual traffic source: the landing page (`/nettside-for-bedrift/`) which is designed for Google Ads, not organic
- Missing local SEO opportunities that are less competitive but highly targeted

**Prevention:**
- Focus on long-tail Norwegian keywords: "rimelig nettside for haandverker," "nettside liten bedrift pris" -- queries with purchase intent
- The existing LocalBusiness JSON-LD schema is good; ensure Google Business Profile is claimed and consistent (address, phone, hours must match schema exactly)
- Don't waste time on meta keyword tags (Google ignores them)
- Focus SEO effort on: page speed (already good), mobile UX (already good), and schema markup (partially done) rather than keyword density
- Norwegian-specific: ensure all meta content uses correct Norwegian (bokmal) with proper characters; no English leaking into meta descriptions

**Detection:**
- Time spent on SEO exceeds time spent improving the actual conversion flow
- Targeting keywords where the top 3 results are Wix, Squarespace, or 20+ year old agencies
- No Google Business Profile claimed
- Schema markup inconsistencies between pages

**Phase relevance:** SEO phase. Keep scope tight: schema validation, Google Business Profile, page-level meta. Don't build a keyword strategy empire.

---

### Pitfall 4: Conversion Flow Friction from "Premium" Redesign

**What goes wrong:** In pursuit of a more polished look, the contact form gets redesigned with more fields, multi-step flows, or gated behind an extra CTA click. The current form is lean (name, email, optional phone/message) and converts. Adding friction in the name of "looking professional" reduces submissions.

**Why it happens:** The upgrade project treats every page as needing improvement. The contact form "looks too simple" compared to the polished hero animation. Someone decides it needs a step indicator, company name field, budget dropdown, or project type selector.

**Consequences:**
- Contact form submissions drop
- The entire revenue funnel breaks for aesthetic reasons
- Hard to detect because traffic might be growing while conversion rate silently drops

**Prevention:**
- Measure the current conversion rate BEFORE any changes (Formspree + Vercel Analytics can provide this)
- The current form fields (name, email, optional phone, optional message with package pre-selection via URL params) are well-optimized; do not add required fields
- Any form change must be justified by conversion data, not visual preference
- Keep the `?pakke=standard&kilde=tjenester` URL parameter flow intact; it's a smart zero-friction pre-selection pattern
- If adding visual polish to the form, ensure the submit button remains prominently visible without scrolling on mobile

**Detection:**
- Form submission rate drops after redesign
- New required fields added without conversion justification
- Form moves below the fold on mobile
- Multi-step form introduced without A/B testing

**Phase relevance:** UX/conversion phase. Measure first, then touch the form with extreme caution.

---

### Pitfall 5: Losing the Launch Offer Infrastructure During Refactor

**What goes wrong:** The site has a non-trivial launch offer system: `LaunchOfferBanner`, `ScarcityCounter`, `PriceDisplay`, pricing config, URL parameter tracking (`?kilde=`), Google Ads conversion tracking. During brand/visual refactoring, these interconnected pieces get broken or removed "temporarily" and never restored correctly.

**Why it happens:** The launch offer touches many files: `BaseLayout.astro` (banner), `Pakker.astro` (pricing), `ContactForm.tsx` (package badge, conversion tracking), `LandingPageLayout.astro`, and config files. Refactoring any of these risks breaking the chain.

**Consequences:**
- Google Ads conversion tracking stops firing (wasted ad spend)
- Package pre-selection from URL params breaks (lower conversion from ads)
- Pricing display inconsistencies between pages
- Scarcity counter shows wrong numbers

**Prevention:**
- Map all launch offer touchpoints before any refactoring begins
- If launch offer will eventually be removed, plan that as its own explicit task, not a side effect of visual refactoring
- Test the full flow after every change: Ad click -> landing page -> form pre-filled -> submit -> gtag conversion fires
- Keep the `launchOffer` and `pricing` config files as single sources of truth; never hardcode prices in templates

**Detection:**
- Google Ads conversion tracking stops reporting
- Package badge in contact form stops appearing
- Prices on `/tjenester` don't match `/nettside-for-bedrift`
- `kilde` parameter not arriving in Formspree submissions

**Phase relevance:** ALL phases. This is a cross-cutting concern. Every visual change should verify launch offer flow still works.

---

## Moderate Pitfalls

### Pitfall 6: Typography Changes Without Systematic Implementation

**What goes wrong:** Changing fonts or type scale without updating every component. The site currently uses Inter everywhere via Tailwind config. Introducing a display/heading font means updating the config AND checking every hardcoded `text-*` class across 40+ Astro and React files.

**Prevention:**
- If changing typography, change it in `tailwind.config.ts` only, never in component styles
- Use a type scale system (define heading sizes in CSS custom properties or Tailwind theme, not per-component)
- Test with longest Norwegian words (Norwegian compounds get long: "Nettsidesikkerhetsoppdatering") to ensure text doesn't overflow
- If adding a second font, self-host it to avoid render-blocking Google Fonts requests (current Inter loading via Google Fonts is already deferred correctly)

**Phase relevance:** Brand implementation phase. Typography is one of the first things to lock down.

---

### Pitfall 7: Dark Theme Contrast Regression

**What goes wrong:** The current dark palette (`#020617` background, `#F8FAFC` text, `#94A3B8` muted text) has been validated. Brand color changes or new surface layers introduce elements that fail WCAG 2.1 AA contrast ratios. Particularly risky: accent-colored text on dark backgrounds, or light text on colored badges.

**Prevention:**
- Any new color combination must pass contrast check (4.5:1 for body text, 3:1 for large text)
- The current `text-text-muted` (`#94A3B8`) on `bg-surface` (`#020617`) passes at 6.8:1; don't go lighter on muted text
- Brand color (`#06b6d4`) on dark background passes for large text (3.7:1) but NOT for small body text; don't use it for small text
- Test all states: default, hover, focus, active, disabled

**Phase relevance:** Brand implementation and animation phases. Every visual change is a potential contrast regression.

---

### Pitfall 8: Norwegian Content Getting English Technical Jargon

**What goes wrong:** During upgrades, new section copy or UI labels slip into English. "Learn more," "Get started," "Our process" appear instead of Norwegian. Or worse, technical terms that have good Norwegian equivalents get left in English: "responsive design" instead of "responsivt design."

**Prevention:**
- All content strings in a single review pass after each phase
- The existing copy is consistently Norwegian and well-written; use the same voice for new content
- Watch for: button labels, form labels, error messages, aria-labels, meta descriptions, alt text
- Acceptable English: brand names, technical stack names (Astro, React), email addresses
- Current aria-labels are Norwegian ("Hovednavigasjon," "Apne meny") -- maintain this pattern

**Phase relevance:** All phases, but especially brand/copy and SEO phases.

---

### Pitfall 9: Scroll Animation Jank from Competing Animation Systems

**What goes wrong:** The site runs three animation systems simultaneously: CSS keyframes (global.css), IntersectionObserver with CSS transitions (reveal-on-scroll), and Framer Motion (React islands). Adding more animations without understanding which system owns what creates competing observers, double-triggers, and visual jank.

**Prevention:**
- The current animation level system (Level 0: CSS, Level 1: IntersectionObserver, Level 2: Framer Motion) is well-documented in `global.css`; follow it strictly
- Never use Framer Motion for simple scroll reveals -- that's Level 1 CSS territory
- Never add a second IntersectionObserver for the same elements -- the one in `BaseLayout.astro` already handles all `.reveal-on-scroll` elements
- If a section needs complex sequenced animation, escalate to a React island with Framer Motion -- don't try to choreograph CSS animation-delays across 6+ elements

**Phase relevance:** Animation polish phase. Resist the urge to "upgrade" working Level 1 animations to Level 2 unless they genuinely need sequencing control.

---

### Pitfall 10: Mobile Performance Ignored During Desktop-First Animation Work

**What goes wrong:** Animations are designed and tested on desktop. The `GradientBackground.tsx` already has a mobile bailout (static gradient on mobile), which is smart. But new animation work often doesn't include similar mobile-awareness, leading to janky experiences on phones that are 4-10x slower than development machines.

**Prevention:**
- Test every animation on real mobile hardware, not just Chrome mobile emulation
- Follow the `GradientBackground.tsx` pattern: detect mobile and serve simpler version
- Heavy blur effects (`blur-[120px]`) cause GPU compositing issues on mobile Safari specifically
- The DeviceMockup correctly uses `client:media="(min-width: 1024px)"` to skip mobile entirely; apply same pattern to any new decorative animations
- Autoplay video in hero has `preload="none"` which is good; on slow connections the video might never load and that's fine (dark overlay ensures content is always readable)

**Phase relevance:** Animation polish phase. Budget at least 30% of animation work time for mobile testing and fallbacks.

---

## Minor Pitfalls

### Pitfall 11: Image Asset Bloat During Visual Refresh

**What goes wrong:** Adding new portfolio images, background textures, or brand assets without optimization. The project already went through one optimization pass (iGive screenshot 2940px -> 1600px).

**Prevention:**
- All images through optimization pipeline before commit
- Use Astro `<Image>` component for automatic format conversion (AVIF/WebP)
- Portfolio screenshots: max 1600px wide, compress to under 200KB
- Consider lazy loading for below-fold images (native `loading="lazy"`)

**Phase relevance:** Brand and portfolio phases.

---

### Pitfall 12: Schema Markup Drift

**What goes wrong:** The site has three JSON-LD blocks (Organization, LocalBusiness, Offer). Adding or modifying pages without updating schema creates inconsistencies. Google Search Console will flag structured data errors.

**Prevention:**
- After any content or pricing change, validate all JSON-LD with Google's Rich Results Test
- Ensure address, phone, email are identical across all schema blocks
- If launch offer changes (price, availability), update the Offer schema in `BaseLayout.astro`
- Don't add schema to every page unless it's meaningfully different content

**Phase relevance:** SEO phase. Single validation pass after all content changes.

---

### Pitfall 13: Accessibility Regression During Visual Polish

**What goes wrong:** The site has solid a11y fundamentals: focus-visible styles, reduced-motion support, aria-labels, aria-live regions on form states. Visual polish work (changing colors, adding decorative elements, restructuring layouts) can break these without obvious symptoms.

**Prevention:**
- Run `axe-core` or Lighthouse Accessibility audit after each visual change
- Tab through every page after changes; verify focus order still makes sense
- Verify `prefers-reduced-motion` still works after adding any new animation
- Don't remove `aria-live="polite"` from form success/error messages
- New decorative elements must have `aria-hidden="true"` (current code does this correctly for video overlay, scroll indicator, device mockup)

**Phase relevance:** All phases. Run a11y audit as gate before completing each phase.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Brand definition | Skipping it and going straight to visual changes | Complete brand personality document before any Tailwind config changes |
| Brand implementation | Inconsistent application across 40+ files | Systematic file-by-file review using a checklist |
| Animation polish | Performance regression, especially mobile | Set JS budget (80KB cap), test on throttled 4G, require mobile fallbacks |
| Animation polish | Upgrading working Level 1 animations to Level 2 unnecessarily | If it works as CSS, leave it as CSS |
| SEO optimization | Over-optimizing for competitive keywords | Focus on long-tail Norwegian queries, Google Business Profile, schema validation |
| SEO optimization | English leaking into Norwegian meta content | Content review pass specifically for language consistency |
| UX/Conversion | Breaking the form or adding friction | Measure conversion rate BEFORE changes, cap required fields at current level |
| UX/Conversion | Breaking launch offer flow (banner, pricing, URL params, gtag) | Map all touchpoints, test full ad->form->conversion flow after every change |
| Visual refinement | Contrast ratio failures on dark theme | Check every new color against WCAG 2.1 AA on `#020617` background |
| Content updates | Norwegian copy quality degradation | Same voice/tone review as existing high-quality copy |

---

## Sources

- Codebase analysis: `/Users/iverostensen/nettup/src/` (all components, layouts, styles reviewed)
- Project context: `/Users/iverostensen/nettup/.planning/PROJECT.md`
- Performance constraints from `/Users/iverostensen/nettup/CLAUDE.md` (LCP < 2s, accessibility requirements)
- WCAG 2.1 contrast requirements (well-established standard, HIGH confidence)
- Google structured data requirements (well-established standard, HIGH confidence)
- Astro hydration patterns (`client:load`, `client:visible`, `client:media`) from framework documentation (HIGH confidence)
- Norwegian SEO landscape knowledge based on small-market dynamics (MEDIUM confidence -- specific keyword volumes not verified)
