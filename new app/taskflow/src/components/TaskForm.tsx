import { useState } from "react";
import {
  ESTIMATED_MINUTES,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type PlanningSource,
  type Task,
  type TaskCategory,
  type TaskPriority,
  type TaskStatus,
} from "../types";
import { getTodayDateString, getTomorrowDateString, nowIso } from "../utils/date";
import { genId } from "../utils/storage";

type Mode = "today" | "tomorrow" | "custom";

type Props = {
  mode?: Mode;
  defaultCategory?: TaskCategory;
  defaultPriority?: TaskPriority;
  defaultStatus?: TaskStatus;
  defaultMinutes?: 5 | 15 | 30 | 60;
  defaultPlanningSource?: PlanningSource;
  defaultIsToday?: boolean;
  showStartTime?: boolean;
  showTopTaskFlag?: boolean;
  submitLabel?: string;
  onSubmit: (task: Task, extras?: { startTime?: string; topTask?: boolean }) => void;
  onCancel?: () => void;
  compact?: boolean;
};

export function TaskForm({
  mode = "custom",
  defaultCategory = "その他",
  defaultPriority = "中",
  defaultStatus = "未着手",
  defaultMinutes = 15,
  defaultPlanningSource,
  defaultIsToday,
  showStartTime,
  showTopTaskFlag,
  submitLabel = "保存する",
  onSubmit,
  onCancel,
}: Props) {
  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();

  const initialPlannedDate = mode === "tomorrow" ? tomorrow : today;
  const initialDue = mode === "tomorrow" ? tomorrow : mode === "today" ? today : "";
  const initialSource: PlanningSource =
    defaultPlanningSource ?? (mode === "tomorrow" ? "前日" : mode === "today" ? "当日" : "通常");
  const initialIsToday = defaultIsToday ?? mode === "today";

  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [category, setCategory] = useState<TaskCategory>(defaultCategory);
  const [priority, setPriority] = useState<TaskPriority>(defaultPriority);
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [estimatedMinutes, setEstimatedMinutes] = useState<5 | 15 | 30 | 60>(defaultMinutes);
  const [dueDate, setDueDate] = useState<string>(initialDue);
  const [plannedForDate, setPlannedForDate] = useState<string>(initialPlannedDate);
  const [isToday, setIsToday] = useState<boolean>(initialIsToday);
  const [startTime, setStartTime] = useState<string>("");
  const [topTask, setTopTask] = useState<boolean>(false);

  const submit = () => {
    const t = title.trim();
    if (!t) return;
    const task: Task = {
      id: genId(),
      title: t,
      memo: memo.trim(),
      category,
      priority: topTask ? "高" : priority,
      status,
      dueDate: dueDate || undefined,
      estimatedMinutes,
      isToday,
      planningSource: initialSource,
      plannedForDate,
      createdAt: nowIso(),
    };
    onSubmit(task, { startTime: startTime || undefined, topTask });
    setTitle("");
    setMemo("");
    setStartTime("");
    setTopTask(false);
  };

  return (
    <div className="space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル(必須)"
        className="field"
      />
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="メモ (任意)"
        rows={2}
        className="field resize-none"
      />

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <div className="text-[11px] text-ink-dim mb-1">締切日</div>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="field"
          />
        </label>
        <label className="block">
          <div className="text-[11px] text-ink-dim mb-1">どの日のToDo</div>
          <input
            type="date"
            value={plannedForDate}
            onChange={(e) => setPlannedForDate(e.target.value)}
            className="field"
          />
        </label>
      </div>

      {showStartTime && (
        <label className="block">
          <div className="text-[11px] text-ink-dim mb-1">予定開始時間 (任意)</div>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="field"
          />
        </label>
      )}

      <div>
        <div className="text-[11px] text-ink-dim mb-1.5">カテゴリ</div>
        <div className="flex flex-wrap gap-1.5">
          {TASK_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={category === c ? "toggle-pill-on" : "toggle-pill"}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[11px] text-ink-dim mb-1.5">優先度</div>
          <div className="flex gap-1.5">
            {TASK_PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={priority === p ? "toggle-pill-on flex-1" : "toggle-pill flex-1"}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-ink-dim mb-1.5">状態</div>
          <div className="flex gap-1.5">
            {TASK_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={status === s ? "toggle-pill-on flex-1" : "toggle-pill flex-1"}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="text-[11px] text-ink-dim mb-1.5">所要時間</div>
        <div className="flex gap-1.5">
          {ESTIMATED_MINUTES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setEstimatedMinutes(m)}
              className={estimatedMinutes === m ? "toggle-pill-on flex-1" : "toggle-pill flex-1"}
            >
              {m}分
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center justify-between bg-white/[0.03] border border-line/70 rounded-xl px-3.5 py-3">
        <span className="text-[14px] text-ink-base">今日やる</span>
        <button
          type="button"
          onClick={() => setIsToday((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition ${isToday ? "bg-accent" : "bg-white/10"}`}
          aria-pressed={isToday}
          aria-label="今日やる切り替え"
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${
              isToday ? "left-5" : "left-0.5"
            }`}
          />
        </button>
      </label>

      {showTopTaskFlag && (
        <label className="flex items-center justify-between bg-white/[0.03] border border-line/70 rounded-xl px-3.5 py-3">
          <span className="text-[14px] text-ink-base">最優先タスクにする</span>
          <button
            type="button"
            onClick={() => setTopTask((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition ${topTask ? "bg-accent" : "bg-white/10"}`}
            aria-pressed={topTask}
            aria-label="最優先切り替え"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${
                topTask ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </label>
      )}

      <div className="flex gap-2 pt-1">
        {onCancel && (
          <button className="btn-ghost flex-1" onClick={onCancel}>
            キャンセル
          </button>
        )}
        <button className="btn-primary flex-1" onClick={submit} disabled={!title.trim()}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
