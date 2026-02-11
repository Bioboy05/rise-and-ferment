import { useTranslation } from "react-i18next";
import Modal from "../common/Modal";

function RecipeModal({ recipe, onClose }) {
  const { t } = useTranslation();

  const difficultyLabel = recipe.levelKey ? t(recipe.levelKey) : t("recipeLevelMedium");
  const timeLabel = recipe.timeLabel || (recipe.timeMinutes ? `${recipe.timeMinutes}${t("recipeMinutes")}` : "");

  return (
    <Modal onClose={onClose} title={t(recipe.titleKey)}>
      <div className="recipe-modal-meta">
        <span>⏱️ {timeLabel}</span>
        <span>📊 {difficultyLabel}</span>
      </div>

      <div className="recipe-modal-intro">{t(recipe.descKey)}</div>

      <div className="recipe-modal-section">
        <h3 className="recipe-section-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M5 10h14" />
            <path d="M7 14h10" />
            <path d="M9 18h6" />
          </svg>
          {t("recipeIngredients")}
        </h3>
        <ul className="recipe-ingredients">
          {recipe.ingredientsKeys.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-modal-section">
        <h3 className="recipe-section-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
          {t("recipeSteps")}
        </h3>
        <ol className="recipe-steps">
          {recipe.stepsKeys.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ol>
      </div>

      {recipe.tipKey && (
        <div className="recipe-modal-tips">
          <strong>{t("recipeTips")}:</strong> {t(recipe.tipKey)}
        </div>
      )}
    </Modal>
  );
}

export default RecipeModal;
