import { useTranslation } from "react-i18next";
import Modal from "../common/Modal";
import { sanitizeLimitedHtml } from "../../utils/sanitizeHtml";

function LessonModal({ lesson, onClose }) {
  const { t } = useTranslation();
  const html = sanitizeLimitedHtml(t(lesson.contentKey), { convertNewlines: true });

  return (
    <Modal onClose={onClose} title={t(lesson.titleKey)}>
      <div
        className="lesson-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Modal>
  );
}

export default LessonModal;
