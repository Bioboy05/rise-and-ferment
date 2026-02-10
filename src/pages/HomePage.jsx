import { useState } from "react";
import { useTranslation } from "react-i18next";
import useStarterStore from "../store/useStarterStore";
import FeedingCard from "../components/feeding/FeedingCard";
import DayGuide from "../components/starter/DayGuide";
import DailyTaskCard from "../components/starter/DailyTaskCard";
import FeedingModal from "../components/feeding/FeedingModal";

function HomePage() {
  const { t } = useTranslation();
  const getActiveStarter = useStarterStore((state) => state.getActiveStarter);
  const starter = getActiveStarter();
  const [taskFeedModal, setTaskFeedModal] = useState(false);

  const showDayGuide = starter.isNewStarter && starter.currentDay <= 14;
  const showDailyTask = starter.isNewStarter && starter.currentDay <= 7;

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center py-8">
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}
        >
          {starter.name}
        </h2>
        <p className="mt-2" style={{ color: "var(--text-muted)" }}>
          {t("dayLabel")} {starter.currentDay}
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          {t("hydration")}: {starter.hydration}% • {t("flourLabel")}: {starter.flourType}
        </p>
      </div>

      {showDayGuide && <DayGuide />}
      {showDailyTask && <DailyTaskCard onFeed={() => setTaskFeedModal(true)} />}

      <FeedingCard />

      {taskFeedModal && <FeedingModal onClose={() => setTaskFeedModal(false)} />}
    </div>
  );
}

export default HomePage;
