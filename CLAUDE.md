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
| `/tjenester` | What we offer, pricing tiers | ✅ Complete |
| `/om-oss` | About Nettup, values, how we work | ✅ Complete |
| `/prosjekter` | Portfolio with iGive case study | ✅ Complete |
| `/kontakt` | Contact form, response time | ✅ Complete |

## Structure

```
src/
├── components/
│   ├── sections/      → Shared sections (CTA, Testimonials)
│   ├── islands/       → React components (FloatingNav, MobileMenu, forms)
│   ├── layout/        → Footer
│   └── ui/            → Button, Card, Section, SectionHeader, LinkWithArrow
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro           → Homepage
│   ├── _home/                → Homepage sections
│   ├── tjenester/
│   │   ├── index.astro
│   │   └── _sections/        → Tjenester sections
│   └── [other pages]/
│       ├── index.astro
│       └── _sections/        → Page-specific sections
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

- [x] All 5 pages built and working
- [x] Formspree ID configured (`xnjnzybj`)
- [x] Build passes cleanly (1.1s, 5 pages)
- [x] Mobile-responsive design
- [x] Accessibility: focus states, reduced motion, semantic HTML
- [x] Form validation with honeypot spam protection
- [x] `robots.txt` created
- [x] `@astrojs/sitemap` integration (auto-generates sitemap)
- [x] JSON-LD Organization schema in BaseLayout
- [x] ESLint with TypeScript parser (0 errors)
- [x] `og-image.jpg` created (1200x630px, 35KB)

### Before Launch (Critical)

- [x] **Test form submission** end-to-end with Formspree

### High Priority (Launch or Soon After)

- [x] Optimize `salg.igive.no.png` (resized 2940px → 1600px, 1.1MB → 562KB)
- [x] Add `aria-live="polite"` to form success/error messages (already implemented)
- [x] Add preload hints for fonts and critical assets
- [x] Run Lighthouse audit and fix any issues

### Medium Priority (Post-Launch)

- [x] Convert logo to SVG (currently 95KB PNG)
- [x] Create `manifest.json` for PWA support
- [x] Add Vercel Analytics
- [ ] Add more projects to `/prosjekter`

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
