import { useState } from "react";
import { useTranslation } from "react-i18next";
import useSettingsStore from "../store/useSettingsStore";
import useStarterStore from "../store/useStarterStore";
import Icon from "../components/common/Icon";
import TipBox from "../components/common/TipBox";

const LANGUAGES = [
  { code: "ro", label: "languageRo" },
  { code: "en", label: "languageEn" },
  { code: "de", label: "languageDe" },
  { code: "fr", label: "languageFr" },
  { code: "es", label: "languageEs" },
  { code: "it", label: "languageIt" },
];

const MAX_NAME_LENGTH = 50;

function OnboardingPage() {
  const { t, i18n } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const updateStarter = useStarterStore((s) => s.updateStarter);
  const getActiveStarter = useStarterStore((s) => s.getActiveStarter);

  const [step, setStep] = useState(0);
  const [path, setPath] = useState(null); // "create" | "adopt" | "existing"
  const [existingAnswer, setExistingAnswer] = useState(null);
  const [name, setName] = useState("");

  const handleLanguageChange = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  const handleFinalize = () => {
    const starter = getActiveStarter();
    const safeName = name.trim().slice(0, MAX_NAME_LENGTH) || "Pufi";

    const updates = { name: safeName };
    if (path === "create") {
      updates.isNewStarter = true;
      updates.currentDay = 1;
      updates.createdAt = Date.now();
    } else if (path === "adopt") {
      updates.isNewStarter = false;
      updates.currentDay = 1;
      updates.createdAt = Date.now();
    } else {
      // existing
      updates.isNewStarter = false;
      updates.currentDay = 8;
      updates.createdAt = Date.now();
    }

    updateStarter(starter.id, updates);
    completeOnboarding();
  };

  // Step 2 path-specific step number for navigation
  const goToPathStep = () => setStep(2);
  const goToName = () => setStep(3);

  return (
    <div
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      className="min-h-dvh flex flex-col"
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-md mx-auto w-full">

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="w-full text-center">
            <div style={{ fontSize: "3rem", marginBottom: "8px" }}>
              <Icon name="wheat" size={48} style={{ color: "var(--accent)" }} />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.2rem",
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              {t("welcome")}
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "15px",
                lineHeight: "1.5",
                marginBottom: "32px",
              }}
            >
              {t("appDesc")}
            </p>

            {/* Language picker */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="btn-pill"
                  data-active={language === lang.code}
                >
                  {t(lang.label)}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-secondary mb-6"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
              {theme === "light" ? t("themeDark") : t("themeLight")}
            </button>

            <button onClick={() => setStep(1)} className="btn-primary">
              {t("continueSetup")}
            </button>
          </div>
        )}

        {/* Step 1: Path selection */}
        {step === 1 && (
          <div className="w-full">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              {t("howToStart")}
            </h2>

            <div className="flex flex-col gap-3">
              {[
                { id: "create", icon: "wheat", titleKey: "pathCreate", descKey: "pathCreateDesc" },
                { id: "adopt", icon: "droplet", titleKey: "pathAdopt", descKey: "pathAdoptDesc" },
                { id: "existing", icon: "target", titleKey: "pathExisting", descKey: "pathExistingDesc" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setPath(p.id); goToPathStep(); }}
                  className="card"
                  style={{
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    gap: "14px",
                    alignItems: "center",
                    padding: "18px 16px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "var(--accent-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={p.icon} size={22} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "2px" }}>
                      {t(p.titleKey)}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                      {t(p.descKey)}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(0)}
              className="btn-secondary mt-4"
            >
              {t("goBack")}
            </button>
          </div>
        )}

        {/* Step 2: Path-specific */}
        {step === 2 && path === "create" && (
          <div className="w-full">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              {t("shoppingTitle")}
            </h2>

            <div className="flex flex-col gap-2 mb-6">
              {["shopScale", "shopWhiteFlour", "shopRyeFlour", "shopBran", "shopWater", "shopJar"].map((key) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    background: "var(--bg-secondary)",
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Icon name="check" size={16} style={{ color: "var(--success)", flexShrink: 0 }} />
                  {t(key)}
                </div>
              ))}
            </div>

            <button onClick={goToName} className="btn-primary mb-3">
              {t("haveEverything")}
            </button>
            <button onClick={() => setStep(1)} className="btn-secondary">
              {t("goBack")}
            </button>
          </div>
        )}

        {step === 2 && path === "adopt" && (
          <div className="w-full">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              {t("adoptTitle")}
            </h2>

            <TipBox type="info">{t("adoptTip")}</TipBox>

            <div className="mt-4 mb-4">
              <p className="section-label">{t("adoptSourcesTitle")}</p>
              <div className="flex flex-col gap-2">
                {[
                  { key: "adoptFriends", descKey: "adoptFriendsDesc", icon: "star" },
                  { key: "adoptBakery", descKey: "adoptBakeryDesc", icon: "bread" },
                  { key: "adoptGroups", descKey: "adoptGroupsDesc", icon: "book" },
                  { key: "adoptShop", descKey: "adoptShopDesc", icon: "download" },
                ].map((src) => (
                  <div
                    key={src.key}
                    style={{
                      padding: "12px 14px",
                      background: "var(--bg-secondary)",
                      borderRadius: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                      <Icon name={src.icon} size={16} style={{ color: "var(--accent)" }} />
                      {t(src.key)}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "2px", marginLeft: "24px" }}>
                      {t(src.descKey)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="section-label">{t("adoptChecklist")}</p>
              <div className="flex flex-col gap-1.5">
                {["adoptCheck1", "adoptCheck2", "adoptCheck3"].map((key) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      paddingLeft: "4px",
                    }}
                  >
                    <Icon name="check" size={14} style={{ color: "var(--success)", flexShrink: 0 }} />
                    {t(key)}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={goToName} className="btn-primary mb-3">
              {t("gotStarter")}
            </button>
            <button
              onClick={() => { setPath("create"); }}
              className="btn-secondary mb-3"
            >
              {t("preferCreate")}
            </button>
            <button onClick={() => setStep(1)} className="btn-secondary">
              {t("goBack")}
            </button>
          </div>
        )}

        {step === 2 && path === "existing" && (
          <div className="w-full">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              {t("existingTitle")}
            </h2>

            {!existingAnswer ? (
              <>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "14px",
                    textAlign: "center",
                    marginBottom: "16px",
                  }}
                >
                  {t("existingQ1")}
                </p>

                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { id: "active", key: "existingA1a", descKey: "existingA1aDesc" },
                    { id: "hungry", key: "existingA1b", descKey: "existingA1bDesc" },
                    { id: "neglected", key: "existingA1c", descKey: "existingA1cDesc" },
                    { id: "fridge", key: "existingA1d", descKey: "existingA1dDesc" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setExistingAnswer(opt.id)}
                      className="card"
                      style={{
                        border: "1px solid var(--border)",
                        cursor: "pointer",
                        textAlign: "left",
                        padding: "14px 16px",
                      }}
                    >
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>{t(opt.key)}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "2px" }}>
                        {t(opt.descKey)}
                      </div>
                    </button>
                  ))}
                </div>

                <button onClick={() => setStep(1)} className="btn-secondary">
                  {t("goBack")}
                </button>
              </>
            ) : (
              <>
                {/* Show advice based on answer */}
                <HealthAdvice answer={existingAnswer} t={t} />

                <button onClick={goToName} className="btn-primary mb-3">
                  {t("continueSetup")}
                </button>
                <button
                  onClick={() => setExistingAnswer(null)}
                  className="btn-secondary"
                >
                  {t("goBack")}
                </button>
              </>
            )}
          </div>
        )}

        {/* Step 3: Name input */}
        {step === 3 && (
          <div className="w-full text-center">
            <div style={{ marginBottom: "16px" }}>
              <Icon name="wheat" size={40} style={{ color: "var(--accent)" }} />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.8rem",
                marginBottom: "8px",
              }}
            >
              {path === "create" ? t("nameQuestionNew") : t("nameQuestion")}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
              Pufi, Maya, Dora, Bubbles...
            </p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
              placeholder="Pufi"
              className="input-field mb-6"
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: "1.3rem",
                fontWeight: "600",
                padding: "14px",
              }}
              autoFocus
            />

            <button onClick={handleFinalize} className="btn-primary mb-3">
              {t("letsStart")}
            </button>
            <button onClick={() => setStep(2)} className="btn-secondary">
              {t("goBack")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function HealthAdvice({ answer, t }) {
  const adviceMap = {
    active: { titleKey: "existingAdviceActiveTitle", descKey: "existingAdviceActiveDesc", icon: "check", type: "success" },
    hungry: { titleKey: "existingAdviceHungryTitle", descKey: "existingAdviceHungryDesc", icon: "alert", type: "warning" },
    neglected: { titleKey: "existingAdviceNeglectedTitle", descKey: "existingAdviceNeglectedDesc", icon: "alert", type: "warning" },
    fridge: { titleKey: "existingAdviceFridgeTitle", descKey: "existingAdviceFridgeDesc", icon: "thermometer", type: "info" },
  };

  const advice = adviceMap[answer];
  if (!advice) return null;

  return (
    <div
      className="card mb-4"
      style={{
        border: "1px solid var(--border)",
        textAlign: "center",
        padding: "24px 20px",
      }}
    >
      <Icon
        name={advice.icon}
        size={32}
        style={{ color: "var(--accent)", marginBottom: "12px" }}
      />
      <h3 style={{ fontWeight: "700", fontSize: "16px", marginBottom: "8px" }}>
        {t(advice.titleKey)}
      </h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5" }}>
        {t(advice.descKey)}
      </p>
    </div>
  );
}

export default OnboardingPage;
