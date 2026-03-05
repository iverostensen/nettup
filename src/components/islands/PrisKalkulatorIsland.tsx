import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { services } from '@/config/services';
import { springs, fadeIn, fadeUp } from '@/lib/animation';

type ServiceSlug = 'nettbutikk' | 'nettside' | 'landingsside';
type StepOutcome = ServiceSlug | 'next';

interface WizardStep {
  question: string;
  yes: StepOutcome;
  no: StepOutcome;
}

const steps: WizardStep[] = [
  {
    question: 'Skal du selge produkter direkte på nettsiden?',
    yes: 'nettbutikk',
    no: 'next',
  },
  {
    question: 'Har du en eksisterende bedrift med flere sider med innhold (om oss, kontakt, tjenester osv.)?',
    yes: 'nettside',
    no: 'next',
  },
  {
    question: 'Skal du drive trafikk fra annonser eller kampanjer til én fokusert side?',
    yes: 'landingsside',
    no: 'next',
  },
  {
    question: 'Er du en liten bedrift som trenger å etablere en profesjonell tilstedeværelse på nett?',
    yes: 'nettside',
    no: 'landingsside',
  },
];

const TOTAL_QUESTIONS = steps.length;

export default function PrisKalkulatorIsland() {
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<ServiceSlug | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prefersReducedMotion = useReducedMotion();

  const step = steps[currentStep];

  function handleAnswer(answer: StepOutcome) {
    if (answer === 'next') {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      setDirection(1);
      setResult(answer);
    }
  }

  function handleYes() {
    handleAnswer(step.yes);
  }

  function handleNo() {
    handleAnswer(step.no);
  }

  function handleReset() {
    setDirection(-1);
    setResult(null);
    setCurrentStep(0);
  }

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

  const recommendedService = result
    ? services.find((s) => s.slug === result) ?? null
    : null;

  return (
    <div className="mx-auto max-w-2xl">
      <AnimatePresence mode="wait" custom={direction}>
        {result === null ? (
          <motion.div
            key={`step-${currentStep}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springs.gentle}
            className="rounded-md border border-white/10 bg-surface-raised p-8"
          >
            <p className="mb-4 text-xs text-text-muted">
              Spørsmål {currentStep + 1} av {TOTAL_QUESTIONS}
            </p>
            <p className="mb-6 text-lg font-semibold text-text">
              {step.question}
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleYes}
                className="rounded bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-light"
              >
                Ja
              </button>
              <button
                onClick={handleNo}
                className="rounded border border-white/20 px-6 py-3 font-semibold text-text-muted transition-colors hover:border-brand/40 hover:text-text"
              >
                Nei
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            variants={prefersReducedMotion ? fadeIn : fadeUp}
            initial="hidden"
            animate="visible"
            transition={springs.gentle}
            className="rounded-md border border-white/10 bg-surface-raised p-8"
          >
            {recommendedService ? (
              <>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand">
                  Anbefalt for deg
                </p>
                <h3 className="mb-1 text-2xl font-bold text-text">
                  {recommendedService.name}
                </h3>
                <p className="mb-6 text-text-muted">
                  {recommendedService.tagline}
                </p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-text">
                    {recommendedService.priceRange}
                  </span>
                  {recommendedService.monthlyPriceLabel && (
                    <p className="mt-1 text-sm text-text-muted">
                      + {recommendedService.monthlyPriceLabel} hosting og support
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={`/kontakt?tjeneste=${recommendedService.ctaParam}`}
                    className="inline-block rounded bg-brand px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-light"
                  >
                    Kom i gang
                  </a>
                  <button
                    onClick={handleReset}
                    className="text-sm text-text-muted underline-offset-2 transition-colors hover:text-text hover:underline"
                  >
                    Ta meg tilbake
                  </button>
                </div>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
