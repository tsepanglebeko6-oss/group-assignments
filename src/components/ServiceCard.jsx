import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext.jsx";

// Reusable component (receives data through props)
export default function ServiceCard({ service }) {
  const { t, pick } = useLang();
  return (
    <article className="card">
      <p className="meta">{pick(service.department)}</p>
      <h3>{pick(service.name)}</h3>
      <p>{pick(service.description)}</p>
      <p className="meta">{t("services.time")}: {pick(service.processingTime)}</p>
      <Link className="btn btn-outline" to={`/services/${service.id}`}>{t("services.view")}</Link>
    </article>
  );
}
