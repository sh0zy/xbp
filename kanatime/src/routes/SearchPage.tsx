import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilterSheet, defaultFilters } from '@/components/search/SearchFilterSheet';
import type { SearchFilters } from '@/components/search/SearchFilterSheet';
import { CourseListItem } from '@/components/search/CourseListItem';
import { EmptyState } from '@/components/common/EmptyState';
import { useCourseStore } from '@/store/courseStore';
import { useReviewStore } from '@/store/reviewStore';
import { BookOpen } from 'lucide-react';

export type SortKey = 'none' | 'ease' | 'satisfaction' | 'clarity' | 'workload_low' | 'attendance_low' | 'exam_low' | 'report_high' | 'att_eval_high';

const sortLabels: Record<SortKey, string> = {
  none: '標準',
  ease: '履修しやすさ',
  satisfaction: '満足度',
  clarity: '分かりやすさ',
  workload_low: '課題量（少ない順）',
  attendance_low: '出席（ゆるい順）',
  exam_low: 'テスト比率（低い順）',
  report_high: 'レポート比率（高い順）',
  att_eval_high: '出席比率（高い順）',
};

export function SearchPage() {
  const { courses, load } = useCourseStore();
  const { load: loadReviews, getAverages } = useReviewStore();
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [sortKey, setSortKey] = useState<SortKey>('none');

  useEffect(() => { load(); loadReviews(); }, []);

  const filtered = useMemo(() => {
    let list = courses;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    }
    if (filters.dayOfWeek !== null) list = list.filter((c) => c.dayOfWeek === filters.dayOfWeek);
    if (filters.period !== null) list = list.filter((c) => c.period === filters.period);
    if (filters.faculty) list = list.filter((c) => c.faculty === filters.faculty);
    if (filters.campus) list = list.filter((c) => c.campus === filters.campus);
    if (filters.category) list = list.filter((c) => c.category === filters.category);
    if (filters.credits !== null) list = list.filter((c) => c.credits === filters.credits);

    // 評価方法フィルター
    if (filters.evalType) {
      list = list.filter((c) => {
        if (!c.evaluation) return false;
        switch (filters.evalType) {
          case 'noExam': return c.evaluation.exam === 0;
          case 'exam': return c.evaluation.exam >= 50;
          case 'report': return c.evaluation.report >= 40;
          case 'attendance': return c.evaluation.attendance >= 30;
          default: return true;
        }
      });
    }

    if (sortKey !== 'none') {
      list = [...list].sort((a, b) => {
        const scoreA = getScoreForSort(a, getAverages(a.id), sortKey);
        const scoreB = getScoreForSort(b, getAverages(b.id), sortKey);
        return scoreB - scoreA;
      });
    }

    return list;
  }, [courses, query, filters, sortKey, getAverages]);

  return (
    <div className="space-y-4 pt-2">
      <PageHeader title="授業検索" />
      <SearchBar value={query} onChange={setQuery} onFilterToggle={() => setFilterOpen(true)} />

      {/* Sort pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {(Object.keys(sortLabels) as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSortKey(key)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sortKey === key
                ? 'bg-accent-blue text-white'
                : 'bg-dark-700 text-dark-300 active:bg-dark-600'
            }`}
          >
            {sortLabels[key]}
          </button>
        ))}
      </div>

      <p className="text-xs text-dark-400">
        {filtered.length}件の授業
        {sortKey !== 'none' && ` · ${sortLabels[sortKey]}順`}
        {filters.evalType && ` · 評価方法で絞り込み中`}
      </p>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} message="授業が見つかりません" sub="検索条件を変更してみてください" />
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <CourseListItem key={c.id} course={c} averages={getAverages(c.id)} showScore={sortKey} />
          ))}
        </div>
      )}
      <SearchFilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} onChange={setFilters} />
    </div>
  );
}

function getScoreForSort(course: { evaluation?: { exam: number; report: number; attendance: number } }, avg: Record<string, number> | null, key: SortKey): number {
  switch (key) {
    case 'exam_low': return course.evaluation ? (100 - course.evaluation.exam) : -1;
    case 'report_high': return course.evaluation ? course.evaluation.report : -1;
    case 'att_eval_high': return course.evaluation ? course.evaluation.attendance : -1;
    default: break;
  }
  if (!avg) return -1;
  switch (key) {
    case 'ease': return avg.ease;
    case 'satisfaction': return avg.satisfaction;
    case 'clarity': return avg.clarity;
    case 'workload_low': return 6 - avg.workload;
    case 'attendance_low': return 6 - avg.attendance;
    default: return 0;
  }
}
