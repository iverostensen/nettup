/**
 * HeroDeliveryAnimation
 *
 * Sequential loop: code-to-website delivery story.
 * Phase 1: Code editor — JSX lines appear one by one (~2s)
 * Phase 2: Crossfade — code fades/shrinks out while browser fades in simultaneously (~0.5s)
 * Phase 3: Browser — website sections build top-to-bottom (~1s)
 * Phase 4: "✓ Lansert!" badge pops in (~0.3s)
 * Rest: 2.5s pause, then resets and loops.
 *
 * useReducedMotion: renders static browser + badge, no timers.
 * Cleanup: cancelled flag prevents updates after unmount (view transitions safe).
 */

import { useEffect, useState } from 'react';
import { useAnimate, stagger, useReducedMotion } from 'framer-motion';
import { duration } from '@/lib/animation';

type Token = { t: string; c: 'dim' | 'kw' | 'str' | 'prop' | 'cyan' };
type CodeLine = { num: number; tokens: Token[] };

const d  = (t: string): Token => ({ t, c: 'dim'  });
const kw = (t: string): Token => ({ t, c: 'kw'   });
const s  = (t: string): Token => ({ t, c: 'str'  });
const p  = (t: string): Token => ({ t, c: 'prop' });
const cy = (t: string): Token => ({ t, c: 'cyan' });

const TOKEN_COLOR: Record<Token['c'], string> = {
  dim:  'text-white/30',
  kw:   'text-violet-400',
  str:  'text-amber-400',
  prop: 'text-sky-300',
  cyan: 'text-cyan-400',
};

const CODE_LINES: CodeLine[] = [
  { num: 1,  tokens: [kw('const'), d(' config = {')] },
  { num: 2,  tokens: [p('  site'), d(': '), s("'nettup.no'"), d(',')] },
  { num: 3,  tokens: [p('  locale'), d(': '), s("'nb-NO'"), d(',')] },
  { num: 4,  tokens: [p('  theme'), d(': '), s("'dark'"), d(',')] },
  { num: 5,  tokens: [d('}')] },
  { num: 6,  tokens: [] },
  { num: 7,  tokens: [kw('return'), d(' (')] },
  { num: 8,  tokens: [d('  <>')] },
  { num: 9,  tokens: [d('    <'), cy('Nav'), d(' brand={config.site} />')] },
  { num: 10, tokens: [d('    <'), cy('Hero'), d(' cta='), s('"Ta kontakt"'), d(' />')] },
  { num: 11, tokens: [d('    <'), cy('Footer'), d(' locale={config.locale} />')] },
  { num: 12, tokens: [d('  </>')] },
  { num: 13, tokens: [d(')')] },
];

function BrowserMockup({ animated }: { animated: boolean }) {
  const sc = animated ? 'browser-section opacity-0' : '';
  return (
    <div className="rounded-lg overflow-hidden border border-white/10">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#1c1c1e] border-b border-white/8">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <div className="ml-2 flex-1 h-3.5 rounded-md bg-white/8" />
      </div>

      <div className="bg-[#020617]">
        {/* Nav: logo + links + CTA */}
        <div className={`${sc} flex items-center justify-between px-4 py-2.5 border-b border-white/8`}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-brand" />
            <div className="w-12 h-2.5 rounded bg-white/80" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-1.5 rounded-full bg-white/25" />
            <div className="w-9 h-1.5 rounded-full bg-white/25" />
            <div className="w-7 h-1.5 rounded-full bg-white/25" />
            <div className="w-6 h-1.5 rounded-full bg-white/25" />
            <div className="ml-1 h-6 w-16 rounded-full bg-brand flex items-center justify-center shrink-0">
              <div className="w-8 h-1.5 rounded-full bg-white/60" />
            </div>
          </div>
        </div>

        {/* Hero: eyebrow + heading + body + dual CTAs | floating card */}
        <div className={`${sc} relative flex gap-3 overflow-hidden px-4 pt-4 pb-5 border-b border-white/5`}>
          <div className="absolute top-0 left-1/4 h-20 w-36 rounded-full bg-brand/15 blur-xl" />
          <div className="relative flex flex-1 flex-col gap-2">
            {/* Eyebrow badge */}
            <div className="mb-0.5 self-start flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5">
              <div className="h-1 w-1 rounded-full bg-brand" />
              <div className="h-1.5 w-14 rounded-full bg-brand/70" />
            </div>
            {/* Heading — taller rectangular bars suggest bold h1 */}
            <div className="h-4 w-full rounded bg-white/90" />
            <div className="h-4 w-[82%] rounded bg-white/90" />
            <div className="h-3 w-[52%] rounded bg-brand/60" />
            {/* Body text */}
            <div className="mt-0.5 space-y-1">
              <div className="h-1.5 w-full rounded-full bg-white/22" />
              <div className="h-1.5 w-[88%] rounded-full bg-white/22" />
              <div className="h-1.5 w-[68%] rounded-full bg-white/22" />
            </div>
            {/* CTAs */}
            <div className="mt-2 flex gap-2">
              <div className="h-6 w-20 rounded-full bg-brand flex items-center justify-center">
                <div className="w-9 h-1.5 rounded-full bg-white/70" />
              </div>
              <div className="h-6 w-20 rounded-full border border-white/25 bg-white/5 flex items-center justify-center">
                <div className="w-11 h-1.5 rounded-full bg-white/30" />
              </div>
            </div>
          </div>
          {/* Floating stats card */}
          <div className="relative w-[38%] shrink-0 rounded-xl border border-white/10 bg-white/5 p-2.5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="h-2 w-10 rounded-full bg-white/40" />
              <div className="h-1.5 w-4 rounded-full bg-green-400/60" />
            </div>
            <div className="h-px w-full bg-white/8" />
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <div className="h-1.5 w-8 rounded-full bg-white/20" />
                <div className="h-2 w-8 rounded-full bg-brand/80" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-1.5 w-10 rounded-full bg-white/20" />
                <div className="h-2 w-5 rounded-full bg-green-400/60" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-1.5 w-7 rounded-full bg-white/20" />
                <div className="h-2 w-9 rounded-full bg-brand/50" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-1.5 w-9 rounded-full bg-white/20" />
                <div className="h-2 w-6 rounded-full bg-green-400/40" />
              </div>
            </div>
            <div className="h-7 rounded-lg border border-brand/20 bg-brand/10 mt-1 flex items-center justify-center">
              <div className="w-12 h-1.5 rounded-full bg-brand/50" />
            </div>
          </div>
        </div>

        {/* Footer: logo+desc left | two link columns right | copyright */}
        <div className={`${sc} px-4 py-3 bg-white/3`}>
          <div className="mb-2.5 flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-brand/80" />
                <div className="h-2 w-10 rounded bg-white/70" />
              </div>
              <div className="h-1.5 w-24 rounded-full bg-white/18" />
              <div className="h-1.5 w-20 rounded-full bg-white/18" />
              <div className="mt-1.5 flex gap-1.5">
                <div className="h-4 w-4 rounded-md border border-white/10 bg-white/8" />
                <div className="h-4 w-4 rounded-md border border-white/10 bg-white/8" />
                <div className="h-4 w-4 rounded-md border border-white/10 bg-white/8" />
              </div>
            </div>
            <div className="flex gap-5">
              <div className="space-y-2">
                <div className="h-2 w-9 rounded bg-white/50" />
                <div className="h-1.5 w-8 rounded-full bg-white/18" />
                <div className="h-1.5 w-10 rounded-full bg-white/18" />
                <div className="h-1.5 w-7 rounded-full bg-white/18" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-8 rounded bg-white/50" />
                <div className="h-1.5 w-9 rounded-full bg-white/18" />
                <div className="h-1.5 w-7 rounded-full bg-white/18" />
                <div className="h-1.5 w-10 rounded-full bg-white/18" />
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-2">
            <div className="h-1.5 w-32 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StaticDeliveryDone() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface-raised p-8 shadow-2xl">
      <div className="mb-5">
        <BrowserMockup animated={false} />
      </div>
      <div className="flex items-center justify-center gap-2 rounded-full bg-brand/15 border border-brand/30 py-2.5 px-4">
        <span className="text-brand font-semibold">✓ Lansert!</span>
      </div>
    </div>
  );
}

export default function HeroDeliveryAnimation() {
  const shouldReduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate();
  const [buildPct, setBuildPct] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;

    let cancelled = false;
    let pctInterval: ReturnType<typeof setInterval> | null = null;

    async function runSequence(): Promise<void> {
      if (cancelled) return;

      // Reset to initial state instantly
      setBuildPct(0);
      animate('.code-view', { opacity: 1, x: 0 }, { duration: 0 });
      animate('.code-line', { opacity: 0, x: -4 }, { duration: 0 });
      animate('.build-progress', { opacity: 0 }, { duration: 0 });
      animate('.build-bar', { width: '0%' }, { duration: 0 });
      animate('.browser-view', { opacity: 0 }, { duration: 0 });
      animate('.browser-section', { opacity: 0, y: 4 }, { duration: 0 });
      await animate('.lansert-badge', { opacity: 0, scale: 0.8 }, { duration: 0 });

      if (cancelled) return;

      // Phase 1: Code lines appear one by one
      await animate(
        '.code-line',
        { opacity: [0, 1], x: [-4, 0] },
        { delay: stagger(0.18), duration: duration.normal }
      );

      if (cancelled) return;

      // Brief pause at "done coding"
      await new Promise<void>(resolve => setTimeout(resolve, 400));

      if (cancelled) return;

      // Phase 2a: Code exits, build progress overlay appears
      animate('.code-view', { opacity: 0, x: -20 }, { duration: duration.normal });
      await animate('.build-progress', { opacity: 1 }, { duration: duration.normal });

      if (cancelled) return;

      // Phase 2b: Progress bar fills 0→100% with counter (700ms)
      const BUILD_DURATION = 700;
      const TICK = 10;
      const TICKS = BUILD_DURATION / TICK;
      let pctValue = 0;
      pctInterval = setInterval(() => {
        pctValue = Math.min(100, Math.round(pctValue + 100 / TICKS));
        setBuildPct(pctValue);
        if (pctValue >= 100) {
          clearInterval(pctInterval!);
          pctInterval = null;
        }
      }, TICK);
      await animate('.build-bar', { width: '100%' }, { duration: BUILD_DURATION / 1000 });
      if (pctInterval) { clearInterval(pctInterval); pctInterval = null; }
      setBuildPct(100);

      if (cancelled) return;

      // Brief pause at 100%
      await new Promise<void>(resolve => setTimeout(resolve, 300));

      if (cancelled) return;

      // Phase 2c: Build progress exits, browser fades in
      animate('.build-progress', { opacity: 0 }, { duration: duration.normal });
      await animate('.browser-view', { opacity: 1 }, { duration: duration.normal });

      if (cancelled) return;

      // Phase 3: Website sections build top to bottom
      await animate(
        '.browser-section',
        { opacity: [0, 1], y: [4, 0] },
        { delay: stagger(0.15), duration: duration.normal }
      );

      if (cancelled) return;

      // Phase 4: Lansert! badge pops in
      await animate(
        '.lansert-badge',
        { opacity: [0, 1], scale: [0.8, 1.05, 1] },
        { duration: duration.normal }
      );

      if (cancelled) return;

      // Rest
      await new Promise<void>(resolve => setTimeout(resolve, 2500));

      if (cancelled) return;

      runSequence();
    }

    const initialTimer = setTimeout(() => runSequence(), 800);

    return () => {
      cancelled = true;
      clearTimeout(initialTimer);
      if (pctInterval) clearInterval(pctInterval);
    };
  }, [animate, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <StaticDeliveryDone />;
  }

  return (
    <div
      ref={scope}
      className="w-full max-w-md rounded-2xl border border-white/10 bg-surface-raised p-8 shadow-2xl"
    >
      {/* Overlay — code, build progress, and browser share the same grid cell */}
      <div className="grid mb-5">
        {/* Code editor — Phase 1 */}
        <div className="code-view row-start-1 col-start-1">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-stone-800/80 rounded-t-lg border border-white/10 border-b-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-text-muted font-mono">Page.tsx</span>
          </div>
          <div className="bg-stone-950/80 rounded-b-lg border border-white/10 border-t-0 px-4 py-3 space-y-1.5 font-mono text-sm">
            {CODE_LINES.map(line => (
              <div key={line.num} className="code-line flex items-center gap-3 opacity-0">
                <span className="text-white/20 text-xs w-4 shrink-0 text-right select-none tabular-nums">
                  {line.num}
                </span>
                <span>
                  {line.tokens.map((tok, i) => (
                    <span key={i} className={TOKEN_COLOR[tok.c]}>{tok.t}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Build progress — Phase 2 */}
        <div className="build-progress row-start-1 col-start-1 opacity-0 flex flex-col justify-center gap-3 px-1 py-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-muted font-mono">
              {buildPct < 35 ? 'Kompilerer TypeScript...' : buildPct < 70 ? 'Bygger assets...' : buildPct < 100 ? 'Deployer...' : 'Ferdig!'}
            </span>
            <span className="text-xs text-brand font-mono tabular-nums">{buildPct}%</span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="build-bar h-full bg-brand rounded-full"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* Browser preview — Phase 3 */}
        <div className="browser-view row-start-1 col-start-1 opacity-0">
          <BrowserMockup animated={true} />
        </div>
      </div>

      {/* Lansert badge — Phase 4 */}
      <div
        className="lansert-badge flex items-center justify-center gap-2 rounded-full bg-brand/15 border border-brand/30 py-2.5 px-4 opacity-0"
        style={{ scale: 0.8 }}
      >
        <span className="text-brand font-semibold">✓ Lansert!</span>
      </div>
    </div>
  );
}
