import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingElementsProps {
  className?: string;
}

export default function FloatingElements({ className }: FloatingElementsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className
      )}
    >
      {/* Large ring - top right */}
      <motion.div
        className="absolute -right-20 top-1/4 h-64 w-64 rounded-full border border-brand/20 md:h-80 md:w-80"
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -20, 0],
                rotate: [0, 10, 0],
              }
        }
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Smaller ring - left side */}
      <motion.div
        className="absolute -left-10 top-1/3 h-32 w-32 rounded-full border border-brand/15 md:h-40 md:w-40"
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, 15, 0],
                x: [0, 10, 0],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Small filled circle - far bottom left */}
      <motion.div
        className="absolute bottom-1/3 left-[10%] h-3 w-3 rounded-full bg-brand/30"
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -12, 0],
                opacity: [0.3, 0.5, 0.3],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Horizontal line - right side */}
      <motion.div
        className="absolute right-1/4 top-1/3 h-px w-24 bg-gradient-to-r from-transparent via-brand/25 to-transparent md:w-32"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: [0, 20, 0],
                opacity: [0.25, 0.4, 0.25],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Diagonal line - bottom right */}
      <motion.div
        className="absolute bottom-1/3 right-1/3 h-16 w-px rotate-45 bg-gradient-to-b from-transparent via-brand/20 to-transparent md:h-20"
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, 10, 0],
                opacity: [0.2, 0.35, 0.2],
              }
        }
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Cross/plus shape - top left area */}
      <motion.div
        className="absolute left-1/3 top-1/4"
        animate={
          shouldReduceMotion
            ? {}
            : {
                rotate: [0, 90, 0],
                scale: [1, 1.1, 1],
              }
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative h-6 w-6">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-brand/20" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-brand/20" />
        </div>
      </motion.div>

      {/* Dot cluster - top right area (away from buttons) */}
      <motion.div
        className="absolute right-[15%] top-[20%]"
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -8, 0],
              }
        }
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="flex gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-brand/25" />
          <div className="h-1.5 w-1.5 rounded-full bg-brand/15" />
          <div className="h-1.5 w-1.5 rounded-full bg-brand/25" />
        </div>
      </motion.div>
    </div>
  );
}
