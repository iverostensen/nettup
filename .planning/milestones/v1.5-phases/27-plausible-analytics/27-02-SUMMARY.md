---
phase: 27-plausible-analytics
plan: "02"
subsystem: analytics
tags: [plausible, events, contact-form, chatbot, wizard, react-islands]
dependency_graph:
  requires: [27-01]
  provides: [ANAL-02]
  affects: [ContactForm, ChatWidget, ResultStep]
tech_stack:
  added: []
  patterns:
    - Analytics event calls injected at conversion callsites in React islands
    - Context prop pattern for discriminating form origin (contact vs b2b)
    - Functional setState guard for one-direction event firing
key_files:
  modified:
    - src/pages/kontakt/_sections/ContactForm.tsx
    - src/pages/nettside-for-bedrift/_sections/FormSection.astro
    - src/components/islands/ChatWidget.tsx
    - src/components/islands/wizard/steps/ResultStep.tsx
decisions:
  - ContactForm uses a context prop ('contact' | 'b2b') with default 'contact' to discriminate between form origins without duplicating the component
  - handleBubbleClick uses setIsOpen functional update to guard trackChatbotOpened — fires only when prev === false (opening), never on close
  - trackWizardEstimateShown fires in useEffect with empty dep array (once on mount) — no StrictMode guard needed as production build does not double-invoke effects
metrics:
  duration: "~2 min"
  completed: "2026-03-08"
  tasks_completed: 3
  files_modified: 4
---

# Phase 27 Plan 02: Conversion Event Wiring Summary

**One-liner:** Wired 6 Plausible conversion events across ContactForm (B2B discrimination), ChatWidget (open + suggestion), and ResultStep (estimate shown + CTA click).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add context prop to ContactForm + wire submit events + update FormSection.astro | 1a2bfca | ContactForm.tsx, FormSection.astro |
| 2 | Wire Chatbot Opened + Chatbot Suggestion Clicked in ChatWidget.tsx | 6edb64b | ChatWidget.tsx |
| 3 | Wire Wizard Estimate Shown + Wizard CTA Clicked in ResultStep.tsx | ddcc335 | ResultStep.tsx |

## What Was Built

### Task 1: Contact Form Submit Events

Added `context?: 'contact' | 'b2b'` prop to `ContactForm`. In the `handleSubmit` success branch, after the existing gtag call, fires `trackB2BFormSubmit()` when context is `'b2b'`, otherwise `trackContactFormSubmit()`. `FormSection.astro` now passes `context="b2b"` to the component. The default `/kontakt` usage requires no change.

### Task 2: Chatbot Events

Imported `trackChatbotOpened` and `trackChatbotSuggestionClicked`. Updated `handleBubbleClick` to use a functional `setIsOpen` updater — `trackChatbotOpened()` fires only when `prev === false` (transition to open). AI suggestion chip `onClick` now calls `trackChatbotSuggestionClicked(s)` before `sendMessage(s)`. Static `QUICK_REPLIES` chips are intentionally not tracked.

### Task 3: Wizard Events

Added `useEffect` import alongside existing `useState`. After `estimate` is computed, a `useEffect` with empty deps fires `trackWizardEstimateShown(min, max, serviceType)` once on mount. The CTA `<a>` tag gained an `onClick` that fires `trackWizardCtaClicked(min, max, serviceType)` before navigation proceeds.

## Decisions Made

- **Context prop over two components:** Sharing `ContactForm` across contact and B2B contexts via a single `context` prop avoids duplication and keeps form logic centralized.
- **Functional setState guard:** Using `setIsOpen((prev) => { if (!prev) track(); return !prev; })` is the correct React pattern — it reads the actual current state without adding `isOpen` to `useCallback` deps.
- **No StrictMode guard on wizard useEffect:** Production builds don't double-invoke effects; adding a `useRef` guard would be premature complexity.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `src/pages/kontakt/_sections/ContactForm.tsx` modified (context prop + analytics imports)
- [x] `src/pages/nettside-for-bedrift/_sections/FormSection.astro` modified (context="b2b")
- [x] `src/components/islands/ChatWidget.tsx` modified (trackChatbotOpened + trackChatbotSuggestionClicked)
- [x] `src/components/islands/wizard/steps/ResultStep.tsx` modified (trackWizardEstimateShown + trackWizardCtaClicked)
- [x] Build passes with zero TypeScript errors
- [x] Commits: 1a2bfca, 6edb64b, ddcc335

## Self-Check: PASSED
