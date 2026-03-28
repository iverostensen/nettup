---
phase: 34
slug: google-ads-campaign-docs
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 34 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual review (documentation phase) |
| **Config file** | N/A |
| **Quick run command** | `ls .planning/phases/34-google-ads-campaign-docs/*.md \| wc -l` (expect 5+) |
| **Full suite command** | Manual: verify all 4 deliverable files exist with complete content |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Verify file exists and has expected sections
- **After every plan wave:** Review all 4 files against requirements
- **Before `/gsd:verify-work`:** All 4 deliverable files present with complete content
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 34-01-01 | 01 | 1 | ADS-01 | manual-only | `test -f .planning/phases/34-google-ads-campaign-docs/keywords.md` | ❌ W0 | ⬜ pending |
| 34-01-02 | 01 | 1 | ADS-02 | manual-only | `test -f .planning/phases/34-google-ads-campaign-docs/ad-copy.md` | ❌ W0 | ⬜ pending |
| 34-01-03 | 01 | 1 | ADS-03 | manual-only | `test -f .planning/phases/34-google-ads-campaign-docs/extensions.md` | ❌ W0 | ⬜ pending |
| 34-01-04 | 01 | 1 | ADS-04 | manual-only | `test -f .planning/phases/34-google-ads-campaign-docs/campaign-structure.md` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework needed for documentation deliverables.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Keyword research with Norwegian terms, volumes, bids | ADS-01 | Content quality review | Verify file has Norwegian search terms, volume estimates, bid suggestions |
| 3-5 ad copy variants, 399 kr/mnd focus | ADS-02 | Ad copy quality, character limits | Count variants, verify no multi-tier mentions, check headline ≤30 chars, description ≤90 chars |
| Ad extensions (sitelinks, callouts) | ADS-03 | Content quality review | Verify sitelinks point to /tjenester subpages, callouts match single offer |
| Campaign structure, budget, negative keywords | ADS-04 | Strategy review | Verify single ad group, budget recommendations present, negative keywords list complete |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
