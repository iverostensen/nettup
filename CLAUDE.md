# nettup.no

> Nettup's own website. This is our showcase - it should demonstrate what we can build.

## This Project

**What:** Marketing website for Nettup web agency
**URL:** nettup.no
**Tier:** 3 (Expressive) - we can use the full stack here
**Language:** Norwegian (bokmål)

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
| `/om-oss` | About Nettup, values, how we work | Not started |
| `/prosjekter` | Portfolio of client work | Not started |
| `/kontakt` | Contact form, location, response time | Not started |

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

## Current Tasks

1. **Build /om-oss** - Intro, background, approach, values
2. **Build /prosjekter** - Portfolio with iGive case study
3. **Build /kontakt** - Contact form (React island), info section

## Don't

- Write English content (Norwegian only)
- Over-animate (every element doesn't need motion)
- Add dependencies we don't use
- Forget `prefers-reduced-motion`
