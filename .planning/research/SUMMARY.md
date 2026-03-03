# Research Summary: Nettup.no Enhancement

**Domain:** Web agency marketing website - brand identity, animation, SEO, UX/conversion
**Researched:** 2026-03-03
**Overall confidence:** MEDIUM (web research tools were unavailable; findings based on codebase analysis and training data with May 2025 cutoff)

## Executive Summary

Nettup.no is a functional 5-page marketing site for a Norwegian web agency, built on Astro 5 + Tailwind 4 + React islands + Framer Motion. The site works -- all pages render, the form converts, performance is good (LCP well under 2s), and SEO fundamentals are in place. The gap is not technical capability but visual identity and polish. The site currently looks competent but generic: dark-slate background with cyan accents is the default palette of every SaaS landing page in 2024-2025.

The most important finding across all research dimensions is that **no new dependencies are needed**. The existing stack (Framer Motion, Tailwind, Astro) has untapped capabilities that address every requirement. Framer Motion is installed but only used for basic AnimatePresence and motion.div animations -- useScroll, useTransform, useInView, layout animations, and spring physics are all available but unused. Tailwind config has colors but lacks a complete token system (spacing, typography scale, animation timing, border-radius conventions). SEO schemas exist but are incomplete (missing Service, FAQ, BreadcrumbList schemas).

The critical dependency chain is: **brand identity must be defined before anything else**. The PROJECT.md explicitly states "Merkevaren er udefinert." Without brand personality decisions, animation style, color refinement, copy tone, and visual motifs will lack coherence. Every other enhancement depends on this foundation.

For the Norwegian SMB market specifically, the opportunity is positioning in the gap between template agencies (Squarespace resellers competing on price) and premium agencies (50K+ NOK projects with strong visual identities). Nettup needs to look like the second camp while pricing accessibly. The current site reads closer to camp one visually despite being technically superior.

## Key Findings

**Stack:** Zero new packages needed. Use existing Framer Motion more deeply (useScroll, useTransform, useInView, layout, spring physics) and extend Tailwind config into a complete brand token system.

**Architecture:** Three systems layered onto existing codebase -- brand tokens (config/brand.ts flowing to tailwind.config.ts), animation presets (lib/animation.ts consumed by React islands), and SEO infrastructure (config/seo.ts + lib/seo.ts generating JSON-LD schemas). All build-time except React island animations.

**Critical pitfall:** Starting visual implementation before defining brand identity. This leads to inconsistent design decisions, multiple rework rounds, and a site that still looks like a template because there is no coherent personality driving choices.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Brand Identity Foundation** - Define personality, lock color palette, establish typography, create design token system
   - Addresses: Visual distinctiveness, "Merkevaren er udefinert" requirement
   - Avoids: Pitfall 2 (brand without decision framework), Pitfall 6 (typography changes without systematic implementation)

2. **Animation & Interaction Polish** - Use Framer Motion advanced APIs, add scroll-linked animations, micro-interactions on CTAs
   - Addresses: "Animasjoner som demonstrerer teknisk kompetanse" requirement
   - Avoids: Pitfall 1 (animation over-engineering), Pitfall 9 (competing animation systems), Pitfall 10 (mobile ignored)

3. **SEO & Structured Data** - Expand JSON-LD schemas, add hreflang, optimize per-page meta, claim Google Business Profile
   - Addresses: SEO optimization requirement
   - Avoids: Pitfall 3 (SEO for wrong keywords), Pitfall 12 (schema drift)

4. **UX & Conversion Optimization** - Trust signals, CTA placement, contextual copy, measure with analytics
   - Addresses: "UX/UI-forbedringer som oker konvertering" requirement
   - Avoids: Pitfall 4 (conversion friction from redesign), Pitfall 5 (breaking launch offer)

**Phase ordering rationale:**
- Brand identity MUST come first -- all other phases consume brand decisions (animation personality, SEO voice, CTA design)
- Animation before SEO because animation changes are higher-risk (client-side impact, performance budget) and should happen early while there is budget to iterate
- SEO is low-risk build-time work that can proceed independently after brand is locked
- Conversion optimization should be last because it requires measuring baselines and benefits from all prior improvements being in place

**Research flags for phases:**
- Phase 1: Needs creative decisions, not just engineering. May need external design input.
- Phase 2: Verify Framer Motion v12 API availability (useScroll, motion/mini) against current docs -- training data may be stale.
- Phase 3: Verify Google's handling of `nb` vs `no` hreflang for Norwegian content. Check if `@astrojs/sitemap` generates hreflang entries.
- Phase 4: Standard patterns, unlikely to need additional research.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | No new deps needed -- this is a codebase-derived conclusion, not web-dependent |
| Features | MEDIUM | Feature landscape based on agency site patterns from training data; Norwegian market specifics are less certain |
| Architecture | HIGH | Architecture recommendations flow directly from Astro/Tailwind/FM established patterns and current codebase structure |
| Pitfalls | HIGH | Pitfalls identified from codebase-specific risks (animation budget, schema drift, launch offer flow) rather than external trends |
| Norwegian SEO | LOW | Specific keyword volumes, Google Business Profile setup for Norway, and hreflang handling for `nb` need live verification |
| Framer Motion v12 APIs | MEDIUM | API surface known from training data but v12-specific additions should be verified |

## Gaps to Address

- Framer Motion v12 specific documentation: verify `motion/mini` import path, `useScroll` API stability, any new scroll-linked animation features
- Norwegian local SEO: verify current Google Business Profile setup process for Norwegian businesses, `nb` vs `no` hreflang handling
- Astro View Transitions: mentioned in FEATURES.md as a differentiator -- verify current Astro 5 support and any performance implications
- Typography options: if a distinctive heading font is chosen, research loading strategy (Google Fonts vs self-hosted via @fontsource)
- Vercel Speed Insights: verify if it requires separate installation for Astro or is included in @vercel/analytics
- CSS scroll-driven animations browser support in 2026: may now be viable as alternative to Framer Motion for simple cases

## Sources

- `/Users/iverostensen/nettup/package.json` -- current dependencies
- `/Users/iverostensen/nettup/tailwind.config.ts` -- current brand tokens
- `/Users/iverostensen/nettup/src/layouts/BaseLayout.astro` -- SEO and meta implementation
- `/Users/iverostensen/nettup/src/styles/global.css` -- animation system
- `/Users/iverostensen/nettup/src/components/islands/` -- React island patterns
- `/Users/iverostensen/nettup/.planning/PROJECT.md` -- project requirements and constraints
- `/Users/iverostensen/nettup/CLAUDE.md` -- project rules and constraints
- Training data: Framer Motion, Tailwind CSS v4, Schema.org, Astro 5 (MEDIUM confidence)
