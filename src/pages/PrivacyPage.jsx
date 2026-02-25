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

function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="section">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <Icon name="note" size={24} style={{ color: "var(--accent)" }} />
        <h2 className="section-title" style={{ margin: 0 }}>
          {t("privacyTitle", "Privacy Policy")}
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
        {t("privacyLastUpdated", "Last updated: February 2026")}
      </div>

      <Section title={t("privacySec1Title", "What data we collect")}>
        <p style={{ marginBottom: "10px" }}>
          {t(
            "privacySec1Body",
            "Rise & Ferment is a progressive web app (PWA) that stores all your data locally on your device using browser localStorage. We do not collect, transmit, or store your personal data on any server."
          )}
        </p>
        <ul style={{ paddingLeft: "18px", marginTop: "8px" }}>
          {[
            t("privacySec1Li1", "Starter names and feeding history — stored only on your device"),
            t("privacySec1Li2", "App preferences (theme, language, units) — stored only on your device"),
            t("privacySec1Li3", "Email address — only if you subscribe to our newsletter via the landing page form (processed by Netlify Forms)"),
          ].map((item, i) => (
            <li key={i} style={{ marginBottom: "6px" }}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={t("privacySec2Title", "Cookies & tracking")}>
        <p>
          {t(
            "privacySec2Body",
            "The app itself does not use cookies or tracking scripts. The landing page (riseandferment.com) may use Netlify Analytics, which is based on server-side log analysis — no cookies, no fingerprinting, fully GDPR-compliant. No third-party advertising or tracking scripts are loaded."
          )}
        </p>
      </Section>

      <Section title={t("privacySec3Title", "Affiliate links")}>
        <p>
          {t(
            "privacySec3Body",
            "Our Shop section contains affiliate links to Amazon. When you click these links and make a purchase, we may earn a commission at no extra cost to you. Amazon may set their own cookies after you arrive on their site — please review their privacy policy."
          )}
        </p>
      </Section>

      <Section title={t("privacySec4Title", "Email newsletter")}>
        <p>
          {t(
            "privacySec4Body",
            "If you subscribe to our newsletter or download the free starter guide, your email address is collected via Netlify Forms. We use this to send you sourdough tips and occasional product recommendations. You can unsubscribe at any time by clicking the link in any email. We do not sell or share your email with third parties."
          )}
        </p>
      </Section>

      <Section title={t("privacySec5Title", "Your rights (GDPR)")}>
        <p style={{ marginBottom: "10px" }}>
          {t(
            "privacySec5Body",
            "If you are in the EU, you have the right to access, correct, or delete any personal data we hold about you. Since most data is stored locally on your device, you can delete it at any time via Settings → Reset Data. For newsletter-related requests, contact us at:"
          )}
        </p>
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "10px",
            padding: "12px",
            fontFamily: "monospace",
            fontSize: "13px",
            color: "var(--accent)",
          }}
        >
          hello@riseandferment.com
        </div>
      </Section>

      <Section title={t("privacySec6Title", "Data security")}>
        <p>
          {t(
            "privacySec6Body",
            "Your feeding data never leaves your device. It is stored in browser localStorage and is not accessible to us or any third party. You can export or delete your data at any time from the Settings page."
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
        {t("privacyContact", "Questions? Contact us at hello@riseandferment.com")}
      </div>
    </div>
  );
}

export default PrivacyPage;
