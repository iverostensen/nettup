# Phase 37: Privacy & Compliance - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 37-privacy-compliance
**Areas discussed:** Privacy page structure, Kill switch documentation

---

## Privacy Page Structure

**Question:** How should Meta Pixel fit into the /personvern page structure?

| Option | Selected |
|--------|----------|
| New section 2.4 (2.4 Meta Pixel alongside 2.3 Google Ads) | ✅ |
| Merged ad-tracking section (rename 2.3 to "Annonsesporing" with sub-sections) | |
| Flat list under section 4 only | |

**Decision:** Add as section 2.4 "Meta Pixel (alle sider)" — mirrors established numbered-section pattern.

---

## Kill Switch Documentation

**Question:** What does "documented kill switch" mean for PRIV-02?

| Option | Selected |
|--------|----------|
| .env.example only | ✅ |
| .env.example + privacy page note | |
| Add explicit PIXEL_ENABLED boolean flag | |

**Decision:** .env.example with comment only. Kill switch already works via `if (pixelId)` guard; no code changes or privacy page mention needed.
