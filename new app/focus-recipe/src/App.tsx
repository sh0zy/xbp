import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store'
import { BottomNav } from './components/BottomNav'
import { Onboarding } from './pages/Onboarding'
import { Home } from './pages/Home'
import { SessionSetup } from './pages/SessionSetup'
import { Session } from './pages/Session'
import { SessionReview } from './pages/SessionReview'
import { History } from './pages/History'
import { Analytics } from './pages/Analytics'
import { Recipe } from './pages/Recipe'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  const onboardingDone = useAppStore((s) => s.userProfile.onboardingDone)

  if (!onboardingDone) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
        <Onboarding />
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/session/setup" element={<SessionSetup />} />
          <Route path="/session" element={<Session />} />
          <Route path="/session/review" element={<SessionReview />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
