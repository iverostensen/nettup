import { motion, useReducedMotion } from 'framer-motion';
import { heroContainer, fadeUp, springPop, fadeIn, springs } from '@/lib/animation';
import RotatingText from './RotatingText';
import HeroDeliveryAnimation from './HeroDeliveryAnimation';

export default function HeroIsland() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <section className="grain-overlay relative flex min-h-screen items-center overflow-hidden pt-20 bg-surface">
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-surface to-transparent" aria-hidden="true" />

        <div className="container relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] items-center px-4">
          <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-8">

            <div className="flex flex-col justify-center text-center lg:text-left">
              <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl xl:text-7xl">
                Nettsider som <br />
                <RotatingText />
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-lg text-text-muted opacity-100 md:text-xl lg:mx-0">
                Vi lager moderne, raske nettsider for norske bedrifter. Uten stress, til rett pris.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <a
                  href="/kontakt"
                  className="bg-brand text-surface rounded-full px-6 py-3 text-base font-semibold hover:bg-brand-light transition-colors duration-fast"
                >
                  Ta kontakt
                </a>
                <a
                  href="/prosjekter"
                  className="border border-white/20 text-text rounded-full px-6 py-3 text-base font-medium hover:border-white/40 hover:text-text transition-colors duration-fast"
                >
                  Se vårt arbeid
                </a>
              </div>
            </div>

            <div className="hidden items-center justify-center lg:flex lg:justify-end" aria-hidden="true">
              <HeroDeliveryAnimation />
            </div>

          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-text-muted/60">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg className="animate-bounce-subtle h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grain-overlay relative flex min-h-screen items-center overflow-hidden pt-20 bg-surface">
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-surface to-transparent" aria-hidden="true" />

      <div className="container relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] items-center px-4">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-8">

          {/* Left: Text content with stagger orchestration */}
          <motion.div
            className="flex flex-col justify-center text-center lg:text-left"
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeUp}
              transition={springs.snappy}
              className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl xl:text-7xl"
            >
              Nettsider som <br />
              <RotatingText />
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={springs.gentle}
              className="mx-auto mt-6 max-w-xl text-lg text-text-muted md:text-xl lg:mx-0"
            >
              Vi lager moderne, raske nettsider for norske bedrifter. Uten stress, til rett pris.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={springs.gentle}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <a
                href="/kontakt"
                className="bg-brand text-surface rounded-full px-6 py-3 text-base font-semibold hover:bg-brand-light transition-colors duration-fast"
              >
                Ta kontakt
              </a>
              <a
                href="/prosjekter"
                className="border border-white/20 text-text rounded-full px-6 py-3 text-base font-medium hover:border-white/40 hover:text-text transition-colors duration-fast"
              >
                Se vårt arbeid
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Delivery animation — desktop only */}
          <motion.div
            className="hidden items-center justify-center lg:flex lg:justify-end"
            variants={springPop}
            initial="hidden"
            animate="visible"
            transition={{ ...springs.gentle, delay: 0.35 }}
            aria-hidden="true"
          >
            <HeroDeliveryAnimation />
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ ...springs.gentle, delay: 0.8 }}
      >
        <div className="flex flex-col items-center gap-2 text-text-muted/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="animate-bounce-subtle h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
