# Phase 20: Innholdsforutsetninger - Context

**Gathered:** 2026-03-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Capture all visual assets and verified performance data for both projects (iGive and Blom Company) and produce a VISUAL-CONTENT-PLAN.md that documents every required file. No page files or components are built in this phase — it purely creates the assets and data that phases 21–23 will import.

</domain>

<decisions>
## Implementation Decisions

### Screenshot coverage
- 2–3 shots per project: one full-viewport hero shot + one feature/content section detail crop
- iGive: recapture fresh from `salg.igive.no` (existing `salg.igive.no.png` will be replaced)
- Blom Company: capture from `blomcompany.com` (not the vercel preview URL)
- No mobile screenshots — desktop only

### Image specifications
- Dimensions: 1600×900 (16:9) for hero shots; feature detail crops can vary but stay within 1600px wide
- Format: PNG source files (Astro's `<Image>` converts to WebP at build time)
- Naming convention: `[project]-[view].png` — e.g. `igive-hero.png`, `igive-features.png`, `blom-hero.png`, `blom-features.png`
- Location: `src/assets/images/` (flat, alongside existing files)

### Lighthouse measurement
- Tool: PageSpeed Insights via browser (pagespeed.web.dev)
- Run for both projects: `salg.igive.no` and `blomcompany.com`
- Record all 4 categories: Performance, Accessibility, Best Practices, SEO
- Scores stored inline in VISUAL-CONTENT-PLAN.md (not a separate file)

### VISUAL-CONTENT-PLAN.md structure
- Full spec per screenshot entry: filename | dimensions | crop guide | section label
- Status column per entry: `[ ]` pending / `[x]` captured
- Inline Lighthouse scores table for both projects
- Lives at `.planning/VISUAL-CONTENT-PLAN.md`

### Claude's Discretion
- Exact crop guide wording (how to describe the viewport capture instructions)
- Whether to include a "notes" column in the screenshot table

</decisions>

<specifics>
## Specific Ideas

- The existing `salg.igive.no.png` is in `src/assets/images/` and referenced in `projects.ts` as `iGiveImage`. After recapture it should keep the same path so no import changes are needed in phase 20 — or rename to `igive-hero.png` and update the import (cleaner naming wins)
- Phase 22 uses real Lighthouse scores in a visual metrics block — the VISUAL-CONTENT-PLAN.md scores are the source of truth for those numbers

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/assets/images/salg.igive.no.png`: existing iGive screenshot — will be replaced by fresh `igive-hero.png`
- `src/pages/prosjekter/_sections/Results.astro`: hardcodes scores 95 / <1s / 100 — real scores captured here replace these in phase 22

### Established Patterns
- Astro `<Image>` component imports images from `src/assets/` — all new PNGs must live there to be processed at build time
- `projects.ts` imports `iGiveImage` from `@/assets/images/salg.igive.no.png` — renaming the file requires updating this import

### Integration Points
- `.planning/VISUAL-CONTENT-PLAN.md` is consumed by phases 21 (data layer) and 22 (case study pages) to know exact filenames and scores
- `npm run build` must pass with all committed PNG files present (success criterion 4)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 20-innholdsforutsetninger*
*Context gathered: 2026-03-07*
