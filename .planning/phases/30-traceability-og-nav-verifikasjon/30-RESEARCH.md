# Phase 30: Traceability Backfill + Phase 28 Human Verification - Research

**Researched:** 2026-03-13
**Domain:** Documentation maintenance — REQUIREMENTS.md traceability table edits + YAML frontmatter update in a verification report
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Human verification execution**
- Run all 4 Phase 28 runtime tests before planning proceeds (user does this now, with dev server running locally via `npm run dev`)
- Tests: (1) SPA navigation — no flash, (2) scroll hide/show, (3) entrance animation once per session, (4) mobile hamburger custom event
- All 4 tests must be confirmed — no partial sign-off
- User handles dev server startup themselves; plan says "with dev server running, test..."

**Failure handling**
- If any test fails: fix immediately within Phase 30 (targeted fix + light cleanup if cleanup is clearly related)
- After fix, re-run the failing test to confirm
- Only upgrade 28-VERIFICATION.md to `passed` once all 4 tests confirm

**ANAL traceability (ANAL-01/02/03)**
- Remove the "/ Phase 30" reference from all three ANAL rows — Phase 27's verification fully covers them
- Leave Phase 27 as the sole phase reference
- Status stays Complete

**NAV traceability (NAV-01/02/03)**
- Update status from `Pending` → `Complete` once human verification passes
- No additional detail needed in the row — simple status flip

### Claude's Discretion

- Exact wording in any targeted bug fix
- Minor cleanup scope if a fix reveals related dead code

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANAL-01 | Plausible Analytics CDN script present in `BaseLayout.astro` and `LandingPageLayout.astro` — cookieless, GDPR-compliant | REQUIREMENTS.md traceability row exists; needs "/ Phase 30" stripped from Phase column, leaving "Phase 27" only |
| ANAL-02 | Conversion events wired in React islands (contact form, B2B form, chatbot, wizard) | Same row edit as ANAL-01 — Phase 27 is sole authoritative phase reference |
| ANAL-03 | City CTA click fires `City CTA Clicked` Plausible event with `city` prop | Same row edit as ANAL-01 — Phase 27 is sole authoritative phase reference |
| NAV-01 | FloatingNav server-rendered from first byte — no React hydration gap | Status column flip: `Pending` → `Complete`; gated on human verification pass of test #1 and #7 in 28-VERIFICATION.md |
| NAV-02 | FloatingNav persists as live DOM node across SPA navigations via `transition:persist` | Status column flip: `Pending` → `Complete`; gated on human verification pass of test #1 in 28-VERIFICATION.md |
| NAV-03 | No `visibility:hidden` body hack — root cause eliminated | Status column flip: `Pending` → `Complete`; gated on human verification pass (all 4 tests) in 28-VERIFICATION.md |
</phase_requirements>

---

## Summary

Phase 30 is entirely a documentation and human-verification phase. There is no new feature code to write. The two deliverables are: (1) edit three rows in `.planning/REQUIREMENTS.md` to clean up stale "/ Phase 30" references in the ANAL rows and flip the NAV rows from `Pending` to `Complete`; (2) update `.planning/phases/28-floatingnav-rewrite/28-VERIFICATION.md` frontmatter from `status: human_needed` to `status: passed` and add a human sign-off section to the body.

The human verification step must happen before any document edits are made. The user runs `npm run dev` locally and performs four browser-observable tests documented in the existing `28-VERIFICATION.md`. Only after all four pass does the plan proceed to document updates. If any test fails, a targeted code fix is applied within this phase before re-testing.

All structural preconditions for the four runtime behaviors were confirmed during Phase 28 automated verification (score 6/7 must-haves, with the remaining items explicitly flagged as human-only). The risk of test failure is low but non-zero; the plan must include a conditional fix branch.

**Primary recommendation:** Plan one task sequence: (1) human verification gate, (2) REQUIREMENTS.md edits, (3) 28-VERIFICATION.md frontmatter and body update. Keep fix handling as a conditional within task 1.

---

## Standard Stack

No libraries, frameworks, or npm packages are involved. The entire phase operates on markdown and YAML files.

### Core Tools

| Tool | Purpose |
|------|---------|
| Text editor / Edit tool | In-place edits to two markdown files |
| `npm run dev` | User-managed dev server for runtime testing |
| Browser DevTools | Session Storage clear for entrance animation test |

### No Installation Required

No packages to install. No build changes. No config changes.

---

## Architecture Patterns

### File Map

```
.planning/
├── REQUIREMENTS.md                                  # Edit: 3 ANAL rows + 3 NAV rows
└── phases/
    └── 28-floatingnav-rewrite/
        └── 28-VERIFICATION.md                       # Edit: frontmatter status field + body sign-off section
```

### Pattern: Traceability Table Row Edit

The REQUIREMENTS.md traceability table is a standard markdown table with three columns: `Requirement`, `Phase`, `Status`.

Current ANAL rows (lines 95-97):
```markdown
| ANAL-01 | Phase 27 / Phase 30 | Complete |
| ANAL-02 | Phase 27 / Phase 30 | Complete |
| ANAL-03 | Phase 27 / Phase 30 | Complete |
```

Target ANAL rows (strip "/ Phase 30"):
```markdown
| ANAL-01 | Phase 27 | Complete |
| ANAL-02 | Phase 27 | Complete |
| ANAL-03 | Phase 27 | Complete |
```

Current NAV rows (lines 98-100):
```markdown
| NAV-01 | Phase 28 / Phase 30 | Pending |
| NAV-02 | Phase 28 / Phase 30 | Pending |
| NAV-03 | Phase 28 / Phase 30 | Pending |
```

Target NAV rows (strip "/ Phase 30", flip status):
```markdown
| NAV-01 | Phase 28 | Complete |
| NAV-02 | Phase 28 | Complete |
| NAV-03 | Phase 28 | Complete |
```

Also update the coverage note at the bottom of the traceability section — the checkbox items for NAV-01/02/03 in the `v1 Requirements` list at the top of the file (lines 41-43) are unchecked `- [ ]`. These should be flipped to `- [x]` once verification passes.

### Pattern: Verification Report Frontmatter Update

The `28-VERIFICATION.md` starts with a YAML frontmatter block. Current:
```yaml
---
phase: 28-floatingnav-rewrite
verified: 2026-03-08T18:55:00Z
status: human_needed
score: 6/7 must-haves verified
human_verification:
  - test: "..."
    ...
---
```

Target: update `status` field and `score`. Also add a new body section after "Gaps Summary" documenting the human sign-off.

### Pattern: Conditional Fix Branch

If a runtime test fails, the fix must be localized:

- **Flash visible (test 1 or 7):** Check `transition:persist` attribute is present in built output; verify `data-astro-transition-persist` id consistency; check `BaseLayout.astro` imports
- **Scroll behavior broken (test 2):** Check `initScrollBehavior()` call in `FloatingNav.astro` inline script; verify `nav-hidden` CSS class is present in `global.css`
- **Entrance animation replays (test 3):** Check `sessionStorage` key name consistency; verify `animationend` listener removes `.nav-entrance` class
- **Mobile menu unresponsive (test 4):** Check `dispatchEvent(new CustomEvent('open-mobile-menu'))` in hamburger handler; check `MobileMenu.tsx` `useEffect` listener registration

After any fix: `npm run build` must pass cleanly before marking the test resolved.

### Anti-Patterns to Avoid

- **Editing NAV rows before all 4 tests pass:** Partial sign-off is explicitly locked out by user decision. Do not flip NAV status until all 4 tests confirm.
- **Duplicating test steps:** The plan should reference `28-VERIFICATION.md` human verification section directly rather than re-listing the 4 tests. The existing document is the source of truth.
- **Updating the coverage count incorrectly:** After flipping 6 `Pending` → `Complete` entries, verify the "Coverage" block at the bottom of `REQUIREMENTS.md` still reads correctly. The count of 19 total v1 requirements does not change.

---

## Don't Hand-Roll

This phase has no algorithmic complexity. No custom tooling needed.

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Finding exact line numbers to edit | grep/search | Edit tool with exact string match |
| Verifying build after fix | Custom script | `npm run build` — already configured |

---

## Common Pitfalls

### Pitfall 1: Editing NAV checkbox items but not the traceability table (or vice versa)

**What goes wrong:** The v1 Requirements list at the top of REQUIREMENTS.md has `- [ ] NAV-01/02/03` checkboxes AND the traceability table at the bottom has `Pending` status rows. Both must be updated — forgetting one leaves the file inconsistent.
**How to avoid:** Plan explicitly lists both edits as sub-steps within the same task.

### Pitfall 2: Stripping "/ Phase 30" from ANAL rows but not also checking the NAV rows for the same pattern

**What goes wrong:** The current REQUIREMENTS.md has `Phase 28 / Phase 30` in NAV rows (lines 98-100). The Phase column edit for NAV rows is not just a status flip — it also strips "/ Phase 30" from the Phase column.
**How to avoid:** Both column values (Phase and Status) change in the NAV rows.

### Pitfall 3: Marking 28-VERIFICATION.md as `passed` before the human runs the tests

**What goes wrong:** Frontmatter says `passed` but no human ran the tests — creates false audit trail.
**How to avoid:** Plan structure enforces human verification as a gate task (Wave 1) that must complete before document update tasks (Wave 2).

### Pitfall 4: Missing the score update in 28-VERIFICATION.md frontmatter

**What goes wrong:** `score: 6/7 must-haves verified` remains stale after human verification completes all 7.
**How to avoid:** Include score update (`7/7`) as part of the frontmatter edit task alongside status flip.

---

## Code Examples

### Current state of REQUIREMENTS.md traceability rows (verified by reading file)

```markdown
| SEO-03 | Phase 29 | Complete |
| ANAL-01 | Phase 27 / Phase 30 | Complete |
| ANAL-02 | Phase 27 / Phase 30 | Complete |
| ANAL-03 | Phase 27 / Phase 30 | Complete |
| NAV-01 | Phase 28 / Phase 30 | Pending |
| NAV-02 | Phase 28 / Phase 30 | Pending |
| NAV-03 | Phase 28 / Phase 30 | Pending |
```

Source: `.planning/REQUIREMENTS.md` lines 94-100 (read 2026-03-13)

### Target state after Phase 30 edits

```markdown
| SEO-03 | Phase 29 | Complete |
| ANAL-01 | Phase 27 | Complete |
| ANAL-02 | Phase 27 | Complete |
| ANAL-03 | Phase 27 | Complete |
| NAV-01 | Phase 28 | Complete |
| NAV-02 | Phase 28 | Complete |
| NAV-03 | Phase 28 | Complete |
```

### Current NAV checkbox state in v1 Requirements section

```markdown
- [ ] **NAV-01**: FloatingNav is server-rendered from first byte ...
- [ ] **NAV-02**: FloatingNav persists as a live DOM node across SPA navigations ...
- [ ] **NAV-03**: No `visibility:hidden` body hack ...
```

Source: `.planning/REQUIREMENTS.md` lines 41-43

### Target state

```markdown
- [x] **NAV-01**: FloatingNav is server-rendered from first byte ...
- [x] **NAV-02**: FloatingNav persists as a live DOM node across SPA navigations ...
- [x] **NAV-03**: No `visibility:hidden` body hack ...
```

### 28-VERIFICATION.md frontmatter target

```yaml
---
phase: 28-floatingnav-rewrite
verified: 2026-03-08T18:55:00Z
status: passed
score: 7/7 must-haves verified
human_verified: 2026-03-13
---
```

---

## State of the Art

| Old State | New State | When | Impact |
|-----------|-----------|------|--------|
| ANAL-01/02/03 Phase column: `Phase 27 / Phase 30` | `Phase 27` | Phase 30 edit | Single authoritative phase reference |
| NAV-01/02/03 Status: `Pending` | `Complete` | Phase 30 edit (after human verification) | All v1 requirements marked complete |
| NAV-01/02/03 checkboxes: `- [ ]` | `- [x]` | Phase 30 edit | Requirements list consistent with traceability table |
| 28-VERIFICATION.md `status: human_needed` | `status: passed` | Phase 30 edit | Phase 28 fully closed |
| 28-VERIFICATION.md `score: 6/7` | `score: 7/7` | Phase 30 edit | Accurate verification record |

---

## Open Questions

1. **Whether FloatingNav.tsx dead code still exists**
   - What we know: Phase 29-01 deleted `FloatingNav.tsx` (confirmed in STATE.md decisions and commit `bbb982e`)
   - What's unclear: 28-VERIFICATION.md still mentions it as "Info" level anti-pattern — the report predates Phase 29 cleanup
   - Recommendation: When updating 28-VERIFICATION.md, add a note that `FloatingNav.tsx` was removed in Phase 29 (commit bbb982e) — this closes the open cleanup item in the report cleanly. No code action needed.

2. **Whether any of the 4 runtime tests will fail**
   - What we know: All structural preconditions are confirmed (Phase 28 score 6/7; remaining 4 items are inherently runtime-only)
   - What's unclear: Runtime behavior cannot be pre-confirmed
   - Recommendation: Plan includes conditional fix branch in Wave 1 task. If tests pass (most likely outcome), Wave 2 proceeds immediately. If a fix is needed, it should be targeted and narrow.

---

## Sources

### Primary (HIGH confidence)

- `.planning/REQUIREMENTS.md` — read directly, exact line content confirmed for rows 41-43 and 94-100
- `.planning/phases/28-floatingnav-rewrite/28-VERIFICATION.md` — read directly, frontmatter and all 7 truth rows confirmed
- `.planning/phases/30-traceability-og-nav-verifikasjon/30-CONTEXT.md` — user decisions read directly
- `.planning/STATE.md` — confirmed `FloatingNav.tsx` deleted in Phase 29

### Secondary (MEDIUM confidence)

- None required — phase is purely documentary, no external ecosystem research needed

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no external libraries; pure markdown/YAML editing
- Architecture patterns: HIGH — file locations and exact content verified by reading source files directly
- Pitfalls: HIGH — derived from direct inspection of current file state, not inference

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (static documents, no external dependencies)
