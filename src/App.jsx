import { useState } from "react";
import useSettingsStore from "./store/useSettingsStore";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import HomePage from "./pages/HomePage";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const theme = useSettingsStore((state) => state.theme);

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-amber-950 text-amber-50"
          : "bg-amber-50 text-amber-900"
      }`}
    >
      <Header />
      <main className="pb-16 px-4 py-4">
        {activeTab === "home" && <HomePage />}
      </main>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
