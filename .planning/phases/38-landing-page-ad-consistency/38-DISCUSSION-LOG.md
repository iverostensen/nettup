# Phase 38: Landing Page Ad Consistency - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28

---

## Area 1: Competitor Price Anchor (LP-01)

**Q: Where should the competitor price anchor appear in PricingSummary.astro?**

Options presented:
- Above the card — a small callout line before the card frames the offer before the user sees it
- Inside the card — strikethrough style adjacent to the 399 kr price
- Below the card — "Du sparer X kr"-style savings callout after the card

**Selected:** Above the card

---

**Q: What should the anchor text say, and how prominent should it be?**

Options presented:
- Single muted line — factual, understated text-text-muted
- Badge/pill style — contrast color (amber/warning), more eye-catching
- You decide — Claude picks wording and styling

**Selected:** Single muted line

---

## Area 2: Consent Banner Equal Prominence (LP-02)

**Q: What does 'equal prominence' mean for the consent banner buttons?**

Options presented:
- Both solid, same size, different colors — Avslå = bg-slate-600, Godta = bg-brand (same weight, different hues)
- Both outlined/ghost — both get outlined style, Godta loses brand fill
- Both bg-brand (same color) — identical buttons, may confuse

**Selected:** Both solid, same size, different colors

---

## Area 3: OG Image Generation (LP-03)

**Q: How should the custom OG image be created?**

Options presented:
- Design manually, export as static file — Figma/Canva, commit to /public/images/
- Satori Node script (one-time) — generates from JSX, adds @vercel/satori dependency
- Astro API route (dynamic) — /api/og-nettside.png, build-pipeline approach (explicitly excluded by phase spec)

**Selected:** Design manually, export as static file

---

**Q: What should the OG image contain beyond '0 kr oppstart | 399 kr/mnd'?**

Options presented:
- Price + Nettup logo + dark background — brand-consistent, clean, recognizable in Facebook feed
- Price + tagline — adds one-liner for cold audiences
- You decide — Claude specifies the design

**Selected:** Price + Nettup logo + dark background
