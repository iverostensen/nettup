# Visual Content Plan

Source of truth for all screenshot filenames and Lighthouse scores. Consumed by phases 21–23.

## Screenshots

| Filename | Project | Section | Dimensions | Crop Guide | Status |
|----------|---------|---------|------------|------------|--------|
| igive-hero.png | iGive | Above-fold hero | 1600×900 | Open salg.igive.no at 1600px viewport width, scroll to top, capture full viewport | [x] |
| igive-features.png | iGive | Features/benefits section | 1600×900 max 1600px wide | Scroll to the feature grid/benefits list section, capture the section | [x] |
| blom-hero.png | Blom Company | Above-fold hero | 1600×900 | Open blomcompany.com (fallback: blom-no.vercel.app) at 1600px viewport width, scroll to top, capture full viewport | [x] |
| blom-features.png | Blom Company | Product/collection section | 1600×900 max 1600px wide | Scroll to the product collection section, capture the section | [x] |

## Lighthouse Scores

Measured via pagespeed.web.dev. Run after screenshots are captured.

| Project | URL | Performance | Accessibility | Best Practices | SEO | Measured |
|---------|-----|-------------|---------------|----------------|-----|----------|
| iGive | salg.igive.no | 96 | 96 | 100 | 100 | 2026-03-07 |
| Blom Company | blomcompany.com | 99 | 96 | 100 | 100 | 2026-03-07 |

## Notes

- igive-hero.png replaces src/assets/images/salg.igive.no.png (renamed for clean kebab-case). Three import sites updated atomically in plan 20-03.
- blomcompany.com is the primary capture URL. If DNS does not resolve, use blom-no.vercel.app and update the URL column above.
