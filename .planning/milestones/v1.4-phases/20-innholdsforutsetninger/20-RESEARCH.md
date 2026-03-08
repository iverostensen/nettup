# Phase 20: Innholdsforutsetninger - Research

**Researched:** 2026-03-07
**Domain:** Screenshot capture, PageSpeed measurement, asset management for Astro build
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Screenshot coverage**
- 2–3 shots per project: one full-viewport hero shot + one feature/content section detail crop
- iGive: recapture fresh from `salg.igive.no` (existing `salg.igive.no.png` will be replaced)
- Blom Company: capture from `blomcompany.com` (not the vercel preview URL)
- No mobile screenshots — desktop only

**Image specifications**
- Dimensions: 1600×900 (16:9) for hero shots; feature detail crops can vary but stay within 1600px wide
- Format: PNG source files (Astro's `<Image>` converts to WebP at build time)
- Naming convention: `[project]-[view].png` — e.g. `igive-hero.png`, `igive-features.png`, `blom-hero.png`, `blom-features.png`
- Location: `src/assets/images/` (flat, alongside existing files)

**Lighthouse measurement**
- Tool: PageSpeed Insights via browser (pagespeed.web.dev)
- Run for both projects: `salg.igive.no` and `blomcompany.com`
- Record all 4 categories: Performance, Accessibility, Best Practices, SEO
- Scores stored inline in VISUAL-CONTENT-PLAN.md (not a separate file)

**VISUAL-CONTENT-PLAN.md structure**
- Full spec per screenshot entry: filename | dimensions | crop guide | section label
- Status column per entry: `[ ]` pending / `[x]` captured
- Inline Lighthouse scores table for both projects
- Lives at `.planning/VISUAL-CONTENT-PLAN.md`

### Claude's Discretion
- Exact crop guide wording (how to describe the viewport capture instructions)
- Whether to include a "notes" column in the screenshot table

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INNHOLD-01 | Visual content plan document exists at `.planning/VISUAL-CONTENT-PLAN.md` listing all required screenshots per project (filename, section, dimensions, crop guide) | VISUAL-CONTENT-PLAN.md structure is locked in decisions; planner creates the document template |
| INNHOLD-02 | iGive Lighthouse/PageSpeed scores measured against `salg.igive.no` and recorded — real numbers, not hardcoded | pagespeed.web.dev is the locked tool; scores go inline in VISUAL-CONTENT-PLAN.md |
| INNHOLD-03 | Blom Company screenshots captured from `blomcompany.com` and committed to `src/assets/images/` per the visual content plan | Astro `<Image>` requires files in `src/assets/` before any import; commit triggers build validation |
</phase_requirements>

## Summary

Phase 20 is a pure asset and documentation phase — no production code changes. The deliverables are a planning document (VISUAL-CONTENT-PLAN.md), verified Lighthouse scores recorded in that document, and PNG screenshot files committed to `src/assets/images/`. Phase 21–23 depend on these artifacts: phase 21 imports the new filenames into `projects.ts`, phase 22 uses the real Lighthouse numbers in the metrics block, and phase 23 links to the committed images via Astro's `<Image>` component.

The existing `salg.igive.no.png` (2.8 MB, raw) is the only image in `src/assets/images/` today. It is imported directly by three files: `projects.ts`, `ProjectTeaser.astro`, and `VisualProof.astro`. The locked decision is to rename it to `igive-hero.png` (cleaner naming). This means all three import statements must be updated atomically, but that rename is the only code change in this phase — updating import paths is not hand-rolled work, it is three one-line edits.

`npm run build` enforces a hard build-time contract: Astro processes every `import` from `src/assets/` at build time and will throw `ENOENT` if the referenced PNG does not exist on disk. This means screenshots for Blom Company must be committed to git before phase 22 creates any `.astro` file that imports them. Phase 20 satisfies this prerequisite.

**Primary recommendation:** Create VISUAL-CONTENT-PLAN.md first (INNHOLD-01), run PageSpeed for both URLs and fill in the scores table (INNHOLD-02), then capture and commit the PNG files in the exact filenames specified in the plan (INNHOLD-03). Wave order matters: the plan document is the source of truth for filenames downstream.

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Browser screenshot tool (macOS) | built-in | Capture 1600×900 viewport | No install required; Cmd+Shift+4 or developer tools device emulation gives exact px dimensions |
| pagespeed.web.dev | web service | Lighthouse measurement | Locked in decisions; official Google tool, reproducible public URL |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| Chrome DevTools device toolbar | built-in | Force exact 1600×900 viewport | Set custom device dimensions before screenshot — avoids manual crop |
| macOS Preview / ImageMagick | system | Verify PNG dimensions post-capture | Confirm 1600×900 before commit |
| `npm run build` | project | Verify no ENOENT after commit | Run after each image commit as acceptance test |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual browser screenshot | Playwright/Puppeteer automated capture | Automation adds setup overhead not justified for a one-time 4-image capture; manual is faster |
| pagespeed.web.dev | `lighthouse` CLI | CLI gives same data; browser tool locked by decisions |

**Installation:** No new dependencies required for this phase.

## Architecture Patterns

### Recommended Project Structure

```
.planning/
└── VISUAL-CONTENT-PLAN.md        ← deliverable (INNHOLD-01)

src/assets/images/
├── igive-hero.png                 ← renamed from salg.igive.no.png (INNHOLD-03)
├── igive-features.png             ← new capture (INNHOLD-03)
├── blom-hero.png                  ← new capture (INNHOLD-03)
└── blom-features.png              ← new capture (INNHOLD-03)
```

### Pattern 1: VISUAL-CONTENT-PLAN.md Structure

**What:** Single source of truth consumed by phases 21–23. The plan document must exist before images are captured so filenames are locked.

**When to use:** Always — create the document before any screenshots.

**Example:**

```markdown
# Visual Content Plan

## Screenshots

| Filename | Project | Section | Dimensions | Crop Guide | Status |
|----------|---------|---------|------------|------------|--------|
| igive-hero.png | iGive | Above-fold hero | 1600×900 | Full viewport at 1600px wide, top of page | [ ] |
| igive-features.png | iGive | Features/benefits section | 1600×900 (or narrower crop) | Scroll to feature grid, capture section | [ ] |
| blom-hero.png | Blom Company | Above-fold hero | 1600×900 | Full viewport at 1600px wide, top of page | [ ] |
| blom-features.png | Blom Company | Product/collection section | 1600×900 (or narrower crop) | Scroll to product section, capture | [ ] |

## Lighthouse Scores

| Project | URL | Performance | Accessibility | Best Practices | SEO | Measured |
|---------|-----|-------------|---------------|----------------|-----|---------|
| iGive | salg.igive.no | — | — | — | — | pending |
| Blom Company | blomcompany.com | — | — | — | — | pending |
```

### Pattern 2: Astro Import Rename

**What:** Three files import `salg.igive.no.png` by path. After rename to `igive-hero.png`, all three must be updated in the same commit to prevent a broken build state mid-phase.

**Files to update:**
- `src/config/projects.ts` line 2: `import iGiveImage from '@/assets/images/salg.igive.no.png';`
- `src/pages/_home/ProjectTeaser.astro` line 3: same import
- `src/pages/nettside-for-bedrift/_sections/VisualProof.astro` line 9: same import

**After rename, each becomes:**
```typescript
import iGiveImage from '@/assets/images/igive-hero.png';
```

The variable name `iGiveImage` stays the same so no other code changes.

### Anti-Patterns to Avoid

- **Committing images before creating the plan:** Filenames won't match what downstream phases expect if the plan is written after capture.
- **Renaming `salg.igive.no.png` without updating all three imports atomically:** Build will fail with ENOENT on the remaining old import paths.
- **Capturing screenshots at wrong dimensions:** Astro `<Image>` accepts any source size, but downstream phases are designed for 16:9 hero shots. A 1920-wide capture will work but wastes bytes; a 1280-wide capture may appear blurry at 1600 render width.
- **Storing scores only in memory:** If Lighthouse scores are measured but not written to VISUAL-CONTENT-PLAN.md before the session ends, phase 22 cannot use real numbers.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lighthouse measurement | Custom curl/fetch scripts | pagespeed.web.dev (locked) | Official tool with reproducible output; handles throttling correctly |
| Image optimization | Manual convert/compress pipeline | Astro `<Image>` (already in stack) | Astro handles WebP conversion, resizing, quality at build time |
| Screenshot dimensions | Post-capture cropping scripts | Chrome DevTools device emulation | Set 1600×900 in device toolbar before capture; no post-processing needed |

**Key insight:** This phase produces raw assets only. Astro's build pipeline handles everything downstream — resizing, format conversion, hashing. The only job here is getting correctly-named PNG files on disk.

## Common Pitfalls

### Pitfall 1: ENOENT on Missing Blom Images in Later Phases

**What goes wrong:** Phase 22 creates an Astro component that imports `blom-hero.png`. If the file isn't committed yet, `npm run build` fails with `ENOENT: no such file or directory`.

**Why it happens:** Astro processes all `import` statements from `src/assets/` at build time, not lazily at runtime. A missing file is a hard build error.

**How to avoid:** Commit all four PNG files in phase 20. `npm run build` must pass before phase 20 is marked complete.

**Warning signs:** Any phase 22 or 23 task that writes `import blomHero from '@/assets/images/blom-hero.png'` will fail until this phase's images are on disk.

### Pitfall 2: Partial Rename Breaks Build

**What goes wrong:** `salg.igive.no.png` is renamed and the `projects.ts` import is updated, but `ProjectTeaser.astro` and `VisualProof.astro` still reference the old filename. Build fails.

**Why it happens:** There are three separate import sites for the same image. A search-by-filename grep is needed to catch all three.

**How to avoid:** Before committing the rename, run `grep -r "salg.igive.no.png" src/` to verify zero remaining references.

**Warning signs:** `npm run build` throws ENOENT for `salg.igive.no.png` after rename.

### Pitfall 3: Hardcoded Scores Not Replaced

**What goes wrong:** `Results.astro` and `VisualProof.astro` show hardcoded `95` and `100` scores. If phase 22 copies these values instead of using numbers from VISUAL-CONTENT-PLAN.md, the case study shows incorrect data.

**Why it happens:** The hardcoded values look valid and are easy to carry forward without noticing they haven't been re-measured.

**How to avoid:** Record real scores in VISUAL-CONTENT-PLAN.md during phase 20. Phase 22 must source numbers from the plan document only.

**Warning signs:** Scores in VISUAL-CONTENT-PLAN.md differ from values in `Results.astro` — this discrepancy is expected and intentional.

### Pitfall 4: blomcompany.com Not Yet Live

**What goes wrong:** The decision locks capture to `blomcompany.com`, but STATE.md notes a concern: "if live domain goes up before publish, update url field." The domain may or may not be live at capture time.

**Why it happens:** The project is in staging (`blom-no.vercel.app`). Domain may be parked or unreachable.

**How to avoid:** Before starting screenshot capture, verify `blomcompany.com` loads. If it doesn't resolve, capture from `blom-no.vercel.app` (the staging fallback noted in STATE.md) and note the URL used in VISUAL-CONTENT-PLAN.md.

**Warning signs:** Browser shows ERR_NAME_NOT_RESOLVED or a domain parking page for `blomcompany.com`.

## Code Examples

### Grep to verify no old filename references remain

```bash
# Run after renaming salg.igive.no.png to igive-hero.png
grep -r "salg\.igive\.no\.png" /Users/iverostensen/nettup/src/
# Expected output: (none)
```

### Build validation command

```bash
cd /Users/iverostensen/nettup && npm run build
# Expected: "Done in X.Xs" with no ENOENT errors
```

### Verify image dimensions (macOS)

```bash
# Using sips (built-in macOS tool)
sips -g pixelWidth -g pixelHeight /Users/iverostensen/nettup/src/assets/images/igive-hero.png
# Expected: pixelWidth: 1600, pixelHeight: 900
```

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Hardcoded `salg.igive.no.png` with dots in filename | Renamed `igive-hero.png` (clean kebab-case) | Consistent with Astro asset naming convention; avoids potential issues with dots in import paths |
| Scores hardcoded in `Results.astro` as `95`/`100` | Real measured scores in VISUAL-CONTENT-PLAN.md | Phase 22 uses accurate numbers; no fabricated data on live site |

## Open Questions

1. **Is `blomcompany.com` resolvable today?**
   - What we know: STATE.md flags "Blom Company staging URL (`blom-no.vercel.app`) is the source for screenshots"
   - What's unclear: Whether the live domain is active as of 2026-03-07
   - Recommendation: Planner task should instruct: try `blomcompany.com` first; fall back to `blom-no.vercel.app` if unresolvable; record which URL was used in VISUAL-CONTENT-PLAN.md

2. **Should the rename of `salg.igive.no.png` be a separate commit from image additions?**
   - What we know: Three files import the old filename; both old and new files cannot coexist (the old file will be deleted)
   - What's unclear: Whether a single atomic commit or two sequential commits is safer
   - Recommendation: Single atomic commit — rename the file, update all three imports, run `npm run build`, commit everything together. Avoids a build-broken intermediate state.

## Sources

### Primary (HIGH confidence)
- Direct code inspection: `src/config/projects.ts`, `src/pages/_home/ProjectTeaser.astro`, `src/pages/nettside-for-bedrift/_sections/VisualProof.astro` — confirmed three import sites for `salg.igive.no.png`
- Direct code inspection: `src/pages/prosjekter/_sections/Results.astro` — confirmed hardcoded scores 95, <1s, 100
- Direct file inspection: `src/assets/images/` — confirmed only one file exists (2.8 MB PNG)
- `.planning/phases/20-innholdsforutsetninger/20-CONTEXT.md` — all locked decisions sourced from here

### Secondary (MEDIUM confidence)
- Astro documentation (training knowledge, verified against project behavior): `<Image>` imports from `src/assets/` are processed at build time; missing files cause ENOENT at build
- pagespeed.web.dev — official Google PageSpeed Insights tool (publicly known, confirmed in CONTEXT.md decisions)

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all tools are locked by decisions or already in project
- Architecture: HIGH — based on direct inspection of three import sites and existing file structure
- Pitfalls: HIGH — ENOENT and partial rename risks verified by reading actual build-time behavior and existing import paths

**Research date:** 2026-03-07
**Valid until:** 2026-04-07 (stable domain — only concern is blomcompany.com DNS status)
