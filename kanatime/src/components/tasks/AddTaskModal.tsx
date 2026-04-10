import { useState } from 'react';
import { X } from 'lucide-react';
import { useCourseStore } from '@/store/courseStore';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useTimetableStore } from '@/store/timetableStore';
import { format, addDays } from 'date-fns';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddTaskModal({ open, onClose }: Props) {
  const { courses } = useCourseStore();
  const { entries } = useTimetableStore();
  const { add } = useAssignmentStore();
  const myCourses = courses.filter((c) => entries.some((e) => e.courseId === c.id));

  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'report' | 'test' | 'quiz' | 'other'>('report');
  const [dueDate, setDueDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));

  if (!open) return null;

  const canSubmit = courseId && title.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    add({ courseId, title: title.trim(), type, dueDate });
    setTitle('');
    setCourseId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-dark-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">課題を追加</h3>
          <button onClick={onClose} className="text-dark-300"><X size={20} /></button>
        </div>

        <div>
          <label className="text-xs text-dark-300 mb-1 block">授業</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent-blue text-dark-50">
            <option value="">選択してください</option>
            {myCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-dark-300 mb-1 block">タイトル</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="レポート第1回" className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-sm placeholder:text-dark-400 focus:outline-none focus:border-accent-blue" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-dark-300 mb-1 block">種類</label>
            <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent-blue text-dark-50">
              <option value="report">レポート</option>
              <option value="test">テスト</option>
              <option value="quiz">小テスト</option>
              <option value="other">その他</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-dark-300 mb-1 block">締切日</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-dark-700 border border-dark-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent-blue text-dark-50" />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!canSubmit} className="w-full py-3 rounded-xl bg-accent-blue text-white text-sm font-medium disabled:opacity-40 active:bg-accent-blue/80">
          追加
        </button>
      </div>
    </div>
  );
}
