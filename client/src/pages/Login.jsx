import "../css/Login.css";

import { Link } from "react-router-dom";

import vegplatter from "../assets/veg-platter.png";

function Login() {

  return (

    <div className="login-page">

      {/* LEFT */}
      <div
        className="login-left"
        style={{
          backgroundImage: `url(${vegplatter})`
        }}
      >

        <div className="login-overlay">

          <h1>
            Cafeteria
          </h1>

          <p>
            Fresh food. Fast delivery.
          </p>

        </div>

      </div>





      {/* RIGHT */}
      <div className="login-right">

        <div className="login-box">

          <h2>
            Welcome Back 👋
          </h2>

          <p className="login-subtitle">
            Login to continue your food journey
          </p>





          <input
            type="email"
            placeholder="Enter Email"
          />



          <input
            type="password"
            placeholder="Enter Password"
          />





          <button>
            Login
          </button>





          <p className="signup-text">

            Don’t have an account?

            <Link to="/signup">
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>

  );
}

export default Login;