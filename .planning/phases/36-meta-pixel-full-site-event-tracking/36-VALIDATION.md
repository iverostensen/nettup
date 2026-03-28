---
phase: 36
slug: meta-pixel-full-site-event-tracking
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-28
---

# Phase 36 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (already configured) |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` (verifies no Astro build errors)
- **After every plan wave:** Run `npm run build && npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green + manual verification with Meta Pixel Helper
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 36-01-01 | 01 | 1 | TRACK-01 | manual | Meta Pixel Helper: check revoke before init | N/A | ⬜ pending |
| 36-01-02 | 01 | 1 | TRACK-02 | manual | Check localStorage + Events Manager | N/A | ⬜ pending |
| 36-01-03 | 01 | 1 | TRACK-03 | manual | Visual inspection of banner buttons | N/A | ⬜ pending |
| 36-01-04 | 01 | 1 | TRACK-07 | manual | Visit any BaseLayout page, check Pixel Helper | N/A | ⬜ pending |
| 36-02-01 | 02 | 2 | TRACK-04 | manual | Meta Pixel Helper on each service page | N/A | ⬜ pending |
| 36-02-02 | 02 | 2 | TRACK-05 | manual | Navigate to /takk, check Pixel Helper + gtag | N/A | ⬜ pending |
| 36-03-01 | 03 | 1 | TRACK-06 | unit | `npx vitest run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/__tests__/utm.test.ts` — update/expand tests for TRACK-06 (UTM expansion from 3 to 5 params)

*Existing test infrastructure covers UTM module. All other phase requirements are browser-runtime behavior verified via Meta Pixel Helper extension.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Pixel loads with consent revoke before init | TRACK-01 | Browser-runtime SDK behavior, no server-side testable output | Install Meta Pixel Helper extension, load /nettside-for-bedrift, verify "consent revoke" appears before "init" in helper log |
| Accept triggers both gtag + fbq consent | TRACK-02 | Requires browser localStorage + two external SDKs | Clear localStorage, load page, click accept, verify Events Manager shows granted status and gtag fires |
| Banner buttons equal prominence | TRACK-03 | Visual CSS verification | Inspect consent banner, verify both accept and decline have solid background styling |
| ViewContent fires on landing page | TRACK-04 | Browser-runtime Meta Pixel event | Load /nettside-for-bedrift with consent granted, check Pixel Helper for ViewContent event |
| Lead fires on /takk | TRACK-05 | Browser-runtime Meta Pixel event | Navigate to /nettside-for-bedrift/takk with consent granted, check Pixel Helper for Lead event alongside gtag conversion |
| Pixel in BaseLayout (site-wide) | TRACK-07 | Browser-runtime SDK presence check | Visit any BaseLayout page (e.g., /om-oss), check Pixel Helper shows pixel loaded |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
