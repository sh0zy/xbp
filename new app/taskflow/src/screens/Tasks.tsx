import { useMemo, useState } from "react";
import type { AppApi } from "../App";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";
import { Modal } from "../components/Modal";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import {
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type PlanningSource,
  type Task,
  type TaskCategory,
  type TaskPriority,
  type TaskStatus,
} from "../types";
import { sortTasksBySmartPriority } from "../utils/taskSort";

type DueFilter = "all" | "with" | "without";
type DoneFilter = "all" | "done" | "open";
type SortKey = "smart" | "createdAt" | "dueDate" | "priority";

export function Tasks({ api }: { api: AppApi }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<TaskCategory | "all">("all");
  const [prio, setPrio] = useState<TaskPriority | "all">("all");
  const [stat, setStat] = useState<TaskStatus | "all">("all");
  const [due, setDue] = useState<DueFilter>("all");
  const [todayOnly, setTodayOnly] = useState(false);
  const [source, setSource] = useState<PlanningSource | "all">("all");
  const [doneFilter, setDoneFilter] = useState<DoneFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("smart");
  const [showCompleted, setShowCompleted] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = api.state.tasks.filter((t) => {
      if (q) {
        const hay = `${t.title} ${t.memo}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (cat !== "all" && t.category !== cat) return false;
      if (prio !== "all" && t.priority !== prio) return false;
      if (stat !== "all" && t.status !== stat) return false;
      if (due === "with" && !t.dueDate) return false;
      if (due === "without" && t.dueDate) return false;
      if (todayOnly && !t.isToday) return false;
      if (source !== "all" && t.planningSource !== source) return false;
      if (doneFilter === "done" && t.status !== "完了") return false;
      if (doneFilter === "open" && t.status === "完了") return false;
      return true;
    });
    return all;
  }, [api.state.tasks, query, cat, prio, stat, due, todayOnly, source, doneFilter]);

  const sorted = useMemo(() => {
    if (sortKey === "smart") return sortTasksBySmartPriority(filtered);
    const arr = [...filtered];
    if (sortKey === "createdAt") arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sortKey === "dueDate") arr.sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"));
    if (sortKey === "priority") {
      const score: Record<TaskPriority, number> = { 高: 3, 中: 2, 低: 1 };
      arr.sort((a, b) => score[b.priority] - score[a.priority]);
    }
    return arr;
  }, [filtered, sortKey]);

  const open = sorted.filter((t) => t.status !== "完了");
  const done = sorted.filter((t) => t.status === "完了");

  const renderCard = (t: Task) => (
    <TaskCard
      key={t.id}
      task={t}
      onComplete={api.completeTask}
      onSetInProgress={api.setInProgress}
      onSetTodo={api.setTodo}
      onToggleToday={api.toggleToday}
      onDelete={(id) => setPendingDelete(id)}
      onSelectFocus={(id) => {
        api.setFocus(id);
        api.goto("focus");
      }}
    />
  );

  return (
    <div className="px-4 pt-4 space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-[12px] text-ink-dim tracking-widest">TASKS</p>
          <h1 className="h-title">すべてのタスク</h1>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          + 追加
        </button>
      </header>

      <div className="card p-3 space-y-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
              <circle cx="11" cy="11" r="6" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="タスク名・メモから検索"
            className="field pl-9"
          />
        </div>

        <FilterRow label="カテゴリ">
          <Pill on={cat === "all"} onClick={() => setCat("all")}>すべて</Pill>
          {TASK_CATEGORIES.map((c) => (
            <Pill key={c} on={cat === c} onClick={() => setCat(c)}>{c}</Pill>
          ))}
        </FilterRow>

        <FilterRow label="優先度">
          <Pill on={prio === "all"} onClick={() => setPrio("all")}>すべて</Pill>
          {TASK_PRIORITIES.map((p) => (
            <Pill key={p} on={prio === p} onClick={() => setPrio(p)}>{p}</Pill>
          ))}
        </FilterRow>

        <FilterRow label="状態">
          <Pill on={stat === "all"} onClick={() => setStat("all")}>すべて</Pill>
          {TASK_STATUSES.map((s) => (
            <Pill key={s} on={stat === s} onClick={() => setStat(s)}>{s}</Pill>
          ))}
        </FilterRow>

        <FilterRow label="締切">
          <Pill on={due === "all"} onClick={() => setDue("all")}>すべて</Pill>
          <Pill on={due === "with"} onClick={() => setDue("with")}>締切あり</Pill>
          <Pill on={due === "without"} onClick={() => setDue("without")}>締切なし</Pill>
        </FilterRow>

        <FilterRow label="追加元">
          <Pill on={source === "all"} onClick={() => setSource("all")}>すべて</Pill>
          <Pill on={source === "前日"} onClick={() => setSource("前日")}>前日に準備</Pill>
          <Pill on={source === "当日"} onClick={() => setSource("当日")}>当日に追加</Pill>
          <Pill on={source === "通常"} onClick={() => setSource("通常")}>通常追加</Pill>
        </FilterRow>

        <FilterRow label="その他">
          <Pill on={todayOnly} onClick={() => setTodayOnly((v) => !v)}>今日やる</Pill>
          <Pill on={doneFilter === "open"} onClick={() => setDoneFilter(doneFilter === "open" ? "all" : "open")}>未完了</Pill>
          <Pill on={doneFilter === "done"} onClick={() => setDoneFilter(doneFilter === "done" ? "all" : "done")}>完了</Pill>
        </FilterRow>

        <FilterRow label="並び替え">
          <Pill on={sortKey === "smart"} onClick={() => setSortKey("smart")}>おすすめ</Pill>
          <Pill on={sortKey === "dueDate"} onClick={() => setSortKey("dueDate")}>締切順</Pill>
          <Pill on={sortKey === "priority"} onClick={() => setSortKey("priority")}>優先度順</Pill>
          <Pill on={sortKey === "createdAt"} onClick={() => setSortKey("createdAt")}>追加日</Pill>
        </FilterRow>
      </div>

      {sorted.length === 0 && query.trim() ? (
        <EmptyState title="一致するタスクが見つかりませんでした" description="検索条件を変えてみてください。" />
      ) : open.length === 0 && done.length === 0 ? (
        <EmptyState
          title="タスクがありません"
          description="右上の追加ボタンから新しいタスクを作りましょう。"
          action={
            <button className="btn-primary btn-sm" onClick={() => setShowAdd(true)}>
              タスクを追加
            </button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {open.map(renderCard)}

          {done.length > 0 && (
            <div className="card p-2">
              <button
                onClick={() => setShowCompleted((v) => !v)}
                className="w-full flex items-center justify-between px-2 py-2 text-[13px] text-ink-mute"
              >
                <span>完了済み {done.length}件</span>
                <span className={`transition ${showCompleted ? "rotate-180" : ""}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              {showCompleted && <div className="space-y-2.5 pt-2">{done.map(renderCard)}</div>}
            </div>
          )}
        </div>
      )}

      <Modal open={showAdd} title="新しいタスクを追加" onClose={() => setShowAdd(false)}>
        <TaskForm
          mode="custom"
          submitLabel="タスクを保存"
          onSubmit={(task) => {
            api.addTask(task);
            setShowAdd(false);
          }}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="このタスクを削除しますか？"
        description="削除したタスクは元に戻せません。"
        destructive
        confirmLabel="削除する"
        onConfirm={() => {
          if (pendingDelete) api.deleteTask(pendingDelete);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10.5px] text-ink-dim tracking-wider uppercase mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Pill({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={on ? "toggle-pill-on" : "toggle-pill"}>
      {children}
    </button>
  );
}
