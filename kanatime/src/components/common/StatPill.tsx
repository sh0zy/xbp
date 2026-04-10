interface Props {
  label: string;
  value: string | number;
  color?: string;
}

export function StatPill({ label, value, color = 'text-accent-blue' }: Props) {
  return (
    <div className="flex flex-col items-center glass-card rounded-xl px-3 py-2 min-w-[70px]">
      <span className={`text-lg font-bold ${color}`}>{value}</span>
      <span className="text-[10px] text-dark-300 mt-0.5">{label}</span>
    </div>
  );
}
