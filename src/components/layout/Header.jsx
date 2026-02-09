import ThemeToggle from "./ThemeToggle";

function Header() {
  return (
    <header
      style={{
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
        borderBottom: "1px solid var(--border)",
      }}
      className="px-4 py-3 flex items-center justify-between"
    >
      <h1
        className="text-xl font-bold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Rise & Ferment
      </h1>
      <ThemeToggle />
    </header>
  );
}

export default Header;
