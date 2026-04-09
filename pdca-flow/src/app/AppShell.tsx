import { Outlet } from 'react-router-dom';
import { BottomTabBar } from '../components/BottomTabBar';

export function AppShell() {
  return (
    <div className="min-h-full bg-background text-text-primary">
      <main className="max-w-lg mx-auto">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
