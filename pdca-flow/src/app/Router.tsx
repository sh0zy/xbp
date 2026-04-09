import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './AppShell';
import { Dashboard } from '../features/Dashboard';
import { ThemeList } from '../features/ThemeList';
import { ThemeDetail } from '../features/ThemeDetail';
import { ThemeForm } from '../features/ThemeForm';
import { History } from '../features/History';
import { Settings } from '../features/Settings';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/themes" element={<ThemeList />} />
          <Route path="/themes/new" element={<ThemeForm />} />
          <Route path="/themes/:id" element={<ThemeDetail />} />
          <Route path="/themes/:id/edit" element={<ThemeForm />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
