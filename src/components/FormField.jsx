import { useLang } from "../context/LanguageContext.jsx";

// Reusable component (props): label + control + error message.
// `error` is a translation key, so it updates when the language changes.
export default function FormField({ label, name, error, children }) {
  const { t } = useLang();
  return (
    <div className={error ? "field has-error" : "field"}>
      <label htmlFor={name}>{label}</label>
      {children}
      {error && <p className="error" role="alert">{t(error)}</p>}
    </div>
  );
}
