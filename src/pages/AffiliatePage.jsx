import { useTranslation } from "react-i18next";
import Icon from "../components/common/Icon";

function AffiliatePage() {
  const { t } = useTranslation();

  const programs = [
    {
      name: "Amazon Associates UK",
      commission: "3–10%",
      region: t("affiliateRegionGlobal", "Global"),
      note: t("affiliateAmazonNote", "Products in our Shop with \"View on Amazon\" links. Commission varies by category."),
    },
  ];

  return (
    <div className="section">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <Icon name="handshake" size={24} style={{ color: "var(--accent)" }} />
        <h2 className="section-title" style={{ margin: 0 }}>
          {t("affiliateTitle", "Affiliate Disclosure")}
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
        {t("affiliateLastUpdated", "Last updated: February 2026")}
      </div>

      {/* Main disclosure */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--bg-secondary), var(--accent-light))",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "28px",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <Icon name="info" size={20} style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }} />
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            {t(
              "affiliateMainDisclosure",
              "Rise & Ferment participates in affiliate marketing programs. This means we earn a small commission when you purchase products through links on our site, at no additional cost to you. This is how we keep the app free for everyone."
            )}
          </p>
        </div>
      </div>

      {/* Our promise */}
      <div style={{ marginBottom: "28px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "14px",
          }}
        >
          {t("affiliatePromiseTitle", "Our promise to you")}
        </h3>
        {[
          {
            icon: "circle-check",
            text: t("affiliateP1", "We only recommend products we genuinely believe in and would use ourselves"),
          },
          {
            icon: "circle-check",
            text: t("affiliateP2", "Affiliate relationships never influence our editorial content or reviews"),
          },
          {
            icon: "circle-check",
            text: t("affiliateP3", "Prices shown are approximate — always verify the current price on the retailer's site"),
          },
          {
            icon: "circle-check",
            text: t("affiliateP4", "We clearly mark affiliate links with rel=\"sponsored\" for transparency"),
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              marginBottom: "12px",
            }}
          >
            <Icon name={item.icon} size={18} style={{ color: "var(--success)", flexShrink: 0, marginTop: "1px" }} />
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: "1.6" }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* Programs table */}
      <div style={{ marginBottom: "28px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "var(--text-primary)",
            marginBottom: "14px",
          }}
        >
          {t("affiliateProgramsTitle", "Affiliate programs we participate in")}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {programs.map((prog) => (
            <div
              key={prog.name}
              style={{
                background: "var(--bg-secondary)",
                borderRadius: "12px",
                padding: "14px 16px",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-primary)" }}>
                  {prog.name}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                    padding: "2px 8px",
                    borderRadius: "20px",
                    fontWeight: "600",
                  }}
                >
                  {prog.commission}
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginBottom: "6px",
                }}
              >
                {prog.region}
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                {prog.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FTC compliance */}
      <div
        style={{
          background: "var(--bg-secondary)",
          borderRadius: "12px",
          padding: "16px",
          fontSize: "13px",
          color: "var(--text-muted)",
          lineHeight: "1.6",
        }}
      >
        <strong style={{ color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
          {t("affiliateFTCTitle", "FTC & EU compliance")}
        </strong>
        {t(
          "affiliateFTCBody",
          "This disclosure is made in compliance with the FTC guidelines (16 CFR Part 255) and EU Directive 2005/29/EC on commercial practices. We are a participant in the Amazon EU Associates Programme."
        )}
      </div>

      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          background: "var(--bg-secondary)",
          borderRadius: "12px",
          fontSize: "13px",
          color: "var(--text-muted)",
          textAlign: "center",
        }}
      >
        {t("affiliateContact", "Questions? Contact us at hello@riseandferment.com")}
      </div>
    </div>
  );
}

export default AffiliatePage;
