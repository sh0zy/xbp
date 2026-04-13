import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { SectionCard } from '@/components/common/SectionCard';
import { EmptyState } from '@/components/common/EmptyState';
import type { Course, TimetableEntry } from '@/types';
import { DAY_LABELS, PERIOD_TIMES, COURSE_COLORS } from '@/types';

interface Props {
  courses: Course[];
  entries: TimetableEntry[];
  todayDow: number;
}

export function TodayClassesCard({ courses, entries, todayDow }: Props) {
  const navigate = useNavigate();
  const todayCourses = entries
    .map((e, i) => {
      const c = courses.find((c) => c.id === e.courseId);
      return c && c.dayOfWeek === todayDow ? { course: c, entry: e, idx: i } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a!.course.period - b!.course.period) as { course: Course; entry: TimetableEntry; idx: number }[];

  return (
    <SectionCard title={`今日の授業（${DAY_LABELS[todayDow]}曜日）`}>
      {todayCourses.length === 0 ? (
        <EmptyState icon={BookOpen} message="今日の授業はありません" />
      ) : (
        <div className="space-y-2">
          {todayCourses.map(({ course, entry }) => (
            <button
              key={course.id}
              onClick={() => navigate(`/search/${course.id}`)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-dark-700/50 active:bg-dark-600 transition-colors text-left"
            >
              <div
                className="w-1 h-10 rounded-full shrink-0"
                style={{ backgroundColor: entry.customColor || COURSE_COLORS[0] }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{course.title}</p>
                <p className="text-xs text-dark-300">{course.instructor} · {course.room || '教室未定'}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-dark-200">{course.period}限</p>
                <p className="text-[10px] text-dark-400">{PERIOD_TIMES[course.period]?.start}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
