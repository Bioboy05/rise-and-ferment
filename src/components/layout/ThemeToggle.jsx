import useSettingsStore from "../../store/useSettingsStore";
import Icon from "../common/Icon";

function ThemeToggle() {
  const { theme, toggleTheme } = useSettingsStore();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg hover:opacity-75 transition flex items-center justify-center"
      style={{ minWidth: "44px", minHeight: "44px", color: "var(--text-muted)" }}
      aria-label={theme === "light" ? "Dark mode" : "Light mode"}
    >
      <Icon name={theme === "light" ? "moon" : "sun"} size={22} />
    </button>
  );
}

export default ThemeToggle;
