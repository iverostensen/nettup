# Phase 3: SEO & Portfolio - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the site discoverable by Norwegian SMBs searching for web help, and give visitors proof that Nettup delivers real projects. This phase covers: per-page metadata, structured data schemas, portfolio expansion, and testimonials on the homepage. Conversion CTAs and mobile audit belong to Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Metadata per page
- Claude's Discretion: write unique, keyword-focused title + description for each of the 5 pages
- Target Norwegian SMB search intent (e.g., "nettside bedrift oslo", "webdesign pris")
- BaseLayout already accepts title/description props — this is copywriting work, not infrastructure

### Structured data schemas
- Claude's Discretion: implement in this priority order:
  1. FAQ schema on /tjenester (FAQ.astro already exists — easy win, Google rich results)
  2. BreadcrumbList site-wide
  3. Service schema per service offering
- BaseLayout already has Organization + LocalBusiness + Offer schemas — add new schemas per-page

### Portfolio expansion
- Hold: 1-2 new projects are coming soon but not ready yet
- Planner should scaffold the portfolio page so new projects can be added easily without rework
- Keep iGive as the current showcase — do not redesign the existing case study layout

### Testimonials on homepage
- Add a new Testimonials section to the homepage
- **Format:** Quote + concrete result (e.g., "We got X") — not just praise
- **Count:** 2 testimonials, paired layout
- **Placement:** Right before the CTA section — last trust signal before conversion ask
- **Attribution:** Full name + title + company (e.g., "Kari Nordmann, Daglig leder, iGive")
- **Extensible:** Design should support adding a profile photo later without restructuring

### Claude's Discretion
- Exact copy for all metadata (titles, descriptions, OG tags)
- Specific structured data implementation details
- Testimonial card visual design (spacing, quote styling, layout at mobile/desktop)
- Loading skeleton / animation treatment for testimonial section

</decisions>

<specifics>
## Specific Ideas

- Testimonials: quote + result format, not generic praise. Each testimonial should include something concrete ("vi fikk X").
- Portfolio: scaffold for easy addition — when new projects are ready, they should slot in without rework.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `BaseLayout.astro`: already has Organization + LocalBusiness + Offer JSON-LD; accepts title/description/image props per page
- `Card` component (`src/components/ui/Card.astro`): usable for testimonial cards
- `Section` + `SectionHeader` components: standard layout wrappers for new homepage section
- `FAQ.astro` on /tjenester: ready candidate for FAQ schema injection
- `ProjectShowcase.astro`: existing iGive case study layout — reuse pattern for new projects

### Established Patterns
- JSON-LD schemas: inline `<script type="application/ld+json">` in .astro files — match this pattern
- Scroll reveal: `reveal-on-scroll` + `delay-N` classes on elements — use for testimonial section
- Section layout: `<Section>` + `<SectionHeader title="...">` — use for Testimonials section

### Integration Points
- Homepage (`src/pages/index.astro`): add Testimonials import between ProjectTeaser and CTA
- `/tjenester`: add FAQ schema inline, no component changes needed
- BaseLayout: add BreadcrumbList and Service schemas per-page (passed as props or slot)

</code_context>

<deferred>
## Deferred Ideas

- Portfolio photos / profile images for testimonials — mentioned as future extension, not this phase
- New project case studies — projects not ready yet, scaffold only this phase

</deferred>

---

*Phase: 03-seo-portfolio*
*Context gathered: 2026-03-03*
