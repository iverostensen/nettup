---
phase: 03-seo-portfolio
verified: 2026-03-04T13:45:00Z
status: gaps_found
score: 9/10 must-haves verified
gaps:
  - truth: "The /prosjekter page showcases at least 2-3 projects with distinct visual treatment (not just iGive)"
    status: failed
    reason: "Only iGive exists in the projects array. The scaffold supports additional projects, but PORT-01 requires minimum 2-3 actual projects to be present. Success Criterion 3 from ROADMAP.md explicitly states 'at least 2-3 projects with distinct visual treatment (not just iGive)'. The context document re-scoped this to scaffold-only, but the requirement and success criterion are unmet."
    artifacts:
      - path: "src/config/projects.ts"
        issue: "Contains only 1 project (iGive). The array scaffold is correct but the content requirement for 2-3 projects is not fulfilled."
    missing:
      - "At least 1 additional project entry in src/config/projects.ts — either a real project with full data, or a comingSoon: true card entry that renders visible scaffolding on the page"
human_verification:
  - test: "Visit homepage and scroll past ProjectTeaser to Testimonials section"
    expected: "Two testimonial cards appear side-by-side on desktop (stacked on mobile), each showing a quote, a cyan 'Vi fikk...' result line, initials avatar, and full attribution"
    why_human: "Visual treatment and layout feel cannot be verified programmatically"
  - test: "Visit /prosjekter and review the iGive case study"
    expected: "iGive case study renders identically to pre-refactor — category badge, project name, description, screenshot, Utfordringen/Losningen two-column cards, Hva vi leverte feature list — all from config data"
    why_human: "Visual fidelity of refactored data-driven rendering needs human confirmation"
  - test: "Replace placeholder testimonials in src/config/testimonials.ts with real client quotes before production"
    expected: "TODO comment at top of file; placeholder names 'Kari Nordmann' and 'Ola Hansen' must be replaced with real testimonials before launch"
    why_human: "Content accuracy requires user action, not code verification"
---

# Phase 3: SEO & Portfolio Verification Report

**Phase Goal:** The site is discoverable by Norwegian SMBs searching for web help, and visitors see proof that Nettup delivers real projects
**Verified:** 2026-03-04T13:45:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| #  | Truth                                                                                                                   | Status     | Evidence                                                                                                       |
|----|-------------------------------------------------------------------------------------------------------------------------|------------|----------------------------------------------------------------------------------------------------------------|
| 1  | Every page has unique, tailored title and description tags plus OG tags — no duplicate or generic metadata across 5 pages | ✓ VERIFIED | All 5 titles unique in built HTML; OG tags wired from BaseLayout props via `new URL(image, Astro.site)`       |
| 2  | Structured data schemas (Service x3, FAQ, BreadcrumbList site-wide) are present and validate                           | ✓ VERIFIED | Built /tjenester contains: Organization, LocalBusiness, Offer, BreadcrumbList, Service x3, FAQPage — 8 schemas |
| 3  | /prosjekter showcases at least 2-3 projects with distinct visual treatment (not just iGive)                            | ✗ FAILED   | Only 1 project in projects.ts (iGive). Scaffold supports additional projects but none are present.             |
| 4  | Testimonials on the homepage have strong visual treatment and prominent placement                                       | ✓ VERIFIED | Testimonials.astro wired into index.astro between ProjectTeaser and CTA; "Hva kundene sier" confirmed in built HTML |

**Score:** 3/4 success criteria fully verified (plus 6/7 plan-level must-haves — see below)

### Plan-Level Must-Haves

#### Plan 01 — SEO Metadata & BreadcrumbList

| # | Truth                                                                                                                  | Status     | Evidence                                                                                 |
|---|------------------------------------------------------------------------------------------------------------------------|------------|------------------------------------------------------------------------------------------|
| 1 | Every page has unique, keyword-focused title and description targeting Norwegian SMB intent                            | ✓ VERIFIED | 5 unique titles confirmed in built HTML; no duplicates                                   |
| 2 | Every page has correct OG tags (og:title, og:description, og:image, og:url)                                           | ✓ VERIFIED | BaseLayout.astro lines 76-80 wire all 4 OG tags from props; og:image uses `new URL(image, Astro.site)` |
| 3 | BreadcrumbList JSON-LD appears in `<head>` of every page, computed from current URL pathname                          | ✓ VERIFIED | breadcrumbSchema computed at lines 50-57 of BaseLayout.astro; emitted at line 170        |
| 4 | BreadcrumbList uses absolute URLs and omits `item` on the final entry                                                 | ✓ VERIFIED | Built /tjenester: last breadcrumb item has no `item` property; URLs are `https://nettup.no/...` |

#### Plan 02 — Service JSON-LD Schemas

| # | Truth                                                                                                  | Status     | Evidence                                                                                       |
|---|--------------------------------------------------------------------------------------------------------|------------|-----------------------------------------------------------------------------------------------|
| 1 | /tjenester emits one Service JSON-LD schema per pricing package (3 total: Enkel, Standard, Premium)   | ✓ VERIFIED | Built /tjenester: 3 Service schemas with names "Nettup Enkel", "Nettup Standard", "Nettup Premium" |
| 2 | Each Service schema includes name, description, provider (Nettup), areaServed (Norway), and NOK price | ✓ VERIFIED | price: 2500/4500/10000, priceCurrency: NOK, areaServed: Norway, provider.name: Nettup           |
| 3 | FAQ schema NOT duplicated — exactly one FAQPage block on /tjenester                                   | ✓ VERIFIED | Built output schema count: exactly 1 FAQPage (from FAQ.astro is:inline)                        |

#### Plan 03 — Projects Config Scaffold

| # | Truth                                                                                                           | Status     | Evidence                                                                                     |
|---|-----------------------------------------------------------------------------------------------------------------|------------|----------------------------------------------------------------------------------------------|
| 1 | A typed projects data array exists in src/config/projects.ts with iGive as first entry                         | ✓ VERIFIED | File exists; exports `Project` interface and `projects` array with iGive at index 0           |
| 2 | Adding a new project requires only appending to the projects array — zero layout rework                        | ✓ VERIFIED | ProjectShowcase.astro uses `projects.find(caseStudySection)` and `projects.filter` — data-driven |
| 3 | The /prosjekter page renders the iGive case study exactly as before                                            | ✓ VERIFIED | Built HTML contains Gavekort-plattform, salg.igive.no, Utfordringen, Hva vi leverte           |
| 4 | New projects support comingSoon badge or URL link — both supported by the type                                  | ✓ VERIFIED | ProjectShowcase.astro lines 116-147 conditionally render comingSoon badge or external link     |

#### Plan 04 — Testimonials Section

| # | Truth                                                                                                                          | Status     | Evidence                                                                                               |
|---|--------------------------------------------------------------------------------------------------------------------------------|------------|--------------------------------------------------------------------------------------------------------|
| 1 | Homepage displays 2 testimonials in side-by-side layout (stacked mobile, 2 columns at md+)                                    | ✓ VERIFIED | Testimonials.astro: `grid gap-6 md:grid-cols-2`; built homepage contains "Hva kundene sier" and "Vi fikk" |
| 2 | Each testimonial shows quote, concrete result, and full attribution (name, title, company)                                     | ✓ VERIFIED | testimonials.ts has `quote`, `result`, `name`, `title`, `company` fields; all rendered in Testimonials.astro |
| 3 | Each card has a placeholder avatar slot (initials circle) swappable for photo                                                  | ✓ VERIFIED | Testimonials.astro lines 25-39: conditional `t.photoUrl ?` renders img or initials div                 |
| 4 | Testimonials section appears between ProjectTeaser and CTA on homepage                                                        | ✓ VERIFIED | index.astro order: ProjectTeaser (line 27), Testimonials (line 28), CTA (line 29)                      |
| 5 | Cards animate in using existing reveal-on-scroll system                                                                        | ✓ VERIFIED | Testimonials.astro: `reveal-on-scroll delay-${i + 1}` on each Card                                    |

### Required Artifacts

| Artifact                                                | Status     | Level 1  | Level 2  | Level 3      | Details                                                      |
|---------------------------------------------------------|------------|----------|----------|--------------|--------------------------------------------------------------|
| `src/layouts/BaseLayout.astro`                          | ✓ VERIFIED | Exists   | Substantive | Wired       | BreadcrumbList computed; `<slot name="head" />` at line 200; OG tags wired |
| `src/pages/om-oss/index.astro`                          | ✓ VERIFIED | Exists   | Substantive | Wired       | Title: "Om Nettup | Webbyrå i Oslo-området | Moderne nettsider" |
| `src/pages/prosjekter/index.astro`                      | ✓ VERIFIED | Exists   | Substantive | Wired       | Title: "Prosjekter | Se Resultater fra Norske Bedrifter | Nettup" |
| `src/pages/kontakt/index.astro`                         | ✓ VERIFIED | Exists   | Substantive | Wired       | Title: "Kontakt Oss | Gratis Tilbud | Nettup" (already strong, preserved) |
| `src/pages/tjenester/index.astro`                       | ✓ VERIFIED | Exists   | Substantive | Wired       | Imports pakker; serviceSchemas computed; Fragment slot="head" |
| `src/config/projects.ts`                                | ✓ VERIFIED | Exists   | Substantive | Wired       | Exports Project interface + projects array; used by ProjectShowcase.astro |
| `src/pages/prosjekter/_sections/ProjectShowcase.astro`  | ✓ VERIFIED | Exists   | Substantive | Wired       | Imports projects; renders caseStudyProject + additionalProjects |
| `src/config/testimonials.ts`                            | ✓ VERIFIED | Exists   | Substantive | Wired       | Exports Testimonial interface + 2 entries; imported by Testimonials.astro |
| `src/pages/_home/Testimonials.astro`                    | ✓ VERIFIED | Exists   | Substantive | Wired       | Imports testimonials; renders Section/SectionHeader/Card with map |
| `src/pages/index.astro`                                 | ✓ VERIFIED | Exists   | Substantive | Wired       | Imports and renders `<Testimonials />` between ProjectTeaser and CTA |

### Key Link Verification

| From                                           | To                              | Via                                              | Status     | Details                                                          |
|------------------------------------------------|---------------------------------|--------------------------------------------------|------------|------------------------------------------------------------------|
| `BaseLayout.astro`                             | `Astro.url.pathname`            | `pathname.split('/').filter(Boolean)` + pageLabels | ✓ WIRED  | Lines 33-57: breadcrumb computed from pathname at build time      |
| `og:image`                                     | `Astro.site`                    | `new URL(image, Astro.site)`                     | ✓ WIRED    | Line 80: absolute OG image URL confirmed                          |
| `tjenester/index.astro`                        | `src/config/pricing.ts`         | `import { pakker } from '@/config/pricing'`      | ✓ WIRED    | Line 3: import present; `pakker.map(...)` at lines 12-31          |
| `ProjectShowcase.astro`                        | `src/config/projects.ts`        | `import { projects } from '@/config/projects'`   | ✓ WIRED    | Line 4: import; `projects.find` line 6, `projects.filter` line 7  |
| `Testimonials.astro`                           | `src/config/testimonials.ts`    | `import { testimonials } from '@/config/testimonials'` | ✓ WIRED | Line 5: import; `testimonials.map` at line 14                |
| `index.astro`                                  | `Testimonials.astro`            | `import Testimonials`                            | ✓ WIRED    | Line 11: import; `<Testimonials />` at line 28                    |

### Requirements Coverage

| Requirement | Plans     | Description                                                            | Status       | Evidence                                                                             |
|-------------|-----------|------------------------------------------------------------------------|--------------|--------------------------------------------------------------------------------------|
| SEO-01      | 03-01     | Every page has unique, optimized metadata — title, description, OG tags | ✓ SATISFIED  | All 5 pages have unique titles; OG tags wired from BaseLayout props                  |
| SEO-02      | 03-01, 03-02 | Service schema, FAQ, BreadcrumbList structured data present         | ✓ SATISFIED  | Built /tjenester: 3x Service + 1x FAQPage + 1x BreadcrumbList confirmed              |
| PORT-01     | 03-03     | Portfolio expanded to minimum 2-3 projects (currently 1 — iGive)       | ✗ BLOCKED    | Only iGive in projects array. Scaffold built but content requirement unmet. Success Criterion 3 requires "at least 2-3 projects with distinct visual treatment (not just iGive)" |
| PORT-02     | 03-04     | Testimonials prominently placed on homepage with strong visual treatment | ✓ SATISFIED  | Testimonials.astro between ProjectTeaser and CTA; 2 cards with blockquote/cite markup |

**Orphaned requirements:** None — all phase-3 requirement IDs (SEO-01, SEO-02, PORT-01, PORT-02) were claimed in plans.

### Anti-Patterns Found

| File                         | Line | Pattern                                              | Severity | Impact                                                                            |
|------------------------------|------|------------------------------------------------------|----------|-----------------------------------------------------------------------------------|
| `src/config/testimonials.ts` | 1    | `// TODO: Replace with real client testimonials before production` | ⚠️ Warning | Intentional per plan — placeholder copy must be replaced before production launch. Not a blocker for code, but is a blocker for production readiness. |

### Human Verification Required

#### 1. Testimonials Visual Layout

**Test:** Visit localhost:4321 and scroll past the projects teaser section on the homepage.
**Expected:** Two testimonial cards appear side-by-side on desktop (min-width: 768px), stacked vertically on mobile. Each card shows: large decorative quote mark, quote text, cyan-colored result line starting with "Vi fikk", and a footer with initials avatar circle and full name/title/company attribution.
**Why human:** Visual grid layout, color rendering, and responsive stacking cannot be fully verified from built HTML alone.

#### 2. iGive Case Study Visual Fidelity After Refactor

**Test:** Visit localhost:4321/prosjekter and review the iGive case study.
**Expected:** The page renders identically to before the refactor — category badge (B2B), type label, h2 heading, description, external link to salg.igive.no, screenshot image, two-column Utfordringen/Losningen cards, and the Hva vi leverte feature list with checkmark icons.
**Why human:** Visual fidelity after a data-driven refactor requires human confirmation that nothing regressed.

#### 3. Replace Placeholder Testimonials Before Launch

**Test:** Open `src/config/testimonials.ts` and confirm whether real client testimonials have been obtained.
**Expected:** "Kari Nordmann" / "Eksempelbedrift AS" placeholders replaced with real client quotes, results, and attribution before production deployment.
**Why human:** Content replacement requires user action; the code structure is correct.

### Gaps Summary

**1 gap found — PORT-01 portfolio expansion not completed.**

PORT-01 requires "Portfolio expanded to minimum 2-3 projects". The ROADMAP Success Criterion 3 states: "The /prosjekter page showcases at least 2-3 projects with distinct visual treatment (not just iGive)."

Plan 03-03 built a correct data-driven scaffold in `src/config/projects.ts` and refactored `ProjectShowcase.astro` to render from the array. However, only iGive is in the array. The plan's objective explicitly re-scoped to "scaffold only" because new projects were not ready yet (per the CONTEXT.md: "Hold: 1-2 new projects are coming soon but not ready yet").

The scaffold works correctly — adding a project requires only appending to the array. But the requirement and success criterion for the phase are not met until at least one more project is present (whether a real project with full data, or a `comingSoon: true` card entry that makes the scaffold visible on the live page).

The `TODO` in `testimonials.ts` is flagged as a warning (not a blocker for code), but placeholder testimonials should be replaced with real client quotes before production.

---

_Verified: 2026-03-04T13:45:00Z_
_Verifier: Claude (gsd-verifier)_
