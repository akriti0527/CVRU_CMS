import "../css/Signup.css"

import food from "../assets/veg-platter.png"



function Signup() {

  return (

    <div className="signup-page">

      {/* LEFT */}
      <div
        className="signup-left"
        style={{
          backgroundImage: `url(${food})`
        }}
      >

        <div className="overlay">

          <h1>
            Cafeteria
          </h1>



          <p>
            Create your account and start ordering delicious meals.
          </p>

        </div>

      </div>



      {/* RIGHT */}
      <div className="signup-right">

        <div className="signup-box">

          <h1>
            Create Account 🚀
          </h1>



          <p>
            Signup and enjoy your cafeteria dashboard
          </p>



          <input
            type="text"
            placeholder="Enter Name"
          />



          <input
            type="email"
            placeholder="Enter Email"
          />



          <input
            type="password"
            placeholder="Create Password"
          />



          <button>
            Sign Up
          </button>

        </div>

      </div>

    </div>

  )
}

export default Signup