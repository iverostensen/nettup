# Roadmap: Nettup.no

## Overview

Nettup.no is a functional 5-page marketing site that works but lacks visual identity and polish. This roadmap transforms it from "competent but generic" to a site that visually proves Nettup builds modern websites. The journey starts with defining who Nettup is (brand), then demonstrating technical skill (animations), expanding credibility (SEO + portfolio), and finally optimizing for the one thing that matters: getting visitors to fill out the contact form.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Brand Identity** - Define personality, implement design token system, upgrade typography (completed 2026-03-03)
- [ ] **Phase 2: Animation & Interaction** - Build animation preset system, hero showcase animation, page transitions
- [ ] **Phase 3: SEO & Portfolio** - Per-page metadata, structured data schemas, expand portfolio to 2-3 projects
- [ ] **Phase 4: Conversion Optimization** - Contextual CTAs on every page, smart form pre-fill, testimonial treatment, mobile UX audit

## Phase Details

### Phase 1: Brand Identity
**Goal**: Nettup has a defined, documented brand personality that is consistently expressed through a code-level design token system and distinctive typography
**Depends on**: Nothing (first phase)
**Requirements**: BRAND-01, BRAND-02, BRAND-03
**Success Criteria** (what must be TRUE):
  1. A brand document exists defining Nettup's personality, tone, and visual values -- and these are reflected in site copy and design choices
  2. A design token system in code (config/brand.ts -> Tailwind config) controls colors, typography scale, spacing, animation timing, and border radius conventions across the entire site
  3. Headings use a distinct, intentionally chosen font that differentiates from generic dark-theme sites -- the site no longer looks like a SaaS template
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Write .planning/BRAND.md brand personality document (mission, tone, contrast table, copy principles)
- [x] 01-02-PLAN.md — Create src/config/brand.ts and wire tokens into tailwind.config.ts
- [x] 01-03-PLAN.md — Load Space Grotesk, apply font-display to all H1s, add gradient text to RotatingText
- [x] 01-04-PLAN.md — Migrate UI components (Button, Card, SectionHeader) to token classes, remove CSS delay classes

### Phase 2: Animation & Interaction
**Goal**: Animations across the site demonstrate technical capability and follow a consistent, intentional system -- not random motion
**Depends on**: Phase 1 (animation timing tokens, brand personality inform animation style)
**Requirements**: ANIM-01, ANIM-02, ANIM-03
**Success Criteria** (what must be TRUE):
  1. An animation preset library (lib/animation.ts) with consistent easing curves and duration tokens is used by all animated components -- no hardcoded animation values scattered across files
  2. The hero section features a visually impressive Framer Motion animation using advanced APIs (spring physics, scroll-driven, or orchestrated sequencing) that makes visitors think "these people know what they are doing"
  3. Navigating between pages triggers smooth View Transitions via Astro's native support -- page changes feel app-like, not like traditional full reloads
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — Create src/lib/animation.ts preset library and migrate RotatingText + FloatingNav to use it
- [ ] 02-02-PLAN.md — Build HeroIsland.tsx with orchestrated spring animation, replace Hero.astro
- [ ] 02-03-PLAN.md — Add ClientRouter view transitions to BaseLayout.astro, fix FloatingNav path tracking

### Phase 3: SEO & Portfolio
**Goal**: The site is discoverable by Norwegian SMBs searching for web help, and visitors see proof that Nettup delivers real projects
**Depends on**: Phase 1 (brand tone for metadata copy, visual treatment for portfolio)
**Requirements**: SEO-01, SEO-02, PORT-01, PORT-02
**Success Criteria** (what must be TRUE):
  1. Every page has unique, tailored title and description tags plus OG tags -- no duplicate or generic metadata across the 5 pages
  2. Structured data schemas (Service for each offering, FAQ on /tjenester, BreadcrumbList site-wide) are present and validate without errors in Google's Rich Results Test
  3. The /prosjekter page showcases at least 2-3 projects with distinct visual treatment (not just iGive)
  4. Testimonials on the homepage have strong visual treatment and prominent placement that builds trust immediately
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Conversion Optimization
**Goal**: Every page guides visitors toward the contact form with contextually relevant calls to action, and mobile experience is flawless
**Depends on**: Phase 1, Phase 2, Phase 3 (brand styling, animation interactions, portfolio/trust signals all feed into conversion)
**Requirements**: CONV-01, CONV-02, CONV-03
**Success Criteria** (what must be TRUE):
  1. Every page has at least one CTA that leads toward the contact form, with copy that is contextually relevant to what the visitor just read on that page
  2. Clicking a service-specific CTA on /tjenester opens the contact form with the relevant service already selected -- reducing friction from interest to inquiry
  3. All pages pass a manual mobile UX audit at 375px: no layout overflow, all tap targets are at least 44px, forms are usable with thumb, no horizontal scrolling
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Brand Identity | 4/4 | Complete   | 2026-03-03 |
| 2. Animation & Interaction | 0/3 | Not started | - |
| 3. SEO & Portfolio | 0/0 | Not started | - |
| 4. Conversion Optimization | 0/0 | Not started | - |
