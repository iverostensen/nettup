---
phase: 06-infrastructure
plan: 03
subsystem: ui
tags: [astro, react, breadcrumbs, contactform, formspree, services]

# Dependency graph
requires:
  - phase: 06-01
    provides: services.ts config with slug/name/ctaParam for all 7 services
provides:
  - ContactForm with ?tjeneste= URL param reading and service badge
  - Breadcrumbs.astro reusable nav component for /tjenester/* pages
  - BaseLayout pageLabels with all 7 service slugs for correct JSON-LD breadcrumb names
affects:
  - 07-service-pages (uses Breadcrumbs.astro in every /tjenester/* page)
  - future CTA buttons that link to /kontakt?tjeneste=[slug]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "URL param guard: validate ?tjeneste= value against services.map(s => s.slug) before setState"
    - "Badge ordering: service badge renders above pakke badge in ContactForm"
    - "Breadcrumbs: pure Astro component, no client JS, typed BreadcrumbItem interface"

key-files:
  created:
    - src/components/ui/Breadcrumbs.astro
  modified:
    - src/pages/kontakt/_sections/ContactForm.tsx
    - src/layouts/BaseLayout.astro

key-decisions:
  - "Service badge is simpler than pakke badge: no price info, no dismiss button — displays name + checkmark only"
  - "Breadcrumbs.astro has no animation and no client JS — pure Astro, follows existing ui/ component pattern"
  - "pageLabels uses AI-løsning (hyphenated) matching services.ts name field exactly"

patterns-established:
  - "URL param validation: always guard against invalid slugs using services.map(s => s.slug).includes()"
  - "Badge stacking: tjeneste badge above pakke badge, both can coexist"
  - "Breadcrumb component: items array with optional href — no href means aria-current=page"

requirements-completed: [INFRA-01, INFRA-03, CTA-02]

# Metrics
duration: 7min
completed: 2026-03-04
---

# Phase 6 Plan 03: ContactForm tjeneste param, Breadcrumbs, and pageLabels Summary

**ContactForm extended with ?tjeneste= URL param and service badge, Breadcrumbs.astro created as reusable accessible nav, BaseLayout pageLabels updated with all 7 service slug Norwegian labels**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-03-04T18:20:00Z
- **Completed:** 2026-03-04T18:27:00Z
- **Tasks:** 2
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments
- ContactForm reads ?tjeneste= URL param, validates against services.ts slugs, renders service badge above pakke badge, includes tjeneste in hidden field and Formspree JSON payload
- Breadcrumbs.astro created as pure Astro component with typed BreadcrumbItem interface, / separators, aria-current="page" on last item, hover transitions on links
- BaseLayout pageLabels expanded from 5 to 12 entries with all 7 /tjenester/[slug] paths using Norwegian names — enables correct JSON-LD BreadcrumbList for service pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend ContactForm with ?tjeneste= param support** - `549e5ef` (feat)
2. **Task 2: Create Breadcrumbs.astro and update BaseLayout pageLabels** - `7074871` (feat)

**Plan metadata:** (final docs commit)

## Files Created/Modified
- `src/pages/kontakt/_sections/ContactForm.tsx` - Added tjeneste to FormData interface, useState, URL param useEffect, service badge JSX, hidden input, Formspree payload
- `src/components/ui/Breadcrumbs.astro` - New: accessible breadcrumb nav component with typed props
- `src/layouts/BaseLayout.astro` - Extended pageLabels with 7 service slug entries

## Decisions Made
- Service badge uses no dismiss button and no price info — simpler than pakke badge since service context is broader, not a transactional commitment
- Breadcrumbs.astro is pure Astro with no Framer Motion — correct for a utility nav component
- pageLabels entry for AI uses "AI-løsning" (matching services.ts name field) not "AI" for correct breadcrumb display

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
Pre-existing TypeScript errors in DeviceMockup.tsx (Framer Motion Variants type) and ui/index.ts (Astro module resolution) were present before this plan. None of these are caused by or affect the changes made here. Build passes cleanly.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 6 infrastructure complete: services.ts config, FloatingNav/MobileMenu active states, ContactForm tjeneste param, Breadcrumbs.astro, BaseLayout pageLabels
- Phase 7 (service pages) can now use Breadcrumbs.astro and link CTAs to /kontakt?tjeneste=[slug] immediately

---
*Phase: 06-infrastructure*
*Completed: 2026-03-04*
