import { Home, Inbox, ListChecks, Search, BarChart3 } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { TabId } from '../types';

const tabs: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'actions', label: 'アクション', icon: ListChecks },
  { id: 'search', label: '検索', icon: Search },
  { id: 'insights', label: '分析', icon: BarChart3 },
];

export function BottomNav() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const inboxCount = useStore((s) => s.items.filter((i) => i.status === 'inbox').length);
  const needsActionCount = useStore((s) => s.items.filter((i) => i.status === 'needs_action').length);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badge =
            tab.id === 'inbox' ? inboxCount :
            tab.id === 'actions' ? needsActionCount : 0;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
                isActive ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-danger-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
