import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import useStarterStore from "../store/useStarterStore";
import useSettingsStore from "../store/useSettingsStore";
import useActiveStarter from "../hooks/useActiveStarter";
import Modal from "../components/common/Modal";
import Toggle from "../components/common/Toggle";
import Icon from "../components/common/Icon";
import { exportData, importData } from "../utils/exportHelpers";
import { normalizeStarter } from "../utils/starterHelpers";

const languages = [
  { code: "ro", flag: "🇷🇴", labelKey: "languageRo" },
  { code: "en", flag: "🇬🇧", labelKey: "languageEn" },
  { code: "de", flag: "🇩🇪", labelKey: "languageDe" },
  { code: "fr", flag: "🇫🇷", labelKey: "languageFr" },
  { code: "es", flag: "🇪🇸", labelKey: "languageEs" },
  { code: "it", flag: "🇮🇹", labelKey: "languageIt" },
];

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const starter = useActiveStarter();
  const updateStarter = useStarterStore((state) => state.updateStarter);
  const theme = useSettingsStore((state) => state.theme);
  const language = useSettingsStore((state) => state.language);
  const beginnerMode = useSettingsStore((state) => state.beginnerMode);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const tempUnit = useSettingsStore((state) => state.tempUnit);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const toggleBeginnerMode = useSettingsStore((state) => state.toggleBeginnerMode);
  const toggleSound = useSettingsStore((state) => state.toggleSound);
  const setTempUnit = useSettingsStore((state) => state.setTempUnit);
  const resetAll = useSettingsStore((state) => state.resetAll);

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(starter.name);
  const [notesValue, setNotesValue] = useState(starter.personalNotes || "");
  const [showResetModal, setShowResetModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const fileInputRef = useRef(null);

  const showStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleSaveName = () => {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== starter.name) {
      updateStarter(starter.id, { name: trimmed });
    }
    setEditingName(false);
  };

  const handleSaveNotes = () => {
    updateStarter(starter.id, { personalNotes: notesValue.trim() });
    showStatus(t("settingsSaved"));
  };

  const handleLanguageChange = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  const handleExport = () => {
    const starterState = useStarterStore.getState();
    const settingsState = useSettingsStore.getState();
    exportData(starterState, settingsState);
    showStatus(t("exportSuccess"));
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importData(file);
      const normalizedStarters = Array.isArray(data.starters)
        ? data.starters.map(normalizeStarter)
        : [];
      if (normalizedStarters.length === 0) {
        throw new Error("No starters found in backup");
      }
      const activeStarterId =
        normalizedStarters.find((s) => s.id === data.activeStarterId)?.id ||
        normalizedStarters[0].id;

      const name = normalizedStarters[0]?.name || "Starter";
      if (!window.confirm(`${t("confirmImport")} ${name}?`)) return;
      localStorage.setItem("riseFermentStarters", JSON.stringify({
        state: { starters: normalizedStarters, activeStarterId },
        version: 0,
      }));
      if (data.settings) {
        localStorage.setItem("riseFermentSettings", JSON.stringify({
          state: data.settings,
          version: 0,
        }));
      }
      window.location.reload();
    } catch {
      alert(t("importError"));
    }
    e.target.value = "";
  };

  return (
    <div className="max-w-md mx-auto" style={{ paddingBottom: "24px" }}>
      <h2 className="page-title">{t("settingsTitle")}</h2>

      {/* Status message */}
      {statusMsg && <div className="status-toast">{statusMsg}</div>}

      {/* 1. My Starter */}
      <div className="card">
        <div className="section-label">{t("myStarter")}</div>
        <div className="flex items-center gap-2.5 mb-3">
          {editingName ? (
            <>
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                maxLength={50}
                autoFocus
                className="input-field flex-1"
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); }}
              />
              <button
                onClick={handleSaveName}
                aria-label={t("settingsSaved") || "Save"}
                className="btn-primary"
                style={{ width: "auto", minWidth: "44px", minHeight: "44px", padding: "8px 16px" }}
              >
                <Icon name="check" size={18} />
              </button>
            </>
          ) : (
            <>
              <span className="flex-1 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                {starter.name}
              </span>
              <button
                onClick={() => { setNameValue(starter.name); setEditingName(true); }}
                className="btn-secondary"
                style={{ width: "auto", padding: "6px 14px", fontSize: "13px" }}
              >
                {t("editName")}
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
          <span>{t("hydration")}:</span>
          <span className="font-bold" style={{ color: "var(--text-secondary)" }}>
            {starter.hydration}%
          </span>
          <span className="text-xs">({t("hydrationDesc")})</span>
        </div>
      </div>

      {/* 2. Personal Notes */}
      <div className="card">
        <div className="section-label">{t("personalNotes")}</div>
        <textarea
          value={notesValue}
          onChange={(e) => setNotesValue(e.target.value)}
          onBlur={handleSaveNotes}
          maxLength={500}
          placeholder={t("personalNotesPlaceholder")}
          className="textarea-field"
          style={{ height: "80px" }}
        />
      </div>

      {/* 3. Appearance */}
      <div className="card">
        <div className="section-label">{t("appearance")}</div>
        {/* Theme toggle */}
        <div className="flex gap-2 mb-4">
          {["light", "dark"].map((t_) => (
            <button
              key={t_}
              onClick={() => { if (theme !== t_) toggleTheme(); }}
              className="btn-pill flex-1"
              data-active={theme === t_}
              style={{ padding: "10px" }}
            >
              <Icon name={t_ === "light" ? "sun" : "moon"} size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
              {t_ === "light" ? t("themeLight") : t("themeDark")}
            </button>
          ))}
        </div>
        {/* Language grid */}
        <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          {t("language")}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="btn-pill flex flex-col items-center gap-1"
              data-active={language === lang.code}
              style={{ padding: "10px 8px" }}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-xs">{t(lang.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Beginner Mode */}
      <div className="card">
        <Toggle
          checked={beginnerMode}
          onChange={toggleBeginnerMode}
          label={t("beginnerMode")}
          description={t("beginnerModeDesc")}
        />
      </div>

      {/* 5. Sound */}
      <div className="card">
        <Toggle
          checked={soundEnabled}
          onChange={toggleSound}
          label={t("soundEffects")}
          description={t("soundEffectsDesc")}
        />
      </div>

      {/* 6. Units (temperature) */}
      <div className="card">
        <div className="section-label">{t("temperature")}</div>
        <div className="flex gap-2">
          {[
            { unit: "c", label: t("unitCelsius") },
            { unit: "f", label: t("unitFahrenheit") },
          ].map(({ unit, label }) => (
            <button
              key={unit}
              onClick={() => setTempUnit(unit)}
              className="btn-pill flex-1"
              data-active={tempUnit === unit}
              style={{ padding: "10px" }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Backup */}
      <div className="card">
        <div className="section-label">{t("backupTitle")}</div>
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
          {t("backupHint")}
        </p>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <Icon name="download" size={16} />
            {t("exportBtn")}
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <Icon name="upload" size={16} />
            {t("importBtn")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* 8. Reset */}
      <div className="card" style={{ border: "1px solid var(--warning)" }}>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-bold text-sm" style={{ color: "var(--warning)" }}>
              {t("resetApp")}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {t("resetDesc")}
            </div>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="btn-secondary"
            style={{
              width: "auto",
              padding: "8px 16px",
              borderColor: "var(--warning)",
              color: "var(--warning)",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            {t("resetApp")}
          </button>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {showResetModal && (
        <Modal onClose={() => setShowResetModal(false)} title={t("resetConfirmTitle")}>
          <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
            {t("resetConfirmDesc")}
          </p>
          <button
            onClick={resetAll}
            className="btn-primary mb-2"
            style={{ background: "var(--warning)" }}
          >
            {t("resetConfirmBtn")}
          </button>
          <button
            onClick={() => setShowResetModal(false)}
            className="btn-secondary"
          >
            {t("resetCancelBtn")}
          </button>
        </Modal>
      )}
    </div>
  );
}

export default SettingsPage;
