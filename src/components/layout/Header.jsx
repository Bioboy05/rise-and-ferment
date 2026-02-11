import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useActiveStarter from "../../hooks/useActiveStarter";
import ThemeToggle from "./ThemeToggle";
import Icon from "../common/Icon";

function getGreetingKey(hour) {
  if (hour < 12) return "greetingMorning";
  if (hour < 18) return "greetingAfternoon";
  return "greetingEvening";
}

function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const starter = useActiveStarter();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return t(getGreetingKey(hour));
  }, [t]);

  const routeTitleMap = {
    "/history": "historyTitle",
    "/recipes": "allRecipes",
    "/planner": "plannerTitle",
    "/learn": "learnTitle",
    "/stats": "statsTitle",
    "/settings": "settingsTitle",
  };

  const titleKey = routeTitleMap[location.pathname];
  const pageTitle = titleKey ? t(titleKey) : "Rise & Ferment";
  const isHome = location.pathname === "/";

  return (
    <header className="header">
      <div>
        {isHome ? (
          <>
            <div className="greeting">{greeting}</div>
            <div className="starter-name">{starter.name}</div>
          </>
        ) : (
          <div className="starter-name">{pageTitle}</div>
        )}
      </div>

      {isHome ? (
        <button className="icon-btn" onClick={() => navigate("/settings")} aria-label={t("settingsTitle")}>
          <Icon name="settings" size={22} />
        </button>
      ) : (
        <ThemeToggle className="icon-btn" />
      )}

      {isHome && <div className="corner-photo header-photo" />}
    </header>
  );
}

export default Header;
