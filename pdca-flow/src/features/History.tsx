import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Header } from '../components/Header';
import { SectionCard } from '../components/SectionCard';
import { EmptyState } from '../components/EmptyState';
import { formatDate } from '../lib/date';

export function History() {
  const { themes, plans, doLogs, checks, acts } = useApp();
  const navigate = useNavigate();

  const cycles = useMemo(() => {
    const result: {
      themeId: string;
      themeTitle: string;
      cycle: number;
      achievementRate: number | null;
      doCount: number;
      hasAct: boolean;
      updatedAt: string;
    }[] = [];

    for (const theme of themes) {
      for (let c = 1; c <= theme.currentCycle; c++) {
        const check = checks.find((x) => x.themeId === theme.id && x.cycle === c);
        const logs = doLogs.filter((x) => x.themeId === theme.id && x.cycle === c);
        const act = acts.find((x) => x.themeId === theme.id && x.cycle === c);
        const plan = plans.find((x) => x.themeId === theme.id && x.cycle === c);
        const dates = [check?.createdAt, act?.createdAt, plan?.createdAt, ...logs.map((l) => l.createdAt)].filter(Boolean) as string[];
        const latest = dates.sort().reverse()[0] || theme.updatedAt;

        result.push({
          themeId: theme.id,
          themeTitle: theme.title,
          cycle: c,
          achievementRate: check ? check.achievementRate : null,
          doCount: logs.length,
          hasAct: !!act,
          updatedAt: latest,
        });
      }
    }

    return result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [themes, plans, doLogs, checks, acts]);

  return (
    <div className="pb-24">
      <Header title="履歴" />
      <div className="p-4">
        {cycles.length === 0 ? (
          <EmptyState message="まだ履歴がありません" action="テーマを作成" onAction={() => navigate('/themes/new')} />
        ) : (
          <div className="space-y-3">
            {cycles.map((item) => (
              <button
                key={`${item.themeId}-${item.cycle}`}
                onClick={() => navigate(`/themes/${item.themeId}`)}
                className="w-full text-left"
              >
                <SectionCard>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm truncate flex-1">{item.themeTitle}</h3>
                    <span className="text-xs bg-surface-lighter px-2 py-0.5 rounded-full text-text-secondary ml-2">
                      Cycle {item.cycle}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span>実行: {item.doCount}回</span>
                    {item.achievementRate !== null && (
                      <span className="text-check">達成度: {item.achievementRate}%</span>
                    )}
                    {item.hasAct && <span className="text-act">改善あり</span>}
                    <span className="ml-auto">{formatDate(item.updatedAt)}</span>
                  </div>
                  {item.achievementRate !== null && (
                    <div className="w-full bg-surface-lighter rounded-full h-1.5 mt-2">
                      <div
                        className="bg-check h-1.5 rounded-full"
                        style={{ width: `${item.achievementRate}%` }}
                      />
                    </div>
                  )}
                </SectionCard>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
