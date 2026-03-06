# Phase 12: AI Chatbot Widget - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Add an AI-powered chat widget to nettup.no that acts as a service advisor — helping visitors understand which service fits them, answering questions about pricing/process/timeline, and guiding qualified leads to the contact form. The widget appears on all pages as a floating bubble.

</domain>

<decisions>
## Implementation Decisions

### Widget placement & trigger
- Floating bubble on ALL pages, bottom-right corner
- Default state: minimized bubble with teaser tooltip (e.g. "Lurer du pa noe?") that auto-shows after a few seconds
- Page-aware: widget knows which page the user is on and can tailor responses accordingly (e.g. on /tjenester/nettbutikk it proactively discusses e-commerce)

### Chatbot scope & personality
- Primary role: service advisor — helps visitors understand which service fits, answers pricing/process/timeline questions
- Tone: same as site copy — professional but approachable, Norwegian (bokmal), not corporate, not casual
- Identity: transparently AI — clearly states it's Nettup's AI assistant (e.g. "Hei! Jeg er Nettup sin AI-assistent.")
- Fallback: when it can't answer, suggests the contact form with a link to /kontakt

### Lead capture & handoff
- Offers BOTH in-chat contact capture AND link to full contact page — user chooses
- Suggests reaching out to the team after qualifying the visitor's need (understanding service type, rough scope)
- In-chat capture sends to same Formspree endpoint (xnjnzybj) with `kilde: chatbot` field to distinguish from regular contact form
- No conversation storage — ephemeral, lost when user closes the page. No GDPR concerns.

### Knowledge & AI backend
- System prompt with site content: services.ts data, FAQ content, and key page copy fed into system prompt
- Quotes price RANGES from services.ts (e.g. "fra 15 000 kr") — consistent with site, doesn't commit to exact quotes
- Powered by Claude API (Haiku 4.5 for cost efficiency)
- API calls routed through Vercel serverless function (/api/chat) — keeps API key server-side, uses @astrojs/vercel adapter

### Claude's Discretion
- Teaser tooltip timing and animation
- Chat window sizing and layout
- Typing indicator design
- System prompt wording and structure
- Exact model selection within Claude family (Haiku vs Sonnet based on quality needs)
- How page context is passed to the system prompt

</decisions>

<specifics>
## Specific Ideas

- Widget should match the dark theme (bg-surface-raised, brand cyan accent)
- Teaser message in Norwegian to feel native, not like a third-party widget
- Page-awareness should feel natural — not "I see you're on the nettbutikk page" but rather naturally discussing relevant topics

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `FloatingNav.tsx`: Fixed-position React island pattern — same approach for chat bubble
- `ContactForm.tsx`: Formspree integration with `kilde` field — reuse for in-chat capture
- `services.ts`: Complete service metadata (7 services with slug, name, tagline, priceRange) — feed into system prompt
- `PrisKalkulatorIsland.tsx`: Multi-step React island with Framer Motion animations — pattern reference
- UI components (Button, Card): Consistent styling to match

### Established Patterns
- React islands with `client:load` or `client:visible` in Astro
- Framer Motion for animations (AnimatePresence, motion components)
- Tailwind 4 with custom brand tokens (bg-surface, bg-surface-raised, text-brand)
- TypeScript strict mode throughout

### Integration Points
- `BaseLayout.astro`: Where the chat widget component would be added (appears on all pages)
- `@astrojs/vercel`: May need SSR adapter for serverless function
- `src/config/services.ts`: Knowledge base source
- Current page URL passed as prop for page-awareness

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 12-ai-chatbot-widget*
*Context gathered: 2026-03-06*
