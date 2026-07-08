import React, { useState, useMemo, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import logo from "../images/TSU_Logo.png";
import "../App.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const { isAuth, role } = useMemo(() => {
    if (!token) return { isAuth: false, role: "" };
    try {
      const decoded = jwtDecode(token);
      
      // Token expiration check
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return { isAuth: false, role: "" };
      }

      const msSchema = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      const rawRole = decoded.role || decoded.Role || decoded.roleId || decoded[msSchema] || "";
      let userRole = Array.isArray(rawRole) ? rawRole[0] : rawRole;
      
      if (userRole === 1 || userRole === "1") userRole = "admin";
      
      return { isAuth: true, role: String(userRole).toLowerCase().trim() };
    } catch {
      return { isAuth: false, role: "" };
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={() => navigate(isAuth ? "/home" : "/")} style={{ cursor: "pointer" }}>
          <img src={logo} alt="TSU Logo" />
        </div>

        <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {isAuth && (
            <>
              <NavLink to="/home" onClick={() => setMenuOpen(false)}>{t("Home")}</NavLink>
              <NavLink to="/about" onClick={() => setMenuOpen(false)}>{t("About us")}</NavLink>
              <NavLink to="/events" onClick={() => setMenuOpen(false)}>{t("Events")}</NavLink>
              <NavLink to="/employment" onClick={() => setMenuOpen(false)}>{t("Employment")}</NavLink>
              <NavLink to="/profile" onClick={() => setMenuOpen(false)}>{t("Profile")}</NavLink>
              
              {role === "admin" && (
                <NavLink to="/AdminPanel" onClick={() => setMenuOpen(false)}>
                  {t("Admin")}
                </NavLink>
              )}
              <button onClick={handleLogout} className="logout-btn">{t("Log out")}</button>
            </>
          )}

          <select className="language-select" value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
            <option value="ka">ქარ</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;