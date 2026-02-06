import useSettingsStore from "../../store/useSettingsStore";

const tabs = [
  { id: "home", label: "🏠 Acasă" },
  { id: "history", label: "📋 Istoric" },
  { id: "recipes", label: "🥄 Rețete" },
  { id: "stats", label: "📊 Statistici" },
  { id: "settings", label: "⚙️ Setări" },
];

function Navigation({ activeTab, onTabChange }) {
  const theme = useSettingsStore((state) => state.theme);

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 flex justify-around py-2 border-t ${
        theme === "dark"
          ? "bg-amber-900 border-amber-800 text-amber-200"
          : "bg-white border-amber-200 text-amber-700"
      }`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center text-xs px-2 py-1 rounded-lg transition ${
            activeTab === tab.id
              ? theme === "dark"
                ? "text-amber-50 font-bold"
                : "text-amber-900 font-bold"
              : "opacity-60 hover:opacity-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;
