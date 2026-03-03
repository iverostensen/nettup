# Feature Landscape

**Domain:** Web agency marketing website (Norwegian SMB market)
**Researched:** 2026-03-03
**Confidence:** MEDIUM (based on extensive domain knowledge and codebase analysis; web research tools were unavailable, so findings rely on training data covering award-winning agency sites through early 2025)

## Current State Assessment

Nettup already has a functional 5-page site with: video hero + device mockup, pain-point/solution narrative, pricing tiers with launch offer/scarcity, one case study (iGive), process steps, contact form (Formspree), floating nav, scroll reveal animations, SEO fundamentals (sitemap, robots.txt, JSON-LD, OG images), and a dedicated landing page (`/nettside-for-bedrift`). The site works. The question is what takes it from "works" to "wins."

---

## Table Stakes

Features visitors expect from a web agency. Missing any of these signals "they can't even do their own site right."

| Feature | Why Expected | Complexity | Current State | Notes |
|---------|-------------|------------|---------------|-------|
| **Polished hero with clear value proposition** | First 3 seconds determine bounce. Agency sites must immediately communicate competence through visual execution, not just words. | Med | Partial - has video bg + rotating text + device mockup, but value prop is generic ("nettsider som...") | The hero works mechanically but doesn't yet demonstrate the level of craft that makes a prospect think "I want THAT for my business" |
| **Portfolio with real project screenshots** | Prospects need visual proof. "Show, don't tell" is the #1 rule. | Low | Partial - has iGive, but only one project | One project is a start, but it reads as "just launched." Need 2-3 minimum to feel established. |
| **Case study with measurable results** | Numbers create trust. Performance scores, load times, conversion improvements. | Low | Exists - Lighthouse scores shown | Good foundation. Could be stronger with business outcomes, not just technical metrics. |
| **Clear pricing or pricing signal** | Target market (SMBs) wants to know if they can afford it before reaching out. Agencies that hide pricing lose SMB leads. | Low | Strong - three tiers with prices, launch discount, scarcity counter | This is genuinely good for the SMB market. Many agencies hide pricing, but transparency is a competitive advantage here. |
| **Contact form that works and feels trustworthy** | The conversion endpoint. Must feel professional, not like a template. | Low | Exists - Formspree, trust indicators, alternative contact | Solid. Could benefit from more personality in the interaction. |
| **Mobile-responsive design** | Non-negotiable in 2025/2026. Over 60% of Norwegian web traffic is mobile. | Low | Done | Already handles this. |
| **Fast load times** | An agency selling fast websites must have a fast website. LCP > 3s is disqualifying. | Low | Done - Astro SSG, performance optimized | Existing stack (Astro) naturally delivers this. |
| **Professional typography and spacing** | Consistent visual rhythm signals design competence. Bad spacing = amateur hour. | Med | Partial - uses Inter, has consistent spacing utilities, but visual hierarchy could be stronger | Inter is fine but unremarkable. The spacing is functional but not yet expressing a strong visual identity. |
| **SSL + privacy page** | Legal requirement (GDPR) and trust signal. | Low | Done | Already exists at `/personvern`. |
| **SEO fundamentals** | Meta tags, structured data, sitemap. Must rank for "webdesign [city]" searches. | Low | Done - JSON-LD, sitemap, canonical URLs, OG tags | Already thorough. Could expand with more geo-specific structured data. |

---

## Differentiators

Features that separate premium agency sites from generic ones. Not expected, but create competitive advantage.

### Visual Craft & Brand Expression

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Distinctive visual identity beyond "dark + cyan"** | The current palette (slate-900 bg + cyan accent) is extremely common in tech. It's the "default dark mode" of every SaaS landing page. A distinctive color system, custom type treatment, or unique visual motif makes the site memorable. | Med | This is the single biggest gap. The site looks competent but not distinctive. A prospect visiting 5 agency sites won't remember this one. |
| **Custom illustrations or visual motifs** | Stock icons (Heroicons) signal "we used a template." Custom visual elements signal "we design." Even a consistent illustration style or geometric motif unique to Nettup creates brand recognition. | High | Currently using standard Heroicons throughout. Every section has the same icon treatment. |
| **Considered micro-interactions** | Hover states, button feedback, cursor effects that feel intentional and crafted. Not just "scale on hover" but interactions that reveal personality. | Med | Has basic hover states (scale, color change). These are functional but standard. The gap is between "works" and "delights." |
| **Typography as brand element** | Using a distinctive heading font (not the same as body text), custom font sizes that create dramatic hierarchy, or letter-spacing as a design tool. Premium agencies use type itself as visual design. | Med | Currently Inter for everything. Inter is the "I didn't choose a font" font. A distinctive heading face paired with Inter for body would add personality without sacrificing readability. |
| **Photo/video content of real work** | Showing the actual process, real screenshots at multiple viewpoints, before/after comparisons. Not stock, not mockups of fake projects. | Med | Has one real project screenshot. No process imagery, no behind-the-scenes content. |

### Animation & Interaction Quality

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Scroll-linked animations that tell a story** | Not just "fade up on scroll" (which every site does) but animations that reveal content in a narrative sequence. Think: a process section where each step builds on the previous, or a portfolio piece that assembles as you scroll. | High | Currently all animations are identical fade-up reveals. Every section enters the same way. This works but doesn't demonstrate animation craft. |
| **Hero animation that demonstrates capability** | The hero is the first thing visitors see. A genuinely impressive hero animation (not a stock video) proves you can build impressive things. | High | Has video background (neural-network-dark-blue.mp4) + device mockup + rotating text. The video is generic stock footage. The device mockup is good but common. |
| **Smooth page transitions** | View transitions or animated route changes create a feeling of a native app rather than a website. Demonstrates technical sophistication. | Med | None currently. Standard full-page loads. Astro supports View Transitions API natively. |
| **Interactive portfolio pieces** | Portfolio items that respond to mouse movement, have parallax layers, or reveal details on interaction. Makes the portfolio itself a demonstration of skill. | High | Current portfolio is a static image with hover lift. Functional but doesn't demonstrate interactive capabilities. |

### Social Proof & Trust

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Client testimonials with names and faces** | Real quotes from real people. The landing page has a testimonial section but the main site relies only on metrics. | Low | Landing page (`/nettside-for-bedrift`) has a testimonial. Main site does not. This should be on the homepage. |
| **Multiple portfolio pieces** | Minimum 2-3 projects to look established. Variety in project types shows versatility. | Med | Only iGive currently. This is the most impactful gap for credibility. |
| **Performance metrics prominently displayed** | Lighthouse scores, load times, Core Web Vitals - shown in a way that even non-technical people understand matters. "Your site loads 3x faster than competitors." | Low | Exists on project page. Could be more prominently featured and explained in plain language. |
| **Process transparency** | Showing exactly how you work builds trust for SMBs who've been burned by agencies with unclear processes. Timeline, what they get at each step, when they review. | Low | Has 4-step process section. Could be more detailed and visual. |

### Conversion Optimization

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Multiple CTAs per page at natural decision points** | Don't make them scroll back up. Place conversion opportunities where interest peaks. | Low | Has CTA section at bottom + nav button. Could add inline CTAs after compelling sections. |
| **Exit-intent or scroll-depth triggers** | Subtle nudge when visitor seems about to leave or has engaged deeply enough to convert. Not aggressive popups - perhaps a floating CTA that appears after scrolling past the portfolio. | Med | Nothing currently. Must be done tastefully - aggressive popups are anti-features. |
| **Social proof near conversion points** | Testimonials or trust signals placed directly next to/above the contact form reduce friction at the moment of decision. | Low | Contact page has trust indicators. Could add a testimonial quote near the CTA sections. |
| **Personalized CTA copy** | Instead of generic "Ta kontakt," CTAs that reference the section context: "Vil du ha noe lignende?" after portfolio, "Start ditt prosjekt" after pricing. | Low | Currently all CTAs say "Ta kontakt" or "Kom i gang." Contextual copy increases click-through. |

### Technical Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **View Transitions API** | Smooth page-to-page animations native to Astro. Creates app-like feel. Few Norwegian agencies use this, so it stands out. | Med | Not implemented. Astro has built-in support via `astro:transitions`. Low effort for high visual impact. |
| **Dark/light mode toggle** | Shows attention to user preference and technical polish. | Med | Currently dark only. Adding a toggle is medium effort but the design needs to work in both modes. |

---

## Anti-Features

Things to deliberately NOT build. These waste time or actively hurt the site.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Blog/content marketing** | Already declared out of scope. High maintenance, low ROI for a small agency. Blog posts that aren't regularly updated signal abandonment. | Focus energy on portfolio quality and case studies. One excellent case study > ten mediocre blog posts. |
| **Chatbot / live chat widget** | Cheap chatbots are annoying. Good ones require constant attention. For an agency serving 10 clients at a time, a contact form and phone number are sufficient and feel more premium. | Keep contact form + email + phone. Fast response time is the real differentiator. |
| **Animated cursor / custom cursor** | Feels gimmicky on agency sites in 2025/2026. They break accessibility, confuse mobile users, and distract from content. Awwwards-bait that real clients don't care about. | Invest in micro-interactions on actual interactive elements (buttons, cards, links). |
| **Excessive parallax everywhere** | Full-page parallax effects cause performance issues, motion sickness, and feel dated (peak parallax was 2018). | Use parallax sparingly and intentionally - maybe one section, not every section. |
| **Auto-playing background music** | Universally hated. Breaks accessibility. | Never. |
| **Dark/light mode toggle** | Wait - this was a differentiator above. The reality: for a dark-themed agency brand, adding light mode doubles the design work and dilutes the brand identity. Dark IS the brand. | Keep dark mode only. Design one mode excellently rather than two modes adequately. Actually, removing this from differentiators. |
| **Mega-menu navigation** | Five pages don't need a mega-menu. The floating pill nav is the right pattern for this site size. | Keep the current nav pattern. It's clean and appropriate. |
| **Third-party review widgets** | Google reviews embeds, Trustpilot widgets - they look cheap, load slowly, and you can't control what they show. | Curate testimonials manually with real names and quotes. More control, better design. |
| **Loading screen / preloader** | The site is already fast (Astro SSG). A loading screen on a fast site adds perceived load time. It's the web design equivalent of a developer using a huge IDE on a "Hello World" project. | Let the fast load speak for itself. |
| **Cookie consent banner (beyond required)** | If you don't use tracking cookies (Vercel Analytics is cookieless), you don't need a consent banner. A consent banner on a site with no cookies signals you don't understand the tech. | Verify Vercel Analytics is indeed cookieless. If so, skip the banner. |
| **Multilingual support** | Norwegian market only. English adds complexity and dilutes the "local agency" positioning. | All Norwegian. If international clients come, handle individually. |

---

## Feature Dependencies

```
Visual Identity Definition
  --> Typography upgrade (needs brand personality decisions first)
  --> Custom visual motifs (needs design direction)
  --> Color system refinement (needs brand values)
  --> All other visual work inherits from identity

Portfolio expansion (2-3 projects)
  --> Interactive portfolio presentation (needs content first)
  --> Testimonials collection (comes from completed projects)
  --> Case study depth (needs real metrics from clients)

View Transitions API
  --> Page transition animations (needs VT enabled first)
  --> Enhanced navigation feel (builds on VT)

Scroll-linked animations
  --> Process section storytelling (builds on scroll animation infrastructure)
  --> Portfolio reveal sequences (builds on scroll animation infrastructure)
```

---

## MVP Recommendation (Highest Impact, Ordered by Priority)

### Phase 1: Brand Identity & Visual Foundation
1. **Define brand personality** - Before touching any visual element, decide who Nettup is. The current site is "competent but generic." Is the personality confident and bold? Approachable and warm? Technical and precise? This decision cascades into everything.
2. **Typography upgrade** - Replace Inter as heading font with something distinctive. Keep Inter for body. This single change has outsized visual impact for minimal effort.
3. **Color system refinement** - Either own the dark+cyan fully (make it more distinctive) or shift to a more unique palette. Currently sits in "default SaaS" territory.

### Phase 2: Content & Social Proof
4. **Add 1-2 more portfolio projects** - Even self-initiated/concept projects. The single-project portfolio is the biggest credibility gap.
5. **Add testimonials to homepage** - Pull the testimonial pattern from the landing page into the main site.
6. **Deepen the iGive case study** - Add before/after, more screenshots, client quote, business results if available.

### Phase 3: Animation & Interaction Polish
7. **View Transitions** - Enable Astro View Transitions for smooth page navigation. High impact, relatively low effort.
8. **Diversify scroll animations** - Not every section needs the same fade-up. Mix in slide-from-left, scale-in, parallax for visual variety.
9. **Upgrade hero animation** - Replace stock video with something custom or interactive that demonstrates what Nettup builds.

### Phase 4: Conversion Optimization
10. **Contextual CTA copy** - Different CTA text per section.
11. **Strategic CTA placement** - Add conversion points after high-interest sections (portfolio, testimonials).
12. **Micro-interaction polish** - Refined hover states, button feedback, form interactions.

### Defer

- **Interactive portfolio pieces** (High complexity, needs more content first)
- **Custom illustrations** (High complexity, needs brand identity locked first, possibly external illustrator)
- **Exit-intent triggers** (Optimize what you have before adding complexity)
- **Scroll-linked narrative animations** (High complexity, do after simpler animation upgrades prove out the approach)

---

## Competitive Landscape Notes

Norwegian web agency sites for the SMB market tend to fall into two camps:

1. **Template agencies** (Squarespace/WordPress resellers): Generic designs, no real portfolio, compete on price alone. These are NOT the competition - Nettup already differentiates with custom Astro builds.

2. **Premium agencies** (50K+ NOK projects): Beautiful custom sites, deep case studies, strong visual identities. These serve larger clients but set the visual standard that even SMB clients now expect.

The opportunity is in the gap: **premium-looking site at SMB-accessible pricing.** The site needs to look like camp 2 while pricing like something between camp 1 and camp 2. The current site technically works but visually reads closer to camp 1 with its standard components and generic styling.

The single most impactful investment is visual identity differentiation - making the site feel like it was designed by someone with taste, not assembled from a component library.

---

## Sources

- Codebase analysis of all existing pages, sections, components, layouts, and styles
- Domain knowledge of web agency marketing sites, award-winning agency portfolios (Awwwards, FWA, CSS Design Awards patterns), and conversion optimization best practices
- **Confidence note:** Web research tools were unavailable during this research. All findings beyond codebase analysis are based on training data (cutoff early 2025). Trends in agency design move slowly enough that these findings are likely still accurate, but specific competitor analysis and 2026-specific trends should be validated.
