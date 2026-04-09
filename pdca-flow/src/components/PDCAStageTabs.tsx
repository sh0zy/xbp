type Stage = 'plan' | 'do' | 'check' | 'act';

interface PDCAStageTabsProps {
  active: Stage;
  onChange: (s: Stage) => void;
}

const stages: { key: Stage; label: string; color: string }[] = [
  { key: 'plan', label: 'Plan', color: 'bg-plan text-white' },
  { key: 'do', label: 'Do', color: 'bg-do text-white' },
  { key: 'check', label: 'Check', color: 'bg-check text-white' },
  { key: 'act', label: 'Act', color: 'bg-act text-white' },
];

export function PDCAStageTabs({ active, onChange }: PDCAStageTabsProps) {
  return (
    <div className="flex gap-2 p-1 bg-surface-light rounded-xl">
      {stages.map((s) => (
        <button
          key={s.key}
          onClick={() => onChange(s.key)}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            active === s.key ? s.color : 'text-text-muted'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
