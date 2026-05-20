import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Clock, BarChart2, Settings } from 'lucide-react'

const tabs = [
  { path: '/', icon: Home, label: 'ホーム' },
  { path: '/history', icon: Clock, label: '履歴' },
  { path: '/analytics', icon: BarChart2, label: '分析' },
  { path: '/settings', icon: Settings, label: '設定' },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: '#0f172a',
        borderTop: '1px solid #1e293b',
        padding: '8px 0',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        flexShrink: 0,
      }}
    >
      {tabs.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              color: active ? '#38bdf8' : '#475569',
              cursor: 'pointer',
              padding: '4px 12px',
              fontSize: 10,
              fontWeight: active ? 600 : 400,
              transition: 'color 0.15s',
            }}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
