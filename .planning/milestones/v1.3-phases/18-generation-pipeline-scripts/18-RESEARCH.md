# Phase 18: Generation Pipeline Scripts - Research

**Researched:** 2026-03-06
**Domain:** TypeScript CLI pipeline — Claude API content generation, quality gating, Git operations, GitHub PR creation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Topic Clusters**
- Use the 4 clusters from the architecture doc as-is: "Priser og kostnader", "Teknologi-valg", "SMB-tips", "Lokal SEO"
- Article targets per cluster: Priser=5, Teknologi=4, SMB=5, Lokal SEO=3
- Claude picks the specific article angle based on cluster keywords + existing article list — no pre-seeded titles
- Cluster rotation: round-robin weighted by articles_target (clusters with most remaining capacity go first)

**Frontmatter Schema Alignment**
- Use `date` (not `publishDate`) and `readTime` (not `estimatedReadTime`) — match the live `src/content/config.ts` exactly
- Write `faq[]` to BOTH frontmatter AND article body: pipeline writes the Q&A pairs to the `faq` frontmatter array AND renders a `## Vanlige spørsmål` section in the Markdown body (JSON-LD is built from frontmatter)
- Skip `author` and `tags` fields — not in the live schema, do not include them
- Two-call generation: call 1 returns the Markdown body only, call 2 reads the Markdown and returns structured metadata JSON (title, seoTitle, description, category, readTime, relatedSlugs, faq[]) — prevents JSON truncation on ~2000-word content

**Run Experience**
- Structured progress steps printed to console: `[ Topic ]`, `[ Generate ]`, `[ Quality ]`, `[ PR ]` stages visible during execution
- Local runs: console output only (no local summary file)
- GitHub Actions runs: detect `GITHUB_ACTIONS` env var and write to `$GITHUB_STEP_SUMMARY`
- Dry-run mode: Claude's discretion on whether/how to implement

**Rejection Behavior**
- On quality gate rejection: persist topic to `topics-queue.json` as `rejected` (with reason), then exit 0 — do not attempt a second topic in the same run
- Retry limit: 2 retries after initial rejection = 3 total attempts per topic; after 3 failures, mark as `permanently_rejected` and queue moves on
- When automated checks (pass 2) fail after Claude self-review passes: reject immediately, persist failure reason to queue; on retry, Claude sees the specific failure reason in the generation prompt

### Claude's Discretion
- Whether to implement a `--dry-run` flag (user deferred this)
- Exact console output formatting/colors within the structured-steps style
- LIX calculation implementation details (inline, no external dependency)
- Slug generation implementation (Norwegian-aware: æ→ae, ø→oe, å→aa)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PIPE-01 | Pipeline selects a topic from configured clusters, skipping slugs that already exist | `discover-topics.ts` reads `src/content/blogg/` + `topics-queue.json`; guard against directory not existing on first run |
| PIPE-02 | Pipeline generates a 1500–2500 word Norwegian article using Claude Sonnet 4.6 | `@anthropic-ai/sdk` v0.78.0 already in dependencies; two-call pattern via `client.messages.create()` |
| PIPE-03 | Every generated article includes a "Vanlige spørsmål" section with 3–5 Q&A pairs | Written to both Markdown body (`## Vanlige spørsmål`) and `faq[]` frontmatter field |
| PIPE-04 | Generated articles include natural internal links to Nettup service pages and existing articles | SERVICE_PAGES list + existing article slugs passed in system prompt; `relatedSlugs` validated before write |
| PIPE-05 | AI review pass scores article ≥ 7/10 average across 6 editorial criteria | `quality-gate.ts` pass 1: Claude self-review prompt; 6 criteria, avg ≥ 7 required |
| PIPE-06 | Automated checks verify word count ≥ 1500, LIX ≤ 55, FAQ present, Nettup mentions ≤ 2 | `quality-gate.ts` pass 2: inline LIX formula (no external dep); regex/count checks |
| PIPE-07 | Failed topic attempts are persisted to `topics-queue.json` and retried on next run | Queue format: `[{ slug, title, cluster, status, reason?, attempts, createdAt }]`; retry before new topics |
| PIPE-08 | Pipeline creates a GitHub PR with quality scores in the PR body — never commits directly to `main` | `simple-git` for branch/commit/push; `@octokit/rest` v22 for PR creation |
| PIPE-09 | Topic clusters are configurable via `scripts/blog/config.ts` (editorial direction controlled by Nettup) | `scripts/blog/config.ts` exports cluster array; all other modules import from it |

</phase_requirements>

## Summary

Phase 18 builds the TypeScript CLI pipeline that orchestrates the complete article generation loop. The pipeline runs as `npx tsx scripts/blog/index.ts`, executing 5 stages sequentially: topic selection, content generation (two Claude API calls), quality gating (Claude self-review + automated checks), and PR creation. No CI or cron is involved — Phase 19 wires those.

The core technical stack is already partially in place: `@anthropic-ai/sdk` v0.78.0 is already in `dependencies`. Two new devDependencies are required — `tsx` (v4.21.0, the TypeScript runner) and `@octokit/rest` (v22.0.1, for GitHub PR creation). The architecture doc in `.planning/blog-milestone-architecture.md` also shows `simple-git` being used for branch/commit/push operations; this is a third dependency to add. All scripts live under a new `scripts/blog/` directory that does not yet exist.

The most critical constraint is schema alignment: the live `src/content/config.ts` uses `date` and `readTime` fields (not the `publishDate`/`estimatedReadTime`/`author`/`tags` fields shown in the architecture doc's earlier draft). The pipeline must write frontmatter that matches the live Zod schema exactly or the Astro build will fail. The two-call generation pattern (body first, metadata second) is locked to prevent JSON truncation on ~2000-word content.

**Primary recommendation:** Build the 7-file pipeline (`config.ts`, `discover-topics.ts`, `generate-article.ts`, `quality-gate.ts`, `optimize-seo.ts`, `publish.ts`, `index.ts`) sequentially, with `config.ts` and the queue schema defined first, so all other modules have stable imports.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@anthropic-ai/sdk` | 0.78.0 (already installed) | Claude API calls for generation + review | Already in `dependencies`; `client.messages.create()` is the canonical non-streaming API |
| `tsx` | 4.21.0 | Run TypeScript files directly with Node.js | esbuild-powered; recommended runner for Node 20+ in 2025; replaces ts-node for ESM |
| `@octokit/rest` | 22.0.1 | GitHub REST API — PR creation | Official GitHub SDK; `octokit.pulls.create()` is the correct method |
| `simple-git` | 3.32.3 | Git branch creation, commit, push | Fluent async wrapper around git CLI; avoids shelling out manually |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Node.js `fs/promises` | built-in | Read/write `topics-queue.json`, article `.md` files | All file I/O — no external dep needed |
| Node.js `path` | built-in | Cross-platform path joining | Resolving `src/content/blogg/` paths |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `simple-git` | Raw `child_process.exec('git ...')` | `simple-git` provides typed promises; raw exec works but is fragile on errors |
| `@octokit/rest` | GitHub CLI via `child_process` | `@octokit/rest` gives typed response, no PATH dependency, works in CI natively |
| `tsx` | `ts-node` | `tsx` works with Node 20 ESM; `ts-node` has ESM conflicts on this project |

**Installation:**
```bash
npm i -D tsx @octokit/rest simple-git
```

## Architecture Patterns

### Recommended Project Structure
```
scripts/
└── blog/
    ├── config.ts           # Topic clusters + SERVICE_PAGES (PIPE-09)
    ├── topics-queue.json   # Persistent queue file (committed to repo)
    ├── discover-topics.ts  # Stage 1: topic selection + duplicate check (PIPE-01, PIPE-07)
    ├── generate-article.ts # Stage 2: two-call Claude generation (PIPE-02, PIPE-03, PIPE-04)
    ├── quality-gate.ts     # Stage 3: Claude self-review + automated checks (PIPE-05, PIPE-06)
    ├── optimize-seo.ts     # Stage 4: schema building (consumed by publish.ts)
    ├── publish.ts          # Stage 5: git branch + commit + PR (PIPE-08)
    └── index.ts            # Orchestrator — runs stages, prints progress, exits 0
```

### Pattern 1: Two-Call Claude Generation
**What:** First call returns Markdown body only. Second call takes the Markdown and returns structured JSON metadata (title, seoTitle, description, category, readTime, relatedSlugs, faq[]).
**When to use:** Whenever LLM output mixes long free-text with structured JSON — prevents the JSON being truncated by output token limits.
**Example:**
```typescript
// Source: Anthropic SDK README + CONTEXT.md locked decision
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Call 1: Get Markdown body
const bodyResponse = await client.messages.create({
  model: 'claude-sonnet-4-6',  // NOTE: use the exact model ID from CONTEXT
  max_tokens: 4096,
  system: systemPrompt,
  messages: [{ role: 'user', content: `Skriv en artikkel om: ${topic}` }],
});
const markdownBody = (bodyResponse.content[0] as Anthropic.TextBlock).text;

// Call 2: Extract metadata from the written body
const metaResponse = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{
    role: 'user',
    content: `Basert på denne artikkelen, returner kun JSON:\n\n${markdownBody}`
  }],
});
const metadata = JSON.parse((metaResponse.content[0] as Anthropic.TextBlock).text);
```

### Pattern 2: Queue-First Topic Selection
**What:** On every run, check `topics-queue.json` for any `pending` or `rejected` (under retry limit) topics before generating a new one. Round-robin cluster rotation based on remaining capacity.
**When to use:** Before calling Claude for generation.
**Example:**
```typescript
// Source: CONTEXT.md specifics
interface QueueEntry {
  slug: string;
  title: string;
  cluster: string;
  status: 'pending' | 'published' | 'rejected' | 'permanently_rejected';
  reason?: string;
  attempts: number;
  createdAt: string;
}

// Priority: retryable rejected topics first, then new topic from cluster with most remaining capacity
const RETRY_LIMIT = 3;  // 1 initial + 2 retries
```

### Pattern 3: Exit-0 Error Handling
**What:** All pipeline failures (rejection, missing env vars, API errors) must exit with code 0. Errors are printed to console and, when `GITHUB_ACTIONS` env var is set, written to `$GITHUB_STEP_SUMMARY`.
**When to use:** Every error path in `index.ts`.
**Example:**
```typescript
// Source: CONTEXT.md specifics + REQUIREMENTS.md CI-03 (implemented in Phase 19, but pattern set here)
function writeJobSummary(content: string) {
  if (process.env.GITHUB_ACTIONS && process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, content + '\n');
  }
}

// In index.ts: wrap entire pipeline in try/catch, always process.exit(0)
try {
  await runPipeline();
} catch (err) {
  console.error('Pipeline failed:', err);
  writeJobSummary(`## Pipeline Error\n\n${err}`);
  process.exit(0);  // Never exit 1
}
```

### Pattern 4: Git + PR Creation (simple-git + @octokit/rest)
**What:** Create branch locally with `simple-git`, push to origin, then use `@octokit/rest` to open the PR via API.
**When to use:** Stage 5 in `publish.ts`.
**Example:**
```typescript
// Source: @octokit/rest docs + simple-git docs
import simpleGit from 'simple-git';
import { Octokit } from '@octokit/rest';

const git = simpleGit('/path/to/repo');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Create branch, write file, commit, push
await git.checkoutLocalBranch(`blogg/${slug}`);
// ... write article file ...
await git.add(`src/content/blogg/${slug}.md`);
await git.commit(`feat(blogg): ${title}`);
await git.push('origin', `blogg/${slug}`);

// Create PR via API
const [owner, repo] = process.env.GITHUB_REPOSITORY!.split('/');
await octokit.pulls.create({
  owner,
  repo,
  title: `feat(blogg): ${title}`,
  body: qualityReportMarkdown,
  head: `blogg/${slug}`,
  base: 'main',
});
```

### Anti-Patterns to Avoid
- **Writing frontmatter with stale schema fields:** The architecture doc shows `publishDate`, `author`, `tags`, `estimatedReadTime` — these do NOT exist in the live `src/content/config.ts`. Use `date`, `readTime` only.
- **Exiting non-zero on rejection:** Quality gate rejection is expected behavior. `process.exit(1)` would mark GitHub Actions as failed and send failure emails.
- **Generating a second topic on rejection:** CONTEXT.md is explicit: one rejection = exit 0. Do not retry with a different topic in the same run.
- **Not guarding `src/content/blogg/` existence:** On first run the directory won't exist. `discover-topics.ts` must handle this with `fs.existsSync()` before scanning.
- **Writing `.md` file before validating `relatedSlugs`:** If a relatedSlug doesn't exist in the collection, the Astro build fails. Validate all slugs exist as files before writing.
- **Hardcoding `GITHUB_REPOSITORY`:** Read from `process.env.GITHUB_REPOSITORY` which GitHub Actions sets automatically (`owner/repo` format).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Git branch/commit/push | `child_process.exec('git checkout -b ...')` | `simple-git` | Typed promises, error handling, cross-platform |
| GitHub PR creation | Parse GitHub web UI or raw `fetch` calls | `@octokit/rest` | Typed response, auth handling, pagination built-in |
| TypeScript execution | Custom build step with `tsc` then `node` | `tsx` | Zero-config, esbuild-fast, handles ESM |
| JSON parsing from Claude | Regex extraction | `JSON.parse()` on full response | Call 2 returns only JSON; regex breaks on nested structures |
| LIX readability | External npm package | Inline function (3 lines) | No dep, formula is trivial: `(words/sentences) + (longWords*100/words)` |
| Norwegian slugify | Unicode library | Inline map (æ→ae, ø→oe, å→aa) | Only 3 replacements needed; no dep justified |

**Key insight:** The pipeline's only justified external dependencies are `tsx`, `@octokit/rest`, and `simple-git`. Everything else (LIX, slugify, file I/O, queue management) is simple enough to inline without introducing maintenance burden.

## Common Pitfalls

### Pitfall 1: Frontmatter Schema Drift
**What goes wrong:** Article is written to disk with `publishDate` / `author` / `tags` / `estimatedReadTime` fields that don't exist in the live Zod schema — Astro build fails on `npm run build`.
**Why it happens:** The architecture doc (`.planning/blog-milestone-architecture.md`) contains an earlier draft schema that predates the live implementation. Copy-pasting from the architecture doc instead of from `src/content/config.ts`.
**How to avoid:** The pipeline must derive its frontmatter shape from `src/content/config.ts` field names: `title`, `seoTitle`, `category`, `date`, `readTime`, `description`, `relatedSlugs?`, `faq?[]`. Nothing else.
**Warning signs:** `astro check` or `npm run build` throws Zod validation errors referencing unknown fields.

### Pitfall 2: Claude Model ID Mismatch
**What goes wrong:** Using `claude-sonnet-4-5-20250929` (from SDK README examples) instead of the project-mandated `claude-sonnet-4-6` model.
**Why it happens:** SDK README and search results show older model IDs; the CONTEXT.md and architecture doc specify `claude-sonnet-4-6`.
**How to avoid:** Define model ID in `config.ts` as a constant: `export const CLAUDE_MODEL = 'claude-sonnet-4-6'`.
**Warning signs:** API returns 404 or generation quality is different from expectations.

### Pitfall 3: JSON Truncation in Single-Call Generation
**What goes wrong:** Asking Claude to return both the full article body AND metadata JSON in one response causes the JSON to be cut off when the article body + JSON exceeds the output token window.
**Why it happens:** ~2000-word article body (~2500 tokens) + metadata JSON pushes response near max_tokens.
**How to avoid:** The two-call pattern is locked. Call 1: Markdown body only (4096 tokens). Call 2: metadata JSON only (1024 tokens).
**Warning signs:** `JSON.parse()` throws SyntaxError on the metadata; JSON ends mid-object.

### Pitfall 4: `relatedSlugs` Dangling References
**What goes wrong:** Claude suggests a `relatedSlug` that doesn't match an actual `.md` filename in `src/content/blogg/`. The Astro RelatedArticles component silently shows nothing or the `getEntries()` call throws.
**Why it happens:** Claude invents slugs or slightly misspells them.
**How to avoid:** After call 2 returns metadata, validate each slug in `relatedSlugs` against the list of actual filenames (without `.md` extension) before writing the article file. Remove or skip invalid slugs.
**Warning signs:** PR is created but related articles section is empty; `astro check` warns about missing collection entries.

### Pitfall 5: LIX Threshold Too Low
**What goes wrong:** Setting LIX threshold to 45 causes systematic false rejections of valid Norwegian technical content.
**Why it happens:** Norwegian is a compounding language — "nettstedoptimalisering" is one word with 22 characters, counted as a "long word" by LIX. Technical articles about web development naturally include many compound words.
**How to avoid:** Use LIX ≤ 55 (not 45). This is explicitly documented in both CONTEXT.md and STATE.md.
**Warning signs:** Rejection rate > 50% on automated pass 2; all rejections cite LIX.

### Pitfall 6: Git Operations in Wrong Working Directory
**What goes wrong:** `simple-git` operates from `process.cwd()` which may not be the repo root when invoked via `npx tsx scripts/blog/index.ts`.
**Why it happens:** `npx tsx` sets cwd to where the command is run, not where `index.ts` lives.
**How to avoid:** Instantiate simple-git with explicit path: `simpleGit(fileURLToPath(new URL('../../', import.meta.url)))` to anchor to repo root.
**Warning signs:** `git: not a git repository` error, or files committed to wrong location.

### Pitfall 7: `topics-queue.json` Missing on First Run
**What goes wrong:** `discover-topics.ts` tries to `JSON.parse(fs.readFileSync('topics-queue.json'))` and throws if the file doesn't exist yet.
**Why it happens:** New project, file not yet created.
**How to avoid:** Use `fs.existsSync()` check before reading; default to empty array `[]` if missing.
**Warning signs:** `ENOENT: no such file or directory` on first run.

## Code Examples

Verified patterns from official sources:

### Anthropic SDK — Non-Streaming messages.create
```typescript
// Source: https://github.com/anthropics/anthropic-sdk-typescript/blob/main/README.md
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 4096,
  system: systemPrompt,
  messages: [{ role: 'user', content: userMessage }],
});

// Access text content — content[0] is TextBlock when not using tools
const text = (message.content[0] as Anthropic.TextBlock).text;
```

### Inline LIX Score (Norwegian-aware)
```typescript
// Source: https://en.wikipedia.org/wiki/Lix_(readability_test)
// Formula: (words/sentences) + (longWords * 100 / words)
// longWords = words with > 6 characters
// Threshold for this project: <= 55

function lixScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const longWords = words.filter(w => w.replace(/[^a-zA-ZæøåÆØÅ]/g, '').length > 6);

  if (sentences.length === 0 || words.length === 0) return 0;
  return (words.length / sentences.length) + (longWords.length * 100 / words.length);
}
```

### Norwegian Slug Generation
```typescript
// Source: CONTEXT.md locked decision (æ→ae, ø→oe, å→aa)
function norwegianSlugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'oe')
    .replace(/å/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

### @octokit/rest — Create PR
```typescript
// Source: https://actions-cool.github.io/octokit-rest/api/pulls/
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const [owner, repo] = process.env.GITHUB_REPOSITORY!.split('/');

await octokit.pulls.create({
  owner,
  repo,
  title: `feat(blogg): ${title}`,
  body: prBody,   // quality scores markdown
  head: `blogg/${slug}`,
  base: 'main',
});
```

### simple-git — Branch + Commit + Push
```typescript
// Source: https://github.com/steveukx/git-js
import simpleGit from 'simple-git';
import { fileURLToPath } from 'url';
import path from 'path';

const repoRoot = path.resolve(fileURLToPath(import.meta.url), '../../../');
const git = simpleGit(repoRoot);

await git.checkoutLocalBranch(`blogg/${slug}`);
await git.add(`src/content/blogg/${slug}.md`);
await git.commit(`feat(blogg): ${title}`);
await git.push('origin', `blogg/${slug}`);
```

### Frontmatter Writer — Exact Schema Match
```typescript
// Source: src/content/config.ts (live schema verification)
// Fields: title, seoTitle, category, date, readTime, description, relatedSlugs?, faq?[]

function buildFrontmatter(meta: ArticleMetadata, faq: FaqItem[]): string {
  const lines = [
    '---',
    `title: "${meta.title}"`,
    `seoTitle: "${meta.seoTitle}"`,
    `category: "${meta.category}"`,
    `date: ${new Date().toISOString().split('T')[0]}`,
    `readTime: ${meta.readTime}`,
    `description: "${meta.description}"`,
  ];

  if (meta.relatedSlugs && meta.relatedSlugs.length > 0) {
    lines.push('relatedSlugs:');
    meta.relatedSlugs.forEach(slug => lines.push(`  - "${slug}"`));
  }

  if (faq && faq.length > 0) {
    lines.push('faq:');
    faq.forEach(item => {
      lines.push(`  - question: "${item.question}"`);
      lines.push(`    answer: "${item.answer}"`);
    });
  }

  lines.push('---');
  return lines.join('\n');
}
```

### topics-queue.json Format
```typescript
// Source: CONTEXT.md specifics
interface QueueEntry {
  slug: string;
  title: string;
  cluster: string;
  status: 'pending' | 'published' | 'rejected' | 'permanently_rejected';
  reason?: string;
  attempts: number;   // incremented on each failure
  createdAt: string;  // ISO date string
}

// File: scripts/blog/topics-queue.json
// Example: []  (empty array on first run)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `ts-node` for TypeScript execution | `tsx` v4 | 2023–2025 | `ts-node` has ESM conflicts with Node 20+; `tsx` handles ESM natively |
| Single Claude call for body+metadata | Two sequential calls | CONTEXT.md locked decision | Prevents JSON truncation; call 2 gets the full body as context |
| LIX ≤ 45 | LIX ≤ 55 | Corrected in CONTEXT.md + STATE.md | Norwegian compound words inflate LIX; 55 is the appropriate threshold |
| Architecture doc schema (`publishDate`, `author`, `tags`) | Live schema (`date`, `readTime`) | Phase 17 implementation | Zod schema was finalized during Phase 17; pipeline must match |

**Deprecated/outdated in this project:**
- Architecture doc frontmatter schema: `publishDate`, `author`, `tags`, `estimatedReadTime` — replaced by live `src/content/config.ts` fields
- Architecture doc LIX threshold of 45 — replaced by 55 per STATE.md and CONTEXT.md
- Single-call generation pattern in architecture doc — replaced by two-call pattern per CONTEXT.md

## Open Questions

1. **Git identity for local runs**
   - What we know: GitHub Actions sets `git config user.name` / `user.email` in the workflow (Phase 19)
   - What's unclear: When running locally, the user's global git config is used. Pipeline doesn't need to configure this.
   - Recommendation: No action needed for Phase 18. Document that `GIT_AUTHOR_NAME` / `GIT_AUTHOR_EMAIL` must be set in CI config (Phase 19).

2. **`GITHUB_REPOSITORY` env var availability locally**
   - What we know: GitHub Actions sets `GITHUB_REPOSITORY` as `owner/repo`. Not set locally.
   - What's unclear: How should `publish.ts` resolve owner/repo when run locally?
   - Recommendation: Allow override via env var, but also accept `--repo owner/repo` CLI arg or derive from `git remote get-url origin` as fallback.

3. **Exact model ID for Claude**
   - What we know: CONTEXT.md and architecture doc say "Claude Sonnet 4.6". SDK examples show `claude-sonnet-4-5-20250929`.
   - What's unclear: The exact API model string for "claude-sonnet-4-6" — whether it's `claude-sonnet-4-6`, `claude-sonnet-4-6-20260229`, etc.
   - Recommendation: Define as a config constant and test against the Anthropic API before finalizing. The project already uses `@anthropic-ai/sdk` v0.78.0 so the SDK docs for that version should list valid model IDs.

## Sources

### Primary (HIGH confidence)
- `src/content/config.ts` — live Zod schema, definitive source for frontmatter fields
- `.planning/phases/18-generation-pipeline-scripts/18-CONTEXT.md` — all locked decisions
- `package.json` — confirmed `@anthropic-ai/sdk` v0.78.0 already installed; `tsx` and `@octokit/rest` not yet present
- `.planning/blog-milestone-architecture.md` — pipeline structure, 5-stage design, system prompts
- `npm show tsx version` → 4.21.0 (verified from npm registry)
- `npm show @octokit/rest version` → 22.0.1 (verified from npm registry)
- `npm show simple-git version` → 3.32.3 (verified from npm registry)

### Secondary (MEDIUM confidence)
- [Anthropic SDK TypeScript README](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/README.md) — `messages.create()` API, response structure
- [Octokit pulls.create docs](https://actions-cool.github.io/octokit-rest/api/pulls/) — required parameters verified
- [Wikipedia: Lix readability test](https://en.wikipedia.org/wiki/Lix_(readability_test)) — LIX formula confirmed

### Tertiary (LOW confidence)
- simple-git branch/commit/push pattern — from web search + GitHub README cross-reference; not verified against Context7

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified from npm registry; `@anthropic-ai/sdk` confirmed in package.json
- Architecture: HIGH — CONTEXT.md locks all major decisions; architecture doc provides full stage designs
- Pitfalls: HIGH — schema drift risk is observable from comparing architecture doc vs live config.ts; LIX threshold explicitly documented in STATE.md

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable libraries; Anthropic model ID may need re-verification if new model string format is released)
