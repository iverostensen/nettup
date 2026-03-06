interface GoalCardProps {
  label: string;
  subLabel: string;
  onClick: () => void;
}

export function GoalCard({ label, subLabel, onClick }: GoalCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-md border border-white/10 bg-surface-raised p-4 text-left transition-colors hover:border-brand/40 hover:bg-brand/5"
    >
      <span className="block font-semibold text-text">{label}</span>
      <span className="block text-sm text-text-muted">{subLabel}</span>
    </button>
  );
}
