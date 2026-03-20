# Phase 35: Google Ads Setup Guide - Research

**Researched:** 2026-03-20
**Domain:** Google Ads account setup documentation (no code)
**Confidence:** HIGH

## Summary

Phase 35 is a pure documentation phase. The deliverable is a single step-by-step setup guide that walks a first-time Google Ads user through creating an account, setting up the campaign, and verifying conversion tracking. All campaign data already exists in four Phase 34 output files (keywords.md, ad-copy.md, extensions.md, campaign-structure.md). The guide's job is to provide the console-level "click here, paste this" instructions that bridge those docs to a live Google Ads campaign.

The project also has a prior Google Ads doc (`docs/google_ads_nettup_leads_search.md`) from an earlier campaign iteration. That doc used different pricing (2 500 kr one-time vs current 399 kr/mnd subscription) and a different bidding strategy. The new guide supersedes it entirely but can reference its lessons learned (e.g., geographic targeting was expanded from Oslo to all of Norway due to low search volume).

**Primary recommendation:** Create a single `setup-guide.md` in the Phase 35 directory that follows the Google Ads console flow from account creation through first-week monitoring. Reference Phase 34 docs by filename rather than duplicating content.

## Standard Stack

Not applicable -- this phase produces only a markdown documentation file. No libraries, no code, no dependencies.

## Architecture Patterns

### Document Structure

The guide should follow the actual Google Ads console flow (the order you encounter screens when creating a campaign):

```
setup-guide.md
├── Prerequisites (what you need before starting)
├── Step 1: Account Creation (ads.google.com)
├── Step 2: Conversion Action Setup (Goals > Conversions)
├── Step 3: Campaign Creation (campaign settings)
├── Step 4: Ad Group & Keywords (import from keywords.md)
├── Step 5: Ad Creation (RSA from ad-copy.md)
├── Step 6: Extensions/Assets (from extensions.md)
├── Step 7: Budget & Bidding (from campaign-structure.md)
├── Step 8: Review & Launch
├── Step 9: Post-Launch Verification Checklist
├── Step 10: First-Week Monitoring
└── Appendix: Bidding Phase Transitions
```

### Cross-Reference Pattern

Phase 34 docs contain the WHAT (keywords, copy, extensions, structure). The setup guide provides the HOW (which buttons to click, which fields to fill). Use this pattern:

```markdown
### Legg inn sokord

Importer sokordene fra [keywords.md](../34-google-ads-campaign-docs/keywords.md):

1. Ga til annonsegruppen "Nettside for Bedrift"
2. Klikk "Sokord" i venstremenyen
3. Klikk "+ Sokord"
4. Legg inn primaere sokord med eksakt match: [nettside for bedrift], [nettside abonnement]
5. Legg inn sekundaere sokord med frasematch: "nettside pris", "billig nettside"
```

### Anti-Patterns to Avoid
- **Duplicating Phase 34 content:** Don't copy keyword lists or ad copy into the guide. Reference the source files.
- **Mixing strategy with setup:** campaign-structure.md already covers WHY decisions. The guide covers HOW to implement them.
- **Generic Google Ads tutorial:** This is specific to the Nettup Nettside Abonnement campaign. Every instruction should reference the actual values (100 NOK/dag, 25 NOK default bid, etc.).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| N/A | N/A | N/A | Documentation-only phase |

## Common Pitfalls

### Pitfall 1: Conversion Action Mismatch
**What goes wrong:** The Google Ads conversion action doesn't match the gtag event on /takk page
**Why it happens:** The conversion ID/label in Google Ads must exactly match `send_to: 'AW-17409050017/EvwaCNm05eFbEKGLpO1A'` from takk.astro
**How to avoid:** Include the exact conversion ID in the guide and verify with Google Tag Assistant
**Warning signs:** Conversions show as 0 despite form submissions

### Pitfall 2: Consent Mode Not Verified
**What goes wrong:** Google Ads shows "No recent conversions" because Consent Mode blocks all tracking
**Why it happens:** Consent Mode v2 defaults to denied -- behavioral modeling only recovers ~70% and takes time
**How to avoid:** Guide should include a verification step using Google Tag Assistant to confirm consent mode is working
**Warning signs:** Very low conversion count relative to form submissions

### Pitfall 3: Search Partners and Display Network Enabled
**What goes wrong:** Budget gets spent on low-quality Display Network placements
**Why it happens:** Google enables these by default when creating a campaign
**How to avoid:** Explicit step: "Fjern hake for Display-nettverk og sokepartnere" -- this is already in campaign-structure.md but easy to miss in the console
**Warning signs:** High impressions but very low CTR

### Pitfall 4: Missing Negative Keywords at Launch
**What goes wrong:** Budget wasted on irrelevant searches in the first 48 hours
**Why it happens:** Negative keywords are sometimes added as an afterthought
**How to avoid:** Include negative keyword import as a required pre-launch step, not a post-launch optimization

### Pitfall 5: Wrong Location Targeting Option
**What goes wrong:** Ads show to people "interested in" Norway, not just people physically in Norway
**Why it happens:** Google defaults to "Presence or interest" instead of "Presence"
**How to avoid:** Explicit step to change to "Kun personer som befinner seg i omradet" -- lesson learned from the prior campaign docs

## Code Examples

No code in this phase. The key technical reference is the conversion tracking snippet already live on the /takk page:

```javascript
// From src/pages/nettside-for-bedrift/takk.astro
window.gtag('event', 'conversion', {
  send_to: 'AW-17409050017/EvwaCNm05eFbEKGLpO1A',
});
```

The Google Ads conversion action must use:
- **Conversion ID:** AW-17409050017
- **Conversion label:** EvwaCNm05eFbEKGLpO1A
- **Conversion source:** Website (gtag)
- **Conversion page:** /nettside-for-bedrift/takk

## Existing Assets to Reference

Phase 34 produced four docs that the setup guide must reference:

| File | Contains | Guide Uses It For |
|------|----------|-------------------|
| `keywords.md` | 14 keywords + 16 negatives with match types | Step 4: keyword import |
| `ad-copy.md` | 15 headlines, 4 descriptions, 5 RSA variants, pinning strategy | Step 5: ad creation |
| `extensions.md` | 4 sitelinks, 7 callouts, 1 structured snippet with char counts | Step 6: extensions setup |
| `campaign-structure.md` | Settings, bidding phases, budget, launch checklist, optimization schedule | Steps 3, 7, 8, 10 |

The prior campaign doc (`docs/google_ads_nettup_leads_search.md`) documents lessons learned:
- Geographic targeting expanded from Oslo to all of Norway (insufficient volume)
- Location option set to "Presence only" (not "Presence or interest")
- AI Max, Display Network, Search Partners deliberately excluded

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Ads "Smart" campaign wizard | Expert mode campaign creation | Ongoing | Smart campaigns offer less control; guide should use Expert mode |
| "Ad extensions" naming | "Assets" naming in Google Ads UI | 2022-2023 | Guide should use "Assets" terminology as that's what the console shows |
| Manual conversion setup only | Google Tag / Tag Manager integration | Ongoing | Since gtag is already inline on the /takk page, no Tag Manager needed |

## Open Questions

1. **Google Ads account status**
   - What we know: A previous campaign existed (docs/google_ads_nettup_leads_search.md shows a live campaign)
   - What's unclear: Whether the existing account will be reused or a new one created
   - Recommendation: Guide should cover both paths (new account + existing account with new campaign)

2. **Billing setup**
   - What we know: Google Ads requires payment method before campaigns can run
   - What's unclear: Whether this is already configured
   - Recommendation: Include billing setup as a prerequisite check, not a full walkthrough

## Content Language

All guide content must be in Norwegian (bokmal), consistent with the project's language rule and all Phase 34 docs. The guide is an internal operations document but follows the same language convention.

## Sources

### Primary (HIGH confidence)
- Phase 34 output files (keywords.md, ad-copy.md, extensions.md, campaign-structure.md) -- direct source material
- `src/pages/nettside-for-bedrift/takk.astro` -- conversion tracking implementation
- `docs/google_ads_nettup_leads_search.md` -- prior campaign lessons learned

### Secondary (MEDIUM confidence)
- Google Ads console flow knowledge -- based on standard Google Ads interface patterns

## Metadata

**Confidence breakdown:**
- Document structure: HIGH -- follows established Google Ads console flow
- Content references: HIGH -- all source docs exist and are verified
- Console instructions: MEDIUM -- Google Ads UI may have changed; instructions should focus on concepts + field names rather than exact button positions

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable -- documentation referencing existing assets)
