import { useLang } from "../context/LanguageContext.jsx";

const OPTIONS = [
  { code: "en", label: "English" },
  { code: "st", label: "Sesotho" },
];

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="lang" role="group" aria-label={t("nav.language")}>
      {OPTIONS.map((o) => (
        <button key={o.code} type="button" className={lang === o.code ? "lang-btn active" : "lang-btn"} aria-pressed={lang === o.code} onClick={() => setLang(o.code)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
