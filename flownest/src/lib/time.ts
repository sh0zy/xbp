import type { RoutineMode, RoutineTemplate, SessionState, TaskItem } from '../types';

export const pad2 = (n: number) => n.toString().padStart(2, '0');

export const formatHm = (date: Date) => `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;

export const parseHm = (hm: string): { h: number; m: number } => {
  const [hStr, mStr] = hm.split(':');
  return { h: Number(hStr) || 0, m: Number(mStr) || 0 };
};

export const todayAt = (hm: string, base: Date = new Date()): Date => {
  const { h, m } = parseHm(hm);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
};

/**
 * 夜モードの対象時刻（就寝時刻）が翌日の可能性を扱う。
 * 現在時刻が 12:00 以降 かつ 対象時刻が朝方 (< 06:00) なら翌日扱い。
 */
export const resolveTargetDate = (mode: RoutineMode, hm: string, now: Date = new Date()): Date => {
  const target = todayAt(hm, now);
  if (mode === 'night') {
    const { h } = parseHm(hm);
    if (h < 6 && now.getHours() >= 12) {
      target.setDate(target.getDate() + 1);
    }
  }
  return target;
};

export const totalDurationMinutes = (tasks: TaskItem[]): number =>
  tasks.reduce((sum, t) => sum + Math.max(0, t.durationMinutes), 0);

export interface PlannedTask {
  task: TaskItem;
  startAt: Date;
  endAt: Date;
}

/**
 * 逆算: targetTime から各タスクの終了 → 開始を決める。
 * order 昇順にタスクを並べ、最後のタスクの end = targetTime。
 */
export const backwardPlan = (
  template: RoutineTemplate,
  now: Date = new Date(),
): PlannedTask[] => {
  const sorted = [...template.tasks].sort((a, b) => a.order - b.order);
  const target = resolveTargetDate(template.mode, template.targetTime, now);
  const result: PlannedTask[] = [];
  let cursorEnd = new Date(target);
  for (let i = sorted.length - 1; i >= 0; i--) {
    const t = sorted[i];
    const start = new Date(cursorEnd.getTime() - t.durationMinutes * 60_000);
    result.unshift({ task: t, startAt: new Date(start), endAt: new Date(cursorEnd) });
    cursorEnd = start;
  }
  return result;
};

export const minutesBetween = (a: Date, b: Date): number =>
  Math.round((b.getTime() - a.getTime()) / 60_000);

export interface SessionProgress {
  activeIndex: number;
  completed: number;
  skipped: number;
  total: number;
  remainingMinutes: number;
  delayMinutes: number;
  targetDate: Date;
}

export const computeSessionProgress = (
  template: RoutineTemplate,
  session: SessionState,
  now: Date = new Date(),
): SessionProgress => {
  const target = resolveTargetDate(template.mode, session.targetTime, now);
  const sorted = [...template.tasks].sort((a, b) => a.order - b.order);
  const stateByTask = new Map(session.tasks.map((s) => [s.taskId, s] as const));
  let activeIndex = sorted.findIndex((t) => {
    const s = stateByTask.get(t.id);
    return !s || s.status === 'pending' || s.status === 'active';
  });
  if (activeIndex === -1) activeIndex = sorted.length;

  let completed = 0;
  let skipped = 0;
  let remainingMinutes = 0;
  for (let i = 0; i < sorted.length; i++) {
    const t = sorted[i];
    const s = stateByTask.get(t.id);
    if (s?.status === 'done') completed++;
    else if (s?.status === 'skipped') skipped++;
    if (i >= activeIndex && s?.status !== 'skipped') {
      const extra = s?.extendedMinutes ?? 0;
      remainingMinutes += t.durationMinutes + extra;
    }
  }

  const projectedEnd = new Date(now.getTime() + remainingMinutes * 60_000);
  const delayMinutes = minutesBetween(target, projectedEnd);

  return {
    activeIndex,
    completed,
    skipped,
    total: sorted.length,
    remainingMinutes,
    delayMinutes,
    targetDate: target,
  };
};

export const formatDuration = (min: number): string => {
  if (min <= 0) return '0分';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h <= 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
};
