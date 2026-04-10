import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { SectionCard } from '@/components/common/SectionCard';
import { Badge } from '@/components/common/Badge';
import type { Assignment, Course } from '@/types';
import { format, differenceInDays, parseISO } from 'date-fns';

interface Props {
  assignments: Assignment[];
  courses: Course[];
}

export function PendingTasksCard({ assignments, courses }: Props) {
  const navigate = useNavigate();
  const pending = assignments
    .filter((a) => a.status === 'todo')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  if (pending.length === 0) return null;

  return (
    <SectionCard title="未完了の課題">
      <div className="space-y-2">
        {pending.map((a) => {
          const course = courses.find((c) => c.id === a.courseId);
          const daysLeft = differenceInDays(parseISO(a.dueDate), new Date());
          const urgent = daysLeft <= 2;
          return (
            <button
              key={a.id}
              onClick={() => navigate('/tasks')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-dark-700/50 active:bg-dark-600 text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{a.title}</p>
                <p className="text-xs text-dark-400 truncate">{course?.title}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {urgent && <AlertCircle size={14} className="text-accent-red" />}
                <Badge variant={urgent ? 'red' : 'default'}>
                  {format(parseISO(a.dueDate), 'M/d')}
                </Badge>
              </div>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}
