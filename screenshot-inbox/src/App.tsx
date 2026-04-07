import { useState } from 'react';
import { useStore } from './store/useStore';
import { BottomNav } from './components/BottomNav';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { ImportPage } from './pages/ImportPage';
import { InboxPage } from './pages/InboxPage';
import { DetailPage } from './pages/DetailPage';
import { ActionsPage } from './pages/ActionsPage';
import { SearchPage } from './pages/SearchPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import type { ScreenshotItem } from './types';
import { Settings } from 'lucide-react';

export default function App() {
  const { settings, activeTab, setActiveTab } = useStore();
  const [selectedItem, setSelectedItem] = useState<ScreenshotItem | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Get fresh item data from store
  const items = useStore((s) => s.items);
  const freshItem = selectedItem
    ? items.find((i) => i.id === selectedItem.id) || null
    : null;

  if (!settings.onboardingComplete) {
    return <OnboardingPage />;
  }

  if (showImport) {
    return (
      <ImportPage
        onClose={() => setShowImport(false)}
        onComplete={() => {
          setShowImport(false);
          setActiveTab('inbox');
        }}
      />
    );
  }

  if (showSettings) {
    return <SettingsPage onBack={() => setShowSettings(false)} />;
  }

  if (freshItem) {
    return <DetailPage item={freshItem} onBack={() => setSelectedItem(null)} />;
  }

  const handleSelectItem = (item: ScreenshotItem) => setSelectedItem(item);
  const handleImport = () => setShowImport(true);

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto relative">
      {/* Settings button */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm border border-gray-100"
      >
        <Settings size={18} className="text-gray-500" />
      </button>

      {activeTab === 'home' && (
        <HomePage onSelectItem={handleSelectItem} onImport={handleImport} />
      )}
      {activeTab === 'inbox' && (
        <InboxPage onSelectItem={handleSelectItem} onImport={handleImport} />
      )}
      {activeTab === 'actions' && (
        <ActionsPage onSelectItem={handleSelectItem} />
      )}
      {activeTab === 'search' && (
        <SearchPage onSelectItem={handleSelectItem} />
      )}
      {activeTab === 'insights' && <InsightsPage />}

      <BottomNav />
    </div>
  );
}
