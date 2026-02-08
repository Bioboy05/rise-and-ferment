import { useState } from "react";
import { useTranslation } from "react-i18next";
import useStarterStore from "../../store/useStarterStore";

function FeedingModal({ onClose }) {
  const { t } = useTranslation();
  const getActiveStarter = useStarterStore((state) => state.getActiveStarter);
  const updateStarter = useStarterStore((state) => state.updateStarter);
  const addFeeding = useStarterStore((state) => state.addFeeding);

  const starter = getActiveStarter();

  const [amount, setAmount] = useState(starter.feedAmount);
  const [useBran, setUseBran] = useState(false);
  const [temperature, setTemperature] = useState("");
  const [note, setNote] = useState("");

  const changeAmount = (delta) => {
    setAmount((prev) => Math.max(25, Math.min(200, prev + delta)));
  };

  const whiteFlour = useBran ? Math.round(amount * 0.9) : amount;
  const branAmount = useBran ? Math.round(amount * 0.1) : 0;

  const handleSave = () => {
    let validTemp = null;
    if (temperature) {
      const parsed = parseFloat(temperature);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 50) {
        validTemp = parsed;
      }
    }

    const entry = {
      time: Date.now(),
      amount,
      withBran: useBran,
      temp: validTemp,
      note: note.trim() || null,
      flourType: starter.flourType || "white",
    };

    addFeeding(starter.id, entry);
    updateStarter(starter.id, { feedAmount: amount, useBran: false });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "24px 24px 16px 16px",
          width: "100%",
          maxWidth: "448px",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: "24px 20px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontFamily: "Caveat, cursive",
              fontSize: "1.6rem",
              color: "var(--text-primary)",
            }}
          >
            {t("feedTitle")}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-secondary)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              fontSize: "16px",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* 1:1:1 Technique */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--success)",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "20px",
            fontSize: "14px",
            color: "var(--text-secondary)",
          }}
        >
          <strong>🎯 {t("technique111")}</strong>
          <br />
          {t("technique111Desc")}
        </div>

        {/* Amount selector */}
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            marginBottom: "16px",
            fontSize: "14px",
          }}
        >
          {t("howMuchKept")}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "16px",
          }}
        >
          <button
            onClick={() => changeAmount(-25)}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "2px solid var(--border)",
              background: "var(--bg-secondary)",
              fontSize: "20px",
              fontWeight: "700",
              cursor: "pointer",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            −
          </button>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "var(--accent)",
              }}
            >
              {amount}
            </span>
            <span
              style={{
                fontSize: "1.2rem",
                color: "var(--text-muted)",
                marginLeft: "4px",
              }}
            >
              g
            </span>
          </div>
          <button
            onClick={() => changeAmount(25)}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "2px solid var(--border)",
              background: "var(--bg-secondary)",
              fontSize: "20px",
              fontWeight: "700",
              cursor: "pointer",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
        </div>

        {/* Recipe display */}
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "16px",
            fontSize: "14px",
            color: "var(--text-secondary)",
          }}
        >
          <strong>{t("feedAdd")}:</strong>
          <br />• {amount}g {t("feedWaterTemp")}
          <br />•{" "}
          {useBran
            ? `${whiteFlour}g ${t("feedWhiteFlour")} + ${branAmount}g ${t("feedBran")} 🌾`
            : `${amount}g ${t("feedWhiteFlour")}`}
        </div>

        {/* Bran toggle */}
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <strong style={{ color: "var(--text-secondary)" }}>
                🌾 {t("addBran")}
              </strong>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "2px",
                }}
              >
                {t("branHint")}
              </div>
            </div>
            <button
              onClick={() => setUseBran(!useBran)}
              style={{
                width: "48px",
                height: "28px",
                borderRadius: "14px",
                border: "none",
                background: useBran ? "var(--success)" : "var(--bg-tertiary)",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: "3px",
                  left: useBran ? "23px" : "3px",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
          {useBran && (
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                paddingTop: "12px",
                marginTop: "12px",
                borderTop: "1px dashed var(--border)",
              }}
            >
              {t("branMix")}
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "12px",
                  color: "var(--warning)",
                }}
              >
                {t("branWarning")}
              </div>
            </div>
          )}
        </div>

        {/* Feeding steps */}
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-light) 100%)",
            borderRadius: "16px",
            padding: "16px",
            marginBottom: "16px",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "18px" }}>💡</span>
            <strong
              style={{ color: "var(--text-secondary)", fontSize: "14px" }}
            >
              {t("feedTipsTitle")}
            </strong>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "13px",
              color: "var(--text-secondary)",
            }}
          >
            {[
              t("feedStep1"),
              t("feedStep2"),
              t("feedStep3"),
            ].map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px",
                  background: "var(--bg-card)",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    width: "24px",
                    height: "24px",
                    background: "var(--accent)",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Temperature input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            background: "var(--bg-secondary)",
            borderRadius: "12px",
            marginBottom: "12px",
          }}
        >
          <span>🌡️</span>
          <span
            style={{
              flex: 1,
              color: "var(--text-secondary)",
              fontSize: "14px",
            }}
          >
            {t("roomTemp")}
          </span>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="23"
            min="10"
            max="40"
            step="0.5"
            style={{
              width: "60px",
              padding: "6px 8px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "14px",
              textAlign: "center",
              background: "var(--bg-card)",
              color: "var(--text-primary)",
            }}
          />
          <span style={{ color: "var(--text-muted)" }}>°C</span>
        </div>

        {/* Notes */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("notesPlaceholder")}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            fontSize: "14px",
            resize: "none",
            height: "60px",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}
        />

        {/* Buttons */}
        <button
          onClick={handleSave}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "var(--accent)",
            color: "white",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            marginBottom: "8px",
          }}
        >
          {t("saveFeed")}
        </button>
        <button
          onClick={onClose}
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
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

export default FeedingModal;
