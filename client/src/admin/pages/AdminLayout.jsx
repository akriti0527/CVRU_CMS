import "../css/AdminLayout.css";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import { Outlet } from "react-router-dom"; // ✅ IMPORTANT

function AdminLayout() {

  return (

    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="admin-sidebar-area">
        <AdminSidebar />
      </div>

      {/* MAIN SECTION */}
      <div className="admin-main-section">

        {/* NAVBAR */}
        <div className="admin-navbar-area">
          <AdminNavbar />
        </div>

        {/* PAGE CONTENT */}
        <div className="admin-page-content">
          <Outlet /> {/* 🔥 THIS FIXES EVERYTHING */}
        </div>

      </div>

    </div>

  );
}

export default AdminLayout;