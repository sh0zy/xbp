import { useNavigate } from "react-router-dom";
import { Play, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import PageHeader from "../components/common/PageHeader";
import { formatDuration, minutesToHhmm } from "../lib/time";

export default function PlanResultPage() {
  const nav = useNavigate();
  const plan = useAppStore((s) => s.currentPlan);
  const start = useAppStore((s) => s.startExecution);
  const removeTask = useAppStore((s) => s.removeDraftTask);
  const regenerate = useAppStore((s) => s.generateCurrentPlan);

  if (!plan) {
    return (
      <div className="page-shell">
        <PageHeader title="プラン" back />
        <div className="section-card">
          <p className="muted-text">まだプランが作られていません。</p>
          <button onClick={() => nav("/plan")} className="primary-button mt-4">
            プランを作る
          </button>
        </div>
      </div>
    );
  }

  const onStart = () => {
    start();
    nav("/execute");
  };

  const dropSuggested = (id: string) => {
    removeTask(id);
    regenerate();
  };

  return (
    <div className="page-shell">
      <PageHeader title="今夜のプラン" subtitle={`${minutesToHhmm(plan.homeMin)} → ${minutesToHhmm(plan.bedtimeMin)}`} back />

      <div className="section-card mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="muted-text">使える時間</div>
            <div className="text-xl font-semibold">{formatDuration(plan.availableMin)}</div>
          </div>
          <div className="text-right">
            <div className="muted-text">合計想定</div>
            <div className="text-xl font-semibold">{formatDuration(plan.totalNeededMin)}</div>
          </div>
        </div>
        {plan.overflowMinutes > 0 ? (
          <div className="mt-3 flex items-start gap-2 text-warn text-sm">
            <AlertTriangle size={16} className="mt-0.5" />
            <span>{plan.overflowMinutes}分オーバー。無理せず削るのがおすすめ。</span>
          </div>
        ) : (
          <div className="mt-3 flex items-start gap-2 text-ok text-sm">
            <CheckCircle2 size={16} className="mt-0.5" />
            <span>余裕 {plan.spareMinutes}分</span>
          </div>
        )}
      </div>

      <div className="section-card mb-4">
        <h2 className="h2 mb-3">タイムライン</h2>
        <ul className="space-y-2">
          {plan.timeline.map((slot) => (
            <li key={slot.task.id} className="flex gap-3 items-center">
              <div className="text-xs w-14 text-slate-400">{minutesToHhmm(slot.startMin)}</div>
              <div className="flex-1 bg-ink-800 rounded-xl px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{slot.task.title}</span>
                  <span className="muted-text text-xs">{slot.task.durationMin}分</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {plan.suggestedDrops.length > 0 && (
        <div className="section-card mb-4 border-warn/40">
          <div className="flex items-center gap-2 text-warn mb-2">
            <AlertTriangle size={16} />
            <span className="font-semibold">削る候補</span>
          </div>
          <ul className="space-y-2">
            {plan.suggestedDrops.map((t) => (
              <li key={t.id} className="flex items-center justify-between bg-ink-800 rounded-xl px-3 py-2.5">
                <span>{t.title} <span className="muted-text text-xs">{t.durationMin}分</span></span>
                <button onClick={() => dropSuggested(t.id)} className="ghost-button">削る</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {plan.deferredCandidates.length > 0 && (
        <div className="section-card mb-4">
          <div className="font-semibold mb-2">今日は見送り</div>
          <ul className="text-sm space-y-1">
            {plan.deferredCandidates.map((t) => (
              <li key={t.id} className="muted-text">・ {t.title}（{t.durationMin}分）</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={onStart} className="primary-button">
        <span className="inline-flex items-center gap-2 justify-center">
          <Play size={18} /> 実行を開始
        </span>
      </button>
    </div>
  );
}
