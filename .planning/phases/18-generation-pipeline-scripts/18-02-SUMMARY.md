---
phase: 18-generation-pipeline-scripts
plan: 02
subsystem: infra
tags: [anthropic-sdk, simple-git, octokit, blog-pipeline, quality-gate, github-pr]

# Dependency graph
requires:
  - phase: 18-01
    provides: config.ts, discover-topics.ts, generate-article.ts — pipeline stages 1-2

provides:
  - quality-gate.ts with two-pass review (AI + automated) returning QualityResult
  - optimize-seo.ts buildPrBody for GitHub PR body formatting
  - publish.ts for git branch + commit + push + PR creation via @octokit/rest
  - index.ts runnable pipeline entry point exiting 0 in all cases

affects:
  - 19-github-actions (consumes scripts/blog/index.ts as workflow command)

# Tech tracking
tech-stack:
  added: []  # simple-git and @octokit/rest were installed in 18-01
  patterns:
    - "Two-pass quality gate: AI review (avg >= 7) then automated checks"
    - "Inline lixScore function, LIX <= 55 for Norwegian technical content"
    - "Always-exit-0 pattern — rejection is expected flow, not CI failure"
    - "fileURLToPath + '../../../' anchors repo root for simple-git to avoid cwd dependency"
    - "GITHUB_REPOSITORY env var with fallback to git remote URL parsing"

key-files:
  created:
    - scripts/blog/quality-gate.ts
    - scripts/blog/optimize-seo.ts
    - scripts/blog/publish.ts
    - scripts/blog/index.ts
  modified: []

key-decisions:
  - "LIX threshold 55 (not 45) — Norwegian technical content needs wider margin, confirmed in STATE.md"
  - "Pass 2 automated checks only run if pass 1 passes — avoids wasted time on already-rejected articles"
  - "Queue updated inside runQualityGate on rejection — separation of concerns, index.ts does not duplicate queue logic"
  - "ArticleResult import in quality-gate.ts comes from generate-article.ts, not config.ts"

patterns-established:
  - "runQualityGate handles queue update on rejection internally"
  - "All pipeline errors logged with [ Stage ] label and writeJobSummary, then return (not throw)"
  - "process.exit(0) only in main() outer wrapper — never in pipeline logic"

requirements-completed: [PIPE-05, PIPE-06, PIPE-08]

# Metrics
duration: 3min
completed: 2026-03-06
---

# Phase 18 Plan 02: Generation Pipeline Scripts (Stages 3-5) Summary

**Two-pass quality gate (AI + automated), GitHub PR publisher, and pipeline orchestrator completing `npx tsx scripts/blog/index.ts` end-to-end**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-06T19:51:36Z
- **Completed:** 2026-03-06T19:54:17Z
- **Tasks:** 3
- **Files created:** 4

## Accomplishments

- quality-gate.ts: Claude AI review (6 criteria, avg >= 7) then automated checks (word count, LIX <= 55, FAQ section, Nettup mentions <= 2)
- publish.ts: creates `blogg/{slug}` branch, commits article file, pushes, opens GitHub PR via Octokit with quality scores in body
- index.ts: structured `[ Stage ]` progress labels, validates env vars early, exits 0 in all cases including missing API key

## Task Commits

Each task was committed atomically:

1. **Task 1: quality-gate.ts** - `0bc3705` (feat)
2. **Task 2: optimize-seo.ts + publish.ts** - `190274d` (feat)
3. **Task 3: index.ts orchestrator** - `3ab4f34` (feat)

## Files Created/Modified

- `scripts/blog/quality-gate.ts` - Two-pass review; inline lixScore with threshold 55; updates queue on rejection
- `scripts/blog/optimize-seo.ts` - buildPrBody formats AI scores and check results as PR markdown
- `scripts/blog/publish.ts` - Git branch/commit/push + GitHub PR via @octokit/rest; resolves repo root from fileURLToPath
- `scripts/blog/index.ts` - Pipeline entry point; stage labels; always exits 0

## Decisions Made

- Used `type ArticleResult` import from `generate-article.ts` in quality-gate.ts (config.ts does not export it — caught during implementation)
- LIX inline function duplicated in optimize-seo.ts (minor) to avoid cross-module import between sibling modules
- Pass 2 automated checks skipped on Pass 1 failure — avoids API cost for already-rejected articles

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed wrong import path for ArticleResult in quality-gate.ts**
- **Found during:** Task 1 (quality-gate.ts)
- **Issue:** Plan listed `ArticleResult` as importable from `config.ts`, but it is defined in `generate-article.ts`
- **Fix:** Changed import to `import type { ArticleResult } from './generate-article.ts'`
- **Files modified:** scripts/blog/quality-gate.ts
- **Verification:** `npx tsx -e "import { runQualityGate } from './scripts/blog/quality-gate.ts'; console.log('quality-gate loaded')"` passed
- **Committed in:** 0bc3705 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Necessary correctness fix. No scope creep.

## Issues Encountered

None beyond the auto-fixed import path above.

## User Setup Required

None — no new external service configuration required. ANTHROPIC_API_KEY and GITHUB_TOKEN are documented in the pipeline scripts themselves.

## Next Phase Readiness

- All 7 `scripts/blog/` files exist and load without errors
- `npx tsx scripts/blog/index.ts` exits 0 with clear error message when ANTHROPIC_API_KEY is missing
- Phase 19 (GitHub Actions) can wire `scripts/blog/index.ts` as the workflow command

---
*Phase: 18-generation-pipeline-scripts*
*Completed: 2026-03-06*
