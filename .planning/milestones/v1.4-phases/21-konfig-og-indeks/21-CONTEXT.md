# Phase 21: Konfig og indeks - Context

**Gathered:** 2026-03-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Extend the `projects.ts` `Project` interface with new fields required by case study pages, add the Blom Company project entry, redesign `/prosjekter` as a peer card grid linking to slug-based URLs, and update all consumers (`ProjectTeaser`, `BaseLayout` pageLabels). Case study page content is Phase 22.

</domain>

<decisions>
## Implementation Decisions

### Card grid layout
- 2-column grid on desktop, single column on mobile
- Cover image at 16:9 aspect ratio (consistent with ProjectTeaser.astro pattern)
- Cards use existing `Card.astro` with `hover` variant — no new component
- Each card shows: cover image, category badge, project name, tagline, and a "Se prosjektet →" link
- Card click/link goes to `/prosjekter/[slug]` only — no external live-site link on the index
- Entire card area is clickable (use `Card.astro` with `as="a"` and `href`)

### Index page structure
- Keep existing `Hero.astro` section unchanged
- Replace `ProjectShowcase.astro` and `Results.astro` with a new `ProjectGrid.astro` section component in `_sections/`
- `ProjectGrid.astro` imports from `projects.ts` and renders the 2-col card grid
- Keep `ProsjekterCTA.astro` at the bottom
- `index.astro` import list becomes: Hero → ProjectGrid → ProsjekterCTA

### projects.ts interface extension
- Add: `slug` (string, required), `techStack` (string[], required), `publishedAt` (string, required), `metaTitle` (string, required), `metaDescription` (string, required), `testimonialId` (string, optional), `metrics` (optional object), `gallery` (optional array)
- Remove: `caseStudySection` flag
- `metrics` shape: `{ performance: number, accessibility: number, bestPractices: number, seo: number }` — all optional fields, all numbers 0-100 (Lighthouse scores)
- `gallery` shape: `{ src: ImageMetadata, alt: string }[]` — simple, aligns with astro:assets Image component
- Both `metrics` and `gallery` are optional in the interface to allow adding projects before full data is ready

### Blom Company project entry
- `id`: `'blom-company'`
- `slug`: `'blom-company'`
- `name`: `'Blom Company'`
- `category`: `'B2C'`
- `type`: `'Nettbutikk'`
- `tagline`: `'Eksklusiv nettbutikk for livsstil og golfklær'`
- `image`: imported from `@/assets/images/blom-hero.png`
- Brand context: lifestyle and golf/sport clothing brand — NOT a flower shop
- `url`: `'https://blom-no.vercel.app'` (from roadmap)
- Other fields (challenge, solution, features, metrics, gallery): populated in Phase 22

### BaseLayout pageLabels
- Add `/prosjekter/igive` → `'iGive'`
- Add `/prosjekter/blom-company` → `'Blom Company'`

### ProjectTeaser.astro (homepage)
- Change `href="/prosjekter"` to `href="/prosjekter/igive"`

### Claude's Discretion
- Exact wording for Blom Company description and challenge/solution (Phase 22 concern, but populate placeholders now)
- Whether to keep or remove `comingSoon` flag from interface (no current use case — Claude decides)
- Scroll-reveal delay classes on the card grid items

</decisions>

<specifics>
## Specific Ideas

- Blom Company is a lifestyle and golf/sport clothing brand — positioning should reflect premium/sport aesthetic, not generic retail
- The `blom-hero.png` and `blom-features.png` images are already committed to `src/assets/images/`
- Follow the existing `igive-hero.png` import pattern for Blom Company image

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Card.astro`: supports `as`, `href`, `hover`, `padding` props — use with `as="a"`, `hover=true` for clickable project cards
- `Section.astro`: standard section wrapper used throughout — use for `ProjectGrid.astro`
- `SectionHeader.astro`: can provide a heading above the grid if needed
- `LinkWithArrow.astro`: existing component for "Se prosjektet →" style links

### Established Patterns
- Image imports via `astro:assets` `Image` component — follow `igive-hero.png` pattern for Blom
- `projects.ts` is the single source of truth for all project data — all consumers read from it
- Section files live in `src/pages/prosjekter/_sections/` with capitalized names
- Scroll-reveal animations use `reveal-on-scroll` + `delay-N` classes

### Integration Points
- `ProjectTeaser.astro` (`src/pages/_home/ProjectTeaser.astro`): hardcodes `/prosjekter` link — update to `/prosjekter/igive`
- `BaseLayout.astro` (`src/layouts/BaseLayout.astro`): `pageLabels` Record — add 2 new entries
- `ProjectShowcase.astro` and `Results.astro` in `_sections/`: delete both files after replacing with `ProjectGrid.astro`
- `index.astro` imports: remove ProjectShowcase and Results, add ProjectGrid

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 21-konfig-og-indeks*
*Context gathered: 2026-03-07*
