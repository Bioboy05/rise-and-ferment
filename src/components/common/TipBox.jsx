const typeColors = {
  info: "var(--accent)",
  warning: "var(--warning)",
  success: "var(--success)",
  danger: "#e53935",
};

function TipBox({ type = "info", icon, children }) {
  const borderColor = typeColors[type] || typeColors.info;

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: "12px",
        padding: "12px 16px",
        fontSize: "14px",
        color: "var(--text-secondary)",
      }}
    >
      {icon && (
        <span style={{ marginRight: "8px", fontSize: "16px" }}>{icon}</span>
      )}
      {children}
    </div>
  );
}

export default TipBox;
