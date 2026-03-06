# Requirements: Nettup.no

**Defined:** 2026-03-06
**Core Value:** En potensiell kunde som lander på siden skal umiddelbart forstå at Nettup leverer moderne nettsider raskt — og at kvaliteten beviser det.

## v1.3 Requirements

Requirements for milestone v1.3 — Automatisk Blogg.

### Blog Infrastructure (INFRA)

- [ ] **INFRA-01**: Visitor can browse all published articles at `/blogg` with title, category, date, and read time
- [ ] **INFRA-02**: Visitor can read a full article at `/blogg/[slug]` with formatted markdown content
- [ ] **INFRA-03**: Article pages include Article JSON-LD and FAQPage JSON-LD structured data
- [ ] **INFRA-04**: Article pages include BreadcrumbList JSON-LD
- [ ] **INFRA-05**: Article pages display 2–3 related articles based on frontmatter `relatedSlugs`
- [ ] **INFRA-06**: Blog is reachable from the main site footer and via homepage section (once articles exist)
- [ ] **INFRA-07**: Article `<title>` uses keyword-first `seoTitle` field; article `<h1>` uses conversational `title` field

### Generation Pipeline (PIPE)

- [ ] **PIPE-01**: Pipeline selects a topic from configured clusters, skipping slugs that already exist
- [ ] **PIPE-02**: Pipeline generates a 1500–2500 word Norwegian article using Claude Sonnet 4.6
- [ ] **PIPE-03**: Every generated article includes a "Vanlige spørsmål" section with 3–5 Q&A pairs
- [ ] **PIPE-04**: Generated articles include natural internal links to Nettup service pages and existing articles
- [ ] **PIPE-05**: AI review pass scores article ≥ 7/10 average across 6 editorial criteria before publishing
- [ ] **PIPE-06**: Automated checks verify word count ≥ 1500, LIX ≤ 55, FAQ present, Nettup mentions ≤ 2
- [ ] **PIPE-07**: Failed topic attempts are persisted to `topics-queue.json` and retried on next run before generating new
- [ ] **PIPE-08**: Pipeline creates a GitHub PR with quality scores in the PR body — never commits directly to `main`
- [ ] **PIPE-09**: Topic clusters are configurable via `scripts/blog/config.ts` (editorial direction controlled by Nettup)

### GitHub Actions + Repo Config (CI)

- [ ] **CI-01**: Blog article is generated automatically every Monday at 08:00 UTC without manual intervention
- [ ] **CI-02**: Workflow can be triggered manually via `workflow_dispatch`
- [ ] **CI-03**: Quality gate rejection exits with code 0 and writes a job summary explaining the rejection (no CI failure email)
- [ ] **CI-04**: PR auto-merges when CI passes, using a PAT with `contents: write` + `pull-requests: write` permissions

## v2 Requirements

### Hub/Cluster Pages

- **HUB-01**: Visitor can browse all articles in a topic cluster at `/blogg/kategori/[cluster]`
- **HUB-02**: Article pages link back to their cluster hub page
- **HUB-03**: Cluster hub pages include category-level structured data

*Prerequisite: ≥ 3 articles per cluster before hub pages are non-empty.*

## Out of Scope

| Feature | Reason |
|---------|--------|
| Manual editorial workflow / CMS | Pipeline is fully automated — no human editing step by design |
| Images in articles | Text-only in v1.3 — adds complexity without clear ROI at launch |
| Dynamic per-article OG images | Using site-wide og-image.jpg; build-time image generation deferred |
| Manuell blogg | For mye vedlikehold; erstattet av automatisert pipeline |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 17 | Pending |
| INFRA-02 | Phase 17 | Pending |
| INFRA-03 | Phase 17 | Pending |
| INFRA-04 | Phase 17 | Pending |
| INFRA-05 | Phase 17 | Pending |
| INFRA-06 | Phase 17 | Pending |
| INFRA-07 | Phase 17 | Pending |
| PIPE-01 | Phase 18 | Pending |
| PIPE-02 | Phase 18 | Pending |
| PIPE-03 | Phase 18 | Pending |
| PIPE-04 | Phase 18 | Pending |
| PIPE-05 | Phase 18 | Pending |
| PIPE-06 | Phase 18 | Pending |
| PIPE-07 | Phase 18 | Pending |
| PIPE-08 | Phase 18 | Pending |
| PIPE-09 | Phase 18 | Pending |
| CI-01 | Phase 19 | Pending |
| CI-02 | Phase 19 | Pending |
| CI-03 | Phase 19 | Pending |
| CI-04 | Phase 19 | Pending |

**Coverage:**
- v1.3 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-06*
*Last updated: 2026-03-06 after roadmap creation*
