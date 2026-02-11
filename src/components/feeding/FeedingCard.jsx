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
            <span className="urgent-icon">🚨</span>
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

      <div className="main-card parchment-card">
        <div className="corner-photo main-card-photo" />
        <svg className="wheat-decoration wheat-left" width="40" height="120" viewBox="0 0 40 120">
          <g fill="var(--accent)">
            <ellipse cx="20" cy="15" rx="6" ry="12" />
            <ellipse cx="12" cy="28" rx="5" ry="10" />
            <ellipse cx="28" cy="28" rx="5" ry="10" />
            <ellipse cx="14" cy="45" rx="4" ry="9" />
            <ellipse cx="26" cy="45" rx="4" ry="9" />
            <ellipse cx="16" cy="60" rx="4" ry="8" />
            <ellipse cx="24" cy="60" rx="4" ry="8" />
            <path d="M20 12 L20 115" stroke="var(--accent)" strokeWidth="2" fill="none" />
          </g>
        </svg>

        <svg className="wheat-decoration wheat-right" width="40" height="120" viewBox="0 0 40 120">
          <g fill="var(--accent)">
            <ellipse cx="20" cy="15" rx="6" ry="12" />
            <ellipse cx="12" cy="28" rx="5" ry="10" />
            <ellipse cx="28" cy="28" rx="5" ry="10" />
            <ellipse cx="14" cy="45" rx="4" ry="9" />
            <ellipse cx="26" cy="45" rx="4" ry="9" />
            <ellipse cx="16" cy="60" rx="4" ry="8" />
            <ellipse cx="24" cy="60" rx="4" ry="8" />
            <path d="M20 12 L20 115" stroke="var(--accent)" strokeWidth="2" fill="none" />
          </g>
        </svg>

        <div className="jar-illustration">
          <svg viewBox="0 0 80 110" fill="none">
            <rect x="15" y="0" width="50" height="12" rx="3" fill="#8B5A2B" />
            <rect x="18" y="2" width="44" height="3" fill="#A67C52" />
            <rect x="12" y="10" width="56" height="6" rx="2" fill="#6B4423" />

            <path
              d="M15 16 L12 100 Q12 108 20 108 L60 108 Q68 108 68 100 L65 16 Z"
              fill="rgba(200, 220, 230, 0.3)"
              stroke="var(--border)"
              strokeWidth="1.5"
            />

            <path
              d="M18 20 L16 95 Q16 98 18 98 L22 98 Q24 98 24 95 L26 20 Z"
              fill="rgba(255,255,255,0.4)"
            />

            <g id="starter-level">
              <path
                d="M16 85 Q25 80 40 82 Q55 84 64 85 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z"
                fill="var(--accent)"
                opacity="0.7"
              >
                <animate
                  attributeName="d"
                  values="M16 85 Q25 80 40 82 Q55 84 64 85 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z;
                          M16 83 Q28 78 40 80 Q52 78 64 83 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z;
                          M16 85 Q25 80 40 82 Q55 84 64 85 L63 100 Q63 105 58 105 L22 105 Q17 105 17 100 Z"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
              <circle cx="25" cy="90" r="2" fill="rgba(255,255,255,0.6)">
                <animate attributeName="cy" values="95;85;95" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="40" cy="92" r="2.5" fill="rgba(255,255,255,0.5)">
                <animate attributeName="cy" values="97;86;97" dur="3.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="55" cy="88" r="1.8" fill="rgba(255,255,255,0.6)">
                <animate attributeName="cy" values="93;83;93" dur="2.8s" repeatCount="indefinite" />
              </circle>
            </g>

            <rect x="10" y="70" width="60" height="3" rx="1" fill="var(--warning)" opacity="0.8" />
          </svg>
        </div>

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
