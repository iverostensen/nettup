# nettup.no

> Nettup's own website. This is our showcase - it should demonstrate what we can build.

## This Project

**What:** Marketing website for Nettup web agency
**URL:** nettup.no
**Tier:** 3 (Expressive) - we can use the full stack here
**Language:** Norwegian (bokmål)
**Production Readiness:** ~95%

## Stack

```
Astro 5 + Tailwind 4 + React islands + Framer Motion
```

React and animations are allowed here. This is our portfolio piece.

## Pages

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Homepage - hero, services overview, testimonials, CTA | ✅ Complete |
| `/tjenester` | Service catalog overview | ✅ Complete |
| `/tjenester/nettside` | Website service detail + FAQ | ✅ Complete |
| `/tjenester/nettbutikk` | E-commerce service detail + FAQ | ✅ Complete |
| `/tjenester/landingsside` | Landing page service detail + FAQ | ✅ Complete |
| `/om-oss` | About Nettup, values, how we work | ✅ Complete |
| `/prosjekter` | Portfolio card grid | ✅ Complete |
| `/prosjekter/[slug]` | Dynamic case study pages (iGive, Blom Company) | ✅ Complete |
| `/kontakt` | Contact form, response time | ✅ Complete |
| `/priskalkulator` | 6-step additive pricing wizard | ✅ Complete |
| `/blogg` | Blog index | ✅ Complete |
| `/blogg/[slug]` | Auto-generated blog articles (6 published) | ✅ Complete |
| `/nettside-for-bedrift` | B2B landing page | ✅ Complete |
| `/personvern` | Privacy policy | ✅ Complete |

## Structure

```
src/
├── components/
│   ├── sections/      → Shared sections (CTA, Testimonials)
│   ├── islands/       → React components (22 islands: FloatingNav, ChatWidget, SmartPrisKalkulator, wizard steps, etc.)
│   ├── layout/        → Footer
│   └── ui/            → Button, Card, Section, SectionHeader, LinkWithArrow, Breadcrumbs
├── config/            → Single source of truth files (services.ts, projects.ts, pricing-config.ts, chatbot.ts, launchOffer.ts, brand.ts)
├── content/
│   └── blogg/         → Astro Content Collection (6 published articles)
├── layouts/
│   └── BaseLayout.astro
├── lib/               → calculateEstimate(), utils, animation helpers + Vitest tests
├── pages/
│   ├── index.astro
│   ├── _home/
│   ├── tjenester/     → index + nettside/, nettbutikk/, landingsside/ (each with _sections/)
│   ├── prosjekter/    → index + [slug].astro (iGive, Blom Company)
│   ├── blogg/         → index + [slug].astro
│   ├── priskalkulator/
│   └── api/           → chat.ts (SSE streaming), suggestions.ts (rate-limited)
├── scripts/
│   └── blog/          → Automated generation pipeline (8 files, Claude API + GitHub)
└── styles/
    └── global.css
```

## Brand

**Theme:** Dark

| Role | Color | Class |
|------|-------|-------|
| Background | `#020617` | `bg-surface` |
| Cards/Sections | `#0F172A` | `bg-surface-raised` |
| Primary text | `#F8FAFC` | `text-text` |
| Muted text | `#94A3B8` | `text-text-muted` |
| Accent | `#06b6d4` | `text-brand`, `bg-brand` |
| Accent hover | `#22d3ee` | `hover:bg-brand-light` |

**Font:** Inter

**Tone:** Professional but approachable. Not corporate, not casual.

## Commands

```bash
npm run dev      # localhost:4321
npm run build    # Production build
npm run preview  # Preview build
```

## Conventions

- **First section top padding:** Use `pt-32 md:pt-40` on the first content block of any page to clear the fixed navbar. The `Section` component's `hero` padding preset already handles this for hero sections.

## Rules for This Project

1. **Norwegian content** - all text in Norwegian (bokmål)
2. **Animations allowed** - this is Tier 3, use Framer Motion where it adds value
3. **Astro sections first** - but escalate to React when animations need sequencing
4. **Mobile-first** - design for 375px, enhance for larger
5. **Fast** - despite animations, LCP < 2s

## Animation Usage

This is our showcase, so animations should be polished:

- **Hero:** Can use Level 2-3 (Framer Motion, maybe Aceternity component)
- **Sections:** Level 1 scroll reveals (IntersectionObserver)
- **Interactions:** Subtle hover states, button feedback
- **Page transitions:** Optional, if it doesn't hurt performance

## Production Checklist

### Completed

- [x] 14 pages built and working (5 core + tjenester sub-pages + blogg + priskalkulator + case studies + personvern)
- [x] Formspree ID configured (`xnjnzybj`)
- [x] Build passes cleanly
- [x] Mobile-responsive design
- [x] Accessibility: focus states, reduced motion, semantic HTML
- [x] Form validation with honeypot spam protection
- [x] `robots.txt` created
- [x] `@astrojs/sitemap` integration (all 14 routes included)
- [x] JSON-LD Organization schema in BaseLayout; CreativeWork + BreadcrumbList on case study pages
- [x] ESLint with TypeScript parser (0 errors)
- [x] `og-image.jpg` created (1200x630px, 35KB)
- [x] Test form submission end-to-end with Formspree
- [x] Optimize images (salg.igive.no.png: 1.1MB → 562KB)
- [x] Add preload hints for fonts and critical assets
- [x] Run Lighthouse audit (CI via GitHub Actions)
- [x] Convert logo to SVG
- [x] Create `manifest.json` for PWA support
- [x] Add Vercel Analytics
- [x] AI chatbot widget with SSE streaming, page context, navigation chips, suggestion chips
- [x] 6-step additive pricing wizard with Vitest-tested calculation engine
- [x] Automated blog pipeline (GitHub Actions, Claude API, Monday 08:00 UTC)
- [x] Dynamic case study pages for iGive and Blom Company

### Ongoing

- [ ] Replace placeholder testimonials with real client quotes
- [ ] Add more projects to `/prosjekter` (currently iGive + Blom Company)
- [ ] Local SEO city pages (v1.5 — in progress)

## Build Info

```bash
npm run dev      # localhost:4321
npm run build    # Production build (1.1s)
npm run preview  # Preview build
npm run lint     # ESLint (0 errors)
```

**Bundle sizes (gzipped):**
- React client: 58.47 kB
- FloatingNav: 4.43 kB
- ContactForm: 2.52 kB

## Don't

- Write English content (Norwegian only)
- Over-animate (every element doesn't need motion)
- Add dependencies we don't use
- Forget `prefers-reduced-motion`
