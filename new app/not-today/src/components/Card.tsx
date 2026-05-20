import type { CSSProperties, ReactNode } from 'react'

export function Card({
  children,
  style,
  onClick,
}: {
  children: ReactNode
  style?: CSSProperties
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#1e293b',
        borderRadius: 16,
        padding: 16,
        border: '1px solid #334155',
        ...style,
        ...(onClick ? { cursor: 'pointer' } : {}),
      }}
    >
      {children}
    </div>
  )
}
