import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./L&R.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [id, setId] = useState("");
  const[tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isRegister = location.pathname === "/register";

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/Home", { replace: true });
  }, [navigate]);

  async function handleRegister() {
    if (!email ||!tel|| !name || !id || !password) return alert("გთხოვ შეავსო ყველა ველი");
    try {
      setLoading(true);
      await axios.post("http:://localhost:5053/api/auth/register", { email, name,tel, surname, password, id });
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
          <h1>მომხმარებლის რეგისტრაცია</h1>
          <input type="text" placeholder="პირადი ნომერი" value={id} onChange={(e)=>setId(e.target.value)} />
          <input type="tel" placeholder="ტელეფონის ნომერი" value={tel} onChange={(e)=>setTel(e.target.value)} />
          <input type="text" placeholder="სახელი" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="გვარი" value={surname} onChange={(e) => setSurname(e.target.value)} />
          <input type="email" placeholder="ელფოსტა" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="პაროლი" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={loading} onClick={handleRegister}>
            {loading ? "იტვირთება..." : "დასრულება"}
          </button>
          <p>უკვე გაქვთ ანგარიში? <NavLink to="/">ავტორიზაცია</NavLink></p>
        </div>
        <div className="form-img"><h1>მოგესალმებით!</h1></div>
      </div>
    </div>
  );
}