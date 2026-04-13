import { useEffect, useState } from 'react';
import { Plus, Palette, Check } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { TimetableGrid } from '@/components/timetable/TimetableGrid';
import { AddCourseSheet } from '@/components/timetable/AddCourseSheet';
import { CellOptionsSheet } from '@/components/timetable/CellOptionsSheet';
import { TimetableSwitcher } from '@/components/timetable/TimetableSwitcher';
import { useCourseStore } from '@/store/courseStore';
import { useTimetableStore } from '@/store/timetableStore';
import type { Course } from '@/types';

export function TimetablePage() {
  const { load: loadCourses } = useCourseStore();
  const { load: loadTimetable } = useTimetableStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [slot, setSlot] = useState<{ dayOfWeek: number; period: number } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadCourses();
    loadTimetable();
  }, []);

  const openAdd = () => { setSlot(null); setSheetOpen(true); };
  const openAddForSlot = (dayOfWeek: number, period: number) => {
    setSlot({ dayOfWeek, period });
    setSheetOpen(true);
  };
  const openCellEdit = (course: Course) => {
    setEditCourse(course);
  };

  return (
    <div className="space-y-3 pt-2">
      <PageHeader
        title="時間割"
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode((v) => !v)}
              className={`p-2 rounded-xl ${editMode ? 'bg-accent-green/25 text-accent-green' : 'bg-dark-700 text-dark-300'} active:bg-dark-600`}
              aria-label="色変更モード"
              title="色変更モード"
            >
              {editMode ? <Check size={18} /> : <Palette size={18} />}
            </button>
            <button
              onClick={openAdd}
              className="p-2 rounded-xl bg-accent-blue/20 text-accent-blue active:bg-accent-blue/40"
              aria-label="授業を追加"
            >
              <Plus size={20} />
            </button>
          </div>
        }
      />
      <div className="flex items-center justify-between">
        <TimetableSwitcher />
        {editMode && (
          <p className="text-[10px] text-accent-green">色変更モード: コマをタップして色を選択</p>
        )}
      </div>
      <TimetableGrid
        editMode={editMode}
        onEmptyClick={openAddForSlot}
        onCellEdit={openCellEdit}
      />
      <AddCourseSheet open={sheetOpen} onClose={() => setSheetOpen(false)} slot={slot} />
      <CellOptionsSheet open={!!editCourse} onClose={() => setEditCourse(null)} course={editCourse} />
    </div>
  );
}
