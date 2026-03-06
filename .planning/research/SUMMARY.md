# Project Research Summary

**Project:** Nettup v1.3 — Automatisk Blogg
**Domain:** Automated AI-generated SEO blog pipeline integrated into existing Astro 5 marketing site
**Researched:** 2026-03-06
**Confidence:** HIGH

## Executive Summary

This milestone adds a fully automated, weekly blog pipeline to an already-complete 5-page marketing site (nettup.no). The approach is: GitHub Actions cron triggers Claude Sonnet 4.6 to generate Norwegian SEO content, which passes a two-pass quality gate before being published to Astro Content Collections via a GitHub PR that auto-merges on CI pass. Vercel then auto-deploys the article live. The architecture is pre-resolved in the existing milestone document, and research confirms all major decisions are sound. Only two new dev dependencies are needed (`tsx`, `@octokit/rest`); the rest of the stack is unchanged.

The recommended approach prioritizes quality over volume: 1 article/week with a strict editorial process (human-curated topic clusters, dual-gate review: Claude self-review + automated LIX check). This is the critical differentiator from AI content farms. The pipeline produces ~52 articles/year — a legitimate editorial volume that avoids Google's scaled-content spam policies. GEO-optimized structure (direct answer in first paragraph, mandatory FAQ section) targets Norwegian AI Overviews and citation surfaces. All content is in Norwegian bokmål, targeting SMB decision-makers.

The primary risks are infrastructure configuration pitfalls, not design risks. Specifically: GITHUB_TOKEN cannot trigger CI on its own PRs (requires a Personal Access Token), auto-merge requires a branch protection rule in addition to the settings toggle, and the Astro 5 Content Layer config file path differs from Astro 4. These are all well-documented failure modes with clear fixes. On the implementation side, splitting Claude article generation into two sequential API calls (content then metadata) eliminates JSON truncation risk. The LIX readability threshold should be set to 55 (not 45 as stated in the architecture doc) to avoid systematic false rejections of legitimate Norwegian technical content.

---

## Key Findings

### Recommended Stack

The existing Astro 5 + Tailwind 4 + React + Vercel stack requires only two new dev dependencies. `@anthropic-ai/sdk` is already in `dependencies` and is reused directly in pipeline scripts. Astro Content Collections are built into Astro 5 — no new package needed.

**Core technologies:**
- `tsx ^4.21.0` (devDependency) — runs TypeScript pipeline scripts in GitHub Actions without a compile step; must be in devDependencies, not cold-downloaded via `npx tsx` (adds 15-30s per CI run and introduces registry failure risk)
- `@octokit/rest ^22.0.1` (devDependency) — creates GitHub PRs from the pipeline's publish stage; lighter than the full `octokit` bundle (no GraphQL or webhooks needed)
- `@anthropic-ai/sdk ^0.78.0` — already in `dependencies`; used for both content generation and quality-gate review passes
- Astro Content Collections (built-in) — typed blog schema via `src/content/config.ts` with Zod; `getCollection('blogg')` at build time

**Critical version note:** In Astro 5, the Content Collections config lives at `src/content.config.ts` (Content Layer API) or `src/content/config.ts` (legacy `type: 'content'` API). The architecture doc uses the legacy path intentionally — this is correct for v1.3 but carries long-term maintenance risk if Astro removes legacy support.

See: `.planning/research/STACK.md`

### Expected Features

The blog must function as a legitimate SEO asset and a quality signal for Nettup as an agency. The architecture doc pre-resolves most feature decisions correctly.

**Must have (table stakes):**
- Content collection schema (`src/content/config.ts`) — typed contract between pipeline output and Astro build; must be created first, before any page components
- Blog listing page `/blogg` and dynamic article pages `/blogg/[...slug]` — entry points for all blog traffic
- `ArticleLayout.astro` wrapping `BaseLayout.astro` with Article + FAQPage JSON-LD — non-negotiable for Google indexing and E-E-A-T signals
- Separate `seoTitle` (keyword-first `<title>` tag) and `title` (conversational H1) fields — conflating them sacrifices either CTR or readability
- Norwegian-aware slug generation (ae/oe/aa for ae/o/a) — 8 lines of code, no package needed
- Two-pass quality gate: Claude self-review (6 criteria, avg ≥7) + automated checks (word count, LIX ≤55, self-promotion cap ≤2, FAQ section presence)
- GitHub Actions cron (Monday 08:00 UTC) + `workflow_dispatch` — automation is the feature
- PR-based publish flow — never commit directly to `main`; quality scores visible in PR body as a permanent audit trail
- `inLanguage: "nb"` in Article JSON-LD — routes content to Norwegian SERPs, not global
- Human-curated topic clusters (`scripts/blog/config.ts`) — 4 clusters: priser, teknologi, smb-tips, lokal-seo

**Should have (differentiators):**
- Persistent topic queue (`topics-queue.json` committed to repo) — prevents re-selecting rejected or already-published topics across weekly runs
- Internal linking to Nettup service pages — converts blog readers to leads; hardcoded `SERVICE_PAGES` list prevents hallucinated URLs
- `relatedSlugs` in frontmatter + `RelatedArticles.astro` component — topical authority via cross-linking, fetched at build time
- Author E-E-A-T signals in Article JSON-LD (`sameAs` LinkedIn URL for Iver Ostensen) — Google E-E-A-T evaluation requires a verifiable real person
- GEO-optimized structure (direct answer first paragraph, mandatory "Vanlige sporsmal" section) — targets AI Overviews citation surfaces
- Self-promotion cap: max 2 "Nettup" mentions, enforced in both system prompt and automated quality check

**Defer (v2+):**
- Hub/cluster pages (`/blogg/kategori/[cluster].astro`) — trigger after ≥10 articles total, ≥3 per cluster
- Cover images per article — adds cost and brand risk; text-first is correct for v1.3
- RSS feed, pagination, comment system, email newsletter, social share buttons

See: `.planning/research/FEATURES.md`

### Architecture Approach

The pipeline is a 5-stage Node.js script (`scripts/blog/index.ts`) that runs inside GitHub Actions, completely decoupled from the Astro build. Pipeline scripts live at `scripts/blog/` at the repo root (not inside `src/`) because Vite would attempt to bundle Node.js APIs. Astro reads the generated `.md` files from `src/content/blogg/` at build time only. The two systems share only the filesystem — no runtime coupling.

**Major components:**
1. `src/content/config.ts` — Zod schema defining the `blogg` collection; must be created first (everything else depends on it)
2. `src/components/blogg/ArticleLayout.astro` — wraps `BaseLayout.astro` via named `head` slot; injects Article + FAQPage JSON-LD without duplicating nav, footer, or analytics
3. `scripts/blog/quality-gate.ts` — two-pass review (Claude self-critique + automated LIX/checks); rejection exits 0 with job summary, never exits 1
4. `scripts/blog/publish.ts` — creates `blogg/*` branch, commits article, opens PR with quality report body; uses `@octokit/rest` and a PAT (not GITHUB_TOKEN)
5. `.github/workflows/blog-generate.yml` — cron + manual trigger; requires `ANTHROPIC_API_KEY` secret and a PAT stored as `GH_PAT`

**Build order:** content.config → ArticleCard → ArticleLayout → RelatedArticles → listing/article pages → BaseLayout modification → pipeline scripts (config, queue, 5 stages) → orchestrator → workflow → package.json (`tsx`)

See: `.planning/research/ARCHITECTURE.md`

### Critical Pitfalls

1. **GITHUB_TOKEN cannot trigger CI on its own PR** — GitHub's loop-prevention blocks `pull_request` workflows on PRs created by `GITHUB_TOKEN`. Without CI running, auto-merge either merges immediately with no safety gate or never merges. Fix: store a PAT as `secrets.GH_PAT` and use it for checkout and `gh pr create`. Must decide before writing the workflow file.

2. **Auto-merge requires a branch protection rule, not just the settings toggle** — Enabling "Allow auto-merge" in repo settings is not sufficient. A branch protection rule on `main` with at least one required status check must exist, or auto-merge has no condition to wait for and either fires immediately or never. Fix: Settings → Branches → Add rule → require `build` check.

3. **JSON truncation from single-call article generation** — Requesting a JSON blob containing a 2000-word `content` field in one Claude call risks hitting the 8K output token limit for Sonnet 4.6. `JSON.parse()` throws on truncated output, crashing the pipeline after consuming API credits. Fix: two sequential API calls — plain Markdown for content, small JSON for metadata. Alternatively, use Anthropic Structured Outputs beta (`anthropic-beta: structured-outputs-2025-11-13`).

4. **LIX threshold 45 causes systematic false rejections of Norwegian technical content** — Norwegian is a compounding language; technical terms like "sokemotoroptimalisering" count as long words. LIX ≤45 is appropriate for fiction, not web-technology content. Fix: raise threshold to ≤55, or treat LIX as a soft warning in the job summary rather than a hard rejection gate.

5. **`relatedSlugs` hallucination breaks the Astro build** — If Claude returns a slug that does not exist in the collection, `getEntry()` returns `undefined`. Rendering `entry.data.title` on undefined throws and fails the entire build. Fix: `RelatedArticles.astro` must filter out undefined entries. Quality gate must also validate all `relatedSlugs` exist before writing the `.md` file.

Additional pitfalls documented in research: Astro 5 config file path (legacy vs Content Layer), `tsx` must be in devDependencies not fetched via `npx`, `topics-queue.json` update must be committed back on each run, `discover-topics.ts` must guard against `src/content/blogg/` not existing on first run, `getStaticPaths` params key must match `[...slug]` filename exactly.

See: `.planning/research/PITFALLS.md`

---

## Implications for Roadmap

The research and architecture doc both agree on a 3-phase structure. The dependency chain makes the order non-negotiable: Astro must know about the collection before any page can query it; pages must exist before the pipeline has a validated output target; the GitHub Action is wired up last because it depends on everything else being correct.

### Phase 1: Astro Blog Infrastructure

**Rationale:** The content collection schema is the contract between the pipeline and the Astro build. Everything — listing pages, article pages, components, and pipeline output — depends on this existing first. This phase has no external dependencies and can be fully verified locally with `astro build` before touching CI or the Anthropic API.

**Delivers:** A working blog with manually-created seed articles, verifiable via `astro build` and `astro preview`. Establishes all URLs, SEO structure, and component boundaries.

**Addresses:**
- Content collection schema (run `astro sync` and verify `.astro/types.d.ts` before proceeding to pages)
- `/blogg` listing page, `/blogg/[...slug]` dynamic pages
- `ArticleCard.astro`, `ArticleLayout.astro` with both JSON-LD schemas, `RelatedArticles.astro`
- `BaseLayout.astro` modification (add `'/blogg': 'Blogg'` to `pageLabels`)
- At least 2 seed articles to validate the full build path end-to-end

**Avoids:** Pitfall 1 (config location — run `astro sync` immediately after creating config), Pitfall 9 (getStaticPaths params key — verify with `astro build` not just `astro dev`), Pitfall 10 (relatedSlugs undefined guard in `RelatedArticles.astro`)

**Research flag:** Standard patterns — Astro Content Collections and `getStaticPaths` are well-documented. No phase research needed.

---

### Phase 2: Pipeline Scripts

**Rationale:** Scripts can be developed and tested locally once Phase 1 infrastructure exists. The `tsx` dev dependency, all 5 pipeline stages, and the orchestrator are self-contained Node.js code with no GitHub Actions involvement yet. A manual `npx tsx scripts/blog/index.ts` run verifies the pipeline before wiring the cron.

**Delivers:** A runnable pipeline triggerable manually. Includes the quality gate with calibrated LIX threshold, topic queue management, and PR creation logic.

**Uses:**
- `tsx` (devDependency) — installed via `npm install -D tsx`, not cold-downloaded
- `@octokit/rest` (devDependency) — PR creation in `publish.ts`
- `@anthropic-ai/sdk` (already in dependencies) — generation and review passes

**Implements:**
- `scripts/blog/config.ts` — 4 topic clusters, `SERVICE_PAGES` list
- `scripts/blog/discover-topics.ts` — with `fs.existsSync` guard for first run against empty directory
- `scripts/blog/generate-article.ts` — two API calls (content then metadata); Norwegian slugify (no package)
- `scripts/blog/quality-gate.ts` — LIX threshold ≤55; exit 0 with job summary on reject
- `scripts/blog/optimize-seo.ts` — FAQPage extraction and Article + FAQPage schema injection
- `scripts/blog/publish.ts` — branch, commit, PR via `@octokit/rest`; updates queue status
- `scripts/blog/index.ts` — top-level try/catch on the entire pipeline; all failures exit 0 with job summary

**Avoids:** Pitfall 3 (JSON truncation — two-call generation), Pitfall 4 (LIX threshold — 55 not 45), Pitfall 5 (`tsx` in devDependencies), Pitfall 6 (email spam — exit 0 always), Pitfall 7 (directory non-existence — `fs.existsSync` guard), Pitfall 10 (slug validation in quality gate before writing `.md`)

**Research flag:** The two-call API pattern and Anthropic Structured Outputs are documented but untested in this codebase. Recommended: run the pipeline manually against a real topic before enabling the cron. Calibrate LIX threshold against 3-5 sample Norwegian tech articles before production use.

---

### Phase 3: GitHub Actions and Repo Configuration

**Rationale:** Last phase because it orchestrates everything from Phase 1 and Phase 2. The workflow cannot be verified without the pipeline scripts and Astro infrastructure being correct. This phase also involves non-code configuration (repo secrets, branch protection, auto-merge settings) that must be set up in a specific sequence.

**Delivers:** Fully automated weekly pipeline. Articles generated Monday morning, pass quality gate, PR created, CI runs, auto-merges on green, Vercel deploys, article live within ~2 minutes of merge.

**Addresses:**
- `.github/workflows/blog-generate.yml` — cron + `workflow_dispatch`; explicit `permissions: contents: write, pull-requests: write`
- `ANTHROPIC_API_KEY` secret in repo settings
- `GH_PAT` secret (PAT with `contents: write` + `pull-requests: write` scope only) — required for CI to trigger on pipeline PRs
- Branch protection rule on `main` — require `build` check to pass before auto-merge fires
- Auto-merge enabled at repo level

**Avoids:** Pitfall 1 (GITHUB_TOKEN blocks CI — use PAT instead), Pitfall 2 (auto-merge without branch protection rule)

**Research flag:** PAT setup and branch protection rules are standard GitHub procedures — no research needed. Verify on first test run: create a manual PR using the PAT and confirm the CI workflow appears in the PR Checks tab before enabling the cron.

---

### Phase Ordering Rationale

- Schema must exist before pages (`getCollection` fails without it)
- Pages must exist before pipeline scripts have a valid output target
- Pipeline scripts must be correct before the GitHub Action runs them weekly
- The "Looks Done But Isn't" checklist in `PITFALLS.md` provides a concrete verification sequence for each phase — follow it before marking any phase complete

### Research Flags

Phases needing deeper research during planning: None identified. The architecture doc pre-resolves all major decisions and research confirms them.

Phases where standard patterns apply (skip research-phase):
- **Phase 1:** Astro Content Collections, `getStaticPaths`, slot-based layout composition — all established Astro 5 patterns with official documentation
- **Phase 2:** Node.js script patterns, Anthropic SDK usage — already proven in `/api/chat.ts`; the two-call generation pattern is straightforward
- **Phase 3:** GitHub Actions workflow structure, branch protection — standard GitHub features

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official npm and Astro docs; `package.json` inspected directly; versions confirmed current as of 2026-03-06 |
| Features | HIGH | Architecture doc (primary source) validated by research; Norwegian SEO specifics from multiple consistent sources; feature deferrals are conservative and correct |
| Architecture | HIGH | Direct codebase inspection of `BaseLayout.astro`, `astro.config.mjs`, `package.json`, `tsconfig.json`, `.github/workflows/ci.yml`; no guesswork |
| Pitfalls | HIGH | GITHUB_TOKEN/CI trigger issue confirmed via GitHub community docs; auto-merge branch protection confirmed via GitHub official docs; LIX calibration from formula documentation; JSON truncation from Anthropic token limit documentation |

**Overall confidence:** HIGH

### Gaps to Address

- **OG image for individual articles** — Architecture doc does not specify. Correct v1.3 decision: reuse site-wide `og-image.jpg` for all articles. Per-article OG cards are Phase 2+ scope. Decide and document in Phase 1 scope.

- **BreadcrumbList JSON-LD on article pages** — Not in the architecture doc but is a standard SEO signal and low-cost addition in `ArticleLayout.astro`. Recommend including in Phase 1 scope alongside the Article and FAQPage schemas.

- **Blog discoverability from main site** — No `/blogg` link is in FloatingNav (correct — it would clutter nav before there is enough content). Recommendation: add blog link to Footer immediately; add a "Les fra bloggen" section on `/` or `/tjenester` after 5+ articles exist. Not blocking for v1.3 launch.

- **CI check name for branch protection rule** — Branch protection rule must reference the exact job name from `ci.yml`. Confirm the job name (likely `build`) before configuring the branch protection rule in Phase 3.

- **Quality gate calibration** — The LIX threshold change (45 to 55) and Claude scoring prompts should be validated against real Norwegian web articles before enabling the production cron. Manual test run recommended immediately after Phase 2 is complete.

---

## Sources

### Primary (HIGH confidence)
- `/Users/iverostensen/nettup/.planning/blog-milestone-architecture.md` — pre-resolved architectural decisions
- Codebase: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/layouts/BaseLayout.astro`, `.github/workflows/ci.yml` — direct inspection
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/) — Content Layer API, Astro 5 config path
- [@anthropic-ai/sdk on npm](https://www.npmjs.com/package/@anthropic-ai/sdk) — version 0.78.0 confirmed
- [@octokit/rest on npm](https://www.npmjs.com/package/@octokit/rest) — version 22.0.1 confirmed
- [tsx on npm](https://www.npmjs.com/package/tsx) — version 4.21.0 confirmed
- [GitHub Docs: auto-merge](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request) — branch protection requirement confirmed
- [Anthropic Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) — JSON schema compliance beta, Sonnet 4.5+

### Secondary (MEDIUM confidence)
- [GitHub community: GITHUB_TOKEN PR workflow trigger](https://github.com/orgs/community/discussions/65321) — PAT workaround confirmed
- [peter-evans/create-pull-request #48](https://github.com/peter-evans/create-pull-request/issues/48) — PAT workaround documented
- [Strapi GEO guide 2025](https://strapi.io/blog/generative-engine-optimization-geo-guide) — direct answer structure, FAQ for citations
- [Whitespark Local Search Ranking Factors 2026](https://whitespark.ca/local-search-ranking-factors/) — local SEO signals
- [LIX readability formula](https://readabilityformulas.com/the-lix-readability-formula/) — threshold scale and Norwegian applicability

### Tertiary (LOW confidence — validate during implementation)
- ALM Corp SEO Trends 2026 — AI Overview citation patterns
- 1702digital E-E-A-T 2026 — E-E-A-T as ranking filter

---
*Research completed: 2026-03-06*
*Ready for roadmap: yes*
