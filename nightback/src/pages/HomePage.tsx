import { useNavigate } from "react-router-dom";
import { Moon, Play, Copy, Sparkles } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import BottomNav from "../components/common/BottomNav";
import { formatDuration } from "../lib/time";

export default function HomePage() {
  const nav = useNavigate();
  const settings = useAppStore((s) => s.settings);
  const currentPlan = useAppStore((s) => s.currentPlan);
  const executionState = useAppStore((s) => s.executionState);
  const history = useAppStore((s) => s.history);
  const createDraft = useAppStore((s) => s.createDraft);
  const duplicate = useAppStore((s) => s.duplicateYesterdayPlan);

  const onStartPlanning = () => {
    createDraft();
    nav("/plan");
  };

  const onDuplicate = () => {
    if (duplicate()) nav("/plan");
  };

  const isExecuting = executionState.planId && currentPlan;
  const lastEntry = history[history.length - 1];

  return (
    <div className="page-shell">
      <div className="flex items-center justify-between mb-6 safe-top">
        <div>
          <p className="muted-text">今夜の計画</p>
          <h1 className="h1">NightBack</h1>
        </div>
        <div className="inline-flex items-center gap-2 status-pill">
          <Moon size={14} className="text-accent" />
          {settings.targetBedtime}就寝
        </div>
      </div>

      {isExecuting && (
        <button
          onClick={() => nav("/execute")}
          className="section-card w-full text-left mb-4 border-accent/60"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Play className="text-accent" size={18} />
            </div>
            <div className="flex-1">
              <div className="font-semibold">実行中のプラン</div>
              <div className="muted-text">
                {executionState.completedIds.length}/{currentPlan.tasks.length} 完了
              </div>
            </div>
          </div>
        </button>
      )}

      {!isExecuting && currentPlan && (
        <button
          onClick={() => nav("/plan/result")}
          className="section-card w-full text-left mb-4"
        >
          <div className="font-semibold mb-1">作成済みプラン</div>
          <div className="muted-text">
            {currentPlan.tasks.length}件 / 合計 {formatDuration(currentPlan.tasks.reduce((s, t) => s + t.durationMin, 0))}
          </div>
        </button>
      )}

      <div className="grid gap-3">
        <button onClick={onStartPlanning} className="section-card text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Sparkles className="text-accent" size={18} />
            </div>
            <div className="flex-1">
              <div className="font-semibold">今夜の計画を作る</div>
              <div className="muted-text">帰宅時刻と就寝時刻から逆算</div>
            </div>
          </div>
        </button>

        <button
          onClick={onDuplicate}
          disabled={history.length === 0}
          className="section-card text-left disabled:opacity-40"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ink-600 flex items-center justify-center">
              <Copy size={18} className="text-slate-300" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">昨日と同じで組む</div>
              <div className="muted-text">
                {history.length === 0 ? "まだ履歴がありません" : "履歴から複製"}
              </div>
            </div>
          </div>
        </button>
      </div>

      {lastEntry && lastEntry.review && (
        <div className="section-card mt-4">
          <div className="muted-text mb-1">前回のふりかえり</div>
          <div className="text-sm">
            {lastEntry.review.completedCount}/{lastEntry.review.totalCount} 完了 · 調子 {lastEntry.review.feeling}/5
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
