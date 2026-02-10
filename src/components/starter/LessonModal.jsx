import { useTranslation } from "react-i18next";
import Modal from "../common/Modal";
import Icon from "../common/Icon";

function LessonModal({ lesson, onClose }) {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose} title={`${t("lessonTitle")} ${lesson.id}`}>
      <div className="flex items-center gap-3 mb-4">
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "var(--accent-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name={lesson.icon} size={22} style={{ color: "var(--accent)" }} />
        </div>
        <h3 style={{ fontWeight: "700", fontSize: "16px" }}>
          {t(lesson.titleKey)}
        </h3>
      </div>

      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "14px",
          lineHeight: "1.6",
          whiteSpace: "pre-line",
        }}
      >
        {t(lesson.contentKey)}
      </p>

      <button
        onClick={onClose}
        className="btn-primary mt-6"
      >
        {t("understood")}
      </button>
    </Modal>
  );
}

export default LessonModal;
