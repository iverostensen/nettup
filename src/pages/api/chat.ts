export const prerender = false;

import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '../../config/chatbot';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  currentPage: string;
}

const MAX_MESSAGES = 20;
const MAX_INPUT_LENGTH = 2000;

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

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

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    if (isRateLimited(clientAddress)) {
      return new Response(
        JSON.stringify({ error: 'For mange forespørsler. Vent litt og prøv igjen.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = (await request.json()) as ChatRequest;

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required and must not be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = body.messages.slice(-MAX_MESSAGES).map((msg) => ({
      role: msg.role,
      content: typeof msg.content === 'string' ? msg.content.slice(0, MAX_INPUT_LENGTH) : '',
    }));

    const currentPage = typeof body.currentPage === 'string' ? body.currentPage : '/';

    const client = new Anthropic({ apiKey });
    const systemPrompt = buildSystemPrompt(currentPage);

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let closed = false;
        const close = () => {
          if (!closed) {
            closed = true;
            controller.close();
          }
        };
        const enqueue = (chunk: Uint8Array) => {
          if (!closed) {
            controller.enqueue(chunk);
          }
        };

        try {
          stream.on('text', (text) => {
            enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          });

          stream.on('end', () => {
            enqueue(encoder.encode('data: [DONE]\n\n'));
            close();
          });

          stream.on('error', (error: Error) => {
            enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: error.message })}\n\n`
              )
            );
            close();
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Stream error';
          enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
          );
          close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
