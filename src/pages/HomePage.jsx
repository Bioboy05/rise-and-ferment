import { useState } from "react";
import { useTranslation } from "react-i18next";
import useStarterStore from "../store/useStarterStore";
import useStreak from "../hooks/useStreak";
import FeedingCard from "../components/feeding/FeedingCard";
import DayGuide from "../components/starter/DayGuide";
import DailyTaskCard from "../components/starter/DailyTaskCard";
import FeedingModal from "../components/feeding/FeedingModal";

function HomePage() {
  const { t } = useTranslation();
  const getActiveStarter = useStarterStore((state) => state.getActiveStarter);
  const starter = getActiveStarter();
  const streak = useStreak();
  const [taskFeedModal, setTaskFeedModal] = useState(false);

  const showDayGuide = starter.isNewStarter && starter.currentDay <= 14;
  const showDailyTask = starter.isNewStarter && starter.currentDay <= 7;

  return (
    <div>
      <div className="text-center" style={{ paddingBottom: "12px" }}>
        <div className="status-sub good">
          {t("dayLabel")} {starter.currentDay} • {t("hydration")}: {starter.hydration}%
        </div>
      </div>

      {showDayGuide && <DayGuide />}
      {showDailyTask && <DailyTaskCard onFeed={() => setTaskFeedModal(true)} />}

      <FeedingCard />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{starter.currentDay}</div>
          <div className="stat-label">{t("dayLabel")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{starter.history.length}</div>
          <div className="stat-label">{t("totalFeedings")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">{t("streak")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{starter.hydration}%</div>
          <div className="stat-label">{t("hydration")}</div>
        </div>
      </div>

      {taskFeedModal && <FeedingModal onClose={() => setTaskFeedModal(false)} />}
    </div>
  );
}

export default HomePage;
