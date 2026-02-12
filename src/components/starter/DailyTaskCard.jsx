import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useActiveStarter from "../../hooks/useActiveStarter";
import dailyTasks from "../../data/dailyTasks";
import Icon from "../common/Icon";

const actionIcons = {
  feed: "droplet",
  observe: "target",
  learn: "book",
};

function DailyTaskCard({ onFeed }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const starter = useActiveStarter();

  const day = starter.currentDay;
  const task = dailyTasks[day];

  // Only show for new starters, days 1-7
  if (!starter.isNewStarter || day > 7 || !task) return null;

  const handleAction = () => {
    if (task.action === "feed" && onFeed) {
      onFeed();
    } else if (task.action === "learn") {
      navigate("/recipes");
    }
    // "observe" has no action — informational only
  };

  return (
    <div
      className="card"
      style={{
        padding: "16px",
        border: "1px solid var(--accent-medium)",
        background: "linear-gradient(135deg, var(--bg-card) 0%, var(--accent-light) 100%)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name={actionIcons[task.action] || "target"} size={20} style={{ color: "white" }} />
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "var(--accent)", marginBottom: "2px" }}>
            {t("todayTask")}
          </p>
          <h3 style={{ fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>
            {t(task.titleKey)}
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.4", marginBottom: "10px" }}>
            {t(task.taskKey)}
          </p>

          {task.action !== "observe" && (
            <button
              onClick={handleAction}
              style={{
                padding: "8px 20px",
                borderRadius: "10px",
                border: "none",
                background: "var(--accent)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {t(task.actionKey)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DailyTaskCard;
