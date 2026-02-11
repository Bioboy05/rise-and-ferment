import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useStarterStore from "../store/useStarterStore";
import useSettingsStore from "../store/useSettingsStore";
import useStreak from "../hooks/useStreak";
import FeedingModal from "../components/feeding/FeedingModal";
import dailyTasks from "../data/dailyTasks";
import { getDailyQuote, getStreakQuote } from "../data/dailyQuotes";
import troubleshooting from "../data/troubleshooting";
import Modal from "../components/common/Modal";
import { formatTimeAgo } from "../utils/dateHelpers";

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const getActiveStarter = useStarterStore((state) => state.getActiveStarter);
  const updateStarter = useStarterStore((state) => state.updateStarter);
  const completeDay = useStarterStore((state) => state.completeDay);
  const starter = getActiveStarter();
  const streak = useStreak();
  const beginnerMode = useSettingsStore((s) => s.beginnerMode);

  const [taskFeedModal, setTaskFeedModal] = useState(false);
  const [troubleOpen, setTroubleOpen] = useState(false);

  const displayDay = starter.previewingDay ?? starter.currentDay;
  const isPreview = starter.previewingDay !== null && starter.previewingDay !== starter.currentDay;

  const dayTask = dailyTasks[displayDay] || null;

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
    if (!starter.lastCompletedDate) return;
    const today = new Date().toDateString();
    if (starter.lastCompletedDate !== today) {
      const updates = { todayCompleted: false };
      if (starter.isNewStarter && starter.currentDay < 7) {
        updates.currentDay = starter.currentDay + 1;
      }
      updateStarter(starter.id, updates);
    }
  }, [starter, updateStarter]);

  const goToDay = (day) => {
    updateStarter(starter.id, { previewingDay: day });
  };

  const previewDay = (delta) => {
    const next = Math.min(7, Math.max(1, displayDay + delta));
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
  const showDailyTask = starter.isNewStarter && starter.currentDay <= 7;

  const hoursSince = starter.lastFed
    ? Math.floor((Date.now() - starter.lastFed) / (1000 * 60 * 60))
    : null;
  const isUrgent = hoursSince !== null && hoursSince > 24;

  const status = useMemo(() => {
    if (hoursSince === null) {
      return { main: t("statusWelcome"), sub: t("statusWelcomeSub"), cls: "good" };
    }
    if (hoursSince >= 4 && hoursSince <= 8) {
      return beginnerMode
        ? { main: t("pmcSimple"), sub: t("pmcSimpleDesc"), cls: "good" }
        : { main: t("statusPMC"), sub: t("statusPMCSub"), cls: "good" };
    }
    if (hoursSince > 8 && hoursSince <= 10) {
      return { main: t("statusPostPeak"), sub: t("statusPostPeakSub"), cls: "good" };
    }
    if (hoursSince < 4) {
      const remaining = Math.max(0, 6 - hoursSince);
      return { main: t("statusGrowing"), sub: t("statusGrowingSub", { h: remaining }), cls: "" };
    }
    return { main: t("statusHungry"), sub: t("statusHungrySub"), cls: "urgent" };
  }, [hoursSince, beginnerMode, t]);

  const ageDays = starter.createdAt
    ? Math.floor((Date.now() - starter.createdAt) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div>
      {starter.isNewStarter && (
        <>
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
            <div className="status-main">{dayTask ? t(dayTask.titleKey) : t("statusWelcome")}</div>
            <div className="status-sub">{dayTask ? t(dayTask.taskKey) : t("statusWelcomeSub")}</div>
          </div>

          {motivationalKey && (
            <div className="motivational-card">
              <span className="motivational-text">{t(motivationalKey)}</span>
            </div>
          )}

          {showDayGuide && (
            <div className="day-tracker">
              <div className="day-nav">
                <button className="day-nav-btn" onClick={() => previewDay(-1)} disabled={displayDay <= 1}>
                  ‹
                </button>
                <div className="day-center">
                  <div className="day-label">{t("dayLabel")}</div>
                  <div className="day-number">{displayDay}</div>
                </div>
                <button className="day-nav-btn" onClick={() => previewDay(1)} disabled={displayDay >= 7}>
                  ›
                </button>
              </div>
              <div className="day-progress">{progressText}</div>
              <div className="day-dots">
                {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => {
                  let cls = "";
                  if (isPreview && day === displayDay) cls = "previewing";
                  else if (day < starter.currentDay) cls = "done";
                  else if (day === starter.currentDay && starter.todayCompleted) cls = "done";
                  else if (day === starter.currentDay) cls = "current";
                  return (
                    <div
                      key={day}
                      className={`day-dot ${cls}`}
                      onClick={() => goToDay(day)}
                    />
                  );
                })}
              </div>
              {isPreview && (
                <div className="preview-indicator">
                  <span>{t("previewMode")}</span>
                  <button className="back-to-current" onClick={backToCurrentDay}>
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
                  __html: dayTask ? t(dayTask.contentKey) : "",
                }}
              />
              {!isPreview && (
                <button
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
            <button className="secondary-btn" onClick={() => setTroubleOpen(true)}>
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

              <button className="btn btn-primary" onClick={() => setTroubleOpen(false)}>
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
                <button className="urgent-btn" onClick={() => setTaskFeedModal(true)}>
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

            <div className="status-main">{status.main}</div>
            <div className={`status-sub ${status.cls}`}>{status.sub}</div>
          </div>

          {motivationalKey && (
            <div className="motivational-card">
              <span className="motivational-text">{t(motivationalKey)}</span>
            </div>
          )}

          <button
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
