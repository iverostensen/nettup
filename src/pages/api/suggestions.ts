export const prerender = false;

import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/config/chatbot';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SuggestionsRequest {
  messages: ChatMessage[];
  currentPage: string;
}

const MAX_MESSAGES = 20;

// Simple in-memory rate limiting (half the chat limit — this fires automatically)
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

// Prevent memory leak: clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestLog) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      requestLog.delete(ip);
    } else {
      requestLog.set(ip, recent);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

function buildSuggestionsPrompt(currentPage: string): string {
  return `Du er en hjelper som genererer oppfølgingsspørsmål for en chatbot på nettup.no.

Chatboten opererer under følgende system-prompt — generer KUN spørsmål den kan svare på:
---
${buildSystemPrompt(currentPage)}
---

Basert på samtalehistorikken, generer 3 korte oppfølgingsspørsmål på norsk som brukeren kan stille.
Svar KUN med en JSON-array med 3 strenger. Ingen annen tekst. Eksempel: ["Spørsmål 1?","Spørsmål 2?","Spørsmål 3?"]`;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    if (isRateLimited(clientAddress)) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = (await request.json()) as SuggestionsRequest;

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = body.messages.slice(-MAX_MESSAGES).map((msg) => ({
      role: msg.role,
      content: typeof msg.content === 'string' ? msg.content : '',
    }));

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: buildSuggestionsPrompt(body.currentPage ?? '/'),
      messages,
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const suggestions = JSON.parse(text) as string[];

    if (!Array.isArray(suggestions)) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ suggestions }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    // Suggestions are enhancement-only — never fail loudly
    return new Response(
      JSON.stringify({ suggestions: [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
