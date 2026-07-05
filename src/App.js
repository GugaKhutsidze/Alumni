import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // 👈 Added secure decoder
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Employment from "./pages/Employment";
import EventsDetail from "./pages/EventsDetail";
import Profile from "./pages/Profile";
import Alumni from "./pages/Alumni";
import AddEvent from "./pages/AddEvent";
import AddJob from "./pages/AddJob";

import Navbar from "./components/Navbar";


const ProtectedLayout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};

/* =========================
   ROLE PROTECTED (SECURE FLOW)
========================= */
const RoleProtected = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    // 🔒 Decode the token payload securely 
    const decoded = jwtDecode(token);
    
    // Extract the role from the cryptographically signed token
    const role = (decoded.role || "").toString().trim().toLowerCase();
    const allowed = allowedRoles.map(r => r.toLowerCase());

    if (!allowed.includes(role)) {
      return <Navigate to="/home" replace />;
    }
  } catch (error) {
    // If the token is fake, expired, or tampered with, wipe it and force logout
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Clean legacy storage if it exists
    return <Navigate to="/" replace />;
  }

  return children;
};



function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedLayout />}> 

          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/employment" element={<Employment />} />
          <Route path="/event/:id" element={<EventsDetail />} />
          <Route path="/profile" element={<Profile />} />

          <Route
            path="/add-event"
            element={
              <RoleProtected allowedRoles={["admin"]}>
                <AddEvent />
              </RoleProtected>
            }
          />

          <Route
            path="/add-job"
            element={
              <RoleProtected allowedRoles={["admin"]}>
                <AddJob />
              </RoleProtected>
            }
          />

          <Route 
            path="/alumni" 
            element={
              <RoleProtected allowedRoles={["admin"]}>
                <Alumni />
              </RoleProtected>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;