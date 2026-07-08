import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";

import Navbar from "./components/Navbar";

// --- YOUR HELPER FUNCTION ---
export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return "";

  try {
    const decoded = jwtDecode(token);
    const role =
      decoded.role ||
      decoded.Role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      "";

    // Handle case where role might be an array (common in ASP.NET)
    const finalRole = Array.isArray(role) ? role[0] : role;
    
    return String(finalRole).toLowerCase().trim();
  } catch (error) {
    console.error("Token decode error:", error);
    return "";
  }
}

// Lazy imports
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Events = React.lazy(() => import("./pages/Events"));
const Employment = React.lazy(() => import("./pages/Employment"));
const EventsDetail = React.lazy(() => import("./pages/EventsDetail"));
const Profile = React.lazy(() => import("./pages/Profile"));
const AdminPanel = React.lazy(() => import("./pages/AdminPanel"));
const AddEvent = React.lazy(() => import("./pages/AddEvent"));
const AddJob = React.lazy(() => import("./pages/AddJob"));
const Alumni = React.lazy(() => import("./pages/Alumni"));

const ProtectedLayout = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
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
  const userRole = getUserRole(); // Using your custom helper

  if (!userRole) return <Navigate to="/" replace />;

  // Normalize allowedRoles to lowercase for comparison
  const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!isAllowed) return <Navigate to="/home" replace />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="page-loading"><span className="spinner"></span></div>}>
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
            
            
            {/* ADMIN ROUTE */}
            <Route path="/AdminPanel" element={
              <RoleProtected allowedRoles={["admin", "1"]}>
                <AdminPanel />
              </RoleProtected>
            }>
              <Route path="AddEvent" element={<AddEvent />} />
              <Route path="AddJob" element={<AddJob />} />
              <Route path="Alumni" element={<Alumni />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;