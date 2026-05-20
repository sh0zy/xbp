import type { PlanningSource, TaskCategory, TaskPriority, TaskStatus } from "../types";

export function PriorityBadge({ p }: { p: TaskPriority }) {
  const map: Record<TaskPriority, string> = {
    高: "bg-red-500/15 text-red-300 border-red-400/30",
    中: "bg-amber-400/15 text-amber-200 border-amber-300/30",
    低: "bg-emerald-400/15 text-emerald-200 border-emerald-300/30",
  };
  return (
    <span className={`chip border ${map[p]}`}>
      <span className="opacity-70">優先</span>
      <span className="font-semibold">{p}</span>
    </span>
  );
}

export function StatusBadge({ s }: { s: TaskStatus }) {
  const map: Record<TaskStatus, string> = {
    未着手: "bg-white/[0.04] text-ink-mute border-line/70",
    進行中: "bg-blue-400/15 text-blue-200 border-blue-300/30",
    完了: "bg-violet-500/15 text-violet-200 border-violet-300/30",
  };
  return <span className={`chip border ${map[s]}`}>{s}</span>;
}

export function CategoryBadge({ c }: { c: TaskCategory }) {
  const map: Record<TaskCategory, string> = {
    大学: "bg-sky-400/10 text-sky-200 border-sky-300/25",
    就活: "bg-fuchsia-400/10 text-fuchsia-200 border-fuchsia-300/25",
    勉強: "bg-teal-400/10 text-teal-200 border-teal-300/25",
    アプリ開発: "bg-indigo-400/10 text-indigo-200 border-indigo-300/25",
    生活: "bg-lime-400/10 text-lime-200 border-lime-300/25",
    その他: "bg-white/[0.04] text-ink-mute border-line/70",
  };
  return <span className={`chip border ${map[c]}`}>{c}</span>;
}

export function PlanningSourceBadge({ s }: { s: PlanningSource }) {
  const label: Record<PlanningSource, string> = {
    前日: "前日に準備",
    当日: "今日追加",
    通常: "通常追加",
  };
  const map: Record<PlanningSource, string> = {
    前日: "bg-accent/15 text-accent border-accent/40",
    当日: "bg-amber-400/10 text-amber-200 border-amber-300/30",
    通常: "bg-white/[0.04] text-ink-dim border-line/70",
  };
  return <span className={`chip border ${map[s]}`}>{label[s]}</span>;
}
