---
phase: 17-astro-blog-infrastructure
plan: 02
subsystem: ui
tags: [astro, content-collections, seo, json-ld, blog, tailwind]

# Dependency graph
requires:
  - phase: 17-01
    provides: content collection schema, ArticleCard, RelatedArticles, Breadcrumbs components
provides:
  - Blog listing page at /blogg with sorted article grid
  - Dynamic article page at /blogg/[slug] with BlogPosting, FAQPage, BreadcrumbList JSON-LD
  - Footer Blogg navigation link
  - BaseLayout pageLabels entry for /blogg
  - Manual prose styles (.prose-article) in global.css
  - 3 seed articles with FAQ, relatedSlugs, and cross-referencing internal links
affects: [18-pipeline-scripts, 19-github-actions]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Manual .prose-article CSS class instead of @tailwindcss/typography (not in dependencies)"
    - "JSON-LD structured data injected via BaseLayout head slot using Fragment slot='head'"
    - "Article page overrides BaseLayout's auto-generated BreadcrumbList with article-specific one"
    - "Seed articles use faq frontmatter for JSON-LD and ## Vanlige spørsmål section for readability"

key-files:
  created:
    - src/pages/blogg/index.astro
    - src/pages/blogg/[slug].astro
    - src/content/blogg/hva-koster-en-nettside.md
    - src/content/blogg/seo-for-smabedrifter.md
    - src/content/blogg/nettbutikk-vs-nettside.md
  modified:
    - src/components/layout/Footer.astro
    - src/layouts/BaseLayout.astro
    - src/styles/global.css

key-decisions:
  - "No @tailwindcss/typography — used manual .prose-article class in global.css to avoid adding a dependency"
  - "BreadcrumbList JSON-LD emitted in article page head slot to provide accurate article title; BaseLayout auto-generates breadcrumbs for non-article pages"
  - "FAQPage JSON-LD is conditional — only emitted when faq frontmatter field has items"
  - "All 3 seed articles cross-reference each other via relatedSlugs to verify RelatedArticles component"

patterns-established:
  - "Blog article page pattern: seoTitle → <title>, title → H1, faq frontmatter → FAQPage JSON-LD"
  - "Structured data injection: use Fragment slot='head' in page files, never in layout"

requirements-completed: [INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-06]

# Metrics
duration: 8min
completed: 2026-03-06
---

# Phase 17 Plan 02: Astro Blog Infrastructure — User-Facing Pages Summary

**Blog listing and dynamic article pages with BlogPosting/FAQPage/BreadcrumbList JSON-LD, footer link, and 3 cross-linked seed articles — `npm run build` passes with 4 new blog pages**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-06T20:09:00Z
- **Completed:** 2026-03-06T20:17:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Blog listing page at `/blogg` renders article cards sorted newest-first using `getCollection('blogg')`
- Dynamic article page at `/blogg/[slug]` with H1 from `title`, `<title>` from `seoTitle`, and BlogPosting + FAQPage + BreadcrumbList JSON-LD in `<head>`
- Footer "Blogg" link and BaseLayout pageLabels entry for breadcrumb accuracy
- 3 seed articles with complete frontmatter, 200–400 word body, FAQ sections, and full cross-linking via `relatedSlugs`
- Build produces `/blogg`, `/blogg/hva-koster-en-nettside`, `/blogg/seo-for-smabedrifter`, `/blogg/nettbutikk-vs-nettside` without errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Listing page, article page, footer link, pageLabels** - `ffe9ac2` (feat)
2. **Task 2: Seed articles and build verification** - `f842e5a` (feat)

**Plan metadata:** (see final commit)

## Files Created/Modified
- `src/pages/blogg/index.astro` - Blog listing page using getCollection, sorted grid of ArticleCard components
- `src/pages/blogg/[slug].astro` - Dynamic article page with getStaticPaths, render, and full JSON-LD structured data
- `src/components/layout/Footer.astro` - Added Blogg nav link
- `src/layouts/BaseLayout.astro` - Added '/blogg': 'Blogg' to pageLabels map
- `src/styles/global.css` - Added .prose-article styles for article body formatting
- `src/content/blogg/hva-koster-en-nettside.md` - Seed article: pricing guide with 3 FAQ items
- `src/content/blogg/seo-for-smabedrifter.md` - Seed article: SEO basics with 3 FAQ items
- `src/content/blogg/nettbutikk-vs-nettside.md` - Seed article: comparison guide with 3 FAQ items

## Decisions Made
- No `@tailwindcss/typography` — added manual `.prose-article` CSS class in global.css to avoid introducing a new dependency
- Article page injects its own BreadcrumbList JSON-LD via `head` slot to accurately capture article title in position 3; BaseLayout auto-generates breadcrumbs based on URL path for all other pages
- FAQPage JSON-LD is conditional — guarded by `article.data.faq && article.data.faq.length > 0`

## Deviations from Plan

None — plan executed exactly as written. The prose styling decision (manual CSS vs @tailwindcss/typography) was anticipated in the plan's task action text.

## Issues Encountered

Pre-existing TypeScript error in `src/components/islands/DeviceMockup.tsx` (Framer Motion types) was detected during `astro check` but is out of scope — it predates this plan and was not introduced by any changes here.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- Blog infrastructure complete; all 3 JSON-LD schemas verified in build output
- Phase 18 (Pipeline Scripts) can now write articles to `src/content/blogg/` and they will automatically appear at `/blogg`
- The schema from plan 17-01 and the pages from this plan form the complete reading surface for automated article publishing

---
*Phase: 17-astro-blog-infrastructure*
*Completed: 2026-03-06*
