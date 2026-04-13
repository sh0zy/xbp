import { useMemo, useState } from 'react';
import { AppStoreContext } from '../store/AppStoreContext';
import { useAppStore } from '../store/useAppStore';
import type { Route } from './router';
import HomePage from '../pages/HomePage';
import TemplatesPage from '../pages/TemplatesPage';
import TemplateEditorPage from '../pages/TemplateEditorPage';
import RunSessionPage from '../pages/RunSessionPage';
import ReviewPage from '../pages/ReviewPage';
import SettingsPage from '../pages/SettingsPage';
import BottomNav from '../components/BottomNav';

export default function App() {
  const store = useAppStore();
  const [route, setRoute] = useState<Route>({ name: 'home' });

  const body = useMemo(() => {
    switch (route.name) {
      case 'home':
        return <HomePage navigate={setRoute} />;
      case 'templates':
        return <TemplatesPage mode={route.mode} navigate={setRoute} />;
      case 'editor':
        return (
          <TemplateEditorPage
            templateId={route.templateId}
            mode={route.mode}
            navigate={setRoute}
          />
        );
      case 'run':
        return <RunSessionPage navigate={setRoute} />;
      case 'review':
        return <ReviewPage navigate={setRoute} />;
      case 'settings':
        return <SettingsPage navigate={setRoute} />;
    }
  }, [route]);

  return (
    <AppStoreContext.Provider value={store}>
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-nest-bg">
        <main className="flex-1 pb-28">{body}</main>
        <BottomNav route={route} navigate={setRoute} />
      </div>
    </AppStoreContext.Provider>
  );
}
