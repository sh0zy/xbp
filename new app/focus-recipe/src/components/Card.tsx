interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export function Card({ children, className = '', onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#1e293b',
        borderRadius: 16,
        padding: '16px',
        border: '1px solid #334155',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  )
}
