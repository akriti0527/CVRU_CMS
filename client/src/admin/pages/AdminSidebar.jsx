import "../css/AdminSidebar.css";
import { NavLink } from "react-router-dom";

import {
  FaThLarge,
  FaClipboardList,
  FaHamburger,
  FaBoxes,
  // eslint-disable-next-line no-unused-vars
  FaTags,
  // eslint-disable-next-line no-unused-vars
  FaMoneyBill,
  // eslint-disable-next-line no-unused-vars
  FaTicketAlt,
  // eslint-disable-next-line no-unused-vars
  FaChartBar,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

function AdminSidebar() {
  return (
    <div className="admin-sidebar">

<h1 className="admin-logo">
  CHILI'S <br /> FOOD POINT
</h1>

      <ul className="admin-menu">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaThLarge />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaClipboardList />
          Orders
        </NavLink>

        <NavLink
          to="/admin/menu"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaHamburger />
          Menu
        </NavLink>

        <NavLink
          to="/admin/stocks"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaBoxes />
          Stocks
        </NavLink>

        {/* <NavLink
          to="/admin/offers"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaTags />
          Offers
        </NavLink> */}

        {/* <NavLink
          to="/admin/payments"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaMoneyBill />
          Payments
        </NavLink> */}

        {/* <NavLink
          to="/admin/tokens"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaTicketAlt />
          Tokens
        </NavLink> */}

        {/* <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaChartBar />
          Analytics
        </NavLink> */}

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaCog />
          Settings
        </NavLink>

        <NavLink to="/" className="sidebar-item">
          <FaSignOutAlt />
          Logout
        </NavLink>

      </ul>
    </div>
  );
}

export default AdminSidebar;