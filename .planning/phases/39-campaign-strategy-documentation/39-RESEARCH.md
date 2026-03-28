# Phase 39: Campaign Strategy & Documentation - Research

**Researched:** 2026-03-28
**Domain:** Facebook/Instagram ad campaign documentation for Norwegian web agency
**Confidence:** HIGH

## Summary

Phase 39 is a pure documentation phase producing 7 markdown deliverables that together form a complete Facebook campaign launch kit. No code changes, no external dependencies. All decisions are locked in CONTEXT.md with highly specific success criteria in the ROADMAP -- the research task is to verify Facebook Ads platform specs, identify best practices for the Norwegian SMB market, and surface pitfalls that would make the documentation inaccurate or unusable.

The existing codebase provides all the data needed: `subscriptionOffer.ts` (0 kr oppstart, 399 kr/mnd), `projects.ts` (iGive 96/100, Blom Company 99/100 Lighthouse scores), `services.ts` (pricing tiers with 40% launch discount). The landing page at `/nettside-for-bedrift` is the primary ad destination with price anchoring already in place from Phase 38.

**Primary recommendation:** Structure deliverables as 4 markdown files: (1) ad-copy.md covering CAMP-01 + CAMP-03 (carousel text is ad copy), (2) video-creative-plan.md covering CAMP-02 + CAMP-07 (production cadence is part of creative plan), (3) audience-targeting.md covering CAMP-03 (original numbering) + CAMP-04 + CAMP-05 (lead form), (4) testing-plan.md covering CAMP-06. This avoids 7 tiny files while keeping each document focused.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Tone is peer-to-peer direct. Founder talking to founder. Honest, confident, no corporate fluff.
- **D-02:** Primary hook: price anchor -- "Andre byraer tar 15 000-50 000 kr. Vi gjor det for 399 kr/mnd."
- **D-03:** No em dashes in ad copy. Use period or comma instead.
- **D-04:** All copy in Norwegian (bokmal). No English phrases.
- **D-05:** Cover all 3 funnel stages: awareness (price hook), consideration (case study proof), conversion (direct offer + urgency).
- **D-06:** Week 1 priority: bold text-on-screen format. CapCut, 10-15 min production.
- **D-07:** Faceless formats only. No face on camera. Voiceover OK.
- **D-08:** Weekly cadence: 2x scroll-throughs (10 min each), 1x bold text hook (10 min), 1x before/after or process clip (30-60 min). Under 2 hrs/week.
- **D-09:** All 5 video formats get full production specs (tools, duration, script/overlay text, aspect ratio).
- **D-10:** 2 carousel variants: case study walk-through (5 cards) + DIY vs professional comparison (4 cards).
- **D-11:** 3 audience layers: cold (Business Page admins, new business admins, job titles, age 25-55), warm (video viewers 50%+, site visitors, page engagers), hot (priskalkulator/kontakt/tjenester visitors, form abandoners, lead form openers who didn't submit).
- **D-12:** Lead form: 4 fields only -- navn, e-post, telefon, dropdown (Nettside/Nettbutikk/Landingsside/Vet ikke enna).
- **D-13:** Pre-fill name, e-post, telefon from Facebook profile.
- **D-14:** Thank-you screen: "Takk! Vi tar kontakt innen 5 minutter i arbeidstiden."
- **D-15:** Test matrix: 2x2 -- 2 hooks (price anchor vs speed) x 2 audiences (Business Page admins vs broad SMB).
- **D-16:** Starting budget: 5 000 kr/mnd.
- **D-17:** Kill criteria: CPL > 950 NOK, frequency > 3, CTR < 0.5%.
- **D-18:** Scaling rule: increase budget 20% every 3 days on winners.

### Claude's Discretion
- Exact Norwegian wording for individual ad copy variants (tone/hook locked, phrasing flexible)
- Order of cards within carousel variants
- Specific script lines for each video format (production spec locked, exact text flexible)
- Estimated audience sizes for targeting layers

### Deferred Ideas (OUT OF SCOPE)
- No code changes in this phase
- No TikTok or Google Ads campaign docs (Phase 40 handles multi-channel)
- No lead magnet content (Phase 41)
- No Meta Conversions API (v2)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CAMP-01 | Facebook ad copy document with 4+ variants (primary text, headline, description, CTA) in Norwegian covering awareness/consideration/conversion | Ad copy structure maps to Meta's standard ad text fields; 3 funnel stages x 2 variants minimum; pricing data from subscriptionOffer.ts and services.ts |
| CAMP-02 | Faceless video creative plan with 5 formats, production specs, scripts/overlays, tools | Meta video specs verified (9:16 for Reels/Stories, 4:5 for Feed); tool list from ROADMAP (CapCut, URLtoVideo, OBS, Screen Studio, ElevenLabs) |
| CAMP-03 | Carousel ad plan with 2 variants (case study walk-through + DIY vs professional) | Meta carousel supports 2-10 cards; case study data from projects.ts (iGive 96/100, Blom 99/100) |
| CAMP-04 | Audience targeting document with 3 layers (cold/warm/hot) | Meta targeting options verified; "Admins of new active businesses" is a real Meta behavioral targeting option |
| CAMP-05 | Lead form specification with exact fields, pre-fill config, thank-you screen | Meta Instant Forms support pre-fill for name/email/phone, custom dropdown via "Custom Questions", and thank-you screen configuration |
| CAMP-06 | A/B testing plan with test matrix, kill criteria, scaling rules | Industry benchmarks verified; frequency > 3 is standard fatigue threshold; 20% budget scaling every 3 days is conservative best practice |
| CAMP-07 | Weekly content production cadence under 2 hrs/week | Cadence already fully specified in D-08; document as part of video creative plan |
</phase_requirements>

## Architecture Patterns

### Recommended Document Structure

```
.planning/phases/39-campaign-strategy-documentation/
  39-CONTEXT.md          (exists)
  39-RESEARCH.md         (this file)
  39-01-PLAN.md          (ad copy + carousel copy)
  39-02-PLAN.md          (video creative plan + production cadence)
  39-03-PLAN.md          (audience targeting + lead form spec)
  39-04-PLAN.md          (A/B testing plan)
  deliverables/
    ad-copy.md           (CAMP-01 + CAMP-03 output)
    video-creative-plan.md (CAMP-02 + CAMP-07 output)
    audience-targeting.md  (CAMP-04 + CAMP-05 output)
    testing-plan.md       (CAMP-06 output)
```

### Pattern: Single Source of Truth Cross-References

Ad copy MUST reference exact figures from config files, not approximations:

| Data Point | Source | Value |
|------------|--------|-------|
| Monthly price | `subscriptionOffer.ts` | 399 kr/mnd |
| Setup price | `subscriptionOffer.ts` | 0 kr oppstart |
| iGive Lighthouse | `projects.ts` | 96/100 Performance |
| Blom Lighthouse | `projects.ts` | 99/100 Performance |
| Launch discount | `services.ts` | 40% (LAUNCH_DISCOUNT) |
| Nettside price | `services.ts` | fra 4 800 kr (launch) / fra 8 000 kr (full) |
| Landing page URL | Phase 38 | /nettside-for-bedrift |
| Price anchor text | Phase 38 PricingSummary | "Andre byraer tar 15 000-50 000 kr" |
| Response time | /takk page | "innen 5 minutter i arbeidstiden" |

### Pattern: Funnel Stage Mapping

Each deliverable should tag content by funnel stage so it maps to campaign objectives in Ads Manager:

| Stage | Campaign Objective | Ad Format | Copy Style |
|-------|-------------------|-----------|------------|
| Awareness | Reach / Video Views | Video (bold text, scroll-through) | Price hook, pattern interrupt |
| Consideration | Traffic / Engagement | Carousel, video (before/after) | Case study proof, feature comparison |
| Conversion | Lead Generation | Lead form, direct CTA | Direct offer, urgency, clear next step |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Video aspect ratios | Guessing dimensions | Meta's published specs (see below) | Wrong ratio = cropped creative or rejected ad |
| Audience size estimates | Making up numbers | Meta Ads Manager Audience tool | Only way to get real estimates for Norwegian market |
| Lead form field types | Assuming text inputs | Meta Instant Form builder docs | Pre-fill only works with supported field types |
| Budget math | Arbitrary CPL targets | Industry benchmarks (see below) | Kill criteria must be grounded in real data |

## Meta Platform Specs (Verified)

### Video Ad Specifications

| Placement | Aspect Ratio | Resolution | Max Duration | File Format |
|-----------|-------------|------------|-------------|-------------|
| Feed | 4:5 (recommended) or 1:1 | 1080x1350 or 1080x1080 | 241 min (but 15-60s recommended) | MP4, MOV |
| Reels | 9:16 | 1080x1920 | 90 seconds | MP4, MOV |
| Stories | 9:16 | 1080x1920 | 20 seconds per card | MP4, MOV |

**Key insight:** 9:16 vertical video shows 23% higher completion rates and 35% better CTR in Reels placement. For maximum reach across placements, produce in 9:16 and let Meta auto-crop for Feed (or produce both 9:16 and 4:5 versions).

**Recommended for this campaign:** Produce all video content in 9:16 (1080x1920) as the primary format. This covers Reels, Stories, and works well in Feed. The 10-15 second bold text format and 15-30 second scroll-throughs are ideal lengths for Reels.

### Carousel Ad Specifications

| Property | Spec |
|----------|------|
| Card count | 2-10 cards |
| Image size | 1080x1080 (1:1 required) |
| Primary text | 125 characters recommended (up to 2200) |
| Headline per card | 40 characters recommended |
| Description per card | 25 characters recommended |
| Link per card | Required (can be same URL for all) |

### Meta Instant Form (Lead Form) Capabilities

| Feature | Detail |
|---------|--------|
| Pre-fill fields | Name, email, phone number (from Facebook profile) |
| Custom questions | Up to 15; supports short answer, multiple choice, conditional logic |
| Dropdown field | Created via "Custom Questions" > "Multiple Choice" type |
| Thank-you screen | Custom headline + description + CTA button (link to website) |
| Context card | Optional intro screen before questions (recommended for conversion quality) |
| Privacy policy link | Required -- link to /personvern |

**Dropdown implementation for "Hva trenger du?":** Use Custom Questions > Multiple Choice with options: Nettside, Nettbutikk, Landingsside, Vet ikke enna. This renders as a dropdown/radio selection in the form.

### Facebook Targeting Options (Verified)

| Targeting Type | Option | Availability |
|---------------|--------|-------------|
| Behavioral | "Admins of business Pages" | Available (under Business & Industry) |
| Behavioral | "Admins of new active businesses (6-24 months)" | Available (under Digital Activities > Small business owners) |
| Demographic | Job titles: daglig leder, grunder, eier | Available (under Work > Job Title) |
| Custom Audience | Website visitors (pixel-based) | Available (requires Meta Pixel -- installed in Phase 36) |
| Custom Audience | Video viewers (25%, 50%, 75%, 95%) | Available |
| Custom Audience | Lead form openers who didn't submit | Available |
| Custom Audience | Page engagers | Available |

## Common Pitfalls

### Pitfall 1: Ad Copy Too Long for Mobile
**What goes wrong:** Primary text over ~125 characters gets truncated on mobile Feed with a "See more" link. Most users never click it.
**Why it happens:** Writing for desktop view, not mobile-first.
**How to avoid:** Keep the hook in the first 125 characters. Put the price anchor and CTA above the fold. Extended details go below the truncation point as bonus context.
**Warning signs:** Primary text exceeds 3 lines on mobile preview.

### Pitfall 2: Landing Page Mismatch
**What goes wrong:** Ad promises one thing, landing page shows something different. Conversion rate tanks, Meta penalizes relevance score.
**Why it happens:** Ad copy written in isolation from the landing page.
**How to avoid:** Every ad variant must use exact pricing from `subscriptionOffer.ts` (0 kr / 399 kr/mnd) and the landing page's price anchor ("Andre byraer tar 15 000-50 000 kr"). Cross-reference `/nettside-for-bedrift` content.
**Warning signs:** Any number in ad copy that doesn't appear on the landing page.

### Pitfall 3: Carousel Card Order Matters
**What goes wrong:** First card gets 70%+ of views. If the hook is on card 3, most users never see it.
**Why it happens:** Treating carousel as a slideshow where all cards get equal attention.
**How to avoid:** Card 1 must be the strongest hook (price or social proof). Card 2 is the second strongest. Last card is always CTA.
**Warning signs:** Card 1 is "introduction" or "about us" content.

### Pitfall 4: Lead Form Quality vs Volume Tradeoff
**What goes wrong:** Pre-filled forms generate high volume but low-quality leads (people submit without reading).
**Why it happens:** Facebook pre-fills name/email/phone, so submission takes one tap.
**How to avoid:** The dropdown question ("Hva trenger du?") acts as a friction gate -- it requires a deliberate choice that can't be pre-filled. This is already in the locked spec (D-12). Consider adding a context card (intro screen) before the form to set expectations.
**Warning signs:** Lead-to-call conversion rate below 20%.

### Pitfall 5: Norwegian Language in Targeting
**What goes wrong:** Job title targeting for "daglig leder" misses people who listed their title in English ("CEO", "Managing Director").
**Why it happens:** Facebook job titles are user-entered text, not standardized.
**How to avoid:** Include both Norwegian AND English variants in job title targeting: daglig leder, CEO, grunder, founder, eier, owner. The targeting doc should list all variants.
**Warning signs:** Audience size seems too small for the Norwegian SMB market.

### Pitfall 6: Budget Too Thin for Testing
**What goes wrong:** 5 000 kr/mnd split across a 2x2 test matrix = 1 250 kr per variant. At ~8.50 NOK CPC, that's ~147 clicks per variant per month, or ~5 clicks/day. Statistical significance takes weeks.
**Why it happens:** Not doing the math before defining the test matrix.
**How to avoid:** Run tests sequentially, not simultaneously. Week 1-2: test hook A vs B on one audience. Week 3-4: winning hook on audience A vs B. This doubles the data per test.
**Warning signs:** Any single ad set getting fewer than 50 clicks before being evaluated.

## Data Points for Ad Copy

These exact figures should appear in the campaign documentation (sourced from codebase):

### Pricing
- Subscription: 0 kr oppstart + 399 kr/mnd (subscriptionOffer.ts)
- Includes: Inntil 5 sider, responsivt design, kontaktskjema, grunnleggende SEO, SSL og hosting, support og vedlikehold
- No binding period: "Ingen bindingstid"
- Competitor anchor: "Andre byraer tar 15 000-50 000 kr" (Phase 38)

### Case Studies
- **iGive:** B2B gavekortplattform, 96/100 PageSpeed, Astro + Tailwind + Vercel, salg.igive.no
- **Blom Company:** B2C nettbutikk, 99/100 PageSpeed, Next.js 15 + Shopify + Sanity, blomcompany.com
- Both have real testimonials with named people (Stein Eriksen/iGive, Patrick/Blom Company)

### Norwegian Market Context (from ROADMAP research)
- Facebook CPC in Norway: ~8.50 NOK (24% below global average)
- Few Norwegian web agencies self-advertise on Facebook (low competition)
- Summer (June-Aug) CPCs drop 35-65% (ideal launch window)

## Industry Benchmarks (for A/B Testing Plan)

| Metric | Global Average | Norwegian Context | Phase Kill Criteria |
|--------|---------------|-------------------|---------------------|
| CPC | $0.50-2.00 (~5-20 NOK) | ~8.50 NOK | N/A (monitor, not kill) |
| CTR | 0.9-1.5% (Lead Gen) | Similar or better (low competition) | < 0.5% = kill |
| CPL | $27.66 (~290 NOK) avg | Higher for B2B services, estimated 300-950 NOK | > 950 NOK = kill |
| Frequency | Optimal: 1-2 | Same | > 3 = kill |
| Lead form CVR | ~7.7% (instant forms) | Similar | Monitor |

**Budget math at 5 000 kr/mnd:**
- At 8.50 NOK CPC: ~588 clicks/month
- At 7.7% form CVR: ~45 leads/month
- At estimated 500 NOK CPL: ~10 leads/month
- Need 1 client/month to be profitable (given LTV of subscription model)

## Video Production Tool Reference

| Tool | Cost | Use Case | Relevance |
|------|------|----------|-----------|
| CapCut | Free | Bold text-on-screen, text reveals, basic editing | Primary tool for D-06 (week 1 priority) |
| URLtoVideo | Free | Screen-record websites as smooth scroll-throughs | Scroll-through format (format a) |
| OBS Studio | Free | Screen recording (VS Code timelapse, browser) | Coding timelapse format (format d) |
| Screen Studio | $89 one-time | Premium Mac screen recording with auto-zoom | High-quality scroll-throughs (upgrade from URLtoVideo) |
| ElevenLabs Starter | $5/mnd | Norwegian AI voiceover | Optional voiceover for any format |
| Mixkit | Free | Background music | Subtle background audio |

## Environment Availability

Step 2.6: SKIPPED (no external dependencies -- this is a documentation-only phase producing markdown files).

## Open Questions

1. **REQUIREMENTS.md only lists CAMP-01 through CAMP-05**
   - What we know: CAMP-06 and CAMP-07 are defined in the ROADMAP success criteria and CONTEXT.md but not in REQUIREMENTS.md
   - What's unclear: Whether REQUIREMENTS.md should be updated
   - Recommendation: Treat ROADMAP success criteria as authoritative for CAMP-06/07. The planner should not block on this discrepancy.

2. **Audience size estimates for Norwegian market**
   - What we know: Only Meta Ads Manager can provide real audience size estimates for Norwegian targeting
   - What's unclear: Exact reach for "Business Page admins" + "daglig leder/grunder/eier" + age 25-55 in Norway
   - Recommendation: Document reasonable estimates (Norway has ~300k SMBs, Facebook penetration ~75% of adults). Flag that real numbers should be pulled from Ads Manager before launch.

3. **Sequential vs parallel testing with 5 000 kr budget**
   - What we know: Budget is thin for a 2x2 simultaneous test (see Pitfall 6)
   - What's unclear: Whether user prefers sequential testing or accepts longer test duration
   - Recommendation: Document both options. Default to sequential (2 weeks per test, clearer signal). This is Claude's discretion on test plan specifics.

## Project Constraints (from CLAUDE.md)

- Norwegian (bokmal) content only
- No em dashes in any output
- No face on camera (faceless video formats only)
- No "Co-Authored-By" or attribution in commits
- Conventional commits: `docs(39):` scope
- TypeScript strict mode (not relevant for this phase -- no code)

## Sources

### Primary (HIGH confidence)
- `subscriptionOffer.ts` -- exact pricing (0 kr / 399 kr/mnd)
- `projects.ts` -- case study metrics (iGive 96/100, Blom 99/100)
- `services.ts` -- service pricing and launch discount (40%)
- CONTEXT.md -- all 18 locked decisions
- ROADMAP.md -- success criteria SC-1 through SC-7

### Secondary (MEDIUM confidence)
- [Hootsuite Facebook Ad Sizes 2025](https://blog.hootsuite.com/facebook-ad-sizes/) -- video and carousel specs
- [Meta Business Help Center: Custom Questions](https://www.facebook.com/business/help/774623835981457) -- lead form field types
- [Meta Business Help Center: Conditional Answers](https://www.facebook.com/business/help/154286325106161) -- dropdown implementation
- [LeadsBridge Meta Ads Best Practices 2026](https://leadsbridge.com/blog/meta-ads-best-practices/) -- lead form optimization
- [EEDigital Facebook Ads Benchmarks 2026](https://www.theedigital.com/blog/facebook-ads-benchmarks) -- CPL and CTR benchmarks
- [Admetrics: How to Scale Facebook Ads](https://www.admetrics.io/en/post/how-to-scale-facebook-ads-effectively) -- budget scaling rules
- [BestEver: Meta Video Ad Specs 2025](https://www.bestever.ai/post/meta-video-ad-specs) -- video format specs

### Tertiary (LOW confidence)
- Norwegian SMB count (~300k) and Facebook penetration (~75%) -- general knowledge estimates, should be verified against SSB data before publishing in targeting doc

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no libraries needed, pure documentation phase
- Architecture: HIGH -- document structure is straightforward, all specs verified against Meta platform
- Pitfalls: HIGH -- grounded in verified platform constraints and budget math

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (Meta specs change infrequently; benchmarks shift slowly)
