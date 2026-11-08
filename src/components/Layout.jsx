import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { useLang } from "../context/LanguageContext.jsx";

export default function Layout() {
  const { t } = useLang();
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">{t("footer")}</div>
      </footer>
    </>
  );
}
