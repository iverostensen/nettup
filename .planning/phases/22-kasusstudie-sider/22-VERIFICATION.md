---
phase: 22-kasusstudie-sider
verified: 2026-03-08T00:00:00Z
status: human_needed
score: 8/8 must-haves verified
human_verification:
  - test: "Visit /prosjekter/igive in browser, confirm all 10 sections render correctly"
    expected: "Breadcrumbs (Hjem / Prosjekter / iGive), opening summary, hero image, Utfordringen, Løsningen + features image, Teknologi pills, Leveranser checklist, Resultater (96/96/100/100), Stein Eriksen testimonial, CTA linking to salg.igive.no"
    why_human: "Static analysis confirms template and data exist; rendering correctness requires browser"
  - test: "Visit /prosjekter/blom-company in browser, confirm all 10 sections render correctly"
    expected: "Breadcrumbs (Hjem / Prosjekter / Blom Company), dual-collection story in Løsningen, Teknologi pills (Next.js 15 / Shopify / Sanity / Tailwind CSS 4 / Vercel), Resultater (99/96/100/100), Patrick testimonial, CTA linking to blomcompany.com"
    why_human: "Static analysis confirms template and data exist; rendering correctness requires browser"
  - test: "Verify mobile layout at 375px width on both pages"
    expected: "All sections readable, metrics grid shows 2-col, features list shows single-col, images not cropped"
    why_human: "Responsive layout requires visual inspection"
---

# Phase 22: Kasusstudie-sider Verification Report

**Phase Goal:** Build individual case study pages for iGive and Blom Company as dynamic routes under /prosjekter/[slug]
**Verified:** 2026-03-08
**Status:** human_needed (all automated checks passed)
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visiting /prosjekter/igive renders a complete page with all 10 sections | VERIFIED | `[slug].astro` implements all 10 sections in correct order; `dist/client/prosjekter/igive/index.html` built |
| 2 | Visiting /prosjekter/blom-company renders a complete page with all 10 sections | VERIFIED | `dist/client/prosjekter/blom-company/index.html` built; all conditional sections have data |
| 3 | Opening summary appears within first 200 words and is self-contained (GEO-citable) | VERIFIED | `project.summary` rendered as second element inside Section 2 before hero image; both entries have ≤200-word summaries |
| 4 | Metrics block shows 4 large-number cards in a grid with Lighthouse scores | VERIFIED | Section 8 renders `grid grid-cols-2 md:grid-cols-4` with `text-5xl font-bold text-brand` numbers; iGive 96/96/100/100, Blom 99/96/100/100 |
| 5 | Hero image and features image render via astro:assets Image with correct alt text | VERIFIED | `Image` from `astro:assets` used for both `project.image` and `project.featuresImage.src`; both PNG assets present in `src/assets/images/` |
| 6 | Testimonial card renders with quote, result, name, title, company | VERIFIED | Section 9 renders all five fields; iGive: Stein Eriksen; Blom: Patrick |
| 7 | CTA section links to the live project URL | VERIFIED | Section 10 renders `<a href={project.url} target="_blank" rel="noopener noreferrer">`; iGive URL: `salg.igive.no`, Blom URL: `blomcompany.com` |
| 8 | npm run build passes with both pages generated | VERIFIED | Build completed in 2.94s with no errors; both slug directories present in `dist/client/prosjekter/` |

**Score:** 8/8 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/pages/prosjekter/[slug].astro` | Dynamic case study route | VERIFIED | 207 lines, `getStaticPaths` maps `projects` array to slug+props, all 10 sections implemented |
| `src/config/projects.ts` | Complete data for both case study pages | VERIFIED | Interface has `featuresImage`, `summary`, `testimonial`, `challenge`, `solution`, `features`; both entries fully populated |
| `src/config/testimonials.ts` | iGive testimonial entry | VERIFIED | Only iGive entry; Blom Company entry intentionally removed (homepage only shows iGive per Plan 02 decision) |
| `src/assets/images/igive-features.png` | Features screenshot for iGive | VERIFIED | File exists |
| `src/assets/images/blom-features.png` | Features screenshot for Blom Company | VERIFIED | File exists |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `[slug].astro` | `src/config/projects.ts` | `import { projects } from '@/config/projects'` + `getStaticPaths.*projects.map` | VERIFIED | Import present line 1; `getStaticPaths` maps projects array at line 11 |
| `[slug].astro` | `src/layouts/BaseLayout.astro` | `BaseLayout title={project.metaTitle} description={project.metaDescription}` | VERIFIED | Line 25 of template |
| `projects.ts` | `igive-features.png` | `import iGiveFeaturesImage` at top of file | VERIFIED | Line 4 of projects.ts |
| `projects.ts` | `blom-features.png` | `import blomFeaturesImage` at top of file | VERIFIED | Line 5 of projects.ts |
| `prosjekter/index` | `[slug].astro` | `ProjectGrid` renders `href=/prosjekter/${project.slug}` | VERIFIED | `Card href={\`/prosjekter/${project.slug}\`}` in ProjectGrid.astro |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| SIDE-01 | 22-02 | `/prosjekter/igive` exists as dedicated page with all table-stakes sections | SATISFIED | `/dist/client/prosjekter/igive/index.html` built; all 10 sections present in template with iGive data |
| SIDE-02 | 22-02 | `/prosjekter/blom-company` exists as dedicated page with all table-stakes sections | SATISFIED | `/dist/client/prosjekter/blom-company/index.html` built; dual-collection story in `solution` field; all 5 tech stack items present |
| SIDE-03 | 22-01, 22-02 | Both pages have GEO-optimized copy — standalone summary paragraph, concrete verifiable numbers | SATISFIED | `summary` field on both entries is ≤200 words, self-contained; metrics block renders as distinct 4-card grid with verified Lighthouse scores |

No orphaned requirements — all three SIDE IDs claimed in plan frontmatter, all three satisfied.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/config/projects.ts` | 124 | Blom Company testimonial `name: 'Patrick'` — first name only, no surname | Info | Intentional per STATE.md (real name not yet confirmed); noted for follow-up |

No blocker or warning-level anti-patterns found. No TODO/FIXME comments, no stub implementations, no empty returns.

### Human Verification Required

#### 1. iGive Case Study Full Visual Review

**Test:** Run `npm run dev`, navigate to `http://localhost:4321/prosjekter/igive`
**Expected:** All 10 sections visible and correctly ordered: breadcrumbs trail (Hjem / Prosjekter / iGive), opening summary paragraph above hero image, full-width hero image, Utfordringen section with challenge copy, Løsningen section with solution copy and igive-features.png below it, Teknologi pills (Astro / Tailwind CSS / Vercel), Leveranser checklist with 6 items in 2 columns, Resultater grid (96, 96, 100, 100), Stein Eriksen testimonial card, CTA linking to salg.igive.no in new tab
**Why human:** Rendering, visual hierarchy, image display, and link behavior require browser

#### 2. Blom Company Case Study Full Visual Review

**Test:** Run `npm run dev`, navigate to `http://localhost:4321/prosjekter/blom-company`
**Expected:** Breadcrumbs (Hjem / Prosjekter / Blom Company), dual-collection story present in Løsningen ("livsstil og golf"), Teknologi pills show all 5 (Next.js 15, Shopify, Sanity, Tailwind CSS 4, Vercel), Resultater grid (99, 96, 100, 100), testimonial from Patrick, CTA linking to blomcompany.com in new tab
**Why human:** Rendering and visual correctness require browser

#### 3. Mobile Layout at 375px

**Test:** Open either case study page in browser devtools at 375px width
**Expected:** Metrics grid shows 2-col (not 4-col), features list shows single-col, all text readable without horizontal scroll, images scale correctly within rounded containers
**Why human:** Responsive layout requires visual inspection

### Gaps Summary

No gaps. All automated must-haves pass. Three human verification items remain — these are visual/interactive checks that cannot be confirmed programmatically.

Build evidence:
- `npm run build` completed in 2.94s with 0 errors
- Both `dist/client/prosjekter/igive/index.html` and `dist/client/prosjekter/blom-company/index.html` generated
- All 9 optimized images processed (igive-features, blom-features, igive-hero, blom-hero variants)
- Commits verified: `2a96102`, `df17747`, `8741af3`, `7b672bb`

---

_Verified: 2026-03-08_
_Verifier: Claude (gsd-verifier)_
