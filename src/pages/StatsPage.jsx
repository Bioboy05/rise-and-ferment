import { useTranslation } from "react-i18next";

function StatsPage() {
  const { t } = useTranslation();

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center py-12">
        <span className="text-4xl">📊</span>
        <h2
          className="mt-4 text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {t("statsTitle")}
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          {t("comingSoon")}
        </p>
      </div>
    </div>
  );
}

export default StatsPage;
