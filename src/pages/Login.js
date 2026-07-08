import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./LR.css";
import { useTranslation } from "react-i18next";

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const isRegister = location.pathname === "/register";

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/Home", { replace: true });
    }
  }, [navigate]);

  async function handleLogin() {
    if (!email || !password) {
      alert("გთხოვ შეავსო ყველა ველი");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;

      // Save token
      localStorage.setItem("token", token);

      // Decode token
      const decoded = jwtDecode(token);

      // Get role (supports both standard ASP.NET and custom JWTs)
      const role =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        "";

      localStorage.setItem("role", role);

      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }

      navigate("/Home", { replace: true });
    } catch (error) {
      console.error(error);
      alert("ელფოსტა ან პაროლი არასწორია");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <div className={`SignUp ${isRegister ? "active-register" : ""}`}>
        <div className="form">
          <h1>{t("Sign in")}</h1>

          <input
            type="email"
            placeholder={t("Email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder={t("Password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="login-btn"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {t("Sign in...")}
              </>
            ) : (
              t("Sign in")
            )}
          </button>

          <p>
            {t("Not Registered Yet?")}{" "}
            <NavLink to="/register">{t("Register Here")}</NavLink>

            <select
              className="language-s"
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="ka">GE</option>
              <option value="en">EN</option>
            </select>
          </p>
        </div>

        <div className="form-img"></div>
      </div>
    </div>
  );
}