---
phase: quick-7
plan: 7
type: execute
wave: 1
depends_on: []
files_modified:
  - src/pages/404.astro
autonomous: true
requirements: []
must_haves:
  truths:
    - "Visiting a non-existent URL shows a branded 404 page instead of Vercel's default"
    - "The page includes a link back to the homepage"
    - "FloatingNav and Footer render correctly on the 404 page"
  artifacts:
    - path: "src/pages/404.astro"
      provides: "Custom 404 error page"
  key_links:
    - from: "src/pages/404.astro"
      to: "src/layouts/BaseLayout.astro"
      via: "import and wrap in BaseLayout"
      pattern: "BaseLayout"
---

<objective>
Create a custom 404 page that matches the site's dark brand design, includes a helpful message in Norwegian, and links back to the homepage.

Purpose: Astro serves 404.astro automatically for any unmatched route. Without it, visitors hitting dead links land on Vercel's generic error page — no nav, no brand, no path forward.
Output: src/pages/404.astro
</objective>

<execution_context>
@/Users/iverostensen/.claude/get-shit-done/workflows/execute-plan.md
@/Users/iverostensen/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/layouts/BaseLayout.astro
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create 404.astro</name>
  <files>src/pages/404.astro</files>
  <action>
    Create `src/pages/404.astro`. Astro automatically serves this file for all unmatched routes.

    Use BaseLayout with title "404 – Side ikke funnet | Nettup" and a short description.

    Content (Norwegian, dark theme, brand consistent):
    - Centered layout, full viewport height minus nav/footer (min-h-[60vh] flex items-center justify-center)
    - Large "404" in brand color (text-brand), roughly text-8xl or text-9xl
    - Heading: "Denne siden finnes ikke"
    - Subtext: "Siden du leter etter er flyttet, slettet eller har aldri eksistert."
    - Two links: primary button to "/" ("Til forsiden") using the same brand button style seen in personvern (bg-brand text-surface rounded-full px-6 py-3), and a secondary text link to "/kontakt" ("Kontakt oss")

    No Framer Motion needed here — static page is appropriate. No FloatingNav import needed (BaseLayout handles it).

    Do NOT add this page to the sitemap. Astro's sitemap integration automatically excludes 404 routes, but double-check that no explicit inclusion exists.
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -5</automated>
  </verify>
  <done>Build passes. Visiting any non-existent route locally (npm run preview, then /does-not-exist) shows the branded 404 page with the homepage link.</done>
</task>

</tasks>

<verification>
- `npm run build` exits 0
- `npm run preview` then visit `/does-not-exist` — branded 404 page renders with nav and footer
- Page title shows "404 – Side ikke funnet | Nettup" in browser tab
</verification>

<success_criteria>
Custom 404 page live with brand styling, Norwegian copy, and a path back to the homepage.
</success_criteria>

<output>
After completion, create `.planning/quick/7-add-custom-404-page/7-SUMMARY.md`
</output>
