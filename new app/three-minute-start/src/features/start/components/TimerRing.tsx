import { formatTime } from "../../../lib/utils";

interface TimerRingProps {
  totalSec: number;
  remainingSec: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function TimerRing({
  totalSec,
  remainingSec,
  size = 240,
  strokeWidth = 14,
  label,
}: TimerRingProps) {
  const safeTotal = Math.max(1, totalSec);
  const progress = Math.min(1, Math.max(0, remainingSec / safeTotal));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * progress;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-ink-100 dark:stroke-ink-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="stroke-brand-500 transition-[stroke-dasharray] duration-500 ease-linear"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-5xl font-semibold tabular-nums text-ink-800 dark:text-ink-50">
          {formatTime(remainingSec)}
        </span>
        {label && (
          <span className="mt-1 text-xs text-ink-400 dark:text-ink-400">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
