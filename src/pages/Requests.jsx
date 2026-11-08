import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteRequest, extendVirtualCard, fetchRequests, updateLetterBody, updatePayment, updateRequestStatus } from "../services/requestService.js";
import { STATUSES, services } from "../data/services.js";
import { defaultLetterBody } from "../utils/letters.js";
import Message from "../components/Message.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useLang } from "../context/LanguageContext.jsx";

export default function Requests() {
  const { t, pick } = useLang();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    fetchRequests()
      .then(setRequests)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const serviceOf = (r) => services.find((s) => s.id === r.serviceId);
  const serviceLabel = (r) => (serviceOf(r) ? pick(serviceOf(r).name) : r.serviceName);

  // Runs a Firestore update, then merges the returned changes into the list
  const apply = async (r, action, message) => {
    setError(""); setNotice("");
    try {
      const changes = await action();
      setRequests((list) => list.map((x) => (x.id === r.id ? { ...x, ...changes } : x)));
      setNotice(message);
    } catch (e) { setError(e.message); }
  };

  const handleStatus = (r, status) => apply(r, () => updateRequestStatus(r, status), t("req.updated"));

  const startEdit = (r) => {
    setEditingId(r.id);
    setDraft(r.letterBody || defaultLetterBody({ ...r, issuedAt: r.issuedAt || new Date().toISOString() }));
  };

  const saveEdit = async (r) => {
    await apply(r, () => updateLetterBody(r.id, draft), t("req.letterSaved"));
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("req.confirmDelete"))) return;
    setError(""); setNotice("");
    try {
      await deleteRequest(id);
      setRequests((list) => list.filter((r) => r.id !== id));
      setNotice(t("req.deleted"));
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="page">
      <h1>{t("req.title")}</h1>
      <Message type="error">{error}</Message>
      <Message type="success">{notice}</Message>
      {loading && <p>{t("req.loading")}</p>}
      {!loading && requests.length === 0 && !error && (
        <p>{t("req.none")} <Link to="/request">{t("req.first")}</Link></p>
      )}
      <div className="table-wrap">
        {requests.length > 0 && (
          <table>
            <thead>
              <tr><th>{t("req.student")}</th><th>{t("req.service")}</th><th>{t("req.date")}</th><th>{t("req.status")}</th><th>{t("req.document")}</th><th>{t("req.actions")}</th></tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const svc = serviceOf(r);
                return (
                  <Fragment key={r.id}>
                    <tr>
                      <td><strong>{r.name}</strong><br /><span className="meta">{r.studentId}</span></td>
                      <td>{serviceLabel(r)}</td>
                      <td>{r.date}</td>
                      <td>
                        <StatusBadge status={r.status} />
                        <select aria-label={`${t("req.changeFor")} ${r.name}`} value={r.status} onChange={(e) => handleStatus(r, e.target.value)}>
                          {STATUSES.map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                        </select>
                      </td>
                      <td>
                        {r.verifyCode ? (
                          <>
                            <Link to={`/${r.cardNo ? "card" : "document"}/${r.id}`}>{r.cardNo ? t("req.openCard") : t("req.openLetter")}</Link>
                            <p className="meta">{r.verifyCode}</p>
                          </>
                        ) : <span className="meta">—</span>}
                      </td>
                      <td>
                        <div className="row-actions">
                          {svc?.issues === "letter" && <button className="btn btn-outline btn-sm" onClick={() => startEdit(r)}>{t("req.editLetter")}</button>}
                          {r.cardNo && <button className="btn btn-outline btn-sm" onClick={() => apply(r, () => extendVirtualCard(r.id), t("req.cardExtended"))}>{t("req.extend")}</button>}
                          {r.paymentRef && (
                            <label className="check">
                              <input type="checkbox" checked={Boolean(r.paymentConfirmed)} onChange={(e) => apply(r, () => updatePayment(r.id, e.target.checked), t("req.payUpdated"))} />
                              {t("req.confirmPay")}
                              <span className="meta"> · {t("req.payRef")}: {r.paymentRef}</span>
                            </label>
                          )}
                          <button className="btn btn-danger" onClick={() => handleDelete(r.id)}>{t("req.delete")}</button>
                        </div>
                      </td>
                    </tr>
                    {editingId === r.id && (
                      <tr>
                        <td colSpan="6">
                          <textarea aria-label={t("req.editLetter")} rows="9" value={draft} onChange={(e) => setDraft(e.target.value)} />
                          <div className="actions">
                            <button className="btn btn-sm" onClick={() => saveEdit(r)}>{t("req.saveLetter")}</button>
                            <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>{t("req.cancel")}</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
