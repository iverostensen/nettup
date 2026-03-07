---
phase: quick-5
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/pages/api/suggestions.ts
  - src/components/islands/ChatWidget.tsx
autonomous: true
requirements: [QUICK-5]
must_haves:
  truths:
    - "After each assistant response, 3 follow-up suggestion chips appear above the input"
    - "Clicking a chip sends that text as a user message"
    - "Suggestions are hidden while streaming and replaced after each new response"
  artifacts:
    - path: "src/pages/api/suggestions.ts"
      provides: "POST endpoint returning { suggestions: string[] }"
      exports: ["POST"]
    - path: "src/components/islands/ChatWidget.tsx"
      provides: "Suggestions chips UI + fetch trigger after streaming"
  key_links:
    - from: "src/components/islands/ChatWidget.tsx"
      to: "/api/suggestions"
      via: "fetch POST after isStreaming flips false"
      pattern: "fetch.*api/suggestions"
---

<objective>
Add AI-generated contextual suggestion chips to the chatbot. After each assistant response finishes streaming, the client fetches 3 follow-up questions from a new `/api/suggestions` endpoint (calls Haiku with conversation history) and renders them as clickable chips above the input field.

Purpose: Reduce friction for users who don't know what to ask next — contextual nudges increase engagement.
Output: /api/suggestions endpoint + chip UI wired into ChatWidget.
</objective>

<execution_context>
@/Users/iverostensen/.claude/get-shit-done/workflows/execute-plan.md
@/Users/iverostensen/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/pages/api/chat.ts
@src/components/islands/ChatWidget.tsx
@src/config/chatbot.ts

<interfaces>
<!-- Key patterns from existing API route (src/pages/api/chat.ts) -->
```typescript
export const prerender = false;
import Anthropic from '@anthropic-ai/sdk';
// Model in use: 'claude-haiku-4-5-20251001'
// Rate limiting via requestLog Map<string, number[]> pattern (reuse same approach)
// ANTHROPIC_API_KEY from import.meta.env
```

<!-- ChatWidget state at play -->
```typescript
const [isStreaming, setIsStreaming] = useState(false);
// isStreaming goes false in the finally block of sendMessage
// messages: ChatMessage[] — { role: 'user' | 'assistant', content: string }[]
// sendMessage uses useCallback([input, isStreaming, messages, currentPage])
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create /api/suggestions endpoint</name>
  <files>src/pages/api/suggestions.ts</files>
  <action>
Create `src/pages/api/suggestions.ts` following the exact same structure as `src/pages/api/chat.ts`.

Request body shape: `{ messages: ChatMessage[], currentPage: string }` — same interface as chat.

Implementation:
- `export const prerender = false`
- Rate limit using same in-memory pattern (5 req/min per IP — half the chat limit since this fires automatically)
- Validate messages array (non-empty, max 20)
- Call Anthropic non-streaming with model `claude-haiku-4-5-20251001`, max_tokens 256
- System prompt (keep it tight — this is a meta-call):
  ```
  Du er en hjelper som genererer oppfølgingsspørsmål for en chatbot på nettup.no.
  Basert på samtalehistorikken, generer 3 korte oppfølgingsspørsmål på norsk som brukeren kan stille.
  Svar KUN med en JSON-array med 3 strenger. Ingen annen tekst. Eksempel: ["Spørsmål 1?","Spørsmål 2?","Spørsmål 3?"]
  ```
- Parse the response text as JSON, return `{ suggestions: string[] }` with status 200
- On parse failure or any error return `{ suggestions: [] }` with status 200 (never fail loudly — this is enhancement-only)
- Return `Content-Type: application/json`

Do NOT reuse the streaming infrastructure from chat.ts — this is a simple non-streaming call using `client.messages.create(...)`.
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>Build passes, /api/suggestions route present in output</done>
</task>

<task type="auto">
  <name>Task 2: Add suggestion chips to ChatWidget</name>
  <files>src/components/islands/ChatWidget.tsx</files>
  <action>
Add suggestions state and fetch logic to `ChatWidget.tsx`. Minimal surgical changes — do not restructure existing code.

**State to add** (near the other useState declarations):
```typescript
const [suggestions, setSuggestions] = useState<string[]>([]);
const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
```

**Fetch logic** — add a `fetchSuggestions` function using `useCallback`:
```typescript
const fetchSuggestions = useCallback(async (currentMessages: ChatMessage[]) => {
  // Only fetch if there's at least one real exchange (user + assistant)
  const hasExchange = currentMessages.some(m => m.role === 'user');
  if (!hasExchange) return;

  setIsFetchingSuggestions(true);
  try {
    const res = await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: currentMessages.filter(
          (m) => !(m.role === 'assistant' && m.content === WELCOME_MESSAGE.content)
        ),
        currentPage,
      }),
    });
    if (res.ok) {
      const data = await res.json() as { suggestions?: string[] };
      setSuggestions(data.suggestions ?? []);
    }
  } catch {
    // Suggestions are enhancement-only — fail silently
  } finally {
    setIsFetchingSuggestions(false);
  }
}, [currentPage]);
```

**Trigger after streaming** — in `sendMessage`, the `finally` block currently only calls `setIsStreaming(false)`. Modify to also call `fetchSuggestions` with the latest messages. The challenge is that `messages` state may not reflect the last assistant content yet when finally runs. Capture the final messages array correctly:

After the streaming while-loop finishes (before `finally`), in the `[DONE]` branch call `fetchSuggestions` with a snapshot of `messages`. The simplest approach: move the `fetchSuggestions` call into a `useEffect` that watches `isStreaming`:

```typescript
// After streaming completes, fetch suggestions
useEffect(() => {
  if (!isStreaming && messages.length > 1) {
    // messages.length > 1 means we've had at least one exchange
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'assistant' && lastMsg.content) {
      fetchSuggestions(messages);
    }
  }
}, [isStreaming]); // intentionally only trigger on isStreaming change, not messages
```

Clear suggestions when user starts typing: add `setSuggestions([])` inside `sendMessage` alongside `setIsStreaming(true)`.

**UI — chips above the input field.** In the input area `<div className="border-t border-white/10 px-4 py-3">`, add the chip row ABOVE the existing quick replies block (or replace it contextually):

```tsx
{/* AI-generated suggestions */}
{suggestions.length > 0 && !isStreaming && !isFetchingSuggestions && (
  <div className="flex flex-wrap gap-2 pb-3">
    {suggestions.map((s) => (
      <button
        key={s}
        onClick={() => {
          setSuggestions([]);
          sendMessage(s);
        }}
        className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-text-muted transition-colors hover:border-brand/40 hover:bg-brand/10 hover:text-text"
      >
        {s}
      </button>
    ))}
  </div>
)}
```

Position: render suggestions INSTEAD of the initial QUICK_REPLIES block when suggestions are available. The existing QUICK_REPLIES block shows only when `messages.length === 1`. Suggestions show when `messages.length > 1`. They naturally don't conflict.

Keep the existing `QUICK_REPLIES` block exactly as-is (`messages.length === 1 && !isStreaming`).

Respect `prefers-reduced-motion`: no animation on chips (they already don't animate in QUICK_REPLIES pattern — keep same).
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -20 && npm run lint 2>&1 | tail -20</automated>
  </verify>
  <done>Build passes, lint clean (0 errors), suggestion chips render after assistant response, clicking a chip sends the message</done>
</task>

</tasks>

<verification>
1. `npm run build` passes with no errors
2. `npm run lint` reports 0 errors
3. Manual smoke test in `npm run dev`: open chat, send a message, wait for response to complete — 3 suggestion chips appear above the input
4. Click a chip — it sends that text as a message and chips clear
5. New response completes — fresh suggestions appear
</verification>

<success_criteria>
- /api/suggestions endpoint exists and returns `{ suggestions: string[] }`
- After every assistant response (isStreaming → false), 3 chips render above the input
- Chips are absent during streaming and while fetching suggestions
- Clicking a chip triggers sendMessage with the suggestion text
- Failures in /api/suggestions never break the chat (silent fallback to empty array)
- Build and lint pass cleanly
</success_criteria>

<output>
After completion, create `.planning/quick/5-add-ai-generated-contextual-suggestions-/5-SUMMARY.md` with what was built, key decisions, and any deviations from this plan.
</output>
