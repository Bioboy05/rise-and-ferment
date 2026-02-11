import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import recipes from "../data/recipes";
import RecipeModal from "../components/recipes/RecipeModal";

function RecipesPage() {
  const { t } = useTranslation();
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const recipeMap = useMemo(() => {
    const map = new Map();
    recipes.forEach((recipe) => {
      map.set(recipe.id, recipe);
    });
    return map;
  }, []);

  const recipeSections = useMemo(
    () => [
      {
        titleKey: "recipeCategoryBreadFull",
        items: [
          {
            id: "classic-sourdough",
            levelKey: "recipeLevelBeginner",
            timeLabel: "~24h",
            gradient: "linear-gradient(135deg, #D4A574 0%, #8B5A2B 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <ellipse cx="32" cy="28" rx="24" ry="16" />
                <path d="M8 28c0 12 10.7 22 24 22s24-10 24-22" />
                <path d="M20 24c2-4 8-6 12-6s10 2 12 6" strokeWidth="1.5" />
                <line x1="32" y1="18" x2="32" y2="14" />
                <line x1="26" y1="20" x2="24" y2="16" />
                <line x1="38" y1="20" x2="40" y2="16" />
              </svg>
            ),
          },
          {
            id: "focaccia",
            levelKey: "recipeLevelEasy",
            timeLabel: "~18h",
            gradient: "linear-gradient(135deg, #7CB342 0%, #558B2F 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <rect x="8" y="20" width="48" height="24" rx="4" />
                <circle cx="20" cy="32" r="2" fill="white" />
                <circle cx="32" cy="28" r="2" fill="white" />
                <circle cx="44" cy="32" r="2" fill="white" />
                <circle cx="26" cy="36" r="2" fill="white" />
                <circle cx="38" cy="36" r="2" fill="white" />
                <path d="M16 26c0-2 2-4 4-4M32 22c0-2 2-4 4-4M44 26c0-2 2-4 4-4" strokeWidth="1.5" />
              </svg>
            ),
          },
          {
            id: "ciabatta",
            levelKey: "recipeLevelMedium",
            timeLabel: "~20h",
            gradient: "linear-gradient(135deg, #FFCA28 0%, #FF8F00 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <ellipse cx="32" cy="32" rx="22" ry="12" />
                <path d="M14 28c4-4 12-6 18-6s14 2 18 6" />
                <ellipse cx="22" cy="32" rx="3" ry="2" strokeWidth="1" />
                <ellipse cx="32" cy="30" rx="4" ry="3" strokeWidth="1" />
                <ellipse cx="42" cy="32" rx="3" ry="2" strokeWidth="1" />
              </svg>
            ),
          },
          {
            id: "bagels",
            levelKey: "recipeLevelAdvanced",
            timeLabel: "~36h",
            gradient: "linear-gradient(135deg, #FF7043 0%, #E64A19 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <circle cx="32" cy="32" r="18" />
                <circle cx="32" cy="32" r="7" />
                <path d="M20 24c2-2 6-4 12-4s10 2 12 4" />
                <ellipse cx="24" cy="36" rx="2" ry="1" fill="white" opacity="0.5" />
                <ellipse cx="40" cy="36" rx="2" ry="1" fill="white" opacity="0.5" />
              </svg>
            ),
          },
          {
            id: "baguette",
            levelKey: "recipeLevelAdvanced",
            timeLabel: "~28h",
            gradient: "linear-gradient(135deg, #8D6E63 0%, #5D4037 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <ellipse cx="32" cy="32" rx="26" ry="8" transform="rotate(-15 32 32)" />
                <path d="M12 30l8-3M24 27l8-3M36 24l8-3M48 21l6-2" strokeWidth="1.5" />
              </svg>
            ),
          },
        ],
      },
      {
        titleKey: "recipeCategoryDiscardFull",
        items: [
          {
            id: "discard-pancakes",
            levelKey: "recipeLevelEasy",
            timeLabel: "30 min",
            gradient: "linear-gradient(135deg, #FFCC80 0%, #FFA726 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <ellipse cx="32" cy="40" rx="20" ry="6" />
                <ellipse cx="32" cy="34" rx="18" ry="5" />
                <ellipse cx="32" cy="28" rx="16" ry="4" />
                <path d="M24 20c0-4 4-6 8-6s8 2 8 6" fill="white" opacity="0.3" />
                <circle cx="28" cy="34" r="1.5" fill="white" />
                <circle cx="36" cy="36" r="1.5" fill="white" />
              </svg>
            ),
          },
          {
            id: "discard-pizza",
            levelKey: "recipeLevelFavorite",
            timeLabel: "~48h",
            gradient: "linear-gradient(135deg, #EF5350 0%, #C62828 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <path d="M32 8L8 52h48L32 8z" />
                <circle cx="24" cy="38" r="4" fill="#FFCC80" />
                <circle cx="36" cy="32" r="3" fill="#FFCC80" />
                <circle cx="32" cy="44" r="3" fill="#FFCC80" />
                <ellipse cx="28" cy="28" rx="3" ry="2" fill="#4CAF50" />
                <ellipse cx="40" cy="40" rx="2" ry="3" fill="#4CAF50" />
              </svg>
            ),
          },
          {
            id: "discard-crackers",
            levelKey: "recipeLevelEasy",
            timeLabel: "45 min",
            gradient: "linear-gradient(135deg, #A1887F 0%, #6D4C41 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <rect x="12" y="24" width="16" height="16" rx="2" />
                <rect x="36" y="24" width="16" height="16" rx="2" />
                <rect x="24" y="36" width="16" height="16" rx="2" />
                <circle cx="20" cy="32" r="1" fill="white" />
                <circle cx="44" cy="32" r="1" fill="white" />
                <circle cx="32" cy="44" r="1" fill="white" />
              </svg>
            ),
          },
          {
            id: "discard-waffles",
            levelKey: "recipeLevelEasy",
            timeLabel: "40 min",
            gradient: "linear-gradient(135deg, #FFE082 0%, #FFB300 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <rect x="12" y="20" width="40" height="24" rx="4" />
                <line x1="12" y1="28" x2="52" y2="28" />
                <line x1="12" y1="36" x2="52" y2="36" />
                <line x1="22" y1="20" x2="22" y2="44" />
                <line x1="32" y1="20" x2="32" y2="44" />
                <line x1="42" y1="20" x2="42" y2="44" />
              </svg>
            ),
          },
          {
            id: "discard-banana-bread",
            levelKey: "recipeLevelEasy",
            timeLabel: "1.5h",
            gradient: "linear-gradient(135deg, #BCAAA4 0%, #8D6E63 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <rect x="16" y="16" width="32" height="36" rx="4" />
                <path d="M20 24c4-2 8-2 12 0s8 2 12 0" />
                <ellipse cx="26" cy="36" rx="3" ry="4" />
                <ellipse cx="38" cy="38" rx="3" ry="4" />
                <ellipse cx="32" cy="46" rx="3" ry="3" />
              </svg>
            ),
          },
        ],
      },
      {
        titleKey: "recipeCategoryOtherFull",
        items: [
          {
            id: "brioche",
            levelKey: "recipeLevelMedium",
            timeLabel: "~20h",
            gradient: "linear-gradient(135deg, #FFB74D 0%, #F57C00 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <circle cx="32" cy="24" r="10" />
                <ellipse cx="32" cy="44" rx="16" ry="10" />
                <path d="M16 44c0-6 7-10 16-10s16 4 16 10" />
              </svg>
            ),
          },
          {
            id: "cinnamon-rolls",
            levelKey: "recipeLevelMedium",
            timeLabel: "~16h",
            gradient: "linear-gradient(135deg, #D7CCC8 0%, #A1887F 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="2">
                <circle cx="32" cy="32" r="18" />
                <path d="M32 14a18 18 0 0 1 0 36" strokeWidth="3" />
                <circle cx="32" cy="32" r="6" />
                <path d="M38 32c0-6-3-10-6-10" />
              </svg>
            ),
          },
          {
            id: "pretzels",
            levelKey: "recipeLevelMedium",
            timeLabel: "~6h",
            gradient: "linear-gradient(135deg, #795548 0%, #4E342E 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="white" strokeWidth="3">
                <path d="M20 48c-6-6-6-14 0-20s14-6 20 0c-6-6-6-14 0-20s14-6 20 0" />
                <path d="M44 48c6-6 6-14 0-20s-14-6-20 0" />
              </svg>
            ),
          },
          {
            id: "english-muffins",
            levelKey: "recipeLevelMedium",
            timeLabel: "~14h",
            gradient: "linear-gradient(135deg, #FFF8E1 0%, #FFCC80 100%)",
            svg: (
              <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="#8B5A2B" strokeWidth="2">
                <ellipse cx="32" cy="32" rx="18" ry="10" />
                <ellipse cx="32" cy="28" rx="16" ry="8" />
                <circle cx="24" cy="32" r="1.5" fill="#8B5A2B" />
                <circle cx="32" cy="30" r="1.5" fill="#8B5A2B" />
                <circle cx="40" cy="32" r="1.5" fill="#8B5A2B" />
                <circle cx="28" cy="34" r="1" fill="#8B5A2B" />
                <circle cx="36" cy="34" r="1" fill="#8B5A2B" />
              </svg>
            ),
          },
        ],
      },
    ],
    []
  );

  const handleSelect = (card) => {
    const recipe = recipeMap.get(card.id);
    if (!recipe) return;
    setSelectedRecipe({ ...recipe, ...card });
  };

  return (
    <div className="section">
      <h2 className="section-title">{t("recipesSectionTitle")}</h2>

      {recipeSections.map((section) => (
        <div key={section.titleKey}>
          <h3 className="recipe-category-title">{t(section.titleKey)}</h3>
          <div className="recipe-grid">
            {section.items.map((card) => (
              <button
                key={card.id}
                type="button"
                className="recipe-card-new"
                onClick={() => handleSelect(card)}
                aria-label={t(recipeMap.get(card.id)?.titleKey || "")}
              >
                <div className="recipe-card-img" style={{ background: card.gradient }}>
                  {card.svg}
                </div>
                <div className="recipe-card-info">
                  <div className="recipe-card-title">{t(recipeMap.get(card.id)?.titleKey || "")}</div>
                  <div className="recipe-card-meta">
                    {t(card.levelKey)} • {card.timeLabel}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
}

export default RecipesPage;
