import type { Priority } from '../types';
import { PRIORITY_LABELS } from '../types';

const colors: Record<Priority, string> = {
  low: 'bg-gray-500/20 text-gray-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
