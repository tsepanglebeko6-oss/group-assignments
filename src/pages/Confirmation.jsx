import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRequest } from "../services/requestService.js";
import { services } from "../data/services.js";
import Message from "../components/Message.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useLang } from "../context/LanguageContext.jsx";

export default function Confirmation() {
  const { requestId } = useParams();
  const { t, pick } = useLang();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequest(requestId)
      .then(setRequest)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [requestId]);

  if (loading) return <div className="page"><p>{t("conf.loading")}</p></div>;
  if (error) return <div className="page"><Message type="error">{error}</Message></div>;
  if (!request) return <div className="page"><h1>{t("conf.notFound")}</h1><Link className="btn" to="/services">{t("services.back")}</Link></div>;

  const match = services.find((s) => s.id === request.serviceId);
  const serviceLabel = match ? pick(match.name) : request.serviceName;

  return (
    <div className="page narrow">
      <Message type="success">{t("conf.success")}</Message>
      <h1>{t("conf.title")}</h1>
      <dl className="details">
        <dt>{t("conf.reference")}</dt><dd>{request.id}</dd>
        <dt>{t("form.name")}</dt><dd>{request.name}</dd>
        <dt>{t("form.studentId")}</dt><dd>{request.studentId}</dd>
        <dt>{t("form.email")}</dt><dd>{request.email}</dd>
        <dt>{t("req.service")}</dt><dd>{serviceLabel}</dd>
        <dt>{t("form.reason")}</dt><dd>{request.description}</dd>
        <dt>{t("req.date")}</dt><dd>{request.date}</dd>
        {request.paymentRef && <><dt>{t("conf.paymentRef")}</dt><dd>{request.paymentRef}</dd></>}
        <dt>{t("conf.status")}</dt><dd><StatusBadge status={request.status} /></dd>
      </dl>
      {match?.issues && (
        request.status === "Completed" && request.verifyCode ? (
          <div className="issued">
            <p><strong>{t("conf.code")}:</strong> {request.verifyCode}</p>
            <Link className="btn" to={`/${match.issues === "card" ? "card" : "document"}/${request.id}`}>
              {match.issues === "card" ? t("conf.openCard") : t("conf.openLetter")}
            </Link>
          </div>
        ) : request.status !== "Rejected" && (
          <Message type="info">{match.issues === "card" ? t("conf.pendingCard") : t("conf.pendingLetter")}</Message>
        )
      )}
      <div className="actions">
        <Link className="btn" to="/services">{t("services.back")}</Link>
        <Link className="btn btn-outline" to="/requests">{t("conf.viewAll")}</Link>
      </div>
    </div>
  );
}
