# Quick Task 4: Update /tjenester/[slug] pages

## Task 1: Remove RelaterteTjenester from all service pages

**Files:**
- `src/pages/tjenester/nettside/index.astro`
- `src/pages/tjenester/nettbutikk/index.astro`
- `src/pages/tjenester/landingsside/index.astro`

**Action:** Remove the `RelaterteTjenester` import and `<RelaterteTjenester ... />` usage from all three service page index files.

**Verify:** `grep -r "RelaterteTjenester" src/pages/tjenester/` returns nothing.

## Task 2: Update Inkludert sections - fix support text and add 9th item

**Files:**
- `src/pages/tjenester/nettside/_sections/Inkludert.astro`
- `src/pages/tjenester/nettbutikk/_sections/Inkludert.astro`
- `src/pages/tjenester/landingsside/_sections/Inkludert.astro`

**Action:**
1. Change "30 dagers support" to "Løpende support" (or similar) with description referencing monthly subscription that includes support
2. Add a 9th feature item to each page to complete the 3x3 grid. Choose contextually appropriate items per service:
   - **Nettside:** "Ytelsesoptimalisering" - We optimize for fast load times and high Lighthouse scores
   - **Nettbutikk:** "Fraktalternativer" - We configure shipping options and rates for your store
   - **Landingsside:** "Hosting" - Fast and reliable hosting included in project price

**Verify:** Each Inkludert.astro has exactly 9 features. No mention of "30 dager" remains.
