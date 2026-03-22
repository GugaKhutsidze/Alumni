import React, { useState, useEffect } from "react"; // დავამატეთ useEffect
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom"; // დავამატეთ useNavigate
import "./L&R.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/Home", { replace: true });
    }
  }, [navigate]);
  // ------------------------------------------------------------------

  async function handleRegister(e) {
    if (!email || !name || !password) {
      alert("გთხოვ შეავსო ყველა ველი");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("https://warrior.ge/api/register", {
        email,
        name,
        password,
      });

      alert("რეგისტრაცია წარმატებით დასრულდა");
      console.log(response.data);

      // 2. წარმატებული რეგისტრაციის შემდეგ გადავიყვანოთ ლოგინზე
      navigate("/", { replace: true });

    } catch (error) {
      console.error(error);
      alert("შეცდომა წარმოიშვა რეგისტრაციისას");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form">
      <h1>მომხმარებლის რეგისტრაცია</h1>

       <input
        type="text"
        placeholder="სახელი და გვარი"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
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

      <button type="submit" disabled={loading} onClick={handleRegister}>
        {loading ? "იტვირთება..." : " დასრულება"}
      </button>
      
      <p>
        უკვე გაქვთ  ანგარიში? <NavLink to="/">ავტორიზაცია</NavLink>
      </p>
    </div>
  );
}