import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Header } from '../components/Header';
import { SectionCard } from '../components/SectionCard';
import { MetricCard } from '../components/MetricCard';
import { ThemeCard } from '../components/ThemeCard';
import { EmptyState } from '../components/EmptyState';
import { isThisWeek } from '../lib/date';

export function Dashboard() {
  const { themes, doLogs, checks } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const active = themes.filter((t) => t.status === 'active').length;
    const completed = themes.filter((t) => t.status === 'completed').length;
    const weekLogs = doLogs.filter((d) => isThisWeek(d.date)).length;
    const avgRate = checks.length > 0
      ? Math.round(checks.reduce((s, c) => s + c.achievementRate, 0) / checks.length)
      : 0;
    const recent = [...themes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);
    return { active, completed, weekLogs, avgRate, recent };
  }, [themes, doLogs, checks]);

  return (
    <div className="pb-24">
      <Header title="PDCA Flow" />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="進行中" value={stats.active} color="text-green-400" />
          <MetricCard label="完了" value={stats.completed} color="text-blue-400" />
          <MetricCard label="今週の実行" value={stats.weekLogs} color="text-accent" />
          <MetricCard label="平均達成度" value={`${stats.avgRate}%`} color="text-yellow-400" />
        </div>

        <SectionCard title="最近のテーマ">
          {stats.recent.length === 0 ? (
            <EmptyState message="テーマがまだありません" action="テーマを作成" onAction={() => navigate('/themes/new')} />
          ) : (
            <div className="space-y-3">
              {stats.recent.map((t) => (
                <ThemeCard key={t.id} theme={t} />
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
