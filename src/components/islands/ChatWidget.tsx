import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { duration } from '@/lib/animation';
import { trackChatbotOpened, trackChatbotSuggestionClicked } from '@/lib/analytics';

interface ChatWidgetProps {
  currentPage: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface LeadFormData {
  navn: string;
  epost: string;
  melding: string;
}

const FORMSPREE_ID = 'xnjnzybj';
const TEASER_SHOW_DELAY = 5000;
const TEASER_HIDE_DELAY = 10000;
const LEAD_PROMPT_AFTER_RESPONSES = 3;

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Hei! Jeg er Nettup sin AI-assistent. Hvordan kan jeg hjelpe deg i dag?',
};

const QUICK_REPLIES = [
  'Hva koster en nettside?',
  'Hva tilbyr dere?',
  'Hvordan kommer jeg i gang?',
];

// Inline SVG icons to avoid icon library dependency
function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    </svg>
  );
}

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];

  const formatInline = (line: string, keyPrefix: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={`${keyPrefix}-b-${match.index}`} className="font-semibold">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [line];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const bulletMatch = line.match(/^[-*]\s+(.+)/);

    if (bulletMatch) {
      // Collect consecutive bullet items
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^[-*]\s+(.+)/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      result.push(
        <ul key={`ul-${i}`} className="my-1 ml-3 list-disc space-y-0.5">
          {items.map((item, j) => (
            <li key={j}>{formatInline(item, `li-${i}-${j}`)}</li>
          ))}
        </ul>
      );
    } else {
      if (line.trim() === '') {
        result.push(<br key={`br-${i}`} />);
      } else {
        result.push(
          <span key={`p-${i}`}>
            {i > 0 && lines[i - 1]?.trim() !== '' && !lines[i - 1]?.match(/^[-*]\s+/) && <br />}
            {formatInline(line, `l-${i}`)}
          </span>
        );
      }
      i++;
    }
  }

  return result;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-2 w-2 rounded-full bg-text-muted/50 animate-pulse"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  );
}

export default function ChatWidget({ currentPage }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadFormData, setLeadFormData] = useState<LeadFormData>({
    navn: '',
    epost: '',
    melding: '',
  });
  const [leadFormError, setLeadFormError] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<{ path: string; label: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Count assistant responses (excluding welcome message)
  const assistantResponseCount = messages.filter(
    (m) => m.role === 'assistant' && m.content !== WELCOME_MESSAGE.content
  ).length;

  const shouldShowLeadPrompt =
    assistantResponseCount >= LEAD_PROMPT_AFTER_RESPONSES &&
    !showLeadForm &&
    !leadSubmitted;

  // Restore chat history from sessionStorage on mount
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

  // Persist chat history to sessionStorage on every messages change
  useEffect(() => {
    try {
      sessionStorage.setItem('nettup_chat', JSON.stringify({ messages }));
    } catch {
      // Storage quota or unavailable — fail silently
    }
  }, [messages]);

  // Teaser tooltip timer
  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
      return;
    }

    const showTimer = setTimeout(() => {
      if (!isOpen) {
        setShowTeaser(true);
        setHasUnread(true);
      }
    }, TEASER_SHOW_DELAY);

    return () => clearTimeout(showTimer);
  }, [isOpen]);

  // Auto-hide teaser after 10 seconds
  useEffect(() => {
    if (!showTeaser) return;

    const hideTimer = setTimeout(() => {
      setShowTeaser(false);
    }, TEASER_HIDE_DELAY);

    return () => clearTimeout(hideTimer);
  }, [showTeaser]);

  // Auto-scroll to bottom on new messages or when suggestions appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, suggestions]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to let animation start
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key closes chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const fetchSuggestions = useCallback(async (currentMessages: ChatMessage[]) => {
    const hasExchange = currentMessages.some((m) => m.role === 'user');
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

  // After streaming completes, fetch suggestions
  useEffect(() => {
    if (!isStreaming && messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && lastMsg.content) {
        fetchSuggestions(messages);
      }
    }
  }, [isStreaming]); // intentionally only trigger on isStreaming change

  const handleBubbleClick = useCallback(() => {
    setShowTeaser(false);
    setHasUnread(false);
    setIsOpen((prev) => {
      if (!prev) trackChatbotOpened();
      return !prev;
    });
  }, []);

  const sendMessage = useCallback(async (overrideText?: string) => {
    const trimmed = (overrideText !== undefined ? overrideText : input).trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setSuggestions([]);
    setPendingNavigation(null);
    setIsStreaming(true);

    // Add empty assistant placeholder
    const assistantPlaceholder: ChatMessage = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.filter(
            (m) => !(m.role === 'assistant' && m.content === WELCOME_MESSAGE.content)
          ),
          currentPage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as { error?: string };
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: errorData.error ?? 'Beklager, noe gikk galt. Prøv igjen.',
          };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep the last potentially incomplete line in the buffer
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith('data: ')) continue;

          const data = trimmedLine.slice(6);

          if (data === '[DONE]') {
            setIsStreaming(false);
            return;
          }

          try {
            const parsed = JSON.parse(data) as { text?: string; error?: string; tool?: string; path?: string; label?: string };
            if (parsed.error) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: parsed.error ?? 'Beklager, noe gikk galt.',
                };
                return updated;
              });
              setIsStreaming(false);
              return;
            }
            if (parsed.text) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + parsed.text,
                  };
                }
                return updated;
              });
            }
            if (parsed.tool === 'navigate_to_page' && parsed.path && parsed.label) {
              setPendingNavigation({ path: parsed.path, label: parsed.label });
            }
          } catch {
            // Skip unparseable lines
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Beklager, noe gikk galt. Prøv igjen.',
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, currentPage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const handleLeadSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadFormError(false);

    if (!leadFormData.navn.trim() || !leadFormData.epost.trim()) return;

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          navn: leadFormData.navn,
          email: leadFormData.epost,
          melding: leadFormData.melding || 'Fra chatbot-samtale',
          kilde: 'chatbot',
        }),
      });

      if (response.ok) {
        setLeadSubmitted(true);
        setShowLeadForm(false);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Takk! Vi tar kontakt snart.' },
        ]);
      } else {
        setLeadFormError(true);
      }
    } catch {
      setLeadFormError(true);
    }
  }, [leadFormData]);

  const animationProps = shouldReduceMotion
    ? { initial: false as const }
    : {};

  return (
    <>
      {/* Teaser tooltip */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: shouldReduceMotion ? 0 : duration.normal }}
            className="fixed bottom-[5.5rem] right-6 z-40 max-w-[200px] rounded-xl bg-surface-raised border border-white/10 px-4 py-2.5 shadow-xl sm:bottom-[5.5rem] sm:right-6"
          >
            <p className="text-sm text-text">Lurer du på noe?</p>
            {/* Small triangle pointer */}
            <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b border-r border-white/10 bg-surface-raised" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...animationProps}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              duration: shouldReduceMotion ? 0 : duration.normal,
              ease: 'easeOut',
            }}
            style={{ transformOrigin: 'bottom right' }}
            role="dialog"
            aria-label="Chat med Nettup AI"
            className={cn(
              'fixed z-[60] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-raised shadow-2xl',
              // Mobile: near full screen
              'inset-x-4 top-4 bottom-20',
              // Desktop: fixed panel above bubble
              'sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[520px] sm:w-[380px]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-brand" />
                <span className="text-sm font-semibold text-text">Nettup AI</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/10 hover:text-text"
                aria-label="Lukk chat"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                      message.role === 'user'
                        ? 'bg-brand/20 text-text'
                        : 'bg-white/5 text-text'
                    )}
                  >
                    {message.content ? (
                      message.role === 'assistant'
                        ? renderMarkdown(message.content)
                        : message.content
                    ) : index === messages.length - 1 ? (
                      isStreaming
                        ? <TypingIndicator />
                        : pendingNavigation
                          ? renderMarkdown('Her finner du mer informasjon:')
                          : null
                    ) : null}
                  </div>
                </div>
              ))}

              {/* Lead capture prompt */}
              {shouldShowLeadPrompt && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setShowLeadForm(true)}
                    className="rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-medium text-brand transition-colors hover:bg-brand/20"
                  >
                    Vil du at vi tar kontakt?
                  </button>
                </div>
              )}

              {/* In-chat lead form */}
              {showLeadForm && !leadSubmitted && (
                <div className="rounded-xl border border-white/10 bg-surface p-3.5">
                  <p className="mb-3 text-xs font-medium text-text-muted">
                    Legg igjen kontaktinfo, så tar vi kontakt:
                  </p>
                  <form onSubmit={handleLeadSubmit} className="space-y-2.5">
                    <input
                      type="text"
                      placeholder="Navn *"
                      value={leadFormData.navn}
                      onChange={(e) =>
                        setLeadFormData((prev) => ({ ...prev, navn: e.target.value }))
                      }
                      required
                      className="w-full rounded-lg border border-white/10 bg-surface-raised px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:border-brand focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="E-post *"
                      value={leadFormData.epost}
                      onChange={(e) =>
                        setLeadFormData((prev) => ({ ...prev, epost: e.target.value }))
                      }
                      required
                      className="w-full rounded-lg border border-white/10 bg-surface-raised px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:border-brand focus:outline-none"
                    />
                    <textarea
                      placeholder="Melding (valgfritt)"
                      value={leadFormData.melding}
                      onChange={(e) =>
                        setLeadFormData((prev) => ({ ...prev, melding: e.target.value }))
                      }
                      rows={2}
                      className="w-full resize-none rounded-lg border border-white/10 bg-surface-raised px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus:border-brand focus:outline-none"
                    />
                    {leadFormError && (
                      <p className="text-xs text-red-400">Noe gikk galt. Prøv igjen.</p>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-brand-light"
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLeadForm(false)}
                        className="rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:text-text"
                      >
                        Avbryt
                      </button>
                    </div>
                  </form>
                  <a
                    href="/kontakt"
                    className="mt-2.5 block text-center text-xs text-brand hover:text-brand-light transition-colors"
                  >
                    Eller gå til kontaktskjemaet
                  </a>
                </div>
              )}

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

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-white/10 px-4 py-3">
              {messages.length === 1 && !isStreaming && (
                <div className="flex flex-wrap gap-2 pb-3">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => sendMessage(reply)}
                      className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-text-muted transition-colors hover:border-brand/40 hover:bg-brand/10 hover:text-text"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
              {/* AI-generated suggestions */}
              {suggestions.length > 0 && !isStreaming && !isFetchingSuggestions && (
                <div className="flex flex-wrap gap-2 pb-3">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSuggestions([]);
                        trackChatbotSuggestionClicked(s);
                        sendMessage(s);
                      }}
                      className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-text-muted transition-colors hover:border-brand/40 hover:bg-brand/10 hover:text-text"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Skriv en melding..."
                  disabled={isStreaming}
                  className="flex-1 rounded-xl border border-white/10 bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-brand focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isStreaming}
                  aria-label="Send melding"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-surface transition-colors hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SendIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat bubble */}
      <motion.button
        initial={shouldReduceMotion ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 400, damping: 25, delay: 0.5 }
        }
        onClick={handleBubbleClick}
        aria-label={isOpen ? 'Lukk chat' : 'Åpne chat'}
        className={cn(
          'fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors',
          'sm:bottom-6 sm:right-6',
          'bg-brand hover:bg-brand-light',
          'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface'
        )}
      >
        {hasUnread && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-surface" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={shouldReduceMotion ? false : { rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : duration.fast }}
            >
              <CloseIcon className="h-6 w-6 text-surface" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={shouldReduceMotion ? false : { rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { rotate: -90, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : duration.fast }}
            >
              <ChatBubbleIcon className="h-6 w-6 text-surface" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
