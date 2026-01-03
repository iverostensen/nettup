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
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-brand/8 blur-[120px]"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 50, 0],
                y: [0, 30, 0],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-brand/5 blur-[100px]"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, -40, 0],
                y: [0, -50, 0],
              }
        }
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
