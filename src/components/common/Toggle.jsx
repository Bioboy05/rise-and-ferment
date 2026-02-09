function Toggle({ checked, onChange, label, description }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {(label || description) && (
        <div style={{ flex: 1, marginRight: "12px" }}>
          {label && (
            <strong style={{ color: "var(--text-secondary)" }}>{label}</strong>
          )}
          {description && (
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "2px",
              }}
            >
              {description}
            </div>
          )}
        </div>
      )}
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        style={{
          width: "48px",
          height: "28px",
          borderRadius: "14px",
          border: "none",
          background: checked ? "var(--success)" : "var(--bg-tertiary)",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "white",
            position: "absolute",
            top: "3px",
            left: checked ? "23px" : "3px",
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </div>
  );
}

export default Toggle;
