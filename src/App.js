import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import "./App.css";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Employment from "./pages/Employment";
import EventsDetail from "./pages/EventsDetail";
import Profile from "./pages/Profile";
import Alumni from "./pages/Alumni";

// Components
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

function App() {

  return (
    <BrowserRouter>
    
    
      <Routes>
        {/* საჯარო გვერდები (ნავიგაციის გარეშე) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* დაცული გვერდები (მხოლოდ დალოგინებულებისთვის + ნავიგაციით) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/event/:id" element={<EventsDetail />} />
          
          <Route path="/Events" element={<Events />} />
          <Route path="/Employment" element={<Employment />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Alumni" element={<Alumni />} />
        </Route>

        {/* თუ მომხმარებელი ჩაწერს არასწორ მისამართს, დაბრუნდეს საწყისზე */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;