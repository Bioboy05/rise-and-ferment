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
      {isUrgent && (
        <div className="urgent-alert">
          <div className="urgent-alert-content">
            <span className="urgent-icon">!</span>
            <div className="urgent-text">
              <div className="urgent-title">{t("urgentTitle")}</div>
              <div className="urgent-subtitle">
                {t("notFedFor", { hours: Math.floor(hoursSinceLastFed) })}
              </div>
            </div>
            <button className="urgent-btn" onClick={() => setModalOpen(true)}>
              {t("feedNow")}
            </button>
          </div>
        </div>
      )}

      <div className="main-card">
        <div className="status-main">
          {timeSince ?? t("noFeedingsYet")}
        </div>
        <div className={`status-sub ${isUrgent ? "urgent" : "good"}`}>
          {isUrgent ? t("urgentTitle") : t("lastFed")}
        </div>
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className={`main-btn ${justFed ? "success" : isUrgent ? "urgent" : ""}`}
      >
        {justFed ? t("feedDone") : isUrgent ? t("feedNow") : t("feedButton")}
      </button>

      {modalOpen && <FeedingModal onClose={handleModalClose} />}
    </>
  );
}

export default FeedingCard;
