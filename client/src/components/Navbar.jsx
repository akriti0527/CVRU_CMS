import "../css/Navbar.css";

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import avatar from "../assets/avatar.png";
import {
  FaMoon,
  FaSun,
  FaBell,
  FaArrowLeft
} from "react-icons/fa";

function Navbar() {

  // eslint-disable-next-line no-unused-vars
  const [showNotification, setShowNotification] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  //  GET USER NAME FROM STORAGE
  const userName = localStorage.getItem("userName");

  /* THEME TOGGLE */
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  /* APPLY THEME */
  useEffect(() => {
    if(darkMode){
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
    }
  }, [darkMode]);

  /*  BACK FUNCTION */
  const handleBack = () => {
    if (location.pathname === "/home") {
      navigate("/");   // registration page
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="navbar">

      {/* LEFT SIDE */}
      <div className="navbar-left">

        {/* BACK BUTTON */}
        <button onClick={handleBack} className="back-btn">
          <FaArrowLeft />
        </button>

        <div>
          {/*  DYNAMIC NAME */}
          <h1 className="navbar-heading">
  Hello <span className="user-name">{userName || "User"}</span> 👋
</h1>

          <p className="navbar-text">
            Want to order something?
          </p>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">

       


        {/* NOTIFICATION */}
        <div className="notification-wrapper">

          <div
            className="nav-icon"
            onClick={() =>
              navigate("/notifications")
            }
          >
            <FaBell />
            {/* OPTIONAL RED DOT */}
    <span className="notification-badge">
      
    </span>
          </div>


        </div>

        {/* THEME BUTTON */}
        <div
          className="nav-icon theme-icon"
          onClick={toggleTheme}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>

        {/* AVATAR */}
        <Link to="/">
          <img
            src={avatar}
            alt=""
            className="avatar"
          />
        </Link>

      </div>

    </div>
  );
}

export default Navbar;
