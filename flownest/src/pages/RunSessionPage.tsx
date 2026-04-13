import { useEffect, useMemo, useState } from 'react';
import type { Route } from '../app/router';
import { useStore } from '../store/AppStoreContext';
import { computeSessionProgress, formatDuration, formatHm, resolveTargetDate } from '../lib/time';
import type { DailyLog, SessionState, TaskItem } from '../types';
import { uid } from '../lib/id';

interface Props {
  navigate: (r: Route) => void;
}

const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function RunSessionPage({ navigate }: Props) {
  const { session, getTemplate, updateSession, endSession, appendLog } = useStore();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);

  const template = session ? getTemplate(session.templateId) : undefined;

  const progress = useMemo(
    () => (template && session ? computeSessionProgress(template, session, now) : null),
    [template, session, now],
  );

  if (!session || !template || !progress) {
    return (
      <div className="px-5 pt-20 text-center text-sm text-nest-sub">
        <p>進行中のセッションはありません</p>
        <button className="nest-btn-primary mt-4" onClick={() => navigate({ name: 'home' })}>
          ホームへ
        </button>
      </div>
    );
  }

  const sortedTasks = [...template.tasks].sort((a, b) => a.order - b.order);
  const activeTask: TaskItem | undefined = sortedTasks[progress.activeIndex];
  const isDone = progress.activeIndex >= sortedTasks.length;

  const mutateTask = (taskId: string, status: 'done' | 'skipped', extend = 0) => {
    updateSession((s) => {
      const nextTasks = s.tasks.map((t) => {
        if (t.taskId !== taskId) return t;
        return { ...t, status, extendedMinutes: t.extendedMinutes + extend };
      });
      // Activate next pending
      const orderMap = new Map(sortedTasks.map((t, i) => [t.id, i] as const));
      const currentIdx = orderMap.get(taskId) ?? -1;
      const nextIdx = currentIdx + 1;
      if (nextIdx < sortedTasks.length) {
        const nextId = sortedTasks[nextIdx].id;
        return {
          ...s,
          tasks: nextTasks.map((t) => (t.taskId === nextId ? { ...t, status: 'active' } : t)),
        };
      }
      return { ...s, tasks: nextTasks, finishedAt: Date.now() };
    });
  };

  const extendActive = (min: number) => {
    if (!activeTask) return;
    updateSession((s) => ({
      ...s,
      tasks: s.tasks.map((t) =>
        t.taskId === activeTask.id ? { ...t, extendedMinutes: t.extendedMinutes + min } : t,
      ),
    }));
  };

  const finishSession = (s: SessionState) => {
    const target = resolveTargetDate(template.mode, s.targetTime, new Date());
    const finishedAt = Date.now();
    const delayMinutes = Math.round((finishedAt - target.getTime()) / 60_000);
    const log: DailyLog = {
      id: uid(),
      date: dateKey(new Date()),
      mode: template.mode,
      templateId: template.id,
      templateName: template.name,
      success: delayMinutes <= 0,
      targetTime: s.targetTime,
      finishedAt,
      delayMinutes,
      completedTaskCount: s.tasks.filter((t) => t.status === 'done').length,
      skippedTaskCount: s.tasks.filter((t) => t.status === 'skipped').length,
    };
    appendLog(log);
    endSession();
    navigate({ name: 'review' });
  };

  const doneRatio = progress.total > 0 ? (progress.completed + progress.skipped) / progress.total : 0;
  const delay = progress.delayMinutes;

  return (
    <div className="pb-8">
      <div
        className={`px-5 pt-10 pb-6 ${
          template.mode === 'morning'
            ? 'bg-gradient-to-b from-nest-morning/30 via-nest-bg to-nest-bg'
            : 'bg-gradient-to-b from-nest-night/30 via-nest-bg to-nest-bg'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-nest-sub">
          <button onClick={() => navigate({ name: 'home' })}>← ホーム</button>
          <span>
            {template.name} · 目標 {template.targetTime}
          </span>
        </div>

        <div className="mt-6">
          <p className="nest-label">
            {template.mode === 'morning' ? '出発まで' : '就寝まで'}
          </p>
          <p className="text-5xl font-bold tabular-nums">
            {formatDuration(Math.max(0, progress.remainingMinutes))}
          </p>
          <p
            className={`mt-1 text-sm font-semibold ${
              delay > 3
                ? 'text-nest-danger'
                : delay < -3
                  ? 'text-nest-accent'
                  : 'text-nest-sub'
            }`}
          >
            {delay > 0
              ? `⚠ 予定より ${delay}分 遅れ`
              : delay < 0
                ? `✓ ${Math.abs(delay)}分 余裕`
                : '予定通り'}
          </p>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-nest-surface">
          <div
            className="h-full bg-nest-accent transition-all"
            style={{ width: `${Math.round(doneRatio * 100)}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-nest-sub">
          {progress.completed} 完了 / {progress.skipped} スキップ / 全 {progress.total}
        </p>
      </div>

      <div className="space-y-4 px-5 pt-4">
        {isDone ? (
          <div className="nest-card p-5 text-center">
            <p className="text-lg font-semibold">全タスク完了</p>
            <p className="mt-1 text-sm text-nest-sub">記録を保存してください</p>
            <button
              className="nest-btn-primary mt-4 w-full"
              onClick={() => finishSession(session)}
            >
              ふりかえりに進む
            </button>
          </div>
        ) : activeTask ? (
          <div className="nest-card p-5">
            <p className="nest-label text-nest-accent">今やること</p>
            <p className="mt-1 text-2xl font-bold">{activeTask.title}</p>
            <p className="mt-1 text-sm text-nest-sub">
              目安 {formatDuration(activeTask.durationMinutes)}
              {activeTask.notes ? ` · ${activeTask.notes}` : ''}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                className="nest-btn-primary"
                onClick={() => mutateTask(activeTask.id, 'done')}
              >
                ✓ 完了
              </button>
              <button
                className="nest-btn-ghost"
                onClick={() => mutateTask(activeTask.id, 'skipped')}
                disabled={!activeTask.skippable}
              >
                ⇥ スキップ
              </button>
              <button className="nest-btn-ghost" onClick={() => extendActive(3)}>
                +3分
              </button>
              <button className="nest-btn-ghost" onClick={() => extendActive(5)}>
                +5分
              </button>
            </div>
          </div>
        ) : null}

        <section>
          <h3 className="nest-label mb-2">この先の予定</h3>
          <ol className="space-y-2">
            {sortedTasks.map((t, i) => {
              const s = session.tasks.find((st) => st.taskId === t.id);
              const statusIcon =
                s?.status === 'done'
                  ? '✓'
                  : s?.status === 'skipped'
                    ? '↷'
                    : i === progress.activeIndex
                      ? '●'
                      : '○';
              return (
                <li
                  key={t.id}
                  className={`nest-card flex items-center justify-between p-3 text-sm ${
                    s?.status === 'done' || s?.status === 'skipped' ? 'opacity-50' : ''
                  } ${i === progress.activeIndex ? 'border-nest-accent' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        i === progress.activeIndex
                          ? 'bg-nest-accent text-nest-bg'
                          : 'bg-nest-surface text-nest-sub'
                      }`}
                    >
                      {statusIcon}
                    </span>
                    <div>
                      <p className="font-medium">{t.title}</p>
                      <p className="text-xs text-nest-sub">
                        {formatDuration(t.durationMinutes + (s?.extendedMinutes ?? 0))}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <button
          className="nest-btn-danger w-full"
          onClick={() => {
            if (confirm('セッションを中止して破棄しますか？')) {
              endSession();
              navigate({ name: 'home' });
            }
          }}
        >
          中止
        </button>
      </div>
    </div>
  );
}
// Referenced unused imports to keep linter quiet where needed.
void formatHm;
