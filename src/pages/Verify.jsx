import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { findByCode } from "../services/requestService.js";
import { formatDate, formatDateTime, isExpired, normaliseCode } from "../utils/codes.js";
import { LETTER_TITLES } from "../utils/letters.js";
import FormField from "../components/FormField.jsx";
import Message from "../components/Message.jsx";
import { useLang } from "../context/LanguageContext.jsx";

// Anyone (e.g. a security guard or a company) can check a letter or card by its code.
export default function Verify() {
  const { code: codeParam } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const [input, setInput] = useState(codeParam || "");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);

  const check = async (raw) => {
    setServerError("");
    if (!raw.trim()) { setError("verify.err"); return; }
    setError("");
    setLoading(true);
    try {
      const found = await findByCode(normaliseCode(raw));
      setResult(found);
      setSearched(true);
    } catch (e) {
      setServerError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Scanning/opening a printed link /verify/CODE checks straight away
  useEffect(() => {
    if (codeParam) check(codeParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) { setError("verify.err"); return; }
    navigate(`/verify/${normaliseCode(input)}`);
  };

  let state = null;
  if (result) {
    const isCard = Boolean(result.cardNo);
    if (result.status !== "Completed") state = "revoked";
    else if (isCard && isExpired(result.validUntil)) state = "expired";
    else state = "valid";
  }

  return (
    <div className="page narrow">
      <h1>{t("verify.title")}</h1>
      <p className="lead">{t("verify.lead")}</p>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label={t("verify.code")} name="code" error={error}>
          <input id="code" name="code" value={input} onChange={(e) => setInput(e.target.value)} autoCapitalize="characters" placeholder="ABCD-2345" />
        </FormField>
        <button className="btn" type="submit" disabled={loading}>{t("verify.check")}</button>
      </form>
      <Message type="error">{serverError}</Message>
      {searched && !result && <Message type="error">{t("verify.notFound")}</Message>}
      {result && (
        <div className={`verify-result verify-${state}`}>
          <h2>{state === "valid" ? t("verify.valid") : state === "expired" ? t("verify.expired") : t("verify.revoked")}</h2>
          <dl className="details">
            <dt>{t("verify.type")}</dt>
            <dd>{result.cardNo ? t("verify.card") : `${t("verify.letter")} — ${LETTER_TITLES[result.serviceId] || ""}`}</dd>
            <dt>{t("verify.issuedTo")}</dt><dd>{result.name} ({result.studentId})</dd>
            <dt>{t("verify.issuedOn")}</dt><dd>{result.cardNo ? formatDateTime(result.issuedAt) : formatDate(result.issuedAt)}</dd>
            {result.cardNo && <><dt>{t("verify.validUntil")}</dt><dd>{formatDateTime(result.validUntil)}</dd></>}
          </dl>
        </div>
      )}
    </div>
  );
}
