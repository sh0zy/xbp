import type { SafetyLevel } from '../types'

interface Props {
  required: number
  canPass: boolean
  level: SafetyLevel
  size?: 'sm' | 'lg'
}

const barColor: Record<SafetyLevel, string> = {
  safe: 'bg-indigo-500',
  caution: 'bg-amber-500',
  danger: 'bg-red-500',
}

const textColor: Record<SafetyLevel, string> = {
  safe: 'text-indigo-400',
  caution: 'text-amber-400',
  danger: 'text-red-400',
}

export default function SafetyGauge({
  required,
  canPass,
  level,
  size = 'sm',
}: Props) {
  const pct = canPass ? Math.min(100, Math.max(0, required)) : 100
  const height = size === 'lg' ? 'h-4' : 'h-2'
  const label = size === 'lg' ? 'text-base' : 'text-xs'

  return (
    <div className="w-full">
      <div
        className={`w-full ${height} rounded-full bg-neutral-800 overflow-hidden`}
      >
        <div
          className={`${height} ${barColor[level]} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`mt-1 ${label} ${textColor[level]} font-medium`}>
        {canPass
          ? `期末で ${required}点以上で単位確保`
          : '単位取得困難（欠席超過 or 期末100点以上必要）'}
      </p>
    </div>
  )
}
