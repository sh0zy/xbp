import { useEffect, useMemo, useState } from "react";
import type { AppApi } from "../App";
import { EmptyState } from "../components/EmptyState";
import { CategoryBadge, PlanningSourceBadge, PriorityBadge, StatusBadge } from "../components/Labels";
import { Modal } from "../components/Modal";
import { formatJaShortDate, getTodayTasks, isOverdue } from "../utils/date";
import { sortTasksBySmartPriority } from "../utils/taskSort";
import type { Task } from "../types";

export function Focus({ api }: { api: AppApi }) {
  const todayTasks = useMemo(() => getTodayTasks(api.state.tasks), [api.state.tasks]);
  const sorted = useMemo(() => sortTasksBySmartPriority(todayTasks), [todayTasks]);

  const selected =
    api.state.tasks.find((t) => t.id === api.state.selectedFocusTaskId && t.status !== "完了") ??
    sorted[0];

  const [picker, setPicker] = useState(false);

  useEffect(() => {
    if (selected && selected.id !== api.state.selectedFocusTaskId) {
      api.setFocus(selected.id);
    }
    if (!selected && api.state.selectedFocusTaskId) {
      api.setFocus(undefined);
    }
  }, [selected, api]);

  if (!selected) {
    return (
      <div className="px-4 pt-4 space-y-4">
        <header>
          <p className="text-[12px] text-ink-dim tracking-widest">FOCUS</p>
          <h1 className="h-title">今日の集中モード</h1>
        </header>
        <EmptyState
          title="今日やることがまだありません"
          description="まずは1つだけ追加しましょう。決められない日は『5分だけ進める』タスクで十分です。"
          action={
            <button className="btn-primary btn-sm" onClick={() => api.goto("home")}>
              ホームで追加する
            </button>
          }
        />
      </div>
    );
  }

  const reason = buildReason(selected);

  return (
    <div className="px-4 pt-4 space-y-5">
      <header>
        <p className="text-[12px] text-ink-dim tracking-widest">FOCUS</p>
        <h1 className="h-title">いま、これだけに集中する</h1>
      </header>

      <div className="card-hl p-6 text-center bg-gradient-to-br from-accent/15 via-bg-elevated/60 to-transparent">
        <div className="flex justify-center gap-1.5 flex-wrap mb-4">
          <CategoryBadge c={selected.category} />
          <PriorityBadge p={selected.priority} />
          <StatusBadge s={selected.status} />
          <PlanningSourceBadge s={selected.planningSource} />
          <span className="chip">⏱ {selected.estimatedMinutes}分</span>
          {selected.dueDate && (
            <span className={`chip ${isOverdue(selected) ? "text-amber-300 border-amber-400/40" : ""}`}>
              締切 {formatJaShortDate(selected.dueDate)}
            </span>
          )}
        </div>
        <h2 className="text-[24px] sm:text-[26px] font-semibold leading-snug text-ink-base">
          {selected.title}
        </h2>
        {selected.memo && (
          <p className="text-[13.5px] text-ink-mute mt-3 whitespace-pre-wrap leading-relaxed">
            {selected.memo}
          </p>
        )}

        <div className="mt-6 mx-auto max-w-xs text-left bg-white/[0.04] border border-line/60 rounded-xl px-4 py-3">
          <div className="text-[10.5px] text-ink-dim tracking-wider uppercase mb-1">今日これをやる理由</div>
          <p className="text-[13px] text-ink-base leading-relaxed">{reason}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {selected.status !== "進行中" && (
          <button className="btn-ghost" onClick={() => api.setInProgress(selected.id)}>
            進行中にする
          </button>
        )}
        <button className="btn-primary" onClick={() => api.completeTask(selected.id)}>
          完了にする
        </button>
        <button
          className="btn-ghost"
          onClick={() => {
            const next = sorted.find((t) => t.id !== selected.id) ?? sorted[0];
            api.setFocus(next ? next.id : undefined);
          }}
        >
          あとでやる
        </button>
        <button className="btn-ghost" onClick={() => setPicker(true)}>
          別のタスクに切り替える
        </button>
      </div>

      <Modal open={picker} title="集中するタスクを選ぶ" onClose={() => setPicker(false)}>
        <div className="space-y-2">
          {sorted.length === 0 && (
            <p className="text-[13px] text-ink-mute">選べるタスクがありません。</p>
          )}
          {sorted.map((t) => (
            <button
              key={t.id}
              className={`w-full text-left card p-3 transition ${
                t.id === selected.id ? "border-accent/60" : ""
              }`}
              onClick={() => {
                api.setFocus(t.id);
                setPicker(false);
              }}
            >
              <div className="text-[14.5px] text-ink-base">{t.title}</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <CategoryBadge c={t.category} />
                <PriorityBadge p={t.priority} />
                <span className="chip">⏱ {t.estimatedMinutes}分</span>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

function buildReason(t: Task): string {
  const reasons: string[] = [];
  if (t.priority === "高") reasons.push("優先度が高いタスクだから");
  if (t.dueDate && isOverdue(t)) reasons.push("締切を過ぎているから今日中に動かしたい");
  else if (t.dueDate) reasons.push(`締切が ${formatJaShortDate(t.dueDate)} なので今日進めると安心`);
  if (t.estimatedMinutes <= 15) reasons.push(`${t.estimatedMinutes}分でも前進できる`);
  if (t.planningSource === "前日") reasons.push("前日の自分が選んだ大事な1つだから");
  if (reasons.length === 0) reasons.push("今日のあなたの一歩を作るタスクだから");
  return reasons.join("。") + "。";
}
