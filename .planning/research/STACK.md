# Technology Stack

**Project:** Nettup.no - Brand, Animation, SEO & UX Enhancement
**Researched:** 2026-03-03
**Note:** Web search tools were unavailable during research. Recommendations are based on codebase analysis and training data (cutoff May 2025). Versions should be verified against npm/official docs before installation. Confidence levels adjusted accordingly.

## Current Stack (Do Not Change)

Already installed and working. No reason to touch these:

| Technology | Version | Purpose |
|------------|---------|---------|
| Astro | ^5.0.0 | Static site framework |
| React | ^19.2.3 | Interactive islands |
| Tailwind CSS | ^4.0.0 | Styling |
| Framer Motion | ^12.23.26 | Animations |
| clsx + tailwind-merge | ^2.1.1 / ^3.4.0 | Class utilities |
| @vercel/analytics | ^1.6.1 | Analytics |
| @astrojs/sitemap | ^3.6.0 | Sitemap generation |

## Recommended Additions

### 1. Brand Identity System

No new libraries needed. Use what exists.

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| CSS custom properties (native) | N/A | Design token layer | Already using Tailwind config for tokens. Extend `tailwind.config.ts` with spacing scale, typography scale, border-radius tokens. Zero dependencies. |
| Tailwind config extensions | ^4.0.0 (existing) | Brand system enforcement | Add semantic aliases: `bg-brand-subtle`, `text-brand-on-dark`, animation timing tokens (`--duration-fast: 150ms`, `--duration-normal: 300ms`, `--ease-brand: cubic-bezier(...)`) |

**Rationale:** The site already has `tailwind.config.ts` with brand colors. The gap is not missing tools -- it is missing *completeness*. A brand system needs: color palette (have), typography scale (partial), spacing rhythm (missing), animation timing (missing), and border-radius conventions (missing). All of this belongs in Tailwind config, not a new library.

**What NOT to use:**
- Style Dictionary / design token tools -- overkill for a single-site brand. These exist for multi-platform design systems (web + iOS + Android). Nettup is one website.
- CSS-in-JS solutions (styled-components, Emotion) -- already have Tailwind, adding CSS-in-JS creates two styling systems.
- Figma token plugins for code sync -- no Figma design system to sync from.

**Confidence:** HIGH (this is standard Tailwind practice, no external verification needed)

### 2. Advanced Animation

Use Framer Motion more deeply. One small addition.

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Framer Motion (existing) | ^12.23.26 | Scroll-linked animations, layout animations, gesture animations | Already installed. Current usage is basic: `AnimatePresence`, `motion.div` with `animate`. Unused capabilities: `useScroll`, `useTransform`, `useInView`, `layout` prop, `whileHover`/`whileTap` gestures, scroll-triggered sequences. |
| `motion/mini` (subset of framer-motion) | Same package | Lighter alternative for simple animations | Framer Motion v11+ ships `motion/mini` -- a smaller bundle for basic animations. Use for simple scroll reveals instead of full `framer-motion` import. |

**Specific APIs to adopt (already in framer-motion, not yet used):**

| API | Purpose | Current Gap It Fills |
|-----|---------|---------------------|
| `useScroll` + `useTransform` | Scroll-linked parallax, progress indicators | Hero parallax, section transitions |
| `useInView` | Scroll-triggered animations with React state | Replace CSS `reveal-on-scroll` for React islands |
| `layout` prop | Smooth layout transitions between states | Card expansions, filter transitions on /prosjekter |
| `whileHover` / `whileTap` | Micro-interactions on buttons/cards | Currently using CSS `hover:scale-[1.02]` -- Framer Motion gives spring physics |
| `useMotionValue` + `useSpring` | Smooth cursor-following, magnetic buttons | Differentiator: magnetic CTA buttons, cursor glow effects |
| `stagger` (via `staggerChildren`) | Orchestrated entrance sequences | Currently using CSS `animation-delay` -- Framer Motion `staggerChildren` is more maintainable |

**What NOT to use:**
- GSAP -- heavyweight (47KB min+gzip), different animation paradigm, would create two animation systems alongside Framer Motion. Only justified for SVG morphing or complex timelines, neither of which this site needs.
- Lottie / Rive -- for illustrative animations (characters, icons). This site uses geometric/typographic animation, not illustration.
- Three.js / R3F -- 3D is overkill for a web agency site targeting small Norwegian businesses. Adds massive bundle and complexity.
- anime.js -- smaller than GSAP but same problem: second animation system alongside Framer Motion.
- CSS scroll-driven animations (`animation-timeline: scroll()`) -- cutting-edge CSS spec, but Firefox support was incomplete as of mid-2025. Framer Motion `useScroll` provides the same capability with broader browser support.

**Confidence:** MEDIUM (Framer Motion API surface is well-known from training data, but specific v12 additions should be verified against motion.dev docs)

### 3. SEO for Norwegian Local Business

Mostly content/config work, minimal tooling needed.

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@astrojs/sitemap` (existing) | ^3.6.0 | Sitemap generation | Already installed. Verify it generates `hreflang="nb"` entries. |
| Schema.org JSON-LD (native) | N/A | Structured data | Already implemented: Organization + LocalBusiness + Offer schemas in BaseLayout. **Needs expansion:** add `Service` schema for each service, `FAQPage` schema if FAQ is added, `Review`/`AggregateRating` when testimonials are formalized. |
| astro-seo (optional) | Latest | SEO component helper | Astro community integration that provides `<SEO>` component with better defaults. **However:** current manual `<meta>` approach in BaseLayout is fine and more explicit. Skip unless SEO management becomes painful. |

**SEO approach (no libraries needed):**

| Task | Approach | Library? |
|------|----------|----------|
| Per-page meta tags | Already doing this via BaseLayout props | No |
| JSON-LD structured data | Already have Organization + LocalBusiness. Add `Service`, `BreadcrumbList` | No |
| Open Graph images | Already have og-image.jpg. Consider per-page OG images. | No (manual or Astro OG image generation) |
| Norwegian `hreflang` | Add `<link rel="alternate" hreflang="nb" href="...">` | No |
| Performance (Core Web Vitals) | Already fast (1.1s build). Monitor with Vercel Analytics. | Existing |
| Google Business Profile | External setup, not code | No |

**What NOT to use:**
- Yoast-like SEO plugins -- these are WordPress tools. Astro is static; SEO is handled at build time via meta tags and structured data.
- Automatic SEO audit integrations -- use Lighthouse CLI or PageSpeed Insights manually. No need to add a dependency.
- next-seo or similar -- Next.js-specific.

**Confidence:** MEDIUM (Schema.org specs are stable, but Norwegian-specific local SEO best practices in 2026 may have evolved beyond training data. Google's handling of `nb` vs `no` hreflang should be verified.)

### 4. UX/Conversion Optimization

No new libraries. This is design and content work.

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel Analytics (existing) | ^1.6.1 | Track page views and Web Vitals | Already installed. Use to measure before/after conversion changes. |
| Vercel Speed Insights | Latest | Core Web Vitals monitoring | May already be included with Vercel Analytics. Provides real-user metrics (LCP, FID, CLS). Verify if separate installation needed for Astro. |

**UX patterns to implement (code, not libraries):**

| Pattern | Implementation | Why |
|---------|---------------|-----|
| Sticky/floating CTA | Already have `FloatingNav`. Add persistent CTA button. | Primary conversion path always visible. |
| Social proof near CTA | Move testimonials/stats closer to contact buttons | Reduces friction at decision point. |
| Form progress indicators | CSS/Framer Motion in `ContactForm` | Multi-step forms convert better than long single forms. |
| Trust signals | Client logos, "sikker betaling", response time badge | Small business owners need reassurance. |
| Exit-intent (mobile: scroll-up) | IntersectionObserver + Framer Motion | Catch leaving visitors. Simple to build, no library needed. |
| A/B testing | Vercel Edge Config or simple feature flags | Test CTA copy, button colors, layout variants. |

**What NOT to use:**
- Hotjar/FullStory/session recording tools -- privacy concerns for Norwegian market (GDPR), and the site is too small to justify the overhead. Use Vercel Analytics for quantitative data.
- Heavy A/B testing platforms (Optimizely, VWO) -- overkill. Use simple feature flags or Vercel Edge Config.
- Chatbots / live chat -- the site targets small businesses who prefer forms. A chat widget adds weight and complexity.
- Cookie consent banners (until needed) -- Vercel Analytics is cookie-less. Only add consent if you add tracking that requires it.

**Confidence:** MEDIUM (UX patterns are well-established, but specific Vercel Speed Insights setup for Astro should be verified)

## Supporting Libraries (Potential Additions)

Only add if a specific feature demands it:

| Library | Version | Purpose | When to Add |
|---------|---------|---------|-------------|
| `@fontsource/inter` | Latest | Self-hosted Inter font | If Google Fonts latency becomes a problem. Eliminates render-blocking external request. Currently loading Inter from Google Fonts with good preload strategy. |
| `sharp` | Latest | Image optimization | If adding dynamic OG images per page. Astro's built-in `<Image>` component uses sharp internally. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|-------------------|
| Animation | Framer Motion (deeper usage) | GSAP | Already have FM. Two animation systems is worse than one used well. GSAP's timeline model adds complexity. |
| Animation | Framer Motion | CSS scroll-driven animations | Browser support incomplete. FM's `useScroll` works everywhere. |
| Design tokens | Tailwind config | Style Dictionary | Multi-platform token tool. This is one website. Tailwind config IS the token system. |
| SEO structured data | Manual JSON-LD | schema-dts (TypeScript types) | Adds build-time types for schema but schemas are written once and rarely change. Not worth the dependency. |
| Font loading | Google Fonts (current) | @fontsource/inter | Current approach with preload + media="print" trick is good. Self-hosting adds build complexity for marginal gain. |
| Analytics | Vercel Analytics | Plausible / Fathom | Already using Vercel. Switching adds migration cost for similar functionality. |
| Conversion optimization | Manual patterns | Third-party tools | Site is too small for enterprise tools. Build simple patterns in code. |

## Installation

No new packages needed for the core work. The existing stack covers everything.

If self-hosted fonts become desirable:
```bash
npm install @fontsource-variable/inter
```

If per-page OG image generation is needed:
```bash
# Astro has built-in support via @astrojs/og - verify current status
# May need: npm install @astrojs/og
```

## Summary

The key insight: **this milestone is not about adding tools, it is about using existing tools more deeply.**

- **Brand identity** = Extend `tailwind.config.ts` with complete token system
- **Advanced animation** = Use Framer Motion APIs already shipped in the bundle (`useScroll`, `useTransform`, `useInView`, `layout`, spring physics)
- **SEO** = Expand existing JSON-LD schemas, add missing meta tags, claim Google Business Profile
- **UX/Conversion** = Design and content patterns, measured with existing Vercel Analytics

The constraint from PROJECT.md -- "Ingen nye avhengigheter uten god grunn" -- is well-served here. Every recommendation either uses what is already installed or requires zero new packages.

## Sources

- Codebase analysis: `package.json`, `tailwind.config.ts`, `BaseLayout.astro`, island components
- Framer Motion documentation (motion.dev) -- training data, MEDIUM confidence
- Schema.org specifications -- training data, MEDIUM confidence
- Tailwind CSS v4 documentation -- training data, MEDIUM confidence
- Note: All web research tools were unavailable. Version numbers and API availability should be verified against current documentation before implementation.
