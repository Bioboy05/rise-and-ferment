import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import useSettingsStore from "../store/useSettingsStore";
import useStarterStore from "../store/useStarterStore";

const LANGUAGES = [
  { code: "ro", flag: "🇷🇴", name: "Română" },
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "it", flag: "🇮🇹", name: "Italiano" },
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

  const [path, setPath] = useState(null); // "create" | "adopt" | "existing"
  const [step, setStep] = useState("start"); // start | shopping | adopt | existing | name
  const [existingHealth, setExistingHealth] = useState(null); // active | hungry | neglected | fridge
  const [name, setName] = useState("");

  const advice = useMemo(() => {
    if (!existingHealth) return null;
    const map = {
      active: {
        icon: "🎉",
        title: t("existingAdviceActiveTitle"),
        desc: t("existingAdviceActiveDesc"),
        style: "success",
      },
      hungry: {
        icon: "😋",
        title: t("existingAdviceHungryTitle"),
        desc: t("existingAdviceHungryDesc"),
        style: "warning",
      },
      neglected: {
        icon: "💪",
        title: t("existingAdviceNeglectedTitle"),
        desc: t("existingAdviceNeglectedDesc"),
        style: "warning",
      },
      fridge: {
        icon: "❄️",
        title: t("existingAdviceFridgeTitle"),
        desc: t("existingAdviceFridgeDesc"),
        style: "info",
      },
    };
    return map[existingHealth] || null;
  }, [existingHealth, t]);

  const handleSelectPath = (nextPath) => {
    setPath(nextPath);
    if (nextPath === "create") setStep("shopping");
    else if (nextPath === "adopt") setStep("adopt");
    else if (nextPath === "existing") setStep("existing");
    else setStep("name");
  };

  const goBackToStart = () => {
    setStep("start");
    setExistingHealth(null);
  };

  const goToName = () => setStep("name");

  const handleFinish = () => {
    const starter = getActiveStarter();
    const safeName = name.trim().slice(0, MAX_NAME_LENGTH) || "Maiaua";

    if (path === "create") {
      updateStarter(starter.id, {
        name: safeName,
        createdAt: Date.now(),
        isNewStarter: true,
        currentDay: 1,
        todayCompleted: false,
        lastCompletedDate: null,
        lastFed: null,
        previewingDay: null,
        history: [],
        streak: 0,
        completedDays: [],
      });
    } else {
      updateStarter(starter.id, {
        name: safeName,
        createdAt: Date.now(),
        isNewStarter: false,
        currentDay: 1,
        todayCompleted: false,
        lastCompletedDate: null,
        lastFed: null,
        previewingDay: null,
        history: [],
        streak: 0,
        completedDays: [],
      });
    }

    completeOnboarding();
  };

  const themeIcon = theme === "dark" ? "☀️" : "🌙";
  const nameQuestion = path === "create" ? t("nameQuestionNew") : t("nameQuestion");

  return (
    <div className="onboarding">
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginBottom: "16px" }}>
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          <span>{themeIcon}</span>
        </button>
      </div>

      <div style={{ position: "relative", width: "140px", height: "145px", margin: "0 auto 16px" }}>
        <svg
          viewBox="0 0 100 130"
          width="95"
          height="125"
          style={{ filter: "drop-shadow(0 8px 20px rgba(139, 90, 43, 0.2))" }}
        >
          <rect x="20" y="0" width="60" height="14" rx="4" fill="#8B5A2B" />
          <rect x="24" y="3" width="52" height="4" fill="#A67C52" opacity="0.7" />
          <rect x="16" y="12" width="68" height="7" rx="2" fill="#6B4423" />
          <path
            d="M20 19 L16 115 Q16 125 28 125 L72 125 Q84 125 84 115 L80 19 Z"
            fill="rgba(245, 235, 224, 0.5)"
            stroke="var(--border)"
            strokeWidth="2"
          />
          <path
            d="M24 24 L21 110 Q21 115 26 115 L32 115 Q37 115 37 110 L40 24 Z"
            fill="rgba(255,255,255,0.5)"
          />
          <path
            d="M20 80 Q35 72 50 75 Q65 72 80 80 L79 115 Q79 122 70 122 L30 122 Q21 122 21 115 Z"
            fill="var(--accent)"
            opacity="0.6"
          >
            <animate
              attributeName="d"
              values="M20 80 Q35 72 50 75 Q65 72 80 80 L79 115 Q79 122 70 122 L30 122 Q21 122 21 115 Z;
                      M20 75 Q38 68 50 70 Q62 68 80 75 L79 115 Q79 122 70 122 L30 122 Q21 122 21 115 Z;
                      M20 80 Q35 72 50 75 Q65 72 80 80 L79 115 Q79 122 70 122 L30 122 Q21 122 21 115 Z"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          <circle cx="35" cy="95" r="3" fill="rgba(255,255,255,0.7)">
            <animate attributeName="cy" values="100;85;100" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="90" r="4" fill="rgba(255,255,255,0.6)">
            <animate attributeName="cy" values="98;82;98" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="70" cy="93" r="2.5" fill="rgba(255,255,255,0.7)">
            <animate attributeName="cy" values="97;88;97" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </svg>

        <svg
          viewBox="0 0 60 55"
          width="55"
          height="50"
          style={{
            position: "absolute",
            bottom: "0px",
            right: "-10px",
            filter: "drop-shadow(0 6px 12px rgba(139, 90, 43, 0.35))",
            transform: "rotate(8deg)",
          }}
        >
          <ellipse cx="30" cy="35" rx="27" ry="18" fill="#C9A67A" />
          <ellipse cx="30" cy="32" rx="25" ry="16" fill="#DEB887" />
          <ellipse cx="30" cy="29" rx="22" ry="14" fill="#E8CFA0" />
          <path d="M18 28 Q30 22 42 28" stroke="#8B5A2B" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M30 20 L30 38" stroke="#8B5A2B" strokeWidth="1" fill="none" opacity="0.3" />
          <ellipse cx="24" cy="26" rx="6" ry="4" fill="rgba(255,255,255,0.3)" />
        </svg>
      </div>

      <h1 className="onboarding-title">{t("welcome")}</h1>
      <p className="onboarding-desc">{t("appDesc")}</p>

      {step === "start" && (
        <div id="onboard-step1">
          <p className="onboarding-question">{t("howToStart")}</p>
          <div className="option-cards">
            <div className="option-card" onClick={() => handleSelectPath("create")}>
              <div className="option-icon">🌱</div>
              <div className="option-title">{t("pathCreate")}</div>
              <div className="option-desc">{t("pathCreateDesc")}</div>
            </div>
            <div className="option-card" onClick={() => handleSelectPath("adopt")}>
              <div className="option-icon">🤝</div>
              <div className="option-title">{t("pathAdopt")}</div>
              <div className="option-desc">{t("pathAdoptDesc")}</div>
            </div>
            <div className="option-card" onClick={() => handleSelectPath("existing")}>
              <div className="option-icon">🫙</div>
              <div className="option-title">{t("pathExisting")}</div>
              <div className="option-desc">{t("pathExistingDesc")}</div>
            </div>
          </div>
        </div>
      )}

      {step === "existing" && (
        <div id="onboard-step-existing" style={{ width: "100%" }}>
          <p className="onboarding-question">{t("existingTitle")}</p>
          <div className="health-quiz" style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "12px" }}>
              {t("existingQ1")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { id: "active", emoji: "🟢", title: t("existingA1a"), desc: t("existingA1aDesc") },
                { id: "hungry", emoji: "🟡", title: t("existingA1b"), desc: t("existingA1bDesc") },
                { id: "neglected", emoji: "🟠", title: t("existingA1c"), desc: t("existingA1cDesc") },
                { id: "fridge", emoji: "❄️", title: t("existingA1d"), desc: t("existingA1dDesc") },
              ].map((opt) => {
                const isActive = existingHealth === opt.id;
                return (
                  <div
                    key={opt.id}
                    className="health-option"
                    onClick={() => setExistingHealth(opt.id)}
                    style={{
                      padding: "14px 16px",
                      background: isActive ? "var(--accent-light)" : "var(--bg-card)",
                      borderRadius: "14px",
                      border: `2px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{opt.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{opt.title}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{opt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {advice && (
            <div style={{ marginBottom: "16px" }}>
              <div
                className="tip-box"
                style={{
                  background: "var(--accent-light)",
                  borderLeft:
                    advice.style === "success"
                      ? "4px solid var(--success)"
                      : advice.style === "info"
                        ? "4px solid var(--accent)"
                        : "4px solid var(--warning)",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  textAlign: "left",
                }}
              >
                <strong>
                  {advice.icon} {advice.title}
                </strong>
                <br />
                <span style={{ fontSize: "13px" }}>{advice.desc}</span>
              </div>
            </div>
          )}

          {existingHealth && (
            <button className="btn btn-primary" onClick={goToName} style={{ marginBottom: "8px" }}>
              {t("continueSetup")}
            </button>
          )}
          <button className="btn btn-secondary" onClick={goBackToStart}>
            {t("goBack")}
          </button>
        </div>
      )}

      {step === "shopping" && (
        <div id="onboard-step-shopping" style={{ width: "100%" }}>
          <p className="onboarding-question">{t("shoppingTitle")}</p>
          <div className="shopping-list">
            <div className="shopping-item">
              <span className="shopping-icon">⚖️</span>
              <span>{t("shopScale")}</span>
            </div>
            <div className="shopping-item">
              <span className="shopping-icon">🌾</span>
              <span>{t("shopWhiteFlour")}</span>
            </div>
            <div className="shopping-item">
              <span className="shopping-icon">🪵</span>
              <span>{t("shopRyeFlour")}</span>
            </div>
            <div className="shopping-item">
              <span className="shopping-icon">🥣</span>
              <span>{t("shopBran")}</span>
            </div>
            <div className="shopping-item">
              <span className="shopping-icon">💧</span>
              <span>{t("shopWater")}</span>
            </div>
            <div className="shopping-item">
              <span className="shopping-icon">🫙</span>
              <span>{t("shopJar")}</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={goToName}>
            {t("haveEverything")}
          </button>
          <button className="btn btn-secondary" onClick={goBackToStart}>
            {t("goBack")}
          </button>
        </div>
      )}

      {step === "adopt" && (
        <div id="onboard-step-adopt" style={{ width: "100%" }}>
          <p className="onboarding-question">{t("adoptTitle")}</p>

          <div
            className="tip-box"
            style={{
              background: "var(--accent-light)",
              marginBottom: "16px",
              borderLeft: "4px solid var(--success)",
              padding: "12px 16px",
              borderRadius: "12px",
              textAlign: "left",
            }}
          >
            <strong>✅ {t("adoptChecklist")}</strong>
            <div style={{ marginTop: "10px", fontSize: "13px", lineHeight: 1.9, color: "var(--text-secondary)" }}>
              <div>☐ {t("adoptCheck1")}</div>
              <div>☐ {t("adoptCheck2")}</div>
              <div>☐ {t("adoptCheck3")}</div>
            </div>
          </div>

          <div
            className="tip-box success"
            style={{
              marginBottom: "16px",
              background: "var(--bg-card)",
              padding: "12px 16px",
              borderRadius: "12px",
              textAlign: "left",
              borderLeft: "4px solid var(--success)",
            }}
          >
            <strong>🗓️ {t("adoptFirst3Days")}</strong>
            <div style={{ marginTop: "10px", fontSize: "13px", lineHeight: 1.9, color: "var(--text-secondary)" }}>
              <div>
                <strong style={{ color: "var(--accent)" }}>Ziua 1:</strong> {t("adoptDay1")}
              </div>
              <div>
                <strong style={{ color: "var(--accent)" }}>Ziua 2:</strong> {t("adoptDay2")}
              </div>
              <div>
                <strong style={{ color: "var(--accent)" }}>Ziua 3:</strong> {t("adoptDay3")}
              </div>
            </div>
          </div>

          <div
            className="tip-box info"
            style={{
              marginBottom: "16px",
              background: "var(--bg-card)",
              padding: "12px 16px",
              borderRadius: "12px",
              textAlign: "left",
              borderLeft: "4px solid var(--accent)",
            }}
          >
            <strong>💡</strong> {t("adoptTip")}
          </div>

          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "16px 0 12px", fontWeight: 600 }}>
            {t("adoptSourcesTitle")}
          </p>
          <div className="adopt-sources">
            <div className="source-item">
              <div className="source-icon">👨‍👩‍👧</div>
              <div>
                <div className="source-name">{t("adoptFriends")}</div>
                <div className="source-desc">{t("adoptFriendsDesc")}</div>
              </div>
            </div>
            <div className="source-item">
              <div className="source-icon">🏪</div>
              <div>
                <div className="source-name">{t("adoptBakery")}</div>
                <div className="source-desc">{t("adoptBakeryDesc")}</div>
              </div>
            </div>
            <div className="source-item">
              <div className="source-icon">📱</div>
              <div>
                <div className="source-name">{t("adoptGroups")}</div>
                <div className="source-desc">{t("adoptGroupsDesc")}</div>
              </div>
            </div>
            <div className="source-item">
              <div className="source-icon">ðŸ›’</div>
              <div>
                <div className="source-name">{t("adoptShop")}</div>
                <div className="source-desc">{t("adoptShopDesc")}</div>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={goToName}>
            {t("gotStarter")}
          </button>
          <button className="btn btn-secondary" onClick={goBackToStart}>
            {t("goBack")}
          </button>
        </div>
      )}

      {step === "name" && (
        <div id="onboard-step-name" style={{ width: "100%" }}>
          <p className="onboarding-question" id="name-question">
            {nameQuestion}
          </p>
          <input
            type="text"
            className="onboarding-input"
            placeholder="ex: Pufi, Maya, Dora..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleFinish}>
            {t("letsStart")}
          </button>
        </div>
      )}

      <div className="lang-grid">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            className={`lang-btn ${language === lang.code ? "active" : ""}`}
            onClick={() => {
              setLanguage(lang.code);
              i18n.changeLanguage(lang.code);
            }}
            data-lang={lang.code}
          >
            <span className="lang-flag">{lang.flag}</span>
            <span className="lang-name">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default OnboardingPage;
