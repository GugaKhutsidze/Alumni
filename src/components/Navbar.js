import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../images/TSU_Logo.png";
import "../App.css";
import { useTranslation } from "react-i18next";
import { jwtDecode } from "jwt-decode"; // 👈 Cryptographic decoder added

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAuth = !!token;

  // 🔒 SECURE ROLE EXTRACTION
  let role = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      // Extracts role directly out of the unalterable token payload
      role = (decoded.role || "").toString().trim().toLowerCase();
    } catch (error) {
      console.error("Invalid token found in navbar");
    }
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Clean out any old string residue
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <div className="logo" onClick={() => navigate("/Home")}>
          <img src={logo} alt="TSU Logo" />
        </div>

        {/* BURGER */}
        <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* LINKS */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>

          {isAuth && (
            <>
              <NavLink to="/Home">{t("Home")}</NavLink>
              <NavLink to="/About">{t("About us")}</NavLink>
              <NavLink to="/Events">{t("Events")}</NavLink>
              <NavLink to="/Employment">{t("Employment")}</NavLink>
              <NavLink to="/Profile">{t("Profile")}</NavLink>

              {/* 👑 SECURE ADMIN ONLY LINKS */}
              {role === "admin" && (
                <>
                  <NavLink to="/AddEvent">{t("Add Event")}</NavLink>
                  <NavLink to="/AddJob">{t("Add Job")}</NavLink>
                  <NavLink to="/Alumni">{t("Alumni")}</NavLink>
                </>
              )}

              {/* LOGOUT */}
              <button onClick={handleLogout} className="logout-btn">
                {t("Log out")}
              </button>

              {/* LANGUAGE */}
              <select
                className="language-select"
                value={i18n.language}
                onChange={(e) => {
                  i18n.changeLanguage(e.target.value);
                  localStorage.setItem("language", e.target.value);
                }}
              >
                <option value="ka">ქარ</option>
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