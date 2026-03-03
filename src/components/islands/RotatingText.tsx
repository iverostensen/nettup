import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { duration } from '@/lib/animation';

const words = [
  'bare funker.',
  'konverterer.',
  'imponerer.',
  'selger.',
  'leverer.',
  'skiller seg ut.',
  'bygger tillit.',
];

export default function RotatingText() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  // For reduced motion, just show static text
  if (shouldReduceMotion) {
    return <span className="bg-gradient-to-r from-brand to-text bg-clip-text text-transparent">{words[0]}</span>;
  }

  return (
    <span className="relative inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: duration.normal, ease: 'easeOut' }}
          className="inline-block bg-gradient-to-r from-brand to-text bg-clip-text text-transparent"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
