import { useAppStore } from "../store/useAppStore";
import PageHeader from "../components/common/PageHeader";
import BottomNav from "../components/common/BottomNav";

export default function HistoryPage() {
  const history = useAppStore((s) => s.history);
  const reversed = [...history].reverse();

  return (
    <div className="page-shell">
      <PageHeader title="履歴" subtitle="過去のプランとふりかえり" />
      {reversed.length === 0 ? (
        <div className="section-card">
          <p className="muted-text">まだ履歴がありません。</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {reversed.map((h) => (
            <li key={h.id} className="section-card">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{h.date}</div>
                <span className="status-pill">
                  {h.plan.mode === "normal" ? "ふつう" : h.plan.mode === "shortest" ? "最短" : "疲労"}
                </span>
              </div>
              <div className="muted-text mt-1 text-sm">
                タスク {h.plan.tasks.length}件 ・{" "}
                {h.review
                  ? `${h.review.completedCount}/${h.review.totalCount} 完了 ・ 気分${h.review.feeling}`
                  : "ふりかえり未保存"}
              </div>
              {h.review?.note && <div className="mt-2 text-sm text-slate-300">{h.review.note}</div>}
            </li>
          ))}
        </ul>
      )}
      <BottomNav />
    </div>
  );
}
