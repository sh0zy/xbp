import type { Course } from '@/types';
import { DAY_LABELS, PERIOD_TIMES } from '@/types';

interface Props {
  course: Course;
  color: string;
}

export function CourseHero({ course, color }: Props) {
  const time = PERIOD_TIMES[course.period];
  const ev = course.evaluation;

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{ backgroundColor: color + '20' }}>
      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: color }} />
      <h2 className="text-xl font-bold mb-1">{course.title}</h2>
      <p className="text-sm text-dark-200">{course.instructor}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-dark-300">
        <span>{DAY_LABELS[course.dayOfWeek]}曜 {course.period}限</span>
        <span>{time?.start}〜{time?.end}</span>
        <span>{course.campus}</span>
        {course.room && <span>{course.room}</span>}
        <span>{course.credits}単位</span>
        <span>{course.category}</span>
      </div>

      {/* 評価方法 */}
      {ev && (
        <div className="mt-4">
          <p className="text-xs text-dark-300 mb-2 font-medium">評価方法</p>
          <div className="flex h-3 rounded-full overflow-hidden">
            {ev.exam > 0 && <div className="bg-accent-red/80" style={{ width: `${ev.exam}%` }} />}
            {ev.report > 0 && <div className="bg-accent-blue/80" style={{ width: `${ev.report}%` }} />}
            {ev.attendance > 0 && <div className="bg-accent-green/80" style={{ width: `${ev.attendance}%` }} />}
            {ev.other > 0 && <div className="bg-dark-400/60" style={{ width: `${ev.other}%` }} />}
          </div>
          <div className="flex gap-4 mt-2 text-xs text-dark-200">
            {ev.exam > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-red/80 inline-block" />
                テスト {ev.exam}%
              </span>
            )}
            {ev.report > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-blue/80 inline-block" />
                レポート {ev.report}%
              </span>
            )}
            {ev.attendance > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-green/80 inline-block" />
                出席 {ev.attendance}%
              </span>
            )}
            {ev.other > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-dark-400/60 inline-block" />
                その他 {ev.other}%
              </span>
            )}
          </div>
          {ev.exam === 0 && (
            <p className="text-xs text-accent-green mt-2 font-medium">テストなし</p>
          )}
        </div>
      )}
    </div>
  );
}
