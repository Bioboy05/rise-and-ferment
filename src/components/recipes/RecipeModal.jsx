import { useTranslation } from "react-i18next";
import Modal from "../common/Modal";
import TipBox from "../common/TipBox";

function RecipeModal({ recipe, onClose }) {
  const { t } = useTranslation();

  const formatTime = (minutes) => {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h}${t("recipeHours")} ${m}${t("recipeMinutes")}` : `${h}${t("recipeHours")}`;
    }
    return `${minutes}${t("recipeMinutes")}`;
  };

  return (
    <Modal onClose={onClose} title={`${recipe.icon} ${t(recipe.titleKey)}`}>
      {/* Description */}
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          marginBottom: "16px",
          lineHeight: "1.5",
        }}
      >
        {t(recipe.descKey)}
      </p>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          fontSize: "13px",
          color: "var(--text-muted)",
        }}
      >
        <span>
          {"⭐".repeat(recipe.difficulty)}{"☆".repeat(3 - recipe.difficulty)}
        </span>
        <span>⏱ {formatTime(recipe.timeMinutes)}</span>
        <span>🍽 {recipe.servings} {t("recipeServings")}</span>
      </div>

      {/* Ingredients */}
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "10px",
          }}
        >
          {t("recipeIngredients")}
        </h3>
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "12px",
            padding: "12px 16px",
          }}
        >
          {recipe.ingredientsKeys.map((key, i) => (
            <div
              key={i}
              style={{
                padding: "6px 0",
                fontSize: "14px",
                color: "var(--text-secondary)",
                borderBottom:
                  i < recipe.ingredientsKeys.length - 1
                    ? "1px solid var(--border)"
                    : "none",
              }}
            >
              • {t(key)}
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "10px",
          }}
        >
          {t("recipeSteps")}
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {recipe.stepsKeys.map((key, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "10px",
                padding: "8px",
                background: "var(--bg-secondary)",
                borderRadius: "10px",
                fontSize: "14px",
                color: "var(--text-secondary)",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  background: "var(--accent)",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ lineHeight: "1.4" }}>{t(key)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      {recipe.tipKey && (
        <TipBox type="info" icon="💡">
          <strong>{t("recipeTips")}:</strong> {t(recipe.tipKey)}
        </TipBox>
      )}
    </Modal>
  );
}

export default RecipeModal;
