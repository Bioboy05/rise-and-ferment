import { useState } from "react";
import { useTranslation } from "react-i18next";
import lessons from "../data/lessons";
import recipes, { recipeCategories } from "../data/recipes";
import LessonCard from "../components/starter/LessonCard";
import LessonModal from "../components/starter/LessonModal";
import RecipeModal from "../components/recipes/RecipeModal";
import Icon from "../components/common/Icon";

function LearnPage() {
  const { t } = useTranslation();
  const [section, setSection] = useState("lessons"); // "lessons" | "recipes"
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [activeCategory, setActiveCategory] = useState("bread");

  const filtered = activeCategory
    ? recipes.filter((r) => r.category === activeCategory)
    : recipes;

  const formatTime = (minutes) => {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h}${t("recipeHours")} ${m}${t("recipeMinutes")}` : `${h}${t("recipeHours")}`;
    }
    return `${minutes}${t("recipeMinutes")}`;
  };

  return (
    <div className="max-w-md mx-auto" style={{ paddingBottom: "24px" }}>
      <h2 className="page-title">{t("learnTitle")}</h2>

      {/* Section toggle */}
      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={() => setSection("lessons")}
          className="btn-pill"
          data-active={section === "lessons"}
        >
          <Icon name="book" size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
          {t("lessonTitle")}
        </button>
        <button
          onClick={() => setSection("recipes")}
          className="btn-pill"
          data-active={section === "recipes"}
        >
          <Icon name="bread" size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
          {t("allRecipes")}
        </button>
      </div>

      {/* Lessons section */}
      {section === "lessons" && (
        <div className="grid grid-cols-2 gap-2.5">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => setSelectedLesson(lesson)}
            />
          ))}
        </div>
      )}

      {/* Recipes section */}
      {section === "recipes" && (
        <>
          {/* Category tabs */}
          <div
            className="hide-scrollbar flex gap-2 mb-4"
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollSnapType: "x mandatory",
            }}
          >
            {recipeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="btn-pill"
                data-active={activeCategory === cat.id}
                style={{ scrollSnapAlign: "start" }}
              >
                {cat.icon} {t(cat.labelKey)}
              </button>
            ))}
          </div>

          {/* Recipe grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {filtered.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                aria-label={t(recipe.titleKey)}
                style={{
                  background: `linear-gradient(135deg, ${recipe.gradient[0]}, ${recipe.gradient[1]})`,
                  borderRadius: "16px",
                  padding: "16px 12px",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  minHeight: "140px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "32px" }}>{recipe.icon}</span>
                <div>
                  <div className="text-sm font-bold" style={{ color: "white", marginBottom: "4px", lineHeight: "1.2" }}>
                    {t(recipe.titleKey)}
                  </div>
                  <div className="flex items-center gap-1.5" style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)" }}>
                    <span>
                      {Array.from({ length: recipe.difficulty }, (_, i) => (
                        <Icon key={i} name="star-filled" size={10} style={{ display: "inline" }} />
                      ))}
                    </span>
                    <span>
                      <Icon name="clock" size={10} style={{ display: "inline", verticalAlign: "middle", marginRight: "2px" }} />
                      {formatTime(recipe.timeMinutes)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Lesson modal */}
      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      )}

      {/* Recipe modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

export default LearnPage;
