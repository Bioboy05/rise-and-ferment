import Icon from "./Icon";

const typeColors = {
  info: "var(--accent)",
  warning: "var(--warning)",
  success: "var(--success)",
  danger: "#e53935",
};

const typeIcons = {
  info: "lightbulb",
  warning: "alert",
  success: "check",
  danger: "alert",
};

function TipBox({ type = "info", icon, children }) {
  const borderColor = typeColors[type] || typeColors.info;
  const iconName = typeIcons[type] || "lightbulb";

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: "12px",
        padding: "12px 16px",
        fontSize: "14px",
        color: "var(--text-secondary)",
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
      }}
    >
      <Icon name={icon || iconName} size={18} style={{ color: borderColor, flexShrink: 0, marginTop: "1px" }} />
      <div>{children}</div>
    </div>
  );
}

export default TipBox;
