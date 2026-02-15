import { useTranslation } from "react-i18next";
import useSettingsStore from "../../store/useSettingsStore";
import Icon from "../common/Icon";

function ThemeToggle({ className = "", style = {} }) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useSettingsStore();

  return (
    <button
      onClick={toggleTheme}
      className={className}
      style={{
        minWidth: "44px",
        minHeight: "44px",
        color: "var(--text-muted)",
        ...style,
      }}
      aria-label={theme === "light" ? t("themeDark") : t("themeLight")}
    >
      <Icon name={theme === "light" ? "moon" : "sun"} size={22} />
    </button>
  );
}

export default ThemeToggle;
