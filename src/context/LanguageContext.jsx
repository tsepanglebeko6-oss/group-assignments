import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations.js";

export const LanguageContext = createContext(null);
const STORAGE_KEY = "lang";

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "st") return saved;
  } catch { /* storage unavailable: fall back to English */ }
  return "en";
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang; // "st" is the ISO code for Sesotho
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
  }, [lang]);

  // t("key") returns UI text; falls back to English, then to the key itself
  const t = useCallback((key) => translations[lang][key] ?? translations.en[key] ?? key, [lang]);
  // pick({en, st}) returns the right language from a data object (services, FAQs)
  const pick = useCallback((obj) => (obj ? obj[lang] ?? obj.en : ""), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, pick }), [lang, t, pick]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
