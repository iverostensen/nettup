import clsx from 'clsx';

interface SelectableCardProps {
  label: string;
  price: string;
  selected: boolean;
  onToggle: () => void;
}

export function SelectableCard({
  label,
  price,
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
          : 'border-white/10 bg-surface-raised hover:border-brand/40',
      )}
    >
      <span className="font-medium text-text">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-sm text-brand">{price}</span>
        {selected && (
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
        )}
      </span>
    </button>
  );
}
