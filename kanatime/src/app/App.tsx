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
import { CommunityPage } from '@/routes/CommunityPage';
import { FriendsPage } from '@/routes/FriendsPage';
import { CirclesPage } from '@/routes/CirclesPage';
import { TopicsPage } from '@/routes/TopicsPage';
import { ProfileEditPage } from '@/routes/ProfileEditPage';
import { OfficialLinksPage } from '@/routes/OfficialLinksPage';

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
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/profile" element={<ProfileEditPage />} />
          <Route path="/community/friends" element={<FriendsPage />} />
          <Route path="/community/circles" element={<CirclesPage />} />
          <Route path="/community/topics" element={<TopicsPage />} />
          <Route path="/official" element={<OfficialLinksPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
