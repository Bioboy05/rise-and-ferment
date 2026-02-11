import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSettingsStore from "./store/useSettingsStore";
import useStarterStore from "./store/useStarterStore";
import useStreak from "./hooks/useStreak";
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
import { checkMilestones } from "./data/celebrations";

function App() {
  const { t } = useTranslation();
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const onboardingComplete = useSettingsStore((state) => state.onboardingComplete);
  const getActiveStarter = useStarterStore((state) => state.getActiveStarter);
  const starter = getActiveStarter();
  const streak = useStreak();
  const [splashHidden, setSplashHidden] = useState(false);
  const [celebration, setCelebration] = useState(null);
  const [confettiPieces, setConfettiPieces] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const timer = setTimeout(() => setSplashHidden(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("riseFermentCelebrations");
    const celebrated = new Set(stored ? JSON.parse(stored) : []);
    const milestone = checkMilestones(starter, streak, celebrated);
    if (milestone) {
      setCelebration(milestone);
      celebrated.add(milestone.id);
      localStorage.setItem("riseFermentCelebrations", JSON.stringify([...celebrated]));
      const colors = ["#FFB300", "#FF7043", "#8BC34A", "#29B6F6", "#AB47BC", "#FFD54F"];
      const shapes = ["circle", "square", "triangle"];
      const pieces = Array.from({ length: 60 }, (_, i) => ({
        id: `confetti-${i}-${Date.now()}`,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        delay: Math.random() * 0.6,
        duration: 2.8 + Math.random() * 1.2,
      }));
      setConfettiPieces(pieces);
    }
  }, [starter, streak]);

  const closeCelebration = () => {
    setCelebration(null);
    setConfettiPieces([]);
  };

  return (
    <>
      <div className={`splash-screen ${splashHidden ? "hidden" : ""}`} id="splash-screen">
        <div className="splash-logo">🥖</div>
        <div className="splash-title">Rise &amp; Ferment</div>
        <div className="splash-subtitle">{t("splashSubtitle")}</div>
        <div className="splash-loader" />
      </div>

      <div className="confetti-container" id="confetti-container">
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className={`confetti ${piece.shape}`}
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDuration: `${piece.duration}s`,
              animationDelay: `${piece.delay}s`,
              color: piece.color,
            }}
          />
        ))}
      </div>

      <div className={`celebration-overlay ${celebration ? "active" : ""}`} id="celebration-overlay">
        {celebration && (
          <div className="celebration-content">
            <div className="celebration-emoji" id="celebration-emoji">
              {celebration.emoji}
            </div>
            <div className="celebration-title" id="celebration-title">
              {t(celebration.titleKey)}
            </div>
            <div className="celebration-text" id="celebration-text">
              {t(celebration.descKey)}
            </div>
            <button className="celebration-btn" onClick={closeCelebration} type="button">
              {t("awesome")}
            </button>
          </div>
        )}
      </div>

      <p className="desktop-info">
        📱 Rise &amp; Ferment v3.0 - <span>{t("desktopInfo")}</span>
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
