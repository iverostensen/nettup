---
phase: 17-astro-blog-infrastructure
plan: 01
subsystem: infra
tags: [astro, content-collections, blog, typescript]

requires: []
provides:
  - "Legacy Content Collections schema for 'blogg' with 8 validated frontmatter fields"
  - "ArticleCard component for blog listing pages"
  - "RelatedArticles component with undefined-slug guard"
  - "astro.config.mjs with legacy: { collections: true } flag"
  - ".astro/content.d.ts with CollectionEntry<'blogg'> types"
affects:
  - "17-02 (blog listing + article pages depend on these foundations)"
  - "18 (pipeline writes MDX files into src/content/blogg/)"

tech-stack:
  added: ["@astrojs/check", "typescript (devDep for check)"]
  patterns:
    - "Legacy Content Collections path: src/content/config.ts (required for Astro 5 legacy mode)"
    - "Two distinct title fields: title (H1, conversational) vs seoTitle (<title> tag)"
    - "RelatedArticles undefined-filter guard: .filter((a): a is NonNullable<typeof a> => a !== undefined)"

key-files:
  created:
    - src/content/config.ts
    - src/components/blog/ArticleCard.astro
    - src/components/blog/RelatedArticles.astro
  modified:
    - astro.config.mjs

key-decisions:
  - "Use legacy: { collections: true } in astro.config.mjs so Astro 5 recognizes src/content/config.ts"
  - "ArticleCard shows article.data.title (conversational) not seoTitle — no excerpt displayed"
  - "RelatedArticles renders nothing (not even heading) when related array is empty"
  - "date field uses z.coerce.date() to handle YAML date string format from frontmatter"

patterns-established:
  - "Blog components live in src/components/blog/ (separate from ui/ and sections/)"
  - "CollectionEntry<'blogg'> as typed prop ensures schema validation flows to components"

requirements-completed: [INFRA-05, INFRA-07]

duration: 2min
completed: 2026-03-06
---

# Phase 17 Plan 01: Astro Blog Infrastructure Summary

**Legacy Content Collections schema with 8 typed fields for the 'blogg' collection, ArticleCard and RelatedArticles components with TypeScript type guards**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-06T19:04:56Z
- **Completed:** 2026-03-06T19:06:51Z
- **Tasks:** 2
- **Files modified:** 5 (astro.config.mjs, src/content/config.ts, ArticleCard.astro, RelatedArticles.astro, package.json)

## Accomplishments

- Added `legacy: { collections: true }` to `astro.config.mjs` enabling Astro 5 to load `src/content/config.ts`
- Created `src/content/config.ts` with full 8-field schema (title, seoTitle, category, date, readTime, description, relatedSlugs, faq)
- Ran `astro sync` to generate `.astro/content.d.ts` with `CollectionEntry<'blogg'>` types
- Built `ArticleCard.astro` wrapping `Card.astro` with typed props — displays title/category/date/readTime, no excerpt
- Built `RelatedArticles.astro` with TypeScript type guard `.filter((a): a is NonNullable<typeof a> => a !== undefined)` preventing undefined-slug build crashes

## Task Commits

1. **Task 1: astro.config.mjs + content schema + astro sync** - `e44c037` (feat)
2. **Task 2: ArticleCard and RelatedArticles components** - `06a546e` (feat)

## Files Created/Modified

- `astro.config.mjs` - Added `legacy: { collections: true }` block
- `src/content/config.ts` - New file: 8-field Zod schema for blogg collection
- `src/components/blog/ArticleCard.astro` - New: typed card for listing pages
- `src/components/blog/RelatedArticles.astro` - New: related section with undefined guard
- `package.json` / `package-lock.json` - Added @astrojs/check + typescript devDeps for `astro check`

## Decisions Made

- `title` and `seoTitle` are separate schema fields: `title` for H1 (conversational), `seoTitle` for `<title>` tag (keyword-first). This matches SEO best practice for blog content.
- `RelatedArticles` renders nothing at all (no heading, no container) when related array is empty — prevents orphaned "Les også" headings.
- `date` field uses `z.coerce.date()` to coerce YAML date strings like `2026-03-06` into JavaScript Date objects.

## Deviations from Plan

None - plan executed exactly as written.

**Note:** One pre-existing TypeScript error was discovered in `src/components/islands/DeviceMockup.tsx` (Framer Motion `Variants` type mismatch). This error predates this plan and is out of scope. Logged to deferred items.

## Issues Encountered

- `astro check` was not installed yet — `@astrojs/check` and `typescript` were installed as devDeps (Rule 3 auto-fix). No changes to plan logic required.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Content schema and blog UI components are fully in place
- `CollectionEntry<'blogg'>` types are generated and available
- Plan 02 can now import `ArticleCard`, `RelatedArticles`, and use `getCollection('blogg')` with full type safety
- First blog article MDX files can be placed under `src/content/blogg/` at any time

---
*Phase: 17-astro-blog-infrastructure*
*Completed: 2026-03-06*
