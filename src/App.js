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

// Components
import Navbar from "./components/Navbar";

// 1. ეს კომპონენტი იცავს შიდა გვერდებს და ამატებს ნავიგაციას
const ProtectedLayout = () => {
  const token = localStorage.getItem("token");

  // თუ ტოკენი არ არსებობს, გადაამისამართე ლოგინზე (/)
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <Outlet /> {/* აქ ჩაიტვირთება Home, About და ა.შ. */}
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
          <Route path="/Employment" element={<Employment />} 
          />
        </Route>

        {/* თუ მომხმარებელი ჩაწერს არასწორ მისამართს, დაბრუნდეს საწყისზე */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;