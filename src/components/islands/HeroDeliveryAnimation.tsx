/**
 * HeroDeliveryAnimation
 *
 * Cinematic loop: 14-day delivery story.
 * Phase 1: Day counter 1→14 (state-driven, ~1.8s)
 * Phase 2: Website mockup sections snap in (stagger, ~0.5s)
 * Phase 3: "✓ Lansert!" badge pops in (~0.3s)
 * Rest: 2.5s pause, then resets and loops.
 *
 * useReducedMotion: renders static final state, no timers.
 * Cleanup: cancelled flag prevents updates after unmount (view transitions safe).
 *
 * Timing: animate() uses SECONDS (duration.*). setTimeout uses MILLISECONDS.
 */

import { useState, useEffect } from 'react';
import { useAnimate, stagger, useReducedMotion } from 'framer-motion';
import { duration } from '@/lib/animation';

function StaticDeliveryDone(): JSX.Element {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface-raised p-6 shadow-2xl">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-brand" />
        <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
          Nettup leverer
        </span>
      </div>

      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-5xl font-bold tabular-nums text-brand leading-none">
          14
        </span>
        <span className="text-sm text-text-muted">/ 14 dager</span>
      </div>

      <div className="rounded-lg overflow-hidden border border-white/10">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-800/80 border-b border-white/5">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
          <div className="ml-2 flex-1 h-3 rounded bg-stone-700/80" />
        </div>
        <div className="p-2 space-y-1.5 bg-stone-950/60">
          <div className="h-6 rounded bg-white/10" />
          <div className="h-12 rounded bg-brand/20" />
          <div className="h-8 rounded bg-white/8" />
          <div className="h-5 rounded bg-white/5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand/15 border border-brand/30 py-2 px-4">
        <span className="text-brand text-sm font-semibold">✓ Lansert!</span>
        <span className="text-text-muted text-xs">⚡ &lt;1s</span>
        <span className="text-text-muted text-xs">💯 100</span>
      </div>
    </div>
  );
}

export default function HeroDeliveryAnimation(): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate();
  const [currentDay, setCurrentDay] = useState<number>(1);

  useEffect(() => {
    if (shouldReduceMotion) return;

    let cancelled = false;

    async function runSequence(): Promise<void> {
      if (cancelled) return;

      // Phase 1: Day counter ticks 1 → 14 over ~1.8s
      const tickMs = 130; // ms — NOT seconds
      const dayInterval = setInterval(() => {
        setCurrentDay(d => {
          if (d >= 14) { clearInterval(dayInterval); return 14; }
          return d + 1;
        });
      }, tickMs);
      await new Promise<void>(resolve => setTimeout(resolve, 14 * tickMs + 150)); // ms
      clearInterval(dayInterval);

      if (cancelled) return;

      // Phase 2: Website sections snap in with stagger
      // duration values are SECONDS (animation.ts tokens)
      await animate(
        '.website-section',
        { opacity: [0, 1], y: [6, 0] },
        { delay: stagger(0.08), duration: duration.fast }
      );

      if (cancelled) return;

      // Phase 3: Lansert! badge pops in
      await animate(
        '.lansert-badge',
        { opacity: [0, 1], scale: [0.8, 1.05, 1] },
        { duration: duration.normal }
      );

      if (cancelled) return;

      // Rest state: 2.5s pause — ms
      await new Promise<void>(resolve => setTimeout(resolve, 2500));

      if (cancelled) return;

      // Reset to initial state instantly
      setCurrentDay(1);
      await animate('.website-section', { opacity: 0, y: 6 }, { duration: 0 });
      await animate('.lansert-badge', { opacity: 0, scale: 0.8 }, { duration: 0 });

      // Loop
      if (!cancelled) runSequence();
    }

    // Start after outer springPop container settles (~0.35s spring + buffer)
    const initialTimer = setTimeout(() => runSequence(), 800); // ms

    return () => {
      cancelled = true;
      clearTimeout(initialTimer);
    };
  }, [animate, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <StaticDeliveryDone />;
  }

  return (
    <div
      ref={scope}
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface-raised p-6 shadow-2xl"
    >
      {/* Header row */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-brand" />
        <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
          Nettup leverer
        </span>
      </div>

      {/* Day counter — Phase 1 */}
      <div className="day-counter mb-4 flex items-baseline gap-2">
        <span className="text-5xl font-bold tabular-nums text-brand leading-none">
          {currentDay}
        </span>
        <span className="text-sm text-text-muted">/ 14 dager</span>
      </div>

      {/* Browser mockup — Phase 2 */}
      <div className="rounded-lg overflow-hidden border border-white/10">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-800/80 border-b border-white/5">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
          <div className="ml-2 flex-1 h-3 rounded bg-stone-700/80" />
        </div>
        {/* Mockup sections — initially opacity-0 via Tailwind class */}
        <div className="p-2 space-y-1.5 bg-stone-950/60">
          <div className="website-section h-6 rounded bg-white/10 opacity-0" />
          <div className="website-section h-12 rounded bg-brand/20 opacity-0" />
          <div className="website-section h-8 rounded bg-white/8 opacity-0" />
          <div className="website-section h-5 rounded bg-white/5 opacity-0" />
        </div>
      </div>

      {/* Lansert badge — Phase 3 — initially opacity-0 scale-[0.8] */}
      <div
        className="lansert-badge mt-4 flex items-center justify-center gap-2 rounded-full bg-brand/15 border border-brand/30 py-2 px-4 opacity-0"
        style={{ scale: 0.8 }}
      >
        <span className="text-brand text-sm font-semibold">✓ Lansert!</span>
        <span className="text-text-muted text-xs">⚡ &lt;1s</span>
        <span className="text-text-muted text-xs">💯 100</span>
      </div>
    </div>
  );
}
