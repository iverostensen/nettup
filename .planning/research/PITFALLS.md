# Pitfalls Research

**Domain:** Web agency service sub-pages — pricing, content, SEO, navigation, schema, CTA flows
**Project:** Nettup.no v1.1 Tjenesteutvidelse
**Researched:** 2026-03-04
**Confidence:** HIGH (based on direct codebase analysis + established service page and schema patterns)

---

## Critical Pitfalls

Mistakes that cause measurable business harm: lost conversions, Google penalties, dead navigation, or technically broken pre-fill flows.

---

### Pitfall 1: Pre-fill Param Contract Broken on New Service Pages

**What goes wrong:**
The existing `ContactForm.tsx` validates `?pakke=` against a hardcoded allowlist: `['enkel', 'standard', 'premium', 'usikker']`. New service sub-pages are supposed to pass a `?tjeneste=` parameter to identify which service the visitor came from, but the form currently has no concept of `tjeneste`. If new service pages just reuse `?pakke=` with arbitrary values (e.g. `?pakke=nettbutikk`), the form's badge logic silently ignores it — the confirmation badge never appears, and the hidden field sends nothing useful to Formspree.

**Why it happens:**
Developer looks at the existing CTA pattern (`/kontakt?pakke=standard&kilde=tjenester`), decides `kilde` is close enough, or tries to squeeze the new service into the `pakke` allowlist. Neither approach is correct because `pakke` maps to a `PakkeInfo` object (name, original price, launch price, monthly), and a service like "AI-integrasjon" doesn't fit that data shape.

**Consequences:**
- Formspree submissions arrive with `pakke: "Ikke valgt"` and `kilde: "nettbutikk"` — sales team has no service context
- The confirmation badge (which tells the customer what they're enquiring about) never shows
- Google Ads conversion tracking still fires but attribution is meaningless

**How to avoid:**
Decide the param contract BEFORE building any service sub-page. Three options, in order of preference:
1. Add `tjeneste` as a new URL param and extend `ContactForm.tsx` to show a service-specific badge (no price display, just service name). Keep `pakke` for package selection, add `tjeneste` for service routing.
2. Extend the `pakke` allowlist and `PAKKE_INFO` map to include service IDs with display-only data (no pricing fields). Higher cognitive load but smaller code change.
3. Rely only on `kilde` for attribution and accept that the badge won't show. Acceptable if per-service badge confirmation is not a priority.

Option 1 is recommended. Implement it in the same phase as the first service sub-page.

**Warning signs:**
- A CTA link like `/kontakt?pakke=nettbutikk` — `nettbutikk` is not in the allowlist
- CTA links to `/kontakt` with no params at all — lost attribution
- ContactForm shows badge only for `enkel`/`standard`/`premium` visitors, never for service page visitors

**Phase to address:** Phase 1 (ContactForm contract extension) — before any service sub-page ships.

---

### Pitfall 2: Nav Active State Breaks for Sub-pages Without Update

**What goes wrong:**
`FloatingNav.tsx` marks nav items active via strict equality: `currentPath === item.href`. The "Tjenester" nav item links to `/tjenester`. When a visitor is on `/tjenester/nettbutikk`, `currentPath` is `/tjenester/nettbutikk`, which is not strictly equal to `/tjenester`. The nav item stays unhighlighted. The user has no visual confirmation they are in the Tjenester section.

**Why it happens:**
The nav was built when `/tjenester` was a leaf page. Strict equality was correct then. Sub-pages make it a parent route and the comparison needs to be prefix-based (`currentPath.startsWith('/tjenester')`) or use a segment comparison.

**Consequences:**
- Minor but visible UX regression on all 7 service sub-pages
- Users lose navigation orientation on the most conversion-critical pages on the site

**How to avoid:**
Update the active state comparison in `FloatingNav.tsx` to use `currentPath.startsWith(item.href)` for items with child routes, or add a `matchPrefix: boolean` flag to nav item config. Also update `MobileMenu.tsx` which has the same `currentPath === item.href` pattern.

Test: visit `/tjenester/nettside` and verify "Tjenester" is highlighted in both desktop and mobile nav.

**Warning signs:**
- Visiting `/tjenester/nettside` — "Tjenester" nav link is not highlighted
- `aria-current="page"` is missing on the nav link for sub-pages

**Phase to address:** Phase 1 (navigation update) — ship alongside the first service sub-page.

---

### Pitfall 3: Pricing Range Without Scope Context Causes Sales Conversations to Start at the Wrong Price

**What goes wrong:**
Showing "fra 15 000 – 60 000 kr" for a Shopify nettbutikk without a scope explanation causes two failure modes. Visitors with a 10K budget click away. Visitors expecting 15K are disappointed in discovery calls when they need custom integrations. The pricing range provides no anchor for what the range represents.

**Why it happens:**
The temptation is to just slap a range on and call it done. But pricing ranges without explanation of what moves the needle are worse than single prices because they communicate uncertainty. A visitor thinks "even they don't know how much it costs."

**Consequences:**
- Unqualified leads from visitors who see 15K and think they're in budget, when their scope is actually 60K+
- Lost leads from visitors who could afford 20K but close the tab at "fra 60K"
- Sales conversations wasted re-explaining scope before getting to the actual sale

**How to avoid:**
Every price range must be accompanied by a "hva påvirker prisen" section (2-3 concrete factors). Examples:
- "Enkel 5-15 produkter: 15 000 kr. Etablert butikk med 100+ produkter og integrasjoner: fra 50 000 kr."
- Alternatively: show a 2-tier breakdown (Komme i gang / Skreddersydd) with concrete starting price for each.
- Avoid: "Pris avhenger av prosjektets omfang" — this says nothing.

Use the pricing strategy the codebase already established: original price + launch price pattern is fine for anchor pricing. For service pages, the anchor should be "hva du typisk får for X" not just the number.

**Warning signs:**
- Price range with no scope explanation on the page
- Range spans more than 5x (e.g. 5K–50K) — this means the product is not defined clearly enough
- Copy says "ta kontakt for pris" with no range at all — invisible pricing = lost leads in the Norwegian SMB market

**Phase to address:** Content phase for each service sub-page. Define scope tiers before writing pricing copy.

---

### Pitfall 4: AI and Webapp Service Pages Written for Developers, Not Buyers

**What goes wrong:**
AI-integrasjoner and webapplikasjoner are inherently technical services. The natural instinct is to describe the stack (Next.js, GPT-4, LangChain, APIs, vector databases) and technical capabilities. The target customer — a Norwegian SMB owner — has no frame of reference for these terms. They don't buy "AI-integrasjon," they buy "automatisk kundeservice som svarer på spørsmål 24/7 uten at du trenger å ansette noen."

**Why it happens:**
The person writing the content knows the technology deeply and defaults to communicating what they know, not what the buyer needs to hear. Feature-listing feels concrete and credible. Outcome-framing requires understanding the buyer's world.

**Consequences:**
- Visitors reach the AI page, see technical terms, feel it's "not for them," and bounce
- The page generates leads only from tech-savvy buyers who were already qualified — misses the broader SMB opportunity
- Ironic: the agency demonstrates technical competence by listing features, but proves nothing about business value

**How to avoid:**
For each service page, write the content in this order:
1. Lead with the business outcome the buyer wants ("spar X timer per uke," "aldri gå glipp av en henvendelse")
2. Then explain how Nettup achieves that outcome (without stack names)
3. Specific use cases relevant to Norwegian SMBs: "chatbot for restaurant-bookinger," "automatisk tilbud for håndverkere"
4. Technical credibility can come at the bottom in a low-key "Teknologien vi bruker" section — it reassures without leading

Test: read the page copy aloud to someone who is not technical. If they can't tell you what they'd get, rewrite it.

**Warning signs:**
- Page headline contains "API," "integrasjon," "ML," "LLM," or framework names
- First paragraph describes the technology rather than the problem it solves
- Feature list uses technical terms as features: "REST API-tilkobling," "webhook-støtte"

**Phase to address:** Content writing phase for `/tjenester/ai` and `/tjenester/webapp` specifically. These two need the most rigorous outcome-framing review.

---

### Pitfall 5: Thin Content on Service Sub-pages Triggers Duplicate or Low-Quality Signals

**What goes wrong:**
Seven new sub-pages with 200-300 words each, structured the same way (H1, short intro, feature list, price, CTA) look like thin content to Google. If the pages are near-identical in structure and share overlapping boilerplate ("Nettup leverer X for norske bedrifter. Ta kontakt i dag."), they dilute each other's relevance signals.

**Why it happens:**
Launching 7 pages in one milestone creates pressure to ship fast. Reusing structural templates is efficient but produces content that only differs in the service name and a few features.

**Consequences:**
- Pages rank poorly for their target queries
- Google may consolidate signals across pages — `/tjenester/nettside` and `/tjenester/landingsside` can be near-duplicates if not differentiated
- Any SEO value from service-specific structured data is undermined by thin prose context

**How to avoid:**
Each page needs a minimum viable content depth. Recommended structure per sub-page:
- H1 + outcome-focused lead paragraph (100+ words)
- What's included: concrete deliverables, not generic features
- What moves the price: scope explanation (prevents the pricing confusion from Pitfall 3)
- Who it's for: 1-2 sentence buyer persona ("Passer for: dagligvarebutikker, restauranter og håndverkere...")
- 1 FAQ or common objection addressed in prose
- CTA section
This produces ~500+ words of differentiated content per page. Prioritize depth on the two highest-value pages (nettside, nettbutikk) if time is short.

**Warning signs:**
- Word count under 300 per sub-page
- More than 3 pages with identical or near-identical H2 structure
- Boilerplate paragraphs copy-pasted across pages (check for identical sentences)

**Phase to address:** Content phase. Write one page fully first, then use it as a template — but force differentiation in the buyer persona and scope sections.

---

### Pitfall 6: Service Schema with Exact `price` Field on Range-Priced Services

**What goes wrong:**
The existing `/tjenester` schema uses `"offers": { "@type": "Offer", "price": "2500", "priceCurrency": "NOK" }`. For the current package-priced services (Enkel/Standard/Premium), this is appropriate — exact prices exist. For new service sub-pages with "fra X – Y kr" ranges, adding `"price": "15000"` in the JSON-LD (the minimum) is technically valid but misleading. Schema.org has `"priceRange"` on `LocalBusiness` but not on `Offer`. The correct pattern for range pricing uses `minPrice`/`maxPrice` which some crawlers handle, but is not standard Schema.org for `Offer`.

**Why it happens:**
Developer copies the existing schema pattern from `/tjenester/index.astro` without checking if exact price is the right field for range-priced services.

**Consequences:**
- Rich result might display "fra 15 000 kr" in SERP but schema says exactly "15000" — mismatch can trigger Google manual review
- Using the minimum of a wide range as the `price` field sets misleading expectations
- Alternative: omitting `offers` entirely and putting pricing only in prose — loses structured data signal

**How to avoid:**
Use `PriceSpecification` with `minPrice` and `maxPrice` fields, which is valid Schema.org:
```json
"offers": {
  "@type": "Offer",
  "priceCurrency": "NOK",
  "priceSpecification": {
    "@type": "PriceSpecification",
    "minPrice": 15000,
    "maxPrice": 60000,
    "priceCurrency": "NOK"
  }
}
```
Alternatively, omit `offers` from service sub-page schemas and let the existing `LocalBusiness` `priceRange: "2500-10000 NOK"` in `BaseLayout.astro` carry the price signal. Then validate in Google Rich Results Test after deployment.

**Warning signs:**
- Service schema using exact `"price"` field when the page shows a range
- Prices in JSON-LD not matching visible pricing on the page
- Rich Results Test showing structured data errors after new sub-pages go live

**Phase to address:** Schema implementation phase. Define the schema shape before writing the first sub-page — it affects how pricing copy is written too.

---

### Pitfall 7: Breadcrumb Schema Labels Break for New Sub-pages

**What goes wrong:**
`BaseLayout.astro` generates `BreadcrumbList` from URL segments using `pageLabels` — a hardcoded record:
```typescript
const pageLabels: Record<string, string> = {
  '/': 'Hjem',
  '/tjenester': 'Tjenester',
  '/om-oss': 'Om oss',
  ...
};
```
For `/tjenester/nettbutikk`, the breadcrumb logic will map the segment `nettbutikk` as the label because there is no entry for `/tjenester/nettbutikk` in `pageLabels`. The raw slug becomes the breadcrumb label: "nettbutikk" instead of "Nettbutikk (Shopify)" or whatever the human-readable name should be.

**Why it happens:**
The breadcrumb system was built for flat pages and works fine there. It was not designed to handle nested routes with human-readable labels different from their slugs.

**Consequences:**
- Google shows "nettbutikk" (lowercase, raw slug) in breadcrumb rich results instead of the real page name
- Missed opportunity for keyword-rich breadcrumb labels like "Nettbutikk og Shopify"

**How to avoid:**
Extend `pageLabels` in `BaseLayout.astro` for all 7 new sub-pages before launch:
```typescript
'/tjenester/nettside': 'Nettside for bedrift',
'/tjenester/landingsside': 'Landingsside',
'/tjenester/nettbutikk': 'Nettbutikk (Shopify)',
'/tjenester/webapp': 'Webapplikasjon',
'/tjenester/seo': 'SEO',
'/tjenester/ai': 'AI-integrasjon',
'/tjenester/vedlikehold': 'Vedlikehold',
```
This is a 7-line change in one file but easy to forget. Verify with Google Rich Results Test breadcrumb output.

**Warning signs:**
- Breadcrumb displays raw slug ("nettbutikk") instead of human-readable name
- Google Search Console shows breadcrumb structured data with slug-cased labels

**Phase to address:** Phase 1 (BaseLayout update) — add entries when the first sub-page slug is decided.

---

### Pitfall 8: Shopify Service Page Making Claims Nettup Cannot Control

**What goes wrong:**
The `/tjenester/nettbutikk` page describes a Shopify service. Shopify is a third-party platform. Common content mistakes include: promising "gratis hosting" (Shopify charges their own fees), claiming SEO capabilities that depend on Shopify's platform constraints, quoting app integration counts that change with Shopify's ecosystem, or implying ownership of the store in ways that conflict with Shopify's actual terms.

**Why it happens:**
Copywriters describe the service from Nettup's perspective without noting what's Nettup-controlled vs. what's Shopify-controlled. This creates false promises.

**Consequences:**
- Customer gets a surprise Shopify bill they weren't expecting
- Nettup makes promises about Shopify performance that the platform won't deliver
- Trust damage when reality doesn't match the page

**How to avoid:**
Explicitly separate what Nettup provides vs. what Shopify provides:
- Nettup: design, theme development, product setup, configuration, training
- Shopify: hosting (their fee, stated clearly: "fra 29 USD/mnd"), payment processing, inventory management
- State Shopify fees explicitly on the pricing section — don't hide the platform cost
- Avoid: "full e-handelsfunksjonalitet" without specifying which plan includes what

**Warning signs:**
- Page mentions "hosting inkludert" on Shopify service (Nettup doesn't control Shopify hosting)
- No mention of Shopify platform subscription cost
- Claims about SEO performance that depend on Shopify plan tier

**Phase to address:** Content review phase for `/tjenester/nettbutikk`.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Copy `/tjenester/index.astro` schema pattern to all sub-pages without adapting | Fast schema implementation | Exact `price` field on range-priced services, schema drift across 7 files | Never — adapt schema shape before copy |
| Link CTAs to `/kontakt` with only `?kilde=` and no `tjeneste` param | No form changes needed | Formspree submissions have no service context, impossible to know which service converts | Only if per-service analytics is explicitly deprioritized |
| Write 7 pages with the same boilerplate intro paragraph, swapping service name | Fast content production | Google thin content signal, pages don't differentiate, risk of cannibalization | Never for top-of-funnel service pages |
| Hardcode service names in breadcrumbs per-page instead of extending `pageLabels` | Avoids touching BaseLayout | Per-page hardcoding diverges from single source of truth, inconsistent breadcrumb format | Never — the pageLabels extension is 7 lines |
| Use `client:load` on a Framer Motion animation in each service page hero | Consistent animation approach | 7 more hydration entries, JS payload growth, LCP risk | Only if animation is truly interactive. Scroll reveal with CSS (Level 1) is sufficient for most service page animations |

---

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Formspree + new `tjeneste` param | New param arrives in Formspree but no label — shows as raw JSON key | Add a Formspree form field alias or ensure the param name matches the Formspree field label expected |
| Shopify (described service) | Not disclosing Shopify's own monthly fee on the service page | State "Shopify-abonnement fra 29 USD/mnd faktureres separat" prominently near pricing |
| Google Ads (`?kilde=` tracking) | New service pages pass `kilde=nettbutikk` etc., which is fine — but if any service CTA uses `?pakke=` with a non-allowlist value, gtag conversion fires but `PAKKE_INFO` lookup returns undefined, badge logic breaks silently | Test each new CTA URL end-to-end: CTA link → ContactForm badge appears → Formspree submission has correct context |
| `@astrojs/sitemap` (auto-generates sitemap) | All 7 new sub-pages get added automatically — good. But if any sub-page is `noindex` for testing and later removed, sitemap may still include it until next build | Never deploy sub-pages with `noindex` meta unless you intend it; the sitemap auto-includes everything |

---

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Each service sub-page imports its own Framer Motion island for a scroll animation | LCP stays under 2s per-page, but React bundle grows across page navigations (View Transitions re-hydrate) | Use `reveal-on-scroll` CSS (Level 1) for simple scroll reveals. Reserve Framer Motion islands for interactions that genuinely require React (pre-fill badge, form state) | With 7 pages each adding 1 island, total client JS can exceed the 80KB budget set in v1.0 pitfalls |
| 7 separate Service JSON-LD blocks with full Organization `provider` objects inlined | Small payload per page, but redundant data | Reference the Organization by `@id` instead of inlining the full object: `"provider": { "@id": "https://nettup.no/#organization" }` | Not a perf issue at this scale, but creates schema drift risk as company info changes |
| Pricing data hardcoded in 7 `.astro` files | Fast to write | When pricing changes, must update 7 files | First time pricing is adjusted post-launch |

---

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Service sub-pages with no cross-links to related services | User on `/tjenester/nettside` has no path to `/tjenester/seo` even though both are likely relevant | Add "Relaterte tjenester" section with 2-3 links at the bottom of each sub-page |
| Service sub-pages with no path back to `/tjenester` overview | Dead end — user must use nav to escape | Breadcrumb (already auto-generated via BaseLayout) handles this if labels are correct (see Pitfall 7), but also add explicit "Se alle tjenester" link near page bottom |
| CTA on every service page using same generic text "Ta kontakt" | Low conversion — generic CTA misses service context | Service-specific CTA copy: "Få tilbud på nettbutikk", "Start AI-prosjekt" — the `?tjeneste=` pre-fill sets the context, the CTA copy should match |
| Pricing section placed after a long feature/content section | Mobile users never scroll to price, bounce rate spikes | Show a price anchor (e.g. "fra 15 000 kr") in the above-the-fold hero area, with full breakdown below. Price visibility reduces bounces from wrong-budget visitors |
| FAQ section on every service page with identical questions | Users who visit multiple service pages see the same FAQ repeated | Keep FAQ service-specific. Reuse only genuinely universal questions (hosting, ownership, payment). The existing `/tjenester` FAQ covers the universal ones — sub-pages should ask service-specific questions |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Service sub-page ships:** Verify `pageLabels` in `BaseLayout.astro` has the new route's human-readable label. Check: visit the page and inspect the breadcrumb schema `name` field — it should not be the raw slug.
- [ ] **CTA pre-fill works:** Click the CTA from each service page and verify the ContactForm badge shows the correct service/package, or `kilde` field arrives with correct value in Formspree test submission.
- [ ] **Nav active state:** Visit each sub-page and verify "Tjenester" nav item is highlighted (requires `startsWith` fix — see Pitfall 2).
- [ ] **Service JSON-LD:** Run Google Rich Results Test on each new sub-page. Verify no errors. Verify `minPrice`/`maxPrice` or chosen schema pattern is valid.
- [ ] **Pricing disclaimer for Shopify:** `/tjenester/nettbutikk` must mention Shopify platform fees. Check the rendered page for any statement about third-party costs.
- [ ] **Norwegian-only content:** Read all 7 pages — no English copy, button labels, or technical jargon that has a Norwegian equivalent.
- [ ] **Breadcrumb chain is correct:** `/tjenester/nettbutikk` breadcrumb should render: Hjem > Tjenester > Nettbutikk (Shopify). Validate in browser and Rich Results Test.
- [ ] **No thin content:** Each sub-page has 500+ words of differentiated prose. Run a word count check before shipping.
- [ ] **Sitemap updated:** After build, inspect `/sitemap-index.xml` and verify all 7 new URLs appear. (Automatic via `@astrojs/sitemap` but worth confirming.)
- [ ] **Cross-links exist:** Each sub-page links to at least 2 related services or back to the overview. No dead ends.

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Pre-fill param contract broken (Pitfall 1) | MEDIUM | Extend `ContactForm.tsx` with `tjeneste` param, update all 7 CTA links — ~2 hours work |
| Nav active state broken (Pitfall 2) | LOW | 2-line change in `FloatingNav.tsx` and `MobileMenu.tsx` — 15 minutes |
| Pricing range without scope (Pitfall 3) | LOW | Content edit only — no code change needed. Single pass over pricing sections |
| AI/webapp page too technical (Pitfall 4) | MEDIUM | Rewrite 2 pages from outcome-first perspective — 3-4 hours of copywriting |
| Thin content penalized by Google (Pitfall 5) | HIGH | Content expansion post-launch is slow — Google takes weeks to re-crawl and re-rank. Best to get content right before shipping |
| Wrong schema field for range pricing (Pitfall 6) | LOW | Schema change in `.astro` files — 30 minutes to update all 7, then validate |
| Breadcrumb labels are raw slugs (Pitfall 7) | LOW | 7-line addition to `BaseLayout.astro` pageLabels — 10 minutes |
| Shopify false promises (Pitfall 8) | MEDIUM | Content correction + potential customer communication if leads were already generated from the page |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Pre-fill param contract (Pitfall 1) | Phase 1: Infrastructure — extend ContactForm before any sub-page ships | End-to-end test: service page CTA → badge shows → Formspree has service context |
| Nav active state (Pitfall 2) | Phase 1: Infrastructure — update FloatingNav and MobileMenu | Visit `/tjenester/nettside`, confirm "Tjenester" is highlighted in desktop + mobile nav |
| Pricing range without scope (Pitfall 3) | Phase 2: Content — define scope tiers before writing pricing copy | Read pricing section aloud: does it explain what moves the price up/down? |
| AI/webapp too technical (Pitfall 4) | Phase 2: Content — use outcome-first content template, mandatory non-technical review | Non-developer reads the page and can explain what they would get |
| Thin content (Pitfall 5) | Phase 2: Content — 500+ word target per page, differentiation checklist | Word count check + check for copy-pasted boilerplate across pages |
| Schema `price` vs range (Pitfall 6) | Phase 3: Schema — define schema template before implementation | Google Rich Results Test on each sub-page, zero errors |
| Breadcrumb labels (Pitfall 7) | Phase 1: Infrastructure — add all 7 routes to `pageLabels` when slugs are decided | Inspect breadcrumb schema `name` field — no raw slugs visible |
| Shopify false promises (Pitfall 8) | Phase 2: Content — Shopify page content review checklist | Page explicitly states Shopify platform fee; no claim Nettup controls hosting |

---

## Sources

- Codebase analysis: `/Users/iverostensen/nettup/src/pages/kontakt/_sections/ContactForm.tsx` — pre-fill allowlist, param handling
- Codebase analysis: `/Users/iverostensen/nettup/src/components/islands/FloatingNav.tsx` — active state logic
- Codebase analysis: `/Users/iverostensen/nettup/src/components/islands/MobileMenu.tsx` — active state logic
- Codebase analysis: `/Users/iverostensen/nettup/src/layouts/BaseLayout.astro` — breadcrumb schema, `pageLabels` implementation
- Codebase analysis: `/Users/iverostensen/nettup/src/pages/tjenester/index.astro` — existing schema pattern using exact `price` field
- Codebase analysis: `/Users/iverostensen/nettup/src/config/pricing.ts` — Pakke interface, allowlist values
- Project context: `/Users/iverostensen/nettup/.planning/PROJECT.md` — v1.1 requirements, target services
- Schema.org: `PriceSpecification` with `minPrice`/`maxPrice` — established standard (HIGH confidence)
- WCAG 2.1 + Astro `astro:page-load` event (used by scroll reveal and path tracking) — well-established patterns (HIGH confidence)
- Shopify partner program terms — merchant owns store, Shopify charges platform fee directly (HIGH confidence from platform documentation)

---
*Pitfalls research for: web agency service sub-pages (v1.1 Tjenesteutvidelse)*
*Researched: 2026-03-04*
