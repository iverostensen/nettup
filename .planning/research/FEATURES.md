# Feature Research

**Domain:** Automated AI-generated SEO blog — Astro 5 + GitHub Actions + Claude API
**Milestone:** v1.3 Automatisk Blogg (nettup.no)
**Researched:** 2026-03-06
**Confidence:** HIGH (architecture doc pre-resolves most decisions; research validates and fills gaps)

---

## Context: What Already Exists

This milestone adds a blog to a complete 5-page marketing site. The existing Astro 5 + Vercel stack is the foundation. All decisions below assume:

- Astro 5 with Content Layer API (loaders replace `type: "content"` declarations)
- `@astrojs/sitemap` already integrated — blog pages included automatically
- `@astrojs/rss` available as first-party package for feed generation
- Vercel adapter with hybrid rendering (static pages + `/api/chat` serverless)
- ANTHROPIC_API_KEY already in use by the chat endpoint
- Norwegian (bokmål) — all content and infrastructure

---

## Feature Landscape

### Table Stakes (Users and Crawlers Expect These)

Features that must exist for the blog to function as a legitimate SEO asset. Missing any of these means the blog either fails to rank or fails to convert.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Astro Content Collection schema** | Astro 5 requires a typed schema (`src/content/config.ts`) for the `blogg` collection. Without it, `getCollection()` returns untyped entries and the build fails on schema validation. | LOW | Zod schema with `title`, `seoTitle`, `description`, `publishDate`, `author`, `category`, `tags`, `estimatedReadTime`, `relatedSlugs`. Architecture doc has exact schema — follow it. |
| **Blog listing page `/blogg`** | Entry point for all blog traffic and internal links from the main site. Crawlers treat this as the topic hub. | LOW | `src/pages/blogg/index.astro` using `getCollection('blogg')`, sorted by `publishDate` desc. Static generation at build time. |
| **Dynamic article pages `/blogg/[...slug]`** | Each article needs a canonical URL. The `[...slug].astro` pattern handles any slug depth. | LOW | Standard Astro pattern. `getStaticPaths()` reads collection entries at build time. |
| **Article card component** | Listing page needs a reusable card: title, category badge, read time, date, excerpt. | LOW | `ArticleCard.astro` — Astro-only (no React needed, no animation required here). |
| **Article layout with structured data** | Every article needs `<title>` (seoTitle), `<meta description>`, Article JSON-LD, and FAQPage JSON-LD. These are non-negotiable for Google indexing and E-E-A-T signals. | MEDIUM | `ArticleLayout.astro` wraps `BaseLayout.astro`. Injects both schemas. Architecture doc has exact JSON-LD structure — follow it. |
| **Separate `seoTitle` and `title` fields** | `title` is the H1 (conversational: "Hva koster en nettside?"), `seoTitle` is the `<title>` tag (keyword-first: "Nettside pris 2026: Hva koster det? \| Nettup"). These serve different ranking and CTR functions. | LOW | Both in frontmatter schema. `ArticleLayout.astro` uses `seoTitle` for `<title>`, `title` for `<h1>`. Critical distinction — conflating them wastes CTR. |
| **Norwegian-aware slug generation** | Standard slugify breaks Norwegian: "øst" → "ost" (cheese). Must map æ→ae, ø→oe, å→aa. | LOW | Inline utility function in `generate-article.ts`. No npm package needed — 8 lines of code. Architecture doc has the correct mapping. |
| **GitHub Actions cron workflow** | The automation is the feature. Without a working cron job, everything else is manual. | MEDIUM | `.github/workflows/blog-generate.yml` — Monday 08:00 UTC + `workflow_dispatch` for manual trigger. `tsx` must be in `devDependencies`, not cold-downloaded via `npx`. |
| **PR-based publish flow** | Never commit directly to main. PR creates the audit trail — quality scores visible in PR body, auto-merge on CI pass. | MEDIUM | `gh` CLI in the GitHub Action, `GITHUB_TOKEN` available automatically. Auto-merge must be enabled on the repo for `blogg/*` branches. |
| **Topic cluster config** | Human-curated seed topics are the editorial control mechanism. Without them, generation is directionless. | LOW | `scripts/blog/config.ts` with 4 clusters (priser, teknologi, smb-tips, lokal-seo). This is the editorial input Nettup controls. |
| **Duplicate detection** | Without checking existing articles, the pipeline will generate near-duplicate content. Near-duplication is an E-E-A-T signal that hurts rankings. | LOW | Read all `src/content/blogg/*.md` frontmatter titles + tags at topic selection time, pass list to Claude. Covered in architecture doc. |
| **`inLanguage: "nb"` in Article schema** | Google uses this to serve the article to Norwegian-language searchers. Missing it means the article competes globally rather than in the Norwegian SERP. | LOW | One field in the JSON-LD. Architecture doc includes it. Do not omit. |

### Differentiators (What Makes This Quality, Not Spam)

Features that separate this pipeline from generic AI content farms. These are what allow the content to rank and build E-E-A-T.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Two-pass quality gate** | Pass 1: Claude reviews its own output with a strict editorial prompt (scores 1-10 on 6 criteria, must average ≥7). Pass 2: Automated checks (word count, heading frequency, LIX score, self-promotion cap, FAQ section presence). Articles failing either pass are rejected without publishing — rejection is logged as a job summary, not a CI failure. | MEDIUM | This is the single most important differentiator. Mass AI content farms skip the review step. The architecture doc has both the review prompt and automated checks. Implement exactly as specified. |
| **LIX readability score (inline, no dependency)** | Norwegian readability measurement — LIX ≤ 45 targets "medium" complexity, appropriate for Norwegian SMB owners. LIX = (words/sentences) + (long words × 100/words). Enforced at quality gate stage. | LOW | 10-line formula, no npm package. Architecture doc has the calculation. This is a concrete quality signal that generic pipelines don't include. |
| **GEO-optimized article structure** | First paragraph directly answers the question in 1-2 sentences (no preamble). Mandatory "Vanlige spørsmål" section at end. Short, citable, standalone sentences throughout. GEO targets ChatGPT, Perplexity, and Google AI Overviews as citation sources — LLMs cite only 2-7 domains per response, making early authority establishment critical. | LOW | Enforced in system prompt AND verified in quality gate (`hasFaqSection` automated check). The FAQ section feeds FAQPage JSON-LD — structural and SEO benefit combined. |
| **Self-promotion cap (max 2 Nettup mentions)** | AI content that reads as thinly-veiled advertising ranks poorly and damages E-E-A-T. The cap is enforced in the system prompt AND checked with `countMentions("Nettup", article) <= 2` in automated checks. Both gates must agree. | LOW | Dual enforcement (prompt + code) prevents the model from drifting on this. Single-enforcement fails. |
| **Human-curated topic clusters** | Editorial direction (the "what to write about") is human-decided. The AI handles the "how to write it". This split preserves the strategic intent while automating the execution. Prevents the pipeline from generating off-brand content. | LOW | `scripts/blog/config.ts` with cluster definitions. Nettup controls this file — adding/removing clusters changes editorial direction without touching pipeline code. |
| **Author attribution with E-E-A-T signals** | Real person (Iver Østensen) as author in Article JSON-LD with `sameAs` LinkedIn URL. Google's E-E-A-T framework evaluates whether a real person with verifiable expertise wrote the content. Anonymous or "AI-generated" attribution signals low E-E-A-T. | LOW | One JSON-LD field. Architecture doc includes it. Do not make the author "Nettup Blog Bot". |
| **Rate limiting (1 article/week)** | Scaled content abuse — generating high volumes of AI content rapidly — is explicitly named in Google's spam policies. 1 article/week over a year produces 52 articles, a legitimate editorial volume. | LOW | GitHub Actions cron schedule controls this. Do not add parallel generation or multiple-article-per-run capability. |
| **Persistent topic queue** | `topics-queue.json` tracks pending/published/rejected topics. If quality gate rejects an article, the topic stays in queue with rejection reason — next run retries before generating new topics. Prevents lost weeks from rejection cascades. | MEDIUM | Committed to the repo, updated by pipeline at each stage. Requires careful git handling in the GitHub Action (pull before write, push after). |
| **Internal linking to service pages** | Every article links to 1-2 Nettup service pages where relevant. `SERVICE_PAGES` list is hardcoded in `generate-article.ts`. Claude is instructed to link organically, not forcibly. Links convert blog readers into leads. | LOW | The hardcoded list prevents hallucinated URLs. Instruction to link "only where organic" prevents spammy anchor text. Both matter. |
| **Related article cross-linking** | `relatedSlugs` in frontmatter (chosen by Claude from the existing articles list passed in Stage 2) drives a `RelatedArticles.astro` component at article bottom. Builds topical authority by linking thematically related articles. | LOW | `RelatedArticles.astro` reads `relatedSlugs`, fetches those collection entries, renders `ArticleCard` for each. Zero extra API calls — runs at build time. |
| **Hub/cluster pages (deferred)** | `/blogg/kategori/[cluster].astro` — category index pages with spoke articles listed. Hub-and-spoke signals topical authority to Google. Prerequisite: ≥3 articles per cluster. Trigger: after 10+ total articles exist. | MEDIUM | Defer until content volume justifies it. Building hub pages with 1-2 articles per cluster wastes crawl budget and looks thin. |

### Anti-Features (Explicitly Avoid)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Google Trends API integration** | Automate topic discovery with real search signal data | No official API exists. Unofficial npm packages are scraping-based and break on Google's rate limiting — causing pipeline failures on the most important step. | Human-curated seed clusters. At 1 article/week, editorial curation is a 5-minute monthly task. |
| **"People Also Ask" scraping** | Enrich topics with SERP data | Same problem as Trends — scraping-based, brittle, against Google's ToS. Pipeline reliability is more valuable than marginal topic quality improvement. | Claude's awareness of Norwegian SMB questions, informed by the system prompt's audience definition. |
| **`draft` boolean in frontmatter** | Ability to generate without publishing | The PR is the review gate. A draft flag creates a second, redundant gate — articles would accumulate in the collection without ever being published. | If an article shouldn't be published, the quality gate should reject it. The PR process is the human review mechanism if manual inspection is needed. |
| **Cover/hero images per article** | Visual richness, social sharing aesthetics | AI image generation costs ($0.04-0.20/image) add up. More importantly, generated images for professional agency content risk looking generic or off-brand. Alt text and descriptions add complexity to the pipeline. | Text-only for v1.3. Add images in a future phase if blog performance data justifies it. |
| **Comment system** | Reader engagement, community building | Spam magnet, requires moderation infrastructure, adds no SEO value for a B2B lead-gen blog targeting Norwegian SMB owners who don't comment on agency blogs. | Contact form CTA at article end. Leads contact directly. |
| **Pagination on listing page** | Handle large article volumes | At 1 article/week, the listing page won't need pagination for 2+ years. Adding pagination now creates complexity (Astro's `paginate()` + `[...page].astro`) that provides zero immediate value. | Simple flat listing, sorted by date. Add pagination when the listing page has >30 articles. |
| **CMS / admin UI for articles** | Edit generated content without code | No human is editing these articles — the pipeline is designed to be hands-free. A CMS adds infrastructure, credentials, and maintenance cost with no benefit in this model. | Edit the `.md` files directly if manual correction is needed. This is a developer-controlled repo. |
| **RSS feed** | Blog syndication, feed readers | Norwegian SMB owners don't use feed readers. An RSS feed for a B2B agency blog with AI-generated content provides marginal distribution value. `@astrojs/rss` is easy to add but creates an additional feed endpoint to maintain. | Defer to post-launch if there's specific demand. The sitemap handles Google's discovery needs. |
| **Email newsletter from blog** | Convert blog readers to newsletter subscribers | Adds Mailchimp/Buttondown integration, double opt-in flows, list management. Significant scope increase for uncertain return in the Norwegian SMB market at this stage. | Contact form CTA. One conversion goal at a time. |
| **Social share buttons** | Increase article distribution | Norwegian SMB decision-makers don't share agency blog posts on social. Adds external JavaScript, potential privacy concerns (GDPR), and page weight. | OG tags ensure clean link previews if someone manually shares. That's sufficient. |
| **Vercel Cron + Serverless for generation** | Keep everything on Vercel | Hobby plan has 10-second function timeout — generation + review pass takes 60-120 seconds. Edge functions are not a viable host for a Claude API call of this duration. | GitHub Actions handles this correctly. 2000 free minutes/month, no timeout issue. |

---

## Feature Dependencies

```
[Content Collection Schema] (src/content/config.ts)
    +-- required by --> [Listing page /blogg]
    +-- required by --> [Article pages /blogg/[...slug]]
    +-- required by --> [ArticleCard component]
    +-- required by --> [ArticleLayout component]
    +-- required by --> [Pipeline: generate-article.ts output]

[ArticleLayout component]
    +-- required by --> [Article pages /blogg/[...slug]]
    +-- includes --> [Article JSON-LD]
    +-- includes --> [FAQPage JSON-LD]
    +-- includes --> [OG meta tags]

[Topic cluster config] (scripts/blog/config.ts)
    +-- drives --> [Stage 1: discover-topics.ts]
    +-- determines --> [Editorial direction]

[Stage 1: Topic Selection]
    +-- required by --> [Stage 2: Content Generation]
    +-- reads --> [Existing articles in blogg/ for duplicate detection]
    +-- reads/writes --> [topics-queue.json]

[Stage 2: Content Generation]
    +-- required by --> [Stage 3: Quality Gate]
    +-- reads --> [SERVICE_PAGES list for internal link instructions]
    +-- reads --> [Existing article slugs for relatedSlugs selection]

[Stage 3: Quality Gate]
    +-- gates --> [Stage 4: SEO Optimization]
    +-- on reject: exits 0, writes job summary, no PR

[Stage 4: SEO Optimization]
    +-- required by --> [Stage 5: PR Creation]
    +-- injects --> [Article JSON-LD]
    +-- injects --> [FAQPage JSON-LD parsed from "Vanlige spørsmål" section]

[Stage 5: PR Creation]
    +-- depends on --> [GitHub token with PR creation permission]
    +-- depends on --> [Auto-merge enabled on repo for blogg/* branches]
    +-- on merge --> [Vercel auto-deploy]
    +-- on merge --> [Sitemap updates automatically via @astrojs/sitemap]
    +-- writes --> [topics-queue.json status: "published"]

[RelatedArticles component]
    +-- reads --> [frontmatter.relatedSlugs]
    +-- fetches --> [those collection entries at build time]
    +-- renders --> [ArticleCard for each]

[Hub/cluster pages] (deferred)
    +-- requires --> [>= 3 articles per cluster]
    +-- links back to --> [Article pages (spoke articles link to hub)]
```

### Dependency Notes

- **Schema first, everything else second.** The content collection schema is the contract between the pipeline output and the Astro build. Get it right before writing any pipeline code or page components.
- **Quality gate is the critical path.** If the quality gate has false positives (rejects good content), the pipeline becomes useless. If it has false negatives (passes bad content), the blog publishes spam. Test the quality gate with real Claude output before enabling auto-merge.
- **topics-queue.json needs careful git handling.** The GitHub Action must `git pull` before updating the queue file, then push the update. Race conditions (two parallel runs) are unlikely at 1/week but the git flow must be correct.
- **Hub pages depend on content volume.** Do not build category index pages until there are ≥3 articles per cluster. Empty or near-empty hub pages harm rather than help topical authority.

---

## MVP Definition

### Launch With (v1.3 core — 3 phases)

**Phase 1: Astro Blog Infrastructure**
- [ ] `src/content/config.ts` — content collection schema with all fields
- [ ] `src/pages/blogg/index.astro` — listing page, sorted by date
- [ ] `src/pages/blogg/[...slug].astro` — dynamic article pages
- [ ] `src/components/blogg/ArticleCard.astro` — card for listing page
- [ ] `src/components/blogg/ArticleLayout.astro` — article template with both JSON-LD schemas
- [ ] `src/components/blogg/RelatedArticles.astro` — related articles from `relatedSlugs`
- [ ] At least 2 seed articles (hand-written or manually generated) to verify the infrastructure before automation goes live

**Phase 2: Pipeline Scripts**
- [ ] `scripts/blog/config.ts` — topic clusters, SERVICE_PAGES list
- [ ] `scripts/blog/topics-queue.json` — empty initial queue (committed)
- [ ] `scripts/blog/discover-topics.ts` — topic selection + duplicate detection + queue management
- [ ] `scripts/blog/generate-article.ts` — Claude Sonnet 4.6 generation with system prompt
- [ ] `scripts/blog/quality-gate.ts` — two-pass review (Claude + automated checks including LIX)
- [ ] `scripts/blog/optimize-seo.ts` — schema injection + FAQPage extraction
- [ ] `scripts/blog/publish.ts` — PR creation + queue status update
- [ ] `scripts/blog/index.ts` — pipeline orchestrator
- [ ] `tsx` added to `devDependencies`

**Phase 3: GitHub Action + Repo Config**
- [ ] `.github/workflows/blog-generate.yml` — cron + workflow_dispatch
- [ ] `ANTHROPIC_API_KEY` secret in repo settings
- [ ] Auto-merge enabled on repo for `blogg/*` branches after CI pass

### Add After Validation (trigger: 10+ articles published)

- [ ] Hub/cluster pages (`/blogg/kategori/[cluster].astro`) — builds topical authority once content volume justifies it
- [ ] Breadcrumbs on article pages linking back to `/blogg` — minor UX + structured data improvement
- [ ] Category filter on listing page — useful at 15+ articles, not before

### Future Consideration (v1.4+)

- [ ] Cover images per article — if social sharing or visual differentiation becomes a priority
- [ ] RSS feed — if there's specific distribution demand
- [ ] Email newsletter — if blog traffic converts and email capture is strategic
- [ ] Search within blog — only relevant at 50+ articles

---

## Feature Prioritization Matrix

| Feature | User/SEO Value | Implementation Cost | Priority |
|---------|----------------|---------------------|----------|
| Content Collection schema | HIGH | LOW | P1 |
| Listing page `/blogg` | HIGH | LOW | P1 |
| Article pages `/blogg/[...slug]` | HIGH | LOW | P1 |
| ArticleLayout with JSON-LD | HIGH | MEDIUM | P1 |
| Two-pass quality gate | HIGH | MEDIUM | P1 |
| GEO structure (direct answer + FAQ) | HIGH | LOW | P1 |
| Topic cluster config | HIGH | LOW | P1 |
| GitHub Actions cron | HIGH | MEDIUM | P1 |
| PR-based publish + auto-merge | MEDIUM | MEDIUM | P1 |
| Norwegian slug generation | MEDIUM | LOW | P1 |
| Duplicate detection | MEDIUM | LOW | P1 |
| Self-promotion cap enforcement | MEDIUM | LOW | P1 |
| `inLanguage: "nb"` in schema | MEDIUM | LOW | P1 |
| RelatedArticles component | MEDIUM | LOW | P2 |
| ArticleCard component | MEDIUM | LOW | P1 |
| Persistent topic queue | MEDIUM | MEDIUM | P2 |
| Internal linking to service pages | MEDIUM | LOW | P1 |
| Author E-E-A-T signals in schema | MEDIUM | LOW | P1 |
| Hub/cluster pages | HIGH (at scale) | MEDIUM | P3 (deferred) |
| RSS feed | LOW | LOW | P3 |
| Pagination | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Required for v1.3 launch
- P2: Should have, add within Phase 2-3 scope
- P3: Future — defer until content volume or usage data justifies it

---

## Norwegian SEO Specifics

The architecture doc covers general SEO well but doesn't address Norway-specific ranking signals.

| Factor | Norwegian Context | Implementation |
|--------|-------------------|----------------|
| **Language declaration** | Norwegian search is almost entirely `nb` (bokmål) or `nn` (nynorsk). Google uses `lang` attribute and `inLanguage` schema field to route articles to Norwegian SERPs. | `lang="nb"` on `<html>`, `inLanguage: "nb"` in Article JSON-LD — both required |
| **Local SEO cluster** | "seo oslo", "google bedrift", "lokal synlighet" — Norwegian SMBs search with location qualifiers. These cluster articles rank in local pack and organic simultaneously. | Include as one of 4 topic clusters; generate city-specific variants ("nettside oslo", "nettside bergen") as article variants, not separate service pages |
| **Google AI Overviews (Norway)** | Google AI Overviews are expanding in Norwegian search. The GEO structure (direct answer in first paragraph, FAQ section) is specifically designed to be cited in AI Overviews. | Already in architecture doc — enforce via system prompt + quality gate |
| **Norwegian readability (LIX)** | Norwegian text has naturally longer words than English (agglutinative tendencies). LIX ≤ 45 is the right ceiling for SMB audience. LIX > 54 is academic text. | Quality gate enforces this. The system prompt instructs "korte avsnitt" (short paragraphs) which helps LIX |
| **Bokmål vs Nynorsk** | 85-90% of Norwegian web searches use bokmål. Never mix. | System prompt specifies "norsk bokmål" — Claude respects this consistently |

---

## What the Architecture Doc Has Right

These decisions in the architecture doc are validated by research — do not second-guess them:

1. **Claude Sonnet 4.6 (not Haiku)** — Norwegian editorial content quality matters. Haiku produces noticeably more generic output in non-English languages. The cost difference ($0.05 vs $0.01/article) is irrelevant at 4 articles/month.

2. **GitHub Actions over Vercel Cron** — Vercel hobby plan's 10s timeout is fatal for a Claude generation pipeline (60-120s). GitHub Actions is the correct tool.

3. **PR always, never direct commit** — Audit trail + CI gate + auto-merge is the correct pattern. Direct commits to main would bypass quality validation and lose the review history.

4. **No `draft` flag** — Redundant gate. The PR is the review mechanism. Confirmed correct.

5. **No cover images in v1** — Adds cost, complexity, and brand risk (AI images for a design agency look generic). Text-first is the right starting point.

6. **Separate `seoTitle` and `title` fields** — This is aligned with SEO best practice. `<title>` tags optimize for SERP CTR (keyword-first format), while H1s optimize for readability and user trust. Conflating them sacrifices one goal for the other.

---

## Gaps the Architecture Doc Leaves Open

These require decisions during implementation:

1. **OG image for articles** — The architecture doc doesn't specify Open Graph images for articles. Options: (a) use the existing site `og-image.jpg` for all articles, (b) generate text-on-image OG cards at build time. Option (a) is correct for v1.3 — implementing per-article OG images is Phase 2+ scope.

2. **Breadcrumb JSON-LD on article pages** — `/blogg` → `/blogg/[slug]` breadcrumb path is a standard SEO signal the architecture doc doesn't mention. Low-complexity addition with measurable benefit. Add `BreadcrumbList` JSON-LD in `ArticleLayout.astro`.

3. **Category listing URL structure** — Hub/cluster pages are deferred, but the URL structure decision affects slug design now. Recommend `/blogg/kategori/priser-og-kostnader` as the pattern — establishes the namespace without requiring implementation yet.

4. **How to link to blog from main site** — The architecture doc doesn't specify where on nettup.no the blog is discoverable. The FloatingNav doesn't include `/blogg` (correct per the architecture decision that `/priskalkulator` isn't in nav). Recommend: add blog link to Footer + a "Les fra bloggen" section on `/` or `/tjenester` after 5+ articles exist.

5. **CI check on blog PRs** — What does "CI pass" mean for auto-merge? The architecture doc mentions auto-merge triggers on CI pass but doesn't define what CI checks run. At minimum: `npm run build` must pass. The build will fail if a generated article has malformed frontmatter — this is a useful safety net.

---

## Sources

- Architecture doc: `/Users/iverostensen/nettup/.planning/blog-milestone-architecture.md` — pre-resolved decisions (HIGH confidence, primary source)
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/) — Content Layer API, Astro 5 loaders (HIGH confidence)
- [Google's guidance on AI-generated content](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content) — Quality over origin (HIGH confidence)
- [Whitespark Local Search Ranking Factors 2026](https://whitespark.ca/local-search-ranking-factors/) — GBP signals, review signals (MEDIUM confidence)
- [Strapi GEO guide 2025](https://strapi.io/blog/generative-engine-optimization-geo-guide) — Direct answer structure, FAQ for citations (MEDIUM confidence, multiple sources agree)
- [ALM Corp SEO Trends 2026](https://almcorp.com/blog/seo-trends-2026-rank-google-ai-search/) — AI Overview citation patterns (MEDIUM confidence)
- [1702digital E-E-A-T 2026](https://1702digital.com/blog/latest-seo-trends-2026/) — E-E-A-T as ranking filter (MEDIUM confidence)
- Codebase analysis: existing Astro 5 stack, `@astrojs/sitemap` integration, Vercel adapter config (HIGH confidence)

---
*Feature research for: Nettup v1.3 — Automatisk Blogg (automated AI-generated SEO blog)*
*Researched: 2026-03-06*
