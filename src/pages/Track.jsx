import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField.jsx";
import { useLang } from "../context/LanguageContext.jsx";

export default function Track() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [ref, setRef] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ref.trim()) { setError("track.err"); return; }
    navigate(`/confirmation/${ref.trim()}`);
  };

  return (
    <div className="page narrow">
      <h1>{t("track.title")}</h1>
      <p className="lead">{t("track.lead")}</p>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label={t("track.ref")} name="ref" error={error}>
          <input id="ref" name="ref" value={ref} onChange={(e) => { setRef(e.target.value); setError(""); }} />
        </FormField>
        <button className="btn" type="submit">{t("track.go")}</button>
      </form>
    </div>
  );
}
