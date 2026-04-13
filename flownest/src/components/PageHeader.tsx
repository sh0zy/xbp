import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  accent?: 'morning' | 'night' | 'accent';
  onBack?: () => void;
}

const accentClass: Record<NonNullable<Props['accent']>, string> = {
  morning: 'bg-gradient-to-br from-nest-morning/30 via-nest-morningSoft/10 to-transparent',
  night: 'bg-gradient-to-br from-nest-night/30 via-nest-nightSoft/10 to-transparent',
  accent: 'bg-gradient-to-br from-nest-accent/20 to-transparent',
};

export default function PageHeader({ title, subtitle, right, accent, onBack }: Props) {
  return (
    <header
      className={`relative px-5 pt-10 pb-6 ${accent ? accentClass[accent] : ''}`}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-1 text-sm text-nest-sub hover:text-nest-text"
        >
          ← 戻る
        </button>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-nest-sub">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
