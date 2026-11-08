import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { services } from "../data/services.js";
import { validateRequest } from "../utils/validate.js";
import { createRequest } from "../services/requestService.js";
import FormField from "../components/FormField.jsx";
import Message from "../components/Message.jsx";
import { useLang } from "../context/LanguageContext.jsx";
import { CURRENCY, REPLACEMENT_FEE } from "../config/institution.js";

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = { name: "", studentId: "", email: "", serviceId: "", description: "", paymentRef: "", date: today() };

export default function RequestPage() {
  const { t, pick } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Pre-select the service chosen on the details page
  useEffect(() => {
    if (location.state?.serviceId) {
      setValues((v) => ({ ...v, serviceId: location.state.serviceId }));
    }
  }, [location.state]);

  const isIdReplacement = values.serviceId === "student-id";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const found = validateRequest(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const service = services.find((s) => s.id === values.serviceId);
    setSubmitting(true);
    try {
      const id = await createRequest({
        name: values.name.trim(),
        studentId: values.studentId.trim(),
        email: values.email.trim(),
        serviceId: service.id,
        serviceName: service.name.en, // stored in English for records
        description: values.description.trim(),
        date: values.date,
        ...(isIdReplacement && { paymentRef: values.paymentRef.trim(), fee: REPLACEMENT_FEE }),
      });
      setValues({ ...emptyForm, date: today() }); // clear form
      navigate(`/confirmation/${id}`); // programmatic navigation
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page narrow">
      <h1>{t("form.title")}</h1>
      <p className="lead">{t("form.lead")}</p>
      <Message type="error">{serverError}</Message>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label={t("form.name")} name="name" error={errors.name}>
          <input id="name" name="name" value={values.name} onChange={handleChange} autoComplete="name" />
        </FormField>
        <FormField label={t("form.studentId")} name="studentId" error={errors.studentId}>
          <input id="studentId" name="studentId" value={values.studentId} onChange={handleChange} />
        </FormField>
        <FormField label={t("form.email")} name="email" error={errors.email}>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} autoComplete="email" />
        </FormField>
        <FormField label={t("form.service")} name="serviceId" error={errors.serviceId}>
          <select id="serviceId" name="serviceId" value={values.serviceId} onChange={handleChange}>
            <option value="">{t("form.select")}</option>
            {services.map((s) => <option key={s.id} value={s.id}>{pick(s.name)}</option>)}
          </select>
        </FormField>
        {isIdReplacement && (
          <>
            <Message type="info">{t("form.paymentHelp")} ({CURRENCY}{REPLACEMENT_FEE})</Message>
            <FormField label={t("form.paymentRef")} name="paymentRef" error={errors.paymentRef}>
              <input id="paymentRef" name="paymentRef" value={values.paymentRef} onChange={handleChange} />
            </FormField>
          </>
        )}
        <FormField label={t("form.reason")} name="description" error={errors.description}>
          <textarea id="description" name="description" rows="5" value={values.description} onChange={handleChange} />
        </FormField>
        <FormField label={t("form.date")} name="date" error={errors.date}>
          <input id="date" name="date" type="date" value={values.date} onChange={handleChange} />
        </FormField>
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? t("form.submitting") : t("form.submit")}
        </button>
      </form>
    </div>
  );
}
