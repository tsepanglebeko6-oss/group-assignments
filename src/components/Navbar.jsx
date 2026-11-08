import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import { useLang } from "../context/LanguageContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const close = () => setOpen(false);
  const cls = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>LIMKOKWING <span>{t("brand.sub")}</span></Link>
        <button className="menu-btn" aria-expanded={open} aria-label={t("nav.menu")} onClick={() => setOpen(!open)}>
          {open ? t("nav.close") : t("nav.menu")}
        </button>
        <nav className={open ? "nav open" : "nav"}>
          <NavLink to="/" end className={cls} onClick={close}>{t("nav.home")}</NavLink>
          <NavLink to="/services" className={cls} onClick={close}>{t("nav.services")}</NavLink>
          <NavLink to="/request" className={cls} onClick={close}>{t("nav.new")}</NavLink>
          <NavLink to="/requests" className={cls} onClick={close}>{t("nav.all")}</NavLink>
          <NavLink to="/track" className={cls} onClick={close}>{t("nav.track")}</NavLink>
          <NavLink to="/verify" className={cls} onClick={close}>{t("nav.verify")}</NavLink>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
