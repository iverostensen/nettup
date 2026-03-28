# Research Summary: Nettup v1.7 Multi-Channel Ad Campaign

**Domain:** Meta Pixel integration, ad creative generation, consent coexistence, retargeting, UTM expansion
**Researched:** 2026-03-28
**Overall confidence:** HIGH

## Executive Summary

V1.7 extends the existing landing page and tracking infrastructure with Meta Pixel for Facebook/Instagram campaign support, code-generated ad creative images, retargeting event infrastructure, and expanded UTM attribution. The existing consent and tracking patterns in LandingPageLayout.astro are well-designed and extend cleanly to support a second pixel -- the core work is adding Meta's `fbq()` consent/revoke/grant calls alongside the existing `gtag` consent flow, sharing the same localStorage key and consent banner.

Only two new npm dependencies are needed, both dev-only: `satori` (JSX-to-SVG rendering for ad image templates) and `@resvg/resvg-js` (SVG-to-PNG conversion). The Meta Pixel itself is a CDN-loaded script with zero npm footprint. UTM expansion is a one-line code change. Privacy policy updates, consent banner button parity, and retargeting events are all additive changes to existing files. No structural refactoring is needed.

The most critical implementation detail is the ordering of `fbq('consent', 'revoke')` before `fbq('init')` -- this is the Meta equivalent of Google's denied-defaults pattern and is mandatory for GDPR compliance. Datatilsynet actively enforced Meta Pixel consent violations against 6 Norwegian websites in 2025, with explicit warnings of harsher penalties for future violations. The consent banner also needs a visual fix: accept and reject buttons must have equal prominence per Norway's updated E-Com Act (January 2025). This is a CSS-only change but is a legal prerequisite before adding a second pixel.

The ad creative generation pipeline uses satori + resvg-js to produce brand-consistent PNG images from JSX templates at build time, avoiding external design tool dependencies. The same pipeline generates a custom OG image for the landing page. All ad-related documentation (copy, strategy, targeting, testing plan) lives in `.planning/ads/` as reference material, not source code.

## Key Findings

**Stack:** 2 new dev dependencies (satori + resvg-js) for ad image generation; Meta Pixel is CDN-only (fbevents.js). All other work is code changes to existing files.

**Architecture:** Meta Pixel inserts into the existing consent IIFE in LandingPageLayout.astro. One localStorage key, one banner, two pixels. The consent banner text ("Vi bruker informasjonskapsler for a male annonseeffekt") is generic enough to cover both Google and Meta without naming either.

**Critical pitfall:** Calling `fbq('init')` before `fbq('consent', 'revoke')` fires the pixel unconditionally. This is a GDPR violation that Datatilsynet is actively enforcing (NOK 250,000 fines in 2025, with warnings of escalation).

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Tracking Infrastructure** - Meta Pixel consent integration + UTM expansion + consent banner button parity
   - Addresses: TS-1 (Meta Pixel), TS-3 (UTM expansion), TS-5 (consent parity)
   - Avoids: Pitfall 1 (pixel fires before consent), Pitfall 3 (consent banner nudging)
   - Rationale: Must deploy before any Facebook ad spend. Consent compliance is a legal blocker.

2. **Conversion Events + Privacy** - ViewContent and Lead events + privacy policy update
   - Addresses: TS-2 (retargeting events), TS-4 (privacy policy)
   - Avoids: Pitfall 12 (privacy policy not updated before pixel goes live)
   - Rationale: Privacy policy update is a legal prerequisite for the pixel. Events are the foundation for retargeting audiences.

3. **Ad Creative Generation** - satori/resvg-js pipeline + image templates + custom OG image
   - Addresses: TS-6 (ad creatives)
   - Avoids: Pitfall 9 (wrong ad format/tone for B2B Norwegian market)
   - Rationale: Independent of pixel work. Can run in parallel with phases 1-2 but must complete before ads launch.

4. **Strategy Documentation** - Ad copy, multi-channel strategy, audience targeting, A/B testing plan, lead form spec
   - Addresses: D-3 (ad copy), D-4 (strategy), D-5 (audience targeting), D-6 (A/B testing), D-7 (lead form spec)
   - Avoids: Pitfall 8 (budget spread too thin), Pitfall 13 (premature optimization)
   - Rationale: Documentation can be written in parallel with any code phase. Must complete before campaign setup in Meta Ads Manager.

5. **Polish + Safety** - Kill switch config, unified tracking config, verification
   - Addresses: D-1 (kill switch), D-2 (tracking config)
   - Avoids: Pitfall 2 (Schrems III risk -- needs ability to disable pixel fast)
   - Rationale: Polish items that improve maintainability but don't block launch.

**Phase ordering rationale:**
- Phase 1 before Phase 2 because retargeting events depend on the pixel being loaded and consent-managed
- Phase 2 before launch because privacy policy must document the pixel before it collects data
- Phase 3 is independent of phases 1-2 (different files, different tooling) and can run in parallel
- Phase 4 is documentation-only and can run fully in parallel with all code phases
- Phase 5 is nice-to-have polish that ships after launch is unblocked

**Research flags for phases:**
- Phase 1: Standard patterns, no additional research needed
- Phase 2: Standard patterns, no additional research needed
- Phase 3: Satori font loading from @fontsource .woff files should be verified during implementation (documented in the ecosystem, but exact file paths depend on @fontsource package version)
- Phase 4: No research needed (documentation)
- Phase 5: No research needed (config refactoring)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | satori and resvg-js verified on npm with current versions. Meta Pixel is CDN-loaded (zero dependency risk). fbq consent API verified against official Meta docs. |
| Features | HIGH | All features are well-defined with clear scope. Standard events (ViewContent, Lead) have documented parameter specs. Ad image specs (1080x1080, 1080x1920) are Meta's standard requirements. |
| Architecture | HIGH | Direct codebase analysis of LandingPageLayout.astro consent IIFE. Integration pattern is additive (new lines inside existing functions). No structural refactoring needed. |
| Pitfalls | HIGH | Norwegian legal context verified against Datatilsynet enforcement actions and E-Com Act requirements. Consent ordering verified against Meta official GDPR docs. Double attribution is inherent to multi-channel (documented, not solvable). |

## Gaps to Address

- **Meta Pixel ID:** The actual Pixel ID is needed from Meta Business Account before implementation. Placeholder 'YOUR_PIXEL_ID' used in research docs.
- **Satori font loading paths:** @fontsource/inter and @fontsource/space-grotesk include .woff files, but exact paths within node_modules should be verified at implementation time (varies by package version).
- **Conversions API evaluation:** If pixel-only attribution shows >30% data gap after 4 weeks of campaign data, server-side Conversions API (CAPI) should be evaluated as a v1.8+ addition. This is explicitly deferred, not forgotten.
- **Consent record retention:** E-Com Act requires 5-year consent record retention. Current localStorage-only approach does not satisfy this for auditing purposes. A proper solution (server-side consent logging) should be evaluated but is not blocking for v1.7 launch.

---

## Sources

- [Meta Pixel GDPR implementation (official)](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr) -- HIGH
- [Meta Pixel standard events (official)](https://www.facebook.com/business/help/402791146561655) -- HIGH
- [satori (Vercel GitHub)](https://github.com/vercel/satori) -- HIGH
- [@resvg/resvg-js (npm)](https://www.npmjs.com/package/@resvg/resvg-js) -- HIGH
- [Datatilsynet tracking pixel enforcement 2025](https://www.datatilsynet.no/en/news/news-2025/unlawful-sharing-of-personal-information-through-tracking-pixels-on-six-websites/) -- HIGH
- [Norwegian E-Com Act compliance](https://cookieinformation.com/resources/blog/norwegian-e-com-act-compliance-checklist/) -- HIGH
- [Facebook ad image specs 2026 (Buffer)](https://buffer.com/resources/facebook-ad-specs-image-sizes/) -- MEDIUM
- [Facebook UTM parameters (Attributer)](https://attributer.io/blog/add-utm-parameters-facebook-ads) -- MEDIUM
- [Meta Consent Mode explained (SecurePrivacy)](https://secureprivacy.ai/blog/meta-consent-mode-explained-2025) -- MEDIUM
- Existing codebase: LandingPageLayout.astro, utm.ts, analytics.ts, takk.astro, personvern/index.astro, env.d.ts -- HIGH
