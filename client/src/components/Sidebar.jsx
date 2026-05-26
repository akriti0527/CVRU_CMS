import { useNavigate } from "react-router-dom";
import "../css/Sidebar.css";
import { useState } from "react";

import {
  FaThLarge,
  FaHamburger,
  
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const navigate = useNavigate();

  //  LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.clear(); // clear user data
    navigate("/"); // go to Auth page
  };

  const menus = [
    { name: "Dashboard", icon: <FaThLarge /> },
    { name: "Orders", icon: <FaHamburger /> },
    { name: "Settings", icon: <FaCog /> },
    { name: "Logout", icon: <FaSignOutAlt /> },
  ];

  return (
    <div className="sidebar">

      {/* LOGO */}
      <h1 className="admin-logo">
  CHILI'S <br /> FOOD POINT
</h1>

      {/* MENU */}
      <ul className="menu">
        {menus.map((item, index) => (
          <li
            key={index}
            className={activeMenu === item.name ? "active" : ""}
            onClick={() => {
              setActiveMenu(item.name);

              //  ROUTING LOGIC
              if (item.name === "Orders") {
                navigate("/orders");
              }

              if (item.name === "Settings") {
                navigate("/settings");
              }

              //  LOGOUT CLICK
              if (item.name === "Logout") {
                handleLogout();
              }
            }}
          >
            {item.icon}
            {item.name}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default Sidebar;