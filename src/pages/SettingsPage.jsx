import { useRef } from "react";
import { useTranslation } from "react-i18next";
import useStarterStore from "../store/useStarterStore";
import useSettingsStore from "../store/useSettingsStore";
import useActiveStarter from "../hooks/useActiveStarter";
import { exportData, importData } from "../utils/exportHelpers";
import { normalizeStarter } from "../utils/starterHelpers";
import { isSupportedLanguage } from "../constants/languages";

function sanitizeImportedSettings(settings) {
  const raw = settings && typeof settings === "object" ? settings : {};
  const notifications = raw.notifications && typeof raw.notifications === "object" ? raw.notifications : {};

  return {
    onboardingComplete: Boolean(raw.onboardingComplete),
    theme: raw.theme === "dark" ? "dark" : "light",
    language: isSupportedLanguage(raw.language) ? raw.language : "ro",
    beginnerMode: raw.beginnerMode !== false,
    soundEnabled: raw.soundEnabled !== false,
    tempUnit: raw.tempUnit === "f" ? "f" : "c",
    weightUnit: raw.weightUnit === "oz" ? "oz" : "g",
    sessions: Number.isFinite(Number(raw.sessions)) ? Math.max(0, Math.round(Number(raw.sessions))) : 0,
    notifications: {
      enabled: Boolean(notifications.enabled),
      urgentEnabled: notifications.urgentEnabled !== false,
      urgentHours: Number.isFinite(Number(notifications.urgentHours))
        ? Math.max(1, Math.min(72, Math.round(Number(notifications.urgentHours))))
        : 24,
      dailyEnabled: Boolean(notifications.dailyEnabled),
      dailyTime:
        typeof notifications.dailyTime === "string" && /^\d{2}:\d{2}$/.test(notifications.dailyTime)
          ? notifications.dailyTime
          : "09:00",
      pushEnabled: Boolean(notifications.pushEnabled),
    },
    scheduledBakes: Array.isArray(raw.scheduledBakes) ? raw.scheduledBakes.slice(0, 100) : [],
    calcLoaves: Number.isFinite(Number(raw.calcLoaves))
      ? Math.max(1, Math.min(10, Math.round(Number(raw.calcLoaves))))
      : 1,
    bakeNotes: String(raw.bakeNotes || "").slice(0, 500),
  };
}

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const starter = useActiveStarter();
  const updateStarter = useStarterStore((state) => state.updateStarter);
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const beginnerMode = useSettingsStore((state) => state.beginnerMode);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const tempUnit = useSettingsStore((state) => state.tempUnit);
  const weightUnit = useSettingsStore((state) => state.weightUnit);
  const notificationsEnabled = useSettingsStore((state) => state.notifications.enabled);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const toggleBeginnerMode = useSettingsStore((state) => state.toggleBeginnerMode);
  const toggleSound = useSettingsStore((state) => state.toggleSound);
  const setTempUnit = useSettingsStore((state) => state.setTempUnit);
  const setWeightUnit = useSettingsStore((state) => state.setWeightUnit);
  const toggleNotifications = useSettingsStore((state) => state.toggleNotifications);
  const resetAll = useSettingsStore((state) => state.resetAll);
  const fileInputRef = useRef(null);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  const handleExport = () => {
    const starterState = useStarterStore.getState();
    const settingsState = useSettingsStore.getState();
    exportData(starterState, settingsState);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importData(file);
      const seenIds = new Set();
      const normalizedStarters = Array.isArray(data.starters)
        ? data.starters
            .slice(0, 10)
            .map(normalizeStarter)
            .filter((starterItem) => {
              if (seenIds.has(starterItem.id)) return false;
              seenIds.add(starterItem.id);
              return true;
            })
        : [];
      if (normalizedStarters.length === 0) {
        throw new Error("No starters found in backup");
      }
      const activeStarterId =
        normalizedStarters.find((s) => s.id === data.activeStarterId)?.id ||
        normalizedStarters[0].id;

      const name = normalizedStarters[0]?.name || "Starter";
      if (!window.confirm(`${t("confirmImport")} ${name}?`)) return;
      localStorage.setItem(
        "riseFermentStarters",
        JSON.stringify({
          state: { starters: normalizedStarters, activeStarterId },
          version: 0,
        })
      );
      if (data.settings) {
        const safeSettings = sanitizeImportedSettings(data.settings);
        localStorage.setItem(
          "riseFermentSettings",
          JSON.stringify({
            state: safeSettings,
            version: 0,
          })
        );
      }
      window.location.reload();
    } catch {
      alert(t("importError"));
    }
    e.target.value = "";
  };

  return (
    <div className="section" style={{ paddingTop: "10px" }}>
      <div className="settings-section">
        <div className="settings-section-title">📝 <span>{t("personalNotes")}</span></div>
        <div className="settings-card">
          <textarea
            className="notes-textarea"
            value={starter.personalNotes || ""}
            placeholder={t("personalNotesPlaceholder")}
            onChange={(e) => updateStarter(starter.id, { personalNotes: e.target.value })}
          />
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">🫙 <span>{t("myStarter")}</span></div>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <div className="settings-label">{t("starterName")}</div>
            </div>
            <input
              type="text"
              className="settings-input"
              value={starter.name}
              onChange={(e) => updateStarter(starter.id, { name: e.target.value })}
            />
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">{t("hydration")}</div>
              <div className="settings-sublabel">{t("hydrationDesc")}</div>
            </div>
            <select
              className="settings-select"
              value={starter.hydration || "100"}
              onChange={(e) => updateStarter(starter.id, { hydration: e.target.value })}
            >
              <option value="100">100% (1:1:1)</option>
              <option value="80">80%</option>
              <option value="60">60% ({t("hydration60")})</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">🌟 <span>{t("beginnerMode")}</span></div>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <div className="settings-label">{t("beginnerMode")}</div>
              <div className="settings-sublabel">{t("beginnerModeDesc")}</div>
            </div>
            <button
              className={`toggle-switch ${beginnerMode ? "on" : ""}`}
              type="button"
              onClick={toggleBeginnerMode}
              aria-label={t("beginnerMode")}
            >
              <div className="toggle-knob" />
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">🎨 <span>{t("appearance")}</span></div>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <div className="settings-label">{t("theme")}</div>
              <div className="settings-sublabel">{t("themeDesc")}</div>
            </div>
            <select
              className="settings-select"
              value={theme}
              onChange={(e) => {
                if (e.target.value !== theme) toggleTheme();
              }}
            >
              <option value="light">{t("themeLight")}</option>
              <option value="dark">{t("themeDark")}</option>
            </select>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">{t("language")}</div>
            </div>
            <select
              className="settings-select"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="ro">🇷🇴 {t("languageRo")}</option>
              <option value="en">🇬🇧 {t("languageEn")}</option>
              <option value="de">🇩🇪 {t("languageDe")}</option>
              <option value="fr">🇫🇷 {t("languageFr")}</option>
              <option value="es">🇪🇸 {t("languageEs")}</option>
              <option value="it">🇮🇹 {t("languageIt")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">🔔 <span>{t("notifications")}</span></div>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <div className="settings-label">{t("feedingReminder")}</div>
              <div className="settings-sublabel">{t("feedingReminderDesc")}</div>
            </div>
            <button
              className={`toggle-switch ${notificationsEnabled ? "on" : ""}`}
              type="button"
              onClick={toggleNotifications}
              aria-label={t("feedingReminder")}
            >
              <div className="toggle-knob" />
            </button>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">{t("soundEffects")}</div>
              <div className="settings-sublabel">{t("soundEffectsDesc")}</div>
            </div>
            <button
              className={`toggle-switch ${soundEnabled ? "on" : ""}`}
              type="button"
              onClick={toggleSound}
              aria-label={t("soundEffects")}
            >
              <div className="toggle-knob" />
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">📏 <span>{t("units")}</span></div>
        <div className="settings-card">
          <div className="settings-row">
            <div>
              <div className="settings-label">{t("weight")}</div>
            </div>
            <select
              className="settings-select"
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
            >
              <option value="g">{t("unitGrams")}</option>
              <option value="oz">{t("unitOunces")}</option>
            </select>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">{t("temperature")}</div>
            </div>
            <select
              className="settings-select"
              value={tempUnit}
              onChange={(e) => setTempUnit(e.target.value)}
            >
              <option value="c">{t("unitCelsius")}</option>
              <option value="f">{t("unitFahrenheit")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-title">💾 <span>{t("backupTitle")}</span></div>
        <div className="settings-card">
          <div className="settings-row" style={{ flexDirection: "column", gap: "12px" }}>
            <button className="backup-btn export" type="button" onClick={handleExport}>
              <span>📤</span> <span>{t("exportBtn")}</span>
            </button>
            <button
              className="backup-btn import"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <span>📥</span> <span>{t("importBtn")}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleImport}
            />
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                textAlign: "center",
                margin: 0,
              }}
            >
              {t("backupHint")}
            </p>
          </div>
        </div>
      </div>

      <div className="settings-section" style={{ marginTop: "32px" }}>
        <button className="danger-btn" type="button" onClick={resetAll}>
          {t("resetApp")}
        </button>
        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
          {t("resetDesc")}
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: "40px", paddingBottom: "20px" }}>
        <p style={{ fontFamily: "Caveat, cursive", fontSize: "24px", color: "var(--accent)" }}>
          Rise &amp; Ferment
        </p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          v3.0 • <span>{t("madeWith")}</span>
        </p>
      </div>
    </div>
  );
}

export default SettingsPage;
