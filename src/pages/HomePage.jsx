import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useStarterStore from "../store/useStarterStore";
import useSettingsStore from "../store/useSettingsStore";
import useStreak from "../hooks/useStreak";
import useActiveStarter from "../hooks/useActiveStarter";
import useStarterStatus from "../hooks/useStarterStatus";
import FeedingModal from "../components/feeding/FeedingModal";
import dailyTasks from "../data/dailyTasks";
import dayGuides from "../data/dayGuides";
import { getDailyQuote, getStreakQuote } from "../data/dailyQuotes";
import troubleshooting from "../data/troubleshooting";
import Modal from "../components/common/Modal";
import JarIllustration from "../components/common/JarIllustration";
import WheatDecoration from "../components/common/WheatDecoration";
import { formatTimeAgo } from "../utils/dateHelpers";
import { sanitizeLimitedHtml } from "../utils/sanitizeHtml";

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const updateStarter = useStarterStore((state) => state.updateStarter);
  const completeDay = useStarterStore((state) => state.completeDay);
  const starter = useActiveStarter();
  const streak = useStreak();
  const beginnerMode = useSettingsStore((s) => s.beginnerMode);

  const [taskFeedModal, setTaskFeedModal] = useState(false);
  const [troubleOpen, setTroubleOpen] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const displayDay = starter.previewingDay ?? starter.currentDay;
  const isPreview = starter.previewingDay !== null && starter.previewingDay !== starter.currentDay;

  const dayTask = dailyTasks[displayDay] || null;
  const dayGuide = dayGuides.find((guide) => guide.day === displayDay) || null;
  const dayGuidePreview = dayGuide ? t(dayGuide.contentKey).split("\n")[0] : null;

  const progressText = useMemo(() => {
    if (isPreview) return `${t("progressInstructions")} ${displayDay}`;
    if (displayDay < 3) return t("progressBacteria");
    if (displayDay < 5) return t("progressGrowing");
    if (displayDay >= 7) return t("progressReady");
    return t("progressGrowing");
  }, [displayDay, isPreview, t]);

  const motivationalKey = useMemo(() => {
    if (isPreview) return null;
    const streakKey = getStreakQuote(streak);
    if (streakKey) return streakKey;
    if (starter.isNewStarter) return getDailyQuote(displayDay);
    return null;
  }, [displayDay, isPreview, starter.isNewStarter, streak]);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!starter.lastCompletedDate || !starter.todayCompleted) return;
    const today = new Date().toDateString();
    if (starter.lastCompletedDate !== today) {
      updateStarter(starter.id, { todayCompleted: false });
    }
  }, [starter.id, starter.lastCompletedDate, starter.todayCompleted, updateStarter]);

  const goToDay = (day) => {
    updateStarter(starter.id, { previewingDay: day });
  };

  const previewDay = (delta) => {
    const next = Math.min(14, Math.max(1, displayDay + delta));
    goToDay(next);
  };

  const backToCurrentDay = () => {
    updateStarter(starter.id, { previewingDay: null });
  };

  const handleTaskAction = () => {
    if (starter.todayCompleted || isPreview) return;
    if (dayTask?.action === "learn") {
      navigate("/recipes");
    }
    completeDay(starter.id);
  };

  const showDayGuide = starter.isNewStarter && starter.currentDay <= 14;
  const showDailyTask = starter.isNewStarter && starter.currentDay <= 14;

  const hoursSince = starter.lastFed ? Math.floor((nowMs - starter.lastFed) / (1000 * 60 * 60)) : null;
  const isUrgent = hoursSince !== null && hoursSince > 24;

  const status = useStarterStatus(nowMs);


  const ageDays = starter.createdAt ? Math.floor((nowMs - starter.createdAt) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div>
      {starter.isNewStarter && (
        <>
          <div className="main-card parchment-card">
            <WheatDecoration side="left" />
            <WheatDecoration side="right" />
            <JarIllustration />
            <div className="status-main">
              {dayTask ? t(dayTask.titleKey) : dayGuide ? t(dayGuide.titleKey) : t("statusWelcome")}
            </div>
            <div className="status-sub">
              {dayTask ? t(dayTask.taskKey) : dayGuidePreview || t("statusWelcomeSub")}
            </div>
          </div>

          {motivationalKey && (
            <div className="motivational-card">
              <span className="motivational-text">{t(motivationalKey)}</span>
            </div>
          )}

          {showDayGuide && (
            <div className="day-tracker">
              <div className="day-nav">
                <button type="button" className="day-nav-btn" onClick={() => previewDay(-1)} disabled={displayDay <= 1}>
                  ‹
                </button>
                <div className="day-center">
                  <div className="day-label">{t("dayLabel")}</div>
                  <div className="day-number">{displayDay}</div>
                </div>
                <button
                  type="button"
                  className="day-nav-btn"
                  onClick={() => previewDay(1)}
                  disabled={displayDay >= 14}
                >
                  ›
                </button>
              </div>
              <div className="day-progress">{progressText}</div>
              <div className="day-dots">
                {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => {
                  let cls = "";
                  if (isPreview && day === displayDay) cls = "previewing";
                  else if (day < starter.currentDay) cls = "done";
                  else if (day === starter.currentDay && starter.todayCompleted) cls = "done";
                  else if (day === starter.currentDay) cls = "current";
                  return (
                    <button
                      type="button"
                      key={day}
                      className={`day-dot ${cls}`}
                      onClick={() => goToDay(day)}
                      aria-label={`${t("dayLabel")} ${day}`}
                    />
                  );
                })}
              </div>
              {isPreview && (
                <div className="preview-indicator">
                  <span>{t("previewMode")}</span>
                  <button type="button" className="back-to-current" onClick={backToCurrentDay}>
                    {t("backToCurrent")}
                  </button>
                </div>
              )}
            </div>
          )}

          {showDailyTask && (
            <div className="task-card">
              <div className="task-title">📋 {t("todayTask")}</div>
              <div
                className="task-content"
                dangerouslySetInnerHTML={{
                  __html: sanitizeLimitedHtml(t(dayTask?.contentKey || dayGuide?.contentKey || ""), {
                    convertNewlines: true,
                  }),
                }}
              />
              {!isPreview && (
                <button
                  type="button"
                  className={`task-action-btn ${starter.todayCompleted ? "success" : ""}`}
                  onClick={handleTaskAction}
                  disabled={starter.todayCompleted}
                >
                  {starter.todayCompleted ? t("doneForToday") : dayTask ? t(dayTask.actionKey) : t("feedButton")}
                </button>
              )}
            </div>
          )}

          {displayDay >= 3 && !isPreview && (
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

      {!starter.isNewStarter && (
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
