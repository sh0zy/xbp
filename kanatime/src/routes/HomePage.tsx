import { useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { UnofficialNoticeBanner } from '@/components/common/UnofficialNoticeBanner';
import { TodayClassesCard } from '@/components/home/TodayClassesCard';
import { NextClassCard } from '@/components/home/NextClassCard';
import { PendingTasksCard } from '@/components/home/PendingTasksCard';
import { UpcomingTestsCard } from '@/components/home/UpcomingTestsCard';
import { AttendanceAlertCard } from '@/components/home/AttendanceAlertCard';
import { useCourseStore } from '@/store/courseStore';
import { useTimetableStore } from '@/store/timetableStore';
import { useAssignmentStore } from '@/store/assignmentStore';
import { useAttendanceStore } from '@/store/attendanceStore';
import { COURSE_COLORS } from '@/types';

export function HomePage() {
  const { courses, load: loadCourses } = useCourseStore();
  const { entries, load: loadTimetable } = useTimetableStore();
  const { assignments, load: loadAssignments } = useAssignmentStore();
  const { load: loadAttendance, getStats } = useAttendanceStore();

  useEffect(() => {
    loadCourses();
    loadTimetable();
    loadAssignments();
    loadAttendance();
  }, []);

  const now = new Date();
  const todayDow = (now.getDay() + 6) % 7; // JS Sun=0 → Mon=0

  // Next class
  const currentHour = now.getHours();
  const currentPeriodGuess = currentHour < 10 ? 1 : currentHour < 12 ? 2 : currentHour < 14 ? 3 : currentHour < 16 ? 4 : currentHour < 18 ? 5 : currentHour < 20 ? 6 : 7;

  const todayEntries = entries.filter((e) => {
    const c = courses.find((c) => c.id === e.courseId);
    return c && c.dayOfWeek === todayDow;
  });

  const nextEntry = todayEntries.find((e) => {
    const c = courses.find((c) => c.id === e.courseId);
    return c && c.period >= currentPeriodGuess;
  });
  const nextCourse = nextEntry ? courses.find((c) => c.id === nextEntry.courseId) ?? null : null;
  const nextColor = nextEntry ? (nextEntry.customColor || COURSE_COLORS[entries.indexOf(nextEntry) % COURSE_COLORS.length]) : '#5b8af5';

  // Attendance alerts
  const alerts = entries
    .map((e) => {
      const course = courses.find((c) => c.id === e.courseId);
      if (!course) return null;
      const stats = getStats(course.id);
      if (stats.total >= 3 && stats.rate < 75) return { course, rate: stats.rate };
      return null;
    })
    .filter(Boolean) as { course: typeof courses[0]; rate: number }[];

  return (
    <div className="space-y-4 pt-2">
      <PageHeader title="KanaTime" />
      <UnofficialNoticeBanner />
      <NextClassCard course={nextCourse} color={nextColor} />
      <TodayClassesCard courses={courses} entries={entries} todayDow={todayDow} />
      <PendingTasksCard assignments={assignments} courses={courses} />
      <UpcomingTestsCard assignments={assignments} courses={courses} />
      <AttendanceAlertCard alerts={alerts} />
    </div>
  );
}
