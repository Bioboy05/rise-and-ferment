import useSettingsStore from "../../store/useSettingsStore";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const theme = useSettingsStore((state) => state.theme);

  return (
    <header
      className={`px-4 py-3 flex items-center justify-between ${
        theme === "dark"
          ? "bg-amber-900 text-amber-50"
          : "bg-amber-100 text-amber-900"
      }`}
    >
      <h1 className="text-xl font-bold">🍞 Rise & Ferment</h1>
      <ThemeToggle />
    </header>
  );
}

export default Header;
