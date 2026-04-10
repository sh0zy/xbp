import { FileText } from 'lucide-react';
import { SectionCard } from '@/components/common/SectionCard';
import { Badge } from '@/components/common/Badge';
import type { Assignment, Course } from '@/types';
import { format, parseISO } from 'date-fns';

interface Props {
  assignments: Assignment[];
  courses: Course[];
}

export function UpcomingTestsCard({ assignments, courses }: Props) {
  const tests = assignments
    .filter((a) => (a.type === 'test' || a.type === 'quiz') && a.status === 'todo')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  if (tests.length === 0) return null;

  return (
    <SectionCard title="近日のテスト">
      <div className="space-y-2">
        {tests.map((t) => {
          const course = courses.find((c) => c.id === t.courseId);
          return (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/50">
              <FileText size={18} className="text-accent-orange shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.title}</p>
                <p className="text-xs text-dark-400">{course?.title}</p>
              </div>
              <Badge variant="orange">{format(parseISO(t.dueDate), 'M/d')}</Badge>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
