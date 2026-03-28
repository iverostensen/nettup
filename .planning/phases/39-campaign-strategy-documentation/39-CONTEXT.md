# Phase 39: Campaign Strategy & Documentation - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Pure documentation phase — produce all Facebook campaign assets so ads can be launched directly from Ads Manager without additional research:

- **CAMP-01:** Facebook ad copy (4+ variants, all funnel stages, Norwegian)
- **CAMP-02:** Faceless video creative plan (5 formats with production specs, scripts, tools)
- **CAMP-03:** Carousel ad plan (2 variants: case study walk-through + DIY vs professional)
- **CAMP-04:** Audience targeting document (3 layers: cold/warm/hot)
- **CAMP-05:** Lead form specification (fields, pre-fill, thank-you screen)
- **CAMP-06:** A/B testing plan (test matrix, kill criteria, scaling rules)
- **CAMP-07:** Weekly content production cadence (under 2 hrs/week)

No code changes in this phase. All output is markdown documents.

</domain>

<decisions>
## Implementation Decisions

### Ad Copy Tone & Hooks
- **D-01:** Tone is **peer-to-peer direct** — founder talking to founder. Honest, confident, no corporate fluff. Matches the brand voice.
- **D-02:** Primary hook for awareness stage: **price anchor hook** — "Andre byråer tar 15 000–50 000 kr. Vi gjør det for 399 kr/mnd." Maximum stopping power, directly frames the offer. Consistent with Phase 38 LP anchor.
- **D-03:** No em dashes in ad copy — use period or comma instead (per project rule).
- **D-04:** All copy in Norwegian (bokmål). No English phrases.
- **D-05:** Cover all 3 funnel stages: awareness (price hook), consideration (case study proof), conversion (direct offer + urgency).

### Video Creative Priority
- **D-06:** **Week 1 priority format: bold text-on-screen** — line-by-line text reveal on dark background (#020617), price anchoring hook, cuts to site scroll. Produced in CapCut, 10-15 min production time. Lowest barrier, highest cold traffic stopping power.
- **D-07:** Faceless formats only — no face on camera. Voiceover is OK.
- **D-08:** Weekly cadence as defined in success criteria: 2x scroll-throughs (10 min each), 1x bold text hook (10 min), 1x before/after or process clip (30-60 min). Total under 2 hrs/week.
- **D-09:** All 5 formats get full production specs (tools, duration, script/overlay text, aspect ratio). Not just a list — actionable enough to produce without additional research.

### Carousel Ad Plan
- **D-10:** 2 carousel variants as defined: (a) case study walk-through — 5 cards using iGive and Blom Company; (b) DIY vs professional comparison — Wix pricing vs Nettup pricing, included features, CTA.

### Audience Targeting
- **D-11:** 3 layers as defined:
  - Cold: Business Page admins, "Admins of new active businesses 6-24 months", job titles (daglig leder/gründer/eier), age 25-55
  - Warm: video viewers 50%+, site visitors, page engagers
  - Hot: priskalkulator/kontakt/tjenester visitors, form abandoners, lead form openers who didn't submit

### Lead Form Specification
- **D-12:** **Keep friction minimal** — 4 fields only: navn, e-post, telefon, dropdown (Nettside / Nettbutikk / Landingsside / Vet ikke ennå). Qualify in the follow-up call. Lower CPL, higher volume.
- **D-13:** Pre-fill name, e-post, telefon from Facebook profile (standard Meta Lead Form feature).
- **D-14:** Thank-you screen: **"Takk! Vi tar kontakt innen 5 minutter i arbeidstiden."** Sets clear expectation, creates urgency, matches /takk page copy.

### A/B Testing Plan
- **D-15:** **Minimal 2×2 scope** — 2 hooks (price anchor vs speed) × 2 audiences (Business Page admins vs broad SMB). Simple to manage, clear winner signal within 2 weeks.
- **D-16:** Starting budget assumption for kill criteria math: **5 000 kr/mnd**.
- **D-17:** Kill criteria as defined in success criteria: CPL > 950 NOK, frequency > 3, CTR < 0.5%.
- **D-18:** Scaling rule: increase budget 20% every 3 days on winners.

### Claude's Discretion
- Exact Norwegian wording for individual ad copy variants (tone/hook locked, exact phrasing flexible)
- Order of cards within carousel variants
- Specific script lines for each video format (production spec is locked, exact text is Claude's call)
- Estimated audience sizes for targeting layers (use reasonable estimates based on Norwegian SMB market)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §CAMP-01 through CAMP-07 — Exact acceptance criteria for all campaign documents

### Project Context
- `.planning/PROJECT.md` — Full project context including existing ad research, CPC data, competitor analysis, conversion funnel
- `.planning/ROADMAP.md` §Phase 39 — Detailed success criteria (SC-1 through SC-7) with specific format specs, scripts, and targeting parameters

### Prior Phase Context
- `.planning/phases/38-landing-page-ad-consistency/38-CONTEXT.md` — Price anchor wording and LP decisions (relevant for ad-to-page consistency in copy)

### No external specs
All campaign content is defined in ROADMAP.md success criteria and REQUIREMENTS.md. No external docs required.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/config/subscriptionOffer.ts` — Single source of truth for the 399 kr/mnd offer; ad copy must quote exact figures from here
- `src/pages/prosjekter/` — iGive and Blom Company case studies; carousel card content should use real metrics from these pages
- `src/pages/nettside-for-bedrift/index.astro` — Landing page the ads point to; copy must match what users see post-click

### Established Patterns
- Price anchor: "Andre byråer tar 15 000–50 000 kr" (established in Phase 38, PricingSummary.astro)
- Response time: "innen 5 minutter i arbeidstiden" (established in /takk page)
- Brand accent: #020617 bg + #06b6d4 cyan (used in all visuals including Phase 38 OG image)

### Integration Points
- All campaign documents output to `.planning/phases/39-campaign-strategy-documentation/` as markdown files
- No code files created or modified in this phase

</code_context>
