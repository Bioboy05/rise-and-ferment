import { useState } from "react";
import { useTranslation } from "react-i18next";
import recipes, { recipeCategories } from "../data/recipes";
import RecipeModal from "../components/recipes/RecipeModal";

function RecipesPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("bread");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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
      <h2
        style={{
          fontFamily: "Caveat, cursive",
          fontSize: "1.8rem",
          color: "var(--text-primary)",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        {t("allRecipes")}
      </h2>

      {/* Category tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: "4px",
        }}
      >
        {recipeCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: activeCategory === cat.id ? "2px solid var(--accent)" : "1px solid var(--border)",
              background: activeCategory === cat.id ? "var(--accent-light)" : "var(--bg-card)",
              color: activeCategory === cat.id ? "var(--accent)" : "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: activeCategory === cat.id ? "700" : "400",
              cursor: "pointer",
              whiteSpace: "nowrap",
              scrollSnapAlign: "start",
              flexShrink: 0,
            }}
          >
            {cat.icon} {t(cat.labelKey)}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        {filtered.map((recipe) => (
          <button
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
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
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "white",
                  marginBottom: "4px",
                  lineHeight: "1.2",
                }}
              >
                {t(recipe.titleKey)}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                <span>{"⭐".repeat(recipe.difficulty)}</span>
                <span>⏱ {formatTime(recipe.timeMinutes)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

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

export default RecipesPage;
