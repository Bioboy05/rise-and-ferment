import { useState } from "react";
import { useTranslation } from "react-i18next";
import useActiveStarter from "../hooks/useActiveStarter";
import useSettingsStore from "../store/useSettingsStore";
import { formatWeight } from "../utils/units";
import Icon from "../components/common/Icon";

const PAGE_SIZE = 20;

const RISE_ICON = "stats";
const BUBBLE_ICON = "droplet";
const AROMA_ICON = "leaf";

const LOCALE_MAP = {
  ro: "ro-RO",
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  it: "it-IT",
  hu: "hu-HU",
};

function HistoryPage() {
  const { t } = useTranslation();
  const starter = useActiveStarter();
  const language = useSettingsStore((state) => state.language);
  const weightUnit = useSettingsStore((state) => state.weightUnit);
  const history = starter.history || [];
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  const locale = LOCALE_MAP[language] || LOCALE_MAP.ro;
  const todayStr = new Date().toDateString();
  const sorted = [...history].sort((a, b) => b.time - a.time);
  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <div className="section">
      <h2 className="section-title">{t("historyTitle")}</h2>
      <div
        style={{
          fontSize: "12px",
          color: "var(--text-muted)",
          marginBottom: "12px",
          textAlign: "right",
        }}
      >
        {sorted.length} {t("historyTotalFeedings", { count: sorted.length })}
      </div>
      <div id="history-list">
        {visible.map((entry, i) => {
          const d = new Date(entry.time);
          let label = d.toLocaleDateString(locale, { day: "numeric", month: "short" });
          if (d.toDateString() === todayStr) label = t("today");
          const time = d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
          const tempLabel = entry.temp != null
            ? `${entry.temp}°${(entry.tempUnit || "c").toUpperCase()}`
            : null;
          const hasObs = entry.riseLevel || entry.bubbleActivity || entry.aroma;
          return (
            <div
              key={`${entry.time}-${i}`}
              className="history-item"
              style={{ flexDirection: "column", alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <span className="history-time">{`${label}, ${time}`}</span>
                <span className="history-amount" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {formatWeight(entry.amount, weightUnit)}
                  {entry.withBran ? (
                    <Icon name="sprout" size={13} style={{ color: "var(--accent)" }} />
                  ) : null}
                  {tempLabel ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "2px", fontSize: "11px", color: "var(--text-muted)" }}>
                      <Icon name="thermometer" size={12} />
                      {tempLabel}
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
                    marginTop: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%",
                  }}
                >
                  <Icon name="note" size={11} />
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.note}</span>
                </div>
              ) : null}
              {hasObs ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginTop: "6px",
                  }}
                >
                  {entry.riseLevel ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        fontSize: "11px",
                        background: "var(--bg-secondary)",
                        borderRadius: "8px",
                        padding: "2px 7px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Icon name={RISE_ICON} size={11} /> {t(`rise_${entry.riseLevel}`)}
                    </span>
                  ) : null}
                  {entry.bubbleActivity ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        fontSize: "11px",
                        background: "var(--bg-secondary)",
                        borderRadius: "8px",
                        padding: "2px 7px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Icon name={BUBBLE_ICON} size={11} /> {t(`bubble_${entry.bubbleActivity}`)}
                    </span>
                  ) : null}
                  {entry.aroma ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        fontSize: "11px",
                        background: "var(--bg-secondary)",
                        borderRadius: "8px",
                        padding: "2px 7px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Icon name={AROMA_ICON} size={11} /> {t(`aroma_${entry.aroma}`)}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          style={{
            width: "100%",
            marginTop: "16px",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          {t("historyShowMore", { count: Math.min(PAGE_SIZE, sorted.length - visibleCount) })}
        </button>
      )}
    </div>
  );
}

export default HistoryPage;
