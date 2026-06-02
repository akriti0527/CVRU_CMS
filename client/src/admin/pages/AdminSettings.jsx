import "../css/AdminSettings.css";

import {

  useState

} from "react";

import axios from "axios";

import {

  FaUserShield,

  FaEnvelope,

  FaLock,

  FaCamera,

  FaSave

} from "react-icons/fa";

import { toast } from "react-toastify";

function AdminSettings() {

  // =========================================
  // STATES
  // =========================================

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      currentPassword: "",

      newPassword: "",

      confirmPassword: ""
    });




  const [profileImage, setProfileImage] =
    useState(null);




  const [preview, setPreview] =
    useState("");




  // =========================================
  // HANDLE CHANGE
  // =========================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value
    });
  };




  // =========================================
  // IMAGE CHANGE
  // =========================================

  const handleImageChange = (e) => {

    const file =
      e.target.files[0];




    if (file) {

      setProfileImage(file);

      setPreview(

        URL.createObjectURL(file)
      );
    }
  };




  // =========================================
  // UPDATE PROFILE
  // =========================================

  const handleUpdateProfile =
    async (e) => {

      e.preventDefault();




      try {

        const data =
          new FormData();




        data.append(
          "name",
          formData.name
        );

        data.append(
          "email",
          formData.email
        );




        if (profileImage) {

          data.append(
            "avatar",
            profileImage
          );
        }




        await axios.put(

          `${import.meta.env.VITE_API_URL}/api/v1/users/update-profile`,

          data,

          {

            withCredentials: true,

            headers: {

              "Content-Type":
                "multipart/form-data"
            }
          }
        );




        toast.success(
          "✅ Profile Updated"
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "❌ Failed to update profile"
        );
      }
    };




  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handleChangePassword =
    async (e) => {

      e.preventDefault();




      if (

        formData.newPassword !==

        formData.confirmPassword
      ) {

        toast.error(
          "Passwords do not match"
        );

        return;
      }




      try {

        await axios.put(

          `${import.meta.env.VITE_API_URL}/api/v1/users/change-password`,

          {

            currentPassword:
              formData.currentPassword,

            newPassword:
              formData.newPassword
          },

          {
            withCredentials: true
          }
        );




        toast.success(
          "✅ Password Changed"
        );




        setFormData({

          ...formData,

          currentPassword: "",

          newPassword: "",

          confirmPassword: ""
        });

      } catch (error) {

        console.log(error);

        toast.error(
          "❌ Failed to change password"
        );
      }
    };




  return (

    <div className="admin-settings-page">

      <div className="settings-container">




        {/* ========================================= */}
        {/* PROFILE CARD */}
        {/* ========================================= */}

        <div className="settings-card">

          <h2>
            <FaUserShield />
            Admin Profile
          </h2>




          {/* PROFILE IMAGE */}

          <div className="profile-image-box">

            <img

              src={

                preview ||

                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }

              alt="profile"
            />




            <label
              htmlFor="profile-upload"
              className="upload-btn"
            >

              <FaCamera />

            </label>




            <input

              type="file"

              id="profile-upload"

              hidden

              onChange={
                handleImageChange
              }
            />

          </div>




          {/* PROFILE FORM */}

          <form
            onSubmit={
              handleUpdateProfile
            }
          >

            <div className="input-box">

              <FaUserShield />

              <input

                type="text"

                name="name"

                placeholder="Admin Name"

                value={
                  formData.name
                }

                onChange={
                  handleChange
                }
              />

            </div>





            <div className="input-box">

              <FaEnvelope />

              <input

                type="email"

                name="email"

                placeholder="Admin Email"

                value={
                  formData.email
                }

                onChange={
                  handleChange
                }
              />

            </div>





            <button
              type="submit"
              className="save-btn"
            >

              <FaSave />

              Save Changes

            </button>

          </form>

        </div>





        {/* ========================================= */}
        {/* PASSWORD CARD */}
        {/* ========================================= */}

        <div className="settings-card">

          <h2>
            <FaLock />
            Change Password
          </h2>




          <form
            onSubmit={
              handleChangePassword
            }
          >

            <div className="input-box">

              <FaLock />

              <input

                type="password"

                name="currentPassword"

                placeholder="Current Password"

                value={
                  formData.currentPassword
                }

                onChange={
                  handleChange
                }
              />

            </div>





            <div className="input-box">

              <FaLock />

              <input

                type="password"

                name="newPassword"

                placeholder="New Password"

                value={
                  formData.newPassword
                }

                onChange={
                  handleChange
                }
              />

            </div>





            <div className="input-box">

              <FaLock />

              <input

                type="password"

                name="confirmPassword"

                placeholder="Confirm Password"

                value={
                  formData.confirmPassword
                }

                onChange={
                  handleChange
                }
              />

            </div>





            <button
              type="submit"
              className="save-btn"
            >

              <FaSave />

              Update Password

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AdminSettings;