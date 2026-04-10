import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { TimetableGrid } from '@/components/timetable/TimetableGrid';
import { AddCourseSheet } from '@/components/timetable/AddCourseSheet';
import { useCourseStore } from '@/store/courseStore';
import { useTimetableStore } from '@/store/timetableStore';

export function TimetablePage() {
  const { load: loadCourses } = useCourseStore();
  const { load: loadTimetable } = useTimetableStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    loadCourses();
    loadTimetable();
  }, []);

  return (
    <div className="space-y-4 pt-2">
      <PageHeader
        title="時間割"
        right={
          <button
            onClick={() => setSheetOpen(true)}
            className="p-2 rounded-xl bg-accent-blue/20 text-accent-blue active:bg-accent-blue/40"
          >
            <Plus size={20} />
          </button>
        }
      />
      <TimetableGrid />
      <AddCourseSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}
