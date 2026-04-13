import { useMemo, useState } from 'react';
import type { Route } from '../app/router';
import PageHeader from '../components/PageHeader';
import { useStore } from '../store/AppStoreContext';
import type { RoutineMode, RoutineTemplate, TaskItem } from '../types';
import { uid } from '../lib/id';
import { formatDuration, totalDurationMinutes } from '../lib/time';

interface Props {
  templateId?: string;
  mode?: RoutineMode;
  navigate: (r: Route) => void;
}

export default function TemplateEditorPage({ templateId, mode, navigate }: Props) {
  const { getTemplate, createEmptyTemplate, upsertTemplate } = useStore();
  const initial = useMemo<RoutineTemplate>(() => {
    if (templateId) {
      const found = getTemplate(templateId);
      if (found) return structuredClone(found);
    }
    return createEmptyTemplate(mode ?? 'morning');
  }, [templateId, mode, getTemplate, createEmptyTemplate]);

  const [draft, setDraft] = useState<RoutineTemplate>(initial);
  const isMorning = draft.mode === 'morning';

  const setTasks = (updater: (tasks: TaskItem[]) => TaskItem[]) =>
    setDraft((d) => ({ ...d, tasks: updater(d.tasks) }));

  const addTask = () =>
    setTasks((tasks) => [
      ...tasks,
      {
        id: uid(),
        title: '新しいタスク',
        durationMinutes: 10,
        skippable: false,
        order: tasks.length,
      },
    ]);

  const move = (idx: number, dir: -1 | 1) =>
    setTasks((tasks) => {
      const sorted = [...tasks].sort((a, b) => a.order - b.order);
      const to = idx + dir;
      if (to < 0 || to >= sorted.length) return tasks;
      [sorted[idx], sorted[to]] = [sorted[to], sorted[idx]];
      return sorted.map((t, i) => ({ ...t, order: i }));
    });

  const updateTask = (id: string, patch: Partial<TaskItem>) =>
    setTasks((tasks) => tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const removeTask = (id: string) =>
    setTasks((tasks) => tasks.filter((t) => t.id !== id).map((t, i) => ({ ...t, order: i })));

  const save = () => {
    upsertTemplate(draft);
    navigate({ name: 'templates', mode: draft.mode });
  };

  const sorted = [...draft.tasks].sort((a, b) => a.order - b.order);
  const total = totalDurationMinutes(draft.tasks);

  return (
    <div>
      <PageHeader
        title={templateId ? '編集' : '新規作成'}
        subtitle={`合計 ${formatDuration(total)}`}
        accent={isMorning ? 'morning' : 'night'}
        onBack={() => navigate({ name: 'templates', mode: draft.mode })}
        right={
          <button onClick={save} className="nest-btn-primary px-3 py-2 text-sm">
            保存
          </button>
        }
      />
      <div className="space-y-4 px-5 pt-2">
        <div className="nest-card space-y-3 p-4">
          <label className="block">
            <span className="nest-label">名前</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-nest-border bg-nest-surface px-3 py-2 text-sm"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="nest-label">モード</span>
              <select
                value={draft.mode}
                onChange={(e) =>
                  setDraft({ ...draft, mode: e.target.value as RoutineMode })
                }
                className="mt-1 w-full rounded-lg border border-nest-border bg-nest-surface px-3 py-2 text-sm"
              >
                <option value="morning">朝</option>
                <option value="night">夜</option>
              </select>
            </label>
            <label className="block">
              <span className="nest-label">{isMorning ? '出発時刻' : '就寝時刻'}</span>
              <input
                type="time"
                value={draft.targetTime}
                onChange={(e) => setDraft({ ...draft, targetTime: e.target.value })}
                className="mt-1 w-full rounded-lg border border-nest-border bg-nest-surface px-3 py-2 text-sm"
              />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="nest-label">タスク</h2>
            <button onClick={addTask} className="nest-btn-ghost px-3 py-1.5 text-xs">
              ＋追加
            </button>
          </div>
          {sorted.map((task, idx) => (
            <div key={task.id} className="nest-card space-y-2 p-3">
              <input
                value={task.title}
                onChange={(e) => updateTask(task.id, { title: e.target.value })}
                className="w-full rounded-lg border border-nest-border bg-nest-surface px-3 py-2 text-sm"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={task.durationMinutes}
                  onChange={(e) =>
                    updateTask(task.id, {
                      durationMinutes: Math.max(1, Math.min(240, Number(e.target.value) || 1)),
                    })
                  }
                  className="w-20 rounded-lg border border-nest-border bg-nest-surface px-2 py-1.5 text-sm tabular-nums"
                />
                <span className="text-xs text-nest-sub">分</span>
                <label className="ml-auto inline-flex items-center gap-1 text-xs text-nest-sub">
                  <input
                    type="checkbox"
                    checked={task.skippable}
                    onChange={(e) => updateTask(task.id, { skippable: e.target.checked })}
                  />
                  スキップ可
                </label>
              </div>
              <div className="flex gap-1">
                <button
                  className="nest-btn-ghost flex-1 px-2 py-1 text-xs"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                >
                  ↑
                </button>
                <button
                  className="nest-btn-ghost flex-1 px-2 py-1 text-xs"
                  onClick={() => move(idx, 1)}
                  disabled={idx === sorted.length - 1}
                >
                  ↓
                </button>
                <button
                  className="nest-btn-danger px-2 py-1 text-xs"
                  onClick={() => removeTask(task.id)}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
