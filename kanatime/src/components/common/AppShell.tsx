import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="min-h-screen bg-dark-900 text-dark-50">
      <main className="pb-20 max-w-lg mx-auto px-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
