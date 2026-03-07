# Feature Research

**Domain:** Web agency case study / portfolio pages — SEO + GEO optimized
**Milestone:** v1.4 Portefolje 2.0 (nettup.no)
**Researched:** 2026-03-07
**Confidence:** HIGH (GEO patterns from 2025-2026 sources; case study content standards from multiple credible sources)

---

## Context: What Already Exists

The current `/prosjekter` page has a single inline case study (iGive) with: challenge/solution card pair, feature checklist (6 bullets), testimonial block, and one hero screenshot. There is no dedicated per-project URL, no per-project SEO metadata, and no scalable architecture for adding more projects.

This milestone adds:
- A project grid index at `/prosjekter` (cards linking to dedicated pages)
- `/prosjekter/igive` — expanded iGive case study
- `/prosjekter/blom-company` — new Blom Company case study
- Scalable `projects.ts` config driving both index cards and per-page metadata

Existing tech: Astro 5 + Tailwind 4 + React islands + Framer Motion. No new dependencies required for this milestone.

---

## Feature Landscape

### Table Stakes (Users and Crawlers Expect These)

Features that a professional web agency case study page must have. Missing any of these makes the page feel incomplete or unprofessional to prospects who are evaluating whether to hire the agency.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Project hero section** | Prospects form their first judgment from the hero. A headline, one-sentence project description, client name, category tag, and the hero screenshot must all be visible above the fold. | LOW | For Blom: editorial product grid image. For iGive: current `salg.igive.no.png`. Desktop-first crop as hero is typically wider than tall. |
| **Challenge section** | Decision-makers need to recognize their own problem before they trust the solution. Without this, the page reads as self-promotion rather than problem-solving evidence. | LOW | 3-5 concise sentences. The existing iGive challenge text is good — expand it. For Blom: the brief already has the framing ("no template would do"). |
| **Solution section** | Explains what was built and how it solved the challenge. Must explain reasoning, not just list outputs. 31.82% of B2B tech buyers rank challenge-solution framing as their top priority in a case study (2025 Tech Buyer Preferences survey). | LOW | Each solution section should mention the specific technical decisions that are non-obvious. For Blom: why headless, why Sanity for CMS, why two collections. |
| **Tech stack display** | Prospects need to verify that the agency uses the technologies they care about. A scannable tech stack (logos or chips) is expected on any professional portfolio page. | LOW | For Blom: Next.js 15 / Shopify Storefront API / Sanity / Tailwind 4 / TypeScript / Vercel. For iGive: Astro 5 / Tailwind. Display as labeled icon chips. |
| **Outcomes / metrics section** | The single most credible section. Real numbers outperform any copy. Prospects share metrics internally when advocating for hiring an agency. | MEDIUM | For Blom: Lighthouse scores are available and strong (Desktop perf 98, SEO 100, LCP 1.1s). For iGive: performance claims ("under ett sekund") need an actual Lighthouse score or PageSpeed screenshot. Do not make up metrics. |
| **Client testimonial** | Social proof from the actual client. Expected on any agency portfolio page. Its absence signals that no real client could be found to endorse the work. | LOW | Blom testimonial is real and available in the brief. iGive testimonial is currently placeholder — this is a known gap in PROJECT.md. Use Blom's real one as the model. |
| **Live site link** | Prospects want to verify the work is real and live. A "Se live-siden" link (opens in new tab) is expected on every project. | LOW | Blom: `blomcompany.com`. iGive: `salg.igive.no`. For Blom, note that staging screenshots (`blom-no.vercel.app`) may precede the live domain — update when launched. |
| **Breadcrumb navigation** | Users navigating from `/prosjekter` index need a clear path back. Breadcrumbs also drive BreadcrumbList JSON-LD which is a GEO signal. | LOW | `Nettup > Prosjekter > [Project Name]` — consistent with the pattern established in v1.1 service pages. |
| **Project index card linking to dedicated page** | The `/prosjekter` index must show project cards with a clear CTA ("Les case study") linking to the dedicated URL. This is how the portfolio becomes discoverable. | LOW | Card fields: project name, category tag, tagline, hero thumbnail, CTA button. Cards are already partially defined in `projects.ts` — extend the schema. |
| **Per-project SEO metadata** | Each case study page needs its own `<title>`, `<meta description>`, and OG tags. A shared generic title for all projects wastes ranking potential for "[agency] [client]" queries. | LOW | Pattern: `<title>Blom Company — Headless Shopify-nettbutikk | Nettup</title>`. Meta description: outcome-first in Norwegian, 120-155 characters. |

### Differentiators (Competitive Advantage)

Features that elevate these case studies above what a typical Norwegian web agency publishes. Aligned with Nettup's positioning: modern technology, fast delivery, measurable results.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Lighthouse / Core Web Vitals display** | Most Norwegian web agencies don't publish their performance scores. Publishing real scores (especially Blom's desktop 98 / SEO 100 / LCP 1.1s) signals technical credibility in a way text cannot. | LOW | Render as a visual score card (circular gauge or score chips). Blom scores are ready from the brief. iGive: run PageSpeed on `salg.igive.no` and document before writing the page. Flag: Blom mobile perf is 75 (LCP 6.6s hero image issue) — acknowledge this honestly, state it's a pre-launch staging score, re-run post-launch. |
| **GEO-optimized project copy** | AI assistants (ChatGPT, Perplexity, Google AI Overviews) are increasingly the first touchpoint when a prospect searches "best norsk webbyrå" or "headless Shopify Norge". Case study pages with structured, factual, citable content surface in these answers. | MEDIUM | See the GEO Patterns section below for specific implementation rules. This is the single highest-ROI differentiator relative to implementation cost. |
| **CreativeWork + WebSite JSON-LD schema** | Structured data helps Google understand the page as a documented project, not just marketing copy. LLMs achieve 300% higher accuracy with structured data vs unstructured content. CreativeWork schema maps cleanly to case study content. | LOW | `@type: "WebSite"` for the client's site as the output (`url: "https://blomcompany.com"`, `name: "Blom Company"`, `creator: { @type: "Organization", name: "Nettup" }`). Wrap in a CreativeWork for the case study page itself. See the Structured Data section below. |
| **Multiple contextual screenshots** | A single hero image doesn't demonstrate breadth of work. 3-5 screenshots at key sections (homepage, product page, mobile view, CMS or admin interface) give prospects a fuller picture. | MEDIUM | Requires a documented visual content brief per project. See the Visual Content section below. For Blom: editorial homepage, product listing, product detail, mobile viewport. For iGive: homepage, one product block, contact form section. |
| **"Slik gikk det" (How it went) narrative** | A short process narrative (2-3 sentences on timeline and collaboration style) answers the unspoken question: "What is it like to work with Nettup?" Most agency portfolio pages skip this. | LOW | Integrate into solution section or as its own brief paragraph. For Blom: "Blom kom med klar retning — vi leverte uten unødvendige runder." This is already in their testimonial, which supports it. |
| **Mobile/desktop viewport pair** | Showing both desktop and mobile views demonstrates that responsive design is actually implemented, not assumed. Prospects with mobile-heavy traffic care about this. | MEDIUM | For each project: one full desktop viewport screenshot + one mobile viewport screenshot. Can be displayed as a paired mockup (browser frame + phone frame side by side). |
| **Technology rationale (one-liner per tech choice)** | Listing "Next.js, Shopify, Sanity" is table stakes. Explaining *why* each was chosen ("Shopify handles inventory so we don't reinvent checkout security") builds trust and demonstrates expertise. | LOW | 1 sentence per major technology decision in the tech stack section. Blom brief has this context — translate to Norwegian for the page. |

### Anti-Features (Explicitly Avoid)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Process timeline / Gantt chart** | Looks thorough and professional | For a small web agency, publishing specific sprint lengths or delivery timelines creates pressure to match them for future clients. It also signals to competitors how long projects take. | "Rask levering" as a value claim, backed by a concrete delivery window in the hero or CTA ("fra brief til lansering på 4 uker"). |
| **Budget / price disclosure per project** | Prospects want to know cost | Specific project budgets anchor price expectations in the wrong direction — either too high (scares SMBs) or too low (devalues premium work). | Link from case study CTAs to `/priskalkulator` — the price calculator already handles this correctly. |
| **Before/after website comparison** | Compelling visual contrast | iGive and Blom are new-build projects with no predecessor. Before/after only makes sense for redesign projects. Showing a bad "before" that doesn't exist damages the client's brand (even older screenshots look unprofessional). | For redesigns (future projects): use before/after. For greenfield: use "problem statement" + "outcome" framing instead. |
| **Case study PDF download** | B2B lead gen tactic | PDFs leave the indexed web, skip tracking, and require maintenance (version drift). On a portfolio page for an SMB-focused agency, nobody downloads PDFs — they want to see the work and contact. | The case study page itself is the asset. Contact CTA at the bottom. |
| **Video walkthrough of the project** | High engagement, shows the work in motion | Requires a separate production workflow (recording, editing, hosting, embedding) that doesn't exist yet. Video adds page weight and introduces autoplay accessibility issues. | Device mockup images with hover animations (Framer Motion on the mockup card) achieve similar effect with zero video infrastructure. |
| **Client logo wall without attribution** | Looks impressive at a glance | Without a linked case study or at least a testimonial, logos are unverifiable name-dropping. Norwegian SMB clients are suspicious of "we've worked with 50 companies" claims. | Only display logos for clients with a live case study page. 2 real ones > 20 unattributed logos. |
| **Infinite scroll / lazy-loaded projects grid** | Scales as projects are added | At 2 projects, any pagination or infinite scroll is over-engineering. The grid should be simple — cards in a CSS grid, no JavaScript required for the index page. | Simple static grid. Add pagination only at 8+ projects (years away at current growth rate). |

---

## GEO Patterns for Case Study Pages

GEO (Generative Engine Optimization) is the practice of structuring content so AI systems — ChatGPT, Perplexity, Claude, Google AI Overviews — cite it when answering user queries. This section translates GEO research into specific implementation patterns for Nettup's case study pages.

**Why GEO matters for these pages:** When a prospect asks ChatGPT "beste norsk webbyrå for headless Shopify" or Perplexity "norsk webbyrå nettbutikk Next.js", a well-structured case study is citable evidence. The 2023 Princeton/Georgia Tech/IIT Delhi GEO study found that adding citations, statistics, and structured content to pages improved AI search visibility by 30-40%.

### Pattern 1: Direct Answer in First 200 Words

AI systems using RAG (Retrieval-Augmented Generation) evaluate page relevance primarily from opening content. The case study intro must answer the core question directly.

**Do:** "Blom Company er en norsk golf- og streetwear-merkevare. Nettup bygde et fullt tilpasset headless Shopify-utstillingsvindu med Next.js 15, Sanity CMS og Tailwind CSS 4 — lansert med Lighthouse-score 98 på desktop og LCP 1,1 sekund."

**Don't:** Begin with "Da Blom Company tok kontakt med oss, visste vi at dette skulle bli et spennende prosjekt..."

### Pattern 2: Specific, Verifiable Facts

AI engines prefer citable facts over general claims. Every case study must contain:
- Specific technology versions (Next.js 15, not "Next.js")
- Concrete metrics (LCP 1.1s, Lighthouse 98, not "rask")
- Named deliverables (Lifestyle-kolleksjon og Sport-kolleksjon, not "to produktlinjer")
- Timeline indicators if verifiable ("lansert [month year]")

Avoid vague phrases: "moderne teknologi", "rask levering", "stor forbedring". Replace each with a specific claim.

### Pattern 3: Structured Heading Hierarchy

AI systems parse content using heading structure. Case study pages must use:
- `<h1>`: Project name + one-line description (e.g., "Blom Company — Headless Shopify for norsk golf- og streetwear-merkevare")
- `<h2>`: Section labels that read as standalone statements ("Utfordringen: en butikk som matchet merkevaren", "Resultater: 98 i ytelse på desktop")
- `<h3>`: Subsections within major sections if needed

Do not use generic headings like "Om prosjektet" or "Løsningen" — AI systems can't distinguish these from any other agency's boilerplate.

### Pattern 4: Schema Markup as Machine-Readable Summary

Structured data is the highest-confidence signal for AI systems. A LLM cited in a study achieves 300% higher accuracy when processing structured data vs unstructured text. The CreativeWork schema for each case study should include:

```json
{
  "@type": "WebSite",
  "name": "Blom Company",
  "url": "https://blomcompany.com",
  "description": "Headless Shopify-nettbutikk for norsk golf- og streetwear-merkevare. Bygget med Next.js 15, Sanity CMS og Tailwind CSS 4.",
  "creator": {
    "@type": "Organization",
    "name": "Nettup",
    "url": "https://nettup.no"
  },
  "keywords": ["headless shopify", "Next.js nettbutikk", "Sanity CMS", "norsk webbyrå"],
  "inLanguage": "nb"
}
```

### Pattern 5: FAQ Section ("Vanlige spørsmål")

AI systems disproportionately cite FAQ sections because they map directly to query patterns. Adding a 3-4 question FAQ at the bottom of each case study creates high-citation-potential content.

Recommended FAQ questions for Blom:
- "Hva er headless Shopify og hvorfor valgte dere det for Blom Company?"
- "Hvordan håndterer nettstedet to ulike produktlinjer?"
- "Hva oppnådde dere på Lighthouse-testen?"

Recommended FAQ questions for iGive:
- "Hva var utfordringen Nettup løste for iGive?"
- "Hvorfor ble det bygget som en egen salgsside i stedet for å bruke nettbutikken?"
- "Hva er ytelsen på salg.igive.no?"

This FAQ section also feeds `FAQPage` JSON-LD, consistent with the blog pipeline's pattern.

### Pattern 6: Cross-References and Internal Links

Perplexity AI shows preference for content with internal cross-references. Each case study should link to:
- The relevant Nettup service page (Blom → `/tjenester/nettbutikk`, iGive → `/tjenester/nettside`)
- The `/prosjekter` index
- The other case study (cross-link between iGive and Blom at the bottom: "Se også:")

This network of links signals topical authority and increases the probability of multi-page citation chains.

---

## SEO Patterns for Case Study Pages

### Title and Meta Description Patterns

Google and AI Overviews give high weight to `<title>` tags. For agency portfolio pages targeting "[agency name] [client]" and "[service] [location]" queries:

**Title pattern:** `[Client Name] — [Project type] | Nettup`
- "Blom Company — Headless Shopify-nettbutikk | Nettup"
- "iGive — B2B salgsside for gavekortplattform | Nettup"

**Meta description pattern:** Outcome-first, specific metric, 120-155 characters.
- "Custom headless nettbutikk for Blom Company. Next.js 15, Sanity CMS og Tailwind CSS 4 — Lighthouse 98 på desktop, LCP 1,1s."
- "Dedikert B2B-salgsside for iGive. Presenterer tre gavekortprodukter klart for bedriftskunder — under ett sekund lastestid."

### URL Structure

- `/prosjekter/igive` — matches client slug, not a generic `/prosjekter/1`
- `/prosjekter/blom-company` — hyphenated, Norwegian-friendly
- Consistent with `id` field in `projects.ts`

### BreadcrumbList JSON-LD

Consistent with v1.1 service pages pattern:
```
Nettup (/) > Prosjekter (/prosjekter) > Blom Company (/prosjekter/blom-company)
```

This is a confirmed ranking signal and already established as a pattern in this codebase.

---

## Visual Content Requirements

The visual content brief defines exactly which screenshots and assets are needed per project. This is a dependency: the page cannot be built (or built well) without the assets first.

### Visual Content Checklist — Per Project

**Hero image** (required, 1 per project)
- [ ] Full-width desktop viewport screenshot of the most visually impressive page (homepage or product listing)
- [ ] Crop: 1600 x 900px (16:9) or 1600 x 1000px
- [ ] Format: WebP via Astro `<Image>` pipeline
- [ ] Alt text: "[Client name] — [page name] screenshot" in Norwegian
- [ ] File size target: < 300KB after Astro optimization

**Section screenshots** (recommended, 2-4 per project)
- [ ] One screenshot per major section that demonstrates a distinct deliverable
- [ ] For e-commerce: product listing page + product detail page
- [ ] For marketing sites: hero section + one content section
- [ ] Crop: consistent width (1440px desktop or 390px mobile), height flexible
- [ ] Labelled with caption text in the page component

**Mobile viewport screenshot** (recommended, 1 per project)
- [ ] iPhone or Android viewport width (390px)
- [ ] Shows the same hero or product page at mobile breakpoint
- [ ] Demonstrates that responsive design is real, not assumed
- [ ] Display in a phone frame mockup (CSS or SVG frame, no third-party service)

**Desktop browser frame** (optional, 1 per project)
- [ ] Hero screenshot wrapped in a browser chrome mockup
- [ ] Adds visual professionalism to section screenshots
- [ ] Implemented as a CSS component, not a Figma export (keeps it maintainable)

**Lighthouse score card** (required for Blom, required for iGive after measurement)
- [ ] Screenshot or designed card showing: Performance, Accessibility, Best Practices, SEO scores
- [ ] For Blom desktop: 98 / 96 / 96 / 100
- [ ] For Blom mobile: 75 / 96 / 96 / 100 — include with a note ("mobilscoren er trukket ned av hero-bildet, alle andre målinger er grønne")
- [ ] For iGive: run PageSpeed Insights on `salg.igive.no` and document before writing the section

**Visual content NOT needed for this milestone:**
- Before/after comparisons (both projects are greenfield builds — see Anti-Features)
- Video walkthroughs (see Anti-Features)
- Process diagrams or wireframes (adds scope without proportional value at this stage)

### Per-Project Visual Brief

**Blom Company visual brief:**
1. Hero: Editorial homepage screenshot — cream/gold design, full product grid, Cormorant Garamond headings visible
2. Product listing: Lifestyle or Sport collection grid
3. Product detail: Single product page with variant selector, size guide, image gallery
4. Mobile: Homepage or product listing at 390px viewport
5. Lighthouse card: Desktop scores (designed card, not raw screenshot)

Source for all Blom screenshots: `blom-no.vercel.app` (staging) until `blomcompany.com` is live.

**iGive visual brief:**
1. Hero: `salg.igive.no` homepage — full viewport at 1440px desktop
2. Product block: One of the three product cards (Digitalt / QR / Fysisk) in detail
3. CTA/contact section: The "Ta kontakt" section to demonstrate conversion path
4. Mobile: Homepage at 390px viewport
5. Performance: Run PageSpeed Insights, design score card with actual numbers

---

## Feature Dependencies

```
[projects.ts config schema — extended]
    +-- required by --> [/prosjekter index page]
    +-- required by --> [/prosjekter/[slug] page routing]
    +-- required by --> [per-project SEO metadata]
    +-- drives --> [project card display on index]
    +-- drives --> [case study page content]

[Visual assets — screenshots per project]
    +-- required by --> [Hero section on case study page]
    +-- required by --> [Section screenshots component]
    +-- required by --> [Mobile viewport display]
    +-- MUST EXIST BEFORE page content is written

[/prosjekter index redesign]
    +-- required by --> [user discovery path to case study pages]
    +-- links to --> [/prosjekter/igive]
    +-- links to --> [/prosjekter/blom-company]

[Case study page template / layout]
    +-- required by --> [/prosjekter/igive]
    +-- required by --> [/prosjekter/blom-company]
    +-- includes --> [CreativeWork JSON-LD]
    +-- includes --> [BreadcrumbList JSON-LD]
    +-- includes --> [FAQPage JSON-LD]
    +-- includes --> [per-project <title> + meta description]

[FAQPage JSON-LD]
    +-- requires --> [FAQ section written in page content first]
    +-- consistent with --> [blog pipeline FAQPage pattern]

[GEO-optimized copy]
    +-- requires --> [specific metrics verified (Lighthouse, performance)]
    +-- requires --> [tech stack confirmed with client / brief]
    +-- enhances --> [structured data (more citable = more cited)]
```

### Dependency Notes

- **Visual assets are the critical path blocker.** Do not write the case study pages without screenshots in hand. Placeholder images lead to text-and-layout iterations that must be redone when real images arrive. Capture screenshots first, then write content around what the images show.
- **iGive metrics are unverified.** The current copy says "under ett sekund" but there is no Lighthouse score in the existing project config. Run PageSpeed Insights on `salg.igive.no` before writing the metrics section. If the score is disappointing, reframe honestly.
- **Blom Company is staging-only.** All visual assets come from `blom-no.vercel.app` until `blomcompany.com` is live. Note this in the page at launch if needed; update live URL when available.
- **`projects.ts` schema extension.** The current schema has `challenge`, `solution`, `features` as strings and string arrays. The new schema needs: `techStack[]`, `metrics{}`, `screenshots[]`, `faq[]`, `liveUrl`, `slug`. The index page and case study pages both read from this config — changes to the schema affect both consumers.

---

## MVP Definition

### Launch With (v1.4 core)

This is the full milestone — all items are required for a meaningful v1.4 release.

**Infrastructure:**
- [ ] `projects.ts` schema extended with new fields (techStack, metrics, screenshots, slug, faq)
- [ ] `/prosjekter` index rebuilt as project grid (Astro, static, no React needed)
- [ ] `[slug].astro` routing for `/prosjekter/[slug]` (or individual `igive/index.astro` + `blom-company/index.astro` files if sections diverge significantly)
- [ ] Case study page template with all standard sections

**iGive case study (`/prosjekter/igive`):**
- [ ] Visual assets captured (PageSpeed run, screenshots taken)
- [ ] Metrics section with verified Lighthouse scores
- [ ] Tech stack section (Astro 5 / Tailwind 4 / Vercel)
- [ ] GEO-optimized copy (direct answer intro, specific metrics, named deliverables)
- [ ] FAQ section (3-4 questions, feeds FAQPage JSON-LD)
- [ ] Per-project SEO metadata (title, description, OG tags)
- [ ] CreativeWork + BreadcrumbList JSON-LD

**Blom Company case study (`/prosjekter/blom-company`):**
- [ ] Visual assets captured from staging (`blom-no.vercel.app`)
- [ ] Hero screenshot (editorial homepage)
- [ ] 3-4 section screenshots
- [ ] Mobile viewport screenshot
- [ ] Lighthouse score card (desktop 98 / 96 / 96 / 100)
- [ ] Tech stack section (Next.js 15 / Shopify Storefront API / Sanity / Tailwind 4 / TypeScript / Vercel)
- [ ] GEO-optimized copy
- [ ] Real testimonial from brief (or editorial rewrite in same voice)
- [ ] FAQ section (3-4 questions, feeds FAQPage JSON-LD)
- [ ] Per-project SEO metadata
- [ ] CreativeWork + BreadcrumbList JSON-LD

### Add After Validation

- [ ] Device mockup frames (phone/browser CSS frames) — if visual quality warrants it
- [ ] iGive testimonial replacement (real quote) — currently placeholder, unblock when client provides one
- [ ] Third project card on index (placeholder or "snart" state) — when project #3 exists

### Future Consideration (v1.5+)

- [ ] Category filtering on `/prosjekter` index — only relevant at 6+ projects
- [ ] Case study search or filtering by tech stack — only relevant at 10+ projects
- [ ] Video walkthrough — if a high-impact project justifies the production workflow
- [ ] Before/after comparisons — for the first redesign project (when it exists)

---

## Feature Prioritization Matrix

| Feature | User/SEO Value | Implementation Cost | Priority |
|---------|----------------|---------------------|----------|
| `projects.ts` schema extension | HIGH | LOW | P1 |
| `/prosjekter` index grid rebuild | HIGH | LOW | P1 |
| Case study page template | HIGH | MEDIUM | P1 |
| Visual assets — Blom screenshots | HIGH | LOW (capture work) | P1 |
| Visual assets — iGive metrics | HIGH | LOW (run PageSpeed) | P1 |
| GEO-optimized copy (both projects) | HIGH | LOW | P1 |
| FAQ section + FAQPage JSON-LD | HIGH | LOW | P1 |
| CreativeWork JSON-LD | MEDIUM | LOW | P1 |
| BreadcrumbList JSON-LD | MEDIUM | LOW | P1 |
| Per-project SEO metadata | HIGH | LOW | P1 |
| Lighthouse score card display | HIGH | LOW | P1 |
| Tech stack section with rationale | MEDIUM | LOW | P1 |
| Multiple section screenshots | MEDIUM | MEDIUM | P2 |
| Mobile viewport screenshot | MEDIUM | LOW | P2 |
| Desktop browser frame mockup | LOW | LOW | P2 |
| Device mockup CSS frames | LOW | MEDIUM | P3 |
| Real iGive testimonial | HIGH | EXTERNAL (client) | P2 (blocked) |

**Priority key:**
- P1: Required for v1.4 launch
- P2: Improve quality, add when P1 scope is stable
- P3: Future milestone

---

## Competitor Feature Analysis

Context: Norwegian web agencies with portfolio pages — observed patterns as of early 2026.

| Feature | Typical Norwegian agency portfolio | Our approach |
|---------|-----------------------------------|--------------|
| Challenge/solution | Generic ("kunden trengte ny nettside") | Specific ("Blom hadde to ulike målgrupper i én merkevare") |
| Metrics | Absent or vague ("stor økning i trafikk") | Specific Lighthouse scores, named Core Web Vitals |
| Tech stack | Listed without rationale | Each technology choice explained in one sentence |
| Testimonials | Often placeholder or absent | Real Blom testimonial available; iGive deferred until real quote |
| GEO / AI-ready content | Not addressed | Direct-answer intro, FAQ section, CreativeWork schema |
| Visual depth | Single screenshot or no screenshots | 3-5 screenshots per project, mobile + desktop |
| Per-project SEO | Generic `/prosjekter` page title | Individual `<title>` and meta per case study URL |

---

## Sources

- PROJECT.md (`/Users/iverostensen/nettup/.planning/PROJECT.md`) — milestone scope and existing architecture (HIGH confidence, primary source)
- `nettup-case-study-brief.md` — Blom Company project facts, tech stack, Lighthouse scores, testimonial (HIGH confidence)
- `src/config/projects.ts` — existing iGive project schema and data (HIGH confidence)
- [Webflow: How to write the perfect case study](https://webflow.com/blog/write-the-perfect-case-study) — content section standards (MEDIUM confidence)
- [New Media Campaigns: Agency website case study guide](https://www.newmediacampaigns.com/blog/tips-for-writing-agency-website-case-studies) — challenge-solution framing, 31.82% stat (MEDIUM confidence, survey-sourced)
- [Search Engine Land: Mastering GEO in 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142) — GEO structural patterns (HIGH confidence, 2026 source)
- [Enrich Labs: GEO Complete Guide 2026](https://www.enrichlabs.ai/blog/generative-engine-optimization-geo-complete-guide-2026) — RAG citation patterns, platform preferences (MEDIUM confidence)
- [GEO academic paper — Princeton/Georgia Tech/IIT Delhi](https://arxiv.org/pdf/2311.09735) — 30-40% visibility improvement with structured content (HIGH confidence, peer-reviewed)
- [Averi.ai: GEO Playbook 2026](https://www.averi.ai/blog/the-geo-playbook-2026-getting-cited-by-llms-(not-just-ranked-by-google)) — 300% LLM accuracy with structured data stat, case study citation patterns (MEDIUM confidence)
- [Schema.org: CreativeWork type](https://schema.org/CreativeWork) — property definitions for structured data (HIGH confidence, authoritative)
- [IxDF: Visuals for UX case studies](https://www.interaction-design.org/literature/article/how-to-create-visuals-for-your-ux-case-study) — visual content types and roles (MEDIUM confidence)
- [UXfol.io: UX Case Study Template 2026](https://blog.uxfol.io/ux-case-study-template/) — visual content checklist patterns (MEDIUM confidence)

---
*Feature research for: Nettup v1.4 — Portefolje 2.0 (dedicated case study pages)*
*Researched: 2026-03-07*
