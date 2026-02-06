const tabs = [
  { id: "home", label: "Acasă", icon: "🏠" },
  { id: "history", label: "Istoric", icon: "📋" },
  { id: "recipes", label: "Rețete", icon: "🥄" },
  { id: "stats", label: "Statistici", icon: "📊" },
  { id: "settings", label: "Setări", icon: "⚙️" },
];

function Navigation({ activeTab, onTabChange }) {
  return (
    <nav
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
      }}
      className="fixed bottom-0 left-0 right-0 flex justify-around py-2"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex flex-col items-center text-xs px-2 py-1 transition"
          style={{
            color: activeTab === tab.id ? "var(--accent)" : "var(--text-muted)",
            fontWeight: activeTab === tab.id ? "700" : "400",
          }}
        >
          <span className="text-lg">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default Navigation;
