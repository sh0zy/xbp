import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useCourseStore } from '@/store/courseStore';
import { useTimetableStore } from '@/store/timetableStore';
import { COURSE_COLORS } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddCourseSheet({ open, onClose }: Props) {
  const { courses } = useCourseStore();
  const { entries, addEntry } = useTimetableStore();
  const [query, setQuery] = useState('');

  if (!open) return null;

  const available = courses.filter(
    (c) =>
      !entries.some((e) => e.courseId === c.id) &&
      (c.title.includes(query) || c.instructor.includes(query) || c.code.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-dark-800 rounded-t-2xl max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-dark-600">
          <h3 className="font-bold">授業を追加</h3>
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
          {available.slice(0, 20).map((c, i) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{c.title}</p>
                <p className="text-xs text-dark-400">{c.instructor} · {c.faculty}</p>
              </div>
              <button
                onClick={() => {
                  addEntry(c.id, COURSE_COLORS[i % COURSE_COLORS.length]);
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
