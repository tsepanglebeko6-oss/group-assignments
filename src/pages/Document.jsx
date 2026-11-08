import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRequest } from "../services/requestService.js";
import { services } from "../data/services.js";
import { INSTITUTION, SIGNATORIES } from "../config/institution.js";
import { LETTER_TITLES, defaultLetterBody } from "../utils/letters.js";
import { formatDate } from "../utils/codes.js";
import EStamp from "../components/EStamp.jsx";
import Message from "../components/Message.jsx";
import { useLang } from "../context/LanguageContext.jsx";

// Official letter with electronic stamp and automatic signature.
// The letter text itself stays in English (it is an official document).
export default function Document() {
  const { requestId } = useParams();
  const { t } = useLang();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequest(requestId).then(setRequest).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [requestId]);

  if (loading) return <div className="page"><p>{t("conf.loading")}</p></div>;
  if (error) return <div className="page"><Message type="error">{error}</Message></div>;

  const service = request && services.find((s) => s.id === request.serviceId);
  const issued = request && service?.issues === "letter" && request.status === "Completed" && request.verifyCode;
  if (!issued) {
    return (
      <div className="page">
        <h1>{t("doc.notIssued")}</h1>
        <Link className="btn" to={request ? `/confirmation/${request.id}` : "/services"}>{t("doc.back")}</Link>
      </div>
    );
  }

  const signatory = SIGNATORIES[request.serviceId];
  const body = request.letterBody || defaultLetterBody(request);
  const verifyUrl = `${window.location.origin}/verify/${request.verifyCode}`;

  return (
    <div className="page">
      <div className="no-print actions">
        <button className="btn" onClick={() => window.print()}>{t("doc.print")}</button>
        <Link className="btn btn-outline" to={`/confirmation/${request.id}`}>{t("doc.back")}</Link>
      </div>
      <article className="paper">
        <header className="letterhead">
          <strong>{INSTITUTION.name}</strong>
          <span>{signatory.office}</span>
        </header>
        <p className="doc-meta">Ref: {request.verifyCode}<br />Date: {formatDate(request.issuedAt)}</p>
        <h1 className="doc-title">{LETTER_TITLES[request.serviceId]}</h1>
        <p>To whom it may concern,</p>
        {body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
        <div className="sign-row">
          <div className="signature">
            <span className="sig-script">{signatory.name}</span>
            <div className="sig-line" />
            <strong>{signatory.name}</strong>
            <span>{signatory.title}</span>
            <small>Digitally signed on {formatDate(request.issuedAt)}</small>
          </div>
          <EStamp office={signatory.office} date={formatDate(request.issuedAt)} />
        </div>
        <footer className="doc-foot">
          This letter was issued electronically and carries an electronic stamp and signature. Verify its authenticity at {verifyUrl} or on the Verify page using code {request.verifyCode}.
        </footer>
      </article>
    </div>
  );
}
