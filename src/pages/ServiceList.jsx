import { services } from "../data/services.js";
import ServiceCard from "../components/ServiceCard.jsx";
import { useLang } from "../context/LanguageContext.jsx";

export default function ServiceList() {
  const { t } = useLang();
  return (
    <>
      <h1>{t("services.title")}</h1>
      <p className="lead">{t("services.lead")}</p>
      <div className="grid">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </>
  );
}
