import { useState } from "react";
import { useTranslation } from "react-i18next";
import useStarterStore from "../../store/useStarterStore";
import useSettingsStore from "../../store/useSettingsStore";
import Modal from "../common/Modal";
import Toggle from "../common/Toggle";

function FeedingModal({ onClose }) {
  const { t } = useTranslation();
  const getActiveStarter = useStarterStore((state) => state.getActiveStarter);
  const updateStarter = useStarterStore((state) => state.updateStarter);
  const addFeeding = useStarterStore((state) => state.addFeeding);

  const tempUnit = useSettingsStore((state) => state.tempUnit);
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
      const maxTemp = tempUnit === "f" ? 122 : 50;
      if (!isNaN(parsed) && parsed >= 0 && parsed <= maxTemp) {
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
    <Modal onClose={onClose} title={t("feedTitle")}>
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
        <Toggle
          checked={useBran}
          onChange={setUseBran}
          label={`🌾 ${t("addBran")}`}
          description={t("branHint")}
        />
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
          inputMode="decimal"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          placeholder={tempUnit === "f" ? "73" : "23"}
          min={tempUnit === "f" ? "50" : "10"}
          max={tempUnit === "f" ? "104" : "40"}
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
        <span style={{ color: "var(--text-muted)" }}>{tempUnit === "f" ? "°F" : "°C"}</span>
      </div>

      {/* Notes */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={500}
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
    </Modal>
  );
}

export default FeedingModal;
