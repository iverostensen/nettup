# Phase 19: GitHub Actions + Repo Config - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire the existing blog generation pipeline to run automatically every Monday at 08:00 UTC via GitHub Actions. Includes the cron workflow, required secrets, branch protection rules, and auto-merge configuration. No changes to the pipeline scripts themselves — this phase is pure infrastructure setup.

</domain>

<decisions>
## Implementation Decisions

### Auto-merge gating
- Required check for auto-merge: `Lint & Build` only (not Lighthouse — too slow/flaky)
- Blog PRs use squash merge — one clean commit per article on main
- Enable auto-merge at repo level via GitHub settings toggle; pipeline calls `gh pr merge --auto`
- If auto-merge fails (CI never runs), PR stays open indefinitely — manual intervention

### Failure notifications
- Job summary only — no Slack, no email, no external notifications
- Silent on success; job summary written on skip/rejection/error (already implemented in index.ts)
- Weekly cadence is fine — discovering a missed run next time checking GitHub is acceptable

### Branch protection rules
- Required status check: `Lint & Build` (exact job name from ci.yml)
- No PR review requirement — would block blog auto-merge
- Force pushes blocked on main
- Branches NOT required to be up to date before merging (blog branches always fresh from main)
- Admins bypass protection — retained ability to hotfix directly

### Workflow design
- Simple `workflow_dispatch` — no inputs, just "run now" button
- No dry-run mode — test locally with `npx tsx scripts/blog/index.ts`
- Workflow validates secrets presence before invoking pipeline (fail-fast with clear job summary)
- Concurrency group to prevent simultaneous runs — cancel-in-progress enabled

### Claude's Discretion
- Exact concurrency group name
- Node.js version and caching strategy in the blog workflow
- Commit message format for the blog branch before PR creation

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/blog/index.ts`: Already handles `GITHUB_STEP_SUMMARY`, uses `GITHUB_TOKEN` env var, always exits 0 — no changes needed
- `.github/workflows/ci.yml`: Existing CI with two jobs — `Lint & Build` (required) and `Lighthouse` (optional)

### Established Patterns
- CI uses `actions/checkout@v4`, `actions/setup-node@v4` with `cache: 'npm'`, Node 20
- `npm ci` for installing deps (not npm install)
- Existing workflow name: `CI`, existing job name: `Lint & Build` — branch protection rule must reference this exact string

### Integration Points
- New workflow `blog-generate.yml` triggers `npx tsx scripts/blog/index.ts`
- Pipeline reads `ANTHROPIC_API_KEY` and `GITHUB_TOKEN` (or `GH_PAT`) from env
- PAT (`GH_PAT`) needed instead of `GITHUB_TOKEN` because `GITHUB_TOKEN` cannot trigger CI on PRs it creates (GitHub loop-prevention)
- `publish.ts` uses `gh pr create` — will pick up the PAT from env if named `GITHUB_TOKEN`

</code_context>

<specifics>
## Specific Ideas

- Branch protection note from roadmap: auto-merge requires the branch protection rule to explicitly require the `Lint & Build` check — enabling the repo settings toggle alone is insufficient
- PAT scope: `contents: write` + `pull-requests: write`
- The PAT must be used for both checkout (to trigger CI) and `gh pr create` — not just one of them

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 19-github-actions-repo-config*
*Context gathered: 2026-03-06*
