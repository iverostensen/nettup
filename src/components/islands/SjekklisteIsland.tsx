import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { trackLeadMagnetDownload } from '@/lib/analytics';
import { captureUtmParams, getUtmParams } from '@/lib/utm';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type FormStatus = 'idle' | 'submitting' | 'error' | 'unlocked';

const SJEKKLISTE_FORMSPREE_ID = 'xnjnzybj';

const CHECKLIST_ITEMS = [
  {
    title: 'Mobilvennlig design',
    description:
      'Over 70 % av besøkende bruker mobil. Nettsiden må fungere perfekt på alle skjermstørrelser.',
  },
  {
    title: 'Rask lastetid',
    description:
      'Google anbefaler under 2,5 sekunder. Trege sider mister besøkende og synker i søk.',
  },
  {
    title: 'SSL-sertifikat (HTTPS)',
    description:
      'Obligatorisk for tillit og SEO. Nettlesere merker usikre sider som farlige.',
  },
  {
    title: 'Søkemotoroptimalisering (SEO)',
    description:
      'Riktige titler, metabeskrivelser og strukturerte data gjør at kundene finner deg.',
  },
  {
    title: 'Tydelig kontaktinformasjon',
    description:
      'Telefonnummer, e-post og kontaktskjema synlig på alle sider. Gjør det enkelt å nå deg.',
  },
  {
    title: 'Personvernerklæring',
    description:
      'Påkrevd etter GDPR. Fortell besøkende hvilke data du samler og hvorfor.',
  },
  {
    title: 'Tilgjengelighet (WCAG)',
    description:
      'Nettsiden må være brukbar for alle, inkludert personer med nedsatt syn eller motorikk.',
  },
  {
    title: 'Moderne design',
    description:
      'Første inntrykk teller. Utdatert design signaliserer at bedriften ikke følger med.',
  },
  {
    title: 'Analyser og sporing',
    description:
      'Uten data vet du ikke hva som fungerer. Sett opp cookiefri analyse fra dag én.',
  },
  {
    title: 'Tydelig handlingsoppfordring (CTA)',
    description:
      'Hver side trenger en klar neste handling: "Ta kontakt", "Få tilbud", "Les mer".',
  },
] as const;

function NumberBadge({
  num,
  locked,
}: {
  num: number;
  locked: boolean;
}) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        locked
          ? 'bg-white/5 text-text-muted'
          : 'bg-brand/10 text-brand'
      }`}
    >
      {num}
    </span>
  );
}

function ChecklistItem({
  num,
  title,
  description,
  locked,
}: {
  num: number;
  title: string;
  description: string;
  locked: boolean;
}) {
  return (
    <li className="flex gap-4">
      <NumberBadge num={num} locked={locked} />
      <div>
        <p className="text-base font-bold text-text">{title}</p>
        <p className="text-sm text-text-muted">{description}</p>
      </div>
    </li>
  );
}

export default function SjekklisteIsland() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [navn, setNavn] = useState('');
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    captureUtmParams();
  }, []);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!navn.trim()) errors.navn = 'Navn er påkrevd';
    if (!email.trim()) {
      errors.email = 'E-post er påkrevd';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Ugyldig e-postadresse';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const response = await fetch(
        `https://formspree.io/f/${SJEKKLISTE_FORMSPREE_ID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            navn,
            email,
            kilde: 'sjekkliste',
            ...getUtmParams(),
          }),
        },
      );
      if (response.ok) {
        setStatus('unlocked');
        trackLeadMagnetDownload();
        if (
          localStorage.getItem('nettup_ads_consent') === 'granted' &&
          window.fbq
        ) {
          window.fbq('track', 'Lead', { content_name: 'Sjekkliste 2026' });
        }
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const isLocked = status !== 'unlocked';
  const skipAnimation = prefersReducedMotion || false;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Items 1-3: always visible */}
      <ol className="flex flex-col gap-4">
        {CHECKLIST_ITEMS.slice(0, 3).map((item, i) => (
          <ChecklistItem
            key={i}
            num={i + 1}
            title={item.title}
            description={item.description}
            locked={false}
          />
        ))}
      </ol>

      {/* Items 4-10: blurred when locked */}
      <div className="relative mt-6">
        <motion.div
          aria-hidden={isLocked}
          className={isLocked ? 'pointer-events-none' : ''}
          initial={{ filter: 'blur(8px)' }}
          animate={{
            filter: status === 'unlocked' ? 'blur(0px)' : 'blur(8px)',
          }}
          transition={
            skipAnimation
              ? { duration: 0 }
              : { duration: 0.4, ease: 'easeOut' }
          }
        >
          <ol start={4} className="flex flex-col gap-4">
            {CHECKLIST_ITEMS.slice(3).map((item, i) => (
              <motion.li
                key={i}
                className="flex gap-4"
                initial={
                  status === 'unlocked' && !skipAnimation
                    ? { opacity: 0, y: 8 }
                    : undefined
                }
                animate={
                  status === 'unlocked' ? { opacity: 1, y: 0 } : undefined
                }
                transition={
                  skipAnimation
                    ? { duration: 0 }
                    : { duration: 0.4, delay: 0.4 + i * 0.08 }
                }
              >
                <NumberBadge num={i + 4} locked={isLocked} />
                <div>
                  <p className="text-base font-bold text-text">{item.title}</p>
                  <p className="text-sm text-text-muted">{item.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* Gate form overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-sm rounded-xl border border-white/10 bg-surface-raised p-6 md:p-8">
              <div className="flex flex-col items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6 text-brand"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <h2 className="text-lg font-bold text-text">
                  Få hele sjekklisten
                </h2>
                <p className="text-center text-sm text-text-muted">
                  Skriv inn navn og e-post så sender vi den til deg.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
                <input
                  type="text"
                  name="_gotcha"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <label htmlFor="sjekk-navn" className="text-sm font-normal text-text">
                    Navn
                  </label>
                  <input
                    id="sjekk-navn"
                    type="text"
                    value={navn}
                    onChange={(e) => {
                      setNavn(e.target.value);
                      if (fieldErrors.navn) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.navn;
                          return next;
                        });
                      }
                    }}
                    placeholder="Ditt navn"
                    disabled={status === 'submitting'}
                    aria-invalid={fieldErrors.navn ? 'true' : undefined}
                    aria-describedby={
                      fieldErrors.navn ? 'sjekk-navn-error' : undefined
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-text placeholder:text-text-muted/50 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                  {fieldErrors.navn && (
                    <p
                      id="sjekk-navn-error"
                      className="mt-1 text-sm text-red-400"
                      role="alert"
                    >
                      {fieldErrors.navn}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="sjekk-email"
                    className="text-sm font-normal text-text"
                  >
                    E-post
                  </label>
                  <input
                    id="sjekk-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.email;
                          return next;
                        });
                      }
                    }}
                    placeholder="din@epost.no"
                    disabled={status === 'submitting'}
                    aria-invalid={fieldErrors.email ? 'true' : undefined}
                    aria-describedby={
                      fieldErrors.email ? 'sjekk-email-error' : undefined
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-text placeholder:text-text-muted/50 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                  {fieldErrors.email && (
                    <p
                      id="sjekk-email-error"
                      className="mt-1 text-sm text-red-400"
                      role="alert"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="mt-2 w-full rounded-lg bg-brand px-6 py-3 font-normal text-surface transition-colors hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-50"
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
                    'Send meg sjekklisten'
                  )}
                </button>

                {status === 'error' && (
                  <p
                    className="mt-1 text-center text-sm text-red-400"
                    role="alert"
                    aria-live="assertive"
                  >
                    Noe gikk galt. Prøv igjen.
                  </p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Post-submit CTA card */}
      {status === 'unlocked' && (
        <motion.div
          className="mt-8 rounded-xl border border-white/10 bg-surface-raised p-6 text-center md:p-8"
          initial={skipAnimation ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            skipAnimation
              ? { duration: 0 }
              : { duration: 0.3, delay: 0.4 + 7 * 0.08 + 0.2 }
          }
        >
          <h2 className="text-xl font-bold text-text">
            Vil du at vi fikser dette for deg?
          </h2>
          <p className="mt-2 text-text-muted">
            Vi bygger moderne nettsider fra 399 kr/mnd. Null oppstart, ingen
            bindingstid.
          </p>
          <a
            href="/kontakt?tjeneste=nettside"
            className="mt-4 inline-block rounded-lg bg-brand px-6 py-3 font-normal text-surface transition-colors hover:bg-brand-light"
          >
            Ta kontakt
          </a>
        </motion.div>
      )}
    </div>
  );
}
