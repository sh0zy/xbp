import { Archive, House, Settings2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { APP_NAME } from '@/app/constants';
import { cn } from '@/lib/cn';

const navItems = [
  {
    to: '/',
    label: 'ホーム',
    icon: House,
  },
  {
    to: '/archive',
    label: 'アーカイブ',
    icon: Archive,
  },
  {
    to: '/settings',
    label: '設定',
    icon: Settings2,
  },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label={`${APP_NAME} navigation`}
      className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+14px)] left-1/2 z-40 w-[min(calc(100vw-24px),398px)] -translate-x-1/2 px-1"
    >
      <div className="pointer-events-auto flex items-center justify-between rounded-[28px] border border-white/10 bg-[rgba(7,10,18,0.76)] px-3 py-2 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex min-w-[96px] flex-1 items-center justify-center gap-2 rounded-[20px] px-3 py-3 text-sm font-medium transition-all duration-200',
                  isActive ? 'bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.12)]' : 'text-white/58',
                )
              }
            >
              <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
