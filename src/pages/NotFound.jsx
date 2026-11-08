import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="page">
      <h1>{t("nf.title")}</h1>
      <p className="lead">{t("nf.text")}</p>
      <Link className="btn" to="/">{t("nf.home")}</Link>
    </div>
  );
}
