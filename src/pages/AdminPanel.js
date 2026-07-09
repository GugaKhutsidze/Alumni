import { Outlet, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./AdminPanel.css";

const AdminPanel = () => {
  const { t } = useTranslation();

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>{t("Menu")}</h2>

        <nav className="admin-nav">
          <NavLink
            to="/AdminPanel/AddEvent"
            className="admin-nav-link"
          >
            {t("Add Event")}
          </NavLink>

          <NavLink
            to="/AdminPanel/AddJob"
            className="admin-nav-link"
          >
            {t("Add Job")}
          </NavLink>

          <NavLink
            to="/AdminPanel/Alumni"
            className="admin-nav-link"
          >
            {t("Alumni")}
          </NavLink>
          <NavLink
            to="/AdminPanel/AddNews"
            className="admin-nav-link"
          >
            {t("Add News")}
          </NavLink>
          <NavLink
            to="/AdminPanel/AdminStats"
            className="admin-nav-link"
          >
            {t("Statistics")}
          </NavLink>  
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;