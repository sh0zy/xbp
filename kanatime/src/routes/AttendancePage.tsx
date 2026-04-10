import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { StatPill } from '@/components/common/StatPill';
import { Badge } from '@/components/common/Badge';
import { useCourseStore } from '@/store/courseStore';
import { useAttendanceStore } from '@/store/attendanceStore';
import type { AttendanceRecord } from '@/types';
import { format } from 'date-fns';

const statusLabels: Record<AttendanceRecord['status'], string> = {
  present: '出席', late: '遅刻', absent: '欠席', official: '公欠',
};
const statusColors: Record<AttendanceRecord['status'], 'green' | 'orange' | 'red' | 'blue'> = {
  present: 'green', late: 'orange', absent: 'red', official: 'blue',
};

export function AttendancePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, load: loadCourses } = useCourseStore();
  const { load: loadAttendance, getForCourse, getStats, add, remove } = useAttendanceStore();
  const [status, setStatus] = useState<AttendanceRecord['status']>('present');

  useEffect(() => { loadCourses(); loadAttendance(); }, []);

  const course = courses.find((c) => c.id === courseId);
  if (!course) return <div className="pt-14 text-center text-dark-400">授業が見つかりません</div>;

  const records = getForCourse(course.id).sort((a, b) => b.date.localeCompare(a.date));
  const stats = getStats(course.id);

  const handleAdd = () => {
    add({ courseId: course.id, date: format(new Date(), 'yyyy-MM-dd'), status });
  };

  return (
    <div className="space-y-4 pt-2">
      <PageHeader title={`出欠 - ${course.title}`} back />

      <div className="flex gap-2 justify-center">
        <StatPill label="出席率" value={`${stats.rate}%`} color={stats.rate < 75 ? 'text-accent-red' : 'text-accent-green'} />
        <StatPill label="出席" value={stats.present} color="text-accent-green" />
        <StatPill label="遅刻" value={stats.late} color="text-accent-orange" />
        <StatPill label="欠席" value={stats.absent} color="text-accent-red" />
      </div>

      <SectionCard title="記録を追加">
        <div className="flex gap-2 mb-3">
          {(Object.keys(statusLabels) as AttendanceRecord['status'][]).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${status === s ? 'bg-accent-blue text-white' : 'bg-dark-600 text-dark-300'}`}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
        <button onClick={handleAdd} className="w-full py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium active:bg-accent-blue/80">
          今日の出欠を記録
        </button>
      </SectionCard>

      <SectionCard title="出欠履歴">
        {records.length === 0 ? (
          <p className="text-sm text-dark-400 text-center py-4">まだ記録がありません</p>
        ) : (
          <div className="space-y-2">
            {records.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-dark-700/50">
                <span className="text-sm">{r.date}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={statusColors[r.status]}>{statusLabels[r.status]}</Badge>
                  <button onClick={() => remove(r.id)} className="text-xs text-dark-400 active:text-accent-red">削除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
