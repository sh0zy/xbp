import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/common/AppShell';
import { HomePage } from '@/routes/HomePage';
import { SearchPage } from '@/routes/SearchPage';
import { CourseDetailPage } from '@/routes/CourseDetailPage';
import { TimetablePage } from '@/routes/TimetablePage';
import { TasksPage } from '@/routes/TasksPage';
import { AttendancePage } from '@/routes/AttendancePage';
import { SettingsPage } from '@/routes/SettingsPage';
import { CreditsPage } from '@/routes/CreditsPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/search/:courseId" element={<CourseDetailPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/attendance/:courseId" element={<AttendancePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
