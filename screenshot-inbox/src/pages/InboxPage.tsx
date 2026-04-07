import { useState } from 'react';
import { Filter, SortDesc } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ScreenshotCard } from '../components/ScreenshotCard';
import { EmptyState } from '../components/EmptyState';
import { getCategoryLabel, getStatusLabel } from '../utils/ocr';
import type { ScreenshotItem, Category, ItemStatus } from '../types';

interface Props {
  onSelectItem: (item: ScreenshotItem) => void;
  onImport: () => void;
}

type SortMode = 'newest' | 'oldest' | 'category';
type FilterTab = 'all' | Category;

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'event_ticket', label: 'Event' },
  { id: 'order_receipt', label: 'Order' },
  { id: 'membership_code', label: 'Code' },
  { id: 'recipe_food', label: 'Recipe' },
  { id: 'memo_note', label: 'Memo' },
  { id: 'other', label: 'Other' },
];

const statusFilters: { id: ItemStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'inbox', label: '未整理' },
  { id: 'needs_action', label: '要対応' },
  { id: 'saved', label: '保存済み' },
  { id: 'completed', label: '完了' },
];

export function InboxPage({ onSelectItem, onImport }: Props) {
  const items = useStore((s) => s.items);
  const [categoryFilter, setCategoryFilter] = useState<FilterTab>('all');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = items
    .filter((i) => i.status !== 'archived')
    .filter((i) => categoryFilter === 'all' || i.category === categoryFilter)
    .filter((i) => statusFilter === 'all' || i.status === statusFilter)
    .sort((a, b) => {
      if (sortMode === 'oldest') return new Date(a.importedAt).getTime() - new Date(b.importedAt).getTime();
      if (sortMode === 'category') return a.category.localeCompare(b.category);
      return new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime();
    });

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="px-4 pt-12 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">Inbox</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg ${showFilters ? 'bg-primary-50 text-primary-600' : 'text-gray-400'}`}
              >
                <Filter size={18} />
              </button>
              <button
                onClick={() => setSortMode(sortMode === 'newest' ? 'oldest' : 'newest')}
                className="p-2 rounded-lg text-gray-400"
              >
                <SortDesc size={18} />
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status filters */}
        {showFilters && (
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            {statusFilters.map((sf) => (
              <button
                key={sf.id}
                onClick={() => setStatusFilter(sf.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  statusFilter === sf.id
                    ? 'bg-accent-500 text-white'
                    : 'bg-gray-50 text-gray-500'
                }`}
              >
                {sf.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Count */}
      <div className="px-4 py-3">
        <span className="text-xs text-gray-400">{filtered.length}件</span>
      </div>

      {/* Items */}
      <div className="px-4 space-y-2.5">
        {filtered.map((item) => (
          <ScreenshotCard key={item.id} item={item} onClick={onSelectItem} />
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          title="Inbox は空です"
          description="スクリーンショットを取り込んで、情報を整理しましょう"
          actionLabel="取り込む"
          onAction={onImport}
        />
      )}
    </div>
  );
}
