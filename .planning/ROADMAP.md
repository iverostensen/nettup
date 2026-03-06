# Roadmap: Nettup.no

## Milestones

- ✅ **v1.0 Launch** — Phases 1-4 (shipped 2026-03-04)
- ✅ **v1.1 Tjenesteutvidelse** — Phases 6-12 (shipped 2026-03-06)
- ✅ **v1.2 Smart Priskalkulator** — Phases 13-16.1 (shipped 2026-03-06)
- 🚧 **v1.3 Automatisk Blogg** — Phases 17-19 (in progress)

## Phases

<details>
<summary>✅ v1.0 Launch (Phases 1-4) — SHIPPED 2026-03-04</summary>

- [x] Phase 1: Brand Identity (4/4 plans) — completed 2026-03-03
- [x] Phase 2: Animation & Interaction (3/3 plans) — completed 2026-03-03
- [x] Phase 2.1: Hero animation rework — delivery story (2/2 plans) — completed 2026-03-03 (INSERTED)
- [x] Phase 3: SEO & Portfolio (4/4 plans) — completed 2026-03-04
- [x] Phase 4: Conversion Optimization (2/2 plans) — completed 2026-03-04

See archive: `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>✅ v1.1 Tjenesteutvidelse (Phases 6-12) — SHIPPED 2026-03-06</summary>

- [x] Phase 6: Infrastructure (3/3 plans) — completed 2026-03-04
- [x] Phase 7: Tjenesteoversikt (2/2 plans) — completed 2026-03-05
- [x] Phase 8: Core Service Pages (3/3 plans) — completed 2026-03-05
- [x] Phase 9: Specialist Service Pages (5/5 plans) — completed 2026-03-05
- [x] Phase 10: Cross-linking & Validation (2/2 plans) — completed 2026-03-05
- [x] Phase 11: Enhanced Price Calculator (1/1 plan) — completed 2026-03-05
- [x] Phase 12: AI Chatbot Widget (2/2 plans) — completed 2026-03-06

See archive: `.planning/milestones/v1.1-ROADMAP.md`

</details>

<details>
<summary>✅ v1.2 Smart Priskalkulator (Phases 13-16.1) — SHIPPED 2026-03-06</summary>

- [x] Phase 13: Pricing Config and Calculation Engine (2/2 plans) — completed 2026-03-06
- [x] Phase 14: Wizard Steps and State (2/2 plans) — completed 2026-03-06
- [x] Phase 15: Result Display (1/1 plan) — completed 2026-03-06
- [x] Phase 16: Page Integration and Swap (1/1 plan) — completed 2026-03-06
- [x] Phase 16.1: Remove per-item pricing from wizard (1/1 plan) — completed 2026-03-06 (INSERTED)

See archive: `.planning/milestones/v1.2-ROADMAP.md`

</details>

### 🚧 v1.3 Automatisk Blogg (In Progress)

**Milestone Goal:** Automatisert SEO-blogg som publiserer 1 artikkel/uke uten manuell innsats — GitHub Actions + Claude API + Astro Content Collections.

- [x] **Phase 17: Astro Blog Infrastructure** - Content collection schema, listing page, article pages, and all blog components
- [x] **Phase 18: Generation Pipeline Scripts** - Topic selection, content generation, quality gate, and PR-based publish flow (completed 2026-03-06)
- [ ] **Phase 19: GitHub Actions + Repo Config** - Cron workflow, secrets, branch protection, and auto-merge

## Phase Details

### Phase 17: Astro Blog Infrastructure
**Goal**: Visitors can browse and read blog articles at fully functional `/blogg` and `/blogg/[slug]` URLs with complete SEO structure, structured data, and related article linking — verifiable via `astro build` with manually-created seed articles
**Depends on**: Nothing (first phase of v1.3)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07
**Notes**: Use `src/content/config.ts` (legacy Content Collections path, intentional for v1.3). Run `astro sync` immediately after creating the config to generate `.astro/types.d.ts` before writing any page components. OG images reuse site-wide `og-image.jpg` — per-article OG cards deferred to v2. `relatedSlugs` in `RelatedArticles.astro` must filter `undefined` entries to prevent build failures.
**Success Criteria** (what must be TRUE):
  1. Visitor can navigate to `/blogg` and see a list of articles with title, category, date, and read time for each
  2. Visitor can click an article and read the full formatted content at `/blogg/[slug]` with an H1 (conversational title) distinct from the `<title>` tag (keyword-first seoTitle)
  3. Article pages include Article JSON-LD, FAQPage JSON-LD, and BreadcrumbList JSON-LD visible in page source
  4. Article pages display 2-3 related articles in a "Les også" section when `relatedSlugs` are configured
  5. Blog is linked from the site footer and `astro build` completes without errors
**Plans**: 2 plans

Plans:
- [x] 17-01-PLAN.md — Content schema (legacy API), astro.config.mjs legacy flag, ArticleCard and RelatedArticles components
- [x] 17-02-PLAN.md — Listing page, dynamic article page, footer link, BaseLayout pageLabels, 3 seed articles + build verification

### Phase 18: Generation Pipeline Scripts
**Goal**: Running `npx tsx scripts/blog/index.ts` locally produces a Norwegian SEO article, passes a two-pass quality gate, and opens a GitHub PR — without any CI or cron involvement
**Depends on**: Phase 17
**Requirements**: PIPE-01, PIPE-02, PIPE-03, PIPE-04, PIPE-05, PIPE-06, PIPE-07, PIPE-08, PIPE-09
**Notes**: LIX threshold is ≤ 55 (not 45) — Norwegian technical content is a compounding language; 45 causes systematic false rejections. Article generation uses two sequential Claude API calls: first for Markdown content, second for metadata JSON — prevents JSON truncation on the ~2000-word content field. `tsx` and `@octokit/rest` must be added to devDependencies (not cold-downloaded via npx). `discover-topics.ts` must guard against `src/content/blogg/` not existing on first run. Quality gate validates `relatedSlugs` exist before writing the `.md` file. All pipeline failures exit 0 with a job summary — never exit 1.
**Success Criteria** (what must be TRUE):
  1. `npx tsx scripts/blog/index.ts` selects a topic from configured clusters and skips any slug that already exists in `src/content/blogg/`
  2. The script generates a 1500-2500 word Norwegian article containing a "Vanlige spørsmål" section with 3-5 Q&A pairs and natural internal links to Nettup service pages
  3. The quality gate runs two passes (Claude self-review scoring 6 criteria avg ≥ 7, plus automated checks: word count, LIX ≤ 55, FAQ presence, Nettup mentions ≤ 2) and either approves or rejects with a written reason — exiting 0 in both cases
  4. On approval, a GitHub PR is created on a `blogg/*` branch with quality scores in the PR body — no direct commit to `main`
  5. Rejected topics are persisted to `topics-queue.json` and will be retried before new topics are generated on the next run
**Plans**: 2 plans

Plans:
- [ ] 18-01-PLAN.md — Package.json deps, config.ts (clusters + SERVICE_PAGES), discover-topics.ts, generate-article.ts
- [ ] 18-02-PLAN.md — quality-gate.ts, optimize-seo.ts, publish.ts, index.ts orchestrator

### Phase 19: GitHub Actions + Repo Config
**Goal**: A blog article is generated and published automatically every Monday at 08:00 UTC — no manual action required after setup
**Depends on**: Phase 18
**Requirements**: CI-01, CI-02, CI-03, CI-04
**Notes**: GITHUB_TOKEN cannot trigger CI on its own PRs (GitHub loop-prevention). A PAT with `contents: write` + `pull-requests: write` scope must be stored as `secrets.GH_PAT` and used for both checkout and `gh pr create`. Auto-merge requires a branch protection rule on `main` requiring the `build` check — enabling the settings toggle alone is insufficient. Verify the exact job name in `.github/workflows/ci.yml` before configuring the branch protection rule.
**Success Criteria** (what must be TRUE):
  1. Every Monday at 08:00 UTC, the workflow runs automatically without any manual trigger and produces either a new PR or a job summary explaining why generation was skipped
  2. Workflow can also be triggered manually via `workflow_dispatch` from the GitHub Actions UI
  3. When the quality gate rejects an article, the workflow exits with code 0, writes a job summary with the rejection reason, and does not send a CI failure notification
  4. When CI passes on a pipeline PR, the PR auto-merges and Vercel deploys the new article live
**Plans**: TBD

Plans:
- [ ] 19-01: blog-generate.yml workflow, repo secrets (ANTHROPIC_API_KEY, GH_PAT), branch protection rule, auto-merge settings

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Brand Identity | v1.0 | 4/4 | Complete | 2026-03-03 |
| 2. Animation & Interaction | v1.0 | 3/3 | Complete | 2026-03-03 |
| 2.1. Hero animation rework | v1.0 | 2/2 | Complete | 2026-03-03 |
| 3. SEO & Portfolio | v1.0 | 4/4 | Complete | 2026-03-04 |
| 4. Conversion Optimization | v1.0 | 2/2 | Complete | 2026-03-04 |
| 6. Infrastructure | v1.1 | 3/3 | Complete | 2026-03-04 |
| 7. Tjenesteoversikt | v1.1 | 2/2 | Complete | 2026-03-05 |
| 8. Core Service Pages | v1.1 | 3/3 | Complete | 2026-03-05 |
| 9. Specialist Service Pages | v1.1 | 5/5 | Complete | 2026-03-05 |
| 10. Cross-linking & Validation | v1.1 | 2/2 | Complete | 2026-03-05 |
| 11. Enhanced Price Calculator | v1.1 | 1/1 | Complete | 2026-03-05 |
| 12. AI Chatbot Widget | v1.1 | 2/2 | Complete | 2026-03-06 |
| 13. Pricing Config and Calculation Engine | v1.2 | 2/2 | Complete | 2026-03-06 |
| 14. Wizard Steps and State | v1.2 | 2/2 | Complete | 2026-03-06 |
| 15. Result Display | v1.2 | 1/1 | Complete | 2026-03-06 |
| 16. Page Integration and Swap | v1.2 | 1/1 | Complete | 2026-03-06 |
| 16.1. Remove per-item pricing from wizard | v1.2 | 1/1 | Complete | 2026-03-06 |
| 17. Astro Blog Infrastructure | v1.3 | Complete    | 2026-03-06 | 2026-03-06 |
| 18. Generation Pipeline Scripts | 2/2 | Complete   | 2026-03-06 | - |
| 19. GitHub Actions + Repo Config | v1.3 | 0/1 | Not started | - |
