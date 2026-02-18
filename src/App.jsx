import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSettingsStore from "./store/useSettingsStore";
import useStreak from "./hooks/useStreak";
import useActiveStarter from "./hooks/useActiveStarter";
import Header from "./components/layout/Header";
import Icon from "./components/common/Icon";
import Navigation from "./components/layout/Navigation";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import LearnPage from "./pages/LearnPage";
import RecipesPage from "./pages/RecipesPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import PlannerPage from "./pages/PlannerPage";
import ShopPage from "./pages/ShopPage";
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
  const { t, i18n } = useTranslation();
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const onboardingComplete = useSettingsStore((state) => state.onboardingComplete);
  const starter = useActiveStarter();
  const streak = useStreak();
  const [splashHidden, setSplashHidden] = useState(false);
  const [dismissedCelebrationId, setDismissedCelebrationId] = useState(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-glass", "glassy");
  }, [theme]);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    document.documentElement.lang = language;
  }, [i18n, language]);

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
        <div className="splash-logo splash-logo-jar" aria-hidden="true">
          <svg viewBox="0 0 80 110" fill="none">
            <rect x="15" y="0" width="50" height="12" rx="3" fill="#8B5A2B" />
            <rect x="18" y="2" width="44" height="3" fill="#A67C52" />
            <rect x="12" y="10" width="56" height="6" rx="2" fill="#6B4423" />
            <path
              d="M15 16 L12 100 Q12 108 20 108 L60 108 Q68 108 68 100 L65 16 Z"
              fill="rgba(200, 220, 230, 0.3)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />
            <path
              d="M18 20 L16 95 Q16 98 18 98 L22 98 Q24 98 24 95 L26 20 Z"
              fill="rgba(255,255,255,0.4)"
            />
            <g>
              <path
                d="M16 85 Q25 80 40 82 Q55 84 64 85 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z"
                fill="var(--accent)"
                opacity="0.7"
              >
                <animate
                  attributeName="d"
                  values="M16 85 Q25 80 40 82 Q55 84 64 85 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z;
                              M16 83 Q28 78 40 80 Q52 78 64 83 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z;
                              M16 85 Q25 80 40 82 Q55 84 64 85 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <circle cx="25" cy="90" r="2" fill="rgba(255,255,255,0.6)">
                <animate attributeName="cy" values="95;85;95" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="40" cy="92" r="2.5" fill="rgba(255,255,255,0.5)">
                <animate attributeName="cy" values="97;86;97" dur="3.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="55" cy="88" r="1.8" fill="rgba(255,255,255,0.6)">
                <animate attributeName="cy" values="93;83;93" dur="2.8s" repeatCount="indefinite" />
              </circle>
            </g>
            <rect x="10" y="70" width="60" height="3" rx="1" fill="var(--warning)" opacity="0.8" />
          </svg>
        </div>
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
              <Icon name={celebration.iconName} size={48} />
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
        <Icon name="phone" size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} /> Rise &amp; Ferment v3.0 - <span>{t("desktopInfo")}</span>
      </p>
      <div className="phone-frame" style={{ color: "var(--text-primary)" }}>
        <div className="phone-notch" />
        <div className="app-container">
          {!onboardingComplete ? (
            <main className="app-main onboarding-main">
              <OnboardingPage />
            </main>
          ) : (
            <>
              <Header />
              <main className="app-main with-nav">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/recipes" element={<RecipesPage />} />
                  <Route path="/planner" element={<PlannerPage />} />
                  <Route path="/learn" element={<LearnPage />} />
                  <Route path="/stats" element={<StatsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/shop" element={<ShopPage />} />
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
