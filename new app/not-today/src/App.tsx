import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store'
import { BottomNav } from './components/BottomNav'
import { Onboarding } from './pages/Onboarding'
import { Home } from './pages/Home'
import { AddItem } from './pages/AddItem'
import { ItemDetail } from './pages/ItemDetail'
import { History } from './pages/History'
import { Analytics } from './pages/Analytics'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  const onboardingDone = useAppStore((s) => s.userProfile.onboardingDone)

  if (!onboardingDone) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f172a', color: '#f1f5f9', paddingTop: 'env(safe-area-inset-top)' }}>
        <Onboarding />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0f172a', color: '#f1f5f9', paddingTop: 'env(safe-area-inset-top)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
