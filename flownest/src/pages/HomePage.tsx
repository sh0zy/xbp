import { useEffect, useMemo, useState } from 'react';
import type { Route } from '../app/router';
import { useStore } from '../store/AppStoreContext';
import { backwardPlan, formatDuration, formatHm, minutesBetween, resolveTargetDate, totalDurationMinutes } from '../lib/time';
import type { RoutineMode, RoutineTemplate } from '../types';

interface Props {
  navigate: (r: Route) => void;
}

const useNow = () => {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
};

const pickModeByTime = (now: Date): RoutineMode => {
  const h = now.getHours();
  return h >= 4 && h < 14 ? 'morning' : 'night';
};

export default function HomePage({ navigate }: Props) {
  const { defaultMorning, defaultNight, startSession, session, templates } = useStore();
  const now = useNow();
  const [mode, setMode] = useState<RoutineMode>(() => pickModeByTime(new Date()));

  const current: RoutineTemplate | undefined = mode === 'morning' ? defaultMorning : defaultNight;
  const plan = useMemo(() => (current ? backwardPlan(current, now) : []), [current, now]);

  const nextTask = plan.find((p) => p.endAt.getTime() > now.getTime());
  const minutesToTarget = current
    ? minutesBetween(now, resolveTargetDate(current.mode, current.targetTime, now))
    : 0;
  const totalMin = current ? totalDurationMinutes(current.tasks) : 0;

  const morningTemplates = templates.filter((t) => t.mode === 'morning');
  const nightTemplates = templates.filter((t) => t.mode === 'night');

  return (
    <div>
      <div
        className={`px-5 pt-10 pb-8 ${
          mode === 'morning'
            ? 'bg-gradient-to-b from-nest-morning/25 via-nest-bg to-nest-bg'
            : 'bg-gradient-to-b from-nest-night/25 via-nest-bg to-nest-bg'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-nest-sub">FlowNest</p>
            <h1 className="text-3xl font-bold">{formatHm(now)}</h1>
          </div>
          <div className="flex rounded-full bg-nest-surface p-1 text-xs">
            {(['morning', 'night'] as RoutineMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full px-3 py-1.5 font-semibold ${
                  mode === m
                    ? m === 'morning'
                      ? 'bg-nest-morning text-nest-bg'
                      : 'bg-nest-night text-white'
                    : 'text-nest-sub'
                }`}
              >
                {m === 'morning' ? '☀ 朝' : '☾ 夜'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 nest-card p-5">
          {current ? (
            <>
              <p className="nest-label">
                {mode === 'morning' ? '出発まで' : '就寝まで'}
              </p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-4xl font-bold tabular-nums">
                  {minutesToTarget > 0 ? formatDuration(minutesToTarget) : '時間です'}
                </p>
                <p className="pb-1 text-sm text-nest-sub">目標 {current.targetTime}</p>
              </div>
              <p className="mt-2 text-sm text-nest-sub">
                使用中: {current.name} / 全{current.tasks.length}工程 ({formatDuration(totalMin)})
              </p>

              {nextTask ? (
                <div className="mt-5 rounded-xl bg-nest-surface p-4">
                  <p className="nest-label text-nest-accent">次のタスク</p>
                  <p className="mt-1 text-lg font-semibold">{nextTask.task.title}</p>
                  <p className="text-sm text-nest-sub">
                    {formatHm(nextTask.startAt)} – {formatHm(nextTask.endAt)} (
                    {formatDuration(nextTask.task.durationMinutes)})
                  </p>
                </div>
              ) : (
                <p className="mt-5 rounded-xl bg-nest-surface p-4 text-sm text-nest-sub">
                  目標時刻を過ぎています
                </p>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  className="nest-btn-primary flex-1"
                  onClick={() => {
                    startSession(current.id);
                    navigate({ name: 'run' });
                  }}
                >
                  {session ? '進行中セッションへ' : '開始する'}
                </button>
                <button
                  className="nest-btn-ghost"
                  onClick={() =>
                    navigate({ name: 'editor', templateId: current.id })
                  }
                >
                  編集
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-sm text-nest-sub">
              <p>テンプレートがありません</p>
              <button
                className="nest-btn-primary mt-3"
                onClick={() => navigate({ name: 'editor', mode })}
              >
                新規作成
              </button>
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            className="nest-card p-3 text-left"
            onClick={() => navigate({ name: 'templates', mode: 'morning' })}
          >
            <p className="text-xs text-nest-morning">☀ 朝ルート</p>
            <p className="mt-1 text-sm font-semibold">{morningTemplates.length}件</p>
          </button>
          <button
            className="nest-card p-3 text-left"
            onClick={() => navigate({ name: 'templates', mode: 'night' })}
          >
            <p className="text-xs text-nest-night">☾ 夜プラン</p>
            <p className="mt-1 text-sm font-semibold">{nightTemplates.length}件</p>
          </button>
        </div>
      </div>

      {current && plan.length > 0 && (
        <section className="px-5 pt-4">
          <h2 className="nest-label mb-2">今日の逆算スケジュール</h2>
          <ol className="space-y-2">
            {plan.map(({ task, startAt, endAt }) => {
              const passed = endAt.getTime() < now.getTime();
              return (
                <li
                  key={task.id}
                  className={`nest-card flex items-center justify-between p-3 text-sm ${
                    passed ? 'opacity-40' : ''
                  }`}
                >
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-xs text-nest-sub">
                      {formatDuration(task.durationMinutes)}
                      {task.skippable ? ' · スキップ可' : ''}
                    </p>
                  </div>
                  <p className="tabular-nums text-nest-sub">
                    {formatHm(startAt)}–{formatHm(endAt)}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}
