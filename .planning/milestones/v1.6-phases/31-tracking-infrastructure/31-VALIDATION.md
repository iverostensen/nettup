---
phase: 31
slug: tracking-infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 31 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | exists in project |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green + manual browser verification
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 31-01-01 | 01 | 1 | TRACK-01 | manual | `npm run build && grep "noindex" dist/nettside-for-bedrift/index.html` | N/A | ⬜ pending |
| 31-01-02 | 01 | 1 | TRACK-01 | manual | N/A -- browser DevTools: verify gtag consent default fires before gtag.js | N/A | ⬜ pending |
| 31-01-03 | 01 | 1 | TRACK-01 | manual | N/A -- browser: verify all 4 consent params in gtag consent config | N/A | ⬜ pending |
| 31-01-04 | 01 | 1 | TRACK-04 | build | `npm run build && grep -l "noindex" dist/nettside-for-bedrift/index.html` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test files needed -- verification is manual (browser DevTools for gtag consent state) plus build output checks for noindex meta.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| gtag consent default fires before gtag.js loads | TRACK-01 | Requires browser execution context with gtag | Open /nettside-for-bedrift in Chrome DevTools, Network tab, verify gtag.js loads AND consent default is set before any data collection |
| All 4 consent params present in default + update | TRACK-01 | Inline script inspection | Read LandingPageLayout.astro inline script, verify ad_storage, analytics_storage, ad_user_data, ad_personalization in both default and update calls |
| Consent update fires on accept | TRACK-01 | Requires browser interaction | Click "Godta" on consent banner, verify in Console that gtag('consent', 'update', {...}) fires with all 4 params set to 'granted' |
| window.gtagLoaded and window.gtag available | TRACK-01 | Browser globals | Open DevTools Console on /nettside-for-bedrift, verify window.gtagLoaded === true and typeof window.gtag === 'function' |
| noindex meta tag present | TRACK-04 | Build output check | Run `npm run build`, inspect `dist/nettside-for-bedrift/index.html` for `<meta name="robots" content="noindex">` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
