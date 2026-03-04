# Phase 6: Infrastructure - Research

**Researched:** 2026-03-04
**Domain:** Astro 5 + React islands — URL params, nav active state, config file, breadcrumbs component
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Contact form — ?tjeneste= param**
- `?tjeneste=` is the new primary CTA param for service pages (e.g. `/kontakt?tjeneste=nettside`)
- `?pakke=` handling stays for backward compatibility but is not used by new CTAs
- When `?tjeneste=` is present, show a service confirmation badge: "Nettside valgt" (service name only — no price, user already saw it on the service page)
- Badge uses the same visual pattern as the existing package badge (border-brand/20, brand/5 bg, checkmark icon)
- A hidden `tjeneste` field is added to the Formspree submission payload
- FormData interface gets a `tjeneste` field alongside the existing `pakke` field
- Both badge types can show simultaneously if somehow both params are present — service badge takes visual priority (rendered above pakke badge)

**services.ts config schema**
- File: `src/config/services.ts`
- Fields per service: `slug` (url segment), `name` (display name), `tagline` (one-line value prop), `priceRange` (display string, e.g. "fra 15 000 kr"), `ctaParam` (the ?tjeneste= value, same as slug), `description` (one-sentence outcome for service cards in Phase 7)
- All 7 services defined: nettside, nettbutikk, landingsside, webapp, seo, ai, vedlikehold
- TypeScript interface exported alongside the data array (same pattern as `src/config/pricing.ts`)

**Breadcrumbs component**
- New Astro component: `src/components/ui/Breadcrumbs.astro`
- Accepts an array of `{ label: string, href?: string }` — last item has no href (current page)
- Separator: ` / ` (plain slash, matching the requirements spec)
- Visual style: muted text (`text-text-muted`) for parent links (clickable, hover to `text-text`), normal text for current page (non-interactive)
- Placed below the nav, above the page hero on `/tjenester/*` pages
- Mobile: same as desktop — paths are short enough
- No animation (infrastructure, not a hero element)

**Nav active state — dynamic label**
- When on any `/tjenester/*` sub-page, the "Tjenester" nav item changes its label to the sub-page name (e.g. "Nettside" on `/tjenester/nettside`)
- On `/tjenester` itself, label stays "Tjenester"
- Active highlight (`text-brand`) applies to the item whenever path `startsWith('/tjenester')`
- Both FloatingNav (desktop) and MobileMenu get this update
- Service name lookup from `services.ts` config by matching slug to `currentPath` segment
- Fallback: if slug not found in services config, show "Tjenester" (safe default)

### Claude's Discretion

None — all decisions are locked.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | ContactForm.tsx støtter `?tjeneste=` URL-param pre-fill ved siden av eksisterende `?pakke=` | ContactForm.tsx useEffect pattern already reads `?pakke=`; add parallel `?tjeneste=` reader and badge JSX |
| INFRA-02 | FloatingNav og MobileMenu bruker `startsWith` for aktiv-tilstand — fikser ødelagt nav-highlight på alle 7 undersider | FloatingNav uses `currentPath === item.href` (exact match); change to `startsWith` + add label swap from services.ts |
| INFRA-03 | BaseLayout `pageLabels`-map inkluderer alle 7 `/tjenester/[slug]`-ruter for korrekte norske brødsmule-etiketter | pageLabels Record in BaseLayout.astro already drives JSON-LD breadcrumbs; add 7 slug entries |
| CONFIG-01 | `src/config/services.ts` opprettet med alle 7 tjenesteobjekter (slug, name, tagline, priceRange, included, faq, ctaParam) | Model after pricing.ts: interface + named export array; same import pattern throughout codebase |
| CONFIG-02 | Prisintervaller bruker JSON-LD `PriceSpecification` med `minPrice`/`maxPrice` (ikke eksisterende enkelt `price`-felt) | BaseLayout already has `@type: Offer` with single `price`; service pages will need `PriceSpecification` shape — document in services.ts for Phase 10 use |
| CTA-02 | Kontaktskjema-innsending inkluderer valgt tjeneste i Formspree-data | ContactForm already serialises `pakke` as hidden field in JSON body; add `tjeneste` field alongside it |
</phase_requirements>

---

## Summary

This phase is pure plumbing — no new pages, no new libraries, no new dependencies. Everything is wired using patterns that already exist in the codebase. The four deliverables are: a new config file (`services.ts`), a new Astro UI component (`Breadcrumbs.astro`), an extension to `ContactForm.tsx` (URL param + badge + hidden field), and changes to `FloatingNav.tsx` / `MobileMenu.tsx` (startsWith active state + dynamic label). `BaseLayout.astro` gets one small addition: 7 slug entries in its `pageLabels` map.

All patterns to follow are already in the repo. `pricing.ts` is the exact template for `services.ts`. `ContactForm.tsx` already reads `?pakke=` and shows a badge — the `?tjeneste=` addition is a parallel implementation of the same logic. `FloatingNav.tsx` already holds `currentPath` in state and passes it to `MobileMenu` — extending active state from exact-match to `startsWith` is a one-line change, and the label swap is a computed value derived from `services.ts`. `Breadcrumbs.astro` follows the Astro component convention used by every file in `src/components/ui/`.

No research was needed to identify external libraries because none are introduced. Confidence is HIGH across all areas because every pattern is observable in live code.

**Primary recommendation:** Implement in order — CONFIG-01 first (services.ts), then INFRA-03 (BaseLayout pageLabels), then INFRA-02 (nav active state), then INFRA-01 (ContactForm), then the Breadcrumbs component. This order ensures dependents (nav, form) can import from services.ts once it exists.

---

## Standard Stack

### Core (no changes — existing stack)

| Library | Version (package.json) | Purpose | Why Standard |
|---------|----------------------|---------|--------------|
| Astro | 5.x | Framework, static generation, `.astro` components | Project foundation |
| React | 18.x | Interactive islands (FloatingNav, ContactForm) | Already in use |
| TypeScript | strict | Type safety across config, interfaces, props | Project convention — no `any` |
| Tailwind CSS | 4.x | Utility classes, design tokens | Project design system |

### No new dependencies needed

Every deliverable in this phase uses the existing stack. Do not add packages.

---

## Architecture Patterns

### Pattern 1: Config File — Interface + Named Export Array

**What:** TypeScript file in `src/config/` that exports a typed interface and a named const array. Imported by any component that needs the data.

**When to use:** Any shared data (services, packages, testimonials, projects).

**Example — `pricing.ts` (the template):**
```typescript
// Source: /Users/iverostensen/nettup/src/config/pricing.ts

export interface Pakke {
  id: 'enkel' | 'standard' | 'premium';
  name: string;
  // ... other fields
}

export const pakker: Pakke[] = [
  { id: 'enkel', name: 'Enkel', ... },
  // ...
];
```

**Apply to `services.ts`:**
```typescript
// File: src/config/services.ts

export interface Service {
  slug: string;             // URL segment: 'nettside'
  name: string;             // Display name: 'Nettside'
  tagline: string;          // One-line value prop
  priceRange: string;       // Display string: 'fra 15 000 kr'
  ctaParam: string;         // Same as slug — used for ?tjeneste= CTA links
  description: string;      // One-sentence outcome (Phase 7 service cards)
}

export const services: Service[] = [
  { slug: 'nettside',    name: 'Nettside',    ctaParam: 'nettside',    ... },
  { slug: 'nettbutikk',  name: 'Nettbutikk',  ctaParam: 'nettbutikk',  ... },
  { slug: 'landingsside',name: 'Landingsside', ctaParam: 'landingsside',...},
  { slug: 'webapp',      name: 'Webapp',      ctaParam: 'webapp',      ... },
  { slug: 'seo',         name: 'SEO',         ctaParam: 'seo',         ... },
  { slug: 'ai',          name: 'AI',          ctaParam: 'ai',          ... },
  { slug: 'vedlikehold', name: 'Vedlikehold', ctaParam: 'vedlikehold', ... },
];
```

### Pattern 2: React Island URL Param Reading

**What:** `useEffect` on mount reads `window.location.search` via `URLSearchParams`, sets state. Runs once on mount.

**When to use:** Any React island that needs to pre-populate from URL query params.

**Example — existing `?pakke=` reader (ContactForm.tsx lines 64–89):**
```typescript
// Source: /Users/iverostensen/nettup/src/pages/kontakt/_sections/ContactForm.tsx

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const pakkeParam = params.get('pakke');
  if (pakkeParam && ['enkel', 'standard', 'premium', 'usikker'].includes(pakkeParam)) {
    setFormData((prev) => ({ ...prev, pakke: pakkeParam }));
  }
}, []);
```

**Apply for `?tjeneste=`:**
```typescript
const tjeneste = params.get('tjeneste');
const validSlugs = services.map(s => s.slug);
if (tjeneste && validSlugs.includes(tjeneste)) {
  setFormData((prev) => ({ ...prev, tjeneste }));
}
```

### Pattern 3: Nav Active State with startsWith

**What:** Current implementation uses exact match (`currentPath === item.href`). Need to change "Tjenester" item to use `startsWith('/tjenester')` and swap label to sub-page name.

**Current code (FloatingNav.tsx line 113):**
```typescript
// Source: /Users/iverostensen/nettup/src/components/islands/FloatingNav.tsx
aria-current={currentPath === item.href ? 'page' : undefined}
className={cn(
  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200',
  currentPath === item.href ? 'text-brand' : 'text-text-muted hover:text-text'
)}
```

**Change to (for Tjenester item):**
```typescript
// Compute at top of component — after importing services
const tjenesterActive = currentPath.startsWith('/tjenester');
const currentServiceSlug = currentPath.split('/')[2]; // e.g. 'nettside'
const currentService = services.find(s => s.slug === currentServiceSlug);
const tjenesterLabel = (tjenesterActive && currentPath !== '/tjenester' && currentService)
  ? currentService.name
  : 'Tjenester';
```

### Pattern 4: Astro UI Component

**What:** Plain `.astro` file in `src/components/ui/`. Accepts typed `Props`, renders HTML. No client-side JS.

**When to use:** Structural, non-interactive components. Breadcrumbs have no interactive state.

**Apply for `Breadcrumbs.astro`:**
```astro
---
// Source: follows pattern of src/components/ui/Section.astro, Button.astro etc.

interface BreadcrumbItem {
  label: string;
  href?: string; // Omit for current page (last item)
}

interface Props {
  items: BreadcrumbItem[];
}

const { items } = Astro.props;
---

<nav aria-label="Brødsmulesti" class="text-sm text-text-muted">
  {items.map((item, i) => (
    <>
      {i > 0 && <span class="mx-1 select-none" aria-hidden="true">/</span>}
      {item.href
        ? <a href={item.href} class="hover:text-text transition-colors">{item.label}</a>
        : <span class="text-text" aria-current="page">{item.label}</span>
      }
    </>
  ))}
</nav>
```

### Pattern 5: BaseLayout pageLabels Map

**What:** `pageLabels` Record in `BaseLayout.astro` maps path → Norwegian display name. Used for JSON-LD BreadcrumbList generation.

**Current state (BaseLayout.astro lines 23–29):**
```typescript
// Source: /Users/iverostensen/nettup/src/layouts/BaseLayout.astro
const pageLabels: Record<string, string> = {
  '/': 'Hjem',
  '/tjenester': 'Tjenester',
  '/om-oss': 'Om oss',
  '/prosjekter': 'Prosjekter',
  '/kontakt': 'Kontakt',
};
```

**Add 7 service slug entries:**
```typescript
const pageLabels: Record<string, string> = {
  '/': 'Hjem',
  '/tjenester': 'Tjenester',
  '/tjenester/nettside': 'Nettside',
  '/tjenester/nettbutikk': 'Nettbutikk',
  '/tjenester/landingsside': 'Landingsside',
  '/tjenester/webapp': 'Webapp',
  '/tjenester/seo': 'SEO',
  '/tjenester/ai': 'AI',
  '/tjenester/vedlikehold': 'Vedlikehold',
  '/om-oss': 'Om oss',
  '/prosjekter': 'Prosjekter',
  '/kontakt': 'Kontakt',
};
```

### Recommended Project Structure (unchanged)

```
src/
├── config/
│   ├── pricing.ts          # Existing — pakker array
│   └── services.ts         # NEW — services array (Phase 6)
├── components/
│   ├── islands/
│   │   ├── FloatingNav.tsx  # Modified — startsWith + label swap
│   │   └── MobileMenu.tsx   # Modified — same active state logic
│   └── ui/
│       └── Breadcrumbs.astro # NEW (Phase 6)
├── layouts/
│   └── BaseLayout.astro    # Modified — 7 new pageLabels entries
└── pages/
    └── kontakt/
        └── _sections/
            └── ContactForm.tsx  # Modified — ?tjeneste= support
```

### Anti-Patterns to Avoid

- **Hardcoding service names in nav logic:** Always look up from `services.ts` — slug changes must stay in one place.
- **Adding Kontakt to nav active state:** Only "Tjenester" needs `startsWith` — other items still use exact match. Don't over-generalise.
- **Showing both badges with equal priority:** Service badge (`?tjeneste=`) renders above pakke badge (`?pakke=`). Service badge takes priority per the locked decision.
- **Animating the Breadcrumbs component:** Per the locked decision: no animation. It is infrastructure, not a hero element.
- **Moving ContactForm.tsx to a new location:** It lives at `src/pages/kontakt/_sections/ContactForm.tsx`. Keep it there — Astro colocation pattern.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Slug validation for ?tjeneste= | Custom regex or hardcoded list in ContactForm | `services.map(s => s.slug)` derived from services.ts | Single source of truth; adding a service auto-validates |
| Norwegian label lookup | Inline switch/object per component | `services.find(s => s.slug === slug)?.name` from services.ts | Same reason — one config drives all labels |
| Breadcrumb schema JSON-LD | Per-page BreadcrumbList generation | BaseLayout.astro already generates it from `pageLabels` + URL path | Already works; just add the 7 missing entries to pageLabels |

**Key insight:** `services.ts` is the single source of truth. Any component that needs a service name, slug, or CTA param imports from it. Never duplicate that data in component files.

---

## Common Pitfalls

### Pitfall 1: MobileMenu doesn't get updated navItems label
**What goes wrong:** FloatingNav computes the dynamic label and renders it correctly on desktop, but passes the original static `navItems` array to `MobileMenu`. Mobile nav still shows "Tjenester" instead of the current service name.
**Why it happens:** `navItems` is a static const defined at module level in FloatingNav.tsx. The dynamic label logic must produce a modified version of this array before passing it down.
**How to avoid:** Derive a `displayNavItems` array inside the component body (after computing `tjenesterLabel`), replacing the "Tjenester" name with the dynamic label before passing to `MobileMenu`. Or pass `currentPath` down and compute inside `MobileMenu`.
**Warning signs:** Desktop shows "Nettside" but mobile still shows "Tjenester" when on `/tjenester/nettside`.

### Pitfall 2: MobileMenu aria-current doesn't update for sub-pages
**What goes wrong:** `MobileMenu` uses `currentPath === item.href` for `aria-current`. On `/tjenester/nettside`, this is `false` for the Tjenester item (href is `/tjenester`), so neither visual highlight nor `aria-current="page"` applies.
**Why it happens:** Same exact-match problem as FloatingNav. MobileMenu receives `currentPath` from FloatingNav and must also use `startsWith` for the Tjenester item.
**How to avoid:** Apply same `startsWith('/tjenester')` logic in MobileMenu — either by deriving from `currentPath` prop or by computing `isActive` before rendering.
**Warning signs:** Mobile menu "Tjenester" item is not highlighted (not `text-brand`) when on any `/tjenester/*` sub-page.

### Pitfall 3: ?tjeneste= badge shown without service being found in config
**What goes wrong:** If `tjeneste` param value is not in `services.ts` slugs (e.g. a stale link), the badge renders with `undefined` or an empty service name.
**Why it happens:** Missing null check after `services.find(...)`.
**How to avoid:** Always guard: `const service = services.find(s => s.slug === tjeneste)`. Only set state if `service` exists. Validate slug against `services.map(s => s.slug)` list, not a hardcoded array.
**Warning signs:** Badge renders with empty text or "undefined valgt".

### Pitfall 4: pageLabels fallback shows raw slug in JSON-LD breadcrumbs
**What goes wrong:** BaseLayout falls back to `seg` (raw URL segment) when `pageLabels[fullPath]` is undefined. For `/tjenester/nettside`, if the entry is missing, JSON-LD breadcrumbs show "nettside" not "Nettside".
**Why it happens:** INFRA-03 not implemented — entries not added to pageLabels.
**How to avoid:** Add all 7 slug entries to pageLabels as part of INFRA-03. Visual breadcrumbs component (Breadcrumbs.astro) receives explicit labels from the calling page, so it's not affected — but JSON-LD is generated automatically by BaseLayout.
**Warning signs:** JSON-LD breadcrumb `name` is lowercase raw slug instead of Norwegian label.

### Pitfall 5: FormData interface not updated — TypeScript error
**What goes wrong:** Adding `tjeneste` state to `formData` without updating the `FormData` interface causes a TypeScript strict-mode error.
**Why it happens:** `ContactForm.tsx` uses a typed `FormData` interface. `formData.tjeneste` doesn't exist on the type.
**How to avoid:** Add `tjeneste: string` to the `FormData` interface before using it in state. Initialize in `useState` as empty string `''`.
**Warning signs:** TypeScript compiler error: `Property 'tjeneste' does not exist on type 'FormData'`.

---

## Code Examples

### ContactForm — complete ?tjeneste= extension points

```typescript
// Source: extends /Users/iverostensen/nettup/src/pages/kontakt/_sections/ContactForm.tsx

// 1. Update FormData interface
interface FormData {
  navn: string;
  epost: string;
  telefon: string;
  pakke: string;
  tjeneste: string;  // ADD THIS
  melding: string;
  kilde: string;
}

// 2. Initialize in useState
const [formData, setFormData] = useState<FormData>({
  navn: '',
  epost: '',
  telefon: '',
  pakke: '',
  tjeneste: '',  // ADD THIS
  melding: '',
  kilde: '',
});

// 3. Read from URL param (inside existing useEffect)
const tjeneste = params.get('tjeneste');
const validSlugs = services.map(s => s.slug);
if (tjeneste && validSlugs.includes(tjeneste)) {
  setFormData((prev) => ({ ...prev, tjeneste }));
}

// 4. Lookup service for badge
const selectedTjeneste = formData.tjeneste
  ? services.find(s => s.slug === formData.tjeneste)
  : null;

// 5. Badge JSX — renders above existing pakke badge
{selectedTjeneste && (
  <div className="mb-3 rounded-xl border border-brand/20 bg-brand/5 p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20">
        <svg ...checkmark... className="h-4 w-4 text-brand" />
      </div>
      <p className="font-medium text-text">{selectedTjeneste.name} valgt</p>
    </div>
  </div>
)}

// 6. Hidden field in form
<input type="hidden" name="tjeneste" value={formData.tjeneste} />

// 7. Include in Formspree payload
body: JSON.stringify({
  navn: formData.navn,
  email: formData.epost,
  telefon: formData.telefon || 'Ikke oppgitt',
  pakke: formData.pakke || 'Ikke valgt',
  tjeneste: formData.tjeneste || 'Ikke valgt',  // ADD THIS
  melding: formData.melding,
  kilde: formData.kilde || 'direkte',
}),
```

### FloatingNav — active state and label swap

```typescript
// Source: extends /Users/iverostensen/nettup/src/components/islands/FloatingNav.tsx
// Add import at top
import { services } from '@/config/services';

// Inside component body, after currentPath state:
const tjenesterActive = currentPath.startsWith('/tjenester');
const currentServiceSlug = currentPath.split('/')[2];
const currentService = services.find(s => s.slug === currentServiceSlug);
const tjenesterLabel =
  tjenesterActive && currentPath !== '/tjenester' && currentService
    ? currentService.name
    : 'Tjenester';

// Derived navItems with dynamic label
const displayNavItems = navItems.map(item =>
  item.href === '/tjenester' ? { ...item, name: tjenesterLabel } : item
);

// Active check helper
function isActive(itemHref: string): boolean {
  if (itemHref === '/tjenester') return tjenesterActive;
  return currentPath === itemHref;
}

// In JSX — use displayNavItems and isActive()
{displayNavItems.map((item) => (
  <a
    key={item.href}
    href={item.href}
    aria-current={isActive(item.href) ? 'page' : undefined}
    className={cn(
      'rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200',
      isActive(item.href) ? 'text-brand' : 'text-text-muted hover:text-text'
    )}
  >
    {item.name}
  </a>
))}

// Pass displayNavItems to MobileMenu (not navItems)
<MobileMenu
  isOpen={mobileMenuOpen}
  onClose={() => setMobileMenuOpen(false)}
  navItems={displayNavItems}
  currentPath={currentPath}
  tjenesterActive={tjenesterActive}
/>
```

### MobileMenu — active state fix

```typescript
// Source: extends /Users/iverostensen/nettup/src/components/islands/MobileMenu.tsx
// Add tjenesterActive prop
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  currentPath: string;
  tjenesterActive: boolean; // ADD THIS
}

// Use in JSX — replace exact match for active check
function isItemActive(item: NavItem): boolean {
  if (item.href === '/tjenester') return tjenesterActive;
  return currentPath === item.href;
}

// In motion.a
aria-current={isItemActive(item) ? 'page' : undefined}
className={cn(
  'text-3xl font-semibold transition-colors duration-200',
  isItemActive(item) ? 'text-brand' : 'text-text hover:text-brand'
)}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Exact match `currentPath === item.href` | `startsWith('/tjenester')` for nav parent items | Phase 6 (this phase) | Sub-pages properly highlight parent nav item |
| No `?tjeneste=` param support | `?tjeneste=` reads slug, shows badge, sends to Formspree | Phase 6 (this phase) | Service CTAs properly pre-fill form |
| pageLabels only covers 5 top-level pages | pageLabels covers 5 top-level + 7 service sub-pages | Phase 6 (this phase) | JSON-LD breadcrumbs show Norwegian names on service pages |

**No deprecations** — all existing `?pakke=` behavior is preserved as-is.

---

## Open Questions

1. **CONFIG-02: PriceSpecification shape in services.ts**
   - What we know: The requirement says "prisintervaller bruker JSON-LD `PriceSpecification` med `minPrice`/`maxPrice`". This is for SEO (Phase 10).
   - What's unclear: Should `services.ts` already store min/max numeric values, or just the display string? Phase 6 only needs the display string `priceRange`. Phase 10 will need numeric values for JSON-LD.
   - Recommendation: Include both in `services.ts` now — `priceRange: string` (display) and `minPrice: number` / `maxPrice: number` (for future JSON-LD). Costs nothing to define upfront and avoids a schema change later. Verify with planner.

2. **MobileMenu — pass tjenesterActive as prop vs compute from currentPath**
   - What we know: MobileMenu already receives `currentPath`. It could derive `tjenesterActive` itself using `currentPath.startsWith('/tjenester')`.
   - What's unclear: Either approach works. The prop approach is more explicit; the derive approach avoids prop drilling.
   - Recommendation: Derive inside MobileMenu from `currentPath` — it's a one-liner and avoids adding a prop. Both are correct; planner may choose either.

---

## Sources

### Primary (HIGH confidence)
- Direct code inspection: `/Users/iverostensen/nettup/src/components/islands/FloatingNav.tsx` — current active state logic
- Direct code inspection: `/Users/iverostensen/nettup/src/components/islands/MobileMenu.tsx` — prop interface, active state rendering
- Direct code inspection: `/Users/iverostensen/nettup/src/pages/kontakt/_sections/ContactForm.tsx` — URL param reading, badge pattern, Formspree payload
- Direct code inspection: `/Users/iverostensen/nettup/src/config/pricing.ts` — config file template to follow
- Direct code inspection: `/Users/iverostensen/nettup/src/layouts/BaseLayout.astro` — pageLabels map, breadcrumb JSON-LD generation

### Secondary (MEDIUM confidence)
- `06-CONTEXT.md` — all locked decisions, visual patterns, integration points specified by user
- `REQUIREMENTS.md` — INFRA-01 through CONFIG-02 and CTA-02 descriptions

### Tertiary (LOW confidence)
- None — all findings are verified against live code.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries, all existing
- Architecture patterns: HIGH — all patterns observed in live code
- Pitfalls: HIGH — identified by reading actual current implementation and tracing the exact logic paths that need changing

**Research date:** 2026-03-04
**Valid until:** 2026-04-03 (30 days — stable codebase, no fast-moving dependencies)
