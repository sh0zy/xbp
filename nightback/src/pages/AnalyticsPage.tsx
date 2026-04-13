import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import PageHeader from "../components/common/PageHeader";
import BottomNav from "../components/common/BottomNav";

export default function AnalyticsPage() {
  const history = useAppStore((s) => s.history);
  const reviewLogs = useAppStore((s) => s.reviewLogs);

  const stats = useMemo(() => {
    const total = reviewLogs.length;
    const avgFeeling =
      total === 0 ? 0 : reviewLogs.reduce((s, r) => s + r.feeling, 0) / total;
    const completionRate =
      total === 0
        ? 0
        : reviewLogs.reduce((s, r) => s + r.completedCount / Math.max(1, r.totalCount), 0) /
          total;
    const bySize = history.reduce(
      (s, h) => s + h.plan.tasks.reduce((x, t) => x + t.durationMin, 0),
      0
    );
    return { total, avgFeeling, completionRate, avgTotalMin: total === 0 ? 0 : Math.round(bySize / total) };
  }, [history, reviewLogs]);

  return (
    <div className="page-shell">
      <PageHeader title="分析" subtitle="夜の傾向をふりかえる" />

      <div className="grid grid-cols-2 gap-3">
        <div className="section-card">
          <div className="muted-text">記録日数</div>
          <div className="text-2xl font-bold mt-1">{stats.total}日</div>
        </div>
        <div className="section-card">
          <div className="muted-text">平均気分</div>
          <div className="text-2xl font-bold mt-1">{stats.avgFeeling.toFixed(1)}/5</div>
        </div>
        <div className="section-card">
          <div className="muted-text">完了率</div>
          <div className="text-2xl font-bold mt-1">{Math.round(stats.completionRate * 100)}%</div>
        </div>
        <div className="section-card">
          <div className="muted-text">平均想定時間</div>
          <div className="text-2xl font-bold mt-1">{stats.avgTotalMin}分</div>
        </div>
      </div>

      <div className="section-card mt-4">
        <div className="font-semibold mb-3">気分の推移</div>
        {reviewLogs.length === 0 ? (
          <p className="muted-text">まだデータがありません。</p>
        ) : (
          <div className="flex items-end gap-1 h-24">
            {reviewLogs.slice(-14).map((r) => (
              <div
                key={r.id}
                className="flex-1 bg-accent/60 rounded-t"
                style={{ height: `${(r.feeling / 5) * 100}%` }}
                title={`${r.date}: ${r.feeling}`}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
