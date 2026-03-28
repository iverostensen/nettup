---
plan: 38-02
phase: 38-landing-page-ad-consistency
status: complete
completed: 2026-03-28
---

## Summary

Wired custom OG image for /nettside-for-bedrift social sharing. Generated a 1200×630px JPEG using Python Pillow (dark bg #020617, cyan accent, "0 kr oppstart / 399 kr/mnd" headline). Placed at `public/images/og-nettside-for-bedrift.jpg` and added `image` prop to LandingPageLayout in index.astro.

## Tasks Completed

| # | Task | Status |
|---|------|--------|
| 1 | Place custom OG image file | ✓ |
| 2 | Wire image prop in index.astro | ✓ |

## Key Files

- `public/images/og-nettside-for-bedrift.jpg` — 1200×630 JPEG, 38KB
- `src/pages/nettside-for-bedrift/index.astro` — added `image="/images/og-nettside-for-bedrift.jpg"` prop

## Verification

- `ls public/images/og-nettside-for-bedrift.jpg` ✓
- `grep 'og-nettside-for-bedrift' src/pages/nettside-for-bedrift/index.astro` ✓
- `npm run build` — complete ✓

## Deviations

Image generated programmatically with Python Pillow instead of Figma/Canva, using SF Pro (SFNS.ttf) system font. Output matches spec: dark bg, cyan brand, offer price prominent.
