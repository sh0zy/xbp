import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Header } from '../components/Header';
import { ThemeCard } from '../components/ThemeCard';
import { EmptyState } from '../components/EmptyState';
import { FloatingAddButton } from '../components/FloatingAddButton';
import type { Category, ThemeStatus } from '../types';
import { CATEGORIES, STATUS_LABELS } from '../types';

type SortKey = 'updatedAt' | 'deadline' | 'priority';

export function ThemeList() {
  const { themes } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | ''>('');
  const [statusFilter, setStatusFilter] = useState<ThemeStatus | ''>('');
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');

  const filtered = useMemo(() => {
    let list = [...themes];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.goal.toLowerCase().includes(q));
    }
    if (categoryFilter) list = list.filter((t) => t.category === categoryFilter);
    if (statusFilter) list = list.filter((t) => t.status === statusFilter);

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    list.sort((a, b) => {
      if (sortKey === 'priority') return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortKey === 'deadline') return a.deadline.localeCompare(b.deadline);
      return b.updatedAt.localeCompare(a.updatedAt);
    });

    return list;
  }, [themes, search, categoryFilter, statusFilter, sortKey]);

  return (
    <div className="pb-24">
      <Header title="テーマ一覧" />
      <div className="p-4 space-y-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="検索..."
          className="w-full bg-surface rounded-xl px-4 py-3 text-text-primary outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as Category | '')}
            className="bg-surface-light rounded-lg px-3 py-2 text-sm text-text-secondary outline-none"
          >
            <option value="">全カテゴリ</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ThemeStatus | '')}
            className="bg-surface-light rounded-lg px-3 py-2 text-sm text-text-secondary outline-none"
          >
            <option value="">全ステータス</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="bg-surface-light rounded-lg px-3 py-2 text-sm text-text-secondary outline-none"
          >
            <option value="updatedAt">更新日順</option>
            <option value="deadline">期限順</option>
            <option value="priority">優先度順</option>
          </select>
        </div>
        {filtered.length === 0 ? (
          <EmptyState message="テーマがありません" action="テーマを作成" onAction={() => navigate('/themes/new')} />
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => (
              <ThemeCard key={t.id} theme={t} />
            ))}
          </div>
        )}
      </div>
      <FloatingAddButton onClick={() => navigate('/themes/new')} />
    </div>
  );
}
