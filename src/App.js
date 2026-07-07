import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Employment from "./pages/Employment";
import EventsDetail from "./pages/EventsDetail";
import AdminPanel from "./pages/Admin";
import Profile from "./pages/Profile";


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

const RoleProtected = ({ children, allowedRoles }) => {
const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    const role = (decoded.role || "").toLowerCase().trim();
    const allowed = allowedRoles.map(r => r.toLowerCase());

    if (!allowed.includes(role)) {
      return <Navigate to="/home" replace />;
    }

  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return children;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>

          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/employment" element={<Employment />} />
          <Route path="/event/:id" element={<EventsDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminPanel />} />
          

          {/* 🔐 Admin only routes */}
          <Route
            path="/admin"
            element={
              <RoleProtected allowedRoles={["admin"]}>
                <AdminPanel />
              </RoleProtected>
            }
          />


        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;