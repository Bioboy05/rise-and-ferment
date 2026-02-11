import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../common/Icon";

function Navigation() {
  const { t } = useTranslation();

  const tabs = [
    { to: "/", label: t("tabHome"), icon: "home" },
    { to: "/history", label: t("tabHistory"), icon: "history" },
    { to: "/recipes", label: t("tabLearn"), icon: "book" },
    { to: "/stats", label: t("tabStats"), icon: "stats" },
    { to: "/settings", label: t("tabSettings"), icon: "settings" },
  ];

  return (
    <nav className="nav-bar">
      <div className="nav-inner">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            style={{ textDecoration: "none" }}
            aria-label={tab.label}
          >
            <div className="nav-icon">
              <Icon name={tab.icon} size={22} />
            </div>
            <div className="nav-label">{tab.label}</div>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
