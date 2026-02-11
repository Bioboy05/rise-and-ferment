import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSettingsStore from "./store/useSettingsStore";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import LearnPage from "./pages/LearnPage";
import RecipesPage from "./pages/RecipesPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import PlannerPage from "./pages/PlannerPage";

function App() {
  const { t } = useTranslation();
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const onboardingComplete = useSettingsStore((state) => state.onboardingComplete);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <>
      <p className="desktop-info">
        📱 Rise & Ferment v3.0 - <span>{t("desktopInfo")}</span>
      </p>
      <div className="phone-frame" style={{ color: "var(--text-primary)" }}>
        <div className="ambient-photo ambient-photo-1" />
        <div className="ambient-photo ambient-photo-2" />
        <div className="phone-notch" />
        <div className="app-container">
          {!onboardingComplete ? (
            <OnboardingPage />
          ) : (
            <>
              <Header />
              <main className="app-main">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/recipes" element={<RecipesPage />} />
                  <Route path="/planner" element={<PlannerPage />} />
                  <Route path="/learn" element={<LearnPage />} />
                  <Route path="/stats" element={<StatsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Navigation />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
