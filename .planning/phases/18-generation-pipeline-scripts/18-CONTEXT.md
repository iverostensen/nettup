# Phase 18: Generation Pipeline Scripts - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

TypeScript pipeline scripts (`scripts/blog/`) that, when invoked via `npx tsx scripts/blog/index.ts`, select a topic, generate a Norwegian SEO article using Claude, gate it through a two-pass quality check, and open a GitHub PR — all without CI or cron involvement. Phase 19 wires this to GitHub Actions.

</domain>

<decisions>
## Implementation Decisions

### Topic Clusters
- Use the 4 clusters from the architecture doc as-is: "Priser og kostnader", "Teknologi-valg", "SMB-tips", "Lokal SEO"
- Article targets per cluster: Priser=5, Teknologi=4, SMB=5, Lokal SEO=3
- Claude picks the specific article angle based on cluster keywords + existing article list — no pre-seeded titles
- Cluster rotation: round-robin weighted by articles_target (clusters with most remaining capacity go first)

### Frontmatter Schema Alignment
- Use `date` (not `publishDate`) and `readTime` (not `estimatedReadTime`) — match the live `src/content/config.ts` exactly
- Write `faq[]` to BOTH frontmatter AND article body: pipeline writes the Q&A pairs to the `faq` frontmatter array AND renders a `## Vanlige spørsmål` section in the Markdown body (JSON-LD is built from frontmatter)
- Skip `author` and `tags` fields — not in the live schema, do not include them
- Two-call generation: call 1 returns the Markdown body only, call 2 reads the Markdown and returns structured metadata JSON (title, seoTitle, description, category, readTime, relatedSlugs, faq[]) — prevents JSON truncation on ~2000-word content

### Run Experience
- Structured progress steps printed to console: `[ Topic ]`, `[ Generate ]`, `[ Quality ]`, `[ PR ]` stages visible during execution
- Local runs: console output only (no local summary file)
- GitHub Actions runs: detect `GITHUB_ACTIONS` env var and write to `$GITHUB_STEP_SUMMARY`
- Dry-run mode: Claude's discretion on whether/how to implement

### Rejection Behavior
- On quality gate rejection: persist topic to `topics-queue.json` as `rejected` (with reason), then exit 0 — do not attempt a second topic in the same run
- Retry limit: 2 retries after initial rejection = 3 total attempts per topic; after 3 failures, mark as `permanently_rejected` and queue moves on
- When automated checks (pass 2) fail after Claude self-review passes: reject immediately, persist failure reason to queue; on retry, Claude sees the specific failure reason in the generation prompt

### Claude's Discretion
- Whether to implement a `--dry-run` flag (user deferred this)
- Exact console output formatting/colors within the structured-steps style
- LIX calculation implementation details (inline, no external dependency)
- Slug generation implementation (Norwegian-aware: æ→ae, ø→oe, å→aa)

</decisions>

<specifics>
## Specific Ideas

- Architecture doc has the full system prompt for generation and the review prompt for quality gate — use these as the starting point, not a blank slate
- LIX threshold is 55 (not 45 as shown in the architecture doc — Norwegian technical content needs the higher threshold; 45 causes systematic false rejections)
- relatedSlugs must be validated to exist in `src/content/blogg/` before the `.md` file is written — prevents build failures from dangling references
- `discover-topics.ts` must guard against `src/content/blogg/` not existing on first run
- All pipeline failures exit 0 — rejection is expected behavior, not a CI failure
- `topics-queue.json` format: `[{ slug, title, cluster, status: "pending"|"published"|"rejected"|"permanently_rejected", reason?, attempts, createdAt }]`

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@anthropic-ai/sdk` already in `dependencies` (not devDependencies) — Anthropic SDK is ready to use
- `src/content/config.ts`: defines the live Zod schema — pipeline must write frontmatter matching these exact fields: `title`, `seoTitle`, `category`, `date`, `readTime`, `description`, `relatedSlugs?`, `faq?[]`
- 3 seed articles in `src/content/blogg/` — duplicate detection must scan these on every run

### Established Patterns
- No `scripts/` directory exists yet — needs to be created from scratch
- `tsx` and `@octokit/rest` not yet in devDependencies — must be added
- The project uses `npm` (not bun/pnpm) — install with `npm i -D tsx @octokit/rest`

### Integration Points
- Pipeline writes `.md` files to `src/content/blogg/{slug}.md` — these are picked up by Astro's content collection at build time
- PR is opened on `blogg/{slug}` branch — Phase 19 configures auto-merge when CI passes
- `ANTHROPIC_API_KEY` and `GITHUB_TOKEN` are environment variables (not hardcoded) — script reads from `process.env`

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 18-generation-pipeline-scripts*
*Context gathered: 2026-03-06*
