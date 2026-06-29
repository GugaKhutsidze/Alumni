import React, { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import logo from "../images/TSU_Logo.png";
import "../App.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Read token once
  const token = localStorage.getItem("token");

  // Determine authentication & role safely
  const { isAuth, role } = useMemo(() => {
    if (!token) {
      return { isAuth: false, role: "" };
    }

    try {
      const decoded = jwtDecode(token);

      // Check token expiration
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        return { isAuth: false, role: "" };
      }

      return {
        isAuth: true,
        role: (decoded.role || "")
          .toString()
          .trim()
          .toLowerCase(),
      };
    } catch (err) {
      console.error("Invalid JWT:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      return {
        isAuth: false,
        role: "",
      };
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
    window.location.reload();
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Logo */}
        <div
          className="logo"
          onClick={() => navigate(isAuth ? "/Home" : "/")}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="TSU Logo" />
        </div>

        {/* Burger */}
        <div
          className="burger"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </div>

        {/* Navigation */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>

          {isAuth && (
            <>
              <NavLink to="/Home" onClick={() => setMenuOpen(false)}>
                {t("Home")}
              </NavLink>

              <NavLink to="/About" onClick={() => setMenuOpen(false)}>
                {t("About us")}
              </NavLink>

              <NavLink to="/Events" onClick={() => setMenuOpen(false)}>
                {t("Events")}
              </NavLink>

              <NavLink to="/Employment" onClick={() => setMenuOpen(false)}>
                {t("Employment")}
              </NavLink>

              <NavLink to="/Profile" onClick={() => setMenuOpen(false)}>
                {t("Profile")}
              </NavLink>

            {role === "admin" && (
  <>
    <NavLink to="/add-event" onClick={() => setMenuOpen(false)}>
      {t("Add Event")}
    </NavLink>

    <NavLink to="/add-job" onClick={() => setMenuOpen(false)}>
      {t("Add Job")}
    </NavLink>

    <NavLink to="/alumni" onClick={() => setMenuOpen(false)}>
      {t("Alumni")}
    </NavLink>
  </>
)}

              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                {t("Log out")}
              </button>
            </>
          )}

          {/* Language selector */}
          <select
            className="language-select"
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="ka">ქარ</option>
            <option value="en">EN</option>
          </select>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;