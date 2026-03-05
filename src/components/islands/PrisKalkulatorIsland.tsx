import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { services } from '@/config/services';
import { springs, fadeIn, fadeUp } from '@/lib/animation';

type ServiceSlug = 'nettbutikk' | 'nettside' | 'landingsside';
type Phase = 'goal' | 'recommend' | 'narrow' | 'result';

interface GoalOption {
  label: string;
  subLabel: string;
  service: ServiceSlug;
}

interface NarrowingOption {
  label: string;
  priceEstimate: string;
  monthlyNote?: string;
}

interface NarrowingQuestion {
  question: string;
  options: NarrowingOption[];
}

const goalOptions: GoalOption[] = [
  {
    label: 'Få flere kunder til bedriften',
    subLabel: 'Profesjonell nettside som konverterer besøkende',
    service: 'nettside',
  },
  {
    label: 'Selge produkter på nett',
    subLabel: 'Komplett nettbutikk med betaling og lagerstyring',
    service: 'nettbutikk',
  },
  {
    label: 'Markedsføre en kampanje eller tilbud',
    subLabel: 'En fokusert landingsside som overbeviser',
    service: 'landingsside',
  },
];

const narrowingQuestions: Record<ServiceSlug, NarrowingQuestion[]> = {
  nettside: [
    {
      question: 'Hvor mange sider trenger du?',
      options: [
        { label: '1–5 sider (enkel presentasjon)', priceEstimate: '' },
        { label: '6–15 sider (komplett nettsted)', priceEstimate: '' },
        { label: '16+ sider (stort nettsted)', priceEstimate: '' },
      ],
    },
    {
      question: 'Trenger du å kunne oppdatere innholdet selv?',
      options: [
        { label: 'Nei, jeg bytter sjelden innhold', priceEstimate: 'fra 8 000 kr' },
        { label: 'Ja, med et enkelt CMS-panel', priceEstimate: 'fra 12 000 kr' },
      ],
    },
  ],
  nettbutikk: [
    {
      question: 'Hvor mange produkter skal du selge?',
      options: [
        { label: 'Under 50 produkter', priceEstimate: '' },
        { label: '50–500 produkter', priceEstimate: '' },
        { label: '500+ produkter', priceEstimate: '' },
      ],
    },
    {
      question: 'Trenger du integrasjon med eksisterende systemer?',
      options: [
        { label: 'Nei, jeg starter fra scratch', priceEstimate: 'fra 15 000 kr' },
        { label: 'Ja, koble til regnskapsprogram eller ERP', priceEstimate: 'fra 28 000 kr' },
      ],
    },
  ],
  landingsside: [
    {
      question: 'Trenger du integrasjoner? (booking, betaling, skjema)',
      options: [
        { label: 'Nei, bare tekst og bilder', priceEstimate: '' },
        { label: 'Ja, én eller flere integrasjoner', priceEstimate: '' },
      ],
    },
    {
      question: 'Hva er formålet med siden?',
      options: [
        { label: 'Kampanjeside (for annonser, kortvarig)', priceEstimate: 'fra 4 500 kr' },
        { label: 'Permanent side med SEO-fokus', priceEstimate: 'fra 7 500 kr' },
      ],
    },
  ],
};

const includedItems: Record<ServiceSlug, string[]> = {
  nettside: [
    'Responsivt design — mobil, tablet og desktop',
    'Skreddersydd design — ingen maler',
    'Grunnleggende SEO og kontaktskjema',
    '30 dagers support etter lansering',
  ],
  nettbutikk: [
    'Shopify-oppsett med Vipps og kortbetaling',
    'Produktkatalog og handlekurv',
    'Lagerstyring og ordrehåndtering',
    '30 dagers support etter lansering',
  ],
  landingsside: [
    'Konverteringsfokusert layout',
    'Hurtig lasting — under 1 sekund',
    'Kontaktskjema eller lead-capture',
  ],
};

interface State {
  phase: Phase;
  selectedService: ServiceSlug | null;
  narrowStep: number;
  priceEstimate: string | null;
  monthlyNote?: string;
}

const initialState: State = {
  phase: 'goal',
  selectedService: null,
  narrowStep: 0,
  priceEstimate: null,
  monthlyNote: undefined,
};

export default function PrisKalkulatorIsland() {
  const [state, setState] = useState<State>(initialState);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prefersReducedMotion = useReducedMotion();

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir * 40,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir * -40,
    }),
  };

  function handleGoalSelect(option: GoalOption) {
    setDirection(1);
    setState({ ...initialState, phase: 'recommend', selectedService: option.service });
  }

  function handleRecommendContinue() {
    setDirection(1);
    setState((prev) => ({ ...prev, phase: 'narrow', narrowStep: 0 }));
  }

  function handleNarrowOption(option: NarrowingOption) {
    const { selectedService, narrowStep } = state;
    if (!selectedService) return;

    const questions = narrowingQuestions[selectedService];
    const nextStep = narrowStep + 1;

    if (nextStep < questions.length) {
      setDirection(1);
      setState((prev) => ({ ...prev, narrowStep: nextStep }));
    } else {
      setDirection(1);
      setState((prev) => ({
        ...prev,
        phase: 'result',
        priceEstimate: option.priceEstimate,
        monthlyNote: option.monthlyNote,
      }));
    }
  }

  function handleReset() {
    setDirection(-1);
    setState(initialState);
  }

  const selectedServiceData = state.selectedService
    ? services.find((s) => s.slug === state.selectedService) ?? null
    : null;

  const currentNarrowQuestion =
    state.selectedService && state.phase === 'narrow'
      ? narrowingQuestions[state.selectedService][state.narrowStep]
      : null;

  const totalQuestions = state.selectedService
    ? narrowingQuestions[state.selectedService].length
    : 0;

  const animKey =
    state.phase === 'goal'
      ? 'goal'
      : state.phase === 'recommend'
        ? 'recommend'
        : state.phase === 'narrow'
          ? `narrow-${state.narrowStep}`
          : 'result';

  return (
    <div className="mx-auto max-w-2xl">
      <AnimatePresence mode="wait" custom={direction}>
        {state.phase === 'goal' && (
          <motion.div
            key="goal"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springs.gentle}
            className="rounded-md border border-white/10 bg-surface-raised p-8"
          >
            <p className="mb-4 text-sm text-text-muted">
              Svar på 2–3 spørsmål og få et prisestimat — tar under ett minutt.
            </p>
            <p className="mb-6 text-lg font-semibold text-text">
              Hva er målet ditt?
            </p>
            <div className="flex flex-col gap-3">
              {goalOptions.map((option) => (
                <button
                  key={option.service}
                  onClick={() => handleGoalSelect(option)}
                  className="w-full rounded-md border border-white/10 bg-surface-raised p-4 text-left transition-colors hover:border-brand/40 hover:bg-surface-raised/80"
                >
                  <span className="block font-semibold text-text">{option.label}</span>
                  <span className="block text-sm text-text-muted">{option.subLabel}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {state.phase === 'recommend' && selectedServiceData && (
          <motion.div
            key="recommend"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springs.gentle}
            className="rounded-md border border-white/10 bg-surface-raised p-8"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-brand">
              Vi anbefaler
            </p>
            <h3 className="mb-1 text-xl font-bold text-text">{selectedServiceData.name}</h3>
            <p className="mb-4 text-text-muted">{selectedServiceData.tagline}</p>
            <p className="mb-6 text-sm text-text-muted">
              Basert på målet ditt er dette det beste utgangspunktet. La oss finne riktig pris.
            </p>
            <button
              onClick={handleRecommendContinue}
              className="w-full rounded-md border border-white/10 bg-surface-raised p-4 text-center font-semibold text-text transition-colors hover:border-brand/40 hover:bg-surface-raised/80"
            >
              Se spørsmålene &rarr;
            </button>
          </motion.div>
        )}

        {state.phase === 'narrow' && currentNarrowQuestion && (
          <motion.div
            key={animKey}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springs.gentle}
            className="rounded-md border border-white/10 bg-surface-raised p-8"
          >
            <p className="mb-4 text-xs text-text-muted">
              Spørsmål {state.narrowStep + 1} av {totalQuestions}
            </p>
            <p className="mb-6 text-lg font-semibold text-text">
              {currentNarrowQuestion.question}
            </p>
            <div className="flex flex-col gap-3">
              {currentNarrowQuestion.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleNarrowOption(option)}
                  className="w-full rounded-md border border-white/10 bg-surface-raised p-4 text-left transition-colors hover:border-brand/40 hover:bg-surface-raised/80"
                >
                  <span className="block text-sm font-medium text-text">{option.label}</span>
                  {option.priceEstimate && (
                    <span className="block text-sm text-brand">{option.priceEstimate}</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {state.phase === 'result' && selectedServiceData && (
          <motion.div
            key="result"
            variants={prefersReducedMotion ? fadeIn : fadeUp}
            initial="hidden"
            animate="visible"
            transition={springs.gentle}
            className="rounded-md border border-white/10 bg-surface-raised p-8"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand">
              Prisestimat for deg
            </p>
            <h3 className="mb-1 text-2xl font-bold text-text">
              {selectedServiceData.name}
            </h3>
            <p className="mb-6 text-text-muted">{selectedServiceData.tagline}</p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-text">{state.priceEstimate}</span>
              {selectedServiceData.monthlyPriceLabel && (
                <p className="mt-1 text-sm text-text-muted">
                  + {selectedServiceData.monthlyPriceLabel} hosting og support
                </p>
              )}
            </div>
            <ul className="mb-6 flex flex-col gap-2">
              {includedItems[state.selectedService!].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4 shrink-0 text-brand" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={`/kontakt?tjeneste=${selectedServiceData.ctaParam}`}
                className="inline-block rounded bg-brand px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-light"
              >
                Kom i gang
              </a>
              <button
                onClick={handleReset}
                className="text-sm text-text-muted underline-offset-2 transition-colors hover:text-text hover:underline"
              >
                Start på nytt
              </button>
              <a
                href={`/tjenester/${selectedServiceData.slug}`}
                className="text-sm text-text-muted underline-offset-2 transition-colors hover:text-text hover:underline"
              >
                Les mer om {selectedServiceData.name.toLowerCase()}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
