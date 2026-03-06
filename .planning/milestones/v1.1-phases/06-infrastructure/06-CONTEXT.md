# Phase 6: Infrastructure - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

All shared infrastructure is in place before any service sub-page ships: `services.ts` config, contact form `?tjeneste=` param handling, nav active state for `/tjenester/*` sub-pages, and breadcrumbs component. No service pages are built in this phase — only the plumbing they depend on.

</domain>

<decisions>
## Implementation Decisions

### Contact form — ?tjeneste= param
- `?tjeneste=` is the new primary CTA param for service pages (e.g. `/kontakt?tjeneste=nettside`)
- `?pakke=` handling stays for backward compatibility but is not used by new CTAs
- When `?tjeneste=` is present, show a service confirmation badge: "Nettside valgt" (service name only — no price, user already saw it on the service page)
- Badge uses the same visual pattern as the existing package badge (border-brand/20, brand/5 bg, checkmark icon)
- A hidden `tjeneste` field is added to the Formspree submission payload
- FormData interface gets a `tjeneste` field alongside the existing `pakke` field
- Both badge types can show simultaneously if somehow both params are present — service badge takes visual priority (rendered above pakke badge)

### services.ts config schema
- File: `src/config/services.ts`
- Fields per service: `slug` (url segment), `name` (display name), `tagline` (one-line value prop), `priceRange` (display string, e.g. "fra 15 000 kr"), `ctaParam` (the ?tjeneste= value, same as slug), `description` (one-sentence outcome for service cards in Phase 7)
- All 7 services defined: nettside, nettbutikk, landingsside, webapp, seo, ai, vedlikehold
- TypeScript interface exported alongside the data array (same pattern as `src/config/pricing.ts`)

### Breadcrumbs component
- New Astro component: `src/components/ui/Breadcrumbs.astro`
- Accepts an array of `{ label: string, href?: string }` — last item has no href (current page)
- Separator: ` / ` (plain slash, matching the requirements spec)
- Visual style: muted text (`text-text-muted`) for parent links (clickable, hover to `text-text`), normal text for current page (non-interactive)
- Placed below the nav, above the page hero on `/tjenester/*` pages
- Mobile: same as desktop — paths are short enough
- No animation (infrastructure, not a hero element)

### Nav active state — dynamic label
- When on any `/tjenester/*` sub-page, the "Tjenester" nav item changes its label to the sub-page name (e.g. "Nettside" on `/tjenester/nettside`)
- On `/tjenester` itself, label stays "Tjenester"
- Active highlight (`text-brand`) applies to the item whenever path `startsWith('/tjenester')`
- Both FloatingNav (desktop) and MobileMenu get this update
- Service name lookup from `services.ts` config by matching slug to `currentPath` segment
- Fallback: if slug not found in services config, show "Tjenester" (safe default)

</decisions>

<specifics>
## Specific Ideas

- "The tjenester nav item should change to the current sub-page" — not just highlighting, but dynamic label swap
- Badge for `?tjeneste=` should feel like the existing `?pakke=` badge visually, just simpler content (name only, no pricing)
- Breadcrumb style should fit the site identity — understated, dark theme, not decorative

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/config/pricing.ts`: Pattern for `services.ts` — TypeScript interface + exported array, same file structure
- `ContactForm.tsx` (`useEffect` for URL params, badge JSX): `?tjeneste=` handling mirrors `?pakke=` logic, reuse the badge component pattern
- `FloatingNav.tsx` (`currentPath` state via `window.location.pathname`): Already reactive to path — extend with `startsWith` check and service name lookup
- `MobileMenu.tsx`: Gets the same active state update as FloatingNav (receives `navItems` and `currentPath` as props)
- `src/components/ui/` (Button, Card, Section, SectionHeader, LinkWithArrow): `Breadcrumbs.astro` lives here — follows same Astro component pattern

### Established Patterns
- Config files in `src/config/` export a TypeScript interface + named array — `services.ts` follows this exactly
- React islands read URL params in a `useEffect` on mount — contact form already does this for `?pakke=`
- Nav active state is computed from `currentPath` string comparison — extend with `startsWith` and label swap logic

### Integration Points
- `ContactForm.tsx`: Add `tjeneste` to `FormData` interface, add `useEffect` param reader, add badge JSX, add hidden field in form, include in Formspree payload
- `FloatingNav.tsx`: Import `services` from config, compute active item with `startsWith`, derive label from path segment
- `MobileMenu.tsx`: Receives updated `navItems` (or just `currentPath`) — update label there too
- `src/pages/tjenester/*/index.astro` (future pages): Will import `Breadcrumbs` and pass `[{ label: 'Hjem', href: '/' }, { label: 'Tjenester', href: '/tjenester' }, { label: 'Nettside' }]`

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-infrastructure*
*Context gathered: 2026-03-04*
