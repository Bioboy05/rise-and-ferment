import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useStarterStore from "../store/useStarterStore";
import useSettingsStore from "../store/useSettingsStore";
import useStreak from "../hooks/useStreak";
import useActiveStarter from "../hooks/useActiveStarter";
import useStarterStatus from "../hooks/useStarterStatus";
import FeedingModal from "../components/feeding/FeedingModal";
import { MILESTONES, getMilestoneById } from "../data/milestones";
import { getDailyQuote, getStreakQuote } from "../data/dailyQuotes";
import troubleshooting from "../data/troubleshooting";
import Modal from "../components/common/Modal";
import JarIllustration from "../components/common/JarIllustration";
import WheatDecoration from "../components/common/WheatDecoration";
import { formatTimeAgo } from "../utils/dateHelpers";

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const updateStarter = useStarterStore((state) => state.updateStarter);
  const completeMilestone = useStarterStore((state) => state.completeMilestone);
  const starter = useActiveStarter();
  const streak = useStreak();
  const beginnerMode = useSettingsStore((s) => s.beginnerMode);

  const [taskFeedModal, setTaskFeedModal] = useState(false);
  const [troubleOpen, setTroubleOpen] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const displayMilestoneId = starter.previewingMilestoneId ?? starter.currentMilestoneId;
  const isPreview =
    starter.previewingMilestoneId !== null &&
    starter.previewingMilestoneId !== starter.currentMilestoneId;

  const currentMilestone = getMilestoneById(displayMilestoneId) || MILESTONES[0];
  const currentMilestoneIndex = MILESTONES.findIndex((m) => m.id === starter.currentMilestoneId);
  const displayMilestoneIndex = MILESTONES.findIndex((m) => m.id === displayMilestoneId);

  const progressText = useMemo(() => {
    if (isPreview) return t("milestonePreview");
    return t(currentMilestone.descKey);
  }, [isPreview, currentMilestone, t]);

  const motivationalKey = useMemo(() => {
    if (isPreview) return null;
    const streakKey = getStreakQuote(streak);
    if (streakKey) return streakKey;
    if (starter.guidedMode === "new") return getDailyQuote(starter.currentDay);
    return null;
  }, [isPreview, starter.guidedMode, starter.currentDay, streak]);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const goToMilestone = (milestoneId) => {
    updateStarter(starter.id, { previewingMilestoneId: milestoneId });
  };

  const backToCurrentMilestone = () => {
    updateStarter(starter.id, { previewingMilestoneId: null });
  };

  const handleMilestoneComplete = () => {
    if (starter.milestoneCompleted || isPreview) return;
    completeMilestone(starter.id, starter.currentMilestoneId);
  };

  const isGuidedMode = starter.guidedMode === "new" || starter.guidedMode === "reactivation";

  const hoursSince = starter.lastFed ? Math.floor((nowMs - starter.lastFed) / (1000 * 60 * 60)) : null;
  const isUrgent = hoursSince !== null && hoursSince > 24;

  const status = useStarterStatus(nowMs);

  const ageDays = starter.createdAt ? Math.floor((nowMs - starter.createdAt) / (1000 * 60 * 60 * 24)) : 0;

  // Check if current milestone was already completed in history
  const isMilestoneAlreadyDone = starter.milestoneHistory?.some(
    (entry) => entry.id === starter.currentMilestoneId
  );

  return (
    <div>
      {isGuidedMode && (
        <>
          <div className="main-card parchment-card">
            <WheatDecoration side="left" />
            <WheatDecoration side="right" />
            <JarIllustration />
            <div className="status-main">
              {currentMilestone.emoji} {t(currentMilestone.titleKey)}
            </div>
            <div className="status-sub">
              {t(currentMilestone.taskKey)}
            </div>
          </div>

          {motivationalKey && (
            <div className="motivational-card">
              <span className="motivational-text">{t(motivationalKey)}</span>
            </div>
          )}

          {/* Milestone Timeline */}
          <div className="day-tracker" id="milestone-timeline">
            <div className="day-progress">{t("milestoneTimeline")}</div>
            <div className="milestone-steps">
              {MILESTONES.map((milestone, index) => {
                const isCompleted = index < currentMilestoneIndex ||
                  (index === currentMilestoneIndex && isMilestoneAlreadyDone);
                const isCurrent = index === currentMilestoneIndex && !isMilestoneAlreadyDone;
                const isPreviewing = isPreview && milestone.id === displayMilestoneId;

                let cls = "milestone-step";
                if (isPreviewing) cls += " previewing";
                else if (isCompleted) cls += " done";
                else if (isCurrent) cls += " current";

                return (
                  <button
                    type="button"
                    key={milestone.id}
                    className={cls}
                    onClick={() => goToMilestone(milestone.id)}
                    aria-label={t(milestone.titleKey)}
                    title={t(milestone.titleKey)}
                  >
                    <span className="milestone-emoji">{milestone.emoji}</span>
                    <span className="milestone-step-label">{t(milestone.titleKey)}</span>
                    {isCompleted && <span className="milestone-check">✓</span>}
                  </button>
                );
              })}
            </div>
            <div className="day-progress" style={{ fontSize: "0.8em", opacity: 0.7 }}>
              {t("milestoneTypicalDays", { days: currentMilestone.typicalDays })}
            </div>
            {isPreview && (
              <div className="preview-indicator">
                <span>{t("milestonePreview")}</span>
                <button type="button" className="back-to-current" onClick={backToCurrentMilestone}>
                  {t("milestoneBackToCurrent")}
                </button>
              </div>
            )}
          </div>

          {/* Milestone Task Card */}
          <div className="task-card">
            <div className="task-title">📋 {t(currentMilestone.taskKey)}</div>
            <div className="task-content">
              {t(currentMilestone.tipKey)}
            </div>
            {!isPreview && (
              <button
                type="button"
                className={`task-action-btn ${isMilestoneAlreadyDone ? "success" : ""}`}
                onClick={handleMilestoneComplete}
                disabled={isMilestoneAlreadyDone}
              >
                {isMilestoneAlreadyDone ? t("doneForToday") : t("milestoneCompleteBtn")}
              </button>
            )}
          </div>

          {displayMilestoneIndex >= 1 && !isPreview && (
            <button type="button" className="secondary-btn" onClick={() => setTroubleOpen(true)}>
              {t("notGrowing")}
            </button>
          )}

          {troubleOpen && (
            <Modal onClose={() => setTroubleOpen(false)} title={t("troubleTitle")}>
              <div className="tip-box warning">{t(troubleshooting.introKey)}</div>

              <div className="tip-box tip-box-normal">
                <strong>✅ {t("whatsNormal")}</strong>
                <div className="trouble-list">
                  {troubleshooting.normal.map((item) => (
                    <div key={item.id} className="trouble-item">
                      {t(item.descKey)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="tip-box">
                <strong>🔧 {t("checkLabel")}</strong>
                <div className="trouble-list">
                  {troubleshooting.checks.map((item) => (
                    <div key={item.id} className="trouble-item">
                      <span className="trouble-emoji">{item.icon}</span>
                      <span className="trouble-title">{t(item.titleKey)}</span>
                      <span className="trouble-sep"> - </span>
                      <span className="trouble-desc">{t(item.descKey)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tip-box tip-box-warning">
                <strong>🆘 {t("commonIssues")}</strong>
                <div className="trouble-list">
                  {troubleshooting.common.map((item) => (
                    <div key={item.id} className="trouble-item">
                      <span className="trouble-emoji">{item.icon}</span>
                      <span className="trouble-title">{t(item.titleKey)}</span>
                      <div className="trouble-sub">{t(item.descKey)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tip-box tip-box-danger">
                <strong>⚠️ {t("seriousIssues")}</strong>
                <div className="trouble-list">
                  {troubleshooting.serious.map((item) => (
                    <div key={item.id} className="trouble-item">
                      <span className="trouble-emoji">{item.icon}</span>
                      <span className="trouble-title">{t(item.titleKey)}</span>
                      <div className="trouble-sub">{t(item.descKey)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tip-box success trouble-encourage">
                <span className="trouble-encourage-emoji">💪</span>
                <span>{t("encourageAfterTrouble")}</span>
              </div>

              <button type="button" className="btn btn-primary" onClick={() => setTroubleOpen(false)}>
                {t("understood")}
              </button>
            </Modal>
          )}
        </>
      )}

      {!isGuidedMode && (
        <>
          {isUrgent && (
            <div className="urgent-alert">
              <div className="urgent-alert-content">
                <span className="urgent-icon">🚨</span>
                <div className="urgent-text">
                  <div className="urgent-title">{t("urgentTitle")}</div>
                  <div className="urgent-subtitle">
                    {t("notFedFor", { hours: hoursSince })}
                  </div>
                </div>
                <button type="button" className="urgent-btn" onClick={() => setTaskFeedModal(true)}>
                  {t("feedNow")}
                </button>
              </div>
            </div>
          )}

          <div className="main-card parchment-card">
            <WheatDecoration side="left" />
            <WheatDecoration side="right" />
            <JarIllustration />

            <div className="status-main">{status.main}</div>
            <div className={`status-sub ${status.cls}`}>{status.sub}</div>
          </div>

          {motivationalKey && (
            <div className="motivational-card">
              <span className="motivational-text">{t(motivationalKey)}</span>
            </div>
          )}

          <button
            type="button"
            className={`main-btn ${status.cls === "urgent" ? "urgent" : ""}`}
            onClick={() => setTaskFeedModal(true)}
          >
            {t("feedNow")}
          </button>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">
                {starter.lastFed ? formatTimeAgo(starter.lastFed, t) : t("noFeedingsYet")}
              </div>
              <div className="stat-label">{t("lastFed")}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{ageDays}</div>
              <div className="stat-label">{t("daysOld")}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{starter.history.length}</div>
              <div className="stat-label">{t("totalFeedings")}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{streak > 0 ? `${streak} 🔥` : "0"}</div>
              <div className="stat-label">{t("streak")}</div>
            </div>
          </div>

          <div className="info-card" style={{ display: "flex" }}>
            <span className="info-label">🌡️ {t("tempIdeal")}</span>
          </div>

          {taskFeedModal && <FeedingModal onClose={() => setTaskFeedModal(false)} />}
        </>
      )}
    </div>
  );
}

export default HomePage;
