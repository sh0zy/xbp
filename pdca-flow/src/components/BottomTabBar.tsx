import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'ホーム', icon: '⌂' },
  { path: '/themes', label: 'テーマ', icon: '◎' },
  { path: '/history', label: '履歴', icon: '☰' },
  { path: '/settings', label: '設定', icon: '⚙' },
];

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-lighter flex z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {tabs.map((tab) => {
        const active = tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center py-3 text-xs transition-colors ${
              active ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <span className="text-xl leading-none mb-1">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
