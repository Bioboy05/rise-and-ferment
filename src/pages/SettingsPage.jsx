import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import useStarterStore from "../store/useStarterStore";
import useSettingsStore from "../store/useSettingsStore";
import useActiveStarter from "../hooks/useActiveStarter";
import Modal from "../components/common/Modal";
import Toggle from "../components/common/Toggle";
import { exportData, importData } from "../utils/exportHelpers";

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
      const name = data.starters?.[0]?.name || "Starter";
      if (!window.confirm(`${t("confirmImport")} ${name}?`)) return;
      localStorage.setItem("riseFermentStarters", JSON.stringify({
        state: { starters: data.starters, activeStarterId: data.activeStarterId },
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

  const sectionStyle = {
    background: "var(--bg-card)",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "12px",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "700",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "12px",
  };

  return (
    <div className="max-w-md mx-auto" style={{ paddingBottom: "24px" }}>
      {/* Page title */}
      <h2
        style={{
          fontFamily: "Caveat, cursive",
          fontSize: "1.8rem",
          color: "var(--text-primary)",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        {t("settingsTitle")}
      </h2>

      {/* Status message */}
      {statusMsg && (
        <div
          style={{
            background: "var(--success)",
            color: "white",
            borderRadius: "12px",
            padding: "10px 16px",
            marginBottom: "12px",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          {statusMsg}
        </div>
      )}

      {/* 1. My Starter */}
      <div style={sectionStyle}>
        <div style={labelStyle}>{t("myStarter")}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          {editingName ? (
            <>
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                maxLength={50}
                autoFocus
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "16px",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); }}
              />
              <button
                onClick={handleSaveName}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--accent)",
                  color: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                ✓
              </button>
            </>
          ) : (
            <>
              <span
                style={{
                  flex: 1,
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                }}
              >
                {starter.name}
              </span>
              <button
                onClick={() => { setNameValue(starter.name); setEditingName(true); }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {t("editName")}
              </button>
            </>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "var(--text-muted)",
          }}
        >
          <span>{t("hydration")}:</span>
          <span style={{ fontWeight: "700", color: "var(--text-secondary)" }}>
            {starter.hydration}%
          </span>
          <span style={{ fontSize: "12px" }}>({t("hydrationDesc")})</span>
        </div>
      </div>

      {/* 2. Personal Notes */}
      <div style={sectionStyle}>
        <div style={labelStyle}>{t("personalNotes")}</div>
        <textarea
          value={notesValue}
          onChange={(e) => setNotesValue(e.target.value)}
          onBlur={handleSaveNotes}
          maxLength={500}
          placeholder={t("personalNotesPlaceholder")}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            fontSize: "14px",
            resize: "none",
            height: "80px",
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* 3. Appearance */}
      <div style={sectionStyle}>
        <div style={labelStyle}>{t("appearance")}</div>
        {/* Theme toggle */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          {["light", "dark"].map((t_) => (
            <button
              key={t_}
              onClick={() => { if (theme !== t_) toggleTheme(); }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "12px",
                border: theme === t_ ? "2px solid var(--accent)" : "1px solid var(--border)",
                background: theme === t_ ? "var(--accent-light)" : "var(--bg-secondary)",
                color: theme === t_ ? "var(--accent)" : "var(--text-muted)",
                fontSize: "14px",
                fontWeight: theme === t_ ? "700" : "400",
                cursor: "pointer",
              }}
            >
              {t_ === "light" ? t("themeLight") : t("themeDark")}
            </button>
          ))}
        </div>
        {/* Language grid */}
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>
          {t("language")}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              style={{
                padding: "10px 8px",
                borderRadius: "10px",
                border: language === lang.code ? "2px solid var(--accent)" : "1px solid var(--border)",
                background: language === lang.code ? "var(--accent-light)" : "var(--bg-secondary)",
                color: language === lang.code ? "var(--accent)" : "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: language === lang.code ? "700" : "400",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ fontSize: "20px" }}>{lang.flag}</span>
              <span>{t(lang.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Beginner Mode */}
      <div style={sectionStyle}>
        <Toggle
          checked={beginnerMode}
          onChange={toggleBeginnerMode}
          label={t("beginnerMode")}
          description={t("beginnerModeDesc")}
        />
      </div>

      {/* 5. Sound */}
      <div style={sectionStyle}>
        <Toggle
          checked={soundEnabled}
          onChange={toggleSound}
          label={t("soundEffects")}
          description={t("soundEffectsDesc")}
        />
      </div>

      {/* 6. Units (temperature) */}
      <div style={sectionStyle}>
        <div style={labelStyle}>{t("temperature")}</div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            { unit: "c", label: t("unitCelsius") },
            { unit: "f", label: t("unitFahrenheit") },
          ].map(({ unit, label }) => (
            <button
              key={unit}
              onClick={() => setTempUnit(unit)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "12px",
                border: tempUnit === unit ? "2px solid var(--accent)" : "1px solid var(--border)",
                background: tempUnit === unit ? "var(--accent-light)" : "var(--bg-secondary)",
                color: tempUnit === unit ? "var(--accent)" : "var(--text-muted)",
                fontSize: "14px",
                fontWeight: tempUnit === unit ? "700" : "400",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Backup */}
      <div style={sectionStyle}>
        <div style={labelStyle}>{t("backupTitle")}</div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
          {t("backupHint")}
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleExport}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              color: "var(--text-secondary)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {t("exportBtn")}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              color: "var(--text-secondary)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
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
      <div style={{ ...sectionStyle, border: "1px solid var(--warning)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: "700", color: "var(--warning)", fontSize: "14px" }}>
              {t("resetApp")}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              {t("resetDesc")}
            </div>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              border: "1px solid var(--warning)",
              background: "transparent",
              color: "var(--warning)",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {t("resetApp")}
          </button>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {showResetModal && (
        <Modal onClose={() => setShowResetModal(false)} title={t("resetConfirmTitle")}>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
            {t("resetConfirmDesc")}
          </p>
          <button
            onClick={resetAll}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: "var(--warning)",
              color: "white",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              marginBottom: "8px",
            }}
          >
            {t("resetConfirmBtn")}
          </button>
          <button
            onClick={() => setShowResetModal(false)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {t("resetCancelBtn")}
          </button>
        </Modal>
      )}
    </div>
  );
}

export default SettingsPage;
