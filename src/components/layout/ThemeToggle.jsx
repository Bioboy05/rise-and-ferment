import useSettingsStore from "../../store/useSettingsStore";
import Icon from "../common/Icon";

function ThemeToggle({ className = "", style = {} }) {
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
      aria-label={theme === "light" ? "Dark mode" : "Light mode"}
    >
      <Icon name={theme === "light" ? "moon" : "sun"} size={22} />
    </button>
  );
}

export default ThemeToggle;
