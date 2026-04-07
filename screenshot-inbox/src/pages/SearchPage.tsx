import { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ScreenshotCard } from '../components/ScreenshotCard';
import { EmptyState } from '../components/EmptyState';
import type { ScreenshotItem, Category, ItemStatus } from '../types';

interface Props {
  onSelectItem: (item: ScreenshotItem) => void;
}

export function SearchPage({ onSelectItem }: Props) {
  const items = useStore((s) => s.items);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    if (!query.trim() && categoryFilter === 'all' && statusFilter === 'all') return [];

    const q = query.toLowerCase();
    return items
      .filter((item) => {
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;
        if (!q) return true;

        return (
          item.title.toLowerCase().includes(q) ||
          item.ocrText.toLowerCase().includes(q) ||
          item.note.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.extractedData.codes.some((c) => c.toLowerCase().includes(q)) ||
          item.extractedData.urls.some((u) => u.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime());
  }, [items, query, categoryFilter, statusFilter]);

  const hasInput = query.trim() || categoryFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="pb-24">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="px-4 pt-12 pb-3">
          <h1 className="text-xl font-bold text-gray-900 mb-3">検索</h1>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="テキスト、タグ、コードで検索..."
              className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 text-xs font-medium ${showFilters ? 'text-primary-600' : 'text-gray-400'}`}
            >
              <SlidersHorizontal size={14} />
              フィルター
            </button>
            {hasInput && (
              <span className="text-xs text-gray-400">{results.length}件</span>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="px-4 pb-3 space-y-2">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {(['all', 'event_ticket', 'order_receipt', 'membership_code', 'recipe_food', 'memo_note', 'other'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
                    categoryFilter === c ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {c === 'all' ? 'カテゴリ全て' : c.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {(['all', 'inbox', 'needs_action', 'saved', 'completed', 'archived'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
                    statusFilter === s ? 'bg-accent-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {s === 'all' ? '状態全て' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pt-3 space-y-2.5">
        {results.map((item) => (
          <ScreenshotCard key={item.id} item={item} onClick={onSelectItem} />
        ))}
      </div>

      {!hasInput && (
        <EmptyState
          title="検索してみましょう"
          description="テキスト、タグ、コード、URLなどで保存したスクショを検索できます"
        />
      )}

      {hasInput && results.length === 0 && (
        <EmptyState
          title="見つかりませんでした"
          description="キーワードを変えて検索してみてください"
        />
      )}
    </div>
  );
}
