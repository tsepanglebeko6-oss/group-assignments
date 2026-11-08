import { Component } from "react";
import { LanguageContext } from "../context/LanguageContext.jsx";

// Catches unexpected rendering errors so the whole app doesn't go blank.
// Must sit INSIDE <LanguageProvider> so its message can be translated.
export default class ErrorBoundary extends Component {
  static contextType = LanguageContext;
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error("UI error:", error, info); }
  render() {
    if (this.state.hasError) {
      const { t } = this.context;
      return (
        <div className="container page">
          <h1>{t("eb.title")}</h1>
          <p>{t("eb.text")}</p>
          <button className="btn" onClick={() => window.location.assign("/")}>{t("eb.reload")}</button>
        </div>
      );
    }
    return this.props.children;
  }
}
