import type { Task, TaskCategory } from "../types";
import { TASK_CATEGORIES } from "../types";
import { getTodayDateString, getTodayTasks, getWeekCompletedTasks, isOverdue } from "../utils/date";

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "accent" | "warn" | "ok" | "mute";
}) {
  const tones: Record<string, string> = {
    accent: "text-accent",
    warn: "text-amber-300",
    ok: "text-emerald-300",
    mute: "text-ink-mute",
  };
  const t = tones[tone ?? "accent"];
  return (
    <div className="card p-3 flex flex-col gap-1">
      <div className="text-[11px] text-ink-dim tracking-wide">{label}</div>
      <div className={`text-2xl font-semibold ${t}`}>{value}</div>
      {hint && <div className="text-[11px] text-ink-dim">{hint}</div>}
    </div>
  );
}

export function DashboardCards({ tasks }: { tasks: Task[] }) {
  const today = getTodayDateString();
  const todayTasks = getTodayTasks(tasks);
  const todayDone = todayTasks.filter((t) => t.status === "完了").length;
  const todayOpen = todayTasks.filter((t) => t.status !== "完了").length;
  const weekDone = getWeekCompletedTasks(tasks).length;
  const overdue = tasks.filter(isOverdue).length;
  const highPriority = tasks.filter((t) => t.priority === "高" && t.status !== "完了").length;
  const fromYesterday = tasks.filter((t) => t.planningSource === "前日" && t.plannedForDate === today).length;
  const addedToday = tasks.filter((t) => t.planningSource === "当日" && t.plannedForDate === today).length;

  const byCategory: Record<TaskCategory, number> = {
    大学: 0,
    就活: 0,
    勉強: 0,
    アプリ開発: 0,
    生活: 0,
    その他: 0,
  };
  tasks.forEach((t) => {
    byCategory[t.category] += 1;
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2.5">
        <Stat label="今日 未完了" value={todayOpen} tone="accent" />
        <Stat label="今日 完了" value={todayDone} tone="ok" />
        <Stat label="今週 完了" value={weekDone} tone="ok" />
        <Stat label="締切切れ" value={overdue} tone={overdue > 0 ? "warn" : "mute"} />
        <Stat label="高優先 未完" value={highPriority} tone={highPriority > 0 ? "warn" : "mute"} />
        <Stat label="前日準備" value={fromYesterday} hint="今日のうち" tone="accent" />
      </div>
      <div className="card p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[12px] text-ink-dim tracking-wide">カテゴリ別</div>
          <div className="text-[11px] text-ink-dim">今日追加 {addedToday}</div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TASK_CATEGORIES.map((c) => (
            <span key={c} className="chip">
              <span className="text-ink-mute">{c}</span>
              <span className="text-ink-base font-medium">{byCategory[c]}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
