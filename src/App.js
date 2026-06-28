import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
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


const RoleProtected = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); 

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* AUTH PROTECTED ROUTES */}
        <Route element={<ProtectedLayout />}>

          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/employment" element={<Employment />} />
          <Route path="/event/:id" element={<EventsDetail />} />
          <Route path="/profile" element={<Profile />} />

          {/* 👑 ADMIN ONLY ROUTES */}
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
             <Route path="/alumni"
           element={<RoleProtected allowedRoles={["admin"]}>
           <Alumni />
           </RoleProtected>

          }
          />

        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;