# Pitfalls Research

**Domain:** Local SEO landing pages — adding city/location pages to an existing agency site
**Project:** Nettup.no v1.5 Lokale SEO-sider
**Researched:** 2026-03-08
**Confidence:** HIGH (Google official spam policies + multiple verified sources + Astro-specific technical checks)

---

## Critical Pitfalls

### Pitfall 1: Triggering the Doorway Page Penalty With Swapped-City Boilerplate

**What goes wrong:**
Google's spam policies define doorway abuse as pages "created to rank for specific, similar search queries" that "lead users to intermediate pages that are not as useful as the final destination." City landing pages are the canonical example Google uses in their own documentation: "multiple domain names or pages targeted at specific regions or cities that funnel users to one page."

If every location page uses the same template with only the city name swapped — identical intro, identical FAQ, identical CTA — Google's pattern detection flags the cluster. The March 2024 Core Update and the August 2025 spam update both showed aggressive enforcement against this pattern. A regional HVAC site lost 80% of doorway-page rankings within 30 days of the March 2024 update.

**Why it happens:**
The temptation is to build a Handlebars-style template: `Vi leverer nettsider i {{by}}.` and push 50 cities through it. It ships fast, but the pages are functionally identical from Google's perspective.

**How to avoid:**
Each V1 city page (Oslo, Drammen, Asker, Bærum, Lillestrøm, Sandvika, Ski, Moss) must have genuinely differentiated copy. Concrete signals that differentiate a legitimate location page from a doorway page:
- Unique intro paragraph that names real local context (industry, local landmarks, competitor landscape)
- City-specific FAQ questions that reflect what businesses in that area actually ask
- At least one local proof point (client reference, mention of local area served)
- The page should be "an integral part of the site's user experience" — linked from navigation, footer, and contact page — not orphaned

For V2/V3, use AI-assisted generation with a per-city data model (population, regional industries, nearby municipalities) that forces meaningful variation. Do not batch-generate without human review of each batch.

**Warning signs:**
- Two city pages have near-identical `<p>` text with only the city name changed
- City pages are not linked from any navigation element (orphan pages)
- The page's `<h1>` and intro contain the city name 3+ times in the first 100 words
- Google Search Console shows impressions but zero clicks on city pages after 4+ weeks indexed

**Phase to address:**
V1 (hand-crafted pages) — enforce differentiation at authoring time. V2 — define the data model in `locations.ts` to force per-city unique fields before generating any content.

---

### Pitfall 2: Thin Content on City Pages — Failing Google's Helpful Content Threshold

**What goes wrong:**
Thin content for local pages is not purely a word count problem (Google has repeatedly stated word count is not a ranking factor). The real threshold is whether the page "answers the user's question based on their location, need, or search pattern." A 600-word page that only restates generic service descriptions with the city name inserted is thin. A 300-word page with a specific client reference, a local FAQ, and a contact form may not be.

For agency local pages, the specific risk is that pages answer the implicit query ("webdesign [by]") but contain no information a user couldn't get from any other web design agency page. Google's helpful content system penalizes this at the site level — not just the individual page — which means thin V2/V3 pages can drag down the ranking of well-crafted V1 pages.

**Why it happens:**
Agencies know their service offering doesn't change city to city. The honest answer is "we do the same work in Oslo and in Moss." The mistake is letting that bleed into the copy.

**How to avoid:**
Define a minimum content spec per city page in `locations.ts`. Required fields that force differentiation:
- `intro`: 2-3 sentences specific to that city's business environment (min 80 words)
- `faq`: minimum 3 Q&A pairs, at least 2 must be city-specific (not generic service FAQ)
- `nearbyAreas`: surrounding municipalities — adds geographic relevance without boilerplate
- `regionalIndustries`: 2-3 dominant business sectors in that municipality — supports industry-specific framing

Do not publish a V2/V3 city page if the `intro` field is a city-name swap of another page's intro. Add a lint step or pre-publish checklist that checks field length thresholds.

**Warning signs:**
- `locations.ts` has a city entry where `intro` is under 60 words
- `faq` entries are identical across more than 2 cities
- A city page's unique word percentage (comparing to other city pages via diffing) is below 40%
- Google Search Console shows city pages in "Crawled, not indexed" status persistently

**Phase to address:**
V1 — define the content spec upfront. V2 — add a data quality check before generating content. V3 — automate uniqueness validation (diff against existing pages) as a pre-publish gate.

---

### Pitfall 3: Duplicate Content Across City Pages — Wrong Use of Canonical and noindex

**What goes wrong:**
Two distinct failure modes:

**Mode A — Canonical collision:** If canonical tags on city pages point to each other (or to the service index page at `/tjenester`), Google consolidates them into one URL. The other city pages become invisible in search. This happens when developers add a blanket `canonical` to the location template pointing to the "main" version.

**Mode B — noindex + canonical conflict:** Some developers add both `<meta name="robots" content="noindex">` and a `<link rel="canonical">` on thin city pages as a hedge. Google's official guidance: these signals directly contradict each other ("don't index this" vs. "index the canonical version"). In worst case Google ignores both. Never apply both simultaneously.

The correct model: each city page is its own canonical URL. Set `<link rel="canonical" href="https://nettup.no/[city-slug]">` pointing to itself. No `noindex`. Pages that are genuinely too thin to index should either be improved or not published.

**Why it happens:**
Developers copy a generic `BaseLayout.astro` pattern without realizing the `canonical` prop defaults to the current URL only if explicitly passed. In Astro, if the canonical tag is conditionally generated and a prop is forgotten, it may default to a wrong URL.

**How to avoid:**
In `[location].astro`, always explicitly pass the canonical URL derived from the page slug:
```astro
<BaseLayout canonical={`https://nettup.no/${location.slug}`} />
```
Never let canonical default to a catch-all. Add a build-time assertion or post-build audit that checks every city page's canonical URL equals its own URL.

For near-duplicate pages where content quality is borderline, the correct answer is to improve content — not to noindex or canonicalize away. Google's documentation explicitly states: "Google doesn't recommend using noindex to prevent selection of a canonical page within a single site."

**Warning signs:**
- Two city pages have the same `<link rel="canonical">` value in the rendered HTML
- Google Search Console shows "Duplicate, Google chose different canonical than user" for city pages
- `<meta name="robots" content="noindex">` appears on any city page that also has a canonical pointing elsewhere
- Screaming Frog or similar crawl tool shows canonical chains (A → B → A) between city pages

**Phase to address:**
V1 — establish the canonical pattern correctly in `[location].astro` before the first deploy. Verify with a post-build HTML check on the rendered output.

---

### Pitfall 4: Schema Errors on LocalBusiness areaServed

**What goes wrong:**
Four common errors in this specific context:

**Error 1 — areaServed typed as a string instead of a Place object:** Using `"areaServed": "Oslo"` is technically valid per schema.org but weaker than using a typed `Place` entity. Google's implementation prefers `{"@type": "City", "name": "Oslo"}` or `{"@type": "AdministrativeArea", "name": "Akershus"}`.

**Error 2 — Conflicting address + areaServed signals:** Google's structured data validator has a known discrepancy: schema.org allows `areaServed` without a physical `address`, but Google's Rich Results Test requires an `address` field. For a service-area business like Nettup (no physical storefront), the correct approach is to include the physical address (or a PO Box / registered address) even if the business is service-area-only. Omitting `address` causes a validation warning.

**Error 3 — Per-page LocalBusiness declarations that conflict with BaseLayout:** If `BaseLayout.astro` already declares a `LocalBusiness` schema with `"@id": "https://nettup.no/#business"` and a city page re-declares a new `LocalBusiness` with a different `@id` or no `@id`, Google sees two separate business entities. This dilutes the Knowledge Graph entity for Nettup.

**Error 4 — areaServed array not updated as cities scale:** The root `LocalBusiness` schema in `BaseLayout.astro` may have a hardcoded or empty `areaServed`. As cities are added to `locations.ts`, the `areaServed` on the root schema should be dynamically derived from the config — not manually maintained.

**How to avoid:**
- For each city page, emit a minimal schema that references the root entity by `@id` rather than re-declaring the full LocalBusiness:
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "provider": { "@id": "https://nettup.no/#business" },
  "areaServed": { "@type": "City", "name": "Oslo" },
  "name": "Webdesign i Oslo"
}
```
- Keep the full `LocalBusiness` declaration exclusively in `BaseLayout.astro`
- Drive `areaServed` on the root `LocalBusiness` from `locations.ts` at build time so it stays in sync
- Validate every new page through `https://validator.schema.org` and Google's Rich Results Test before publishing

**Warning signs:**
- Rich Results Test shows "Missing field: address" on any city page
- Schema validator at `schema.org/validator` shows two `LocalBusiness` entities for the same domain
- `areaServed` in `BaseLayout.astro` is a hardcoded list that doesn't match `locations.ts`
- City pages have `"@type": "LocalBusiness"` in their own JSON-LD rather than a `@id` reference

**Phase to address:**
V1 — design the schema architecture before building pages. The `LocalBusiness` + `Service` + `@id` referencing pattern must be established in Phase 1 and reused for all subsequent cities.

---

### Pitfall 5: Premature Scaling — Publishing V3 Pages Before V1 and V2 Signal Quality

**What goes wrong:**
Scaling to 300+ pages before the V1 pages have established quality signals causes two problems:

**Problem A — Site-level thin content penalty:** Google's helpful content system evaluates the site holistically. If a large proportion of pages are thin (V3 coverage of Leirfjord, Tvedestrand, and Åmot with 200-word stubs), the entire site's ranking can be suppressed — including the core service pages and the blog. The August 2025 spam update showed this cross-page contamination in multiple documented cases.

**Problem B — Index budget dilution:** A new subdomain or a site with 8 pages suddenly publishing 300 new pages in one sprint confuses Google's crawl budget allocation. Pages may not be indexed for weeks. Importantly, Nettup.no is not a high-authority domain — crawl budget matters.

The documented case study: a site scaled from 300 to 22,000 AI-generated pages in a few months, without human review, and lost all rankings. The pages were removed but recovery was not confirmed.

**Why it happens:**
The V3 architecture is already built into the dynamic route. Once `[location].astro` and `getStaticPaths()` work, it's technically trivial to add 300 entries to `locations.ts` and deploy. The technical ease creates a false sense that the content is "ready."

**How to avoid:**
Enforce a staged publication gate:
- **V1 (6-8 cities):** Hand-written. Ship. Monitor for 6-8 weeks. Check Google Search Console for indexing status, click-through rate, and "Crawled, not indexed" signals.
- **V2 (30-50 cities):** Only start when V1 pages show indexing confirmation (not just "Discovered") and at least some organic impressions. Use `locations.ts` quality fields to enforce differentiation before batch-generating.
- **V3 (300+):** Only when V2 shows healthy click-through rates and no site-level suppression signals. Publish in batches of 30-50 per sprint, not all at once.

Add a `tier` field to `locations.ts` (`'V1' | 'V2' | 'V3'`) and only include locations where `tier` matches the current release phase in `getStaticPaths()`.

**Warning signs:**
- V1 pages are in "Discovered, not indexed" in Search Console after 4+ weeks
- V1 pages have impressions but 0 clicks (signals content isn't satisfying intent)
- Temptation to "just add the remaining cities since the code is ready" before V1 shows results
- `locations.ts` has 50+ entries before V1 has been live for more than 2 weeks

**Phase to address:**
V1 — build the tier gate into `getStaticPaths()` from day one. V2 — define promotion criteria (concrete metrics) before starting V2 content. V3 — treat as a separate milestone with its own research and quality threshold.

---

### Pitfall 6: Broken Sitemap Coverage for Dynamically Generated City Pages

**What goes wrong:**
`@astrojs/sitemap` works correctly for static-build dynamic routes (i.e., `getStaticPaths()` in static mode). However, there are two known failure conditions:

**Condition A — SSR mode:** If any page in the project uses `output: 'server'` or `output: 'hybrid'` Astro config, the sitemap integration cannot enumerate dynamic routes. Nettup uses Vercel hybrid mode for the `/api/chat` endpoint. If this changes how `[location].astro` is processed, city pages may not appear in the sitemap. This was a documented regression in `@astrojs/sitemap` 1.3.0 (GitHub issue #7015).

**Condition B — `site` config not set:** The sitemap integration requires `site` in `astro.config.mjs` to be set to `https://nettup.no` (including protocol). Without it, sitemap entries may have relative URLs that Google rejects.

**How to avoid:**
- After the first V1 deploy, immediately verify `https://nettup.no/sitemap-index.xml` lists all city pages
- Cross-check `sitemap.xml` entries count against the number of entries in `locations.ts` filtered to the active tier
- Confirm `site: 'https://nettup.no'` is set in `astro.config.mjs`
- If city pages are missing from the sitemap, add a custom sitemap endpoint (`src/pages/sitemap-locations.xml.ts`) that programmatically generates location entries from `locations.ts`

**Warning signs:**
- `sitemap.xml` line count is lower than `locations.ts` active entry count after deploy
- Google Search Console's "Submitted but not indexed" report shows city URLs that are in the sitemap
- `/api/chat` route appearing in the sitemap (signals sitemap enumeration may be misconfigured)

**Phase to address:**
V1 — verify sitemap coverage immediately after first deploy, before any additional cities are added.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Reuse identical intro template with only city name swapped for V2/V3 | Fast content generation | Doorway page pattern — Google flags the cluster, may penalize entire site | Never — use per-city unique fields in the data model |
| Keep `areaServed` as a static string in BaseLayout instead of deriving from `locations.ts` | Simpler initial implementation | `areaServed` on root schema goes stale when new cities are added | Only acceptable for V1 if a TODO comment marks it for refactoring before V2 |
| Publish all 300 V3 cities at once when the `[location].astro` template is ready | Single deploy, minimal ops overhead | Index budget dilution, thin content penalty risk at site level | Never — phased rollout with quality gates is non-negotiable |
| Use `noindex` on thin city pages to "hide" them temporarily | Prevents penalization of bad pages | `noindex` pages don't count toward topical authority; fix or don't publish | Never — if the page isn't ready to index, it isn't ready to publish |
| Skip Google Rich Results Test for V2+ cities ("template was validated for V1") | Save time on validation | Schema errors propagate to all new cities; `areaServed` type errors uncaught | Never — validate at least one page per batch |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `@astrojs/sitemap` + Vercel hybrid | Assuming hybrid mode doesn't affect static route enumeration | Verify city pages appear in sitemap after first hybrid-mode deploy; add custom sitemap endpoint if missing |
| `BaseLayout.astro` canonical | Forgetting to pass explicit canonical to `[location].astro` | Always pass `canonical={`https://nettup.no/${location.slug}`}` explicitly — never let it default |
| `LocalBusiness` JSON-LD in `BaseLayout` | `areaServed` hardcoded while `locations.ts` grows independently | Drive `areaServed` array from `locations.ts` at build time using `import.meta.glob` or direct import |
| Google Search Console | Submitting the sitemap but never checking "Discovered, not indexed" vs "Indexed" status | Check coverage report 2 weeks after V1 deploy — "Crawled, not indexed" on multiple city pages is an early warning sign |
| schema.org Rich Results Test | Testing only the V1 template once | Re-test when adding new city data to `locations.ts` — field values may cause validation errors the template didn't expose |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 300 city pages each including large Framer Motion bundle | First load of any city page triggers full React hydration | City pages should be pure Astro (no React islands unless contact form is embedded); defer hydration | Immediately at V3 scale — 300 static pages with React hydration overhead hurts LCP across the board |
| Sitemap grows to include all 300+ city pages in a single XML file | No direct user symptoms; Google may deprioritize parsing | Keep sitemap under 50,000 URLs; consider splitting by tier (sitemap-v1.xml, sitemap-v2.xml) if approaching limits | At V3 with 300+ pages, approaching sitemap size limits |
| `locations.ts` loaded entirely on every city page build | Slow build times at V3 scale | The config is imported at build time by `getStaticPaths()` — this is fine. But do not load the entire config on the client side | No user impact; build time degrades beyond ~500 entries |

---

## Security Mistakes

Not applicable to this domain — local SEO pages are static content with no authentication surface. Standard site security inherited from existing Nettup.no setup applies.

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| City page has no contact CTA or links to service pages | User confirms Nettup covers their city but has no next step | Every city page must end with a contact CTA pre-filled with the city context: `/kontakt?by=oslo` or similar |
| City pages are orphaned from navigation | Google treats them as low-authority; users can't browse to them | Link all active city pages from the footer "Tjenesteområder" section and from the `/kontakt` page |
| Listing 300 cities in the footer when V3 ships | Footer becomes cluttered; pages load excessive HTML | Group by region (Østlandet, Vestlandet, etc.) or show only top-tier cities in footer with a "Se alle steder" page |
| City page claims to serve a city with no local proof | Undermines credibility — users in that city can tell if copy is generic | For V1/V2 cities, include at least one local-specific reference; for V3 cities where proof is absent, be explicit that service is available nationwide |

---

## Norway-Specific Pitfalls

### hreflang — Not Needed, But Watch the Edge Case

Nettup.no is single-language Norwegian (Bokmål). hreflang tags are irrelevant for a monolingual site with no regional language variants. Do not add them.

One edge case: if blog articles are ever translated to English for GEO purposes, hreflang becomes relevant. As of v1.5 this is out of scope, but adding hreflang for `nb` on Norwegian city pages without a corresponding `en` page will produce orphaned hreflang references that Search Console flags as errors. The safe rule: if no bilingual structure exists, use no hreflang tags.

### nb-NO vs. no Language Code

The site's `<html lang>` attribute should be `lang="nb"` (Bokmål) not `lang="no"` (generic Norwegian). Google recognizes both, but `nb` is more specific. Ensure `BaseLayout.astro` uses `lang="nb"` consistently on city pages. Mixed signals (some pages `no`, some `nb`) create unnecessary ambiguity.

### Norwegian Municipality Name Collisions

Several Norwegian municipalities share similar names or have names that differ from common usage. Examples relevant to the target city list:
- "Bærum" and "Bærum kommune" — use the municipality-branded name, not "Barum" (wrong), not "Bærum kommune" (overly formal)
- "Lillestrøm" became a municipality name in 2020 (merger of Skedsmo, Sørum, Fet). Some residents still use "Skedsmo" or "Kjeller" colloquially. The slug should be `lillestrom` (ASCII-safe) and the displayed name should be "Lillestrøm"
- URL slugs must be ASCII — use `lillestrom`, `baerum`, `ski` (Ski is already ASCII). Do not use `bærum` in URLs — it breaks on some HTTP clients and complicates sitemap XML encoding

### Google Business Profile Gap

The existing PROJECT.md notes "Google Business Profile" as deferred. Google Business Profile (GBP) is the single strongest local SEO signal for Norwegian businesses and is separate from website structured data. City landing pages without a verified GBP will rank below competitors who have one. This is not a technical pitfall but a strategy gap: city pages alone will not displace a verified GBP listing. Prioritize GBP verification for Nettup's primary service area before scaling to V2.

---

## "Looks Done But Isn't" Checklist

- [ ] **Each V1 city page has unique intro copy:** Run a text diff between any two city pages — unique content should be > 60% of total words
- [ ] **Canonical self-references correctly:** Check rendered HTML source of each city page — `<link rel="canonical">` must equal that page's own URL
- [ ] **No city page has both `noindex` and `canonical`:** Automated check in CI or post-build HTML lint
- [ ] **`areaServed` in root LocalBusiness schema reflects all published cities:** Compare `areaServed` array count against `locations.ts` active entries count
- [ ] **Schema validates with no errors:** Every new city page passes `https://validator.schema.org` with zero errors (warnings are acceptable)
- [ ] **All city pages appear in `sitemap.xml`:** Count sitemap entries and compare against `locations.ts` active entry count post-deploy
- [ ] **City pages are linked from footer:** Inspect footer HTML in browser — each V1 city should have a visible link
- [ ] **V1 pages indexed before V2 work starts:** Google Search Console shows V1 pages as "Indexed" (not just "Discovered") before any V2 entry is added to `locations.ts`
- [ ] **URL slugs are ASCII-only:** No non-ASCII characters in any city slug — verify in `locations.ts` by inspection
- [ ] **`<html lang="nb">` on all city pages:** Inspect rendered HTML — not `lang="no"`, not omitted

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Doorway page penalty on city page cluster | HIGH | Remove or substantially rewrite every flagged page; wait for re-crawl; may require Google Search Console reconsideration request if manual action |
| Thin content site-level suppression from V3 premature scaling | HIGH | Remove or noindex all V3 thin pages; wait for Googlebot to re-process (weeks to months); re-establish site quality with V1/V2 content |
| Canonical pointing to wrong URL | LOW | Fix canonical prop in `[location].astro`; redeploy; submit affected URLs for recrawl in Search Console |
| areaServed schema errors | LOW | Fix schema template; redeploy; re-validate; errors clear on next Googlebot crawl |
| City pages missing from sitemap | LOW | Fix sitemap config or add custom sitemap endpoint; resubmit sitemap in Search Console |
| noindex + canonical conflict | LOW | Remove noindex from affected pages; redeploy; submit for recrawl |
| Duplicate city pages (canonical confusion) | MEDIUM | Audit all city page canonicals; fix self-referencing; set 301 redirects if duplicate URLs exist with different slugs |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Doorway page pattern (Pitfall 1) | V1 authoring — enforce content spec in `locations.ts` | Text diff between any two city pages shows > 60% unique content |
| Thin content (Pitfall 2) | V1 — define required field lengths; V2 — add pre-publish quality check | No city page has `intro` under 60 words; `faq` has city-specific questions |
| Canonical / noindex errors (Pitfall 3) | V1 — establish pattern in `[location].astro` before first page | Post-build HTML check confirms each city page self-references in canonical |
| areaServed schema errors (Pitfall 4) | V1 — schema architecture decision before any pages built | Rich Results Test passes for all V1 pages; no duplicate LocalBusiness entities |
| Premature V3 scaling (Pitfall 5) | V1/V2 gates — `tier` field in `locations.ts`; promotion criteria defined | V1 pages indexed + showing organic impressions before V2 starts |
| Sitemap coverage gaps (Pitfall 6) | V1 — verify immediately after first deploy | Sitemap entry count matches `locations.ts` active count post-deploy |
| Norway-specific (language code, slug encoding) | V1 — establish conventions in `locations.ts` schema | `<html lang="nb">` confirmed; all slugs ASCII-safe in config |

---

## Sources

- Google Spam Policies (official): https://developers.google.com/search/docs/essentials/spam-policies — doorway abuse definition and criteria
- Google Search Central Blog, March 2024: https://developers.google.com/search/blog/2024/03/core-update-spam-policies — updated enforcement
- Google canonicalization documentation: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls — canonical vs noindex guidance
- RicketyRoo: Location Page Spam analysis (MEDIUM confidence — WebSearch verified): https://ricketyroo.com/blog/location-page-spam/
- Tailride.so case study — 22,000 AI pages penalty (MEDIUM confidence — single source): https://tailride.so/blog/google-penalty-22000-ai-pages
- Astro sitemap integration docs: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- Astro sitemap regression, GitHub issue #7015: https://github.com/withastro/astro/issues/7015
- schema.org areaServed property: https://schema.org/areaServed
- schema.org LocalBusiness address/areaServed conflict, GitHub issue #4643: https://github.com/schemaorg/schemaorg/issues/4643
- Google Crawl Budget documentation: https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget
- Manning Search Marketing — Location Pages vs Doorway Pages: https://www.manningmarketing.com/articles/location-pages-vs-doorway-pages-seo-best-practices-and-pitfalls/
- seroundtable.com — Google city landing pages warning: https://www.seroundtable.com/google-city-landing-pages-doorway-pages-28670.html

---
*Pitfalls research for: Local SEO landing pages — adding city/location pages to Nettup.no (v1.5)*
*Researched: 2026-03-08*
