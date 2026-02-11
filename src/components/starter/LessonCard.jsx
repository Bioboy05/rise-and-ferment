import { useTranslation } from "react-i18next";
import Icon from "../common/Icon";

function LessonCard({ lesson, onClick }) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="lesson-card"
      type="button"
    >
      <div className="lesson-icon">
        <Icon name={lesson.icon} size={26} />
      </div>
      <div>
        <div className="lesson-title">{t(lesson.titleKey)}</div>
        <div className="lesson-short">{t(lesson.shortKey)}</div>
      </div>
    </button>
  );
}

export default LessonCard;
