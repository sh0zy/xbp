import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import OnboardingPage from "../pages/OnboardingPage";
import HomePage from "../pages/HomePage";
import PlanBuilderPage from "../pages/PlanBuilderPage";
import PlanResultPage from "../pages/PlanResultPage";
import ExecutionPage from "../pages/ExecutionPage";
import ReviewPage from "../pages/ReviewPage";
import HistoryPage from "../pages/HistoryPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import SettingsPage from "../pages/SettingsPage";

function RootRedirect() {
  const done = useAppStore((s) => s.settings.onboardingCompleted);
  return <Navigate to={done ? "/home" : "/onboarding"} replace />;
}

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/plan" element={<PlanBuilderPage />} />
        <Route path="/plan/result" element={<PlanResultPage />} />
        <Route path="/execute" element={<ExecutionPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
