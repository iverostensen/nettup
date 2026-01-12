import { useState } from 'react';
import { motion } from 'framer-motion';

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    gtagLoaded?: boolean;
  }
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const FORMSPREE_ID = 'xnjnzybj';

export default function HeroMicroForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setError('E-post er påkrevd');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ugyldig e-postadresse');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    setStatus('submitting');
    setError('');

    try {
      const params = new URLSearchParams(window.location.search);
      const pakkeParam = params.get('pakke');
      const kildeParam = params.get('kilde');

      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          melding: 'Hurtighenvendelse fra hero-form',
          pakke: pakkeParam || 'Ikke valgt',
          kilde: kildeParam || 'hero-form',
        }),
      });

      if (response.ok) {
        setStatus('success');

        // Fire Google Ads conversion event (only if gtag loaded with consent)
        if (window.gtagLoaded && window.gtag) {
          window.gtag('event', 'conversion', {
            send_to: 'AW-17409050017/CONVERSION_LABEL',
          });
        }
      } else {
        setStatus('error');
        setError('Noe gikk galt. Vennligst prøv igjen.');
      }
    } catch {
      setStatus('error');
      setError('Noe gikk galt. Vennligst prøv igjen.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setError('');
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5 text-brand"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span className="text-sm font-medium">Takk! Vi kontakter deg snart.</span>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Honeypot field for spam protection */}
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            type="email"
            id="hero-email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="din@epost.no"
            className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-text placeholder:text-text-muted/50 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            disabled={status === 'submitting'}
            aria-label="E-postadresse"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'hero-email-error' : undefined}
          />
          {error && (
            <p id="hero-email-error" className="mt-1 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-lg bg-brand px-6 py-3 font-medium text-surface transition-colors hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
        >
          {status === 'submitting' ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sender...
            </span>
          ) : (
            'Få gratis tilbud'
          )}
        </button>
      </div>

      {status === 'error' && !error && (
        <div
          className="mt-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-center"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm text-red-400">
            Noe gikk galt.{' '}
            <button
              type="button"
              onClick={handleRetry}
              className="font-medium underline hover:text-red-300"
            >
              Prøv igjen
            </button>
          </p>
        </div>
      )}

      <p className="mt-2 text-xs text-text-muted/70">
        Vi svarer innen 24 timer. Ingen forpliktelser.
      </p>
    </form>
  );
}
