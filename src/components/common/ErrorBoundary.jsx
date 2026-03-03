import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App error:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  handleReset = () => {
    localStorage.removeItem("riseFermentStarters");
    localStorage.removeItem("riseFermentSettings");
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            fontFamily: "Nunito, sans-serif",
            color: "var(--text-primary, #3D2914)",
            background: "var(--bg-primary, #FFFBF5)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "48px" }}>&#x1F35E;</div>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Something went wrong</h2>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.7, maxWidth: "300px" }}>
            The app encountered an unexpected error. You can try again or reset to start fresh.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: "10px 24px",
                borderRadius: "12px",
                border: "none",
                background: "var(--accent, #8B5A2B)",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <button
              onClick={this.handleReset}
              style={{
                padding: "10px 24px",
                borderRadius: "12px",
                border: "1px solid var(--border, #ddd)",
                background: "transparent",
                color: "var(--text-secondary, #666)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Reset App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
