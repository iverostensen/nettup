# Pitfalls Research

**Domain:** Restructuring an existing Astro 5 portfolio page into multi-page case study system
**Project:** Nettup.no v1.4 Portefolje 2.0
**Researched:** 2026-03-07
**Confidence:** HIGH (based on direct codebase analysis + Astro 5 docs + schema.org spec)

---

## Critical Pitfalls

### Pitfall 1: `ProjectShowcase.astro` Breaks When `caseStudySection` Is Removed

**What goes wrong:**
`ProjectShowcase.astro` currently uses `projects.find((p) => p.caseStudySection === true)` to determine which project gets the full "hero" treatment and which get cards. When moving to dedicated sub-pages, the `caseStudySection` flag becomes meaningless — all projects are peers with equal status and link to their own pages. If this flag is removed from `projects.ts` (correct) without simultaneously rewriting `ProjectShowcase.astro` (which depends on it), the prosjekter index renders as empty: `caseStudyProject` is `undefined`, the hero section renders nothing, and `additionalProjects` is every project (none with `caseStudySection: true`).

The section is silently blank, not a build error — easy to miss if only checking `npm run build`.

**Why it happens:**
The current architecture was designed for exactly one featured project. The flag is a discriminator, not a content field. When adding the second project (Blom Company), the temptation is to set `caseStudySection: false` on Blom while keeping `true` on iGive — which preserves the old layout but doesn't scale. The right move is to delete the flag and redesign the section, but that's a bigger scope than it initially appears.

**How to avoid:**
Do the config restructuring and page redesign in a single atomic step. Do not add Blom to `projects.ts` using the old schema without simultaneously replacing `ProjectShowcase.astro`. The phase plan should treat "update projects.ts schema" and "rewrite prosjekter index" as a single task, not two sequential ones.

**Warning signs:**
- The `/prosjekter` page renders with no project hero section after adding a second project
- `npm run build` succeeds but visual inspection shows blank sections
- TypeScript still compiles because `caseStudySection` is `boolean | undefined` in the interface

**Phase to address:**
Phase 1 (config restructuring). Must resolve before any new project content is added.

---

### Pitfall 2: `ProjectTeaser.astro` on the Homepage Has Hardcoded iGive Content

**What goes wrong:**
`src/pages/_home/ProjectTeaser.astro` imports `iGiveImage` directly and hardcodes all iGive content inline — it does not read from `projects.ts` at all. When the portfolio grows to two projects, the homepage teaser still only shows iGive. This is acceptable initially, but it's invisible technical debt: developers assume `projects.ts` is the source of truth for all project display, but this component bypasses it entirely.

More specifically: the `<a href="/prosjekter">` link points to the index, not to `/prosjekter/igive`. Once dedicated pages exist, the homepage teaser should link directly to the iGive case study page — not the index — for a better user journey.

**Why it happens:**
The teaser was built before `projects.ts` existed, or at least before the config was intended to drive homepage content. It was never refactored to use the config because it "worked."

**How to avoid:**
When creating the project sub-pages, also update `ProjectTeaser.astro` to: (1) read from `projects.ts` so the featured project can be changed by config, and (2) link to `/prosjekter/igive` (the direct case study URL) instead of the index. This is a small change but prevents the homepage from becoming stale.

**Warning signs:**
- `projects.ts` has two projects but the homepage still shows one project with a hardcoded link
- `href="/prosjekter"` in the teaser card instead of `href="/prosjekter/igive"`

**Phase to address:**
Phase 1 (config restructuring). Caught at the same time as Pitfall 1 if the team traces all usages of `projects.ts` before restructuring the schema.

---

### Pitfall 3: BreadcrumbList Schema Breaks for New Sub-Routes

**What goes wrong:**
`BaseLayout.astro` auto-generates `BreadcrumbList` JSON-LD using `pageLabels` — a hardcoded `Record<string, string>` mapping paths to human-readable names. `/prosjekter` is in the map. `/prosjekter/igive` and `/prosjekter/blom-company` are not.

For any unlisted path, the label falls back to the raw path segment: `pageLabels[fullPath] ?? seg` returns `"igive"` and `"blom-company"` instead of `"iGive"` and `"Blom Company"`. This is an incorrect breadcrumb that Google will use as-is in rich results: the third breadcrumb item reads "igive" (lowercase, no capital I).

This is NOT a build error. TypeScript compiles fine. The breadcrumb renders correctly visually (if the page has its own breadcrumb UI component) but the structured data is wrong.

**Why it happens:**
The `pageLabels` map was built for a flat site (5 top-level pages). Sub-routes under `/prosjekter/` were not anticipated. The fallback behavior silently degrades quality instead of failing.

**How to avoid:**
Add the new routes to `pageLabels` in `BaseLayout.astro` before the pages go live:
```typescript
'/prosjekter/igive': 'iGive',
'/prosjekter/blom-company': 'Blom Company',
```
This is a one-line change per project, but easy to forget. Include it in the definition-of-done checklist for each new case study page.

**Warning signs:**
- Google Search Console shows breadcrumb rich result with lowercase project slug as the label
- Schema validation at `https://validator.schema.org` shows breadcrumb item name matching the slug instead of the project name

**Phase to address:**
Phase 2 (individual case study pages). Add the `pageLabels` entry when each page is created.

---

### Pitfall 4: CreativeWork Schema Conflicts with Organization Schema IDs

**What goes wrong:**
`BaseLayout.astro` outputs an Organization schema and a LocalBusiness schema with `"@id": "https://nettup.no/#business"`. If a case study page also emits a `CreativeWork` or `WebSite` schema with an `@id` pointing to the same organization (e.g., `"author": {"@id": "https://nettup.no/#business"}`), the IDs must match exactly — not just in value but in `@type`. If the referencing schema uses `"@type": "Organization"` but the declared entity uses `"@type": "LocalBusiness"`, Google may not resolve the reference correctly because `LocalBusiness` is a subtype of `Organization`, not the same type.

More commonly: if a case study page inlines a new Organization node without an `@id` (just `{"@type": "Organization", "name": "Nettup"}`), Google's Knowledge Graph sees two separate Organization entities for the same domain — one with a full description and one anonymous inline. This dilutes entity recognition.

**Why it happens:**
Developers copy the Service schema pattern (which uses `"provider": {"@type": "Organization", "name": "Nettup", "url": "..."}`) into the CreativeWork schema without referencing the `@id`. The tjenester pages use this pattern — it works for Service schemas but is weaker for entity graphs.

**How to avoid:**
For the `creator`/`author` property on CreativeWork schemas, reference the existing entity by `@id`:
```json
"creator": {
  "@id": "https://nettup.no/#business"
}
```
This is the correct approach when the entity is already declared elsewhere in the page (via BaseLayout). No need to re-declare the Organization fields. This is what Google's documentation calls "entity referencing."

Do NOT declare a new `@id` for the Organization on the case study page. The LocalBusiness `@id` in BaseLayout is the canonical entity identifier.

**Warning signs:**
- Schema validator shows "Warning: duplicate entity for domain"
- Google Search Console shows Organization entity but with incomplete data (because the inline copy is being used instead of the full BaseLayout declaration)

**Phase to address:**
Phase 2 (CreativeWork structured data). Define the schema template before building the first case study page.

---

### Pitfall 5: Building Pages That Depend on Screenshots Before Screenshots Exist

**What goes wrong:**
Case study pages need hero screenshots, detail screenshots, and possibly mobile screenshots. If the page is built with real `<Image>` components referencing `@/assets/images/blom-company-hero.png` before that file exists, `npm run build` fails with: `ENOENT: no such file or directory`. Development builds fail too. The page is completely unusable until the asset exists.

Unlike content (which can be placeholder text), images are hard dependencies in Astro's build pipeline — the `Image` component processes them at build time, not runtime.

**Why it happens:**
Developers start building the component layout with the final image path in mind, planning to add the actual screenshot "later." In a waterfall workflow this is fine — visuals arrive before shipping. But in an iterative workflow where you want to commit, deploy, and review in production, you're blocked until the screenshots arrive.

**How to avoid:**
Separate the page architecture from the visual assets. Build the page with a placeholder pattern: an `image?: ImageMetadata` field in the project config, with a conditional render — if `image` is undefined, render a placeholder div with the correct aspect ratio and a "Skjermbilde kommer" label. This allows:
1. Full page deployed and indexed before screenshots are captured
2. Screenshot slot clearly visible in staging review
3. Zero rebuild errors

For the Blom Company page specifically: staging screenshots from `blom-no.vercel.app` are available per the brief. Capture them before the page build phase begins. This is a content prerequisite, not a code task.

**Warning signs:**
- `@/assets/images/blom-company-hero.png` referenced in code before the file is in `src/assets/images/`
- `npm run dev` shows `Failed to load resource` for a project image
- `npm run build` fails with `ENOENT` on any image import

**Phase to address:**
Phase 0 / prerequisites. Capture and commit all required screenshots before building individual case study pages. Document required screenshots as a pre-task.

---

### Pitfall 6: Meta Description Length Violations on Case Study Pages

**What goes wrong:**
Meta descriptions over ~155 characters get truncated in Google SERPs. For Norwegian, this is stricter in practice because Norwegian words average longer than English. A description like "Vi bygget en headless Shopify-nettbutikk for Blom Company — et norsk golf- og streetwear-merke med Scandinavisk premium-posisjonering — med Next.js 15, Sanity CMS og Tailwind CSS 4." is 183 characters and will be truncated to "Vi bygget en headless Shopify-nettbutikk for Blom Company — et norsk golf- og streetwear-merke med Scandinavisk premium-posisjonering…"

More specifically for this site: descriptions that read well as case study summaries tend to be too long. Developers write them as prose ("what we built, for whom, why it mattered") when Google needs them short and scannable.

**Why it happens:**
Case study content is narrative. The natural summary of a project is a paragraph, not a 150-character pitch. Developers copy-edit the description without checking pixel width or character count.

**How to avoid:**
Formula for portfolio page meta descriptions: `[Client] — [one-line outcome]. [One specific differentiator]. [Under 155 characters total.]`

Example: "Blom Company nettbutikk — headless Shopify med Next.js 15 og Sanity CMS. Fullt tilpasset design for golf- og streetwear-merket." (128 characters).

Add character count validation to the `Project` interface as a comment, and verify against Google's Rich Results Test before each case study page goes live.

**Warning signs:**
- Description field in `projects.ts` or in the page frontmatter exceeds 155 characters
- Google Search Console shows "Description too long" in page experience signals
- SERP preview tools show truncation with `…` mid-sentence

**Phase to address:**
Phase 2 (individual case study pages). Check length at authoring time, not after deployment.

---

### Pitfall 7: Slug Naming Inconsistency Between URL and Config ID

**What goes wrong:**
The `Project` interface has an `id` field (`'igive'`). When creating sub-pages, the URL slug must match the page file location: `src/pages/prosjekter/igive/index.astro` → `/prosjekter/igive`. If the config `id` is `'igive'` but the slug used in links, OpenGraph URLs, and structured data is `'i-give'` or `'igive-gavekort'`, the canonical URL in schema.org and in `<link rel="canonical">` will mismatch.

For Blom Company: the brief names it "blom-company" but the brand name is "Blom Company" (two words). A slug of `blom` is too short (ambiguous), `blomcompany` misses the hyphen, `blom-company` is correct. The `id` in `projects.ts` must equal the URL slug exactly — no discrepancy.

**Why it happens:**
The `id` field was used as an internal identifier, not as a routing key. The connection between `id` and URL slug is implicit, not enforced by TypeScript. It's easy for the page file location to drift from the config id.

**How to avoid:**
Rename the `id` field to `slug` in the `Project` interface. This makes the routing intent explicit. Use the slug field to construct all internal links (from the index page to the case study page): `href={`/prosjekter/${project.slug}`}`. This way there is one source of truth for the URL structure.

**Warning signs:**
- `href="/prosjekter/igive"` hardcoded in the index page instead of derived from `project.slug`
- `@id` in CreativeWork schema uses a different URL than the page's canonical href
- `sitemap.xml` shows `/prosjekter/igive` but the config `id` is `'i-give'`

**Phase to address:**
Phase 1 (config restructuring). Change `id` to `slug` when redesigning the `Project` interface.

---

### Pitfall 8: Internal Linking From Other Pages Is Forgotten

**What goes wrong:**
The `/tjenester/nettbutikk` page describes Shopify development. After building the Blom Company case study (a headless Shopify project), there is no link from `/tjenester/nettbutikk` to `/prosjekter/blom-company`. Similarly, the `/tjenester/nettside` page could reference iGive as a proof point. These internal links are high-value for both SEO (passes authority from established tjenester pages to new portfolio pages) and for conversion (prospects reading about a service see real proof).

This pitfall is invisible at build time — the pages build and deploy correctly. The SEO value is simply never realized.

**Why it happens:**
Case study pages are built in isolation. Developers complete the portfolio section and close the milestone without auditing cross-links from the rest of the site. The connection between service pages and portfolio pages is conceptual, not structural.

**How to avoid:**
Add an explicit task to the milestone: after all case study pages are built, do a cross-linking audit. For each project, identify which service page(s) it exemplifies and add a "Se eksempel: [Client]" link or a "Se relaterte prosjekter" section. This is a content task, not a code task — 15 minutes of editing, but it must be scheduled.

For the homepage `ProjectTeaser.astro`: once both projects exist, decide whether the teaser should show two cards or continue to feature one. Either is fine, but the decision should be conscious.

**Warning signs:**
- `/tjenester/nettbutikk` has no link to `/prosjekter/blom-company` after the portfolio launch
- `/prosjekter` index page is the only internal link pointing to case study pages (no lateral links from service pages)
- Google Search Console shows case study pages with low internal PageRank relative to tjenester pages

**Phase to address:**
Phase 3 (cross-linking and internal SEO pass). Scheduled explicitly as a task after page content is complete.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keep `caseStudySection: true` on iGive and add Blom with `caseStudySection: false` | No need to rewrite ProjectShowcase.astro | Third project breaks the layout; iGive is always "featured" by accident | Never — restructure the schema properly in Phase 1 |
| Hardcode case study content in `.astro` files instead of `projects.ts` | Easier to write rich markup | Adding a third project requires copying and editing an entire page file | Acceptable if each project is structurally unique; risky if content is mostly parallel |
| Build case study pages before capturing screenshots | Start building immediately | Build fails if image is imported but file is missing; cannot deploy to staging | Never — resolve screenshot dependency before writing image imports |
| Use inline Organization node in CreativeWork schema instead of `@id` reference | Copy-paste from Service schema pattern | Duplicate entity declarations; weaker entity association in Google's Knowledge Graph | Never — use `@id` reference to the existing LocalBusiness entity |
| Skip `pageLabels` update for new sub-routes | Save one line of config | BreadcrumbList schema shows raw slugs as labels in rich results | Never — two lines per project, must be done |
| Write meta description as narrative prose without character count check | Reads naturally | Truncated in SERPs; last clause cut off looks unprofessional | Never — check character count at authoring time |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Astro `<Image>` component | Importing an image path that doesn't exist yet | Keep image field optional in Project interface; render placeholder div when `image` is undefined |
| BaseLayout BreadcrumbList | Not adding new sub-routes to `pageLabels` | Add `/prosjekter/igive: 'iGive'` etc. to the map when creating each page |
| schema.org CreativeWork | Inlining Organization node instead of referencing by `@id` | Use `"creator": {"@id": "https://nettup.no/#business"}` — the `@id` declared in BaseLayout is the canonical entity |
| `@astrojs/sitemap` | Assuming sub-pages auto-appear in sitemap | They do — but only if the static build generates them. Verify `sitemap-index.xml` after first deploy includes `/prosjekter/igive` |
| Astro `<ClientRouter>` transitions | Scroll reveal observer fires on mount but case study page images haven't lazy-loaded | The `reveal-on-scroll` pattern in BaseLayout uses `astro:page-load` event — verify this fires correctly on sub-page navigation |
| Vercel OG image path | Using page-specific OG image path in `BaseLayout` `image` prop | `BaseLayout` accepts `image?: string` — pass a project-specific OG image path or ensure the fallback `/images/og-image.jpg` works acceptably for portfolio pages |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Multiple full-size screenshots per case study without Astro image optimization | Page weight > 2MB; LCP degrades below 2s threshold | Always use `<Image>` component, not raw `<img>`; set `width` to display size (not original), `quality={85}` | Immediately — even one unoptimized 1MB screenshot hurts mobile LCP |
| Loading all case study screenshots on the `/prosjekter` index grid | Index page makes 6-8 image requests for thumbnails | Use `loading="lazy"` on all card images; `loading="eager"` only for the above-the-fold first card | Any portfolio with 3+ projects |
| Video embeds (e.g., Blom Company drone video section) added to case study without facade | Third-party video embed loads full player JS on page load; kills LCP | Use `loading="lazy"` iframe or a click-to-play facade pattern | Immediately if embed is above the fold |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Case study pages with no CTA connecting back to the funnel | Prospect reads iGive case study and has no obvious next step | Add a contextual CTA at the bottom: "Vil du ha noe lignende? Ta kontakt." with a link to `/kontakt?tjeneste=nettside` pre-fill |
| `/prosjekter` index that lists projects but has no differentiation between them | Prospect can't quickly understand which client/project is most relevant to their situation | Show category badge and one-line outcome on each card (already in the `tagline` field) — use it |
| Placeholder testimonials still showing when real Blom testimonial is available | Reduces credibility of the entire portfolio section | The Blom brief includes a real testimonial. Use it for the Blom case study immediately instead of deferring all testimonials |
| Case study page with only a hero screenshot and no detail/mobile views | Single screenshot doesn't demonstrate responsive design capability | Plan for 2-3 screenshots per project minimum: desktop hero, mobile view or detail shot |

---

## GEO (Generative Engine Optimization) Pitfalls

AI assistants (ChatGPT, Perplexity, Claude, Google SGE) pull citations from structured, confident, specific content. These are the traps specific to getting portfolio pages cited.

### Over-Optimization Trap: Keyword-Stuffed Case Study Copy

**What goes wrong:**
Writing copy like "Nettup er det beste webbyrået i Oslo for headless Shopify-utvikling og Next.js-nettsider for norske bedrifter" — a sentence that reads like it was written for a crawler. AI assistants are specifically tuned to ignore marketing-speak and promotional language. They prefer neutral, factual statements that could appear in a Wikipedia article or a technical review.

The Blom brief is already written correctly: "Clean, fast, no unnecessary noise." That tone is citable. "We are Norway's leading agency for X" is not.

**How to avoid:**
Write case study copy as if explaining the project to a peer developer, not selling it to a client. State facts: what was built, with what technology, what specific problem it solved, what the measured outcome was. Numbers and specific technical details are highly citable ("Mobile Performance: 75, Desktop: 98"). Vague superlatives are not.

**Phase to address:**
Phase 2 (copy writing for individual case study pages).

---

### Over-Optimization Trap: FAQPage Schema on Every Case Study Page

**What goes wrong:**
Adding `FAQPage` JSON-LD to case study pages with questions like "Hva er headless Shopify?" — generic questions not specific to the case study. AI assistants are beginning to penalize sites that spray FAQPage schemas across content where the FAQ is clearly fabricated for SEO purposes rather than genuinely answering user questions. Google has also deprecated rich result eligibility for FAQPage on most sites (only high-authority sites qualify).

**How to avoid:**
Do NOT add `FAQPage` schema to case study pages. Use `CreativeWork` or `WebSite` schema to describe the project. If a genuine FAQ is needed (e.g., "Kan jeg bestille en lignende side?"), add it as an inline visible Q&A section, not as a JSON-LD schema block.

**Phase to address:**
Phase 2 (structured data design). Decide schema types before building pages — CreativeWork for the deliverable, no FAQPage.

---

### Over-Optimization Trap: Fake or Inflated Metrics

**What goes wrong:**
Writing "Lighthouse score: 100/100 performance" when the actual score is 95 (iGive) or 75 mobile (Blom Company). AI assistants that verify claims against other sources will flag inconsistencies. Once an inconsistency is found, the entire page's credibility drops. The existing `Results.astro` on the prosjekter page already shows "95" for iGive — this is fine and honest.

For Blom Company: the brief is explicit that mobile is 75 dragged by hero image LCP. Use the real numbers. "Desktop performance: 98. Mobile: 75 (hero image LCP 6.6s — re-measuring after production launch)" is more credible than a rounded-up "98" everywhere.

**How to avoid:**
Only publish metrics you have measured and can reproduce. Stage the Blom case study page with "Lighthouse-resultater oppdateres etter lansering" if production numbers aren't available yet. Use staging numbers (explicitly labeled) in the interim — the brief already does this correctly.

**Phase to address:**
Phase 2 (content for Blom case study page). Resolve before the page goes live with metrics shown.

---

## "Looks Done But Isn't" Checklist

- [ ] **`pageLabels` updated:** Both `/prosjekter/igive` and `/prosjekter/blom-company` added to the map in `BaseLayout.astro` — verify BreadcrumbList schema at `https://validator.schema.org` shows correct human-readable labels
- [ ] **`ProjectTeaser.astro` links to sub-page:** `href` in the homepage teaser card points to `/prosjekter/igive`, not `/prosjekter`
- [ ] **Screenshots committed before Image import:** Run `npm run dev` from a clean state — no `Failed to load resource` errors for project images
- [ ] **`npm run build` passes with all new pages:** Static build succeeds; all new routes appear in build output
- [ ] **Sitemap includes sub-pages:** After first deploy, `https://nettup.no/sitemap-index.xml` includes `/prosjekter/igive` and `/prosjekter/blom-company`
- [ ] **CreativeWork schema uses `@id` reference:** Schema validator shows no duplicate Organization entities — project page references `https://nettup.no/#business` by ID, not re-declaring
- [ ] **Meta descriptions are < 155 characters:** Character count checked for every new page — not just the index
- [ ] **Blom testimonial is real, not placeholder:** The `nettup-case-study-brief.md` provides a real quote — it should be used, not a placeholder
- [ ] **Cross-links from tjenester pages:** `/tjenester/nettbutikk` links to the Blom case study; at minimum a "Se et eksempel" link exists
- [ ] **`caseStudySection` flag removed from schema:** TypeScript interface does not contain `caseStudySection` after migration — search codebase to confirm no remnants
- [ ] **iGive Results metrics still accurate:** `Results.astro` hardcodes "95", "<1s", "100" for iGive — confirm these match the current live Lighthouse scores before expanding portfolio attention to the page

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| ProjectShowcase blank after config change (Pitfall 1) | MEDIUM | Rewrite ProjectShowcase.astro to use slug-based card grid instead of caseStudySection discriminator; delete caseStudySection from interface |
| ProjectTeaser still hardcoded (Pitfall 2) | LOW | Update ProjectTeaser.astro to read from projects.ts and link to slug-based URL |
| BreadcrumbList shows slugs in schema (Pitfall 3) | LOW | Add two lines to pageLabels in BaseLayout.astro; redeploy |
| Duplicate Organization entity in structured data (Pitfall 4) | LOW | Replace inline Organization node with @id reference in CreativeWork schema; redeploy |
| Build fails on missing screenshot (Pitfall 5) | LOW | Add the missing image file to src/assets/images/; or make the image field optional with conditional render |
| Meta description truncated in SERPs (Pitfall 6) | LOW | Edit description in page props; redeploy |
| Slug mismatch between config and URL (Pitfall 7) | MEDIUM | Rename id to slug in Project interface; update all usages; add 301 redirect if page was already indexed |
| No internal links from tjenester pages (Pitfall 8) | LOW | Edit tjenester sub-pages to add case study references; one line per relevant tjeneste page |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| ProjectShowcase breaks on config change (1) | Phase 1: Config restructuring | `npm run dev` shows project grid on /prosjekter with both projects as peer cards |
| ProjectTeaser hardcoded (2) | Phase 1: Config restructuring | Homepage teaser `href` derives from `project.slug`, not hardcoded |
| BreadcrumbList raw slugs (3) | Phase 2: Each case study page | Schema validator confirms human-readable breadcrumb labels |
| Duplicate Organization entity (4) | Phase 2: Structured data design | Schema validator shows one Organization entity per page |
| Missing screenshots block build (5) | Phase 0: Prerequisites | Screenshots committed; `npm run build` passes clean before page work begins |
| Meta description too long (6) | Phase 2: Each case study page | Character count < 155 for every new page description |
| Slug/ID mismatch (7) | Phase 1: Config restructuring | All internal links use `project.slug` field; no hardcoded paths |
| No cross-links from tjenester (8) | Phase 3: Cross-linking audit | `/tjenester/nettbutikk` contains link to Blom case study after Phase 3 |
| GEO over-optimization traps | Phase 2: Copy writing | Case study copy reads as factual technical description, not promotional; no FAQPage schema on portfolio pages |

---

## Sources

- Codebase: `src/pages/prosjekter/_sections/ProjectShowcase.astro` — confirmed `caseStudySection` discriminator pattern
- Codebase: `src/pages/_home/ProjectTeaser.astro` — confirmed hardcoded iGive content, no projects.ts usage
- Codebase: `src/layouts/BaseLayout.astro` — confirmed `pageLabels` map and BreadcrumbList fallback behavior
- Codebase: `src/config/projects.ts` — confirmed current interface shape and `caseStudySection: true` on iGive
- Codebase: `src/pages/tjenester/nettside/index.astro` — confirmed Service schema pattern (inline Organization, not @id reference)
- Codebase: `nettup-case-study-brief.md` — Blom Company data: real testimonial available, mobile LCP caveat, staging screenshots on blom-no.vercel.app
- schema.org CreativeWork spec: https://schema.org/CreativeWork — `creator` property accepts @id references
- schema.org identifier spec: https://schema.org/identifier — entity referencing via @id
- Google Structured Data docs: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb — BreadcrumbList item name must be human-readable, not raw URL segment
- Google FAQPage deprecation: https://developers.google.com/search/blog/2023/08/howto-faq-changes — FAQPage rich results deprecated for most sites (August 2023)
- Astro Image component: https://docs.astro.build/en/guides/images/ — image processed at build time; missing file = build failure

---
*Pitfalls research for: Portfolio 2.0 multi-page case study system on existing Astro 5 site (v1.4)*
*Researched: 2026-03-07*
