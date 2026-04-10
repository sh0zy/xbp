import { useEffect, useState } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { TaskItem } from '@/components/tasks/TaskItem';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';
import { useCourseStore } from '@/store/courseStore';
import { useTimetableStore } from '@/store/timetableStore';
import { useAssignmentStore } from '@/store/assignmentStore';

export function TasksPage() {
  const { courses, load: loadCourses } = useCourseStore();
  const { load: loadTimetable } = useTimetableStore();
  const { assignments, load: loadAssignments, toggleStatus, remove } = useAssignmentStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all');

  useEffect(() => {
    loadCourses();
    loadTimetable();
    loadAssignments();
  }, []);

  const filtered = assignments
    .filter((a) => filter === 'all' || a.status === filter)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="space-y-4 pt-2">
      <PageHeader
        title="課題・テスト"
        right={
          <button onClick={() => setModalOpen(true)} className="p-2 rounded-xl bg-accent-blue/20 text-accent-blue active:bg-accent-blue/40">
            <Plus size={20} />
          </button>
        }
      />

      <div className="flex gap-2">
        {(['all', 'todo', 'done'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-accent-blue text-white' : 'bg-dark-700 text-dark-300 active:bg-dark-600'}`}
          >
            {f === 'all' ? 'すべて' : f === 'todo' ? '未完了' : '完了'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} message="課題がありません" sub="＋ボタンから追加できます" />
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => (
            <TaskItem
              key={a.id}
              assignment={a}
              course={courses.find((c) => c.id === a.courseId)}
              onToggle={() => toggleStatus(a.id)}
              onRemove={() => remove(a.id)}
            />
          ))}
        </div>
      )}

      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
