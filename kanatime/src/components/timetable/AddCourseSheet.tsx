import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useCourseStore } from '@/store/courseStore';
import { useTimetableStore } from '@/store/timetableStore';
import { COURSE_COLORS, DAY_LABELS } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  /** 指定時はその曜日・時限の授業のみを候補表示する */
  slot?: { dayOfWeek: number; period: number } | null;
}

export function AddCourseSheet({ open, onClose, slot }: Props) {
  const { courses } = useCourseStore();
  const { entries, addEntry } = useTimetableStore();
  const [query, setQuery] = useState('');

  if (!open) return null;

  const available = courses.filter((c) => {
    if (entries.some((e) => e.courseId === c.id)) return false;
    if (slot && (c.dayOfWeek !== slot.dayOfWeek || c.period !== slot.period)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  const title = slot ? `${DAY_LABELS[slot.dayOfWeek]}曜 ${slot.period}限 に授業を追加` : '授業を追加';

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-dark-800 rounded-t-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-dark-600">
          <h3 className="font-bold text-sm">{title}</h3>
          <button onClick={onClose} className="text-dark-300 active:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="px-4 py-3">
          <input
            type="text"
            placeholder="授業名・教員名で検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-3 py-2.5 text-sm placeholder:text-dark-400 focus:outline-none focus:border-accent-blue"
          />
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {available.length === 0 && (
            <p className="text-center text-xs text-dark-400 py-8">
              {slot ? 'このコマの候補はありません' : '授業が見つかりません'}
            </p>
          )}
          {available.slice(0, 30).map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{c.title}</p>
                <p className="text-xs text-dark-400">
                  {DAY_LABELS[c.dayOfWeek]}{c.period}限 · {c.instructor} · {c.campus}
                </p>
              </div>
              <button
                onClick={() => {
                  // 初期は統一色。ユーザーが後から個別変更可能
                  addEntry(c.id, COURSE_COLORS[0]);
                  onClose();
                }}
                className="ml-2 p-2 rounded-full bg-accent-blue/20 text-accent-blue active:bg-accent-blue/40"
              >
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
