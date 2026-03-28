---
phase: 39-campaign-strategy-documentation
plan: "02"
subsystem: campaign-docs
tags: [facebook-ads, video-creative, content-production, faceless-video]
dependency_graph:
  requires: []
  provides: [video-creative-plan]
  affects: [CAMP-02, CAMP-07]
tech_stack:
  added: []
  patterns: [faceless-video-production, weekly-content-cadence, brand-color-overlays]
key_files:
  created:
    - .planning/phases/39-campaign-strategy-documentation/deliverables/video-creative-plan.md
  modified: []
decisions:
  - "9:16 (1080x1920) as primary format for all video -- covers Reels, Stories, and Feed auto-crop"
  - "Week 1 priority: bold text-on-screen in CapCut -- lowest barrier to first ad live"
  - "Weekly cadence structured to stay under 2 hours: 10 min x2 scroll-throughs + 10 min text hook + 30-60 min format 3/4"
metrics:
  duration: 2 minutes
  completed: "2026-03-28"
  tasks_completed: 1
  files_created: 1
  files_modified: 0
---

# Phase 39 Plan 02: Video Creative Plan Summary

**One-liner:** Faceless video creative plan with 5 production formats (CapCut bold text, URLtoVideo scroll-through, before/after split, OBS coding timelapse, developer aesthetic), exact Norwegian overlay scripts, and a weekly cadence producing 4 videos in under 2 hours.

## What Was Built

Created `.planning/phases/39-campaign-strategy-documentation/deliverables/video-creative-plan.md` -- a complete production playbook for 5 Facebook/Instagram video ad formats.

### Deliverable: video-creative-plan.md

**Format 1: Fet tekst pa skjerm (UKE 1 PRIORITET)**
- Tool: CapCut (free)
- Duration: 10-15 seconds, 9:16 (1080x1920)
- Production time: 10-15 minutes
- 3 complete Norwegian scripts with exact price overlay text (0 kr oppstart, 399 kr/mnd, price anchor)
- Funnel stage: Awareness

**Format 2: Nettside-scrolling**
- Tool: URLtoVideo (free) or Screen Studio ($89)
- Duration: 15-30 seconds, 9:16
- Production time: 10 minutes
- 3 URL variations: salg.igive.no (96/100), blomcompany.com (99/100), nettup.no
- Funnel stage: Awareness / Consideration

**Format 3: For/etter split screen**
- Tool: CapCut (free)
- Duration: 10-20 seconds
- Production time: 30-60 minutes
- Wix/Squarespace "before" vs Nettup "after" with PageSpeed comparison
- Funnel stage: Consideration

**Format 4: Koding-timelapse**
- Tool: OBS Studio (free) + CapCut
- Duration: 15-30 seconds, 10-20x speed
- Production time: 30-45 minutes
- VS Code + nettup.no codebase, Norwegian text overlays
- Funnel stage: Consideration / Awareness

**Format 5: Utvikler-estetikk**
- Tool: React + Framer Motion + OBS
- Duration: 10-15 seconds
- Production time: 45-60 min (first time), 15 min (reuse)
- Spring-animation component from existing codebase
- Funnel stage: Awareness

**Weekly cadence (CAMP-07):**
- Monday: 2x scroll-through (20 min total)
- Wednesday: 1x bold text (10 min)
- Friday: 1x before/after or timelapse (30-60 min)
- Total: 60-90 minutes, under 2 hours

## Commits

| Hash | Message |
|------|---------|
| 7d59cc1 | docs(39-02): create faceless video creative plan with 5 formats and weekly cadence |

## Deviations from Plan

None -- plan executed exactly as written. All 5 formats documented with full production specs, Norwegian overlay text, and weekly cadence matching D-06 through D-09.

## Known Stubs

None. All overlay text and scripts use exact values from subscriptionOffer.ts (0 kr oppstart, 399 kr/mnd), verified case study metrics from projects.ts (iGive 96/100, Blom Company 99/100), and brand colors from CLAUDE.md (#020617, #06b6d4, #F8FAFC).

## Self-Check: PASSED

- [x] video-creative-plan.md exists at correct path
- [x] 5 ## Format sections present (grep returns 5)
- [x] "UKE 1 PRIORITET" marks Format 1 as week 1 priority
- [x] All tools referenced: CapCut, URLtoVideo, OBS, Screen Studio, ElevenLabs, Mixkit
- [x] 1080x1920 in all format specs
- [x] 5x "Produksjonssteg" sections (one per format)
- [x] "Ukentlig produksjonsplan" section present
- [x] "Under 2 timer" in weekly cadence
- [x] 399 kr/mnd pricing throughout
- [x] Brand colors #020617 and #06b6d4 present
- [x] salg.igive.no and blomcompany.com as scroll-through URLs
- [x] Zero em dashes (U+2014) in document
- [x] Commit 7d59cc1 exists
