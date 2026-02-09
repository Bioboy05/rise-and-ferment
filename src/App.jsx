import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useSettingsStore from "./store/useSettingsStore";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import RecipesPage from "./pages/RecipesPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      className="min-h-dvh"
    >
      <Header />
      <main className="px-4 py-4" style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom, 0px))" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
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
