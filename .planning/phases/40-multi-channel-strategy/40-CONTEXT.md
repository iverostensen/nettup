# Phase 40: Multi-Channel Strategy - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Pure documentation phase — produce one multi-channel strategy document covering:

- **STRAT-01:** 3-phase rollout plan: Facebook months 1-3 (primary, 70% budget), Google Ads long-tail months 2-4 (secondary, 20% budget), TikTok/expansion months 4+ (test, 10% budget)
- **STRAT-02:** Budget document with starting spend, campaign-level splits, expected CPL ranges, and break-even math

No code changes. Output is one markdown file.

</domain>

<decisions>
## Implementation Decisions

### Document Structure
- **D-01:** Single multi-section file: `multi-channel-strategy.md` with H2 chapters — Fase 1 Facebook, Fase 2 Google Ads, Fase 3 TikTok, Budsjettfordeling, KPI-mål, Skaleringsregler
- **D-02:** Phase 39 used separate files per concern because each was consumed independently. Phase 40 is a strategic narrative where budget, KPIs, and scaling rules are causally linked — consolidation is correct here.

### KPI Depth
- **D-03:** Progressive KPI approach across phases:
  - Month 1: CPL only (immediately measurable, no LTV assumptions needed)
  - Month 2+: CPL + ROAS + engagement (CTR, CPM, link clicks) — existing tools, no new tooling
  - Month 4+ threshold: Full CAC/LTV stack deferred until 10+ converted paid clients with data
- **D-04:** ROAS in month 2 can use estimated LTV: 399 kr/mnd × estimated retention months (even rough estimate is useful)

### Budget Scaling Logic
- **D-05:** Hybrid approach: monthly baseline floor + CPL trigger-based scale/kill mechanism
  - Monthly baseline sets planned spend floor (predictable cash flow)
  - CPL thresholds are the actual scaling and kill mechanism:
    - CPL < 500 NOK → scale +20% every 3 days (from Phase 39 D-18)
    - CPL > 950 NOK → pause campaign (from Phase 39 D-17)
    - Frequency > 3 or CTR < 0.5% → rotate creative (from Phase 39 D-17)
  - The +20% rule applies only when CPL is below 500 NOK — not on a calendar schedule

### Claude's Discretion
- Exact Norwegian section headings and running prose in the strategy document
- Specific estimated CPL ranges per channel phase (within the 300-950 NOK envelope from roadmap)
- Break-even math presentation format (table vs paragraph)
- Whether to include a weekly review checklist within the scaling section

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/ROADMAP.md` §Phase 40 — Success criteria SC-1 and SC-2 with exact numbers (budget splits, CPL ranges, break-even math)

### Prior Phase Context
- `.planning/phases/39-campaign-strategy-documentation/39-CONTEXT.md` — Kill criteria (D-17) and scaling rules (D-18) that carry into Phase 40
- `.planning/phases/39-campaign-strategy-documentation/deliverables/testing-plan.md` — A/B test matrix, kill criteria, scaling rules (canonical source for Phase 40 scaling section)
- `.planning/phases/39-campaign-strategy-documentation/deliverables/audience-targeting.md` — Audience layers referenced in channel strategy

### Project Context
- `.planning/PROJECT.md` — Full project context including ad research, CPC data, competitor analysis

### No external specs
All strategy content is defined in ROADMAP.md success criteria and prior phase deliverables.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No code assets — this is a documentation-only phase

### Established Patterns
- Phase 39 deliverables in `.planning/phases/39-campaign-strategy-documentation/deliverables/` used flat markdown with clear H2 sections — same pattern applies here
- Norwegian language throughout (bokmål), no em dashes, peer-to-peer direct tone

### Integration Points
- Output goes to `.planning/phases/40-multi-channel-strategy/deliverables/multi-channel-strategy.md`
- No code files created or modified

</code_context>

<specifics>
## Specific Ideas

- The hybrid scaling logic should be action-oriented: concrete if/then rules rather than principles
- KPI progression should be surfaced as a table (Month 1 / Month 2-3 / Month 4+) for at-a-glance clarity
- Break-even math from SC-2: 1 client/month = profitable at 399 kr/mnd subscription offer

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 40-multi-channel-strategy*
*Context gathered: 2026-03-28*
