interface MetricCardProps {
  label: string;
  value: string | number;
  color?: string;
}

export function MetricCard({ label, value, color = 'text-primary' }: MetricCardProps) {
  return (
    <div className="bg-surface-light rounded-xl p-3 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-text-muted mt-1">{label}</div>
    </div>
  );
}
