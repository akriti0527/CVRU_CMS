/* eslint-disable react-hooks/set-state-in-effect */
import "../css/UserSettings.css";

import {

  useEffect,

  useState

} from "react";

import axios from "axios";

import {

  FaUser,

  FaEnvelope,

  FaLock,

  FaSave,

  FaUserCircle

} from "react-icons/fa";

import { toast } from "react-toastify";

function UserSettings() {

  // =========================================
  // STATES
  // =========================================

  const [userData, setUserData] =
    useState({

      name: "",

      email: "",

      password: ""
    });




  const [loading, setLoading] =
    useState(false);




  // =========================================
  // FETCH USER
  // =========================================

  const fetchUser =
    async () => {

      try {

        const response =
          await axios.get(

            "http://localhost:5000/api/v1/users/profile",

            {

              withCredentials: true
            }
          );




        setUserData({

          name:
            response.data.user.name ||

            "",

          email:
            response.data.user.email ||

            "",

          password: ""
        });

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to fetch profile"
        );
      }
    };




  // =========================================
  // UPDATE USER
  // =========================================

  const handleUpdate =
    async (e) => {

      e.preventDefault();




      try {

        setLoading(true);




        const response =
          await axios.put(

            "http://localhost:5000/api/v1/users/update-profile",

            userData,

            {

              withCredentials: true
            }
          );




        toast.success(

          response.data.message ||

          "Profile Updated"
        );




        setLoading(false);

      } catch (error) {

        console.log(error);




        toast.error(

          error.response?.data?.message ||

          "Failed to update profile"
        );




        setLoading(false);
      }
    };




  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange =
    (e) => {

      setUserData({

        ...userData,

        [e.target.name]:
          e.target.value
      });
    };




  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {

    fetchUser();

  }, []);




  return (

    <div className="user-settings-page">




      <div className="user-settings-card">




        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="settings-header">

          <div className="profile-circle">

            <FaUserCircle />

          </div>




          <h1>
            User Settings
          </h1>

          <p>
            Manage your account details
          </p>

        </div>





        {/* ========================================= */}
        {/* FORM */}
        {/* ========================================= */}

        <form
          onSubmit={handleUpdate}
          className="settings-form"
        >




          {/* NAME */}

          <div className="input-group">

            <label>

              <FaUser />

              Full Name

            </label>




            <input

              type="text"

              name="name"

              value={userData.name}

              onChange={handleChange}

              placeholder="Enter name"

              required
            />

          </div>





          {/* EMAIL */}

          <div className="input-group">

            <label>

              <FaEnvelope />

              Email Address

            </label>




            <input

              type="email"

              name="email"

              value={userData.email}

              onChange={handleChange}

              placeholder="Enter email"

              required
            />

          </div>





          {/* PASSWORD */}

          <div className="input-group">

            <label>

              <FaLock />

              New Password

            </label>




            <input

              type="password"

              name="password"

              value={userData.password}

              onChange={handleChange}

              placeholder="Enter new password"
            />

          </div>





          {/* BUTTON */}

          <button
            type="submit"
            className="save-btn"
          >

            <FaSave />

            {

              loading

                ? "Updating..."

                : "Save Changes"
            }

          </button>

        </form>

      </div>

    </div>
  );
}

export default UserSettings;