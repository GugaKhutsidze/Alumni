import React, { useState, useMemo, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";
import logo from "../images/TSU_Logo.png";
import "../App.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );


  useEffect(() => {

    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };


    window.addEventListener(
      "storage",
      handleStorageChange
    );


    const interval = setInterval(() => {

      const currentToken =
        localStorage.getItem("token");


      if (currentToken !== token) {
        setToken(currentToken);
      }

    }, 1000);



    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      clearInterval(interval);

    };


  }, [token]);




  const { isAuth, role } = useMemo(() => {


    if (!token) {
      return {
        isAuth: false,
        role: ""
      };
    }


    try {


      const decoded = jwtDecode(token);


      console.log(
        "NAVBAR JWT:",
        decoded
      );


      if (
        decoded.exp &&
        decoded.exp * 1000 < Date.now()
      ) {

        localStorage.removeItem("token");

        return {
          isAuth: false,
          role: ""
        };

      }



      let userRole =

        decoded.role ||

        decoded.Role ||

        decoded.roleId ||

        decoded.RoleID ||

        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||

        "";



      if (
        userRole === 1 ||
        userRole === "1"
      ) {

        userRole = "admin";

      }



      console.log(
        "NAVBAR ROLE:",
        userRole
      );



      return {

        isAuth: true,

        role: String(userRole)
          .toLowerCase()
          .trim()

      };



    } catch (error) {


      console.error(
        "JWT ERROR:",
        error
      );


      localStorage.removeItem(
        "token"
      );


      return {
        isAuth: false,
        role: ""
      };

    }


  }, [token]);





  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    setToken(null);

    setMenuOpen(false);

    navigate(
      "/",
      {
        replace: true
      }
    );

  };





  const changeLanguage = (lang) => {

    i18n.changeLanguage(lang);

    localStorage.setItem(
      "language",
      lang
    );

    setMenuOpen(false);

  };






  return (

    <nav className="navbar">


      <div className="nav-container">



        <div

          className="logo"

          onClick={() => {

            navigate(
              isAuth ? "/home" : "/"
            );

            setMenuOpen(false);

          }}

          style={{
            cursor: "pointer"
          }}

        >

          <img
            src={logo}
            alt="TSU Logo"
          />

        </div>





        <div

          className="burger"

          onClick={() =>
            setMenuOpen(
              prev => !prev
            )
          }

        >

          {menuOpen ? "✕" : "☰"}

        </div>






        <div

          className={`nav-links ${
            menuOpen ? "open" : ""
          }`}

        >



          {isAuth && (

            <>


              <NavLink

                to="/home"

                onClick={() =>
                  setMenuOpen(false)
                }

              >

                {t("Home")}

              </NavLink>




              <NavLink

                to="/about"

                onClick={() =>
                  setMenuOpen(false)
                }

              >

                {t("About us")}

              </NavLink>





              <NavLink

                to="/events"

                onClick={() =>
                  setMenuOpen(false)
                }

              >

                {t("Events")}

              </NavLink>





              <NavLink

                to="/employment"

                onClick={() =>
                  setMenuOpen(false)
                }

              >

                {t("Employment")}

              </NavLink>





              <NavLink

                to="/profile"

                onClick={() =>
                  setMenuOpen(false)
                }

              >

                {t("Profile")}

              </NavLink>





              {
                role === "admin" && (

                  <NavLink

                    to="/admin"

                    onClick={() =>
                      setMenuOpen(false)
                    }

                  >

                    {t("Dashboard")}

                  </NavLink>

                )
              }






              <button

                onClick={handleLogout}

                className="logout-btn"

              >

                {t("Log out")}

              </button>


            </>

          )}






          <select

            className="language-select"

            value={i18n.language}

            onChange={(e) =>
              changeLanguage(
                e.target.value
              )
            }

          >

            <option value="ka">
              ქარ
            </option>


            <option value="en">
              EN
            </option>


          </select>




        </div>



      </div>


    </nav>

  );

};


export default Navbar;