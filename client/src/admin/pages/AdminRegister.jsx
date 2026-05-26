import "../css/AdminRegister.css";
import { useState } from "react";
import bgImage from "../../assets/chilli-bg.png";

function AdminRegister() {

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const [secretKey, setSecretKey] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="register-page">

      {/* LEFT SIDE (IMAGE ONLY) */}
      <div
        className="register-left"
        style={{
          backgroundImage: `url(${bgImage})`
        }}
      ></div>

      {/* RIGHT SIDE (IMAGE + OVERLAY + FORM) */}
      <div
        className="register-right"
        style={{
          backgroundImage: `url(${bgImage})`
        }}
      >

        <div className="register-box">

          <h2>{isLogin ? "Login" : "Create Account"}</h2>

          <p>
            {isLogin
              ? "Access your account"
              : "Join your cafeteria dashboard"}
          </p>

          {/* ROLE */}
          {!isLogin && (
            <div className="role-section">
              <button
                className={role === "user" ? "active-role" : ""}
                onClick={() => setRole("user")}
                type="button"
              >
                User
              </button>

              <button
                className={role === "admin" ? "active-role" : ""}
                onClick={() => setRole("admin")}
                type="button"
              >
                Admin
              </button>
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (!isLogin) {
                if (phone.length !== 10) {
                  setError("Phone number must be 10 digits");
                  return;
                }

                if (role === "admin" && secretKey.trim() === "") {
                  setError("Secret key required");
                  return;
                }
              }

              setError("");
            }}
          >

            {!isLogin && <input type="text" placeholder="Enter Name" />}

            <input type="email" placeholder="Enter Email" />
            <input type="password" placeholder="Enter Password" />

            {!isLogin && (
              <div className="phone-container">
                <span>+91</span>
                <input
                  type="text"
                  placeholder="Enter Phone Number"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) setPhone(value);
                  }}
                />
              </div>
            )}

            {!isLogin && role === "admin" && (
              <input
                type="password"
                placeholder="Enter Secret Key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
            )}

            {error && <p className="error">{error}</p>}

            <button className="register-btn">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="or-text">OR</div>

          <button className="google-btn">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" />
            Continue with Google
          </button>

          <div className="login-link">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Sign Up" : " Sign In"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminRegister;