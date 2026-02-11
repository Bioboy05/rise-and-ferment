import { useState } from "react";
import { useTranslation } from "react-i18next";
import lessons from "../data/lessons";
import LessonCard from "../components/starter/LessonCard";
import LessonModal from "../components/starter/LessonModal";

function LearnPage() {
  const { t } = useTranslation();
  const [selectedLesson, setSelectedLesson] = useState(null);

  return (
    <div className="section">
      <h2 className="section-title">{t("learnTitle")}</h2>
      <div>
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onClick={() => setSelectedLesson(lesson)}
          />
        ))}
      </div>

      {/* Lesson modal */}
      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}
    </div>
  );
}

export default LearnPage;
