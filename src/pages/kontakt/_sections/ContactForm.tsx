import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    gtagLoaded?: boolean;
  }
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  navn: string;
  epost: string;
  telefon: string;
  pakke: string;
  melding: string;
  kilde: string;
}

import { pakker } from '@/config/pricing';

const FORMSPREE_ID = 'xnjnzybj';

const PAKKE_INFO = Object.fromEntries(
  pakker.map((p) => [
    p.id,
    {
      name: p.name,
      originalPrice: `${p.originalPrice} kr`,
      launchPrice: `${p.launchPrice} kr`,
      monthly: `${p.monthly} kr/mnd`,
    },
  ])
);

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState<FormData>({
    navn: '',
    epost: '',
    telefon: '',
    pakke: '',
    melding: '',
    kilde: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showBadge, setShowBadge] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  // Check for reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Read URL parameters for pre-selection and tracking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pakkeParam = params.get('pakke');
    const kildeParam = params.get('kilde');

    if (pakkeParam && ['enkel', 'standard', 'premium', 'usikker'].includes(pakkeParam)) {
      setFormData((prev) => ({ ...prev, pakke: pakkeParam }));
    }
    if (kildeParam) {
      setFormData((prev) => ({ ...prev, kilde: kildeParam }));
    }

    // Listen for package selection events
    const handlePakkeSelected = (e: CustomEvent) => {
      const { pakke } = e.detail;
      if (pakke && ['enkel', 'standard', 'premium'].includes(pakke)) {
        setFormData((prev) => ({ ...prev, pakke }));
        setShowBadge(true);
      }
    };

    window.addEventListener('pakkeSelected', handlePakkeSelected as (e: Event) => void);
    return () => {
      window.removeEventListener('pakkeSelected', handlePakkeSelected as (e: Event) => void);
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.navn.trim()) {
      newErrors.navn = 'Navn er påkrevd';
    }

    if (!formData.epost.trim()) {
      newErrors.epost = 'E-post er påkrevd';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.epost)) {
      newErrors.epost = 'Ugyldig e-postadresse';
    }

    // Melding is now optional - no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus('submitting');

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          navn: formData.navn,
          email: formData.epost,
          telefon: formData.telefon || 'Ikke oppgitt',
          pakke: formData.pakke || 'Ikke valgt',
          melding: formData.melding,
          kilde: formData.kilde || 'direkte',
        }),
      });

      if (response.ok) {
        setStatus('success');

        // Fire Google Ads conversion event (only if gtag loaded with consent)
        if (window.gtagLoaded && window.gtag) {
          window.gtag('event', 'conversion', {
            send_to: 'AW-17409050017/EvwaCNm05eFbEKGLpO1A',
          });
        }
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRetry = () => {
    setStatus('idle');
  };

  const motionProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
      };

  const inputClasses =
    'w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-text placeholder:text-text-muted/50 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand';
  const labelClasses = 'block text-sm font-medium text-text-muted mb-2';
  const errorClasses = 'mt-1 text-sm text-red-400';

  // Get selected package info
  const selectedPakke = formData.pakke && PAKKE_INFO[formData.pakke];

  return (
    <div className="mx-auto max-w-xl">
      {/* Package confirmation badge */}
      {selectedPakke && showBadge && (
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border border-brand/20 bg-brand/5 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4 text-brand"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-text">
                  {selectedPakke.name}-pakken valgt
                  <span className="ml-2 rounded bg-brand/20 px-2 py-0.5 text-xs font-medium text-brand">
                    Lanseringstilbud
                  </span>
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  <span className="line-through">{selectedPakke.originalPrice}</span>
                  {' '}
                  <span className="font-semibold text-brand">{selectedPakke.launchPrice}</span>
                  {' '}+ {selectedPakke.monthly}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowBadge(false)}
              className="shrink-0 rounded-lg p-1 text-text-muted/70 transition-colors hover:bg-white/5 hover:text-text"
              aria-label="Lukk"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      <div className="rounded-2xl border border-white/10 bg-surface-raised p-6 md:p-8">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              {...motionProps}
              className="rounded-xl border border-brand/20 bg-brand/5 p-8 text-center"
              role="status"
              aria-live="polite"
            >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-8 w-8 text-brand"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text">Takk for meldingen!</h3>
            <p className="mt-2 text-text-muted">Vi kontakter deg innen 24 timer.</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            {...motionProps}
            className="space-y-6"
          >
            {/* Honeypot field for spam protection */}
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label htmlFor="navn" className={labelClasses}>
                Navn <span className="text-brand">*</span>
              </label>
              <input
                type="text"
                id="navn"
                name="navn"
                value={formData.navn}
                onChange={handleChange}
                placeholder="Ditt navn"
                className={inputClasses}
                disabled={status === 'submitting'}
              />
              {errors.navn && <p className={errorClasses}>{errors.navn}</p>}
            </div>

            <div>
              <label htmlFor="epost" className={labelClasses}>
                E-post <span className="text-brand">*</span>
              </label>
              <input
                type="email"
                id="epost"
                name="epost"
                value={formData.epost}
                onChange={handleChange}
                placeholder="din@epost.no"
                className={inputClasses}
                disabled={status === 'submitting'}
              />
              {errors.epost && <p className={errorClasses}>{errors.epost}</p>}
            </div>

            <div>
              <label htmlFor="telefon" className={labelClasses}>
                Telefonnummer <span className="text-text-muted/50 font-normal">(valgfritt)</span>
              </label>
              <input
                type="tel"
                id="telefon"
                name="telefon"
                autoComplete="tel"
                value={formData.telefon}
                onChange={handleChange}
                placeholder="f.eks. 900 00 000"
                className={inputClasses}
                disabled={status === 'submitting'}
              />
            </div>

            {/* Pakke field hidden - tracked via URL params only to reduce form friction */}
            <input
              type="hidden"
              name="pakke"
              value={formData.pakke}
            />

            <div>
              <label htmlFor="melding" className={labelClasses}>
                Melding <span className="text-text-muted/50">(valgfritt)</span>
              </label>
              <textarea
                id="melding"
                name="melding"
                value={formData.melding}
                onChange={handleChange}
                placeholder="F.eks: Trenger nettside for håndverksbedrift med 5 sider og kontaktskjema"
                rows={3}
                className={`${inputClasses} resize-none`}
                disabled={status === 'submitting'}
              />
              {errors.melding && <p className={errorClasses}>{errors.melding}</p>}
            </div>

            {status === 'error' && (
              <div
                className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-center"
                role="alert"
                aria-live="assertive"
              >
                <p className="text-sm text-red-400">
                  Noe gikk galt. Vennligst prøv igjen eller send e-post til{' '}
                  <a href="mailto:post@nettup.no" className="underline hover:text-red-300">
                    post@nettup.no
                  </a>
                </p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-2 text-sm font-medium text-brand hover:text-brand-light"
                >
                  Prøv igjen
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full rounded-full bg-brand px-6 py-3 font-medium text-surface transition-colors hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50"
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
                'Send melding'
              )}
            </button>
          </motion.form>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
