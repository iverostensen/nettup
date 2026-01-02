# Nettup

> Norwegian web agency specializing in modern, performant websites for small and medium businesses.

---

## Table of Contents

1. [Company Overview](#company-overview)
2. [Mission & Values](#mission--values)
3. [Target Market](#target-market)
4. [Project Tiers](#project-tiers)
5. [Tech Stack](#tech-stack)
6. [Architecture Decisions](#architecture-decisions)
7. [Development Workflow](#development-workflow)
8. [Project Structure](#project-structure)
9. [Component Strategy](#component-strategy)
10. [Styling Guidelines](#styling-guidelines)
11. [Animation Philosophy](#animation-philosophy)
12. [Performance Standards](#performance-standards)
13. [Deployment Pipeline](#deployment-pipeline)
14. [Client Delivery Process](#client-delivery-process)
15. [Quality Assurance](#quality-assurance)

---

## Company Overview

**Nettup** is a Norwegian web development agency founded with a clear purpose: deliver professional, modern websites to businesses that deserve better than template-based solutions, but don't need enterprise-level complexity.

We operate as a lean, AI-augmented development practice. This means we combine human expertise in design and architecture with AI-assisted development to deliver high-quality results efficiently.

### What We Do

- **Marketing Websites** — Landing pages, company sites, product launches
- **Portfolio Sites** — Showcasing work for creative professionals and agencies
- **Business Presence** — Professional web presence for local businesses
- **Micro-sites** — Campaign-specific or event-focused sites

### What We Don't Do (Currently)

- Enterprise web applications
- E-commerce platforms (Shopify/WooCommerce fits better)
- Mobile applications
- Ongoing managed services (maintenance contracts available separately)

---

## Mission & Values

### Mission

Make professional web presence accessible to Norwegian small businesses through modern technology, efficient processes, and fair pricing.

### Core Values

**Quality Over Quantity**
We take fewer projects and deliver better results. Every site we build should be portfolio-worthy.

**Performance is Non-Negotiable**
Every site passes Core Web Vitals. Fast sites convert better and rank higher.

**Simplicity in Complexity**
We use modern tools, but the end result should feel effortless to clients.

**Transparency**
Clients see progress through preview URLs. No surprises at delivery.

**Sustainability**
We build sites that are easy to maintain, update, and eventually hand off.

---

## Target Market

### Primary Clients

| Segment | Examples | Typical Needs |
|---------|----------|---------------|
| **Local Services** | Håndverkere, konsulenter, terapeuter | Professional presence, contact forms, service descriptions |
| **Startups** | Early-stage tech companies | Landing pages, waitlists, product showcases |
| **Creative Professionals** | Fotografer, designere, arkitekter | Portfolio sites, galleries, project showcases |
| **Small Retail** | Butikker, restauranter, kafeer | Menu/product displays, location info, opening hours |
| **Professional Services** | Advokater, regnskapsførere, rådgivere | Trust-building presence, team pages, expertise areas |

### Client Profile

- Revenue: 1-50M NOK annually
- Team size: 1-20 employees
- Current web presence: None, outdated, or template-based
- Technical knowledge: Low to moderate
- Decision maker: Owner or marketing lead

---

## Project Tiers

Not every project needs the full stack. We scale complexity to match the client's needs.

### Tier 1: Essential (Most Common)

**For:** Local businesses, service providers, simple company presence

```
Astro + Tailwind + Vanilla JS (if needed)
No React. No component library. Pure HTML/CSS output.
```

**Characteristics:**
- 3-7 pages
- Static content
- Contact form (can use Formspree/Netlify Forms)
- CSS animations only (Level 0-1)
- Fastest possible load times

**Skip:** React, shadcn, Framer Motion, Aceternity

### Tier 2: Enhanced

**For:** Startups, growing businesses, sites needing some interactivity

```
Astro + Tailwind + React islands (selective)
shadcn for form components. Framer Motion for key sections.
```

**Characteristics:**
- 5-15 pages
- Some interactive elements (complex forms, carousels, filters)
- Mix of static and dynamic sections
- CSS + selective Framer Motion (Level 0-2)

**Skip:** Aceternity, complex animation sequences

### Tier 3: Expressive

**For:** Agencies, creative portfolios, tech startups wanting to impress

```
Astro + Tailwind + React islands + Framer Motion + Aceternity (selected components)
Full animation capabilities. Showcase-quality design.
```

**Characteristics:**
- Portfolio/agency showcase
- Creative industry clients
- Animation is part of the brand message
- Full animation hierarchy available (Level 0-3)

### Choosing the Right Tier

| Client Says | Tier |
|-------------|------|
| "We just need something professional" | 1 |
| "We want it to feel modern" | 1-2 |
| "We want animations and effects" | 2-3 |
| "We want to stand out / impress" | 3 |
| "Look at this Awwwards site..." | 3 |

**Default assumption:** Start with Tier 1. Escalate only when the project explicitly requires it.

---

## Tech Stack

### Core Framework

```
Astro 5.x — Static Site Generator with Islands Architecture
```

**Why Astro?**

1. **Zero JavaScript by Default** — Pages ship as pure HTML/CSS unless interactivity is needed
2. **Best-in-Class Performance** — Consistently achieves 95+ Lighthouse scores
3. **Islands Architecture** — Interactive components hydrate independently
4. **Framework Agnostic** — Can use React, Vue, Svelte, or vanilla JS for islands
5. **Content-Focused** — Built specifically for marketing/content sites
6. **Growing Adoption** — Used by IKEA, NordVPN, Porsche, Cloudflare

### Interactive Layer (When Needed)

```
React 19 — For islands requiring state or third-party libraries
Framer Motion — For sequenced/orchestrated animations
Aceternity UI — Curated visual layer for expressive projects
```

**React is a tool, not the entry point.**

React islands are used only when a component genuinely requires:
- Persistent client-side state
- Third-party React libraries
- Complex sequenced animations (timing between elements)

Most sections remain Astro components with CSS animations.

**Aceternity UI positioning:**

Aceternity is not our default component library. It's a curated visual layer for projects that explicitly benefit from expressive motion (creative portfolios, tech startups, agencies). For conservative clients (law firms, accounting, healthcare), we strip animations or skip Aceternity entirely.

We never import the full library — only copy individual components and remove animations that don't fit the project.

### Styling

```
Tailwind CSS 4 — Utility-first CSS framework
@tailwindcss/vite — Direct Vite integration (not deprecated Astro plugin)
```

**Why Tailwind?**

- Rapid development with utility classes
- Consistent design system out of the box
- Excellent AI assistance support
- No context-switching between HTML and CSS files
- Easy responsive design

### Deployment

```
Vercel — Hosting and deployment platform
GitHub — Version control and CI trigger
```

**Why Vercel over GitHub Pages?**

| Feature | Vercel | GitHub Pages |
|---------|--------|--------------|
| Preview deployments | Every PR | Manual |
| Serverless functions | Included | Not available |
| Analytics | Built-in | External only |
| Edge network | Global | Limited |
| Form handling | Possible | Not available |

---

## Architecture Decisions

### Decision 1: Static-First with Progressive Enhancement

**Context:** Most small business sites are content-focused with limited interactivity.

**Decision:** Generate static HTML by default. Add JavaScript only for specific interactive components.

**Consequences:**
- Faster load times (no JS to parse for static content)
- Better SEO (content available immediately)
- Lower hosting costs (static files are cheap)
- Slightly more complex mental model (Astro + React)

### Decision 2: Islands Architecture for Interactivity

**Context:** Some components need JavaScript (animations, forms, carousels).

**Decision:** Use Astro's islands to hydrate only the components that need it.

**Example:**
```astro
---
import StaticHero from '../components/Hero.astro';
import AnimatedTestimonials from '../components/Testimonials';
---

<!-- No JavaScript -->
<StaticHero />

<!-- JavaScript loads only when visible -->
<AnimatedTestimonials client:visible />
```

**Consequences:**
- Minimal JavaScript payload
- Components load when needed
- Requires understanding of hydration directives

### Decision 3: Copy-Paste Component Ownership

**Context:** Traditional component libraries lock you into their update cycle.

**Decision:** Use shadcn/Aceternity pattern — copy component code into project.

**Consequences:**
- Full control over component code
- No breaking changes from library updates
- Larger initial codebase
- Responsibility for maintenance

### Decision 4: Vercel for Deployment

**Context:** Need reliable hosting with good DX for solo development.

**Decision:** Use Vercel's free/pro tier for all client sites.

**Consequences:**
- Automatic preview deployments for client review
- Easy custom domain setup
- Potential cost scaling with high traffic
- Vendor dependency

### Decision 5: Minimal Tooling

**Context:** Solo developer with AI assistance. Complex tooling creates friction.

**Decision:** Keep build pipeline simple. Add tools only when pain is felt.

**What We Use:**
- ESLint (catches errors)
- Prettier (consistent formatting)
- TypeScript (better AI assistance, catches bugs)

**What We Skip (For Now):**
- Unit testing frameworks
- E2E testing (add per-project if needed)
- Lighthouse CI (check manually, Vercel shows metrics)
- Complex pre-commit hooks

---

## Development Workflow

### Phase 1: Discovery (Client)

```
1. Initial client meeting
2. Gather requirements (pages, content, brand assets)
3. Define scope and timeline
4. Provide quote
```

### Phase 2: Setup

Setup varies by project tier. Start minimal, add only what's needed.

**Tier 1 Setup (15 min):**
```bash
npm create astro@latest client-name -- --template minimal
cd client-name
npm install tailwindcss @tailwindcss/vite
mkdir -p src/components/{sections,layout}
mkdir -p public/images
# Done. No React needed.
```

**Tier 2 Setup (30 min):**
```bash
npm create astro@latest client-name -- --template minimal
cd client-name
npx astro add react
npm install tailwindcss @tailwindcss/vite
npm install framer-motion
npx shadcn@latest init  # Only if forms needed
mkdir -p src/components/{sections,islands,layout,ui}
mkdir -p src/lib
mkdir -p public/images
```

**Tier 3 Setup (45 min):**
```bash
npm create astro@latest client-name -- --template minimal
cd client-name
npx astro add react
npm install tailwindcss @tailwindcss/vite
npm install framer-motion
npx shadcn@latest init
# Copy specific Aceternity components as needed
mkdir -p src/components/{sections,islands,layout,ui}
mkdir -p src/lib
mkdir -p public/images
```

### Phase 3: Development Loop

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Code Section ──► Preview Locally ──► Push to GitHub   │
│         │                                    │          │
│         │                                    ▼          │
│         │                          Vercel Preview URL   │
│         │                                    │          │
│         └──────────── Iterate ◄──────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Daily workflow:**
```bash
npm run dev          # Start local development
# Build sections iteratively
git add . && git commit -m "Add hero section"
git push             # Triggers Vercel preview
# Share preview URL with client if needed
```

### Phase 4: Client Review

1. Share Vercel preview URL
2. Collect feedback (email, meeting, or feedback tool)
3. Iterate on feedback
4. Repeat until approved

### Phase 5: Launch

```bash
git checkout main
git merge develop    # or PR merge
git push             # Triggers production deployment
```

Post-launch:
1. Configure custom domain in Vercel
2. Verify SSL certificate
3. Submit sitemap to Google Search Console
4. Final Lighthouse check

---

## Project Structure

```
client-project/
├── public/
│   ├── images/              # Optimized client images
│   ├── fonts/               # Self-hosted fonts (if any)
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── ui/              # Aceternity/shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   │
│   │   ├── sections/        # Page sections (Astro by default)
│   │   │   ├── Hero.astro
│   │   │   ├── Features.astro
│   │   │   ├── Testimonials.astro
│   │   │   ├── Pricing.astro
│   │   │   └── CTA.astro
│   │   │
│   │   ├── islands/         # React islands (only when required)
│   │   │   └── ContactForm.tsx
│   │   │
│   │   └── layout/          # Layout components (Astro)
│   │       ├── Header.astro
│   │       ├── Footer.astro
│   │       └── Navigation.astro
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro # Main HTML wrapper
│   │
│   ├── pages/
│   │   ├── index.astro      # Homepage
│   │   ├── om-oss.astro     # About page
│   │   ├── tjenester.astro  # Services page
│   │   └── kontakt.astro    # Contact page
│   │
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn, etc.)
│   │
│   └── styles/
│       └── global.css       # Tailwind imports + custom CSS
│
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Astro components | PascalCase.astro | `Header.astro` |
| React components | PascalCase.tsx | `Hero.tsx` |
| Pages | kebab-case.astro | `om-oss.astro` |
| Utilities | camelCase.ts | `utils.ts` |
| CSS files | kebab-case.css | `global.css` |

### File Responsibilities

**`.astro` files** — Default for everything: sections, layout, pages
**`.tsx` files** — Only for islands requiring React (state, third-party libs, complex animation sequences)
**`layouts/`** — Shared HTML structure (head, body wrapper)
**`sections/`** — Reusable page sections (Astro by default)
**`islands/`** — React components that require hydration
**`ui/`** — Low-level UI primitives (can be Astro or React depending on interactivity)

---

## Component Strategy

### The Astro-First Rule

**Every section starts as an Astro component.** Only escalate to React when you hit a genuine requirement that Astro cannot fulfill.

A section requires React **only** when it needs:
- Persistent client-side state (not just hover/focus)
- A third-party React library with no alternative
- Complex sequenced animations (orchestrated timing between multiple elements)

A section does **not** require React for:
- Fade-in on scroll (use CSS + IntersectionObserver)
- Hover effects (use CSS)
- Simple reveals (use CSS transitions)
- Click toggles (can use Astro + vanilla JS)

### Astro Section Example

```astro
---
// Features.astro - No JavaScript shipped
const features = [
  { title: 'Rask', description: 'Nettsider som laster på under 2 sekunder' },
  { title: 'Moderne', description: 'Design som imponerer kundene dine' },
  { title: 'Trygt', description: 'HTTPS og sikker hosting inkludert' },
];
---

<section class="py-20">
  <div class="container mx-auto grid gap-8 md:grid-cols-3">
    {features.map((feature, i) => (
      <article
        class="animate-fade-up opacity-0"
        style={`animation-delay: ${i * 100}ms`}
      >
        <h3 class="text-xl font-bold">{feature.title}</h3>
        <p class="text-gray-600">{feature.description}</p>
      </article>
    ))}
  </div>
</section>

<style>
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-up {
    animation: fade-up 0.5s ease-out forwards;
  }
</style>
```

### When React Islands Are Justified

```tsx
// ContactForm.tsx - Needs React for form state + validation
import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Complex form logic that benefits from React state
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields with real-time validation */}
    </form>
  );
}
```

```tsx
// TestimonialCarousel.tsx - Needs React for Embla Carousel library
import useEmblaCarousel from 'embla-carousel-react';

export default function TestimonialCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true });
  // Third-party library with no vanilla alternative
}
```

### Island Hydration Directives

| Directive | Use Case |
|-----------|----------|
| `client:visible` | Default — loads JS when component enters viewport |
| `client:load` | Critical interactivity that must work immediately |
| `client:idle` | Non-urgent (analytics, chat widgets) |
| `client:only="react"` | Client-only, skip SSR (avoids hydration mismatch) |

### Decision Checklist

Before creating a `.tsx` file, ask:

1. Does this need state that persists across renders? → React
2. Does this require a React-specific library? → React
3. Does this need orchestrated animation timing? → React + Framer Motion
4. Can I achieve this with CSS transitions? → Astro
5. Can I use IntersectionObserver + CSS classes? → Astro
6. Is the interactivity just toggle/hover? → Astro + vanilla JS

---

## Styling Guidelines

### Tailwind Usage

**Do:**
```html
<!-- Utility classes for all styling -->
<button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
  Click me
</button>
```

**Don't:**
```html
<!-- Avoid custom CSS when Tailwind suffices -->
<button class="custom-button">Click me</button>

<style>
  .custom-button { /* ... */ }
</style>
```

### Custom CSS (When Needed)

Use `global.css` for:
- Font imports
- CSS custom properties (design tokens)
- Complex animations not possible with Tailwind
- Third-party component overrides

```css
/* src/styles/global.css */
@import 'tailwindcss';

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --color-brand: #2563eb;
  --color-brand-dark: #1d4ed8;
}

/* Complex animation that Tailwind can't handle */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### Responsive Design

Mobile-first approach using Tailwind breakpoints:

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
</div>
```

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| (default) | 0px | Mobile |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

---

## Animation Philosophy

### The Animation Hierarchy

Animation decisions follow an explicit priority order. Start at Level 0 and only escalate when necessary.

```
┌─────────────────────────────────────────────────────────────────┐
│ Level 0 (Default)                                               │
│ CSS transitions, CSS animations, prefers-reduced-motion         │
│ → No JavaScript. Ship to all projects.                          │
├─────────────────────────────────────────────────────────────────┤
│ Level 1 (Common)                                                │
│ IntersectionObserver + CSS class toggling                       │
│ → Minimal JS (~20 lines). Scroll reveals, lazy effects.         │
├─────────────────────────────────────────────────────────────────┤
│ Level 2 (Selected)                                              │
│ Framer Motion                                                   │
│ → When sequence matters, when timing between elements is key,   │
│   when you're telling a visual story.                           │
├─────────────────────────────────────────────────────────────────┤
│ Level 3 (Rare)                                                  │
│ Aceternity UI components                                        │
│ → Hero/flagship sections only. Expressive projects only.        │
│   Never full library — copy individual components.              │
└─────────────────────────────────────────────────────────────────┘
```

### Guiding Principles

1. **CSS is the home base** — Most animations don't need JavaScript
2. **Purpose Over Flash** — Every animation should guide attention or provide feedback
3. **Performance Budget** — Animate only `transform` and `opacity` (GPU-accelerated)
4. **Respect Reduced Motion** — Always honor `prefers-reduced-motion`
5. **Subtle by Default** — 200-400ms duration, 10-20px movement

### Level 0: CSS Animations (Default)

```css
/* global.css - Available everywhere, no JS */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-up {
  animation: fade-up 0.5s ease-out forwards;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-up {
    animation: none;
    opacity: 1;
  }
}
```

```astro
<!-- Usage in Astro - zero JS -->
<h1 class="animate-fade-up">Velkommen</h1>
```

### Level 1: IntersectionObserver + CSS

```astro
---
// ScrollReveal.astro - Minimal JS approach
---

<div class="reveal-on-scroll opacity-0 translate-y-4 transition-all duration-500">
  <slot />
</div>

<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-4');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
</script>
```

### Level 2: Framer Motion (When Sequence Matters)

Use only when you need:
- Orchestrated timing between multiple elements
- Spring physics
- Gesture-based animations
- Complex enter/exit sequences

```tsx
// Only escalate to this when CSS can't achieve the effect
import { motion, stagger, useAnimate } from 'framer-motion';

function StaggeredList({ items }) {
  // Sequenced animation where timing between items matters
  return (
    <motion.ul initial="hidden" animate="show" variants={{
      show: { transition: { staggerChildren: 0.1 } }
    }}>
      {items.map(item => (
        <motion.li
          key={item}
          variants={{
            hidden: { opacity: 0, x: -20 },
            show: { opacity: 1, x: 0 }
          }}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Level 3: Aceternity (Flagship Sections Only)

Reserved for:
- Agency/portfolio showcase sites
- Tech startup landing pages
- Creative industry clients

Not appropriate for:
- Law firms, accounting, healthcare (use conservative design)
- Small local businesses (often prefer simplicity)
- Content-heavy sites (animations distract from reading)

When using Aceternity:
1. Copy only the specific component you need
2. Strip animations that don't fit the project's tone
3. Modify the visual style to avoid "template look"

### Reduced Motion: Always

```css
/* Every animation must have this */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Standards

### Core Web Vitals (Primary Metrics)

These are what actually matter for users and SEO. Optimize for these first.

| Metric | Good | Target | Why It Matters |
|--------|------|--------|----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | < 1.5s | Perceived load speed |
| **INP** (Interaction to Next Paint) | < 200ms | < 100ms | Responsiveness |
| **CLS** (Cumulative Layout Shift) | < 0.1 | < 0.05 | Visual stability |

### Lighthouse (Indicator, Not Goal)

Lighthouse scores are useful indicators but not the optimization target.

| Category | Expectation |
|----------|-------------|
| Performance | 85+ is acceptable, 90+ is good |
| Accessibility | 95+ (this one matters) |
| Best Practices | 90+ |
| SEO | 90+ |

**Why this distinction?**

- A 95 Lighthouse score with 3s LCP is worse than 88 with 1.2s LCP
- Chasing Lighthouse points leads to micro-optimizations that don't help users
- Real-world Core Web Vitals (from Chrome UX Report) matter more than lab scores

**Don't over-optimize:**
- A legitimate analytics script is worth more than 3 Lighthouse points
- A cookie consent banner is legally required in Norway, accept the CLS impact
- An embedded map helps users find the business, keep it

### Performance Checklist

**Images:**
- [ ] Use Astro's `<Image>` component for automatic optimization
- [ ] Provide explicit width/height to prevent CLS
- [ ] Use WebP/AVIF formats
- [ ] Lazy load below-fold images

**JavaScript:**
- [ ] Use `client:visible` for below-fold islands
- [ ] Check bundle size with `npm run build` output
- [ ] Avoid large dependencies for small features

**Fonts:**
- [ ] Limit to 2 font families maximum
- [ ] Use `font-display: swap`
- [ ] Subset fonts if possible (latin only)

**General:**
- [ ] Enable Astro's built-in asset optimization
- [ ] Use static generation (not SSR) when possible
- [ ] Minimize third-party scripts (analytics, chat widgets)

---

## Deployment Pipeline

### Environment Flow

```
Feature Branch ──► Pull Request ──► Preview URL ──► Main Branch ──► Production
     │                  │               │                              │
  Local dev         CI checks      Client review                   Live site
```

### Vercel Configuration

**vercel.json** (if needed):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

Most Astro projects work without configuration — Vercel auto-detects.

### Domain Setup

1. Add domain in Vercel dashboard
2. Update DNS:
   - A record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`
3. SSL auto-provisions

### GitHub Integration

**Automatic:**
- Push to any branch → Preview deployment
- Push to `main` → Production deployment

**Branch Protection (Recommended):**
- Require PR for `main`
- Require build to pass
- Optional: Require review

---

## Client Delivery Process

### Handoff Checklist

**Technical:**
- [ ] All pages complete and responsive
- [ ] Forms working (if applicable)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Sitemap submitted to Google
- [ ] Analytics configured (if requested)
- [ ] Favicon and social images set
- [ ] 404 page configured

**Documentation for Client:**
- [ ] How to request changes
- [ ] Content update process (if CMS)
- [ ] Domain renewal information
- [ ] Hosting account access (if transferred)

**Assets:**
- [ ] Original design files (if created)
- [ ] Image assets (full resolution)
- [ ] Brand guidelines used
- [ ] Font licenses (if applicable)

### Post-Launch Support

**Included (30 days):**
- Bug fixes
- Minor text changes
- Clarifications

**Additional (quoted separately):**
- New pages
- Feature additions
- Redesigns
- Ongoing maintenance

---

## Quality Assurance

### Pre-Launch Checks

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

**Device Testing:**
- [ ] Desktop (1920px, 1440px, 1280px)
- [ ] Tablet (768px)
- [ ] Mobile (375px, 390px)

**Functionality:**
- [ ] All links work (internal and external)
- [ ] Forms submit correctly
- [ ] Images load properly
- [ ] Animations perform smoothly
- [ ] Navigation works on all pages

**SEO:**
- [ ] Meta titles and descriptions set
- [ ] OpenGraph images configured
- [ ] Structured data (if applicable)
- [ ] Canonical URLs set
- [ ] No broken links

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Color contrast sufficient
- [ ] Alt text on images
- [ ] Form labels present
- [ ] Reduced motion respected

### Tools

| Purpose | Tool |
|---------|------|
| Lighthouse | Chrome DevTools |
| Accessibility | axe browser extension |
| Link checking | Dead Link Checker |
| Performance | WebPageTest |
| Mobile preview | Responsively App |

---

## Appendix: Quick Reference

### Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Run Prettier
```

### Adding New Components

**Astro (static):**
```bash
touch src/components/layout/NewComponent.astro
```

**React (interactive):**
```bash
touch src/components/sections/NewComponent.tsx
# Remember to add client: directive when using
```

### Common Island Pattern

```astro
---
import AnimatedSection from '../components/sections/AnimatedSection';
---

<AnimatedSection client:visible />
```

---

*Last updated: January 2025*
*Nettup — Vi bygger nettsider som virker.*