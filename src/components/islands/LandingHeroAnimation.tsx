import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LandingHeroAnimation
 *
 * Animated component showing:
 * 1. Code being "typed"
 * 2. Transforms into a website preview
 * 3. Stats count up
 *
 * Designed for conversions - shows the transformation from code to result.
 */

const codeLines = [
  { text: '<html>', color: 'text-pink-400' },
  { text: '  <head>', color: 'text-pink-400' },
  { text: '    <title>Din Bedrift</title>', color: 'text-cyan-400' },
  { text: '  </head>', color: 'text-pink-400' },
  { text: '  <body>', color: 'text-pink-400' },
  { text: '    <h1>Velkommen</h1>', color: 'text-green-400' },
  { text: '  </body>', color: 'text-pink-400' },
  { text: '</html>', color: 'text-pink-400' },
];

const stats = [
  { value: 95, label: 'Ytelse', suffix: '' },
  { value: 1, label: 'Sekund', prefix: '<', suffix: 's' },
  { value: 100, label: 'SEO', suffix: '' },
];

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

function CountUp({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setCount(value);
      return;
    }

    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, reducedMotion]);

  return <>{prefix}{count}{suffix}</>;
}

function TypedCode({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setVisibleLines(codeLines.length);
      const timeout = setTimeout(onComplete, 500);
      return () => clearTimeout(timeout);
    }

    let lineCount = 0;
    const timer = setInterval(() => {
      lineCount++;
      setVisibleLines(lineCount);

      if (lineCount >= codeLines.length) {
        clearInterval(timer);
        setTimeout(onComplete, 600);
      }
    }, 180);

    return () => clearInterval(timer);
  }, [onComplete, reducedMotion]);

  return (
    <div className="font-mono text-xs sm:text-sm leading-relaxed">
      {codeLines.slice(0, visibleLines).map((line, i) => (
        <div key={i} className={line.color}>
          {line.text}
        </div>
      ))}
      {visibleLines < codeLines.length && (
        <span className="inline-block w-2 h-4 bg-brand animate-pulse" />
      )}
    </div>
  );
}

function WebsitePreview({ src }: { src: string }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-xl">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 p-2 bg-stone-800 border-b border-stone-700/50">
        <div className="w-2 h-2 rounded-full bg-red-500/70" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
        <div className="w-2 h-2 rounded-full bg-green-500/70" />
        <div className="ml-2 flex-1 h-4 rounded bg-stone-700 flex items-center px-2">
          <svg className="w-2 h-2 text-green-500/70 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-[8px] text-stone-400">salg.igive.no</span>
        </div>
      </div>

      {/* Website screenshot */}
      <img
        src={src}
        alt="iGive nettside - et eksempel på vårt arbeid"
        className="w-full h-auto"
        loading="eager"
      />
    </div>
  );
}

export default function LandingHeroAnimation({ previewImageSrc }: { previewImageSrc: string }) {
  const [showWebsite, setShowWebsite] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleCodeComplete = useCallback(() => {
    setShowWebsite(true);
    setTimeout(() => setShowStats(true), reducedMotion ? 100 : 500);
  }, [reducedMotion]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Device frame */}
      <div className="relative rounded-2xl border border-white/10 bg-surface-raised p-5 shadow-2xl shadow-brand/5">
        {/* Screen content */}
        <div className="relative min-h-[240px] sm:min-h-[280px]">
          <AnimatePresence mode="wait">
            {!showWebsite ? (
              <motion.div
                key="code"
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                transition={{ duration: 0.3 }}
              >
                <TypedCode onComplete={handleCodeComplete} />
              </motion.div>
            ) : (
              <motion.div
                key="website"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <WebsitePreview src={previewImageSrc} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats bar */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={reducedMotion ? {} : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reducedMotion ? 0 : 0.1 + 0.1 * i }}
                    >
                      <div className="text-xl sm:text-2xl font-bold text-brand">
                        <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                      </div>
                      <div className="text-xs text-text-muted">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative glow */}
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-brand/5 blur-2xl" />
    </div>
  );
}
