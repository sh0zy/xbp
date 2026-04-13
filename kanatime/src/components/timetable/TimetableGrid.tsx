import { useCourseStore } from '@/store/courseStore';
import { useTimetableStore } from '@/store/timetableStore';
import { TimetableCell } from './TimetableCell';
import { DAY_LABELS, COURSE_COLORS } from '@/types';
import type { Course } from '@/types';

const PERIODS = [1, 2, 3, 4, 5, 6, 7];

interface Props {
  editMode: boolean;
  onEmptyClick: (dayOfWeek: number, period: number) => void;
  onCellEdit: (course: Course) => void;
}

export function TimetableGrid({ editMode, onEmptyClick, onCellEdit }: Props) {
  const { courses } = useCourseStore();
  const { entries } = useTimetableStore();

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="min-w-[360px]">
        {/* Header */}
        <div className="grid grid-cols-[40px_repeat(6,1fr)] gap-1 mb-1">
          <div />
          {DAY_LABELS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-dark-300 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        {PERIODS.map((period) => (
          <div key={period} className="grid grid-cols-[40px_repeat(6,1fr)] gap-1 mb-1">
            <div className="flex items-center justify-center text-xs text-dark-400 font-medium">
              {period}
            </div>
            {[0, 1, 2, 3, 4, 5].map((dow) => {
              const entry = entries.find((e) => {
                const c = courses.find((c) => c.id === e.courseId);
                return c && c.dayOfWeek === dow && c.period === period;
              });
              const course = entry ? courses.find((c) => c.id === entry.courseId) : undefined;
              // 初期は統一色 (COURSE_COLORS[0])、ユーザーが変更したら customColor を使う
              const color = entry?.customColor || COURSE_COLORS[0];

              return (
                <TimetableCell
                  key={`${dow}-${period}`}
                  course={course}
                  color={color}
                  editMode={editMode}
                  onEmptyClick={() => onEmptyClick(dow, period)}
                  onEdit={() => course && onCellEdit(course)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
