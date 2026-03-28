# Phase 41: Lead Magnet & Mid-Funnel Asset - Research

**Researched:** 2026-03-28
**Domain:** Astro page + React island (form, gated content, analytics events)
**Confidence:** HIGH

## Summary

This phase adds a single new page (`/sjekkliste`) with a React island handling a 2-field form, CSS blur gate, Framer Motion reveal animation, and analytics event firing. Every technology is already in the project: Astro 5, React 19, Framer Motion 12, Formspree, Plausible wrapper, and Meta Pixel consent gating. No new dependencies are needed.

The implementation follows established patterns: Astro page wrapper at `src/pages/sjekkliste/index.astro`, React island in `src/components/islands/`, Formspree POST with honeypot spam protection, and analytics events following the exact patterns in `src/lib/analytics.ts` and `src/pages/nettside-for-bedrift/takk.astro`.

**Primary recommendation:** Build this as a single React island (`SjekklisteIsland.tsx`) handling all interactive state (form, blur, reveal, CTA), wrapped in a minimal Astro page. Follow existing HeroMicroForm for form patterns and takk.astro for consent-gated fbq events.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Teaser + gate pattern -- items 1-3 visible, items 4-10 blurred with lock icon overlay
- **D-02:** CSS blur filter on items 4-10 with lock icon overlay. Framer Motion animates the reveal
- **D-03:** Inline reveal after Formspree POST success (no redirect). Events fire client-side after confirmation
- **D-04:** No confirmation email -- Formspree captures to inbox only
- **D-05:** Full checklist unlocks + CTA card below linking to `/kontakt?tjeneste=nettside`
- **D-06:** Fire `trackLeadMagnetDownload()` (Plausible) + consent-gated `fbq('track', 'Lead', { content_name: 'Sjekkliste 2026' })`
- **D-07:** Consent gate pattern: `if (localStorage.getItem('nettup_ads_consent') === 'granted' && window.fbq)` before fbq
- **D-08:** Footer link only -- add `/sjekkliste` under a "Ressurser" column or similar
- **D-09:** React island (`SjekklisteIsland.tsx`) in `src/components/islands/` + Astro page at `src/pages/sjekkliste/index.astro`
- **D-10:** Dedicated Formspree endpoint (separate from `xnjnzybj` contact form)

### Claude's Discretion
- Exact 10 checklist items (content defined in UI-SPEC -- items are finalized)
- Animation specifics for the reveal (fadeIn, stagger, duration -- UI-SPEC defines: 400ms blur removal, 80ms stagger, 8px translateY)
- Exact footer column placement for the /sjekkliste link
- CSS blur intensity for locked items (UI-SPEC defines: `blur(8px)`)
- Page hero headline and subheading copy (UI-SPEC defines all copy)

### Deferred Ideas (OUT OF SCOPE)
- Chatbot suggestion chip for /sjekkliste
- City page mid-page CTA block
- Blog article CTA at bottom of relevant posts
- Confirmation email via Formspree
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LEAD-01 | /sjekkliste page exists with "10 ting nettsiden din trenger i 2026" checklist gated behind a 2-field form (navn, e-post), submitted via Formspree to a separate form endpoint | Existing Formspree pattern in HeroMicroForm.tsx; Astro page pattern in priskalkulator/index.astro; UI-SPEC defines full component tree and copy |
| LEAD-02 | Lead magnet download triggers Plausible event (LeadMagnetDownload) and Meta Pixel Lead event for conversion tracking | Plausible wrapper pattern in analytics.ts; consent-gated fbq pattern in takk.astro line 83-85 |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.16.6 | Page wrapper, routing, BaseLayout | Project framework |
| React | 19.2.3 | Interactive island (form + blur + reveal) | Project UI layer |
| Framer Motion | 12.23.26 | Staggered reveal animation | Project animation library |
| Tailwind CSS | 4.x | All styling | Project CSS framework |
| Formspree | N/A (API) | Form submission backend | Project form handler |

### Supporting (already in codebase)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `src/lib/analytics.ts` | N/A | Plausible event wrapper | trackLeadMagnetDownload() |
| `src/lib/utm.ts` | N/A | UTM param capture | Attach UTM data to Formspree submission |

**Installation:** None required. Zero new dependencies.

## Architecture Patterns

### File Structure

```
src/
├── pages/
│   └── sjekkliste/
│       └── index.astro              # Astro page wrapper (BaseLayout, Section, meta)
├── components/
│   └── islands/
│       └── SjekklisteIsland.tsx      # React island: form + gate + reveal + CTA
├── lib/
│   └── analytics.ts                 # Add trackLeadMagnetDownload() export
└── components/
    └── layout/
        └── Footer.astro             # Add /sjekkliste link
```

### Pattern 1: Astro Page Wrapping a React Island

**What:** Thin Astro page provides SEO (title, description, OG), layout, and static structure. React island handles all interactive state.
**When to use:** Whenever a page needs client-side state management (form, animation triggers).
**Existing example:** `src/pages/priskalkulator/index.astro` wraps `SmartPrisKalkulator` with `client:visible`.

```astro
<!-- Pattern from priskalkulator/index.astro -->
<BaseLayout title="..." description="...">
  <main>
    <Section class="pt-32 md:pt-40">
      <!-- Static heading in Astro -->
    </Section>
    <Section>
      <SjekklisteIsland client:visible />
    </Section>
  </main>
</BaseLayout>
```

### Pattern 2: Form State Machine

**What:** `idle | submitting | error | unlocked` state drives all UI rendering.
**Existing example:** HeroMicroForm.tsx uses `idle | submitting | success | error`. The sjekkliste variant replaces `success` (redirect) with `unlocked` (inline reveal).

```typescript
// Adapted from HeroMicroForm.tsx
type FormStatus = 'idle' | 'submitting' | 'error' | 'unlocked';
const [status, setStatus] = useState<FormStatus>('idle');
```

### Pattern 3: Formspree POST with Honeypot

**What:** POST to `https://formspree.io/f/{ID}` with JSON body, hidden `_gotcha` field for spam.
**Existing example:** HeroMicroForm.tsx lines 50-64.

```typescript
// From HeroMicroForm.tsx -- same pattern, different endpoint
const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ navn, email, _gotcha: honeypotValue, ...getUtmParams() }),
});
```

### Pattern 4: Consent-Gated Meta Pixel Event

**What:** Check localStorage consent + window.fbq existence before firing fbq.
**Existing example:** takk.astro line 83-85, priskalkulator/index.astro line 28-30.

```typescript
// Fire inside React after successful Formspree response
if (localStorage.getItem('nettup_ads_consent') === 'granted' && window.fbq) {
  window.fbq('track', 'Lead', { content_name: 'Sjekkliste 2026' });
}
```

### Pattern 5: Plausible Wrapper Extension

**What:** Add new named export to analytics.ts following the existing pattern.
**Existing example:** All 7 existing track functions in analytics.ts.

```typescript
export function trackLeadMagnetDownload(): void {
  track('Lead Magnet Download');
}
```

### Anti-Patterns to Avoid
- **Separate Formspree ID reuse:** D-10 explicitly requires a new Formspree form ID. Do NOT use `xnjnzybj` (that is the contact form).
- **Redirect on success:** D-03 says inline reveal, no redirect. Do NOT follow HeroMicroForm's `window.location.href` pattern for the success case.
- **Firing fbq without consent gate:** Every fbq call in the codebase is gated. Breaking this pattern violates GDPR.
- **Forgetting reduced motion:** UI-SPEC requires `prefers-reduced-motion: reduce` to skip all animations and reveal items instantly.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form backend | Custom API route | Formspree | Already in use, handles email delivery, spam filtering |
| Email validation | Custom regex | Same pattern as HeroMicroForm (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) | Proven, consistent |
| Analytics abstraction | Direct window.plausible calls | analytics.ts wrapper | Guards SSR + adblocker cases |
| Spinner SVG | npm package | Copy from HeroMicroForm lines 123-138 | Exact same SVG already in codebase |

## Common Pitfalls

### Pitfall 1: Formspree ID Not Configured
**What goes wrong:** Using the existing contact form ID (`xnjnzybj`) mixes lead magnet submissions with contact inquiries.
**Why it happens:** Copy-paste from HeroMicroForm without updating the ID.
**How to avoid:** Define a new constant (e.g., `SJEKKLISTE_FORMSPREE_ID`) and document that the user must create a new Formspree form.
**Warning signs:** Lead magnet submissions appearing in contact form inbox.

### Pitfall 2: Blur on Items Leaking to Screen Readers
**What goes wrong:** Screen readers read blurred content, defeating the gate purpose.
**Why it happens:** CSS blur is visual-only; DOM content is still accessible.
**How to avoid:** UI-SPEC specifies `aria-hidden="true"` on blurred items. Must implement this.
**Warning signs:** Accessibility audit finding gated content readable.

### Pitfall 3: Animation Plays Before Blur Removal
**What goes wrong:** Stagger animation starts while blur is still active, creating visual glitch.
**Why it happens:** Starting both animations simultaneously.
**How to avoid:** Sequence: blur removal (400ms) completes, then staggered item reveal begins. Use Framer Motion's `AnimatePresence` or `when: "beforeChildren"` on parent.
**Warning signs:** Items appearing to "jump" during reveal.

### Pitfall 4: Missing UTM Pass-Through
**What goes wrong:** Lead magnet form submissions lose UTM attribution data.
**Why it happens:** Not calling `captureUtmParams()` + `getUtmParams()` from utm.ts.
**How to avoid:** Follow HeroMicroForm pattern: `useEffect(() => captureUtmParams(), [])` and spread `...getUtmParams()` into form body.
**Warning signs:** Formspree submissions missing UTM fields.

### Pitfall 5: fbq Not Declared on Window
**What goes wrong:** TypeScript error when accessing `window.fbq`.
**Why it happens:** fbq is loaded by Meta Pixel script, not typed in the project.
**How to avoid:** Use type assertion or declare global. The existing takk.astro uses `is:inline` script (not TypeScript). In React, cast: `(window as any).fbq` or add a global declaration. Check how existing islands handle this -- the consent gate pattern already checks `window.fbq` existence.
**Warning signs:** Build error on `window.fbq`.

## Code Examples

### Complete Form Submit Handler Pattern

```typescript
// Adapted from HeroMicroForm.tsx for sjekkliste use case
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  setStatus('submitting');

  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        navn,
        email,
        kilde: 'sjekkliste',
        ...getUtmParams(),
      }),
    });

    if (response.ok) {
      setStatus('unlocked');
      // Fire analytics events
      trackLeadMagnetDownload();
      if (localStorage.getItem('nettup_ads_consent') === 'granted' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', { content_name: 'Sjekkliste 2026' });
      }
    } else {
      setStatus('error');
    }
  } catch {
    setStatus('error');
  }
};
```

### Framer Motion Staggered Reveal

```typescript
// Reveal animation for items 4-10 after form success
// UI-SPEC: 400ms blur removal, 80ms stagger, 8px translateY, 400ms per item
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.4 }, // delay until blur removal completes
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
```

### Footer Link Addition

```astro
<!-- Add a "Ressurser" column to the footer grid, or append to existing "Sider" nav -->
<!-- Current footer has 4 columns: Logo, Sider, Kontakt, Omrader -->
<!-- Option: Add to "Sider" nav links array, or create a 5th column -->
<a href="/sjekkliste" class="link-underline flex min-h-11 w-fit items-center text-sm text-text-muted transition-colors duration-200 hover:text-brand">
  Gratis sjekkliste
</a>
```

## State of the Art

No technology changes relevant to this phase. All libraries are current versions already installed.

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framer Motion v11 `animate` prop | Framer Motion v12 same API | 2025 | No breaking changes for this use case |

## Open Questions

1. **Formspree Form ID**
   - What we know: A new Formspree form must be created (separate from `xnjnzybj`)
   - What's unclear: The actual form ID to use
   - Recommendation: Plan should note this as a pre-requisite. The implementer creates the form in Formspree dashboard and uses the returned ID as a constant. Alternatively, use a placeholder and configure later.

2. **Footer Column Layout**
   - What we know: Footer currently has a 4-column grid (`grid-cols-2 md:grid-cols-2 lg:grid-cols-4`): Logo, Sider, Kontakt, Omrader. D-08 says add a "Ressurser" column or similar.
   - What's unclear: Whether to add a 5th column (changes grid) or append to existing "Sider" column.
   - Recommendation: Append "Gratis sjekkliste" to the existing "Sider" `navLinks` array. Adding a 5th column for a single link is over-engineered. Claude's discretion area.

## Project Constraints (from CLAUDE.md)

- All text content in Norwegian (bokmal)
- Animations allowed (Tier 3 project) but respect `prefers-reduced-motion`
- Mobile-first design (375px base, enhance up)
- LCP < 2s despite animations
- TypeScript strict mode, no `any` (use proper type declarations for window.fbq)
- `pt-32 md:pt-40` on first section to clear fixed navbar
- Conventional commits: `feat(41):` scope
- No attribution in commits

## Sources

### Primary (HIGH confidence)
- `src/components/islands/HeroMicroForm.tsx` -- Formspree form pattern, validation, honeypot, state machine
- `src/lib/analytics.ts` -- Plausible wrapper pattern for new trackLeadMagnetDownload()
- `src/pages/nettside-for-bedrift/takk.astro` -- Consent-gated fbq('track', 'Lead') pattern
- `src/pages/priskalkulator/index.astro` -- Astro page wrapping React island pattern
- `src/components/layout/Footer.astro` -- Footer structure for link addition
- `src/components/ui/Section.astro` -- Section component props and padding presets
- `41-UI-SPEC.md` -- Complete visual/interaction contract

### Secondary (MEDIUM confidence)
- `41-CONTEXT.md` -- All implementation decisions and deferred items

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all dependencies already installed and verified via npm ls
- Architecture: HIGH -- every pattern has an existing codebase example to follow
- Pitfalls: HIGH -- based on direct code review of existing form and analytics patterns

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable -- no moving parts)
