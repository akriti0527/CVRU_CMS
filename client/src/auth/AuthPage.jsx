// ======================================
// src/pages/AuthPage.jsx
// ======================================

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

//import { FcGoogle } from "react-icons/fc";

import { toast } from "react-toastify";

import "./AuthPage.css";

import {

  // eslint-disable-next-line no-unused-vars
  GoogleLogin

} from "@react-oauth/google";


function AuthPage() {

  const navigate = useNavigate();



  // ======================================
  // STATES
  // ======================================
  const [role, setRole] =
    useState("user");

  const [isLogin, setIsLogin] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      userName: "",

      email: "",

      password: "",

      phone: "",

      adminSecret: "",
    });



  // ======================================
  // HANDLE CHANGE
  // ======================================
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,
    });
  };



  // ======================================
  // REGISTER USER / ADMIN
  // ======================================
  const handleSignup = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response =
      await axios.post(

        `${import.meta.env.VITE_API_URL}/api/v1/users/register`,

        {

          userName:
          formData.userName,

          email:
          formData.email,

          password:
          formData.password,

          phone:
          formData.phone,

          adminSecret:
          role === "admin"
          ? formData.adminSecret
          : "",
        },

        {
          withCredentials: true,
        }
      );



      // ======================================
      // SUCCESS ALERTS
      // ======================================
      if (
        response.data.user.role
        === "admin"
      ) {

        toast.success(
          `Admin ${response.data.user.userName} Created Successfully 👑`
        );

      } else {

        toast.success(
          `Welcome ${response.data.user.userName} 🎉`
        );
      }



      // SAVE USER
      localStorage.setItem(
        "userName",
        response.data.user.userName
      );

      localStorage.setItem(
        "role",
        response.data.user.role
      );



      // NAVIGATE
      if (
        response.data.user.role
        === "admin"
      ) {

        navigate("/admin");

      } else {

        navigate("/home");
      }

    } catch (error) {

      toast.error(

        error.response?.data?.message
        || "Registration Failed ❌"
      );

    } finally {

      setLoading(false);
    }
  };



  // ======================================
  // LOGIN USER / ADMIN
  // ======================================
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response =
      await axios.post(

        `${import.meta.env.VITE_API_URL}/api/v1/users/login`,

        {

          email:
          formData.email,

          password:
          formData.password,
        },

        {
          withCredentials: true,
        }
      );



      // ======================================
      // SUCCESS ALERTS
      // ======================================
      if (
        response.data.user.role
        === "admin"
      ) {

        toast.success(
          `Welcome Admin ${response.data.user.userName} 👑`
        );

      } else {

        toast.success(
          `Welcome ${response.data.user.userName} 🎉`
        );
      }



      // SAVE USER
      localStorage.setItem(
        "userName",
        response.data.user.userName
      );

      localStorage.setItem(
        "role",
        response.data.user.role
      );

localStorage.setItem(
  "token",
  response.data.accessToken
);

localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

      // NAVIGATE
      if (
        response.data.user.role
        === "admin"
      ) {

        navigate("/admin");

      } else {

        navigate("/home");
      }

    } catch (error) {

      toast.error(

        error.response?.data?.message
        || "Login Failed ❌"
      );

    } finally {

      setLoading(false);
    }
  };



  // ======================================
  // GOOGLE LOGIN
  // ======================================
  const handleGoogleLogin =
async (credentialResponse) => {

  try {

    const response =
      await axios.post(

        `${import.meta.env.VITE_API_URL}/api/v1/users/google-login`,

        {
          credential:
            credentialResponse.credential
        },

        {
          withCredentials: true
        }
      );





    console.log(
      "GOOGLE LOGIN SUCCESS:",
      response.data
    );





    if (response.data.success) {

      // SAVE USER
      localStorage.setItem(

        "user",

        JSON.stringify(
          response.data.user
        )
      );





      alert(
        "Google Login Successful"
      );





      // REDIRECT
      window.location.href =
        "/home";
    }

  } catch (error) {

    console.log(
      "Google Login Error:",
      error
    );





    alert(

      error.response?.data?.message

      ||

      "Google Login Failed"
    );
  }
};

  return (

    <div className="auth-container">

      <div className="auth-box">

        {/* TITLE */}
        <h2>

          {
            isLogin
            ? "Sign In"
            : "Create Account"
          }

        </h2>



        <p className="subtitle">

          {
            isLogin
            ? "Welcome Back"
            : "Join your cafeteria dashboard"
          }

        </p>



        {/* ROLE SWITCH */}
        {!isLogin && (

          <div className="role-switch">

            <button
              type="button"
              className={
                role === "user"
                ? "active"
                : ""
              }
              onClick={() =>
                setRole("user")
              }
            >
              User
            </button>



            <button
              type="button"
              className={
                role === "admin"
                ? "active"
                : ""
              }
              onClick={() =>
                setRole("admin")
              }
            >
              Admin
            </button>

          </div>
        )}



        {/* FORM */}
        <form
          onSubmit={
            isLogin
            ? handleLogin
            : handleSignup
          }
        >

          {/* SIGNUP */}
          {!isLogin && (

            <>

              {/* NAME */}
              <input
                type="text"
                name="userName"
                placeholder="Enter Name"
                className="auth-input"
                required
                value={formData.userName}
                onChange={handleChange}
              />



              {/* EMAIL */}
              <input
                type="email"
                name="email"
                className="auth-input"
                placeholder="Enter Email"
                required
                value={formData.email}
                onChange={handleChange}
              />



              {/* PASSWORD */}
              <input
                type="password"
                name="password"
                className="auth-input"
                placeholder="Enter Password"
                required
                value={formData.password}
                onChange={handleChange}
              />



              {/* PHONE */}
              <input
                type="tel"
                name="phone"
                className="auth-input"
                placeholder="Enter Phone Number"
                required
                value={formData.phone}
                onChange={handleChange}
              />



              {/* ADMIN SECRET */}
              {
                role === "admin"
                && (

                  <input
                    type="password"
                    name="adminSecret"
                    className="auth-input"
                    placeholder="Enter Secret Key"
                    required
                    value={
                      formData.adminSecret
                    }
                    onChange={handleChange}
                  />
                )
              }



              {/* SIGNUP BUTTON */}
              <button
                type="submit"
                className="signup-btn"
                disabled={loading}
              >

                {
                  loading
                  ? "Please Wait..."
                  : "Sign Up"
                }

              </button>

            </>
          )}



          {/* LOGIN */}
          {isLogin && (

            <>

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                className="auth-input"
                placeholder="Enter Email"
                required
                value={formData.email}
                onChange={handleChange}
              />



              {/* PASSWORD */}
              <input
                type="password"
                name="password"
                className="auth-input"
                placeholder="Enter Password"
                required
                value={formData.password}
                onChange={handleChange}
              />



              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="signup-btn"
                disabled={loading}
              >

                {
                  loading
                  ? "Please Wait..."
                  : "Sign In"
                }

              </button>

            </>
          )}



          {/* DIVIDER */}
          <div className="divider">
            OR
          </div>



          {/* GOOGLE LOGIN */}
          <div className="google-login-container">

  <GoogleLogin

    onSuccess={handleGoogleLogin}

    onError={() => {

      alert(
        "Google Login Failed"
      );
    }}

    useOneTap
  />

</div>



          {/* TOGGLE */}
          <p className="login-text">

            {
              isLogin
              ? (
                <>
                  New user?

                  <span
                    onClick={() =>
                      setIsLogin(false)
                    }
                  >
                    {" "}
                    Sign Up
                  </span>
                </>
              )
              : (
                <>
                  Already have an account?

                  <span
                    onClick={() =>
                      setIsLogin(true)
                    }
                  >
                    {" "}
                    Sign In
                  </span>
                </>
              )
            }

          </p>

        </form>

      </div>

    </div>
  );
}

export default AuthPage;