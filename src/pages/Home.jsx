import { Link } from "react-router-dom";
import { services } from "../data/services.js";
import { faqs } from "../data/faqs.js";
import Faq from "../components/Faq.jsx";
import { useLang } from "../context/LanguageContext.jsx";

export default function Home() {
  const { t, pick } = useLang();
  return (
    <div className="page">
      <section className="hero">
        <h1>{t("home.title1")}<br />{t("home.title2")}</h1>
        <p className="lead">{t("home.lead")}</p>
        <div className="actions">
          <Link className="btn" to="/services">{t("home.browse")}</Link>
          <Link className="btn btn-outline" to="/request">{t("home.make")}</Link>
        </div>
      </section>
      <section>
        <h2>{t("home.what")}</h2>
        <div className="stack">
          {services.map((s) => (
            <Link key={s.id} to={`/services/${s.id}`} className="stack-item">{pick(s.name)}</Link>
          ))}
        </div>
      </section>
      <section className="faq-section">
        <h2>{t("home.faq")}</h2>
        <Faq items={faqs} />
      </section>
    </div>
  );
}
