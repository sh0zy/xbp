import { useState } from 'react';
import { AlertCircle, Clock, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ScreenshotCard } from '../components/ScreenshotCard';
import { EmptyState } from '../components/EmptyState';
import { getCategoryLabel } from '../utils/ocr';
import type { ScreenshotItem } from '../types';

interface Props {
  onSelectItem: (item: ScreenshotItem) => void;
}

type ActionTab = 'urgent' | 'today' | 'week' | 'done';

export function ActionsPage({ onSelectItem }: Props) {
  const items = useStore((s) => s.items);
  const completeItem = useStore((s) => s.completeItem);
  const [tab, setTab] = useState<ActionTab>('urgent');

  const now = new Date();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const weekEnd = new Date(now.getTime() + 7 * 86400000);

  const needsAction = items.filter((i) => i.status === 'needs_action');
  const withDeadlines = items.filter((i) =>
    i.status !== 'completed' && i.status !== 'archived' && i.extractedData.dates.length > 0
  );
  const withReminders = items.filter((i) =>
    i.reminders.some((r) => !r.completed)
  );
  const recentCompleted = items
    .filter((i) => i.status === 'completed')
    .sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
    .slice(0, 10);

  const urgentItems = [...needsAction, ...withDeadlines.filter((i) => i.status !== 'needs_action')]
    .filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i);

  const tabs: { id: ActionTab; label: string; count: number }[] = [
    { id: 'urgent', label: '要対応', count: urgentItems.length },
    { id: 'today', label: '今日', count: withReminders.filter((i) => i.reminders.some((r) => !r.completed && new Date(r.date) < todayEnd)).length },
    { id: 'week', label: '今週', count: withReminders.filter((i) => i.reminders.some((r) => !r.completed && new Date(r.date) < weekEnd)).length },
    { id: 'done', label: '完了', count: recentCompleted.length },
  ];

  const getItems = (): ScreenshotItem[] => {
    switch (tab) {
      case 'urgent': return urgentItems;
      case 'today': return withReminders.filter((i) => i.reminders.some((r) => !r.completed && new Date(r.date) < todayEnd));
      case 'week': return withReminders.filter((i) => i.reminders.some((r) => !r.completed && new Date(r.date) < weekEnd));
      case 'done': return recentCompleted;
    }
  };

  const currentItems = getItems();

  return (
    <div className="pb-24">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="px-4 pt-12 pb-3">
          <h1 className="text-xl font-bold text-gray-900 mb-3">行動リスト</h1>
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {t.label}
                {t.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    tab === t.id ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-2.5">
        {currentItems.map((item) => (
          <div key={item.id} className="relative">
            <ScreenshotCard item={item} onClick={onSelectItem} />
            {tab !== 'done' && item.status !== 'completed' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  completeItem(item.id);
                }}
                className="absolute top-3 right-3 p-1.5 bg-success-500/10 rounded-full hover:bg-success-500/20"
              >
                <CheckCircle2 size={16} className="text-success-600" />
              </button>
            )}
          </div>
        ))}
      </div>

      {currentItems.length === 0 && (
        <EmptyState
          title={tab === 'done' ? '完了項目はありません' : '対応が必要な項目はありません'}
          description={tab === 'done' ? '完了した項目がここに表示されます' : '期限やリマインドが設定された項目がここに表示されます'}
        />
      )}
    </div>
  );
}
