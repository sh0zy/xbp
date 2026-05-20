interface ScoreStarsProps {
  value: number
  max?: number
  size?: number
  onChange?: (val: number) => void
}

export function ScoreStars({ value, max = 5, size = 28, onChange }: ScoreStarsProps) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onChange?.(n)}
          style={{
            background: 'none',
            border: 'none',
            padding: 2,
            cursor: onChange ? 'pointer' : 'default',
            fontSize: size,
            lineHeight: 1,
            color: n <= value ? '#f59e0b' : '#334155',
            transition: 'color 0.15s',
          }}
        >
          ★
        </button>
      ))}
    </div>
  )
}
