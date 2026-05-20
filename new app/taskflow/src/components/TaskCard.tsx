import { useState } from "react";
import type { Task } from "../types";
import { CategoryBadge, PlanningSourceBadge, PriorityBadge, StatusBadge } from "./Labels";
import { formatJaShortDate, isOverdue } from "../utils/date";

type Props = {
  task: Task;
  onComplete: (id: string) => void;
  onSetInProgress: (id: string) => void;
  onSetTodo: (id: string) => void;
  onToggleToday: (id: string) => void;
  onDelete: (id: string) => void;
  onSelectFocus?: (id: string) => void;
  compact?: boolean;
};

export function TaskCard({
  task,
  onComplete,
  onSetInProgress,
  onSetTodo,
  onToggleToday,
  onDelete,
  onSelectFocus,
  compact,
}: Props) {
  const [open, setOpen] = useState(false);
  const overdue = isOverdue(task);
  const done = task.status === "完了";

  return (
    <div
      className={`card p-3 transition ${
        done ? "opacity-60" : ""
      } ${overdue ? "border-amber-400/40 shadow-[0_0_0_1px_rgba(251,191,36,0.15)]" : ""}`}
    >
      <div className="flex items-start gap-3">
        <button
          aria-label={done ? "未着手に戻す" : "完了にする"}
          onClick={() => (done ? onSetTodo(task.id) : onComplete(task.id))}
          className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition ${
            done
              ? "bg-accent border-accent text-white"
              : "border-line/80 hover:border-accent/70 text-transparent hover:text-accent/40"
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-3.5 h-3.5">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`text-[15px] leading-snug font-medium ${done ? "line-through text-ink-mute" : "text-ink-base"}`}>
              {task.title}
            </h4>
          </div>
          {task.memo && !compact && (
            <p className="text-[12.5px] text-ink-mute mt-1 leading-relaxed line-clamp-2">{task.memo}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <CategoryBadge c={task.category} />
            <PriorityBadge p={task.priority} />
            <StatusBadge s={task.status} />
            <PlanningSourceBadge s={task.planningSource} />
            <span className="chip">
              <span className="opacity-70">⏱</span> {task.estimatedMinutes}分
            </span>
            {task.dueDate && (
              <span className={`chip ${overdue ? "text-amber-300 border-amber-400/40" : ""}`}>
                <span className="opacity-70">締切</span> {formatJaShortDate(task.dueDate)}
              </span>
            )}
            {task.isToday && <span className="chip text-accent border-accent/40">今日やる</span>}
          </div>
        </div>

        <button
          aria-label="操作"
          onClick={() => setOpen((o) => !o)}
          className="text-ink-dim hover:text-ink-base p-1.5 -mr-1"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <circle cx="5" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="19" cy="12" r="1.6" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t border-line/60 grid grid-cols-2 gap-2">
          {task.status !== "進行中" && task.status !== "完了" && (
            <button className="btn-ghost btn-sm" onClick={() => onSetInProgress(task.id)}>
              進行中にする
            </button>
          )}
          {task.status !== "未着手" && (
            <button className="btn-ghost btn-sm" onClick={() => onSetTodo(task.id)}>
              未着手に戻す
            </button>
          )}
          {!done && (
            <button className="btn-ghost btn-sm" onClick={() => onComplete(task.id)}>
              完了にする
            </button>
          )}
          <button className="btn-ghost btn-sm" onClick={() => onToggleToday(task.id)}>
            {task.isToday ? "今日やるから外す" : "今日やるに追加"}
          </button>
          {onSelectFocus && !done && (
            <button className="btn-ghost btn-sm" onClick={() => onSelectFocus(task.id)}>
              集中モードで開く
            </button>
          )}
          <button className="btn-danger btn-sm col-span-2" onClick={() => onDelete(task.id)}>
            削除する
          </button>
        </div>
      )}
    </div>
  );
}
