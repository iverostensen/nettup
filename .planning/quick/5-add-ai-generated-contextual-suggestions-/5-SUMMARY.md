---
phase: quick-5
plan: 01
subsystem: chatbot
tags: [ai, suggestions, ux, chatbot, react]
dependency_graph:
  requires: [ChatWidget, /api/chat pattern]
  provides: [/api/suggestions, suggestion chips UI]
  affects: [src/components/islands/ChatWidget.tsx]
tech_stack:
  added: []
  patterns: [non-streaming Anthropic call, useEffect on isStreaming, silent error fallback]
key_files:
  created:
    - src/pages/api/suggestions.ts
  modified:
    - src/components/islands/ChatWidget.tsx
decisions:
  - useEffect watching isStreaming avoids stale closure issues with messages state — simpler than capturing snapshot in finally block
  - Rate limit set to 5 req/min (half of chat) since suggestions fire automatically after every response
  - Silent fallback (empty array) on all errors — suggestions are pure enhancement, never block chat
metrics:
  duration: ~5 min
  completed: 2026-03-08
  tasks_completed: 2
  files_created: 1
  files_modified: 1
---

# Quick Task 5: AI-Generated Contextual Suggestions Summary

**One-liner:** Contextual follow-up suggestion chips via /api/suggestions (Haiku, non-streaming) rendered above chat input after each assistant response.

## What Was Built

### /api/suggestions endpoint (src/pages/api/suggestions.ts)

POST endpoint following the same structure as `/api/chat`. Accepts `{ messages, currentPage }`, calls `claude-haiku-4-5-20251001` non-streaming with a tightly scoped system prompt, and returns `{ suggestions: string[] }` (always status 200). Rate limited to 5 req/min per IP. All error paths silently return `{ suggestions: [] }`.

### Suggestion chips UI (src/components/islands/ChatWidget.tsx)

Added `suggestions` and `isFetchingSuggestions` state. `fetchSuggestions` is a `useCallback` that POSTs to `/api/suggestions` after each exchange. A `useEffect` watching `isStreaming` triggers the fetch when streaming completes and the last message is a non-empty assistant message. Chips render above the input field when suggestions are available, not streaming, and not fetching. Clicking a chip calls `setSuggestions([])` then `sendMessage(s)`. `setSuggestions([])` also fires at the start of each new `sendMessage` call to clear stale chips immediately.

The existing `QUICK_REPLIES` block (shown only when `messages.length === 1`) is untouched — the two blocks naturally don't conflict since suggestions only appear after an exchange.

## Deviations from Plan

None — plan executed exactly as written. The `useEffect` approach (watching `isStreaming`) was used as suggested in the plan's implementation notes, avoiding stale closure issues with the `messages` state.

## Self-Check

- [x] `src/pages/api/suggestions.ts` exists
- [x] `src/components/islands/ChatWidget.tsx` modified with chips UI and fetch logic
- [x] `npm run build` passes (Server built in 2.81s)
- [x] `npm run lint` — 0 errors (2 pre-existing warnings in unrelated scripts)
- [x] Task 1 commit: 767aa4d
- [x] Task 2 commit: 4260daf

## Self-Check: PASSED
