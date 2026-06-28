import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./L&R.css";

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const[id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isRegister = location.pathname === "/register";

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/Home", { replace: true });
  }, [navigate]);

  async function handleLogin() {
    if (!email || !password) return alert("გთხოვ შეავსო ყველა ველი");
    try {
      setLoading(true);
      const response = await axios.post("https://warrior.ge/api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      if (setIsLoggedIn) setIsLoggedIn(true);
      navigate("/Home", { replace: true });
    } catch (error) {
      alert("ელფოსტა ან პაროლი არასწორია");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <div className={`SignUp ${isRegister ? "active-register" : ""}`}>
        <div className="form">
          <h1>მომხმარებლის ავტორიზაცია</h1>
          <input type="email" placeholder="ელფოსტა" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="პაროლი" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} onClick={handleLogin}>
            {loading ? "იტვირთება..." : "შესვლა"}
          </button>
          <p>არ ხართ რეგისტრირებული? <NavLink to="/register">რეგისტრაცია</NavLink></p>
        </div>
        <div className="form-img"><h1>მოგესალმებით!</h1></div>
      </div>
    </div>
  );
}