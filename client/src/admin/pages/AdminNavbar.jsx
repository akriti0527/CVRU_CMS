/* eslint-disable no-undef */
import "../css/AdminNavbar.css";
import {

  NavLink

} from "react-router-dom";
// import {
//   FaSearch
// } from "react-icons/fa";

import adminAvatar from "../../assets/avatar.png";

  const userName = localStorage.getItem("userName");


function AdminNavbar() {

  return (

    <div className="admin-navbar">




      {/* LEFT */}
      <div className="admin-navbar-left">

        <h1>
          Admin Dashboard
        </h1>

        <p>
          Manage cafeteria operations easily
        </p>

      </div>





      {/* RIGHT */}
      <div className="admin-navbar-right">




        {/* SEARCH */}
        {/* <div className="admin-search-box">

          <FaSearch className="admin-search-icon" />

          <input
            type="text"
            placeholder="Search here..."
          />

        </div> */}





        <NavLink
  to="/admin/notifications"
>

  🔔 

</NavLink>





        {/* PROFILE */}
        <div className="admin-profile">

          <img
            src={adminAvatar}
            alt=""
          />



          <div>

            <h3>
             <span className="user-name">{userName || "User"}</span> 👋
            </h3>

            

          </div>

        </div>

      </div>

    </div>

  );
}

export default AdminNavbar;