import { NavLink } from 'react-router-dom'
import { Home, Clock, BarChart2, Sparkles, Settings } from 'lucide-react'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
}

const navItems: NavItem[] = [
  { to: '/', icon: <Home size={22} />, label: 'ホーム' },
  { to: '/history', icon: <Clock size={22} />, label: '履歴' },
  { to: '/analytics', icon: <BarChart2 size={22} />, label: '分析' },
  { to: '/recipe', icon: <Sparkles size={22} />, label: 'レシピ' },
  { to: '/settings', icon: <Settings size={22} />, label: '設定' },
]

export function BottomNav() {
  return (
    <nav
      style={{
        background: '#1e293b',
        borderTop: '1px solid #334155',
        display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom)',
        flexShrink: 0,
      }}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 4px 8px',
            gap: 3,
            color: isActive ? '#38bdf8' : '#64748b',
            textDecoration: 'none',
            fontSize: 10,
            fontWeight: isActive ? 600 : 400,
            transition: 'color 0.15s',
          })}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
