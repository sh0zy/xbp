import dayjs from "dayjs";

export function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  return (h || 0) * 60 + (m || 0);
}

export function minutesToHhmm(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function availableWindowMinutes(homeMin: number, bedtimeMin: number): number {
  let diff = bedtimeMin - homeMin;
  if (diff <= 0) diff += 1440;
  return diff;
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min}分`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}時間` : `${h}時間${m}分`;
}

export function todayDateString(): string {
  return dayjs().format("YYYY-MM-DD");
}

export function nowHhmm(): string {
  return dayjs().format("HH:mm");
}
