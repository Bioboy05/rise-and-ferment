import { useTranslation } from "react-i18next";
import useActiveStarter from "../hooks/useActiveStarter";
import { formatTimeAgo } from "../utils/dateHelpers";
import Icon from "../components/common/Icon";

function HistoryPage() {
  const { t } = useTranslation();
  const starter = useActiveStarter();
  const history = starter.history || [];

  // Group feedings by calendar date (newest first)
  const grouped = {};
  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    const dateKey = new Date(entry.time).toLocaleDateString();
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(entry);
  }
  const dateGroups = Object.entries(grouped);

  // Mini stats
  const totalFeedings = history.length;
  const tempsWithValue = history.filter((e) => e.temp != null);
  const avgTemp =
    tempsWithValue.length > 0
      ? (tempsWithValue.reduce((s, e) => s + e.temp, 0) / tempsWithValue.length).toFixed(1)
      : null;

  if (totalFeedings === 0) {
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center" style={{ padding: "48px 20px" }}>
          <Icon name="clipboard" size={48} style={{ color: "var(--accent)" }} />
          <h2 className="page-title" style={{ marginTop: "16px" }}>
            {t("historyTitle")}
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)", marginTop: "12px", lineHeight: "1.5" }}>
            {t("historyEmpty")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto" style={{ paddingBottom: "24px" }}>
      <h2 className="page-title">{t("historyTitle")}</h2>

      {/* Mini stats bar */}
      <div className="flex gap-2 mb-4">
        <div className="card flex-1 text-center" style={{ marginBottom: 0 }}>
          <div className="stat-value">{totalFeedings}</div>
          <div className="stat-label">{t("historyFeedingsCount")}</div>
        </div>
        <div className="card flex-1 text-center" style={{ marginBottom: 0 }}>
          <div className="stat-value">{avgTemp ? `${avgTemp}°` : "—"}</div>
          <div className="stat-label">{t("historyAvgTemp")}</div>
        </div>
      </div>

      {/* Feeding list grouped by date */}
      {dateGroups.map(([dateKey, entries]) => (
        <div key={dateKey} className="mb-4">
          <div className="section-label" style={{ paddingLeft: "4px" }}>
            {dateKey}
          </div>
          <div className="flex flex-col gap-1.5">
            {entries.map((entry, i) => (
              <div
                key={i}
                className="card flex items-center gap-3"
                style={{ marginBottom: 0, padding: "12px 16px" }}
              >
                {/* Time */}
                <div className="text-xs" style={{ color: "var(--text-muted)", minWidth: "60px" }}>
                  {formatTimeAgo(entry.time, t)}
                </div>

                {/* Amount + details */}
                <div className="flex-1">
                  <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {t("historyAmount", { amount: entry.amount })}
                    {entry.withBran && (
                      <span
                        className="inline-flex items-center gap-0.5 ml-1.5"
                        style={{ fontSize: "12px", color: "var(--accent)" }}
                      >
                        <Icon name="wheat" size={12} /> {t("historyWithBran")}
                      </span>
                    )}
                  </div>
                  {entry.note && (
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {entry.note}
                    </div>
                  )}
                </div>

                {/* Temperature */}
                {entry.temp != null && (
                  <div
                    className="text-xs flex items-center gap-1"
                    style={{
                      color: "var(--text-secondary)",
                      background: "var(--bg-secondary)",
                      borderRadius: "8px",
                      padding: "4px 8px",
                    }}
                  >
                    <Icon name="thermometer" size={14} />
                    {t("historyTemp", { temp: entry.temp })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HistoryPage;
