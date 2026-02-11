import { useTranslation } from "react-i18next";
import Modal from "../common/Modal";

function LessonModal({ lesson, onClose }) {
  const { t } = useTranslation();
  const html = t(lesson.contentKey).replace(/\n/g, "<br>");

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
