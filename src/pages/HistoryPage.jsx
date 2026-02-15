import { useTranslation } from "react-i18next";
import useActiveStarter from "../hooks/useActiveStarter";
import useSettingsStore from "../store/useSettingsStore";
import Icon from "../components/common/Icon";

function HistoryPage() {
  const { t } = useTranslation();
  const starter = useActiveStarter();
  const language = useSettingsStore((state) => state.language);
  const history = starter.history || [];

  if (history.length === 0) {
    return (
      <div className="section">
        <h2 className="section-title">{t("historyTitle")}</h2>
        <div className="empty-state">
          <div style={{ marginBottom: "8px" }}>
            <Icon name="clipboard" size={40} style={{ opacity: 0.4 }} />
          </div>
          <div className="empty-text">{t("noFeedingsYet")}</div>
        </div>
      </div>
    );
  }

  const localeMap = {
    ro: "ro-RO",
    en: "en-US",
    de: "de-DE",
    fr: "fr-FR",
    es: "es-ES",
    it: "it-IT",
  };
  const locale = localeMap[language] || localeMap.ro;
  const todayStr = new Date().toDateString();
  const recentHistory = [...history]
    .sort((a, b) => b.time - a.time)
    .slice(0, 20);

  return (
    <div className="section">
      <h2 className="section-title">{t("historyTitle")}</h2>
      <div id="history-list">
        {recentHistory.map((entry, i) => {
          const d = new Date(entry.time);
          let label = d.toLocaleDateString(locale, { day: "numeric", month: "short" });
          if (d.toDateString() === todayStr) label = t("today");
          const time = d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
          return (
            <div
              key={`${entry.time}-${i}`}
              className="history-item"
              style={{ flexDirection: "column", alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <span className="history-time">{`${label}, ${time}`}</span>
                <span className="history-amount" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {entry.amount}g
                  {entry.withBran ? (
                    <Icon name="sprout" size={13} style={{ color: "var(--accent)" }} />
                  ) : null}
                  {entry.temp != null ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "2px", fontSize: "11px", color: "var(--text-muted)" }}>
                      <Icon name="thermometer" size={12} />
                      {entry.temp}°
                    </span>
                  ) : null}
                </span>
              </div>
              {entry.note ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    marginTop: "2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "200px",
                  }}
                >
                  <Icon name="note" size={11} />
                  <span>{entry.note}</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryPage;
