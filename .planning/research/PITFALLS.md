# Pitfalls Research

**Domain:** Automated AI blog pipeline added to existing Astro 5 site
**Project:** Nettup.no v1.3 Automatisk Blogg
**Researched:** 2026-03-06
**Confidence:** HIGH (official docs, GitHub Issues, Anthropic API docs, community discussions)

---

## Critical Pitfalls

### Pitfall 1: Wrong Content Config File Location (Astro 5 Breaking Change)

**What goes wrong:**
`src/content/config.ts` is the Astro 4 location. In Astro 5, the config file must live at `src/content.config.ts` (one level up, outside the content directory). If you create `src/content/config.ts`, Astro 5 silently falls back to legacy mode — the collection still works, but you get deprecation warnings, type generation may be unreliable, and the collection uses the old `type: 'content'` API instead of the new Content Layer API.

The architecture doc specifies `src/content/config.ts`, which is the legacy location. This is correct only if you explicitly use `type: 'content'` in `defineCollection` (which the architecture doc does). Legacy collections MUST stay in `src/content/`. The distinction matters: legacy collections (type: 'content') go in `src/content/config.ts`; new Content Layer collections go in `src/content.config.ts`.

Since the architecture uses `type: 'content'` with zod, `src/content/config.ts` is intentional and correct for now — but this is a maintenance pitfall if Astro ever removes legacy support.

**Why it happens:**
Astro 5 migrated from the "Content Collections" API to the "Content Layer" API. The two coexist during a deprecation period. The blog-milestone-architecture.md specifies `type: 'content'` (legacy) at `src/content/config.ts`, which works in Astro 5 but relies on continued legacy support. New Content Layer APIs land at `src/content.config.ts` instead.

**How to avoid:**
Use the legacy approach exactly as specified in the architecture doc: `src/content/config.ts` with `type: 'content'`. Do NOT split across both locations. Do NOT mix legacy collections in `src/content/config.ts` with Content Layer collections in `src/content.config.ts` — this causes type generation failures. Run `astro sync` after creating the config file and verify that `.astro/types.d.ts` contains the `blogg` collection types before writing any pages.

**Warning signs:**
- TypeScript error: `Cannot find module 'astro:content'` — means `astro sync` hasn't run, or the config is in the wrong place
- No `.astro/` directory generated after `npm run dev`
- `ContentCollectionTypeMismatchError` at build time

**Phase to address:**
Phase 1 (Astro blog infrastructure). First step, before writing any page components.

---

### Pitfall 2: GITHUB_TOKEN Cannot Trigger CI on Its Own PR

**What goes wrong:**
The pipeline creates a PR using `GITHUB_TOKEN` via `gh pr create`. GitHub explicitly prevents `GITHUB_TOKEN`-created events from triggering `pull_request` workflows. This means when the bot creates the blog PR, none of the CI checks (Astro build, type check) run on it. Without required status checks passing, auto-merge either: (a) merges instantly without CI verification, or (b) auto-merge is enabled but no checks are "required" so it merges immediately regardless of whether the code compiles.

This is GitHub's built-in loop-prevention mechanism — not a bug, not configurable per-se.

**Why it happens:**
The auto-merge strategy requires "required status checks to pass." But if those checks never run (because the PR was created by a GITHUB_TOKEN action), GitHub considers the checks as "not applicable" rather than "passing." The auto-merge behavior with no-checks-ran depends on repo settings — it may merge immediately, which bypasses all quality assurance.

**How to avoid:**
Two options, in order of preference:

Option A (recommended): Use a GitHub App token or a Personal Access Token (PAT) stored as `secrets.GH_PAT` for the checkout and PR creation steps. Events triggered by a PAT or GitHub App token DO trigger other workflow runs. Set up a dedicated repo PAT with `contents: write` and `pull-requests: write` scopes.

Option B: Add `workflow_dispatch` trigger on the build workflow so it can be manually triggered, and add a step in the blog-generate workflow that explicitly calls `gh workflow run` after PR creation to trigger the CI check. This is fragile — the check name won't match what branch protection expects.

Option A is the correct fix. Configure it in Phase 3 when setting up the GitHub Action.

**Warning signs:**
- PRs created by the action show 0 required checks but merge anyway
- PR merges within seconds of creation (before any build could complete)
- Build workflow never appears in the PR's Checks tab

**Phase to address:**
Phase 3 (GitHub Action + repo config). Must decide PAT vs GITHUB_TOKEN before writing the workflow file.

---

### Pitfall 3: auto-merge Requires Branch Protection Rule on `main`, Not Just the Setting

**What goes wrong:**
You enable "Allow auto-merge" in repo settings, enable auto-merge on the PR via `gh pr merge --auto`, and then the PR never merges. GitHub auto-merge requires a branch protection rule on `main` with at least one required status check. Without this, auto-merge is "enabled" but has no condition to wait for — GitHub doesn't know when it's safe to merge. The PR just sits there.

**Why it happens:**
Most developers enable "Allow auto-merge" in settings and expect that's enough. The branch protection rule is a separate configuration step. Personal repos often have no branch protection rules (they were never needed before).

**How to avoid:**
In repo Settings → Branches → Add rule for `main`:
1. Enable "Require status checks to pass before merging"
2. Add the Astro build check as a required check (e.g., `build` — use the exact job name from the CI workflow)
3. Enable "Allow auto-merge" at the repo level

The required check name must match exactly what the CI workflow emits. If the CI job is named `build`, the required check must be `build`. If the check name changes in the workflow file, the branch protection rule must be updated too.

**Warning signs:**
- `gh pr merge --auto` returns success but PR never merges
- Auto-merge badge shows on PR but days pass without merge
- No "required" label on any checks in the PR

**Phase to address:**
Phase 3 (GitHub Action + repo config). Document the exact branch protection setup in the phase plan.

---

### Pitfall 4: Claude JSON Output Truncation Kills the Pipeline Silently

**What goes wrong:**
The generation script asks Claude for a structured JSON response containing `title`, `seoTitle`, `description`, `content` (1500-2500 words of Markdown), and `relatedSlugs`. The `content` field is large — a 2000-word article is ~12 000 characters of Markdown. At max_tokens limits or in rare model behavior, Claude may return a truncated response where the JSON is cut mid-string (`"content": "Hva koster...`). `JSON.parse()` throws. The pipeline crashes at a stage where it has already consumed API credits.

**Why it happens:**
Asking for a large JSON blob with a multi-kilobyte embedded field (the article content) in a single API call is inherently fragile. The content field must fit within the output token budget. Sonnet 4.6 has an 8K output token limit by default. At ~4 tokens/word for Norwegian, a 2000-word article is ~8000 tokens of content alone — leaving no budget for the JSON wrapper, title, description, and schema fields.

**How to avoid:**
Split the generation into two sequential API calls:
1. Call 1: Generate the article content as plain Markdown (not JSON). Set max_tokens to 8192. This avoids the JSON wrapper overhead.
2. Call 2: Pass the generated content back and ask for just the metadata JSON (`title`, `seoTitle`, `description`, `category`, `tags`, `estimatedReadTime`, `relatedSlugs`). Metadata is small — no truncation risk.

Alternatively, use Anthropic's Structured Outputs beta (requires `anthropic-beta: structured-outputs-2025-11-13` header, available on claude-sonnet-4-5 and later). This guarantees schema compliance via constrained decoding, eliminating `JSON.parse()` failures.

Regardless of approach: wrap all `JSON.parse()` calls in try/catch. If parsing fails, log the raw response and exit 0 (quality rejection, not pipeline failure). Never let a JSON parse error become a fatal exception in an unattended script.

**Warning signs:**
- Unhandled `SyntaxError: Unexpected end of JSON input` in workflow logs
- Pipeline fails after Stage 2 with no quality gate reason
- API credits consumed but no PR created and no job summary written

**Phase to address:**
Phase 2 (pipeline scripts). The `generate-article.ts` design must account for this before writing any code.

---

### Pitfall 5: Norwegian Compound Words Inflate LIX Score — False Rejections

**What goes wrong:**
The quality gate rejects articles with LIX > 45. Norwegian is a compounding language: "nettsidesøkemotoroptimalisering" (SEO for websites), "samarbeidsavtale" (collaboration agreement), "bedriftseier" (business owner) are all single words but count as "long words" (>6 characters) in the LIX formula. Technical content about web development — exactly what this blog covers — is disproportionately affected. A well-written, highly readable article about Wordpress may score LIX 50+ simply due to unavoidable technical vocabulary.

The target threshold of LIX ≤ 45 corresponds to "medium difficulty" in the standard scale. Norwegian newspaper articles typically score 40-50. A threshold of 45 will reject a significant fraction of legitimate technical content.

**Why it happens:**
LIX was designed for Swedish and validated on that corpus. Norwegian and Swedish have similar word-formation patterns, but technical Norwegian targeting non-technical SMB audiences is not equivalent to newspaper prose. The LIX formula counts any word over 6 characters as "long" — a blunt instrument for a compounding language.

**How to avoid:**
Raise the LIX threshold to ≤ 55 for technical content, not ≤ 45. The architecture doc targets ≤ 45, which is appropriate for fiction or consumer press but too aggressive for technical web content. A Norwegian web blog targeting SMB audiences will naturally use "nettsted," "SEO-strategi," "søkemotoroptimalisering," etc. — all >6 characters.

If strict readability enforcement is desired, combine LIX with sentence length: flag articles where BOTH LIX > 55 AND average sentence length > 20 words. Either alone is an unreliable signal. Alternatively, treat LIX as a soft warning (logged in job summary) rather than a hard rejection threshold.

**Warning signs:**
- Quality gate logs show most rejections are LIX-related, not editorial quality
- Claude's LLM review pass gives 8/10 but automated check rejects on LIX
- Articles about "WordPress vs Astro" consistently fail even with simple sentence structure

**Phase to address:**
Phase 2 (pipeline scripts, `quality-gate.ts`). Calibrate threshold before running in production. Suggested: change LIX threshold from 45 to 55, or make it a soft warning.

---

### Pitfall 6: `tsx` Not in devDependencies Causes Cold-Download on Every CI Run

**What goes wrong:**
The architecture doc correctly notes: "`tsx` must be added to devDependencies — do not rely on `npx tsx`." If the workflow uses `npx tsx scripts/blog/index.ts` without `tsx` in `package.json`, npm downloads `tsx` fresh on every workflow run. This adds 15-30 seconds per run, is fragile (npm registry downtime = broken pipeline), and can introduce unexpected version changes.

The current `package.json` does NOT include `tsx` in devDependencies. This will be the default state when Phase 2 begins.

**Why it happens:**
`npx` lazy-fetches packages on demand. It works locally because `tsx` is often cached globally. In CI's clean environment, there is no cache — every `npx tsx` is a fresh download.

**How to avoid:**
Add `tsx` to devDependencies explicitly: `npm install -D tsx`. The `npm ci` step in the workflow then installs it as part of the reproducible lockfile install. Use `node_modules/.bin/tsx` or just `tsx` (it's on PATH after `npm ci`) in the workflow step, not `npx tsx`.

**Warning signs:**
- Workflow step "Generate article" starts with npm downloading tsx
- Workflow time varies by 20-30s between runs
- Rare: pipeline fails because npx couldn't fetch tsx from registry

**Phase to address:**
Phase 2 (pipeline scripts). Add `tsx` to devDependencies as the very first step.

---

### Pitfall 7: Quality Gate Failures Email-Spamming the Owner

**What goes wrong:**
GitHub sends failure notification emails for every failed workflow run. The architecture intends for quality gate rejections to exit 0 (not a failure). If this is misimplemented — even one exit 1 from an unhandled exception instead of a graceful quality rejection — the owner starts receiving failure emails every Monday morning. This quickly trains the owner to ignore the emails, which means real failures (API key expired, build broken) get missed.

Additionally, even correctly-implemented exit 0 workflows send a "workflow succeeded" notification for scheduled workflows, which is also noise. GitHub provides no native way to suppress notifications for scheduled workflow successes — only custom per-notification settings in user profile, not per-workflow.

**Why it happens:**
Three distinct failure sources get conflated:
1. Expected: quality gate rejects the article (correct: exit 0, job summary written)
2. Unexpected: unhandled exception in the script (incorrect: unhandled throw = exit 1 = email)
3. Expected: API timeout or rate limit (must be handled: exit 0, log reason, retry next week)

Any unhandled exception in the orchestrator `index.ts` becomes an exit 1 and triggers an email.

**How to avoid:**
Wrap the entire `index.ts` orchestrator in a top-level try/catch. Catch all errors. For known transient errors (Claude API 429, 529, network timeout), exit 0 with a job summary entry: "Article generation skipped: API rate limit. Will retry next run." For unknown errors, write the full error to job summary but still consider exiting 0 (log but don't spam).

Structure:
```typescript
try {
  await runPipeline()
} catch (err) {
  await writeJobSummary(`Pipeline error: ${err.message}\n\`\`\`\n${err.stack}\n\`\`\``)
  process.exit(0) // silent failure — review job summary manually
}
```

For the owner's notification settings: set GitHub notification preferences to "Only notify on failure" for scheduled workflows via profile settings → notifications → GitHub Actions.

**Warning signs:**
- Any unguarded `throw` or unhandled `Promise.reject` in pipeline scripts
- `process.exit(1)` called anywhere except the PR creation step
- Quality gate's `if (score < 7) return false` not wrapped so that a scoring error triggers a rejection rather than an exception

**Phase to address:**
Phase 2 (pipeline scripts) for defensive coding. Phase 3 (GitHub Action) for workflow-level error handling and notification preferences.

---

### Pitfall 8: Shallow Clone Misses Existing Blog Files — Duplicate Detection Fails

**What goes wrong:**
Stage 1 (topic discovery) reads `src/content/blogg/` to build the existing articles index, which is passed to Claude to prevent duplicate topics. `actions/checkout@v4` defaults to `fetch-depth: 1` (shallow clone). After 50+ articles, a shallow clone may not include all blog files if they span many commits. Duplicate detection silently fails — Claude doesn't see articles from older commits and may regenerate similar topics.

More immediately: in the early weeks before any articles exist, the `src/content/blogg/` directory doesn't exist yet. The script must handle this gracefully (return empty array, not throw).

**Why it happens:**
`actions/checkout`'s default shallow clone is usually sufficient because you're working with the HEAD state of files — not git history. The issue is that blog files ARE at HEAD; they accumulate in the same directory in the same branch. A shallow clone still gets all files at HEAD, so this is less of a concern than for history-dependent operations. However, the directory non-existence case (before first article) is a real early-pipeline failure.

**How to avoid:**
In `discover-topics.ts`, always use `fs.existsSync('src/content/blogg')` before reading the directory. Return `[]` if the directory doesn't exist. This handles week 1 correctly.

For the shallow clone itself: `fetch-depth: 1` is fine here because you need file contents at HEAD, not git history. No need for `fetch-depth: 0`. Document this explicitly so the workflow isn't "fixed" unnecessarily.

**Warning signs:**
- `ENOENT: no such file or directory` on `src/content/blogg/` in the first pipeline run
- Claude generates an article with the same topic as a recently published one
- Stage 1 script throws instead of returning an empty existing-articles list

**Phase to address:**
Phase 2 (pipeline scripts, `discover-topics.ts`). Guard the directory read defensively from the start.

---

### Pitfall 9: `getStaticPaths` Params Key Must Match Filename Exactly

**What goes wrong:**
The article page uses `[...slug].astro`. In `getStaticPaths`, you must return `params: { slug: entry.slug }` where the key `slug` matches the `[...slug]` parameter name exactly. If you accidentally return `params: { id: entry.slug }` or `params: { slug: entry.slug.split('/').join('/') }`, Astro throws a build error. This is a TypeScript error at build time, not at runtime — so it breaks `npm run build` but not `npm run dev` (dev mode handles routing differently).

More critically: with `[...slug]` (rest param), the slug value can contain slashes. All generated blog slugs are flat (no subdirectory structure), so this is fine — but if a generated slug ever contains a `/`, Astro will create a nested route unexpectedly.

**Why it happens:**
The rest parameter `[...slug]` is for variable-depth routes. Using it for flat blog URLs is standard practice in Astro, but it's easy to confuse the params key name or assume slug values are safe.

**How to avoid:**
In `getStaticPaths`:
```typescript
export async function getStaticPaths() {
  const articles = await getCollection('blogg')
  return articles.map(entry => ({
    params: { slug: entry.slug },  // key must be 'slug' to match [...slug].astro
    props: { entry },
  }))
}
```

In `generate-article.ts`, enforce that slugs never contain `/`. The Norwegian slugify function (æ→ae, ø→oe, å→aa) must strip slashes. Add an assertion: `if (slug.includes('/')) throw new Error(...)`.

Run `astro build` after adding the first test article to verify the route generates correctly before deploying the pipeline.

**Warning signs:**
- `getStaticPaths` TypeScript error: "Property 'slug' does not exist on type Params"
- Build passes but article URL 404s in preview
- Unexpected nested routes under `/blogg/` in the sitemap

**Phase to address:**
Phase 1 (Astro blog infrastructure). Verify the dynamic route works with a manually-created test article before writing any pipeline scripts.

---

### Pitfall 10: `relatedSlugs` References Non-Existent Articles — Build Failure

**What goes wrong:**
`RelatedArticles.astro` reads `frontmatter.relatedSlugs` and calls `getEntry('blogg', slug)` for each. If Claude recommends a related article slug that doesn't exist in the collection (hallucinated slug, typo in generation, or an article that was previously published but then deleted), `getEntry` returns `undefined`. If the component then tries to render `entry.data.title`, it throws a runtime error that fails the build.

In the early pipeline (weeks 1-4), no existing articles exist, so Claude should not recommend any related slugs. But if the prompt doesn't make this conditional, Claude may hallucinate slug values anyway.

**Why it happens:**
Claude's recommended `relatedSlugs` are chosen from the `existingArticleSlugs` list passed in the prompt. If that list is empty (first run), the system prompt should instruct Claude to return `relatedSlugs: []`. In practice, LLMs sometimes generate plausible-looking values even when instructed not to.

**How to avoid:**
In `RelatedArticles.astro`, filter out any slug from `relatedSlugs` that returns `undefined` from `getEntry`. Never assume the slug exists:
```typescript
const resolved = (await Promise.all(
  relatedSlugs.map(s => getEntry('blogg', s))
)).filter(Boolean)
```

In `quality-gate.ts`, add an automated check: verify that all slugs in `relatedSlugs` exist in the current article index. Reject or strip invalid slugs before writing the file.

**Warning signs:**
- `TypeError: Cannot read properties of undefined (reading 'data')` in Astro build output
- Build fails only after a new auto-generated article is merged
- `getEntry` returns undefined for a slug in `relatedSlugs`

**Phase to address:**
Phase 1 (component design for `RelatedArticles.astro`) and Phase 2 (quality gate validation of relatedSlugs).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Single JSON API call for article + metadata | Simpler script | Truncation failures for long articles; fragile at max token limit | Never — split into two calls or use structured outputs |
| Hardcode `author: 'Iver Østensen'` in script instead of config | Avoids a config field | Author change requires code deploy | Acceptable for v1.3; move to config before adding multiple authors |
| `npx tsx` instead of installed `tsx` | No install step | Unpredictable versions, cold-download time in CI, registry dependency | Never in CI — add `tsx` to devDependencies |
| Exit 1 on quality rejection for visibility | Easier to notice rejections | Email spam every time Claude generates a mediocre article | Never — use exit 0 + job summary for rejections |
| Write article directly to `main` without PR | Skips merge ceremony | No audit trail, no CI verification, Vercel deploy on every push | Never — PR is the audit trail |
| LIX threshold 45 for all content | "Strict quality" | Rejects valid technical Norwegian content routinely | Never — raise to 55 for technical topics |
| Skip `astro sync` in Phase 1 verification | Faster iteration | Type errors in `[...slug].astro` not caught until build | Never — run `astro sync` and verify types before writing pages |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Astro Content Collections | Creating `src/content/config.ts` without running `astro sync` | Always run `astro sync` (or `npm run dev` which runs it) after creating config; verify `.astro/types.d.ts` contains collection types |
| Anthropic SDK | Relying on single JSON blob response for large articles | Split into two calls: content generation (plain markdown), metadata extraction (small JSON). Wrap in try/catch with graceful exit |
| GitHub Actions + GITHUB_TOKEN | Assuming GITHUB_TOKEN-created PRs trigger CI workflows | Use a PAT (`secrets.GH_PAT`) for checkout and PR creation; GITHUB_TOKEN cannot trigger downstream workflows |
| GitHub auto-merge | Enabling "Allow auto-merge" in settings and expecting it to work | Also create branch protection rule on `main` with at least one required status check; without a required check, auto-merge has no condition to wait for |
| `topics-queue.json` in git | Committing the file once and expecting the Action to update it | The Action must `git add scripts/blog/topics-queue.json && git commit && git push` to persist queue state between runs; without this, every run starts from an empty queue |
| Existing `@astrojs/sitemap` | Assuming blog pages auto-appear in sitemap | They do appear automatically IF the Astro build succeeds and the pages are in `getStaticPaths`. Verify sitemap includes `/blogg/...` URLs after first build. |
| Vercel deployment | Blog pages not appearing on production after auto-merge | Verify Vercel is connected to the `main` branch and auto-deploys on push; the PR merge triggers a Vercel deploy only if the integration is configured |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| `getCollection('blogg')` called in every component on every page | Builds slow as article count grows | Call `getCollection` once in `[...slug].astro` and `index.astro`; pass data via props, not re-fetching in child components | Noticeable at 50+ articles; significant at 200+ |
| No pagination on listing page | `/blogg` loads all article cards; large page weight after 50+ articles | Plan for pagination from the start; Astro has built-in `paginate()` helper in `getStaticPaths` | Significant at 50+ articles |
| Generating FAQPage JSON-LD by parsing Markdown at runtime | Build time increases as article count grows | Generate FAQPage schema during pipeline Stage 4 and embed it in frontmatter as a string field, not at build time | Build time impact noticeable at 100+ articles |
| Stage 1 reading all article files on every run | CI time grows linearly with article count | Already mitigated by topics-queue.json; use the queue as primary state and only read directory for deduplication | Noticeable at 500+ articles |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| `ANTHROPIC_API_KEY` in workflow env without secrets | API key exposed in workflow logs, repo | Always use `${{ secrets.ANTHROPIC_API_KEY }}` — never hardcode or commit |
| PAT with repo admin scope for PR creation | Over-privileged token; if leaked, full repo control | Scope PAT to `contents: write` + `pull-requests: write` only |
| Auto-merging without any CI check on the PR | Broken TypeScript or invalid frontmatter ships to production | Branch protection rule must require at least the Astro build check to pass before auto-merge |
| Generated article content not validated before write | Malformed frontmatter breaks the entire blog build | Validate frontmatter fields against schema before writing `.md` file; a single bad file fails `npm run build` for all blog pages |
| `topics-queue.json` writeable by Action with broad push permissions | Malicious actor with write access could manipulate queue | This is acceptable for a private repo; for a public repo, restrict who can trigger `workflow_dispatch` |

---

## "Looks Done But Isn't" Checklist

- [ ] **`astro sync` runs cleanly:** After creating `src/content/config.ts`, run `astro sync` and verify `.astro/types.d.ts` exports the `blogg` collection — TypeScript errors in pages are silently hidden until you check this
- [ ] **`getStaticPaths` params key matches filename:** `[...slug].astro` → params key must be `slug` — verify by running `astro build` with a test article, not just `astro dev`
- [ ] **CI triggers on auto-PR:** Create a test PR manually using the PAT to verify CI workflow runs and appears in the PR's Checks tab — GITHUB_TOKEN will NOT trigger it
- [ ] **Auto-merge condition is set:** After enabling auto-merge on a test PR, confirm it only merges AFTER the CI check passes, not immediately
- [ ] **Branch protection rule exists:** Check repo Settings → Branches → confirm `main` has a protection rule with the build check as required
- [ ] **`tsx` in devDependencies:** `npm ls tsx` shows it installed — not fetched via npx
- [ ] **Topics queue updates persist:** After a pipeline run, verify `scripts/blog/topics-queue.json` in the `main` branch reflects the new article as "published" — if it doesn't update, every run re-selects the same topics
- [ ] **`src/content/blogg/` non-existence handled:** Run the pipeline with no existing articles; Stage 1 must return `[]` not throw `ENOENT`
- [ ] **`relatedSlugs` validated before write:** Quality gate verifies all recommended slugs exist in the current article index
- [ ] **LIX threshold calibrated:** Run LIX check on 3 manually-written Norwegian web articles before setting the threshold; if all fail at ≤ 45, the threshold is too aggressive
- [ ] **Job summary written on rejection:** Quality gate rejection exits 0 AND writes a GitHub Actions job summary explaining the rejection reason — without the summary, silent failures are undetectable
- [ ] **Sitemap includes blog:** After first article publishes to `main`, check `nettup.no/sitemap-index.xml` to confirm blog URLs appear
- [ ] **Norwegian slugify is correct:** Verify `ø → oe`, `æ → ae`, `å → aa` (not `ø → o` which would create "ost" from "øst")

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong config location (Pitfall 1) | LOW | Move or rename file, run `astro sync`, clear `.astro/` cache |
| GITHUB_TOKEN blocks CI (Pitfall 2) | MEDIUM | Create PAT, add to secrets, update workflow to use it for checkout and gh commands |
| Auto-merge never fires (Pitfall 3) | LOW | Add branch protection rule with required status check in repo settings |
| JSON truncation crashes pipeline (Pitfall 4) | MEDIUM | Split generation into two API calls; add top-level try/catch to orchestrator |
| LIX false rejections (Pitfall 5) | LOW | Change threshold in quality-gate.ts from 45 to 55; redeploy |
| `tsx` not in devDependencies (Pitfall 6) | LOW | `npm install -D tsx`, commit package.json and package-lock.json |
| Email spam from failures (Pitfall 7) | LOW | Add top-level try/catch to orchestrator, ensure exit 0 on all known failure modes |
| Directory non-existence crash (Pitfall 8) | LOW | Add `fs.existsSync` guard in discover-topics.ts |
| Wrong params key (Pitfall 9) | LOW | Fix key name in getStaticPaths; rebuild |
| relatedSlugs build failure (Pitfall 10) | LOW | Add filter(Boolean) in RelatedArticles.astro; add slug validation in quality gate |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Content config location (1) | Phase 1 | `astro sync` succeeds; `.astro/types.d.ts` has `blogg` types |
| GITHUB_TOKEN blocks CI (2) | Phase 3 | Create test PR with PAT; CI workflow appears in PR Checks tab |
| Auto-merge requires branch protection (3) | Phase 3 | Test PR merges only after CI check passes, not immediately |
| JSON truncation (4) | Phase 2 | Test generation with 2000+ word article; parse succeeds |
| LIX false rejections (5) | Phase 2 | Run LIX check on 5 sample Norwegian tech articles; calibrate threshold |
| tsx not installed (6) | Phase 2 | `npm ls tsx` shows package installed; `npm ci` installs it |
| Email spam on failures (7) | Phase 2 + Phase 3 | Trigger a deliberate quality failure; confirm exit 0 + job summary, no CI failure email |
| Directory non-existence crash (8) | Phase 2 | Run pipeline with empty `src/content/blogg/`; Stage 1 returns `[]` |
| getStaticPaths params key (9) | Phase 1 | `astro build` succeeds with test article; URL resolves in preview |
| relatedSlugs build failure (10) | Phase 1 + Phase 2 | Add article with invalid relatedSlug; build still succeeds |

---

## Sources

- Astro 5 upgrade docs: https://docs.astro.build/en/guides/upgrade-to/v5/ — config location change confirmed
- Astro error reference: https://docs.astro.build/en/reference/errors/generate-content-types-error/ — type generation failure modes
- GitHub community: https://github.com/orgs/community/discussions/65321 — GITHUB_TOKEN PR cannot trigger workflows
- GitHub Docs auto-merge: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request — branch protection requirement confirmed
- peter-evans/create-pull-request issue #48: https://github.com/peter-evans/create-pull-request/issues/48 — PAT workaround documented
- Anthropic Structured Outputs: https://platform.claude.com/docs/en/build-with-claude/structured-outputs — JSON schema compliance beta, Sonnet 4.5+
- Claude API rate limits: https://platform.claude.com/docs/en/api/rate-limits — retry-after header, 429/529 error codes
- LIX readability formula: https://readabilityformulas.com/the-lix-readability-formula/ — threshold scale, Norwegian applicability
- Wikipedia LIX: https://en.wikipedia.org/wiki/Lix_(readability_test) — LIX formula and standard thresholds
- Codebase: `package.json` — tsx not in devDependencies (confirmed gap)
- Codebase: `astro.config.mjs` — `output: 'static'`, no content collections configured yet
- Codebase: `src/content/` directory does not exist — pipeline starts from scratch

---
*Pitfalls research for: Automated AI blog pipeline added to existing Astro 5 site (v1.3)*
*Researched: 2026-03-06*
