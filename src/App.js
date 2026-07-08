import React, { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./App.css";

import Navbar from "./components/Navbar";

// Lazy loaded pages
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const Events = React.lazy(() => import("./pages/Events"));
const Employment = React.lazy(() => import("./pages/Employment"));
const EventsDetail = React.lazy(() => import("./pages/EventsDetail"));
const AdminPanel = React.lazy(() => import("./pages/Admin"));
const Profile = React.lazy(() => import("./pages/Profile"));


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



// Check admin role
const RoleProtected = ({ children, allowedRoles }) => {

  const token = localStorage.getItem("token");


  if (!token) {
    return <Navigate to="/" replace />;
  }


  try {

    const decoded = jwtDecode(token);


    console.log("JWT:", decoded);


    let role =
      decoded.role ||
      decoded.Role ||
      decoded.roleId ||
      decoded.RoleID ||
      decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] ||
      "";



    // RoleID 1 = Admin
    if (role === 1 || role === "1") {
      role = "admin";
    }



    role = String(role)
      .toLowerCase()
      .trim();



    console.log("USER ROLE:", role);



    const allowed = allowedRoles.map((r) =>
      r.toLowerCase().trim()
    );



    if (!allowed.includes(role)) {

      return <Navigate to="/home" replace />;

    }



    return children;



  } catch (error) {

    console.error("JWT ERROR:", error);

    localStorage.removeItem("token");

    return <Navigate to="/" replace />;

  }

};




function App() {

  return (

    <BrowserRouter>

      <Suspense

        fallback={

          <div className="page-loading">

            <span className="spinner"></span>

          </div>

        }

      >


        <Routes>



          {/* Public */}

          <Route
            path="/"
            element={<Login />}
          />


          <Route
            path="/register"
            element={<Register />}
          />




          {/* Protected */}

          <Route element={<ProtectedLayout />}>



            <Route
              path="/home"
              element={<Home />}
            />


            <Route
              path="/about"
              element={<About />}
            />


            <Route
              path="/events"
              element={<Events />}
            />


            <Route
              path="/employment"
              element={<Employment />}
            />


            <Route
              path="/event/:id"
              element={<EventsDetail />}
            />


            <Route
              path="/profile"
              element={<Profile />}
            />




            {/* ADMIN ONLY */}

            <Route

              path="/admin"

              element={

                <RoleProtected allowedRoles={["admin"]}>

                  <AdminPanel />

                </RoleProtected>

              }

            />


          </Route>




          {/* Not Found */}

          <Route

            path="*"

            element={<Navigate to="/" replace />}

          />



        </Routes>


      </Suspense>


    </BrowserRouter>

  );

}


export default App;