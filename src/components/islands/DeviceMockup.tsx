import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DeviceMockupProps {
  className?: string;
}

interface CodeLine {
  indent: number;
  content: string;
  color: string;
}

const codeLines: CodeLine[] = [
  { indent: 0, content: '<section class="hero">', color: 'text-slate-400' },
  { indent: 1, content: '<h1 class="text-4xl">', color: 'text-slate-400' },
  { indent: 2, content: 'Velkommen til Nettup', color: 'text-emerald-400' },
  { indent: 1, content: '</h1>', color: 'text-slate-400' },
  { indent: 1, content: '<p class="text-muted">', color: 'text-slate-400' },
  { indent: 2, content: 'Vi bygger nettsider', color: 'text-emerald-400' },
  { indent: 1, content: '</p>', color: 'text-slate-400' },
  { indent: 1, content: '<Button primary>', color: 'text-cyan-400' },
  { indent: 2, content: 'Ta kontakt', color: 'text-amber-300' },
  { indent: 1, content: '</Button>', color: 'text-cyan-400' },
  { indent: 0, content: '</section>', color: 'text-slate-400' },
];

// Flatten all code into a single string with line breaks for typing
function getFullCode(): { char: string; color: string; isNewLine: boolean; indent: number }[] {
  const result: { char: string; color: string; isNewLine: boolean; indent: number }[] = [];

  codeLines.forEach((line, lineIndex) => {
    // Add newline before each line except the first
    if (lineIndex > 0) {
      result.push({ char: '\n', color: '', isNewLine: true, indent: line.indent });
    }

    // Add each character of the line
    for (const char of line.content) {
      result.push({ char, color: line.color, isNewLine: false, indent: line.indent });
    }
  });

  return result;
}

const fullCode = getFullCode();

function TypedCode({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCharIndex(fullCode.length);
      return;
    }

    // Start typing after initial delay
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setCharIndex((prev) => {
          if (prev >= fullCode.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 50); // 50ms per character

      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(startDelay);
  }, [shouldReduceMotion]);

  // Group characters by lines for rendering
  const lines: { indent: number; chars: { char: string; color: string }[] }[] = [];
  let currentLine: { indent: number; chars: { char: string; color: string }[] } = { indent: 0, chars: [] };

  for (let i = 0; i < charIndex; i++) {
    const item = fullCode[i];
    if (item.isNewLine) {
      lines.push(currentLine);
      currentLine = { indent: item.indent, chars: [] };
    } else {
      if (currentLine.chars.length === 0) {
        currentLine.indent = item.indent;
      }
      currentLine.chars.push({ char: item.char, color: item.color });
    }
  }
  lines.push(currentLine);

  const isTypingComplete = charIndex >= fullCode.length;

  return (
    <div className="min-h-[240px] p-4 font-mono text-xs leading-relaxed">
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} style={{ paddingLeft: `${line.indent * 12}px` }}>
          {line.chars.map((c, charIdx) => (
            <span key={charIdx} className={c.color}>
              {c.char}
            </span>
          ))}
          {/* Show cursor at end of current line */}
          {lineIndex === lines.length - 1 && !isTypingComplete && (
            <motion.span
              className="inline-block h-3.5 w-1.5 translate-y-0.5 bg-brand"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>
      ))}
      {/* Show blinking cursor after typing complete */}
      {isTypingComplete && (
        <div style={{ paddingLeft: '0px' }}>
          <motion.span
            className="inline-block h-3.5 w-1.5 translate-y-0.5 bg-brand"
            animate={shouldReduceMotion ? {} : { opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      )}
    </div>
  );
}

export default function DeviceMockup({ className }: DeviceMockupProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      className={cn('relative', className)}
      style={{ perspective: '1200px' }}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      animate="visible"
      variants={containerVariants}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -6, 0],
              }
        }
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* MacBook container with 3D transform */}
        <div
          className="relative"
          style={{
            transform: 'rotateY(-12deg) rotateX(8deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Screen */}
          <div className="relative rounded-xl bg-slate-800 p-1.5 shadow-2xl shadow-black/60">
            {/* Screen bezel */}
            <div className="relative overflow-hidden rounded-lg bg-slate-950">
              {/* Screen content */}
              <div className="relative min-h-[300px] w-[440px] bg-slate-900">
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b border-white/5 bg-slate-800/50 px-3 py-2">
                  {/* Traffic lights */}
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/90" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/90" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/90" />
                  </div>
                  {/* Tab / URL bar */}
                  <div className="ml-3 flex flex-1 items-center gap-1.5 rounded bg-slate-700/50 px-2 py-1">
                    <svg
                      className="h-2.5 w-2.5 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span className="text-[10px] text-slate-400">nettup.no</span>
                  </div>
                </div>

                {/* Code editor area */}
                <TypedCode shouldReduceMotion={shouldReduceMotion} />
              </div>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Glow effect behind */}
      <div className="absolute -inset-16 -z-10 rounded-full bg-brand/8 blur-3xl" />
    </motion.div>
  );
}
