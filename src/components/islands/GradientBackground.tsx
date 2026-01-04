import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GradientBackgroundProps {
  className?: string;
}

export default function GradientBackground({ className }: GradientBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and on resize
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile: show simple static gradients (no blur animations = much faster)
  if (isMobile || shouldReduceMotion) {
    return (
      <div
        className={cn(
          'pointer-events-none absolute inset-0 overflow-hidden',
          className
        )}
      >
        {/* Simple gradient - no blur, no animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent" />
        <div className="absolute -left-1/4 -top-1/4 h-[400px] w-[400px] rounded-full bg-brand/10 blur-[60px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[300px] w-[300px] rounded-full bg-brand/8 blur-[40px]" />
      </div>
    );
  }

  // Desktop: full animated version
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
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary orb - bottom right */}
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[100px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Tertiary orb - accent, top right */}
      <motion.div
        className="absolute -right-1/4 top-1/4 h-[350px] w-[350px] rounded-full bg-cyan-400/8 blur-[80px]"
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
