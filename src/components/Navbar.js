import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../images/TSU_Logo.png";
import "../App.css";
import { useTranslation } from "react-i18next";


const Navbar = () => {

  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    
    <nav className="navbar">
      <div className="nav-container">

        <div className="logo" onClick={() => navigate("/Home")}>
          <img src={logo} alt="TSU Logo" />
        </div>

        {/* Burger */}
        <div
          className="burger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* Navigation */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {isAuth && (
            <>
              <NavLink to="/Home">{t("Home")}</NavLink>

              <NavLink to="/About">
                {t("About us")}
              </NavLink>

              <NavLink to="/Events">
                {t("Events")}
              </NavLink>

              <NavLink to="/Employment">
                {t("Employment")}
              </NavLink>

              <NavLink to="/Profile">
                {t("Profile")}
              </NavLink>
              <NavLink to="/Alumni">
                {t("Alumni")}
              </NavLink>

              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                {t("Log out")}
              </button>
      <select
  value={i18n.language}
  onChange={(e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("language", e.target.value);
  }}
>
                  <option value="ka">KA</option>
          <option value="en">EN</option>
        </select>
        </>
            )}
        </div>
             
  </div>
    </nav>
  );
};

export default Navbar;