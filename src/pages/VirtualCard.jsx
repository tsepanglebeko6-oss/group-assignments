import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRequest } from "../services/requestService.js";
import { INSTITUTION, CURRENCY, REPLACEMENT_FEE } from "../config/institution.js";
import { formatDateTime, timeLeft } from "../utils/codes.js";
import Message from "../components/Message.jsx";
import { useLang } from "../context/LanguageContext.jsx";

// Temporary virtual student card. Card text stays in English; the page around it is translated.
export default function VirtualCard() {
  const { requestId } = useParams();
  const { t } = useLang();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchRequest(requestId).then(setRequest).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [requestId]);

  // Refresh the countdown every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="page"><p>{t("conf.loading")}</p></div>;
  if (error) return <div className="page"><Message type="error">{error}</Message></div>;

  const issued = request && request.status === "Completed" && request.cardNo && request.validUntil;
  if (!issued) {
    return (
      <div className="page">
        <h1>{t("card.notIssued")}</h1>
        <Link className="btn" to={request ? `/confirmation/${request.id}` : "/services"}>{t("doc.back")}</Link>
      </div>
    );
  }

  const expired = new Date(request.validUntil).getTime() <= now;

  return (
    <div className="page">
      <div className="no-print actions">
        <button className="btn" onClick={() => window.print()}>{t("doc.print")}</button>
        <Link className="btn btn-outline" to={`/confirmation/${request.id}`}>{t("doc.back")}</Link>
      </div>
      <div className={expired ? "vcard is-expired" : "vcard"}>
        <div className="vcard-top">
          <strong>{INSTITUTION.shortName}</strong>
          <span className="vcard-tag">TEMPORARY VIRTUAL STUDENT CARD</span>
        </div>
        <div className="vcard-mid">
          <div className="vcard-avatar" aria-hidden="true">{request.name.trim().charAt(0).toUpperCase()}</div>
          <div>
            <p className="vcard-name">{request.name}</p>
            <p className="vcard-line">Student ID: {request.studentId}</p>
            <p className="vcard-line">Card no: {request.cardNo}</p>
          </div>
        </div>
        <div className="vcard-dates">
          <div><small>Valid from</small><br />{formatDateTime(request.issuedAt)}</div>
          <div><small>Valid until</small><br />{formatDateTime(request.validUntil)}</div>
        </div>
        <p className="vcard-code">Verification code: {request.verifyCode}</p>
        <div className="vcard-status">{expired ? "EXPIRED" : "VALID"}</div>
      </div>
      <p className="lead">
        {expired ? t("card.expired") : `${t("card.left")} ${timeLeft(request.validUntil, now)}`}
      </p>
      <p className="no-print">{t("card.note")}</p>
      <p className="meta">Replacement card fee: {CURRENCY}{REPLACEMENT_FEE}</p>
    </div>
  );
}
