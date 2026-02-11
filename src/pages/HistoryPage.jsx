import { useTranslation } from "react-i18next";
import useActiveStarter from "../hooks/useActiveStarter";
import useSettingsStore from "../store/useSettingsStore";

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
          <div style={{ fontSize: "50px" }}>📋</div>
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

  return (
    <div className="section">
      <h2 className="section-title">{t("historyTitle")}</h2>
      <div id="history-list">
        {history.slice(0, 20).map((entry, i) => {
          const d = new Date(entry.time);
          let label = d.toLocaleDateString(locale, { day: "numeric", month: "short" });
          if (d.toDateString() === todayStr) label = t("today");
          const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <div
              key={`${entry.time}-${i}`}
              className="history-item"
              style={{ flexDirection: "column", alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <span className="history-time">{`${label}, ${time}`}</span>
                <span className="history-amount">
                  {entry.amount}g
                  {entry.withBran ? (
                    <span style={{ fontSize: "11px", color: "var(--accent)", marginLeft: "6px" }}>🌾</span>
                  ) : null}
                  {entry.temp != null ? (
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "4px" }}>
                      🌡️{entry.temp}°
                    </span>
                  ) : null}
                </span>
              </div>
              {entry.note ? (
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    marginTop: "2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "200px",
                  }}
                >
                  📝 {entry.note}
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
