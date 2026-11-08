import { Link, useNavigate, useParams } from "react-router-dom";
import { services } from "../data/services.js";
import { useLang } from "../context/LanguageContext.jsx";
import { CURRENCY } from "../config/institution.js";

export default function ServiceDetails() {
  const { serviceId } = useParams(); // dynamic route parameter
  const navigate = useNavigate();
  const { t, pick } = useLang();
  const service = services.find((s) => s.id === serviceId);

  // Conditional rendering
  if (!service) {
    return (
      <>
        <h1>{t("services.notFound")}</h1>
        <p>{t("services.notFoundText")} “{serviceId}”.</p>
        <Link className="btn" to="/services">{t("services.back")}</Link>
      </>
    );
  }

  return (
    <>
      <Link to="/services" className="back">{t("services.all")}</Link>
      <h1>{pick(service.name)}</h1>
      <p className="lead">{pick(service.description)}</p>
      <dl className="details">
        <dt>{t("services.dept")}</dt><dd>{pick(service.department)}</dd>
        <dt>{t("services.time")}</dt><dd>{pick(service.processingTime)}</dd>
        {service.fee && <><dt>{t("services.fee")}</dt><dd>{CURRENCY}{service.fee}. {t("services.feeNote")}</dd></>}
      </dl>
      <button className="btn" onClick={() => navigate("/request", { state: { serviceId: service.id } })}>
        {t("services.request")}
      </button>
    </>
  );
}
