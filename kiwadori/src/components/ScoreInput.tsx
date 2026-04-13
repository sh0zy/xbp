interface Props {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
}

export default function ScoreInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = '点',
}: Props) {
  const clamp = (v: number): number => {
    if (Number.isNaN(v)) return min
    if (v < min) return min
    if (v > max) return max
    return v
  }

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-300">{label}</span>
        <input
          type="number"
          className="w-20 h-11 rounded-md bg-neutral-800 border border-neutral-700 text-right px-2 text-neutral-100"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
        />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          className="flex-1 accent-indigo-500 h-11"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
        />
        <span className="w-10 text-right text-xs text-neutral-400">
          {suffix}
        </span>
      </div>
    </div>
  )
}
