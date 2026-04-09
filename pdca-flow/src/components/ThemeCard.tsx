import { useNavigate } from 'react-router-dom';
import type { Theme } from '../types';
import { CATEGORY_LABELS } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate } from '../lib/date';

export function ThemeCard({ theme }: { theme: Theme }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/themes/${theme.id}`)}
      className="w-full bg-surface rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-surface-lighter px-2 py-0.5 rounded-full text-text-secondary">
          {CATEGORY_LABELS[theme.category]}
        </span>
        <StatusBadge status={theme.status} />
        <PriorityBadge priority={theme.priority} />
      </div>
      <h3 className="font-bold text-base mb-1">{theme.title}</h3>
      <p className="text-sm text-text-muted line-clamp-1">{theme.goal}</p>
      <div className="flex items-center justify-between mt-3 text-xs text-text-muted">
        <span>サイクル {theme.currentCycle}</span>
        <span>期限: {formatDate(theme.deadline)}</span>
      </div>
    </button>
  );
}
