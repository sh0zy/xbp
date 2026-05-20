import type { Task } from "../types";

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function getTodayDateString(): string {
  return formatDate(new Date());
}

export function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDate(d);
}

export function isToday(date: string): boolean {
  return date === getTodayDateString();
}

export function isTomorrow(date: string): boolean {
  return date === getTomorrowDateString();
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate) return false;
  if (task.status === "完了") return false;
  return task.dueDate < getTodayDateString();
}

export function getWeekCompletedTasks(tasks: Task[]): Task[] {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - 6);
  cutoff.setHours(0, 0, 0, 0);
  return tasks.filter((t) => {
    if (t.status !== "完了" || !t.completedAt) return false;
    const c = new Date(t.completedAt);
    return c >= cutoff && c <= now;
  });
}

export function getTodayTasks(tasks: Task[]): Task[] {
  const today = getTodayDateString();
  return tasks.filter((t) => {
    if (t.status === "完了") return false;
    if (t.plannedForDate === today) return true;
    if (t.dueDate === today) return true;
    if (t.isToday) return true;
    if (t.priority === "高" && t.plannedForDate <= today) return true;
    return false;
  });
}

export function getTomorrowTasks(tasks: Task[]): Task[] {
  const tomorrow = getTomorrowDateString();
  return tasks.filter((t) => t.plannedForDate === tomorrow || t.dueDate === tomorrow);
}

export function formatJaDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  const dt = new Date(y, m - 1, d);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${y}年${m}月${d}日(${days[dt.getDay()]})`;
}

export function formatJaShortDate(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  if (!m || !d) return date;
  return `${m}/${d}`;
}

export function getCurrentHour(): number {
  return new Date().getHours();
}

export function nowIso(): string {
  return new Date().toISOString();
}
