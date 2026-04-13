import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/common/Badge';
import type { Course } from '@/types';
import { DAY_LABELS, computeEasyScore, computeEasyReasons, EASY_REASON_TAGS } from '@/types';
import type { SortKey } from '@/routes/SearchPage';

interface Props {
  course: Course;
  averages: Record<string, number> | null;
  showScore: SortKey;
}

const scoreLabel: Record<string, string> = {
  ease: '履修しやすさ',
  satisfaction: '満足度',
  clarity: '分かりやすさ',
  workload_low: '課題量',
  attendance_low: '出席の厳しさ',
};

export function CourseListItem({ course, averages, showScore }: Props) {
  const navigate = useNavigate();

  const scoreValue = getDisplayScore(averages, showScore);
  const scoreColor = scoreValue !== null
    ? scoreValue >= 4 ? 'text-accent-green' : scoreValue >= 3 ? 'text-accent-blue' : 'text-accent-orange'
    : '';

  const ev = course.evaluation;
  const easyScore = computeEasyScore(course);
  const easyReasons = computeEasyReasons(course);
  const grades = course.availableGrades ?? [1, 2, 3, 4];

  return (
    <button
      onClick={() => navigate(`/search/${course.id}`)}
      className="w-full text-left p-3 rounded-xl bg-dark-700/50 active:bg-dark-600 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm">{course.title}</p>
          <p className="text-xs text-dark-300 mt-0.5">{course.instructor}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <Badge variant="blue">{course.credits}単位</Badge>
          {showScore === 'easy' && (
            <div className="flex items-center gap-1">
              <span className={`text-lg font-bold ${easyScore >= 75 ? 'text-accent-green' : easyScore >= 60 ? 'text-accent-blue' : 'text-accent-orange'}`}>
                {Math.round(easyScore)}
              </span>
              <span className="text-[10px] text-dark-400">/100</span>
            </div>
          )}
          {showScore !== 'none' && showScore !== 'easy' && scoreValue !== null && (
            <div className="flex items-center gap-1">
              <span className={`text-lg font-bold ${scoreColor}`}>{scoreValue}</span>
              <span className="text-[10px] text-dark-400">/5</span>
            </div>
          )}
        </div>
      </div>

      {/* 評価方法バー */}
      {ev && (
        <div className="mt-2">
          <div className="flex h-2 rounded-full overflow-hidden">
            {ev.exam > 0 && <div className="bg-accent-red/70" style={{ width: `${ev.exam}%` }} title={`テスト ${ev.exam}%`} />}
            {ev.report > 0 && <div className="bg-accent-blue/70" style={{ width: `${ev.report}%` }} title={`レポート ${ev.report}%`} />}
            {ev.attendance > 0 && <div className="bg-accent-green/70" style={{ width: `${ev.attendance}%` }} title={`出席 ${ev.attendance}%`} />}
            {ev.other > 0 && <div className="bg-dark-400/50" style={{ width: `${ev.other}%` }} title={`その他 ${ev.other}%`} />}
          </div>
          <div className="flex gap-3 mt-1 text-[10px] text-dark-400">
            {ev.exam > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-red/70 inline-block" />テスト{ev.exam}%</span>}
            {ev.report > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-blue/70 inline-block" />レポート{ev.report}%</span>}
            {ev.attendance > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-green/70 inline-block" />出席{ev.attendance}%</span>}
            {ev.other > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-dark-400/50 inline-block" />他{ev.other}%</span>}
          </div>
        </div>
      )}

      {/* 楽単根拠タグ */}
      {easyReasons.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {easyReasons.map((r) => (
            <span key={r} className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent-green/15 text-accent-green font-medium">
              #{EASY_REASON_TAGS[r]}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <Badge>{DAY_LABELS[course.dayOfWeek]}{course.period}限</Badge>
        <Badge>{course.campus}</Badge>
        <Badge>{course.category}</Badge>
        <Badge>{grades.length === 4 ? '全学年' : `${grades.join('・')}年`}</Badge>
        {showScore !== 'none' && showScore !== 'easy' && scoreValue !== null && (
          <Badge variant={scoreValue >= 4 ? 'green' : scoreValue >= 3 ? 'blue' : 'orange'}>
            {scoreLabel[showScore]}
          </Badge>
        )}
        {showScore !== 'none' && showScore !== 'easy' && scoreValue === null && (
          <Badge>レビューなし</Badge>
        )}
      </div>
    </button>
  );
}

function getDisplayScore(avg: Record<string, number> | null, key: SortKey): number | null {
  if (!avg) return null;
  switch (key) {
    case 'ease': return avg.ease;
    case 'satisfaction': return avg.satisfaction;
    case 'clarity': return avg.clarity;
    case 'workload_low': return avg.workload;
    case 'attendance_low': return avg.attendance;
    default: return null;
  }
}
