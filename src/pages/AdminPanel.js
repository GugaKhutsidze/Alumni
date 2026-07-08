import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./AdminPanel.css";

const AdminPanel = () => {
  const { t } = useTranslation();

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>{t("Menu")}</h2>

        <nav className="admin-nav">
          <Link to="/AdminPanel/AddEvent" className="admin-nav-link">
            {t("Add Event")}
          </Link>

          <Link to="/AdminPanel/AddJob" className="admin-nav-link">
            {t("Add Job")}
          </Link>

          <Link to="/AdminPanel/Alumni" className="admin-nav-link">
            {t("Alumni")}
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;