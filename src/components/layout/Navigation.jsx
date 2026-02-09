import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../common/Icon";

function Navigation() {
  const { t } = useTranslation();

  const tabs = [
    { to: "/", label: t("tabHome"), icon: "home" },
    { to: "/history", label: t("tabHistory"), icon: "history" },
    { to: "/recipes", label: t("tabLearn"), icon: "recipes" },
    { to: "/stats", label: t("tabStats"), icon: "stats" },
    { to: "/settings", label: t("tabSettings"), icon: "settings" },
  ];

  return (
    <nav
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      className="fixed bottom-0 left-0 right-0 flex justify-around py-2"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          className="flex flex-col items-center justify-center text-xs transition no-underline"
          style={({ isActive }) => ({
            color: isActive ? "var(--accent)" : "var(--text-muted)",
            fontWeight: isActive ? "700" : "400",
            minWidth: "44px",
            minHeight: "44px",
            padding: "4px 6px",
          })}
          aria-label={tab.label}
        >
          <Icon name={tab.icon} size={22} />
          <span style={{ marginTop: "2px" }}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default Navigation;
