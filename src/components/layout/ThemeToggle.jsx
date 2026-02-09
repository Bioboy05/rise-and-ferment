import useSettingsStore from "../../store/useSettingsStore";

function ThemeToggle() {
  const { theme, toggleTheme } = useSettingsStore();

  return (
    <button
      onClick={toggleTheme}
      className="text-2xl rounded-lg hover:opacity-75 transition flex items-center justify-center"
      style={{ minWidth: "44px", minHeight: "44px" }}
      title={theme === "light" ? "Dark mode" : "Light mode"}
      aria-label={theme === "light" ? "Dark mode" : "Light mode"}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

export default ThemeToggle;
