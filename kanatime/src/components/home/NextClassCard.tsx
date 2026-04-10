import { Clock } from 'lucide-react';
import type { Course } from '@/types';
import { PERIOD_TIMES } from '@/types';

interface Props {
  course: Course | null;
  color: string;
}

export function NextClassCard({ course, color }: Props) {
  if (!course) return null;
  const time = PERIOD_TIMES[course.period];
  return (
    <div className="glass-card rounded-2xl p-4 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center gap-2 mb-2">
        <Clock size={14} className="text-dark-300" />
        <span className="text-xs text-dark-300">次の授業</span>
      </div>
      <p className="font-bold text-base">{course.title}</p>
      <p className="text-sm text-dark-200 mt-1">
        {course.period}限 ({time?.start}〜{time?.end}) · {course.room || '教室未定'}
      </p>
    </div>
  );
}
