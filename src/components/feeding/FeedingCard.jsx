import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useStarterStore from "../../store/useStarterStore";
import { getTimeSince } from "../../utils/dateHelpers";
import FeedingModal from "./FeedingModal";
import Icon from "../common/Icon";

function FeedingCard() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [justFed, setJustFed] = useState(false);
  const [now, setNow] = useState(Date.now);

  const getActiveStarter = useStarterStore((state) => state.getActiveStarter);
  const starter = getActiveStarter();

  // Update "now" every minute so time display stays fresh
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const timeSince = getTimeSince(starter.lastFed, now);
  const hoursSinceLastFed = starter.lastFed
    ? (now - starter.lastFed) / (1000 * 60 * 60)
    : null;
  const isUrgent = hoursSinceLastFed !== null && hoursSinceLastFed > 24;

  const handleModalClose = () => {
    setModalOpen(false);
    setNow(Date.now());
    // Check if a feeding was just added
    const updated = getActiveStarter();
    if (updated.lastFed !== starter.lastFed) {
      setJustFed(true);
      setTimeout(() => setJustFed(false), 3000);
    }
  };

  return (
    <>
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 2px 12px var(--shadow)",
          border: isUrgent
            ? "2px solid var(--warning)"
            : "1px solid var(--border)",
        }}
      >
        {/* Urgent alert */}
        {isUrgent && (
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--warning), #ff8a50)",
              color: "white",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "16px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <Icon name="clock" size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />{t("notFedFor", { hours: Math.floor(hoursSinceLastFed) })}
          </div>
        )}

        {/* Status row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "4px",
              }}
            >
              {t("lastFed")}
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: isUrgent ? "var(--warning)" : "var(--text-primary)",
              }}
            >
              {timeSince ?? t("noFeedingsYet")}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginBottom: "4px",
              }}
            >
              {t("totalFeedings")}
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "var(--accent)",
              }}
            >
              {starter.history.length}
            </div>
          </div>
        </div>

        {/* Feed button */}
        <button
          onClick={() => setModalOpen(true)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            background: justFed
              ? "var(--success)"
              : isUrgent
                ? "linear-gradient(135deg, var(--warning), #ff8a50)"
                : "var(--accent)",
            color: "white",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          {justFed ? t("feedDone") : isUrgent ? t("feedNow") : t("feedButton")}
        </button>
      </div>

      {modalOpen && <FeedingModal onClose={handleModalClose} />}
    </>
  );
}

export default FeedingCard;
