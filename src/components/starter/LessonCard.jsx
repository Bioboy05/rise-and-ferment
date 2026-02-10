import { useTranslation } from "react-i18next";
import Icon from "../common/Icon";

function LessonCard({ lesson, onClick }) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="card"
      style={{
        border: "1px solid var(--border)",
        cursor: "pointer",
        textAlign: "left",
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "var(--accent-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={lesson.icon} size={18} style={{ color: "var(--accent)" }} />
      </div>
      <div>
        <div style={{ fontWeight: "700", fontSize: "14px", marginBottom: "2px", lineHeight: "1.3" }}>
          {t(lesson.titleKey)}
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "12px", lineHeight: "1.4" }}>
          {t(lesson.shortKey)}
        </div>
      </div>
    </button>
  );
}

export default LessonCard;
