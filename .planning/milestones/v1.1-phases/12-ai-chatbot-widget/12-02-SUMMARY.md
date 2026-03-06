---
phase: 12-ai-chatbot-widget
plan: 02
subsystem: ui
tags: [react, framer-motion, streaming, sse, chatbot, formspree, chat-widget]

requires:
  - phase: 12-01
    provides: "POST /api/chat SSE streaming endpoint with Claude Haiku"
provides:
  - "ChatWidget React island with floating bubble, chat window, streaming messages"
  - "In-chat lead capture form submitting to Formspree with kilde: chatbot"
  - "Chat widget mounted on all pages via BaseLayout"
affects: []

tech-stack:
  added: []
  patterns: ["SSE stream reader with TextDecoder buffer parsing", "transition:persist for cross-page React island state"]

key-files:
  created:
    - src/components/islands/ChatWidget.tsx
  modified:
    - src/layouts/BaseLayout.astro
    - src/pages/api/chat.ts
    - src/config/chatbot.ts

key-decisions:
  - "z-40 bubble / z-[60] open chat window layering — bubble below FloatingNav (z-50), open window above all"
  - "transition:persist on ChatWidget to maintain conversation across Astro page navigations"
  - "Lead capture prompt after 3 assistant responses — not too early, not too late"
  - "Inline SVG icons (no icon library) consistent with FloatingNav and ContactForm patterns"

patterns-established:
  - "SSE client-side stream parsing: TextDecoder buffer with line splitting and data: prefix stripping"
  - "In-chat lead capture pattern: prompt button after N responses, inline form, Formspree submission"

requirements-completed: [CHAT-04, CHAT-05, CHAT-06, CHAT-07, CHAT-08]

duration: 4min
completed: 2026-03-06
---

# Phase 12 Plan 02: Chat Widget UI Summary

**Floating chat bubble with streaming AI conversation window, in-chat Formspree lead capture, and mobile-responsive layout on all pages**

## Performance

- **Duration:** ~4 min active (plus checkpoint verification pause)
- **Started:** 2026-03-05T23:41:51Z
- **Completed:** 2026-03-06T09:42:00Z
- **Tasks:** 3 (2 auto + 1 human-verify checkpoint)
- **Files modified:** 4

## Accomplishments
- ChatWidget React island with floating bubble (z-40), teaser tooltip, and expandable chat window (z-[60])
- SSE streaming message display with typing indicator and markdown rendering
- In-chat lead capture form submitting to Formspree with `kilde: chatbot` and link to /kontakt
- Mobile-responsive layout (full-width <640px, 380x520 panel on desktop)
- Mounted on all pages via BaseLayout with `transition:persist` for cross-page conversation persistence

## Task Commits

Each task was committed atomically:

1. **Task 1: Build ChatWidget React island** - `e52422f` (feat)
2. **Task 2: Wire ChatWidget into BaseLayout** - `ed3f9da` (feat)
3. **Task 3: Verify chat widget end-to-end** - checkpoint approved after fix commit

**Post-checkpoint fix:** `9408cac` (fix) - Stream crash guard, model ID update, markdown rendering, prompt tuning

## Files Created/Modified
- `src/components/islands/ChatWidget.tsx` - Complete chat widget: bubble, teaser, chat window, streaming, lead capture, accessibility
- `src/layouts/BaseLayout.astro` - ChatWidget import and client:load with transition:persist
- `src/pages/api/chat.ts` - ReadableStream closed guard fix (post-checkpoint)
- `src/config/chatbot.ts` - System prompt tuning for shorter responses (post-checkpoint)

## Decisions Made
- z-40 for bubble (below FloatingNav z-50), z-[60] for open chat window (above all when user explicitly opened it)
- `transition:persist` keeps conversation alive across Astro View Transitions page navigations
- Lead capture prompt appears after 3rd assistant response — balances engagement vs interruption
- Inline SVG icons throughout — consistent with FloatingNav and ContactForm patterns, no icon library
- Teaser tooltip auto-shows after 5s, auto-hides after 10s — non-intrusive but draws attention

## Deviations from Plan

### Auto-fixed Issues (post-checkpoint)

**1. [Rule 1 - Bug] ReadableStream crash on close**
- **Found during:** Task 3 verification
- **Issue:** Stream controller enqueue after close causing runtime error
- **Fix:** Added `closed` guard flag to ReadableStream in api/chat.ts
- **Committed in:** `9408cac`

**2. [Rule 1 - Bug] Wrong Claude model ID**
- **Found during:** Task 3 verification
- **Issue:** Model ID `claude-haiku-4-5-20241022` incorrect
- **Fix:** Updated to `claude-haiku-4-5-20251001`
- **Committed in:** `9408cac`

**3. [Rule 2 - Missing Critical] Markdown rendering for AI responses**
- **Found during:** Task 3 verification
- **Issue:** AI responses contain markdown (bold, lists) but rendered as plain text
- **Fix:** Added `renderMarkdown()` function in ChatWidget.tsx for bold, links, and list items
- **Committed in:** `9408cac`

**4. [Rule 1 - Bug] System prompt producing overly long responses**
- **Found during:** Task 3 verification
- **Issue:** AI responses too verbose for chat widget context
- **Fix:** Tuned system prompt for shorter responses, one question at a time, no emojis
- **Committed in:** `9408cac`

---

**Total deviations:** 4 auto-fixed (2 bugs, 1 missing critical, 1 bug)
**Impact on plan:** All fixes necessary for correct runtime behavior. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## Next Phase Readiness
- Phase 12 (AI Chatbot Widget) is now complete
- v1.1 milestone (Tjenesteutvidelse) is fully delivered
- No blockers

---
*Phase: 12-ai-chatbot-widget*
*Completed: 2026-03-06*
