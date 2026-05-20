import { useMemo, useState } from "react";
import type { AppApi } from "../App";
import { DashboardCards } from "../components/DashboardCards";
import { EmptyState } from "../components/EmptyState";
import { Modal } from "../components/Modal";
import { QuickAdd } from "../components/QuickAdd";
import { ReminderBanner } from "../components/ReminderBanner";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { ConfirmDialog } from "../components/ConfirmDialog";
import {
  formatJaDate,
  getCurrentHour,
  getTodayDateString,
  getTodayTasks,
  getTomorrowTasks,
  nowIso,
} from "../utils/date";
import { genId } from "../utils/storage";
import { sortTasksBySmartPriority } from "../utils/taskSort";

export function Home({ api }: { api: AppApi }) {
  const today = getTodayDateString();
  const todayTasks = useMemo(() => getTodayTasks(api.state.tasks), [api.state.tasks]);
  const sorted = useMemo(() => sortTasksBySmartPriority(todayTasks), [todayTasks]);
  const tomorrowTasks = useMemo(() => getTomorrowTasks(api.state.tasks), [api.state.tasks]);

  const hour = getCurrentHour();
  const showMorning = hour >= 5 && hour < 11 && todayTasks.length === 0;
  const showEvening = hour >= 20 && tomorrowTasks.length === 0;

  const [showTodayForm, setShowTodayForm] = useState(false);
  const [showQuickOne, setShowQuickOne] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const quickAdd = (title: string) => {
    api.addTask({
      id: genId(),
      title,
      memo: "",
      category: "その他",
      priority: "中",
      status: "未着手",
      estimatedMinutes: 15,
      isToday: true,
      planningSource: "通常",
      plannedForDate: today,
      createdAt: nowIso(),
    });
  };

  return (
    <div className="px-4 pt-4 space-y-5">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-[12px] text-ink-dim tracking-widest">TODAY</p>
          <h1 className="h-title">{formatJaDate(today)}</h1>
        </div>
        <div className="text-[11px] text-ink-dim">
          今日 {todayTasks.length}件 / 明日 {tomorrowTasks.length}件
        </div>
      </header>

      <QuickAdd onAdd={quickAdd} placeholder="タイトルだけで追加できます" />

      {showMorning && (
        <ReminderBanner
          tone="morning"
          title="朝のリカバリー"
          description="昨日書けなかったなら、今3分だけ使って今日のToDoを決めましょう。"
          primary={{ label: "今日のToDoを書く", onClick: () => setShowTodayForm(true) }}
          secondary={{ label: "とりあえず1つ追加", onClick: () => setShowQuickOne(true) }}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 text-amber-300">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" strokeLinecap="round" />
            </svg>
          }
        />
      )}

      {showEvening && (
        <ReminderBanner
          tone="evening"
          title="夜の準備リマインド"
          description="明日のToDoを3つだけ決めておくと、朝がかなり楽になります。"
          primary={{
            label: "明日のToDoを書く",
            onClick: () => {
              api.setReviewIntent("three-template");
              api.goto("review");
            },
          }}
          secondary={{ label: "あとで", onClick: () => {} }}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 text-accent">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          }
        />
      )}

      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="section-title">今日やること</h2>
          {todayTasks.length > 0 && (
            <span className="text-[11px] text-ink-dim">優先順位で自動並び替え</span>
          )}
        </div>
        {sorted.length === 0 ? (
          <EmptyState
            title="今日やることがまだありません"
            description="昨日の夜に書けなかった場合は、今ここで今日のToDoを作りましょう。まずは1つだけ決めましょう。"
            action={
              <div className="flex gap-2 justify-center">
                <button className="btn-primary btn-sm" onClick={() => setShowTodayForm(true)}>
                  今日のToDoを書く
                </button>
                <button className="btn-ghost btn-sm" onClick={() => setShowQuickOne(true)}>
                  1つだけ追加
                </button>
              </div>
            }
          />
        ) : (
          <div className="space-y-2.5">
            {sorted.map((t) => (
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
            ))}
          </div>
        )}
      </section>

      <section className="space-y-2.5">
        <h2 className="section-title">ダッシュボード</h2>
        <DashboardCards tasks={api.state.tasks} />
      </section>

      <Modal open={showTodayForm} title="今日のToDoを作る" onClose={() => setShowTodayForm(false)}>
        <TaskForm
          mode="today"
          defaultPlanningSource="当日"
          defaultIsToday
          submitLabel="今日のToDoを保存"
          onSubmit={(task) => {
            api.addTask(task);
            setShowTodayForm(false);
          }}
          onCancel={() => setShowTodayForm(false)}
        />
      </Modal>

      <Modal open={showQuickOne} title="とりあえず1つだけ追加" onClose={() => setShowQuickOne(false)}>
        <QuickOne
          onAdd={(title) => {
            quickAdd(title);
            setShowQuickOne(false);
          }}
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

function QuickOne({ onAdd }: { onAdd: (title: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="space-y-3">
      <input
        autoFocus
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="タイトルだけで保存できます"
        className="field"
        onKeyDown={(e) => {
          if (e.key === "Enter" && v.trim()) onAdd(v.trim());
        }}
      />
      <button className="btn-primary w-full" disabled={!v.trim()} onClick={() => v.trim() && onAdd(v.trim())}>
        追加する
      </button>
    </div>
  );
}
