import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Navigation() {
  const { t } = useTranslation();

  const tabs = [
    { to: "/", label: t("tabHome"), icon: "🏠" },
    { to: "/history", label: t("tabHistory"), icon: "📋" },
    { to: "/recipes", label: t("tabLearn"), icon: "🥄" },
    { to: "/stats", label: t("tabStats"), icon: "📊" },
    { to: "/settings", label: t("tabSettings"), icon: "⚙️" },
  ];

  return (
    <nav
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
      }}
      className="fixed bottom-0 left-0 right-0 flex justify-around py-2"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          className="flex flex-col items-center text-xs px-2 py-1 transition no-underline"
          style={({ isActive }) => ({
            color: isActive ? "var(--accent)" : "var(--text-muted)",
            fontWeight: isActive ? "700" : "400",
          })}
        >
          <span className="text-lg">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default Navigation;
