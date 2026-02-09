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
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <Icon name="clipboard" size={48} style={{ color: "var(--accent)" }} />
          <h2
            style={{
              fontFamily: "Caveat, cursive",
              fontSize: "1.6rem",
              color: "var(--text-primary)",
              marginTop: "16px",
            }}
          >
            {t("historyTitle")}
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              marginTop: "12px",
              lineHeight: "1.5",
            }}
          >
            {t("historyEmpty")}
          </p>
        </div>
      </div>
    );
  }

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
        {t("historyTitle")}
      </h2>

      {/* Mini stats bar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "var(--bg-card)",
            borderRadius: "12px",
            padding: "12px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "1.4rem",
              fontWeight: "800",
              color: "var(--accent)",
            }}
          >
            {totalFeedings}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {t("historyFeedingsCount")}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            background: "var(--bg-card)",
            borderRadius: "12px",
            padding: "12px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "1.4rem",
              fontWeight: "800",
              color: "var(--accent)",
            }}
          >
            {avgTemp ? `${avgTemp}°` : "—"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {t("historyAvgTemp")}
          </div>
        </div>
      </div>

      {/* Feeding list grouped by date */}
      {dateGroups.map(([dateKey, entries]) => (
        <div key={dateKey} style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "8px",
              paddingLeft: "4px",
            }}
          >
            {dateKey}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {entries.map((entry, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {/* Time */}
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    minWidth: "60px",
                  }}
                >
                  {formatTimeAgo(entry.time, t)}
                </div>

                {/* Amount + details */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "var(--text-primary)",
                    }}
                  >
                    {t("historyAmount", { amount: entry.amount })}
                    {entry.withBran && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--accent)",
                          marginLeft: "6px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        <Icon name="wheat" size={12} /> {t("historyWithBran")}
                      </span>
                    )}
                  </div>
                  {entry.note && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      {entry.note}
                    </div>
                  )}
                </div>

                {/* Temperature */}
                {entry.temp != null && (
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      background: "var(--bg-secondary)",
                      borderRadius: "8px",
                      padding: "4px 8px",
                    }}
                  >
                    <Icon name="thermometer" size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "2px" }} />{t("historyTemp", { temp: entry.temp })}
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
