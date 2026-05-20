import { useEffect, useMemo, useRef, useState } from "react";
import type { AppApi } from "../App";
import { EmptyState } from "../components/EmptyState";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { ThreeTaskTemplate } from "../components/ThreeTaskTemplate";
import { ConfirmDialog } from "../components/ConfirmDialog";
import {
  formatJaDate,
  getTodayDateString,
  getTomorrowDateString,
} from "../utils/date";

export function Review({ api }: { api: AppApi }) {
  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();
  const [memo, setMemo] = useState("");
  const [topTask, setTopTask] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const tomorrowSectionRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (api.reviewIntent === "tomorrow-form") {
      tomorrowSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      api.setReviewIntent(null);
    }
    if (api.reviewIntent === "three-template") {
      threeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      api.setReviewIntent(null);
    }
  }, [api.reviewIntent, api]);

  const todayCompleted = useMemo(
    () =>
      api.state.tasks.filter(
        (t) => t.status === "完了" && t.completedAt && t.completedAt.startsWith(today)
      ),
    [api.state.tasks, today]
  );
  const todayRemaining = useMemo(
    () =>
      api.state.tasks.filter(
        (t) =>
          t.status !== "完了" &&
          (t.plannedForDate === today || t.dueDate === today || t.isToday)
      ),
    [api.state.tasks, today]
  );
  const completedFromYesterdayPlanned = todayCompleted.filter(
    (t) => t.planningSource === "前日" && t.plannedForDate === today
  );
  const completedAddedToday = todayCompleted.filter(
    (t) => t.planningSource === "当日" && t.plannedForDate === today
  );

  const tomorrowTasks = useMemo(
    () => api.state.tasks.filter((t) => t.plannedForDate === tomorrow),
    [api.state.tasks, tomorrow]
  );

  const saveNote = () => {
    if (!memo.trim() && !topTask.trim()) return;
    api.addReviewNote(memo, topTask);
    setMemo("");
    setTopTask("");
  };

  const renderCard = (t: (typeof api.state.tasks)[number]) => (
    <TaskCard
      key={t.id}
      task={t}
      onComplete={api.completeTask}
      onSetInProgress={api.setInProgress}
      onSetTodo={api.setTodo}
      onToggleToday={api.toggleToday}
      onDelete={(id) => setPendingDelete(id)}
      compact
    />
  );

  const lastNote = api.state.reviewNotes[0];

  return (
    <div className="px-4 pt-4 space-y-5">
      <header>
        <p className="text-[12px] text-ink-dim tracking-widest">REVIEW</p>
        <h1 className="h-title">今日のふりかえり</h1>
        <p className="text-[12px] text-ink-mute mt-1">{formatJaDate(today)}</p>
      </header>

      <section className="space-y-2.5">
        <h2 className="section-title">今日完了したタスク ({todayCompleted.length})</h2>
        {todayCompleted.length === 0 ? (
          <EmptyState
            title="まだ完了したタスクはありません"
            description="小さく1つ終わらせましょう。5分で済むものから始めるとペースが出ます。"
          />
        ) : (
          <div className="space-y-2.5">{todayCompleted.map(renderCard)}</div>
        )}
      </section>

      <section className="space-y-2.5">
        <h2 className="section-title">今日残ったタスク ({todayRemaining.length})</h2>
        {todayRemaining.length === 0 ? (
          <div className="card p-4 text-center text-[13px] text-ink-mute">
            残ったタスクはありません。今日はよくがんばりました。
          </div>
        ) : (
          <div className="space-y-2.5">{todayRemaining.map(renderCard)}</div>
        )}
      </section>

      <section className="grid grid-cols-2 gap-2">
        <div className="card p-3">
          <div className="text-[10.5px] text-ink-dim tracking-wider uppercase mb-1">
            前日に準備して完了
          </div>
          <div className="text-2xl font-semibold text-accent">
            {completedFromYesterdayPlanned.length}
          </div>
        </div>
        <div className="card p-3">
          <div className="text-[10.5px] text-ink-dim tracking-wider uppercase mb-1">
            当日に追加して完了
          </div>
          <div className="text-2xl font-semibold text-emerald-300">
            {completedAddedToday.length}
          </div>
        </div>
      </section>

      <section className="space-y-2.5">
        <h2 className="section-title">一言メモと明日の最優先タスク</h2>
        <div className="card p-4 space-y-3">
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="今日の気づき・反省・気分など"
            rows={3}
            className="field resize-none"
          />
          <input
            value={topTask}
            onChange={(e) => setTopTask(e.target.value)}
            placeholder="明日の最優先タスク（1つに絞ると朝が楽）"
            className="field"
          />
          <button
            className="btn-primary w-full"
            onClick={saveNote}
            disabled={!memo.trim() && !topTask.trim()}
          >
            ふりかえりを保存
          </button>
          {lastNote && (
            <p className="text-[11px] text-ink-dim text-center">
              直近の保存: {lastNote.date}
            </p>
          )}
        </div>
      </section>

      <section ref={tomorrowSectionRef} className="space-y-2.5">
        <h2 className="section-title">明日のToDoを作る</h2>
        <p className="text-[12px] text-ink-mute">
          夜のうちに翌日の予定を整えると、朝に考えすぎず、すぐ行動に入れます。
        </p>
        <div className="card p-4">
          <TaskForm
            mode="tomorrow"
            defaultPlanningSource="前日"
            defaultIsToday={false}
            showStartTime
            showTopTaskFlag
            submitLabel="明日のToDoとして保存"
            onSubmit={(task) => {
              api.addTask(task);
            }}
          />
        </div>
      </section>

      <section ref={threeRef} className="space-y-2.5">
        <h2 className="section-title">明日のToDoを3つだけ作る</h2>
        <p className="text-[12px] text-ink-mute">
          優先度の異なる3行だけ。空欄は保存されません。
        </p>
        <div className="card p-4">
          <ThreeTaskTemplate onSubmit={(tasks) => api.addManyTasks(tasks)} />
        </div>
      </section>

      <section className="space-y-2.5">
        <h2 className="section-title">明日のToDo ({tomorrowTasks.length})</h2>
        {tomorrowTasks.length === 0 ? (
          <EmptyState
            title="明日のToDoはまだありません"
            description="夜に3つだけ決めておくと朝が楽になります。"
          />
        ) : (
          <div className="space-y-2.5">{tomorrowTasks.map(renderCard)}</div>
        )}
      </section>

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
