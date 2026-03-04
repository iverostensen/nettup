# Project Research Summary

**Project:** Nettup v1.1 — Tjenesteutvidelse
**Domain:** Web agency marketing site — 7 dedicated service sub-pages
**Researched:** 2026-03-04
**Confidence:** HIGH

## Executive Summary

v1.1 adds 7 dedicated service sub-pages to a working Astro 5 marketing site, replacing the current generic 3-tier pricing page at `/tjenester` with a service catalog that links to individual pages for: nettside, landingsside, nettbutikk, webapp, SEO, AI-integrasjon, and vedlikehold. The existing stack (Astro 5, Tailwind 4, Framer Motion, React islands) handles everything — no new dependencies are required. The recommended routing approach is individual `index.astro` files per service (not a shared `[slug].astro` template), because each service requires structurally distinct sections: webapp needs a 4-step discovery process, AI needs a use-case gallery, nettbutikk needs Shopify-specific content and fee disclaimers. A shared template enforces lowest-common-denominator layouts that would underperform for conversion.

The primary technical risk is a broken CTA pre-fill contract. The existing `ContactForm.tsx` validates `?pakke=` against a hardcoded allowlist (`enkel`/`standard`/`premium`/`usikker`). New service pages must use a new `?tjeneste=` param, and `ContactForm.tsx` must be extended to read and display this before any service sub-page ships. This is a small, contained change but easy to miss — the consequence is Formspree submissions with no service context and a broken confirmation badge. Fix it in Phase 1 before any service page goes live.

The primary content risk is thin or overly technical pages. Seven near-identical pages with generic boilerplate will signal thin content to Google and fail to convert SMB buyers. The AI and webapp pages are especially at risk of being written for developers rather than buyers — they must lead with business outcomes, not technology. Each page needs 500+ words of differentiated Norwegian prose. Pricing ranges must be accompanied by scope explanations, not just numbers. The `/nettside-for-bedrift` landing page is the validated conversion template to use as the content reference for every service page.

## Key Findings

### Recommended Stack

No new packages are required for this milestone. The existing Astro 5 file-based routing handles nested directories natively. Tailwind 4 and Framer Motion cover all styling and animation needs. `@astrojs/sitemap` automatically picks up new pages at build time — zero configuration needed. FAQ sections should use native HTML `<details>/<summary>` or a static layout (not a React accordion library), because FAQPage schema requires answers to be in the DOM and adding a React island for static content violates the project's "Astro sections first" rule.

**Core technologies:**
- Astro 5 file-based routing: individual `index.astro` per service — matches established pattern from `/nettside-for-bedrift/` and `/kontakt/`
- Tailwind 4: all styling, no changes needed
- Framer Motion: existing `.reveal-on-scroll` CSS class handles scroll reveals; React islands reserved for genuinely interactive elements
- Native `<details>/<summary>`: FAQ interaction without JS overhead or bundle inflation
- Inline JSON-LD via `<slot name="head">`: established pattern for per-page schema, already working in `/tjenester/index.astro`

**Required changes to existing files:**
- `ContactForm.tsx`: add `?tjeneste=` param branch alongside existing `?pakke=`
- `BaseLayout.astro`: extend `pageLabels` map with 7 service sub-paths for breadcrumbs
- `FloatingNav.tsx` + `MobileMenu.tsx`: fix active state from strict equality to `startsWith` for parent routes

### Expected Features

**Must have (table stakes) — all 7 service pages:**
- Outcome-focused headline — SMB buyers care about results, not technology
- Price signal above the fold ("fra X kr") — prevents bounce from price-sensitive buyers
- "Hva er inkludert" section specific to each service — removes fear of hidden costs
- Service-specific FAQ (5+ questions) with FAQPage JSON-LD schema — objection handling + SEO
- CTA to `/kontakt?tjeneste=[slug]` with pre-fill — attribution and friction reduction
- Service JSON-LD schema (`@type: "Service"` with `PriceSpecification`) — structured data for Google
- Trust badges (24t responstid, 30 dagers garanti, Norsk support) — reduces perceived risk
- Mobile-first layout at 375px — project requirement

**Should have (differentiators):**
- "Passer for deg hvis" self-qualifier block — reduces bad-fit leads, builds trust with good-fit buyers
- Scope explanation alongside price range — explains what moves the price, prevents discovery call failures
- Delivery timeline per service — "klar på 2-3 uker" is a competitive differentiator vs. agencies that take months
- Cross-links to related services at page bottom — prevents dead ends and supports internal linking

**Service-specific requirements:**
- Nettbutikk: explicit Shopify platform fee disclosure ("fra 29 USD/mnd faktureres separat")
- AI: data privacy FAQ addressing GDPR and data location — #1 SMB objection in Norwegian market
- Webapp: 4-step discovery process (Discovery → Design → Development → Launch) — addresses "always goes over budget" fear
- Vedlikehold: "Etter lansering" framing for upsell from other service pages

**Defer to v1.x:**
- "Passer for deg hvis" blocks — add after seeing which services generate mismatched leads
- Service-specific testimonials beyond iGive — requires building more client portfolio
- Interactive scope estimator — only if form gets frequent "which tier do I need?" messages
- "Book AI-workshop" CTA variant — when discovery session capacity exists

**Defer to v2+:**
- Guided service selection quiz — only if overview bounce rate is high
- Per-service case studies — requires more projects
- Video explainers — production cost, defer until content budget exists
- A/B testing — only when traffic volume justifies it

### Architecture Approach

The correct architecture uses individual `index.astro` files per service, each with its own `_sections/` directory. This mirrors the existing pattern from `/nettside-for-bedrift/` and `/kontakt/`. A central `src/config/services.ts` file holds shared metadata (slug, name, tagline, price range, meta title/description, icon) that both the redesigned `/tjenester` overview and individual page CTAs consume — but section composition and content remain per-page. This is explicitly not a `[slug].astro` + `getStaticPaths()` approach, because services require structurally different sections that a shared template cannot accommodate cleanly.

**Major components:**
1. `src/config/services.ts` (new) — shared metadata for overview cards and internal links; does NOT drive section composition
2. `src/pages/tjenester/index.astro` (rewrite) — service catalog with 7 cards linking to sub-pages; replaces pricing tier model
3. `src/pages/tjenester/[service]/index.astro` x7 (new) — individual page per service, each with its own `_sections/`
4. `src/layouts/BaseLayout.astro` (minor update) — add 7 service routes to `pageLabels` for breadcrumbs
5. `src/components/islands/ContactForm.tsx` (small update) — add `?tjeneste=` param handling
6. `src/components/islands/FloatingNav.tsx` + `MobileMenu.tsx` (small fix) — `startsWith` active state

**Build order (critical path):**
1. Define `services.ts` interface and populate with metadata for all 7 services
2. Extend `ContactForm.tsx` with `?tjeneste=` param — must happen before any sub-page ships
3. Fix nav active state in `FloatingNav.tsx` and `MobileMenu.tsx`
4. Update `pageLabels` in `BaseLayout.astro`
5. Rewrite `/tjenester/index.astro` overview as service catalog
6. Build service sub-pages (can run in parallel once steps 1–4 are done)
7. Verify: build, breadcrumbs, nav state, CTA pre-fill, schema validation

### Critical Pitfalls

1. **Pre-fill param contract broken** — `ContactForm.tsx` validates `?pakke=` against a hardcoded allowlist; `?tjeneste=nettbutikk` is silently ignored. Extend `ContactForm.tsx` before any sub-page ships. Test end-to-end: CTA click → badge shows → Formspree submission has service context.

2. **Nav active state not updated** — `FloatingNav.tsx` and `MobileMenu.tsx` use strict equality (`currentPath === item.href`). Sub-pages don't match `/tjenester`, so the nav item stays unhighlighted. Fix to `currentPath.startsWith(item.href)` — a 2-line change in each file.

3. **Pricing ranges without scope context** — "fra 15 000 – 60 000 kr" without explanation signals uncertainty to buyers and causes mismatched leads. Every price range must be paired with "hva påvirker prisen" — 2-3 concrete scope factors. Define scope tiers before writing pricing copy.

4. **AI and webapp pages written for developers** — the instinct is to describe the stack and technical capabilities. The buyer reads this as "not for me" and bounces. Lead with business outcomes ("spar X timer per uke"), then explain process, then technology (if at all). Read the page aloud to a non-technical person before shipping.

5. **Thin content across 7 near-identical pages** — boilerplate pages under 300 words with shared paragraphs signal thin content to Google. Each page needs 500+ words of differentiated Norwegian prose. Differentiators: buyer persona, scope explanation, service-specific FAQ, specific use cases. Write one page fully first, then enforce differentiation across the others.

6. **Service schema using exact `price` field for range-priced services** — copying the existing schema pattern from `/tjenester/index.astro` (which uses exact package prices) produces misleading schema for range-priced services. Use `PriceSpecification` with `minPrice`/`maxPrice` instead. Define schema shape before implementation — it affects pricing copy too.

7. **Breadcrumb labels are raw slugs** — `BaseLayout.astro` falls back to the raw URL segment if the path is not in `pageLabels`. Add all 7 service routes before launch. This is 7 lines of code and easy to forget.

8. **Shopify false promises** — claiming "hosting inkludert" or not disclosing Shopify's platform fee creates trust damage. Explicitly separate Nettup's work (design, setup, configuration) from Shopify's infrastructure (hosting, payment processing, monthly fee). State "Shopify-abonnement fra 29 USD/mnd faktureres separat" on the pricing section.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Infrastructure

**Rationale:** Three blockers must be resolved before any service sub-page can ship without regression: the ContactForm pre-fill contract, the nav active state, and the breadcrumb labels. These are small changes but they affect every sub-page. Doing them last creates a risk of shipping broken pages and then doing a retroactive fix across 7 URLs.

**Delivers:** All shared infrastructure in a correct state for sub-pages to be added safely.

**Addresses:** ContactForm pre-fill contract, nav active state, breadcrumb label coverage, shared service metadata

**Avoids:** Pitfall 1 (broken pre-fill), Pitfall 2 (nav active state), Pitfall 7 (raw slug breadcrumbs)

**Tasks:**
- Extend `ContactForm.tsx` with `?tjeneste=` param and add service name display
- Fix `FloatingNav.tsx` and `MobileMenu.tsx` active state to use `startsWith`
- Extend `pageLabels` in `BaseLayout.astro` with all 7 service routes
- Create `src/config/services.ts` with shared metadata (slug, name, tagline, icon, price range, meta title/description)

---

### Phase 2: Tjenesteoversikt Redesign

**Rationale:** The `/tjenester` overview is the navigation hub — users land here and click through to sub-pages. It must clearly describe 7 distinct services before the sub-pages exist so the information architecture is coherent. Rewriting it before sub-pages are built also forces the service metadata in `services.ts` to be complete and accurate.

**Delivers:** Redesigned `/tjenester` index as a 7-service catalog with cards linking to sub-pages.

**Uses:** `services.ts` from Phase 1; existing Card, Section, SectionHeader UI primitives

**Addresses:** Service overview as entry point; replaces the pricing tier model

**Tasks:**
- Rewrite `/tjenester/index.astro` to import from `services.ts` and render service cards
- Archive or adapt `_sections/Pakker.astro` (pricing tier model being replaced)
- Each card shows: name, tagline, price range, delivery time, CTA link to sub-page

---

### Phase 3: Service Sub-pages — Core 3

**Rationale:** Build the three highest-value service pages first (nettside, nettbutikk, landingsside) — these have the most validated conversion patterns and the lowest content risk. Nettside is the agency's core service and has the existing `/nettside-for-bedrift` as a proven template. Getting these three right establishes the content benchmark for the remaining four.

**Delivers:** `/tjenester/nettside`, `/tjenester/nettbutikk`, `/tjenester/landingsside` — each with Hero, Inkludert, Prosess, Priser, FAQ, CTA sections; Service JSON-LD schema; FAQPage schema.

**Implements:** Individual `index.astro` + `_sections/` pattern per service

**Avoids:** Pitfall 3 (pricing without scope), Pitfall 5 (thin content), Pitfall 6 (wrong schema field), Pitfall 8 (Shopify false promises)

**Tasks:**
- Create `src/pages/tjenester/nettside/`, `nettbutikk/`, `landingsside/` with `_sections/`
- Write 500+ words Norwegian content per page, differentiated buyer personas
- Pricing with scope explanation (not just a range)
- Service-specific FAQ (5+ questions each) with FAQPage JSON-LD
- Nettbutikk: Shopify fee disclosure, "passer for deg hvis" qualifier
- Service JSON-LD using `PriceSpecification` with `minPrice`/`maxPrice`
- Mobile verification at 375px per page

---

### Phase 4: Service Sub-pages — Specialist 4

**Rationale:** Webapp, SEO, AI-integrasjon, and vedlikehold have higher content complexity. Webapp and AI require rigorous outcome-first framing that is difficult to get right without the benchmark established by Phase 3. Doing them second allows learnings from Phase 3 to carry forward.

**Delivers:** `/tjenester/webapp`, `/tjenester/seo`, `/tjenester/ai`, `/tjenester/vedlikehold`.

**Avoids:** Pitfall 4 (AI/webapp written for developers), Pitfall 5 (thin content)

**Tasks:**
- Webapp: 4-step discovery process, use cases in plain language, 40K–300K+ range with scope tiers
- SEO: outcome framing (never promise rankings), timeline honesty (3–6 months), local SEO angle for Norway
- AI: concrete use-case gallery (4–6 examples), GDPR/data privacy FAQ (mandatory for Norwegian SMBs), explicit disclaimer that Nettup integrates existing AI models rather than training its own
- Vedlikehold: peace-of-mind framing, price tiers from existing `pricing.ts`, "etter lansering" upsell angle
- All: non-technical content review before shipping (read-aloud test with non-developer)

---

### Phase 5: Cross-linking and Validation

**Rationale:** After all 7 pages exist, validate the full user journey and add cross-links. Cross-linking benefits are only meaningful once destination pages exist.

**Delivers:** Complete, interlinked service section with verified structured data and confirmed CTA flows.

**Tasks:**
- Add "Relaterte tjenester" section to each sub-page (2–3 cross-links)
- Add "Se alle tjenester" link near bottom of each sub-page
- Google Rich Results Test on all 7 sub-pages — verify Service + FAQPage schemas, no errors
- End-to-end CTA test: each page CTA → ContactForm badge correct → Formspree submission has correct `tjeneste` field
- Nav active state verification on all 7 sub-pages (desktop + mobile)
- Breadcrumb verification (no raw slugs)
- Word count check (500+ per page, no copy-pasted boilerplate)
- Sitemap verification (all 7 URLs present in `sitemap-index.xml`)
- Confirm `/nettside-for-bedrift` sitemap inclusion is intentional (ads landing page may not belong in service catalog)

---

### Phase Ordering Rationale

- Infrastructure first (Phase 1) prevents shipping broken pages that need retroactive fixes across 7 URLs
- Overview redesign second (Phase 2) ensures the navigation hub is coherent before sub-pages exist, and forces `services.ts` to be accurate
- Core 3 service pages third (Phase 3) establishes the content benchmark at lower content risk
- Specialist 4 fourth (Phase 4) benefits from Phase 3 learnings on outcome-first framing
- Cross-linking and validation last (Phase 5) because cross-links require all pages to exist and verification is most efficient as a final pass

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 4 (AI page):** Norwegian SMB GDPR sensitivity and AI buyer psychology are nuanced. If content writers are uncertain, a research-phase on Norwegian AI adoption patterns and common SMB objections would improve the page. Schema.org coverage of AI services is also sparse — may need validation against Google's current rich result eligibility.

Phases with standard patterns (skip research-phase):
- **Phase 1:** All infrastructure changes are small, well-understood modifications to existing files. Patterns confirmed by direct codebase analysis.
- **Phase 2:** Service catalog card grid is a standard Astro pattern. Data flows from `services.ts` already designed.
- **Phase 3:** Nettside and landingsside follow the validated `/nettside-for-bedrift` template. Shopify service content framing is well-documented.
- **Phase 5:** Verification tasks only. Google Rich Results Test is free, external, and well-documented.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Direct codebase analysis. No new dependencies needed. All patterns verified working in production. |
| Features | MEDIUM-HIGH | Codebase conversion patterns are HIGH confidence. Norwegian SMB buyer psychology from training data — stable domain. Competitor analysis not possible without live web access. |
| Architecture | HIGH | Direct codebase analysis of all relevant files. Routing, schema, and breadcrumb patterns confirmed. See routing note below. |
| Pitfalls | HIGH | Pitfalls 1, 2, 6, 7, 8 from direct codebase analysis. Pitfalls 3, 4, 5 from domain knowledge — well-established patterns. |

**Overall confidence:** HIGH

### Architecture Routing Note

STACK.md and ARCHITECTURE.md disagree on routing strategy:

- STACK.md recommends individual `index.astro` files per service (7 files, each with its own `_sections/`)
- ARCHITECTURE.md recommends a single `[slug].astro` template with `getStaticPaths()`

Resolution: individual files (STACK.md approach). ARCHITECTURE.md's own analysis acknowledges the template "cannot easily give one service page a radically different layout." FEATURES.md documents that webapp, AI, nettbutikk, and vedlikehold genuinely need different section compositions. The individual file approach also mirrors the existing project patterns (`/nettside-for-bedrift/`, `/kontakt/`, `/prosjekter/`). The `[slug].astro` approach would be correct only if all 7 services shared identical section structure.

ARCHITECTURE.md's recommendation to centralize shared metadata in `services.ts` is still correct — use it for overview cards and CTA links, not to drive section composition.

### Gaps to Address

- **Shopify Partner status:** Unverified. If Nettup is a Shopify Partner, a badge adds significant credibility to the nettbutikk page. If not, frame as "Shopify-spesialister" with completed projects as proof. Verify before writing nettbutikk content.
- **Price range validation:** Research documents price ranges per service (e.g. nettbutikk: 15 000 – 80 000 kr) based on Norwegian agency market training data. Nettup should validate these against actual project history and intended pricing strategy before ranges go live.
- **Social proof gaps:** The iGive testimonial is available for nettside and nettbutikk pages. For AI, webapp, and SEO — no validated social proof exists yet. Plan for placeholder handling or omission of the testimonial section on those pages until proof exists.
- **`/nettside-for-bedrift` sitemap inclusion:** This ads landing page may or may not belong in the service catalog sitemap. Needs an explicit decision before Phase 5 sitemap validation.
- **Shopify platform fee:** Research cites "fra 29 USD/mnd" from training data. Verify current Shopify pricing before publishing this figure on the nettbutikk page.

## Sources

### Primary (HIGH confidence)

- Direct codebase analysis: `src/pages/tjenester/index.astro` — existing JSON-LD slot pattern, schema using exact `price` field
- Direct codebase analysis: `src/layouts/BaseLayout.astro` — breadcrumb auto-generation, `pageLabels` record, `slot="head"` support
- Direct codebase analysis: `src/components/islands/FloatingNav.tsx`, `MobileMenu.tsx` — active state strict equality confirmed
- Direct codebase analysis: `src/pages/kontakt/_sections/ContactForm.tsx` — `?pakke=` allowlist, pre-fill badge logic
- Direct codebase analysis: `src/config/pricing.ts` — existing `Pakke` interface and allowlist values
- Direct codebase analysis: `src/pages/nettside-for-bedrift/` — validated conversion template (reference for all service pages)
- Schema.org: `PriceSpecification` with `minPrice`/`maxPrice` — established standard
- Astro 5 file-based routing for nested directories — core, stable API

### Secondary (MEDIUM confidence)

- Norwegian SMB buyer psychology and language patterns — training data through early 2025; validated against existing codebase copy
- Norwegian agency market pricing ranges — training data; needs validation against Nettup's actual pricing strategy
- Google SEO timeline expectations for Norwegian market — training data; established consensus
- Shopify platform fee (fra 29 USD/mnd) — training data; verify current Shopify pricing before publishing

### Tertiary (LOW confidence)

- Competitor analysis (Norwegian web agency service pages) — no live competitor sites analyzed; findings are pattern-based from training data
- AI adoption patterns in Norwegian SMBs — sparse, rapidly evolving area; treat AI page content as needing validation with target buyers

---
*Research completed: 2026-03-04*
*Ready for roadmap: yes*
