# Phase 12: AI Chatbot Widget - Research

**Researched:** 2026-03-06
**Domain:** AI chat widget with Claude API, Astro serverless endpoints, React islands
**Confidence:** HIGH

## Summary

This phase adds an AI-powered chat widget to nettup.no that acts as a service advisor. The architecture is straightforward: a React island chat bubble (similar to the existing FloatingNav pattern) communicates with a Vercel serverless API endpoint (`/api/chat`) that proxies requests to the Claude API with streaming. The system prompt is built from the existing `services.ts` data plus FAQ content, giving the chatbot accurate knowledge about pricing, services, and process.

The key technical decision is that Astro 5 supports per-route `prerender = false` without changing the global `output: 'static'` mode. This means the existing static site stays untouched -- only the `/api/chat` endpoint runs as a serverless function. The `@astrojs/vercel` adapter must be added, and the `@anthropic-ai/sdk` provides streaming out of the box. The chat widget itself is a React component using Framer Motion for open/close animations, matching the established island pattern.

No conversation storage means no GDPR complexity. The in-chat lead capture reuses the existing Formspree endpoint with `kilde: 'chatbot'` to distinguish from regular contact form submissions.

**Primary recommendation:** Build a streaming chat widget as a React island using `@anthropic-ai/sdk` on a Vercel serverless endpoint, with `services.ts` data injected into the system prompt.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Floating bubble on ALL pages, bottom-right corner
- Default state: minimized bubble with teaser tooltip (e.g. "Lurer du pa noe?") that auto-shows after a few seconds
- Page-aware: widget knows which page the user is on and can tailor responses accordingly
- Primary role: service advisor -- helps visitors understand which service fits, answers pricing/process/timeline questions
- Tone: same as site copy -- professional but approachable, Norwegian (bokmal), not corporate, not casual
- Identity: transparently AI -- clearly states it's Nettup's AI assistant
- Fallback: when it can't answer, suggests the contact form with a link to /kontakt
- Offers BOTH in-chat contact capture AND link to full contact page -- user chooses
- In-chat capture sends to same Formspree endpoint (xnjnzybj) with `kilde: chatbot` field
- No conversation storage -- ephemeral, lost when user closes the page
- System prompt with site content: services.ts data, FAQ content, and key page copy
- Quotes price RANGES from services.ts (e.g. "fra 15 000 kr")
- Powered by Claude API (Haiku 4.5 for cost efficiency)
- API calls routed through Vercel serverless function (/api/chat) -- keeps API key server-side

### Claude's Discretion

- Teaser tooltip timing and animation
- Chat window sizing and layout
- Typing indicator design
- System prompt wording and structure
- Exact model selection within Claude family (Haiku vs Sonnet based on quality needs)
- How page context is passed to the system prompt

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope
</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@anthropic-ai/sdk` | latest | Claude API client with streaming | Official Anthropic SDK, TypeScript-first, built-in streaming support |
| `@astrojs/vercel` | ^9.x | Vercel adapter for serverless endpoints | Required to run `/api/chat` as serverless function |
| `react` | ^19.x | Chat widget UI (already installed) | Already in project |
| `framer-motion` | ^12.x | Widget animations (already installed) | Already in project, used by all islands |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clsx` + `tailwind-merge` | (installed) | Class merging | Already available via `cn()` utility |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@anthropic-ai/sdk` direct | Vercel AI SDK (`ai` package) | Adds abstraction layer; direct SDK is simpler for single-provider use |
| Custom SSE parsing | `@anthropic-ai/sdk` `.stream()` | SDK handles all SSE parsing internally; no need to parse raw events |

**Installation:**
```bash
npm install @anthropic-ai/sdk @astrojs/vercel
```

**No other dependencies needed.** The project already has React, Framer Motion, Tailwind, and the `cn()` utility.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/islands/
│   └── ChatWidget.tsx          # React island: bubble + chat window + messages
├── pages/api/
│   └── chat.ts                 # Vercel serverless: Claude API proxy with streaming
├── config/
│   ├── services.ts             # (existing) Service data for system prompt
│   └── chatbot.ts              # System prompt builder, knowledge base assembly
└── layouts/
    └── BaseLayout.astro        # Add <ChatWidget client:load /> here
```

### Pattern 1: Astro API Endpoint with Streaming Response
**What:** Server-side endpoint that proxies chat requests to Claude API and streams responses back via SSE.
**When to use:** For the `/api/chat` POST endpoint.
**Example:**
```typescript
// src/pages/api/chat.ts
// Source: Astro docs + Anthropic SDK docs
import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/config/chatbot';

export const prerender = false;

const client = new Anthropic({
  apiKey: import.meta.env.ANTHROPIC_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  const { messages, currentPage } = await request.json();
  const systemPrompt = buildSystemPrompt(currentPage);

  const stream = client.messages.stream({
    model: 'claude-haiku-4-5-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      stream.on('text', (text) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      });
      stream.on('end', () => {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      });
      stream.on('error', (err) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
        controller.close();
      });
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};
```

### Pattern 2: React Island Chat Widget
**What:** Floating chat bubble that expands into a chat window, matching existing FloatingNav pattern.
**When to use:** For the chat UI component.
**Example:**
```typescript
// src/components/islands/ChatWidget.tsx
// Pattern reference: FloatingNav.tsx (fixed-position React island)
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWidgetProps {
  currentPage: string;
}

export default function ChatWidget({ currentPage }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Show teaser tooltip after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowTeaser(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;
    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    // Add empty assistant message for streaming
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, currentPage }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          const parsed = JSON.parse(data);
          if (parsed.text) {
            setMessages(prev => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = { ...last, content: last.content + parsed.text };
              return updated;
            });
          }
        }
      }
    }
    setIsStreaming(false);
  };

  return (
    <>
      {/* Chat bubble + teaser tooltip */}
      {/* Chat window with AnimatePresence */}
    </>
  );
}
```

### Pattern 3: System Prompt Builder
**What:** Assembles the system prompt from services.ts data and page context.
**When to use:** Called by the API endpoint on each request.
**Example:**
```typescript
// src/config/chatbot.ts
import { services } from './services';

export function buildSystemPrompt(currentPage: string): string {
  const serviceInfo = services.map(s =>
    `- ${s.name}: ${s.tagline}. Pris: ${s.priceRange}${s.monthlyPriceLabel ? ` + ${s.monthlyPriceLabel}` : ''}`
  ).join('\n');

  return `Du er Nettup sin AI-assistent. Du hjelper besokende med a forsta hvilken tjeneste som passer dem.

VIKTIG:
- Svar alltid pa norsk (bokmal)
- Vær profesjonell men tilgjengelig
- Si tydelig at du er en AI-assistent
- Oppgi kun prisintervaller, aldri eksakte priser
- Når du ikke kan svare, henvis til kontaktskjemaet pa /kontakt

TJENESTER:
${serviceInfo}

BRUKERENS SIDE: ${currentPage}
${getPageContext(currentPage)}`;
}

function getPageContext(page: string): string {
  if (page.startsWith('/tjenester/')) {
    const slug = page.split('/')[2];
    const service = services.find(s => s.slug === slug);
    if (service) return `Brukeren ser pa ${service.name}-tjenesten. Fokuser pa denne.`;
  }
  if (page === '/tjenester') return 'Brukeren utforsker alle tjenester.';
  if (page === '/kontakt') return 'Brukeren er allerede pa kontaktsiden.';
  if (page === '/') return 'Brukeren er pa forsiden.';
  return '';
}
```

### Pattern 4: In-Chat Lead Capture via Formspree
**What:** When the chatbot qualifies a lead, it can offer an in-chat mini form that submits to the same Formspree endpoint.
**When to use:** After the chatbot has understood the visitor's need.
**Example:**
```typescript
// Reuse existing Formspree pattern from ContactForm.tsx
const submitLead = async (data: { navn: string; epost: string; melding: string }) => {
  await fetch(`https://formspree.io/f/xnjnzybj`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      kilde: 'chatbot',
    }),
  });
};
```

### Anti-Patterns to Avoid
- **Exposing API key client-side:** Never call Claude API directly from the browser. Always proxy through `/api/chat`.
- **Storing conversation history on server:** The spec says ephemeral only. Keep all state in React component state.
- **Building custom SSE parser:** Use the `@anthropic-ai/sdk` `.stream()` method which handles all SSE event parsing internally.
- **Using `output: 'server'` globally:** Only the API endpoint needs server rendering. Use `prerender = false` on just that file.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Claude API streaming | Raw fetch + SSE parsing | `@anthropic-ai/sdk` `.stream()` | SDK handles retries, event parsing, error handling, TypeScript types |
| Markdown rendering in chat | Regex-based parser | Simple approach: split on `\n`, bold with `**`, links with `[]()` | Chat responses are short; full markdown parser (remark) is overkill |
| Form submission | Custom backend | Formspree (existing endpoint) | Already proven in the project, `kilde: 'chatbot'` distinguishes source |
| Animation system | Custom CSS transitions | Framer Motion (already installed) | Consistent with all other islands, AnimatePresence handles mount/unmount |

**Key insight:** The project already has all the UI infrastructure (React, Framer Motion, Tailwind, `cn()`, Formspree). The only new pieces are the Anthropic SDK and the Vercel adapter for serverless.

## Common Pitfalls

### Pitfall 1: Astro Config Change Breaks Static Build
**What goes wrong:** Adding `@astrojs/vercel` adapter with `output: 'server'` makes ALL pages server-rendered, breaking the fast static site.
**Why it happens:** Astro 5 changed how hybrid mode works -- there's no separate `output: 'hybrid'` anymore.
**How to avoid:** Keep `output: 'static'` (or omit it entirely). Add `@astrojs/vercel` adapter. Only set `export const prerender = false` in `src/pages/api/chat.ts`. Astro 5 automatically handles the hybrid behavior.
**Warning signs:** Build output shows "server-rendered" for all pages instead of just the API endpoint.

### Pitfall 2: API Key Exposure
**What goes wrong:** `ANTHROPIC_API_KEY` ends up in client bundle or git.
**Why it happens:** Using `process.env` instead of `import.meta.env`, or not adding to `.env` file.
**How to avoid:** Use `import.meta.env.ANTHROPIC_API_KEY` in the API endpoint (server-side only). Add `ANTHROPIC_API_KEY` to `.env` locally and Vercel environment variables for production. Add `.env` to `.gitignore` (should already be there).
**Warning signs:** Key appears in browser network tab or build output.

### Pitfall 3: Chat Widget Blocks FloatingNav Z-Index
**What goes wrong:** Chat bubble overlaps with the floating navigation or gets hidden behind it.
**Why it happens:** Both use fixed positioning and high z-index values.
**How to avoid:** FloatingNav uses `z-50`. Chat widget should use `z-40` for the bubble (below nav) but `z-[60]` for the open chat window (above nav, since user explicitly opened it).
**Warning signs:** Visual overlap on mobile where both elements are in bottom/top corners.

### Pitfall 4: Streaming Response Breaks on Vercel
**What goes wrong:** Vercel serverless function times out or doesn't stream properly.
**Why it happens:** Default Vercel serverless timeout is 10 seconds (free tier) or 60 seconds (pro). Claude responses can take a few seconds to start streaming.
**How to avoid:** Set `maxDuration` in the API endpoint if needed. Use streaming (not `await` for full response) to start sending data immediately. Keep `max_tokens` reasonable (1024 is fine for chat).
**Warning signs:** 504 Gateway Timeout errors in production.

### Pitfall 5: Mobile Chat Window Covers Entire Screen
**What goes wrong:** Chat window is unusable on small screens because it's either too small to type in or covers important content.
**Why it happens:** Fixed sizing that doesn't adapt to viewport.
**How to avoid:** On mobile (< 640px), chat window should be full-width and near-full-height with a clear close button. On desktop, use a fixed-size panel (e.g., 380px wide, 500px tall).
**Warning signs:** Users can't see what they're typing or can't close the widget on mobile.

### Pitfall 6: System Prompt Token Bloat
**What goes wrong:** System prompt is too large, increasing cost per message and latency.
**Why it happens:** Stuffing entire FAQ sections and page copy into every request.
**How to avoid:** Keep system prompt concise. Only include service names, taglines, and price ranges from services.ts. Include page-specific context based on `currentPage` parameter. Target under 1000 tokens for the system prompt.
**Warning signs:** First token latency over 2 seconds, higher-than-expected API costs.

## Code Examples

### Astro Config with Vercel Adapter (Hybrid Mode)
```typescript
// astro.config.mjs
// Source: https://docs.astro.build/en/guides/on-demand-rendering/
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://nettup.no',
  // Keep static! No need for output: 'server'
  // prerender = false in api/chat.ts handles the hybrid behavior
  adapter: vercel(),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Adding Chat Widget to BaseLayout
```astro
<!-- In BaseLayout.astro, after FloatingNav -->
---
import ChatWidget from '../components/islands/ChatWidget';
---
<FloatingNav client:load transition:persist />
<ChatWidget client:load currentPage={Astro.url.pathname} />
```

### Reading SSE Stream on Client
```typescript
// Source: Standard Fetch API streaming pattern
async function readStream(
  response: Response,
  onChunk: (text: string) => void,
  onDone: () => void
) {
  const reader = response.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) { onDone(); break; }

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') { onDone(); return; }
      try {
        const parsed = JSON.parse(data);
        if (parsed.text) onChunk(parsed.text);
        if (parsed.error) console.error('Chat error:', parsed.error);
      } catch {
        // Skip malformed lines
      }
    }
  }
}
```

### Environment Variables Setup
```bash
# .env (local development)
ANTHROPIC_API_KEY=sk-ant-...

# Vercel Dashboard -> Settings -> Environment Variables
# Add ANTHROPIC_API_KEY there for production
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `output: 'hybrid'` in Astro | `output: 'static'` + per-route `prerender = false` | Astro 5 (Dec 2024) | No global config change needed for API endpoints |
| `@astrojs/vercel/serverless` | `@astrojs/vercel` | @astrojs/vercel v8+ | Single package, no subpath import |
| Raw Claude API fetch | `@anthropic-ai/sdk` `.stream()` | SDK v0.20+ | Built-in streaming with event handlers, no manual SSE parsing |

**Deprecated/outdated:**
- `output: 'hybrid'`: Removed in Astro 5. Use `output: 'static'` (default) with per-route opt-out.
- `@astrojs/vercel/serverless`: Old subpath import. Use `@astrojs/vercel` directly.

## Open Questions

1. **Haiku 4.5 model identifier**
   - What we know: The CONTEXT.md specifies "Haiku 4.5 for cost efficiency." The exact model ID for Haiku 4.5 needs verification at implementation time.
   - What's unclear: Whether `claude-haiku-4-5-20241022` is the correct/latest identifier.
   - Recommendation: Use `claude-haiku-4-5-20241022` and verify during implementation. The SDK will error clearly if the model ID is wrong.

2. **Vercel free tier serverless limits**
   - What we know: Free tier has 10-second function timeout. Streaming starts sending data quickly but the full response might take longer.
   - What's unclear: Whether the 10-second limit applies to streaming responses that have already started sending data.
   - Recommendation: Test on free tier first. If timeouts occur, the Pro plan gives 60-second limits. Alternatively, keep `max_tokens` low (512-1024) to ensure fast responses.

3. **Rate limiting / abuse protection**
   - What we know: No rate limiting is mentioned in CONTEXT.md.
   - What's unclear: Whether to add basic rate limiting to prevent API cost abuse.
   - Recommendation: Add a simple in-memory rate limit in the API endpoint (e.g., max 20 messages per IP per minute). This is not in the locked decisions, so it falls under implementation discretion.

## Discretion Recommendations

Based on the "Claude's Discretion" areas from CONTEXT.md:

| Area | Recommendation | Reasoning |
|------|---------------|-----------|
| Teaser tooltip timing | Show after 5 seconds, dismiss on click or after 10 seconds | Long enough for page to load, short enough to engage |
| Teaser animation | `fadeIn` + slight `translateY` with Framer Motion | Matches existing animation patterns |
| Chat window sizing | Mobile: full-width, 85vh. Desktop: 380px x 520px | Standard chat widget proportions |
| Typing indicator | Three animated dots with `pulse` animation | Universal chat pattern, low implementation cost |
| System prompt structure | Service data + page context + behavioral rules | Structured sections keep token count low |
| Model selection | Start with `claude-haiku-4-5-20241022` | Cost-efficient for short advisory conversations. Upgrade to Sonnet only if quality is insufficient |
| Page context passing | Client sends `currentPage` string, server maps to context string | Simple, no client-side knowledge injection needed |

## Sources

### Primary (HIGH confidence)
- [Astro On-Demand Rendering docs](https://docs.astro.build/en/guides/on-demand-rendering/) - per-route `prerender = false` with static output
- [Astro Endpoints docs](https://docs.astro.build/en/guides/endpoints/) - POST handler, APIRoute type
- [@astrojs/vercel docs](https://docs.astro.build/en/guides/integrations-guide/vercel/) - adapter v9.x, serverless function support
- [Anthropic Streaming Messages docs](https://platform.claude.com/docs/en/api/messages-streaming) - TypeScript SDK `.stream()` with event handlers
- Project codebase: `FloatingNav.tsx`, `ContactForm.tsx`, `services.ts`, `BaseLayout.astro`, `astro.config.mjs`, `package.json`

### Secondary (MEDIUM confidence)
- [Anthropic SDK npm](https://www.npmjs.com/package/@anthropic-ai/sdk) - latest version and features

### Tertiary (LOW confidence)
- Haiku 4.5 exact model identifier -- verify at implementation time

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries verified via official docs and existing project patterns
- Architecture: HIGH - follows established project patterns (React islands, Astro pages, config modules)
- Pitfalls: HIGH - based on documented Astro 5 changes and standard serverless constraints

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable stack, 30-day validity)
