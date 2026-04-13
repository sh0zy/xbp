import { useMemo } from 'react';
import type { Route } from '../app/router';
import PageHeader from '../components/PageHeader';
import { useStore } from '../store/AppStoreContext';
import type { DailyLog } from '../types';

interface Props {
  navigate: (r: Route) => void;
}

const computeStreak = (logs: DailyLog[]): number => {
  if (logs.length === 0) return 0;
  const byDate = new Map<string, boolean>();
  for (const l of logs) {
    const prev = byDate.get(l.date) ?? true;
    byDate.set(l.date, prev && l.success);
  }
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (byDate.get(key) === true) streak++;
    else if (byDate.has(key)) break;
    else if (i === 0) continue;
    else break;
  }
  return streak;
};

export default function ReviewPage({ navigate }: Props) {
  const { logs } = useStore();

  const { achievement, streak } = useMemo(() => {
    const done = logs.filter((l) => l.success).length;
    return {
      achievement: logs.length ? Math.round((done / logs.length) * 100) : 0,
      streak: computeStreak(logs),
    };
  }, [logs]);

  return (
    <div>
      <PageHeader title="ふりかえり" subtitle="最近の達成状況" accent="accent" onBack={() => navigate({ name: 'home' })} />
      <div className="space-y-4 px-5 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="nest-card p-4">
            <p className="nest-label">達成率</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{achievement}%</p>
            <p className="text-xs text-nest-sub">記録 {logs.length} 件</p>
          </div>
          <div className="nest-card p-4">
            <p className="nest-label">連続達成</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{streak}</p>
            <p className="text-xs text-nest-sub">日</p>
          </div>
        </div>

        <div>
          <h3 className="nest-label mb-2">履歴</h3>
          {logs.length === 0 && <p className="text-sm text-nest-sub">まだ記録はありません</p>}
          <ul className="space-y-2">
            {logs.slice(0, 20).map((l) => (
              <li key={l.id} className="nest-card p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    {l.date} · {l.mode === 'morning' ? '☀ 朝' : '☾ 夜'}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      l.success
                        ? 'bg-nest-accent/15 text-nest-accent'
                        : 'bg-nest-danger/15 text-nest-danger'
                    }`}
                  >
                    {l.success ? '達成' : `${l.delayMinutes}分遅れ`}
                  </span>
                </div>
                <p className="mt-1 text-xs text-nest-sub">
                  {l.templateName} · 完了 {l.completedTaskCount} / スキップ {l.skippedTaskCount} ·
                  目標 {l.targetTime}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
