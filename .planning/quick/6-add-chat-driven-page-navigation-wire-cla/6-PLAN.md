---
phase: quick-6
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/config/chatbot.ts
  - src/pages/api/chat.ts
  - src/components/islands/ChatWidget.tsx
autonomous: true
requirements: [QUICK-6]
must_haves:
  truths:
    - "Claude can suggest navigation and the SSE stream carries the tool event"
    - "User sees a confirm chip in the chat thread after Claude suggests a page"
    - "User confirms chip navigates to the suggested page"
    - "User can dismiss the chip without navigating"
    - "Chat history persists across page loads within the same browser session"
  artifacts:
    - path: "src/config/chatbot.ts"
      provides: "NAVIGATION_TOOL definition"
      contains: "navigate_to_page"
    - path: "src/pages/api/chat.ts"
      provides: "SSE tool event emission"
      contains: "tool"
    - path: "src/components/islands/ChatWidget.tsx"
      provides: "Confirm chip UI and sessionStorage persistence"
      contains: "pendingNavigation"
  key_links:
    - from: "src/pages/api/chat.ts"
      to: "src/components/islands/ChatWidget.tsx"
      via: "SSE event: {tool:'navigate_to_page', path, label}"
      pattern: "tool.*navigate_to_page"
    - from: "src/components/islands/ChatWidget.tsx"
      to: "sessionStorage"
      via: "nettup_chat key on every messages change"
      pattern: "nettup_chat"
---

<objective>
Wire Claude tool use into the chatbot so it can suggest page navigation, surfaced as a user-confirmed chip in the chat thread. Add sessionStorage persistence so chat history survives page loads.

Purpose: Give the chatbot a concrete action it can take — directing users to the right page — while keeping navigation always user-initiated.
Output: NAVIGATION_TOOL definition, SSE tool event from API, confirm/dismiss chip in ChatWidget, sessionStorage persistence.
</objective>

<execution_context>
@/Users/iverostensen/.claude/get-shit-done/workflows/execute-plan.md
@/Users/iverostensen/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@/Users/iverostensen/nettup/CLAUDE.md
@/Users/iverostensen/nettup/src/config/chatbot.ts
@/Users/iverostensen/nettup/src/pages/api/chat.ts
@/Users/iverostensen/nettup/src/components/islands/ChatWidget.tsx

<interfaces>
<!-- Anthropic SDK MessageStream event hooks available in chat.ts -->
<!-- stream.on('text', (text) => ...) — already used for text deltas -->
<!-- stream.on('contentBlock', (block) => ...) — fires once per completed content block after stop -->
<!-- block.type === 'tool_use' && block.name === 'navigate_to_page' -->
<!-- block.input: { path: string, label: string } -->
<!-- stream.on('streamEvent', (event, snapshot) => ...) — raw SSE events if preferred -->

From src/config/chatbot.ts (current exports):
```typescript
export function buildSystemPrompt(currentPage: string): string
```
NAVIGATION_TOOL will be a new named export in the same file.

From src/pages/api/chat.ts (current stream setup):
```typescript
const stream = client.messages.stream({ model, max_tokens, system, messages });
stream.on('text', (text) => { /* enqueue SSE text delta */ });
stream.on('end', () => { /* enqueue [DONE] */ });
stream.on('error', (error) => { /* enqueue SSE error */ });
```
tools array is passed as a new field to client.messages.stream().

From src/components/islands/ChatWidget.tsx (current stream parser):
```typescript
const parsed = JSON.parse(data) as { text?: string; error?: string };
// New branch: if (parsed.tool === 'navigate_to_page') { ... }
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add NAVIGATION_TOOL and wire API to emit tool SSE events</name>
  <files>src/config/chatbot.ts, src/pages/api/chat.ts</files>
  <action>
In src/config/chatbot.ts, add and export NAVIGATION_TOOL below the existing imports:

```ts
export const NAVIGATION_TOOL = {
  name: "navigate_to_page",
  description: "Suggest navigating the user to a relevant page on nettup.no. Only call this when the user asks about something best shown on another page, or explicitly asks to go somewhere. Never navigate away from the current page without suggesting it first.",
  input_schema: {
    type: "object" as const,
    properties: {
      path: {
        type: "string" as const,
        enum: ["/", "/tjenester", "/tjenester/nettside", "/tjenester/nettbutikk", "/tjenester/vedlikehold", "/om-oss", "/prosjekter", "/kontakt"]
      },
      label: { type: "string" as const, description: "Short Norwegian label for the confirm chip, e.g. 'Se nettsidepakker'" }
    },
    required: ["path", "label"]
  }
};
```

In src/pages/api/chat.ts:
1. Import NAVIGATION_TOOL: `import { buildSystemPrompt, NAVIGATION_TOOL } from '../../config/chatbot';`
2. Pass tools to client.messages.stream(): add `tools: [NAVIGATION_TOOL]` to the options object alongside model, max_tokens, system, messages.
3. Add a contentBlock listener after the existing `stream.on('text', ...)`:

```ts
stream.on('contentBlock', (block) => {
  if (block.type === 'tool_use' && block.name === 'navigate_to_page') {
    const input = block.input as { path: string; label: string };
    enqueue(
      encoder.encode(
        `data: ${JSON.stringify({ tool: 'navigate_to_page', path: input.path, label: input.label })}\n\n`
      )
    );
  }
});
```

The `contentBlock` event fires after the block is complete (input fully assembled), so no partial JSON handling needed. Text deltas continue to work in parallel — the tool event is a separate SSE data line.
  </action>
  <verify>
    <automated>cd /Users/iverostensen/nettup && npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>Build passes with no type errors. NAVIGATION_TOOL is exported from chatbot.ts. chat.ts passes tools to the SDK and emits a tool SSE event when navigate_to_page is called.</done>
</task>

<task type="auto">
  <name>Task 2: Add sessionStorage persistence and navigation confirm chip to ChatWidget</name>
  <files>src/components/islands/ChatWidget.tsx</files>
  <action>
All changes are in ChatWidget.tsx.

**1. SessionStorage persistence — add two effects before the component's return statement (after existing useEffects):**

Restore on mount (runs once):
```tsx
useEffect(() => {
  try {
    const stored = sessionStorage.getItem('nettup_chat');
    if (stored) {
      const parsed = JSON.parse(stored) as { messages?: ChatMessage[] };
      if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
        setMessages(parsed.messages);
      }
    }
  } catch {
    // Corrupt storage — fall back to default state silently
  }
}, []);
```

Persist on every messages change:
```tsx
useEffect(() => {
  try {
    sessionStorage.setItem('nettup_chat', JSON.stringify({ messages }));
  } catch {
    // Storage quota or unavailable — fail silently
  }
}, [messages]);
```

**2. New state — add alongside existing useState declarations:**
```tsx
const [pendingNavigation, setPendingNavigation] = useState<{ path: string; label: string } | null>(null);
```

**3. Stream parser — extend the parsed type and add a branch for tool events inside the existing for-loop that processes SSE lines:**

Change the type cast on the existing parsed line:
```tsx
const parsed = JSON.parse(data) as { text?: string; error?: string; tool?: string; path?: string; label?: string };
```

Add a new branch after the existing `if (parsed.text)` block (before the closing `} catch {`):
```tsx
if (parsed.tool === 'navigate_to_page' && parsed.path && parsed.label) {
  setPendingNavigation({ path: parsed.path, label: parsed.label });
}
```

**4. Clear pendingNavigation on new user message — at the top of sendMessage, after `setSuggestions([])` line:**
```tsx
setPendingNavigation(null);
```

**5. Navigation confirm chip UI — add just before `<div ref={messagesEndRef} />` inside the messages area:**
```tsx
{pendingNavigation && !isStreaming && (
  <div className="flex items-center gap-2 pt-1">
    <button
      onClick={() => { window.location.href = pendingNavigation.path; }}
      className="rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-brand/20"
    >
      {pendingNavigation.label} →
    </button>
    <button
      onClick={() => setPendingNavigation(null)}
      className="text-xs text-text-muted hover:text-text transition-colors"
    >
      Ikke nå
    </button>
  </div>
)}
```
  </action>
  <verify>
    <automated>cd /Users/iverostensen/nettup && npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>Build passes. ChatWidget has pendingNavigation state, sessionStorage read on mount, sessionStorage write on messages change, tool SSE branch in stream parser, chip rendered above messagesEndRef when pendingNavigation is set and not streaming, chip cleared when user sends next message.</done>
</task>

</tasks>

<verification>
After both tasks:
- `npm run build` exits 0, no TypeScript errors
- NAVIGATION_TOOL exported from src/config/chatbot.ts
- src/pages/api/chat.ts passes tools array to SDK and listens for contentBlock
- ChatWidget renders confirm chip when pendingNavigation state is set
- sessionStorage key nettup_chat is read on mount and written on messages change
</verification>

<success_criteria>
- Build passes cleanly (npm run build exits 0)
- Claude can call navigate_to_page tool and the SSE stream carries the tool event
- Confirm chip appears in chat after tool call, dismiss button clears it
- Chip click navigates via window.location.href (user-initiated, always confirmed)
- Chat messages survive a page reload within the same session
</success_criteria>

<output>
After completion, create `.planning/quick/6-add-chat-driven-page-navigation-wire-cla/6-SUMMARY.md`
</output>
