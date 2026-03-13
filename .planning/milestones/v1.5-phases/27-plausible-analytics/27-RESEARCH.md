# Phase 27: Plausible Analytics - Research

**Researched:** 2026-03-08
**Domain:** Analytics integration (Plausible cloud, Astro 5, React islands)
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Cloud: plausible.io (not self-hosted)
- Script tag in `BaseLayout.astro` only — all pages use it
- Domain hardcoded as `nettup.no` (no env var needed)
- Event taxonomy uses Title Case: `Contact Form Submit`, `Wizard Estimate Shown`, etc.
- Custom props attached per event (not just event name alone)
- No sitewide CTA click tracking — conversion events only
- Events to track:
  | Event | Props |
  |-------|-------|
  | `Contact Form Submit` | _(none)_ |
  | `B2B Form Submit` | _(none)_ |
  | `Wizard Estimate Shown` | `estimate_range`, `goal` |
  | `Wizard CTA Clicked` | `estimate_range`, `goal` |
  | `Chatbot Opened` | _(none)_ |
  | `Chatbot Suggestion Clicked` | `suggestion` |
  | `City CTA Clicked` | `city` |
- City lead = primary CTA click, with `city` prop
- `nettside-for-bedrift` fires `B2B Form Submit` separately from `Contact Form Submit`
- Track chatbot open and suggestion chip click
- Keep Vercel Analytics untouched (Web Vitals)

### Claude's Discretion
- Exact script tag attributes (defer, data-domain, etc.)
- `analytics.ts` wrapper API design (function signatures, TypeScript types)
- How to pass `city` prop from `[location].astro` to the tracking call
- Whether to use `plausible()` global or import a package

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

## Summary

Plausible Analytics uses a tiny cookieless script injected via a `<script>` tag. The tracking API is a single global function `window.plausible(eventName, options)`. No npm package is needed — the script loads from `plausible.io/js/script.js` and attaches the global. TypeScript requires a one-time `declare global` in `src/env.d.ts` (Astro's existing global type file). The analytics wrapper (`src/lib/analytics.ts`) should be a thin facade that guards against undefined (for SSR/build-time) and calls the global directly. Custom events must be registered in the Plausible dashboard as Goals before they appear in reports.

The integration has five distinct callsites: `ContactForm.tsx` (success branch), `ResultStep.tsx` (on render + CTA click), `ChatWidget.tsx` (open toggle + suggestion chip click), the B2B landing page form (already reuses `ContactForm` — needs an event name discriminator or a prop), and `[location].astro` (CTA button). The city page CTA is an Astro-rendered `<Button>` with no existing onClick — it needs either an inline `<script>` block using `is:inline` or conversion to a React island. The simpler path is a small Astro `<script>` block on `[location].astro` that reads `data-city` from the button DOM.

`LandingPageLayout.astro` is a standalone layout (not extending BaseLayout) and already imports Vercel Analytics directly. It uses `ContactForm` as a React island. Adding the Plausible script tag to `LandingPageLayout.astro` as well ensures the B2B page is covered; the `B2B Form Submit` event fires from the same `ContactForm` component but must be differentiated by context.

**Primary recommendation:** Use `window.plausible` global (no npm package), wrap it in `src/lib/analytics.ts`, declare the type in `src/env.d.ts`, and add the script tag to both `BaseLayout.astro` and `LandingPageLayout.astro`.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Plausible cloud script | latest (CDN) | Pageview + event tracking | Cookieless, GDPR, no consent banner required |

### Supporting
| Tool | Purpose | When to Use |
|------|---------|-------------|
| `window.plausible` global | Fire custom events from JS/TS | All React islands and inline scripts |
| Plausible dashboard Goals | Register events before they appear in reports | One-time setup per event name |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `window.plausible` global | `plausible-tracker` npm package | npm package adds ~1kB, adds abstraction — not worth it for 7 events |
| Direct `window.plausible()` calls | CSS class `plausible-event-name=...` | CSS class approach only works for click events on HTML elements; can't pass dynamic props like `estimate_range` |

**Installation:**
```bash
# No npm install — script loaded from CDN
# One-time: register each event name as a Goal in plausible.io dashboard
```

---

## Architecture Patterns

### Recommended Project Structure
```
src/
├── env.d.ts                          # Add window.plausible declare global here
├── lib/
│   └── analytics.ts                  # New: thin wrapper, guards SSR, exports typed helpers
├── layouts/
│   ├── BaseLayout.astro              # Add <script> tag in <!-- Analytics --> block
│   └── LandingPageLayout.astro       # Add same <script> tag (standalone layout)
├── components/islands/
│   ├── ChatWidget.tsx                # Add Chatbot Opened + Chatbot Suggestion Clicked
│   └── wizard/steps/ResultStep.tsx  # Add Wizard Estimate Shown + Wizard CTA Clicked
├── pages/
│   ├── kontakt/_sections/ContactForm.tsx   # Add Contact Form Submit on success
│   └── steder/[location].astro             # Add City CTA Clicked via inline <script>
```

### Pattern 1: Script Tag in Layout Head

**What:** Standard Plausible CDN script tag with `defer` and `data-domain`.
**When to use:** Once, in BaseLayout and LandingPageLayout.

```html
<!-- Source: plausible.io official docs / community-verified pattern -->
<script
  defer
  data-domain="nettup.no"
  src="https://plausible.io/js/script.js"
></script>
```

`defer` ensures the script does not block page render. `data-domain` must match exactly the domain registered in the Plausible dashboard.

### Pattern 2: TypeScript Declaration

**What:** Declare `window.plausible` so TypeScript does not error when calling it from `.tsx` or `.ts` files.
**Where:** `src/env.d.ts` — Astro's existing ambient type file.

```typescript
// src/env.d.ts — append to existing file
interface PlausibleOptions {
  props?: Record<string, string | number | boolean>;
  callback?: () => void;
  revenue?: { amount: number; currency: string };
  interactive?: boolean;
}

declare global {
  interface Window {
    plausible?: (eventName: string, options?: PlausibleOptions) => void;
  }
}
```

Mark `plausible` as optional (`?`) because it is undefined during SSR/build-time and may be blocked by adblockers.

### Pattern 3: The analytics.ts Wrapper

**What:** A thin module that guards the `window.plausible` call and provides typed helper functions.
**Why:** Centralises the optional-chaining guard, keeps callsites clean, and makes the event contract explicit in one place.

```typescript
// src/lib/analytics.ts
// Source: derived from Plausible docs + project pattern

function track(eventName: string, props?: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  window.plausible?.(eventName, props ? { props } : undefined);
}

// --- Typed event helpers ---

export function trackContactFormSubmit(): void {
  track('Contact Form Submit');
}

export function trackB2BFormSubmit(): void {
  track('B2B Form Submit');
}

export function trackWizardEstimateShown(estimateRange: string, goal: string): void {
  track('Wizard Estimate Shown', { estimate_range: estimateRange, goal });
}

export function trackWizardCtaClicked(estimateRange: string, goal: string): void {
  track('Wizard CTA Clicked', { estimate_range: estimateRange, goal });
}

export function trackChatbotOpened(): void {
  track('Chatbot Opened');
}

export function trackChatbotSuggestionClicked(suggestion: string): void {
  track('Chatbot Suggestion Clicked', { suggestion });
}

export function trackCityCtaClicked(city: string): void {
  track('City CTA Clicked', { city });
}
```

### Pattern 4: Calling from React Islands

**What:** Import from `analytics.ts` and call on the relevant user action.
**When to use:** `ChatWidget.tsx`, `ResultStep.tsx`, `ContactForm.tsx`.

```typescript
// Example: ContactForm.tsx — in the success branch of handleSubmit
import { trackContactFormSubmit } from '@/lib/analytics';

if (response.ok) {
  setStatus('success');
  trackContactFormSubmit();
  // existing gtag call below...
}
```

```typescript
// Example: ResultStep.tsx — fire on mount + CTA click
import { trackWizardEstimateShown, trackWizardCtaClicked } from '@/lib/analytics';
import { useEffect } from 'react';

// In component body:
useEffect(() => {
  const range = `${estimate.discounted.min}-${estimate.discounted.max}`;
  trackWizardEstimateShown(range, state.serviceType ?? '');
}, []); // fires once when result is shown

// On CTA link click (wrap <a> in onClick):
onClick={() => trackWizardCtaClicked(range, state.serviceType ?? '')}
```

### Pattern 5: City CTA via Astro Inline Script

**What:** The city page CTA is a pure Astro `<Button>` (server-rendered anchor). No React island. Use `data-city` attribute + `is:inline` script to attach click listener.
**Why:** Avoids converting the whole CTA section to a React island just to fire one event.

```astro
<!-- [location].astro — replace the existing Button with an anchor + data-city -->
<a
  href="/kontakt"
  data-city={city.slug}
  id="city-cta"
  class="inline-flex items-center ..."
>Ta kontakt</a>

<script is:inline>
  document.getElementById('city-cta')?.addEventListener('click', function () {
    const city = this.getAttribute('data-city');
    if (city && window.plausible) {
      window.plausible('City CTA Clicked', { props: { city } });
    }
  });
</script>
```

Note: Astro's `<script>` (without `is:inline`) is bundled and tree-shaken — for simple DOM attachment that reads `data-*` attributes set at build time, `is:inline` is the right choice. The inline script also avoids needing to import analytics.ts into the Astro component.

### Pattern 6: B2B Form Discrimination

**What:** `nettside-for-bedrift/_sections/FormSection.astro` uses `<ContactForm client:load />` — the same React component as `/kontakt`. We need `B2B Form Submit` on this page, not `Contact Form Submit`.
**Options:**
1. Add a `context` prop to `ContactForm` (`'contact' | 'b2b'`) — cleanest, explicit.
2. Read `window.location.pathname` inside `ContactForm` and branch on `/nettside-for-bedrift`.

Option 1 is preferred. Add `context?: 'contact' | 'b2b'` prop to `ContactForm`. Default is `'contact'`. Call the matching tracker based on `context`.

```tsx
// ContactForm.tsx interface addition
interface Props {
  context?: 'contact' | 'b2b';
}

// In handleSubmit success branch:
if (props.context === 'b2b') {
  trackB2BFormSubmit();
} else {
  trackContactFormSubmit();
}
```

```astro
<!-- FormSection.astro -->
<ContactForm client:load context="b2b" />
```

### Anti-Patterns to Avoid
- **Calling `window.plausible()` directly in Astro frontmatter:** Frontmatter runs on the server — `window` is undefined. Always guard with `typeof window !== 'undefined'` or put calls in `<script>` blocks / React event handlers.
- **Using the CSS class method (`plausible-event-name=...`) for events with dynamic props:** The CSS class method cannot attach runtime values like `estimate_range`. Use the JS API.
- **Registering goals after implementation:** Events fire silently even without a Goal registered, but they will NOT appear in the Plausible dashboard until registered. Register all 7 Goals in the dashboard as a setup step before or immediately after deploy.
- **Converting `ContactForm` to accept the B2B context via pathname detection:** Fragile — breaks if URL changes. Use the explicit prop.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pageview tracking | Custom fetch to analytics endpoint | Plausible script (auto) | Script handles SPAs, referrer, UTM parsing automatically |
| Event queue before script loads | Complex queue implementation | `window.plausible?.()` optional chain | Events that fire before script loads are simply dropped — acceptable given `defer` and the low likelihood of sub-100ms CTA clicks |
| GDPR compliance layer | Consent banner + conditional loading | Plausible cookieless script | No cookies = no consent required under GDPR/ePrivacy |

---

## Common Pitfalls

### Pitfall 1: Plausible Script Blocked by ClientRouter
**What goes wrong:** Astro's `<ClientRouter>` (View Transitions) replaces the `<head>` on navigation. A script tag in `<head>` may not re-execute on soft navigations — but Plausible's script listens to `history.pushState` natively and handles this correctly for pageviews. Custom events tied to React island mount (`useEffect`) fire fresh on each island hydration regardless. No special handling needed.
**How to avoid:** No action needed. Plausible handles SPA routing. Do not add `transition:persist` to the Plausible script tag — the script should reload on full navigations.

### Pitfall 2: Events Fire During SSR/Build
**What goes wrong:** `typeof window === 'undefined'` is true during Astro's static build. Calling `window.plausible()` without a guard crashes the build.
**How to avoid:** The `analytics.ts` wrapper's first line `if (typeof window === 'undefined') return;` prevents this. Never call `window.plausible` in Astro frontmatter (`---` blocks).

### Pitfall 3: Goal Not Registered in Dashboard
**What goes wrong:** Events fire, appear in the raw event log, but don't show in the Plausible dashboard — because custom events require a Goal to be set up manually.
**How to avoid:** Register all 7 event names as Goals in plausible.io → Settings → Goals → Add Goal → Custom event. This is a one-time dashboard action, not code. Do it before or immediately after first deploy.

### Pitfall 4: estimate_range Format Inconsistency
**What goes wrong:** `Wizard Estimate Shown` is called with `estimate_range: "15000-25000"` in one place and `"15k-25k"` elsewhere. Plausible treats these as different property values — dashboard segments split.
**How to avoid:** Decide on format once in `analytics.ts`. The CONTEXT.md shows `15k-25k` format. Build the format in the wrapper:
```typescript
// Convert raw numbers to the agreed format
function buildEstimateRange(min: number, max: number): string {
  return `${Math.round(min / 1000)}k-${Math.round(max / 1000)}k`;
}
```

### Pitfall 5: LandingPageLayout Missing Script
**What goes wrong:** `/nettside-for-bedrift` uses `LandingPageLayout` (a standalone layout, not extending `BaseLayout`). If Plausible script is only added to `BaseLayout`, the B2B page has no pageview tracking.
**How to avoid:** Add the identical script tag to `LandingPageLayout.astro` as well. Both layouts are confirmed standalone (different import chains).

### Pitfall 6: Chatbot "Open" Event Fires on Toggle (Close)
**What goes wrong:** `handleBubbleClick` in `ChatWidget.tsx` toggles `isOpen`. If tracking is added to `handleBubbleClick` it fires on both open and close.
**How to avoid:** Track the open event only when `isOpen` transitions from `false` to `true`:
```typescript
const handleBubbleClick = useCallback(() => {
  setShowTeaser(false);
  setHasUnread(false);
  setIsOpen((prev) => {
    if (!prev) trackChatbotOpened(); // Only on open
    return !prev;
  });
}, []);
```

---

## Code Examples

### Script Tag (BaseLayout.astro and LandingPageLayout.astro)
```html
<!-- Source: plausible.io official install docs, community-verified -->
<!-- Analytics -->
<Analytics />
<script
  defer
  data-domain="nettup.no"
  src="https://plausible.io/js/script.js"
></script>
<ClientRouter />
```

### env.d.ts Addition
```typescript
// Source: Plausible docs + Astro TypeScript guide
interface PlausibleOptions {
  props?: Record<string, string | number | boolean>;
  callback?: () => void;
  interactive?: boolean;
}

declare global {
  interface Window {
    plausible?: (eventName: string, options?: PlausibleOptions) => void;
  }
}
```

### Wizard estimate_range helper
```typescript
// src/lib/analytics.ts
function buildEstimateRange(min: number, max: number): string {
  return `${Math.round(min / 1000)}k-${Math.round(max / 1000)}k`;
}

export function trackWizardEstimateShown(min: number, max: number, goal: string): void {
  track('Wizard Estimate Shown', {
    estimate_range: buildEstimateRange(min, max),
    goal,
  });
}

export function trackWizardCtaClicked(min: number, max: number, goal: string): void {
  track('Wizard CTA Clicked', {
    estimate_range: buildEstimateRange(min, max),
    goal,
  });
}
```

This takes raw `number` values from `estimate.discounted.min/max` — no string conversion at the callsite.

---

## Integration Point Details

### Confirmed file paths and hook locations

| File | Callsite | Event | Notes |
|------|----------|-------|-------|
| `BaseLayout.astro:192` | `<!-- Analytics -->` block | Script tag | Before `<ClientRouter />` |
| `LandingPageLayout.astro:~13` | After `<Analytics />` import area | Script tag | Standalone layout — needs own tag |
| `ContactForm.tsx:handleSubmit` | `if (response.ok)` branch (~line 143) | `Contact Form Submit` | After existing gtag call |
| `FormSection.astro:49` | `<ContactForm client:load />` | Pass `context="b2b"` prop | ContactForm needs `context` prop added |
| `ResultStep.tsx:component body` | `useEffect([], [])` | `Wizard Estimate Shown` | Fires on mount (result shown) |
| `ResultStep.tsx:CTA anchor` | `onClick` on "Kontakt oss" anchor (~line 157) | `Wizard CTA Clicked` | Anchor needs `onClick` handler |
| `ChatWidget.tsx:handleBubbleClick` | Toggle logic (~line 324) | `Chatbot Opened` | Only on open, not close |
| `ChatWidget.tsx:suggestion onClick` | Suggestion chip render area | `Chatbot Suggestion Clicked` | Need to locate suggestion chip render |
| `[location].astro:CTA section` | `<Button href="/kontakt">` (~line 125) | `City CTA Clicked` | Inline script or convert Button to anchor with data-city |

### ChatWidget suggestion chips — locate render
The suggestions are in `setSuggestions` state. Render is somewhere after line 340. The onClick for each chip calls `sendMessage(suggestion)` — wrap that call with `trackChatbotSuggestionClicked(suggestion)` before or after `sendMessage`.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Google Analytics (cookie-based) | Plausible (cookieless) | No consent banner required |
| Separate script per page | Single script in layout head | Centralised, no duplication |
| Manual event batching | `window.plausible?.()` optional call | Silently drops if blocked — acceptable |

---

## Open Questions

1. **ContactForm `context` prop backward compatibility**
   - What we know: `ContactForm` is used in `kontakt/index.astro` and `FormSection.astro`. Both pass no props today.
   - What's unclear: Are there other callsites?
   - Recommendation: Grep for `ContactForm` before implementing. Default `context` to `'contact'` so existing callsites need no change.

2. **ChatWidget suggestion chip onClick location**
   - What we know: Suggestions exist as state array. The send action calls `sendMessage(suggestion)`.
   - What's unclear: Exact line number — the file wasn't read past line 340.
   - Recommendation: Read `ChatWidget.tsx` from line 340 onward during planning to find the chip render and confirm the exact hook location.

3. **Plausible dashboard Goal registration**
   - What we know: Goals must be added manually in the dashboard before events appear in reports.
   - What's unclear: Whether the dashboard has already been set up or if it's a fresh account.
   - Recommendation: Include a manual step in the plan: "Register 7 Goals in plausible.io dashboard."

---

## Sources

### Primary (HIGH confidence)
- [Plausible custom events docs](https://plausible.io/docs/custom-event-goals) — function signature, props API, Goal registration
- [Plausible custom props docs](https://plausible.io/docs/custom-props/for-custom-events) — props limits, PII warning
- Direct code inspection: `BaseLayout.astro`, `LandingPageLayout.astro`, `ContactForm.tsx`, `ResultStep.tsx`, `ChatWidget.tsx`, `[location].astro`

### Secondary (MEDIUM confidence)
- [Astro + Plausible guide (santychuy.com)](https://santychuy.com/blog/plausible-astro-simplified-web-analytics-guide) — confirmed script tag format `defer data-domain src`
- [Plausible + Astro + Vercel proxy (noahflk.com)](https://noahflk.com/blog/plausible-astro) — confirmed `data-api` proxy variant (not used here)
- Web search corroboration: `defer data-domain="nettup.no" src="https://plausible.io/js/script.js"` format confirmed by multiple independent sources

### Tertiary (LOW confidence)
- TypeScript `PlausibleOptions` interface inferred from docs examples — not an official type export. Treat as best-effort typing.

---

## Metadata

**Confidence breakdown:**
- Script tag format: HIGH — multiple sources, official docs confirm `defer data-domain src`
- `plausible()` function API: HIGH — official docs show `plausible(name, { props, callback, interactive })`
- TypeScript declaration: MEDIUM — inferred from docs, not official `@types/plausible`
- LandingPageLayout isolation: HIGH — direct code read confirms standalone layout
- Chatbot suggestion chip location: MEDIUM — component structure confirmed but exact line not verified past 340
- City CTA inline script pattern: HIGH — standard Astro pattern with `is:inline`

**Research date:** 2026-03-08
**Valid until:** 2026-09-08 (Plausible API is stable; Astro 5 API stable)
