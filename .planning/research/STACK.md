# Stack Research

**Domain:** Automated blog pipeline — Astro Content Collections + GitHub Actions + Claude API
**Researched:** 2026-03-06
**Confidence:** HIGH

## Scope

This file covers ONLY stack additions for the v1.3 automated blog milestone.
Existing validated stack (Astro 5, Tailwind 4, React, Framer Motion, Vercel, TypeScript, @anthropic-ai/sdk) is NOT re-researched here.

---

## Recommended Stack

### Core Technologies (existing — confirmed compatible)

| Technology | Version | Purpose | Why Confirmed |
|------------|---------|---------|---------------|
| @anthropic-ai/sdk | ^0.78.0 | Claude API calls for content generation and quality-gate review | Already in `dependencies`. Reused in pipeline scripts — no change needed. Latest version as of 2026-03-06. |
| Astro Content Collections | built-in (Astro 5) | Blog schema, type-safe frontmatter, `getCollection()` query | No new package. Ships with Astro 5. Zero additional install. |

### New Dev Dependencies

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tsx | ^4.21.0 | Run TypeScript pipeline scripts in GitHub Actions without compile step | Required for `npx tsx scripts/blog/index.ts` in the workflow. Must be in devDependencies so `npm ci` makes it available — do not rely on cold `npx tsx` download on every CI run. |
| @octokit/rest | ^22.0.1 | Create GitHub PRs from the pipeline's publish stage | Used in `scripts/blog/publish.ts` via `octokit.rest.pulls.create()`. The REST-only package — lighter than the full `octokit` bundle which adds GraphQL, webhooks, and plugins that are not needed. |

**Total new installs: 2 devDependencies.**

---

## Astro Content Collections: Critical Config Path Change

Content Collections are built into Astro 5 — no new package is needed. However, the config file path changed between Astro 4 and Astro 5.

| Astro version | Config file location |
|---------------|---------------------|
| Astro 2–4 | `src/content/config.ts` |
| Astro 5+ | `src/content.config.ts` (at src root, not inside content/) |

**The architecture document references `src/content/config.ts` — this is the Astro 4 path. Use `src/content.config.ts`.**

The Astro 5 Content Layer API also introduces explicit loaders. The `glob()` loader replaces the implicit file scanning from Astro 4:

```typescript
// src/content.config.ts  ← correct path for Astro 5
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'   // Astro 5 Content Layer — explicit loader required
import { z } from 'astro/zod'          // z from astro/zod, not zod directly

const blogg = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blogg' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    author: z.string().default('Iver Østensen'),
    category: z.string(),
    tags: z.array(z.string()),
    estimatedReadTime: z.number(),
    relatedSlugs: z.array(z.string()).optional(),
  }),
})

export const collections = { blogg }
```

Content files still live in `src/content/blogg/` — only the config file moved to `src/`.

---

## GitHub Actions Environment

The workflow uses only tooling that `npm ci` provides. No extra runner setup needed beyond:

- `actions/checkout@v4`
- `actions/setup-node@v4` with `node-version: 20` (Node 20 LTS — compatible with tsx 4.x and @anthropic-ai/sdk 0.78.x)
- `ANTHROPIC_API_KEY` stored as a GitHub Actions repository secret
- `GITHUB_TOKEN` auto-provided by Actions — sufficient for PR creation on the same repo via `@octokit/rest`

Git identity must be configured explicitly inside the workflow before any commit:

```bash
git config user.name "nettup-blog-bot"
git config user.email "bot@nettup.no"
```

---

## Installation

```bash
# New dev dependencies only
npm install -D tsx @octokit/rest

# No runtime dependency changes — @anthropic-ai/sdk already in dependencies at ^0.78.0
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| @octokit/rest | `octokit` (full bundle) | Only if you also need GraphQL API, webhooks, or Octokit plugin system. This pipeline creates PRs — REST only. |
| @octokit/rest | GitHub CLI (`gh pr create` via shell) | Simpler for shell-only scripts. Rejected here because TypeScript error handling around PR creation is cleaner with the SDK. |
| tsx | ts-node | ts-node requires explicit ESM configuration and uses tsc (slower). tsx uses esbuild and handles ESM natively with zero config for a project already using `"type": "module"`. |
| tsx | Bun | Bun is faster but adds setup complexity to a Node-based CI environment. `actions/setup-node` is the standard; Bun would require a separate `oven-sh/setup-bun` action step. |
| tsx as devDependency | `npx tsx` cold download | Cold `npx tsx` downloads ~23MB on every CI run — adds 5-10 seconds and introduces a network failure vector. devDependency ensures `npm ci` handles it. |
| Plain Markdown (.md) | MDX (.mdx) | Claude generates plain Markdown. MDX requires `@astrojs/mdx` and adds JSX parsing complexity for no benefit when content has no React components. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Separate CMS (Sanity, Strapi, Contentful) | No human editor exists. A CMS UI adds infrastructure cost and maintenance for a fully automated pipeline. | Astro Content Collections with `.md` files committed to the repo. |
| `@astrojs/mdx` | Pipeline generates plain Markdown. MDX support is unnecessary complexity and would require file extension changes everywhere. | Plain `.md` with Astro Content Collections. |
| `gray-matter` in Astro components | Astro's Content Layer API parses frontmatter automatically — `getCollection('blogg')` returns fully typed entries. | `getCollection()` and `getEntry()` from `astro:content`. |
| `gray-matter` in pipeline scripts | The pipeline WRITES frontmatter via template strings, not reads it. No parser needed. | Template literal with YAML frontmatter string in `generate-article.ts`. |
| `simple-git` npm package | Adds 4MB for 4 git commands. Use `execSync` from Node's built-in `child_process`. | `execSync('git checkout -b ...')` directly in `publish.ts`. |
| Vercel Cron + Serverless for generation | Hobby plan has a 10-second function timeout. Article generation takes 20-40 seconds. GitHub Actions has no such constraint. | GitHub Actions scheduled workflow (free, 2000 min/month included). |

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| tsx ^4.21.0 | Node 20, TypeScript ^5.0, ESM | Project uses `"type": "module"` — tsx handles this correctly without tsconfig changes |
| @octokit/rest ^22.0.1 | Node 18+, ESM | Ships with full TypeScript types. No `@types/octokit` package needed. |
| @anthropic-ai/sdk ^0.78.0 | Node 18+, ESM | Already proven in the chat endpoint (`/api/chat`). Same import works in Node scripts. |
| Astro 5 Content Layer | Astro ^5.0.0 | Breaking vs Astro 4: config at `src/content.config.ts`, `glob()` loader required. |

---

## Integration Points with Existing Astro 5 Setup

**Sitemap:** `@astrojs/sitemap` already installed. Blog pages at `/blogg/[slug]` are included automatically — no sitemap config changes needed.

**Vercel adapter:** Blog pages use `getStaticPaths()` + `getCollection('blogg')` — fully static output. No serverless function needed for the blog. The existing `output: 'hybrid'` config handles this correctly.

**TypeScript strict mode:** `@octokit/rest` and `@anthropic-ai/sdk` both ship their own types. No `@types/*` packages needed for either.

**ESLint:** Verify that `eslint.config.js` globs cover `scripts/**/*.ts` — pipeline scripts should be linted under the same rules.

**Bundle size:** tsx and @octokit/rest are devDependencies. Vercel does not bundle devDependencies into the output. No impact on client bundle or cold start times.

---

## Sources

- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/) — config file path, API shape, Astro 5 Content Layer (HIGH confidence — official docs)
- [Migrating content collections from Astro 4 to 5](https://chenhuijing.com/blog/migrating-content-collections-from-astro-4-to-5/) — breaking change: `src/content.config.ts` path (MEDIUM confidence, consistent with official docs)
- [@anthropic-ai/sdk on npm](https://www.npmjs.com/package/@anthropic-ai/sdk) — version 0.78.0 confirmed current (HIGH confidence)
- [@octokit/rest on npm](https://www.npmjs.com/package/@octokit/rest) — version 22.0.1 confirmed current (HIGH confidence)
- [octokit/rest.js v22 docs](https://octokit.github.io/rest.js/v22/) — `octokit.rest.pulls.create()` method signature verified (HIGH confidence)
- [tsx on npm](https://www.npmjs.com/package/tsx) — version 4.21.0, esbuild-based, ESM-native (HIGH confidence)
- [tsx FAQ](https://tsx.is/faq) — devDependency vs npx tradeoffs (HIGH confidence)
- Project `package.json` — existing dependencies confirmed, @anthropic-ai/sdk already present (HIGH confidence)

---

*Stack research for: Nettup v1.3 automated blog pipeline*
*Researched: 2026-03-06*
