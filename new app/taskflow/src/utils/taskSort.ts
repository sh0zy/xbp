import type { Task, TaskPriority, TaskStatus } from "../types";
import { getTodayDateString } from "./date";

export function priorityScore(p: TaskPriority): number {
  if (p === "高") return 3;
  if (p === "中") return 2;
  return 1;
}

export function statusScore(s: TaskStatus): number {
  if (s === "未着手") return 0;
  if (s === "進行中") return 1;
  return 2;
}

const FAR_FUTURE = "9999-12-31";

export function sortTasksBySmartPriority(tasks: Task[]): Task[] {
  const today = getTodayDateString();
  return [...tasks].sort((a, b) => {
    const aDone = a.status === "完了" ? 1 : 0;
    const bDone = b.status === "完了" ? 1 : 0;
    if (aDone !== bDone) return aDone - bDone;

    const aDue = a.dueDate ?? FAR_FUTURE;
    const bDue = b.dueDate ?? FAR_FUTURE;
    if (aDue !== bDue) return aDue.localeCompare(bDue);

    const aToday = a.plannedForDate === today ? 0 : 1;
    const bToday = b.plannedForDate === today ? 0 : 1;
    if (aToday !== bToday) return aToday - bToday;

    const ap = priorityScore(a.priority);
    const bp = priorityScore(b.priority);
    if (ap !== bp) return bp - ap;

    if (a.estimatedMinutes !== b.estimatedMinutes) return a.estimatedMinutes - b.estimatedMinutes;

    const as = statusScore(a.status);
    const bs = statusScore(b.status);
    if (as !== bs) return as - bs;

    return a.createdAt.localeCompare(b.createdAt);
  });
}
