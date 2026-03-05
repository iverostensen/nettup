import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { duration } from '@/lib/animation';

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
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadFormData, setLeadFormData] = useState<LeadFormData>({
    navn: '',
    epost: '',
    melding: '',
  });
  const [leadFormError, setLeadFormError] = useState(false);

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

  // Teaser tooltip timer
  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
      return;
    }

    const showTimer = setTimeout(() => {
      if (!isOpen) setShowTeaser(true);
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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleBubbleClick = useCallback(() => {
    setShowTeaser(false);
    setIsOpen((prev) => !prev);
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);

    // Add empty assistant placeholder
    const assistantPlaceholder: ChatMessage = { role: 'assistant', content: '' };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.filter((m) => m.content !== WELCOME_MESSAGE.content || m.role !== 'assistant').length > 0
            ? updatedMessages
            : [userMessage],
          currentPage,
        }),
      });

      if (!response.ok) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: 'Beklager, noe gikk galt. Prøv igjen.',
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
            const parsed = JSON.parse(data) as { text?: string; error?: string };
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
                      message.content.split('\n').map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {lineIndex > 0 && <br />}
                          {line}
                        </span>
                      ))
                    ) : (
                      isStreaming && index === messages.length - 1 && (
                        <TypingIndicator />
                      )
                    )}
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

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-white/10 px-4 py-3">
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
                  onClick={sendMessage}
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
