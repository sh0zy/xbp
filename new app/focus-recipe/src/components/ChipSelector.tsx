interface ChipSelectorProps<T extends string | number> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

export function ChipSelector<T extends string | number>({
  options,
  value,
  onChange,
}: ChipSelectorProps<T>) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 20,
              border: `1.5px solid ${active ? '#38bdf8' : '#334155'}`,
              background: active ? 'rgba(56,189,248,0.15)' : 'transparent',
              color: active ? '#38bdf8' : '#94a3b8',
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
