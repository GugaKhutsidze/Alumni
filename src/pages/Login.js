import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "./L&R.css";

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/Home", { replace: true });
    }
  }, [navigate]);

  async function handleLogin() {
    const url = "https://warrior.ge/api/login";

    if (!email || !password) {
      alert("გთხოვ შეავსო ყველა ველი");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(url, { email, password });

      localStorage.setItem("token", response.data.token);

      if (setIsLoggedIn) setIsLoggedIn(true);

      alert("შესვლა წარმატებით დასრულდა");

      navigate("/Home", { replace: true });

    } catch (error) {
      console.error(error);
      alert("ელ-ფოსტა ან პაროლი არასწორია");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form">
        
      <h1>მომხმარებლის ავტორიზაცია</h1>

      <input
        type="email"
        pattern=".+@ens.tsu.edu.ge"
        placeholder="ელფოსტა"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="პაროლი"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" disabled={loading} onClick={handleLogin}>
        {loading ? "იტვირთება..." : " შესვლა"}
      </button>

      <p>
         არ ხართ რეგისტრირებული? <NavLink to="/register">რეგისტრაცია</NavLink>
      </p>
    </div>
  );
}