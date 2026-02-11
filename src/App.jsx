import { useEffect, useMemo, useState } from "react";
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

const CELEBRATION_STORAGE_KEY = "riseFermentCelebrations";

function loadCelebratedMilestones() {
  try {
    const raw = localStorage.getItem(CELEBRATION_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

function saveCelebratedMilestones(ids) {
  localStorage.setItem(CELEBRATION_STORAGE_KEY, JSON.stringify([...ids]));
}

function pseudoRandom(seed, offset) {
  const x = Math.sin(seed * 12.9898 + offset * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function App() {
  const { t } = useTranslation();
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const onboardingComplete = useSettingsStore((state) => state.onboardingComplete);
  const getActiveStarter = useStarterStore((state) => state.getActiveStarter);
  const starter = getActiveStarter();
  const streak = useStreak();
  const [splashHidden, setSplashHidden] = useState(false);
  const [dismissedCelebrationId, setDismissedCelebrationId] = useState(null);
  const [reduceMotion, setReduceMotion] = useState(false);

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
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const celebration = useMemo(() => {
    const celebrated = loadCelebratedMilestones();
    const next = checkMilestones(starter, streak, celebrated);
    if (!next) return null;
    if (dismissedCelebrationId === next.id) return null;
    return next;
  }, [starter, streak, dismissedCelebrationId]);

  const confettiPieces = useMemo(() => {
    if (!celebration || reduceMotion) return [];
    const colors = ["#FFB300", "#FF7043", "#8BC34A", "#29B6F6", "#AB47BC", "#FFD54F"];
    const shapes = ["circle", "square", "triangle"];
    const seed = hashString(celebration.id);
    const count = 72;

    return Array.from({ length: count }, (_, i) => {
      const colorIndex = Math.floor(pseudoRandom(seed, i + 1) * colors.length);
      const shapeIndex = Math.floor(pseudoRandom(seed, i + 101) * shapes.length);

      return {
        id: `confetti-${celebration.id}-${i}`,
        left: pseudoRandom(seed, i + 201) * 100,
        color: colors[colorIndex],
        shape: shapes[shapeIndex],
        delay: pseudoRandom(seed, i + 301) * 0.6,
        duration: 2.8 + pseudoRandom(seed, i + 401) * 1.2,
        drift: -40 + pseudoRandom(seed, i + 501) * 80,
        rotation: 360 + pseudoRandom(seed, i + 601) * 900,
        scaleStart: 0.7 + pseudoRandom(seed, i + 701) * 0.7,
        fallDistance: 95 + pseudoRandom(seed, i + 801) * 25,
      };
    });
  }, [celebration, reduceMotion]);

  const closeCelebration = () => {
    if (!celebration) return;
    const celebrated = loadCelebratedMilestones();
    celebrated.add(celebration.id);
    saveCelebratedMilestones(celebrated);
    setDismissedCelebrationId(celebration.id);
  };

  return (
    <>
      <div className={`splash-screen ${splashHidden ? "hidden" : ""}`} id="splash-screen">
        <div className="splash-logo">{"\u{1F956}"}</div>
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
              "--confetti-drift": `${piece.drift}px`,
              "--confetti-rotate": `${piece.rotation}deg`,
              "--confetti-scale-start": piece.scaleStart,
              "--confetti-fall-distance": `${piece.fallDistance}vh`,
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
        {"\u{1F4F1}"} Rise &amp; Ferment v3.0 - <span>{t("desktopInfo")}</span>
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
