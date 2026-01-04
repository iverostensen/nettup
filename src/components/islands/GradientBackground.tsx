import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientBackgroundProps {
  className?: string;
}

export default function GradientBackground({ className }: GradientBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className
      )}
    >
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent" />

      {/* Radial glow at center for depth */}
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/5 blur-[150px]" />

      {/* Primary orb - top left */}
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-brand/15 blur-[120px]"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 60, 0],
                y: [0, 40, 0],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary orb - bottom right */}
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[100px]"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, -50, 0],
                y: [0, -60, 0],
              }
        }
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Tertiary orb - accent, top right */}
      <motion.div
        className="absolute -right-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-cyan-400/8 blur-[80px]"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, -30, 0],
                y: [0, 40, 0],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
