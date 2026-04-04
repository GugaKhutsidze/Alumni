import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../images/TSU_Logo.png";
import "../App.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("token");

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

        <div className="nav-links">
          {isAuth && (
            <>
              <NavLink to="/Home">მთავარი</NavLink>
              <NavLink to="/About">ჩვენ შესახებ</NavLink>
              <NavLink to="/Events">ღონისძიებები</NavLink>
              <NavLink to="/Employment">დასაქმება</NavLink>
            </>
          )}
        </div>

        <div className="nav-actions">
          {isAuth ? (
            <button onClick={handleLogout} className="logout-btn"> გასვლა</button>
          ) : (
            <NavLink to="/" className="login-link">შესვლა</NavLink>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;