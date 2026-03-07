---
phase: 18-generation-pipeline-scripts
plan: 01
subsystem: infra
tags: [anthropic, tsx, typescript, blog, pipeline, content-generation]

requires:
  - phase: 17-astro-blog-infrastructure
    provides: src/content/config.ts Zod schema (title, seoTitle, date, readTime, description, relatedSlugs, faq)

provides:
  - scripts/blog/config.ts with CLUSTERS, SERVICE_PAGES, CLAUDE_MODEL, QueueEntry, ArticleMetadata, norwegianSlugify
  - scripts/blog/topics-queue.json empty queue for first run
  - scripts/blog/discover-topics.ts with selectTopic(), readQueue(), writeQueue(), readExistingSlugs()
  - scripts/blog/generate-article.ts with generateArticle(), buildFrontmatter(), ArticleResult

affects:
  - 18-02 (quality-gate, publish, index orchestrator depend on these modules)
  - 19-github-actions (uses npx tsx scripts/blog/index.ts entrypoint)

tech-stack:
  added:
    - tsx@4.21.0 (devDependency — TypeScript runner for scripts)
    - "@octokit/rest@22.0.1" (devDependency — GitHub PR creation in later plans)
    - "simple-git@3.27.0" (devDependency — git operations for publish.ts)
  patterns:
    - Two-call Claude pattern (body generation then metadata extraction) to prevent JSON truncation
    - Queue-first retry: rejected entries retry before new topic generation
    - Round-robin cluster selection weighted by remaining capacity vs articles_target
    - norwegianSlugify: æ→ae, ø→oe, å→aa for URL-safe slugs

key-files:
  created:
    - scripts/blog/config.ts
    - scripts/blog/topics-queue.json
    - scripts/blog/discover-topics.ts
    - scripts/blog/generate-article.ts
  modified:
    - package.json (three devDependencies added)

key-decisions:
  - "CLAUDE_MODEL = 'claude-sonnet-4-6' — matches model used in architecture doc, critical for cost estimates"
  - "buildFrontmatter writes only date/readTime (not publishDate/estimatedReadTime) to match live Zod schema"
  - "relatedSlugs filtered post-generation against actual existing slugs — prevents broken references"
  - "topics-queue.json resolved via import.meta.url so it works from any cwd"

patterns-established:
  - "config.ts is the single source of truth for all types and constants imported by pipeline scripts"
  - "readQueue() returns [] on missing file — safe for first run without ENOENT crash"

requirements-completed:
  - PIPE-01
  - PIPE-02
  - PIPE-03
  - PIPE-04
  - PIPE-07
  - PIPE-09

duration: 10min
completed: 2026-03-06
---

# Phase 18 Plan 01: Generation Pipeline Scripts — Stages 1-2 Summary

**Pipeline foundation with two-call Claude generation, Norwegian-aware topic selection queue, and schema-aligned frontmatter builder**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-06T19:52:47Z
- **Completed:** 2026-03-06T20:02:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Created `scripts/blog/config.ts` as foundational type/constant module for the entire pipeline
- Implemented `discover-topics.ts` with queue-first retry logic, duplicate-aware slug detection, and Claude-powered topic angle selection
- Implemented `generate-article.ts` with two-call Claude pattern and frontmatter builder that matches the live Zod schema exactly

## Task Commits

1. **Task 1: Install devDependencies + config.ts + topics-queue.json** - `af6bd8d` (chore)
2. **Task 2: discover-topics.ts** - `6f1b845` (feat)
3. **Task 3: generate-article.ts** - `d094501` (feat)

## Files Created/Modified

- `scripts/blog/config.ts` - CLAUDE_MODEL, CLUSTERS, SERVICE_PAGES, QueueEntry, ArticleMetadata, norwegianSlugify
- `scripts/blog/topics-queue.json` - Empty array for first-run safety
- `scripts/blog/discover-topics.ts` - Stage 1: topic selection, queue I/O, duplicate detection
- `scripts/blog/generate-article.ts` - Stage 2: two-call Claude generation, buildFrontmatter
- `package.json` - tsx, @octokit/rest, simple-git added to devDependencies

## Decisions Made

- `buildFrontmatter` writes `date` and `readTime` (matching live Zod schema from Phase 17), never `publishDate`, `author`, `tags`, or `estimatedReadTime` — these fields would break `astro build`
- `relatedSlugs` are filtered after Call 2 against actual slugs on disk — no throwing, silent filter
- `topics-queue.json` path resolved via `import.meta.url` for cwd-independence

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required beyond ANTHROPIC_API_KEY already in use.

## Next Phase Readiness

- All Stage 1-2 modules importable and verified
- Plan 18-02 can import from config.ts, discover-topics.ts, and generate-article.ts
- topics-queue.json will be created on first run if missing (readQueue is ENOENT-safe)

---
*Phase: 18-generation-pipeline-scripts*
*Completed: 2026-03-06*

## Self-Check: PASSED

- scripts/blog/config.ts: FOUND
- scripts/blog/topics-queue.json: FOUND
- scripts/blog/discover-topics.ts: FOUND
- scripts/blog/generate-article.ts: FOUND
- Commit af6bd8d: FOUND
- Commit 6f1b845: FOUND
- Commit d094501: FOUND
