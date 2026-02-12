import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import useSettingsStore from "../store/useSettingsStore";
import useActiveStarter from "../hooks/useActiveStarter";
import { calculateBreadRecipe } from "../utils/calculations";
import { generateICS } from "../utils/exportHelpers";
import { sanitizeLimitedHtml } from "../utils/sanitizeHtml";

function PlannerPage() {
  const { t } = useTranslation();
  const loaves = useSettingsStore((state) => state.calcLoaves);
  const bakeNotes = useSettingsStore((state) => state.bakeNotes);
  const setCalcLoaves = useSettingsStore((state) => state.setCalcLoaves);
  const setBakeNotes = useSettingsStore((state) => state.setBakeNotes);
  const activeStarter = useActiveStarter();

  const [readyTime, setReadyTime] = useState("12:00");
  const [readyDayOffset, setReadyDayOffset] = useState(0);

  const ingredients = useMemo(() => calculateBreadRecipe(loaves), [loaves]);

  const schedule = useMemo(() => {
    const [rawHours, rawMins] = readyTime.split(":").map(Number);
    const hours = Number.isFinite(rawHours) ? Math.max(0, Math.min(23, rawHours)) : 12;
    const mins = Number.isFinite(rawMins) ? Math.max(0, Math.min(59, rawMins)) : 0;
    const now = new Date();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + Number(readyDayOffset));
    targetDate.setHours(hours, mins, 0, 0);

    const hoursUntilReady = (targetDate - now) / (1000 * 60 * 60);
    const MIN_HOURS = 20;

    const warning =
      hoursUntilReady < MIN_HOURS
        ? t("scheduleNoTime")
        : hoursUntilReady < 26
          ? t("scheduleTight")
          : "";

    const steps = [
      { time: 0, action: `🍞 ${t("stepBreadReady")}` },
      { time: 0.75, action: `🔥 ${t("stepBaking")}` },
      { time: 4.75, action: `❄️ ${t("stepFromFridge")}` },
      { time: 8.75, action: `🥣 ${t("stepShape")}` },
      { time: 9.25, action: `📦 ${t("stepFold")}` },
      { time: 17.25, action: `🌙 ${t("stepBulk")}` },
      { time: 17.75, action: `🧂 ${t("stepSalt")}` },
      { time: 18.25, action: `⏳ ${t("stepAutolyse")}` },
      { time: 18.75, action: `🥄 ${t("stepMix")}` },
      { time: 24.75, action: `🌱 ${t("stepFeed")}` },
    ];

    const dayNames = [
      t("daySun"),
      t("dayMon"),
      t("dayTue"),
      t("dayWed"),
      t("dayThu"),
      t("dayFri"),
      t("daySat"),
    ];

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const items = steps
      .map((step) => {
        const stepDate = new Date(targetDate.getTime() - step.time * 60 * 60 * 1000);
        const timeStr = stepDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const stepDay = new Date(stepDate);
        stepDay.setHours(0, 0, 0, 0);
        const daysFromToday = Math.round((stepDay - today) / (1000 * 60 * 60 * 24));

        let dayLabel = "";
        if (daysFromToday === 0) {
          dayLabel = t("scheduleToday");
        } else if (daysFromToday === 1) {
          dayLabel = t("scheduleTomorrow");
        } else if (daysFromToday === -1) {
          dayLabel = t("scheduleYesterday");
        } else if (daysFromToday < 0) {
          dayLabel = t("scheduleDaysAgo", { n: -daysFromToday });
        } else {
          dayLabel = `${dayNames[stepDate.getDay()]} (+${daysFromToday}${t("scheduleDays")})`;
        }

        return {
          timeStr,
          dayLabel,
          action: step.action,
          done: stepDate < now,
        };
      })
      .reverse();

    return { targetDate, warning, items };
  }, [readyTime, readyDayOffset, t]);

  const handleCalendarExport = () => {
    generateICS(activeStarter?.name || "Starter", schedule.targetDate);
  };

  return (
    <div className="section">
      <h2 className="section-title">{t("plannerTitle")}</h2>

      <div className="planner-card">
        <div className="planner-question">{t("whenBreadReady")}</div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            margin: "16px 0",
            flexWrap: "wrap",
          }}
        >
          <input
            type="time"
            className="time-input"
            value={readyTime}
            onChange={(e) => setReadyTime(e.target.value)}
          />
          <select
            className="day-select"
            value={readyDayOffset}
            onChange={(e) => setReadyDayOffset(Number(e.target.value))}
          >
            <option value={0}>{t("scheduleToday")}</option>
            <option value={1}>{t("scheduleTomorrow")}</option>
            <option value={2}>{t("dayAfterTomorrow")}</option>
            <option value={3}>{t("daysPlus3")}</option>
            <option value={4}>{t("daysPlus4")}</option>
            <option value={5}>{t("daysPlus5")}</option>
            <option value={6}>{t("daysPlus6")}</option>
            <option value={7}>{t("daysPlus7")}</option>
          </select>
        </div>
        {schedule.warning && (
          <div
            className="tip-box warning"
            dangerouslySetInnerHTML={{ __html: sanitizeLimitedHtml(schedule.warning) }}
          />
        )}
      </div>

      <div className="planner-card" id="schedule-card">
        <div className="schedule-title">{t("yourSchedule")}</div>
        <div id="schedule-steps">
          {schedule.items.map((step) => (
            <div
              key={`${step.timeStr}-${step.action}`}
              className={`schedule-step ${step.done ? "done" : ""}`}
            >
              <div className="schedule-time-block">
                <span className="schedule-time">{step.timeStr}</span>
                <span className="schedule-day">{step.dayLabel}</span>
              </div>
              <span className="schedule-action">{step.action}</span>
            </div>
          ))}
        </div>
        <button
          className="btn btn-secondary"
          style={{ marginTop: "16px", width: "100%" }}
          onClick={handleCalendarExport}
          type="button"
        >
          {t("addToCalendar")}
        </button>
      </div>

      <div className="planner-card">
        <div className="schedule-title">{t("ingredients")}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "12px 0",
          }}
        >
          <span style={{ color: "var(--text-secondary)" }}>
            {t("howManyLoaves")}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="calc-btn"
              onClick={() => setCalcLoaves(loaves - 1)}
              type="button"
            >
              −
            </button>
            <span
              style={{
                fontFamily: "Caveat, cursive",
                fontSize: "24px",
                fontWeight: "700",
                color: "var(--text-secondary)",
              }}
            >
              {loaves}
            </span>
            <button
              className="calc-btn"
              onClick={() => setCalcLoaves(loaves + 1)}
              type="button"
            >
              +
            </button>
          </div>
        </div>
        <div className="recipe-mini">
          <div className="recipe-row-mini">
            <span>{t("calcStarter")}</span>
            <span>{ingredients.starter}g</span>
          </div>
          <div className="recipe-row-mini">
            <span>{t("calcFlourWhite")}</span>
            <span>{ingredients.flour}g</span>
          </div>
          <div className="recipe-row-mini">
            <span>{t("calcWater")}</span>
            <span>{ingredients.water}g</span>
          </div>
          <div className="recipe-row-mini">
            <span>{t("calcSalt")}</span>
            <span>{ingredients.salt}g</span>
          </div>
        </div>
      </div>

      <div className="planner-card">
        <div className="schedule-title">{t("bakeNotes")}</div>
        <textarea
          className="notes-textarea small"
          placeholder={t("notesPlaceholder")}
          value={bakeNotes}
          onChange={(e) => setBakeNotes(e.target.value)}
        />
      </div>
    </div>
  );
}

export default PlannerPage;
