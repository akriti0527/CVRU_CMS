/* eslint-disable react-hooks/purity */
import {

  useLocation,

  useNavigate

} from "react-router-dom";

import {

  useEffect

} from "react";

import {

  FaArrowLeft,

  FaCheckCircle,

  FaMapMarkerAlt,

  FaMoneyBillWave,

  FaClock

} from "react-icons/fa";

import "../css/Token.css";

function Token() {

  // ======================================
  // LOCATION
  // ======================================

  const location =
    useLocation();

  const navigate =
    useNavigate();




  // ======================================
  // DATA
  // ======================================

 const locationData =
  location.state || {};

const token =
  location.state?.token || "----";

const total =
  locationData.total || 0;

const place =
  locationData.place || "";

const payment =
  locationData.payment || "";




  // ======================================
  // AUTO REDIRECT
  // ======================================

  useEffect(() => {

    const timer =
      setTimeout(() => {

        navigate("/orders");

      }, 5000);




    return () =>
      clearTimeout(timer);

  }, []);




  // ======================================
  // BACK
  // ======================================

  const handleBack =
    () => {

      navigate(-1);
    };




  return (

    <div className="token-page">




      {/* ====================================== */}
      {/* BACK BUTTON */}
      {/* ====================================== */}

      <button

        onClick={handleBack}

        className="back-btn"
      >

        <FaArrowLeft />

      </button>





      {/* ====================================== */}
      {/* TOKEN CARD */}
      {/* ====================================== */}

      <div className="token-card">




        {/* SUCCESS ICON */}

        <div className="success-icon">

          <FaCheckCircle />

        </div>





        {/* TITLE */}

        <h2 className="success-title">

          Order Confirmed

        </h2>





        <p className="success-subtitle">

          Your delicious food is being prepared 🍔

        </p>





        {/* ====================================== */}
        {/* TOKEN BOX */}
        {/* ====================================== */}

        <div className="token-box">

          <p className="token-title">

            🎫 Your Order Token

          </p>





          <div className="token-number">

            TOKEN #{token}

          </div>





          <p className="token-wait">

            Show this token at the counter

          </p>

        </div>





        {/* ====================================== */}
        {/* DETAILS */}
        {/* ====================================== */}

        <div className="token-details">




          {/* LOCATION */}

          <div className="detail-item">

            <FaMapMarkerAlt />

            <div>

              <span>
                Pickup Location
              </span>

              <h4>
                {place}
              </h4>

            </div>

          </div>





          {/* PAYMENT */}

          <div className="detail-item">

            <FaMoneyBillWave />

            <div>

              <span>
                Payment Method
              </span>

              <h4>
                {payment}
              </h4>

            </div>

          </div>





          {/* TOTAL */}

          <div className="detail-item">

            <FaCheckCircle />

            <div>

              <span>
                Total Paid
              </span>

              <h4>
                ₹ {total}
              </h4>

            </div>

          </div>





          {/* STATUS */}

          <div className="detail-item">

            <FaClock />

            <div>

              <span>
                Order Status
              </span>

              <h4>
                Preparing...
              </h4>

            </div>

          </div>

        </div>





        {/* NOTE */}

        <div className="note-box">

          ⏳ You will be redirected to

          Orders page shortly...

        </div>

      </div>

    </div>
  );
}

export default Token;