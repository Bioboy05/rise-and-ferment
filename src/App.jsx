import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useSettingsStore from "./store/useSettingsStore";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import LearnPage from "./pages/LearnPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingPage from "./pages/OnboardingPage";

function App() {
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const onboardingComplete = useSettingsStore((state) => state.onboardingComplete);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  if (!onboardingComplete) {
    return <OnboardingPage />;
  }

  return (
    <div className="app-shell" style={{ color: "var(--text-primary)" }}>
      <div className="ambient-photo ambient-photo-1" />
      <div className="ambient-photo ambient-photo-2" />
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/recipes" element={<LearnPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Navigation />
    </div>
  );
}

export default App;
