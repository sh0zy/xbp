import { Check, Trash2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import type { Assignment, Course } from '@/types';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';

interface Props {
  assignment: Assignment;
  course?: Course;
  onToggle: () => void;
  onRemove: () => void;
}

const typeLabels: Record<string, string> = {
  report: 'レポート',
  test: 'テスト',
  quiz: '小テスト',
  other: 'その他',
};

export function TaskItem({ assignment, course, onToggle, onRemove }: Props) {
  const done = assignment.status === 'done';
  return (
    <div className={clsx('flex items-center gap-3 p-3 rounded-xl transition-colors', done ? 'bg-dark-700/30' : 'bg-dark-700/50')}>
      <button onClick={onToggle} className={clsx('w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors', done ? 'bg-accent-green border-accent-green' : 'border-dark-400 active:border-accent-blue')}>
        {done && <Check size={14} className="text-dark-900" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium truncate', done && 'line-through text-dark-400')}>{assignment.title}</p>
        <p className="text-xs text-dark-400 truncate">{course?.title}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={assignment.type === 'test' || assignment.type === 'quiz' ? 'orange' : 'default'}>
          {typeLabels[assignment.type]}
        </Badge>
        <span className="text-xs text-dark-300">{format(parseISO(assignment.dueDate), 'M/d')}</span>
        <button onClick={onRemove} className="text-dark-400 active:text-accent-red p-1">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
