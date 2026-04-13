import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, SkipForward, Plus } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { formatDuration } from "../lib/time";

export default function ExecutionPage() {
  const nav = useNavigate();
  const plan = useAppStore((s) => s.currentPlan);
  const exec = useAppStore((s) => s.executionState);
  const completeCurrent = useAppStore((s) => s.completeCurrentTask);
  const skipCurrent = useAppStore((s) => s.skipCurrentTask);
  const extendCurrent = useAppStore((s) => s.extendCurrentTask);

  const [taskStart, setTaskStart] = useState<number>(Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setTaskStart(Date.now());
  }, [exec.currentIndex]);

  if (!plan || !exec.planId) {
    return (
      <div className="page-shell">
        <p className="muted-text">実行中のプランがありません。</p>
        <button onClick={() => nav("/home")} className="primary-button mt-4">
          ホームへ
        </button>
      </div>
    );
  }

  const task = plan.tasks[exec.currentIndex];
  const isDone = !task;

  if (isDone) {
    return (
      <div className="page-shell">
        <div className="flex-1 flex flex-col justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-ok/20 inline-flex items-center justify-center mx-auto mb-4">
            <Check className="text-ok" />
          </div>
          <h1 className="h1 mb-2">今夜の行動、おつかれさま</h1>
          <p className="muted-text">ふりかえりを記録しよう</p>
        </div>
        <button onClick={() => nav("/review")} className="primary-button">
          ふりかえりへ
        </button>
      </div>
    );
  }

  const elapsed = Math.floor((now - taskStart) / 1000);
  const plannedSec = task.durationMin * 60;
  const remaining = plannedSec - elapsed;
  const mm = Math.floor(Math.abs(remaining) / 60);
  const ss = Math.abs(remaining) % 60;
  const over = remaining < 0;

  return (
    <div className="page-shell">
      <div className="flex items-center justify-between mb-6 safe-top">
        <span className="muted-text">
          {exec.currentIndex + 1} / {plan.tasks.length}
        </span>
        <span className="status-pill">
          完了 {exec.completedIds.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="muted-text">いま</div>
        <h1 className="text-4xl font-bold mt-2 mb-8">{task.title}</h1>

        <div className={`text-7xl font-light tabular-nums ${over ? "text-warn" : ""}`}>
          {over && "+"}
          {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </div>
        <div className="muted-text mt-2">
          目安 {formatDuration(task.durationMin)}
          {task.priority === "must" ? " ・ 絶対" : " ・ できれば"}
        </div>

        <button
          onClick={() => extendCurrent(5)}
          className="mt-6 ghost-button inline-flex items-center gap-1"
        >
          <Plus size={14} /> 5分延長
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-8">
        <button onClick={skipCurrent} className="secondary-button inline-flex items-center justify-center gap-2">
          <SkipForward size={16} /> スキップ
        </button>
        <button onClick={completeCurrent} className="primary-button inline-flex items-center justify-center gap-2">
          <Check size={18} /> 完了
        </button>
      </div>
    </div>
  );
}
