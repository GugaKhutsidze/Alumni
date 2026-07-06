import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./LR.css";
import { useTranslation } from "react-i18next";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [personalId, setpersonalId] = useState("");
  const[phoneNumber, setphoneNumber] = useState("");
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
    if (localStorage.getItem("token")) navigate("/Home", { replace: true });
  }, [navigate]);

  async function handleRegister() {
    if (!email ||!phoneNumber|| !name || !personalId || !password) return alert("გთხოვ შეავსო ყველა ველი");
    try {
      setLoading(true);
      await axios.post("https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/auth/register", { name,surname, email, personalId, password,phoneNumber });
      alert("რეგისტრაცია წარმატებით დასრულდა");
      navigate("/", { replace: true });
    } catch (error) {
      alert("შეცდომა წარმოიშვა რეგისტრაციისას");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <div className={`SignUp ${isRegister ? "active-register" : ""}`}>
        <div className="form">
          <h1>{t("Register")}</h1>
          <input type="text" placeholder={t("ID")} value={personalId} onChange={(e)=>setpersonalId(e.target.value)} />
          <input type="phoneNumber" placeholder={t("Phone Number")} value={phoneNumber} onChange={(e)=>setphoneNumber(e.target.value)} />
          <input type="text" placeholder={t("First Name")} value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder={t("Last Name")} value={surname} onChange={(e) => setSurname(e.target.value)} />
          <input type="email" placeholder={t("Email")} value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder={t("Password")} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} onClick={handleRegister}>
            {loading ? "იტვირთება..." : t("Register")}
          </button>
          <p>{t("Already have an account?")} <NavLink to="/">{t("Login Here")} </NavLink> 
           <select
            className="language-s"
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="ka">GE</option>
            <option value="en">EN</option>
          </select></p>
        </div>
        <div className="form-img"></div>
      </div>
    </div>
  );
}