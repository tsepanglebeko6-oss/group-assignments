import { useLang } from "../context/LanguageContext.jsx";

export default function StatusBadge({ status }) {
  const { t } = useLang();
  return <span className={`badge badge-${status.toLowerCase().replace(" ", "-")}`}>{t(`status.${status}`)}</span>;
}
