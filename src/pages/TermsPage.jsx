import { useTranslation } from "react-i18next";
import Icon from "../components/common/Icon";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "var(--text-primary)",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>
      <div
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          lineHeight: "1.7",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="section">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <Icon name="clipboard" size={24} style={{ color: "var(--accent)" }} />
        <h2 className="section-title" style={{ margin: 0 }}>
          {t("termsTitle", "Terms of Service")}
        </h2>
      </div>

      <div
        style={{
          background: "var(--bg-secondary)",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "24px",
          fontSize: "13px",
          color: "var(--text-muted)",
        }}
      >
        {t("termsLastUpdated", "Last updated: February 2026")}
      </div>

      <Section title={t("termsSec1Title", "Acceptance of terms")}>
        <p>
          {t(
            "termsSec1Body",
            "By using Rise & Ferment (the \"App\"), you agree to these Terms of Service. If you do not agree, please do not use the App. These terms apply to both the web app (app.riseandferment.com) and the landing page (riseandferment.com)."
          )}
        </p>
      </Section>

      <Section title={t("termsSec2Title", "What the App does")}>
        <p>
          {t(
            "termsSec2Body",
            "Rise & Ferment is a free tool to help you track your sourdough starter. It provides feeding reminders, progress tracking, recipes, and educational content. All data is stored locally on your device. The App is provided \"as is\" and is intended for informational and personal use only."
          )}
        </p>
      </Section>

      <Section title={t("termsSec3Title", "User responsibilities")}>
        <ul style={{ paddingLeft: "18px" }}>
          {[
            t("termsSec3Li1", "You are responsible for the accuracy of data you enter"),
            t("termsSec3Li2", "Do not use the App for commercial food production without appropriate professional guidance"),
            t("termsSec3Li3", "Food safety is your responsibility — our content is educational, not a substitute for professional advice"),
            t("termsSec3Li4", "Keep your device and browser updated for security"),
          ].map((item, i) => (
            <li key={i} style={{ marginBottom: "8px" }}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={t("termsSec4Title", "Intellectual property")}>
        <p>
          {t(
            "termsSec4Body",
            "All content in Rise & Ferment — including text, icons, recipes, and guides — is owned by Rise & Ferment and protected by copyright. You may use the App for personal, non-commercial purposes. You may not copy, reproduce, or redistribute our content without written permission."
          )}
        </p>
      </Section>

      <Section title={t("termsSec5Title", "Affiliate links & no endorsement")}>
        <p>
          {t(
            "termsSec5Body",
            "Our Shop section contains affiliate links. We earn a commission when you purchase through these links, at no additional cost to you. Product recommendations are based on our genuine assessment of quality. We are not responsible for the products, services, or content of third-party websites."
          )}
        </p>
      </Section>

      <Section title={t("termsSec6Title", "Disclaimer of warranties")}>
        <p>
          {t(
            "termsSec6Body",
            "The App and its content are provided \"as is\" without warranties of any kind. We do not guarantee that the App will be error-free, uninterrupted, or suitable for your specific needs. Sourdough baking involves natural biological processes — results may vary and we cannot guarantee specific outcomes."
          )}
        </p>
      </Section>

      <Section title={t("termsSec7Title", "Limitation of liability")}>
        <p>
          {t(
            "termsSec7Body",
            "To the fullest extent permitted by law, Rise & Ferment shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App. Our total liability shall not exceed €50."
          )}
        </p>
      </Section>

      <Section title={t("termsSec8Title", "Changes to terms")}>
        <p>
          {t(
            "termsSec8Body",
            "We may update these Terms from time to time. Continued use of the App after changes constitutes acceptance of the new terms. We will note the date of the last update at the top of this page."
          )}
        </p>
      </Section>

      <Section title={t("termsSec9Title", "Governing law")}>
        <p>
          {t(
            "termsSec9Body",
            "These terms are governed by the laws of Romania and the European Union. Any disputes shall be resolved in the courts of Romania."
          )}
        </p>
      </Section>

      <div
        style={{
          marginTop: "32px",
          padding: "16px",
          background: "var(--bg-secondary)",
          borderRadius: "12px",
          fontSize: "13px",
          color: "var(--text-muted)",
          textAlign: "center",
        }}
      >
        {t("termsContact", "Questions? Contact us at hello@riseandferment.com")}
      </div>
    </div>
  );
}

export default TermsPage;
