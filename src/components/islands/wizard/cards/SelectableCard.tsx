import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

interface SelectableCardProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export function SelectableCard({
  label,
  selected,
  onToggle,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        'flex w-full items-center justify-between rounded-md border p-4 text-left transition-colors',
        selected
          ? 'border-brand bg-brand/10'
          : 'border-white/10 bg-surface-raised hover:border-brand/40 hover:bg-brand/5',
      )}
    >
      <span className="font-medium text-text">{label}</span>
      <span className="flex h-5 w-5 items-center justify-center">
        <AnimatePresence>
          {selected && (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <svg
                className="h-5 w-5 text-brand"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}
