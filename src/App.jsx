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

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      className="min-h-screen"
    >
      <Header />
      <main className="pb-16 px-4 py-4">
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
