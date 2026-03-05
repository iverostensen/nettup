---
phase: 12-ai-chatbot-widget
plan: 01
subsystem: api
tags: [anthropic, claude, streaming, sse, chatbot, vercel]

requires: []
provides:
  - "POST /api/chat streaming SSE endpoint proxying to Claude Haiku"
  - "buildSystemPrompt() with service data and page-context awareness"
  - "Vercel adapter for hybrid static/serverless rendering"
affects: [12-02-chat-widget-ui]

tech-stack:
  added: ["@anthropic-ai/sdk", "@astrojs/vercel"]
  patterns: ["SSE streaming via ReadableStream", "per-route prerender=false for serverless"]

key-files:
  created:
    - src/pages/api/chat.ts
    - src/config/chatbot.ts
    - .env.example
  modified:
    - astro.config.mjs
    - package.json

key-decisions:
  - "Vercel adapter with static output preserved — per-route opt-out via prerender=false"
  - "System prompt uses launchPriceRange from services.ts (launch discount active)"
  - "Max 20 messages rate-limit guard trimming from front"

patterns-established:
  - "SSE streaming pattern: data: JSON + data: [DONE] terminator"
  - "Server-side API key access via import.meta.env"

requirements-completed: [CHAT-01, CHAT-02, CHAT-03]

duration: 2min
completed: 2026-03-06
---

# Phase 12 Plan 01: API Endpoint and System Prompt Summary

**Streaming Claude Haiku chat endpoint with page-aware Norwegian system prompt built from services.ts**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-05T23:37:46Z
- **Completed:** 2026-03-05T23:39:42Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Vercel adapter configured for hybrid static/serverless rendering without breaking existing static pages
- Streaming SSE endpoint at POST /api/chat proxying to Claude Haiku with input validation and error handling
- Page-aware system prompt that adapts context based on currentPage parameter and includes all service pricing data

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and configure Vercel adapter** - `f01dd31` (chore)
2. **Task 2: Create system prompt builder and streaming API endpoint** - `38773a6` (feat)

## Files Created/Modified
- `astro.config.mjs` - Added Vercel adapter import and configuration
- `src/pages/api/chat.ts` - SSE streaming POST endpoint with Claude Haiku, prerender=false
- `src/config/chatbot.ts` - buildSystemPrompt() with service data and page context mapping
- `.env.example` - ANTHROPIC_API_KEY template for documentation
- `package.json` - Added @anthropic-ai/sdk and @astrojs/vercel dependencies

## Decisions Made
- Kept `output: 'static'` per Astro 5 convention — only /api/chat opts out via `prerender = false`
- Used launchPriceRange (not priceRange) in system prompt since 40% launch discount is currently active
- Messages array trimmed from front (keeping most recent) when exceeding 20-message limit

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

User must set `ANTHROPIC_API_KEY` in `.env` file:
- Go to Anthropic Console -> API Keys -> Create Key
- Copy key and set in `.env` as `ANTHROPIC_API_KEY=sk-ant-...`

## Next Phase Readiness
- API endpoint ready for Plan 02 (chat widget UI) to consume
- Streaming SSE format established: `data: {"text":"..."}` events with `data: [DONE]` terminator
- No blockers

---
*Phase: 12-ai-chatbot-widget*
*Completed: 2026-03-06*
