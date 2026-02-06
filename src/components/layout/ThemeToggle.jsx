import useSettingsStore from "../../store/useSettingsStore";

function ThemeToggle() {
  const { theme, toggleTheme } = useSettingsStore();

  return (
    <button
      onClick={toggleTheme}
      className="text-2xl p-1 rounded-lg hover:opacity-75 transition"
      title={theme === "light" ? "Dark mode" : "Light mode"}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

export default ThemeToggle;
