import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, CalendarDays, ClipboardList, Settings } from 'lucide-react';
import clsx from 'clsx';

const tabs = [
  { path: '/home', icon: Home, label: 'ホーム' },
  { path: '/search', icon: Search, label: '検索' },
  { path: '/timetable', icon: CalendarDays, label: '時間割' },
  { path: '/tasks', icon: ClipboardList, label: '課題' },
  { path: '/settings', icon: Settings, label: '設定' },
] as const;

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-dark-600 bg-dark-800/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={clsx(
                'flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors',
                active ? 'text-accent-blue' : 'text-dark-300 active:text-dark-100'
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
