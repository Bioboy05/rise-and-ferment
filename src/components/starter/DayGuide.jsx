import { useTranslation } from "react-i18next";
import useStarterStore from "../../store/useStarterStore";
import useActiveStarter from "../../hooks/useActiveStarter";
import dayGuides from "../../data/dayGuides";
import Icon from "../common/Icon";

function DayGuide() {
  const { t } = useTranslation();
  const updateStarter = useStarterStore((s) => s.updateStarter);
  const completeDay = useStarterStore((s) => s.completeDay);
  const starter = useActiveStarter();

  const currentDay = starter.currentDay;
  const previewingDay = starter.previewingDay;
  const displayDay = previewingDay ?? currentDay;
  const isPreviewing = previewingDay !== null && previewingDay !== currentDay;

  // After day 14, show congratulations
  if (currentDay > 14) {
    return (
      <div className="card text-center" style={{ padding: "24px 20px" }}>
        <Icon name="star" size={36} style={{ color: "var(--accent)", marginBottom: "8px" }} />
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "8px" }}>
          {t("congratsTitle")}
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5" }}>
          {t("congratsDesc")}
        </p>
      </div>
    );
  }

  const guide = dayGuides.find((g) => g.day === displayDay);
  if (!guide) return null;

  const handlePreview = (day) => {
    if (day >= 1 && day <= 14) {
      updateStarter(starter.id, { previewingDay: day === currentDay ? null : day });
    }
  };

  const handleComplete = () => {
    completeDay(starter.id);
  };

  const handleBackToCurrent = () => {
    updateStarter(starter.id, { previewingDay: null });
  };

  return (
    <div className="card" style={{ padding: "20px 16px" }}>
      {/* Progress dots */}
      <div
        className="flex items-center justify-center gap-1.5 mb-4"
        style={{ flexWrap: "wrap" }}
      >
        {dayGuides.map((g) => {
          const isCompleted = g.day < currentDay;
          const isCurrent = g.day === currentDay;
          const isDisplayed = g.day === displayDay;
          return (
            <button
              key={g.day}
              onClick={() => handlePreview(g.day)}
              aria-label={`${t("dayLabel")} ${g.day}`}
              style={{
                width: isDisplayed ? "28px" : "10px",
                height: "10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: isCompleted
                  ? "var(--accent)"
                  : isCurrent
                    ? "var(--accent)"
                    : "var(--bg-tertiary)",
                opacity: isCompleted || isCurrent ? 1 : 0.5,
              }}
            />
          );
        })}
      </div>

      {/* Preview mode indicator */}
      {isPreviewing && (
        <button
          onClick={handleBackToCurrent}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            width: "100%",
            padding: "8px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1px dashed var(--border)",
            background: "var(--accent-light)",
            color: "var(--accent)",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          <Icon name="chevron-left" size={14} />
          {t("backToCurrent")}
        </button>
      )}

      {/* Day instruction card */}
      <div className="flex items-start gap-3">
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "var(--accent-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name={guide.icon} size={20} style={{ color: "var(--accent)" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--accent)" }}>
              {t("dayLabel")} {displayDay}
            </span>
          </div>
          <h3 style={{ fontWeight: "700", fontSize: "15px", marginBottom: "6px" }}>
            {t(guide.titleKey)}
          </h3>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              lineHeight: "1.5",
              whiteSpace: "pre-line",
            }}
          >
            {t(guide.contentKey)}
          </p>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => handlePreview(displayDay - 1)}
          disabled={displayDay <= 1}
          aria-label={t("goBack")}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            cursor: displayDay <= 1 ? "default" : "pointer",
            opacity: displayDay <= 1 ? 0.3 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <Icon name="chevron-left" size={16} />
        </button>

        {/* Complete button — only when viewing current day and not yet completed */}
        {!isPreviewing && !starter.todayCompleted && (
          <button
            onClick={handleComplete}
            className="btn-primary"
            style={{ width: "auto", padding: "10px 24px", fontSize: "14px" }}
          >
            {t("doneForToday")}
          </button>
        )}

        {!isPreviewing && starter.todayCompleted && (
          <span style={{ color: "var(--success)", fontWeight: "600", fontSize: "14px" }}>
            <Icon name="check" size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
            {t("feedDone")}
          </span>
        )}

        {isPreviewing && <div />}

        <button
          onClick={() => handlePreview(displayDay + 1)}
          disabled={displayDay >= 14}
          aria-label={t("nextDay")}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            cursor: displayDay >= 14 ? "default" : "pointer",
            opacity: displayDay >= 14 ? 0.3 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
    </div>
  );
}

export default DayGuide;
