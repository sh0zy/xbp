import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppBrand } from '@/components/AppBrand';
import { BottomNav } from '@/components/BottomNav';
import { useNotes } from '@/features/notes/hooks/useNotes';
import type { ThemeMode } from '@/features/notes/types/note';
import { ArchivePage } from '@/pages/ArchivePage';
import { EditorPage } from '@/pages/EditorPage';
import { HomePage } from '@/pages/HomePage';
import { SettingsPage } from '@/pages/SettingsPage';

function useAppliedTheme(theme: ThemeMode): void {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: light)');

    const applyTheme = (): void => {
      const resolvedTheme = theme === 'system' ? (media.matches ? 'light' : 'dark') : theme;
      root.dataset.theme = resolvedTheme;
      root.style.colorScheme = resolvedTheme;
    };

    applyTheme();

    if (theme !== 'system') {
      return;
    }

    media.addEventListener('change', applyTheme);
    return () => {
      media.removeEventListener('change', applyTheme);
    };
  }, [theme]);
}

export function App() {
  const location = useLocation();
  const { isReady, settings } = useNotes();
  useAppliedTheme(settings.theme);
  const showBottomNav = !location.pathname.startsWith('/note/');

  if (!isReady) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col items-center justify-center px-6 text-center">
        <AppBrand />
        <h1 className="mt-6 font-display text-[1.9rem] font-semibold text-white">NoteFrame</h1>
        <p className="mt-3 text-sm leading-6 text-white/58">
          ホーム画面を整えています。メモと設定を読み込むまで少しだけお待ちください。
        </p>
      </main>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[rgb(var(--app-bg))] text-[rgb(var(--app-text))]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12%] top-[-8%] h-56 w-56 rounded-full bg-violet-500/12 blur-[110px]" />
        <div className="absolute right-[-12%] top-[16%] h-60 w-60 rounded-full bg-sky-300/10 blur-[130px]" />
        <div className="absolute bottom-[-14%] left-[18%] h-72 w-72 rounded-full bg-rose-400/8 blur-[130px]" />
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/note/new" element={<EditorPage />} />
        <Route path="/note/:noteId" element={<EditorPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showBottomNav ? <BottomNav /> : null}
    </div>
  );
}
