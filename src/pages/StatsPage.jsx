import { useTranslation } from "react-i18next";
import useActiveStarter from "../hooks/useActiveStarter";
import useStreak from "../hooks/useStreak";
import Icon from "../components/common/Icon";

const dayKeys = ["daySun", "dayMon", "dayTue", "dayWed", "dayThu", "dayFri", "daySat"];

function getLast14DaysActivity(history) {
  const counts = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = d.toDateString();
    const count = history.filter(
      (e) => new Date(e.time).toDateString() === dateStr
    ).length;
    counts.push({ date: d, count });
  }
  return counts;
}

function getLast14DaysTemp(history) {
  const temps = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateStr = d.toDateString();
    const dayEntries = history.filter(
      (e) => new Date(e.time).toDateString() === dateStr && e.temp != null
    );
    if (dayEntries.length > 0) {
      const avg = dayEntries.reduce((s, e) => s + e.temp, 0) / dayEntries.length;
      temps.push({ date: d, temp: Math.round(avg * 10) / 10 });
    } else {
      temps.push({ date: d, temp: null });
    }
  }
  return temps;
}

function getWeeklyPattern(history) {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const entry of history) {
    counts[new Date(entry.time).getDay()]++;
  }
  return counts;
}

function StatsPage() {
  const { t } = useTranslation();
  const starter = useActiveStarter();
  const streak = useStreak();
  const history = starter.history || [];

  const totalFeedings = history.length;

  if (totalFeedings === 0) {
    return (
      <div className="max-w-md mx-auto">
        <div style={{ textAlign: "center", padding: "48px 20px" }}>
          <Icon name="stats" size={48} style={{ color: "var(--accent)" }} />
          <h2
            style={{
              fontFamily: "Caveat, cursive",
              fontSize: "1.6rem",
              color: "var(--text-primary)",
              marginTop: "16px",
            }}
          >
            {t("statsTitle")}
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "14px",
              marginTop: "12px",
              lineHeight: "1.5",
            }}
          >
            {t("statsEmpty")}
          </p>
        </div>
      </div>
    );
  }

  // Computed data
  const tempsWithValue = history.filter((e) => e.temp != null);
  const avgTemp =
    tempsWithValue.length > 0
      ? (tempsWithValue.reduce((s, e) => s + e.temp, 0) / tempsWithValue.length).toFixed(1)
      : null;

  const ageDays = starter.createdAt
    ? Math.floor((Date.now() - new Date(starter.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : Math.floor((Date.now() - new Date(history[0].time).getTime()) / (1000 * 60 * 60 * 24));

  const activity = getLast14DaysActivity(history);
  const maxActivity = Math.max(...activity.map((d) => d.count), 1);

  const tempData = getLast14DaysTemp(history);
  const tempPoints = tempData.filter((d) => d.temp !== null);

  const weeklyPattern = getWeeklyPattern(history);
  const maxWeekly = Math.max(...weeklyPattern, 1);

  const statCardStyle = {
    background: "var(--bg-card)",
    borderRadius: "12px",
    padding: "12px",
    textAlign: "center",
  };

  const statValueStyle = {
    fontSize: "1.4rem",
    fontWeight: "800",
    color: "var(--accent)",
  };

  const statLabelStyle = {
    fontSize: "11px",
    color: "var(--text-muted)",
    marginTop: "2px",
  };

  return (
    <div className="max-w-md mx-auto" style={{ paddingBottom: "24px" }}>
      <h2
        style={{
          fontFamily: "Caveat, cursive",
          fontSize: "1.8rem",
          color: "var(--text-primary)",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        {t("statsTitle")}
      </h2>

      {/* Quick Stats Grid (2x2) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        <div style={statCardStyle}>
          <div style={statValueStyle}>{totalFeedings}</div>
          <div style={statLabelStyle}>{t("totalFeedings")}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{streak}</div>
          <div style={statLabelStyle}>{t("currentStreak")}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{avgTemp ? `${avgTemp}°` : "—"}</div>
          <div style={statLabelStyle}>{t("avgTemp")}</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{ageDays}</div>
          <div style={statLabelStyle}>{t("starterAge")}</div>
        </div>
      </div>

      {/* Activity Chart (14 days) */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "12px",
          }}
        >
          {t("activityChart")}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "4px",
            height: "80px",
          }}
        >
          {activity.map((day, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${Math.max((day.count / maxActivity) * 100, day.count > 0 ? 10 : 0)}%`,
                  background: day.count > 0 ? "var(--accent)" : "var(--bg-tertiary)",
                  borderRadius: "4px 4px 0 0",
                  minHeight: day.count > 0 ? "4px" : "2px",
                  transition: "height 0.3s",
                }}
              />
              <div
                style={{
                  fontSize: "8px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                {day.date.getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Temperature Chart */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "12px",
          }}
        >
          {t("tempChart")}
        </h3>
        {tempPoints.length < 2 ? (
          <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
            {tempPoints.length === 0 ? t("statsNoTemp") : t("tempHint")}
          </p>
        ) : (
          <div style={{ position: "relative", height: "100px" }}>
            <svg
              viewBox="0 0 280 100"
              style={{ width: "100%", height: "100%" }}
              preserveAspectRatio="none"
            >
              {(() => {
                const validTemps = tempPoints.map((d) => d.temp);
                const minT = Math.min(...validTemps) - 1;
                const maxT = Math.max(...validTemps) + 1;
                const rangeT = maxT - minT || 1;

                // Build points for valid temp entries only
                const points = [];
                tempData.forEach((d, i) => {
                  if (d.temp !== null) {
                    const x = (i / 13) * 270 + 5;
                    const y = 90 - ((d.temp - minT) / rangeT) * 80;
                    points.push(`${x},${y}`);
                  }
                });

                return (
                  <>
                    {/* Fill area */}
                    <polygon
                      points={`${points[0].split(",")[0]},90 ${points.join(" ")} ${points[points.length - 1].split(",")[0]},90`}
                      fill="var(--accent-light)"
                    />
                    {/* Line */}
                    <polyline
                      points={points.join(" ")}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Dots */}
                    {points.map((p, i) => {
                      const [cx, cy] = p.split(",");
                      return (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r="3"
                          fill="var(--accent)"
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        )}
      </div>

      {/* Weekly Pattern */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          padding: "16px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "4px",
          }}
        >
          {t("weeklyPattern")}
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            marginBottom: "12px",
          }}
        >
          {t("weeklyPatternDesc")}
        </p>
        <div
          style={{
            display: "flex",
            gap: "6px",
          }}
        >
          {weeklyPattern.map((count, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: "8px",
                  background: "var(--accent)",
                  opacity: count > 0 ? 0.2 + (count / maxWeekly) * 0.8 : 0.08,
                  marginBottom: "4px",
                }}
              />
              <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                {t(dayKeys[i])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
