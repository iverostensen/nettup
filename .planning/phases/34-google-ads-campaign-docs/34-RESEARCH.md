# Phase 34: Google Ads Campaign Docs - Research

**Researched:** 2026-03-20
**Domain:** Google Ads campaign documentation for Norwegian subscription website service
**Confidence:** HIGH

## Summary

This phase produces documentation files (not code) that define a ready-to-launch Google Ads campaign for Nettup's single subscription offer: 0 kr oppstart + 399 kr/mnd for a 5-page business website. The campaign targets Norwegian small businesses searching for affordable website solutions and drives traffic exclusively to `/nettside-for-bedrift`.

All ad copy must align with the landing page content already built in Phases 31-33. The landing page hero uses "Profesjonell nettside for din bedrift" as H1, anchors against "Andre tar 15 000+ kr", and features trust badges "30 dagers garanti" and "Ingen bindingstid". Ad copy must echo these exact phrases for message match (improves Quality Score).

**Primary recommendation:** Create 4 markdown files in the phase directory -- keyword research, ad copy variants, ad extensions, and campaign structure -- each self-contained and ready to copy-paste into Google Ads Editor.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ADS-01 | Keyword research targeting one service: "nettside for bedrift", "billig nettside", "nettside pris", "nettside abonnement" with volumes and bid suggestions | Norwegian keyword universe documented below; volumes require Google Keyword Planner (cannot be fetched programmatically) but reasonable estimates and keyword groupings are provided |
| ADS-02 | 3-5 ad copy variants focused on 399 kr/mnd offer (headlines + descriptions) | RSA character limits researched: 30 char headlines, 90 char descriptions; landing page copy extracted for message match |
| ADS-03 | Ad extensions: sitelinks to /tjenester subpages as upsell paths, callouts | Sitelink (25 char link text, 35 char descriptions), callout (25 char each) limits confirmed |
| ADS-04 | Single campaign structure with one ad group, budget recommendations, negative keywords | Campaign structure best practices and negative keyword strategy documented |
</phase_requirements>

## Standard Stack

This phase produces no code. The "stack" is Google Ads platform specifications.

### Google Ads Responsive Search Ads (RSA) Specs

| Element | Limit | Notes |
|---------|-------|-------|
| Headlines | 30 characters each | Min 3, max 15; Google recommends using all 15 |
| Descriptions | 90 characters each | Min 2, max 4; use all 4 for optimization |
| Path fields | 15 characters each | 2 path fields (display URL: nettup.no/path1/path2) |
| Sitelink text | 25 characters | Link text shown in extension |
| Sitelink description | 35 characters each | 2 description lines per sitelink |
| Callout text | 25 characters | Short USP phrases |
| Structured snippet values | 25 characters each | Up to 10 values per header |

### Output Files

| File | Purpose | Format |
|------|---------|--------|
| `keywords.md` | Keyword research with groupings and negatives | Markdown table |
| `ad-copy.md` | 3-5 RSA variants with headlines and descriptions | Markdown with character counts |
| `extensions.md` | Sitelinks, callouts, structured snippets | Markdown tables |
| `campaign-structure.md` | Campaign/ad group setup, budget, bidding | Markdown document |

## Architecture Patterns

### Document Structure
```
.planning/phases/34-google-ads-campaign-docs/
├── 34-RESEARCH.md          # This file
├── 34-01-PLAN.md           # Execution plan
├── keywords.md             # ADS-01
├── ad-copy.md              # ADS-02
├── extensions.md           # ADS-03
└── campaign-structure.md   # ADS-04
```

### Pattern 1: Message Match Between Ad and Landing Page

**What:** Ad headlines and descriptions must use the same language as the landing page to maintain Quality Score and reduce bounce rate.

**Landing page key phrases to echo in ads:**
- H1: "Profesjonell nettside for din bedrift"
- Price: "0 kr oppstart" + "kun 399 kr/mnd"
- Anchor: "Andre tar 15 000+ kr"
- Trust: "30 dagers garanti", "Ingen bindingstid"
- Speed: "Klar pa 1-3 uker"
- CTA: "Kom i gang"
- Features: "Inntil 5 sider", "SSL og hosting inkludert", "Support og vedlikehold"

**Why:** Google rewards message match with higher Quality Scores (lower CPC). Users who see the same phrase in the ad and on the page convert at higher rates.

### Pattern 2: Single Campaign, Single Ad Group

**What:** One campaign with one primary ad group for the subscription offer. No separate ad groups for different services.

**Why:** The requirements explicitly state "single campaign structure" and "one ad group for the subscription offer". The landing page sells exactly one thing. Splitting into multiple ad groups would dilute a small budget and create unnecessary complexity.

**Structure:**
- Campaign: "Nettside Abonnement"
  - Ad Group: "Nettside for Bedrift" (primary, all budget)
  - Negative keywords at campaign level

### Pattern 3: Norwegian Keyword Universe

**What:** Core keyword categories for a subscription website service in Norway.

**Primary intent keywords (high commercial intent):**
- "nettside for bedrift" -- exact match to landing page H1
- "nettside bedrift pris" -- price-seeking intent
- "nettside abonnement" -- subscription-specific
- "billig nettside" -- price-sensitive
- "profesjonell nettside" -- quality-seeking

**Secondary intent keywords (broader reach):**
- "nettside pris" -- general price research
- "lage nettside bedrift" -- action-oriented
- "hjemmeside bedrift" -- alternate term ("hjemmeside" = "homepage/website")
- "firmanettside" -- compound form
- "nettside smabedrift" -- small business specific

**Long-tail keywords (lower volume, higher intent):**
- "rimelig nettside for bedrift"
- "nettside uten oppstartskostnad"
- "nettside manedspris"
- "enkel nettside bedrift"

**Note:** Exact search volumes and CPC data must come from Google Keyword Planner (requires active Google Ads account). The keyword file should include placeholder columns for volume/CPC to be filled in from Keyword Planner data, or use reasonable estimates based on Norwegian market size.

### Anti-Patterns to Avoid

- **Multiple ad groups for one offer:** Splits budget and adds complexity with no benefit
- **English keywords:** Norwegian users search in Norwegian; English terms waste budget
- **Generic headlines:** "Best Website Service" says nothing; use specific pricing and USPs
- **Mismatched landing page:** Never send ad traffic to the homepage or /tjenester -- always to /nettside-for-bedrift

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Search volume data | Guessing volumes | Google Keyword Planner | Only authoritative source for Norwegian search volumes |
| Ad copy testing | Manual A/B testing | RSA auto-optimization | Google's ML tests headline/description combos automatically |
| Bid management | Manual CPC bids | Smart Bidding (Maximize Conversions) | Better for small budgets with limited data |
| Conversion tracking | Custom tracking | gtag already implemented (Phase 31-32) | Consent Mode v2 + /takk page already in place |

## Common Pitfalls

### Pitfall 1: Writing Ad Copy That Exceeds Character Limits
**What goes wrong:** Headlines over 30 chars, descriptions over 90 chars get rejected.
**Why it happens:** Norwegian compound words are long ("oppstartskostnad" = 16 chars).
**How to avoid:** Count every character including spaces. Include char count next to each headline/description in the doc.
**Warning signs:** Any headline approaching 28+ chars needs scrutiny.

### Pitfall 2: Missing Negative Keywords for "Free" and "DIY" Traffic
**What goes wrong:** Budget wasted on people searching "gratis nettside", "lage nettside selv", "wordpress nettside".
**Why it happens:** Broad match keywords trigger on related searches.
**How to avoid:** Comprehensive negative keyword list from day one.
**Critical negatives for this campaign:**
- gratis, free, gratuit
- wordpress, wix, squarespace, webflow
- selv, diy, tutorial, kurs, guide, lare
- jobb, stilling, ansatt (job seekers)
- mal, template (template seekers)

### Pitfall 3: Not Pinning Critical Headlines
**What goes wrong:** Google's RSA rotation might never show the price in position 1.
**Why it happens:** RSA randomly combines headlines; the 399 kr/mnd offer might appear in headline 3 (rarely shown).
**How to avoid:** Pin one headline with price to Position 1 and one with brand/service to Position 2. Leave remaining headlines unpinned for testing.

### Pitfall 4: Budget Too Thin for Learning Phase
**What goes wrong:** Campaign never exits "Learning" status, performance data is unreliable.
**Why it happens:** Google needs ~50 conversions in 30 days for Smart Bidding to optimize.
**How to avoid:** Start with Manual CPC or Maximize Clicks for the first 2-4 weeks, then switch to Maximize Conversions once conversion data exists. Document this phased approach.

### Pitfall 5: Ad Copy in English
**What goes wrong:** Mismatch with Norwegian landing page, low Quality Score.
**Why it happens:** Habit or template copying.
**How to avoid:** All ad copy must be Norwegian (bokmal). This is a project rule.

## Code Examples

Not applicable -- this phase produces documentation, not code. However, the conversion tracking infrastructure is already in place:

### Existing Conversion Setup (from Phases 31-32)
- Consent Mode v2 in `BaseLayout.astro` -- gtag loads with denied defaults
- Thank-you page at `/nettside-for-bedrift/takk` fires `gtag('event', 'conversion', ...)`
- UTM parameters captured from URL and stored in form submission
- Plausible event fires on /takk page load

The campaign docs should reference the conversion action name used in the gtag setup so the Google Ads account can be configured to track the same conversion.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Expanded Text Ads (ETAs) | Responsive Search Ads (RSAs) | June 2022 | Must use RSA format; ETAs no longer creatable |
| Manual extensions | "Assets" (rebranded) | 2023 | Extensions now called "assets" in Google Ads UI |
| Manual CPC default | Smart Bidding default | 2024-2025 | Google pushes automated bidding; Manual CPC still available |
| Account-level negatives unavailable | Account-level negative keyword lists | 2025 | Can now set negatives at account level (useful for "gratis", "jobb") |

## Open Questions

1. **Exact search volumes and CPC for Norwegian keywords**
   - What we know: The keyword categories and terms are correct for the Norwegian market
   - What's unclear: Exact monthly search volumes and suggested bids require Google Keyword Planner access
   - Recommendation: Document keywords with structure for volumes to be filled in. Include reasonable budget range (50-150 kr/day) based on Norwegian SMB market

2. **Conversion action name in gtag**
   - What we know: /takk page fires a conversion event
   - What's unclear: The exact conversion action label/ID configured in Google Ads
   - Recommendation: Document as "configure in Google Ads > Conversions to match the gtag event on /takk"

3. **Geographic targeting scope**
   - What we know: Nettup serves Norwegian businesses
   - What's unclear: Whether to target all of Norway or specific regions
   - Recommendation: Start with all of Norway; city pages (v1.5) could enable geo-targeted campaigns later

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual review (documentation phase) |
| Config file | N/A |
| Quick run command | `ls .planning/phases/34-google-ads-campaign-docs/*.md \| wc -l` (expect 5+) |
| Full suite command | Manual: verify all 4 deliverable files exist with complete content |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ADS-01 | Keyword research file with Norwegian terms, volumes, bids | manual-only | `test -f .planning/phases/34-google-ads-campaign-docs/keywords.md` | Wave 0 |
| ADS-02 | 3-5 ad copy variants with headlines + descriptions | manual-only | `test -f .planning/phases/34-google-ads-campaign-docs/ad-copy.md` | Wave 0 |
| ADS-03 | Ad extensions (sitelinks, callouts) | manual-only | `test -f .planning/phases/34-google-ads-campaign-docs/extensions.md` | Wave 0 |
| ADS-04 | Campaign structure, budget, negative keywords | manual-only | `test -f .planning/phases/34-google-ads-campaign-docs/campaign-structure.md` | Wave 0 |

**Manual-only justification:** This phase produces marketing documentation, not executable code. Validation is content review against the success criteria.

### Sampling Rate
- **Per task commit:** Verify file exists and has expected sections
- **Per wave merge:** Review all 4 files against requirements
- **Phase gate:** All 4 deliverable files present with complete content

### Wave 0 Gaps
None -- no test infrastructure needed for documentation deliverables.

## Sources

### Primary (HIGH confidence)
- [Google Ads Help - RSA specs](https://support.google.com/google-ads/answer/7684791?hl=en) - headline/description character limits
- [Google Ads Help - Sitelink assets](https://support.google.com/google-ads/answer/2375416?hl=en) - sitelink character limits
- [Google Ads Help - Negative keywords](https://support.google.com/google-ads/answer/2453972?hl=en) - negative keyword types and behavior
- Landing page source code (`src/pages/nettside-for-bedrift/`) - actual copy for message match
- `src/config/subscriptionOffer.ts` - single source of truth for offer details

### Secondary (MEDIUM confidence)
- [LeadsBridge - Google Ads campaign structure 2026](https://leadsbridge.com/blog/google-ads-campaign-structure/) - campaign structure best practices
- [WordStream - Google Ads account structure 2026](https://www.wordstream.com/blog/google-ads-account-structure) - ad group organization
- [Innovena - Google Ads Norge 2025](https://www.innovena.no/google-ads/) - Norwegian market context

### Tertiary (LOW confidence)
- Norwegian keyword search volumes - estimates only; require Keyword Planner for actual data
- Budget recommendations (50-150 kr/day) - based on general Norwegian SMB market; actual CPC depends on competition

## Metadata

**Confidence breakdown:**
- Ad specs (character limits, RSA format): HIGH - verified with official Google Ads documentation
- Landing page message match: HIGH - extracted from actual source code
- Norwegian keyword universe: MEDIUM - keywords are correct terms but volumes are estimates
- Campaign structure: HIGH - well-established best practices, simple single-service setup
- Budget recommendations: LOW - depends on actual CPC data from Keyword Planner

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (Google Ads specs change infrequently; keyword data should be refreshed at launch)
