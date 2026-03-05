import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { services } from '@/config/services';
import { springs, fadeIn, fadeUp } from '@/lib/animation';

type ServiceSlug = 'nettbutikk' | 'nettside' | 'landingsside';
type Phase = 'pick' | 'narrow' | 'result';

interface NarrowingOption {
  label: string;
  priceEstimate: string;
  monthlyNote?: string;
}

interface NarrowingQuestion {
  question: string;
  options: NarrowingOption[];
}

const narrowingQuestions: Record<ServiceSlug, NarrowingQuestion[]> = {
  nettside: [
    {
      question: 'Hvor mange sider trenger du?',
      options: [
        { label: '1–5 sider (enkel presentasjon)', priceEstimate: 'fra 15 000 kr' },
        { label: '6–15 sider (komplett nettsted)', priceEstimate: 'fra 22 000 kr' },
        { label: '16+ sider (stort nettsted)', priceEstimate: 'fra 35 000 kr' },
      ],
    },
  ],
  nettbutikk: [
    {
      question: 'Hvor mange produkter skal du selge?',
      options: [
        { label: 'Under 50 produkter', priceEstimate: 'fra 25 000 kr' },
        { label: '50–500 produkter', priceEstimate: 'fra 40 000 kr' },
        { label: '500+ produkter', priceEstimate: 'fra 60 000 kr' },
      ],
    },
  ],
  landingsside: [
    {
      question: 'Trenger du integrasjoner? (booking, betalingsløsning, skjema)',
      options: [
        { label: 'Nei, bare tekst og bilder', priceEstimate: 'fra 8 000 kr' },
        { label: 'Ja, én eller flere integrasjoner', priceEstimate: 'fra 12 000 kr' },
      ],
    },
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
  phase: 'pick',
  selectedService: null,
  narrowStep: 0,
  priceEstimate: null,
  monthlyNote: undefined,
};

const pickerServices: ServiceSlug[] = ['nettside', 'nettbutikk', 'landingsside'];

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

  function handlePickService(slug: ServiceSlug) {
    setDirection(1);
    setState({ ...initialState, phase: 'narrow', selectedService: slug });
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
    state.phase === 'pick'
      ? 'pick'
      : state.phase === 'narrow'
        ? `narrow-${state.narrowStep}`
        : 'result';

  return (
    <div className="mx-auto max-w-2xl">
      <AnimatePresence mode="wait" custom={direction}>
        {state.phase === 'pick' && (
          <motion.div
            key="pick"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springs.gentle}
            className="rounded-md border border-white/10 bg-surface-raised p-8"
          >
            <p className="mb-6 text-lg font-semibold text-text">
              Hvilken tjeneste er du interessert i?
            </p>
            <div className="flex flex-col gap-3">
              {pickerServices.map((slug) => {
                const svc = services.find((s) => s.slug === slug);
                if (!svc) return null;
                return (
                  <button
                    key={slug}
                    onClick={() => handlePickService(slug)}
                    className="w-full rounded-md border border-white/10 bg-surface-raised p-4 text-left transition-colors hover:border-brand/40 hover:bg-surface-raised/80"
                  >
                    <span className="block font-semibold text-text">{svc.name}</span>
                    <span className="block text-sm text-text-muted">{svc.tagline}</span>
                  </button>
                );
              })}
            </div>
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
                  <span className="block text-sm text-brand">{option.priceEstimate}</span>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
