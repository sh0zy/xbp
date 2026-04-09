import type { ThemeStatus } from '../types';
import { STATUS_LABELS } from '../types';

const colors: Record<ThemeStatus, string> = {
  active: 'bg-green-500/20 text-green-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-blue-500/20 text-blue-400',
  archived: 'bg-gray-500/20 text-gray-400',
};

export function StatusBadge({ status }: { status: ThemeStatus }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
