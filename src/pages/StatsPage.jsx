import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useActiveStarter from "../hooks/useActiveStarter";
import useStreak from "../hooks/useStreak";

const dayKeys = ["daySun", "dayMon", "dayTue", "dayWed", "dayThu", "dayFri", "daySat"];

function getLast14DaysActivity(history) {
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const count = history.filter((h) => h.time >= date.getTime() && h.time < nextDay.getTime()).length;
    days.push({ date, count });
  }
  return days;
}

function getTempData(history) {
  return history
    .filter((h) => Number.isFinite(h?.time) && h.temp != null)
    .sort((a, b) => b.time - a.time)
    .slice(0, 14)
    .reverse();
}

function getWeeklyPattern(history) {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  history.forEach((h) => {
    if (!Number.isFinite(h?.time)) return;
    counts[new Date(h.time).getDay()]++;
  });
  return counts;
}

function StatsPage() {
  const { t } = useTranslation();
  const starter = useActiveStarter();
  const streak = useStreak();
  const history = starter.history || [];
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const totalFeedings = history.length;
  const tempsWithValue = history.filter((e) => e.temp != null);
  const avgTemp =
    tempsWithValue.length > 0
      ? (tempsWithValue.reduce((s, e) => s + e.temp, 0) / tempsWithValue.length).toFixed(1)
      : null;
  const ageDays = starter.createdAt
    ? Math.floor((nowMs - new Date(starter.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : history[0]
      ? Math.floor((nowMs - new Date(history[0].time).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  const activity = getLast14DaysActivity(history);
  const maxActivity = Math.max(...activity.map((d) => d.count), 1);

  const tempData = getTempData(history);
  const tempMin = tempData.length > 0 ? Math.min(...tempData.map((d) => d.temp)) - 2 : 0;
  const tempMax = tempData.length > 0 ? Math.max(...tempData.map((d) => d.temp)) + 2 : 1;
  const tempRange = tempMax - tempMin || 1;

  const weeklyPattern = getWeeklyPattern(history);
  const maxWeekly = Math.max(...weeklyPattern, 1);

  return (
    <div className="section">
      <h2 className="section-title">{t("statsTitle")}</h2>

      <div className="stats-grid">
        <div className="stat-mini">
          <div className="stat-mini-value">{totalFeedings}</div>
          <div className="stat-mini-label">{t("totalFeedings")}</div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-value">{streak}</div>
          <div className="stat-mini-label">{t("currentStreak")}</div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-value">{avgTemp ? `${avgTemp}°` : "--"}</div>
          <div className="stat-mini-label">{t("avgTemp")}</div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-value">{ageDays}</div>
          <div className="stat-mini-label">{t("starterAge")}</div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-title">
          📈 <span>{t("activityChart")}</span>
        </div>
        <div
          id="activity-chart"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            height: "100px",
            gap: "4px",
            paddingTop: "8px",
          }}
        >
          {activity.map((d, i) => {
            const height = (d.count / maxActivity) * 100;
            const isToday = i === activity.length - 1;
            return (
              <div
                key={`${d.date.toDateString()}-${d.count}`}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  className={`chart-bar ${d.count > 0 ? "active" : ""}`}
                  style={{ width: "100%", height: `${Math.max(height, 8)}%` }}
                />
                <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                  {isToday ? t("today") : d.date.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-title">
          🌡️ <span>{t("tempChart")}</span>
        </div>
        <div id="temp-chart" style={{ height: "80px", position: "relative" }}>
          <div
            id="temp-chart-content"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              height: "100%",
              gap: "4px",
            }}
          >
            {tempData.length < 2 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  width: "100%",
                  padding: "20px 0",
                }}
              >
                {t("tempHint")}
              </p>
            ) : (
              tempData.map((d, idx) => {
                const height = ((d.temp - tempMin) / tempRange) * 100;
                return (
                  <div
                    key={`${d.time}-${idx}`}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span style={{ fontSize: "9px", color: "var(--accent)" }}>
                      {d.temp}°
                    </span>
                    <div
                      style={{
                        width: "100%",
                        background: "var(--accent)",
                        borderRadius: "4px",
                        height: `${height}%`,
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
        <p
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            textAlign: "center",
            marginTop: "8px",
          }}
        >
          {t("tempHint")}
        </p>
      </div>

      <div className="chart-card">
        <div className="chart-title">
          📅 <span>{t("weeklyPattern")}</span>
        </div>
        <div id="weekly-pattern" style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
          {weeklyPattern.map((count, i) => {
            const height = (count / maxWeekly) * 60;
            return (
              <div key={`week-${i}`} style={{ flex: 1, textAlign: "center" }}>
                <div
                  style={{
                    height: "60px",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "30px",
                      height: `${Math.max(height, 4)}px`,
                      background: "var(--accent)",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {t(dayKeys[i]).slice(0, 1)}
                </span>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
