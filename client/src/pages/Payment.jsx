/* eslint-disable no-useless-assignment */
import {

  useState

} from "react";

import {

  useLocation,

  useNavigate

} from "react-router-dom";

import {

  FaArrowLeft,

  // eslint-disable-next-line no-unused-vars
  FaMoneyBillWave,

  // eslint-disable-next-line no-unused-vars
  FaUniversity

} from "react-icons/fa";

import axios from "axios";

import "../css/Payment.css";
import * as QRCode from "react-qr-code";
function Payment() {
 const location =
    useLocation();
  const navigate =
    useNavigate();

const total =
    location.state?.total || 0;
 const cart =
    location.state?.cart || [];

const upiId =
  "7004623735@ptyes";
  const upiURL =

  `upi://pay?pa=${upiId}

  &pn=Canteen Payment

  &am=${total}

  &cu=INR`;


  




  // ======================================
  // STATES
  // ======================================

  const [selectedPlace,
    setSelectedPlace] =

    useState("Cafeteria");




  const [selectedPayment,
    setSelectedPayment] =

    useState("Cash on Delivery");




  const [loading,
    setLoading] =

    useState(false);




  // ======================================
  // BACK
  // ======================================

  const handleBack =
    () => {

      navigate(-1);
    };




  // ======================================
  // PLACE ORDER
  // ======================================
const handleOrder =
  async () => {

    try {

      setLoading(true);





      // PAYLOAD
      const orderPayload = {

        items:

          cart.map(

            (item) => ({

              foodId:
                item._id ||

                item.id,

              name:
                item.name,

              quantity:
                item.quantity,

              price:
                item.price
            })
          ),

        totalAmount:
          total,

        paymentMethod:
          selectedPayment,

        deliveryLocation:
          selectedPlace
      };





      // API
      const response =
        await axios.post(

          "${import.meta.env.VITE_API_URL}/api/v1/orders/create",

          orderPayload,

          {

            withCredentials: true,

            headers: {

              "Content-Type":
                "application/json"
            }
          }
        );





      console.log(
        response.data
      );





      // SUCCESS
      if (

        response.data.success
      ) {

        navigate(

          "/token",

          {

            state: {

              token:

                response.data.order
                  .tokenNumber,

              total,

              place:
                selectedPlace,

              payment:
                selectedPayment
            }
          }
        );
      }

    } catch (error) {

      console.log(error);




      alert(

        error.response?.data?.message ||

        "Failed to place order"
      );

    } finally {

      setLoading(false);
    }
  };




  return (

    <div className="payment-page">




      {/* BACK */}

      <button

        onClick={handleBack}

        className="back-btn"
      >

        <FaArrowLeft />

      </button>





      <div className="payment-card">




        <h2>

          Checkout
        </h2>





        {/* LOCATION */}

        <div className="section">

          <p className="section-title">

            Pickup Location

          </p>




          {

            [

              "Cafeteria",

              "A Block",

              "B Block",

              "Admin Block"

            ].map((place) => (

              <div

                key={place}

                className={

                  `option-box ${

                    selectedPlace === place

                    ? "active"

                    : ""
                  }`
                }

                onClick={() =>

                  setSelectedPlace(place)
                }
              >

                {place}

              </div>
            ))
          }

        </div>





        {/* PAYMENT */}
{/* PAYMENT */}

<div className="section">

  <p className="section-title">

    Payment Method

  </p>





  {/* CASH */}

  <div

    className={`option-box ${

      selectedPayment ===
      "Cash on Delivery"

      ? "active"

      : ""
    }`}

    onClick={() =>

      setSelectedPayment(
        "Cash on Delivery"
      )
    }
  >

    Cash on Delivery

  </div>





  {/* UPI */}

  <div

    className={`option-box ${

      selectedPayment ===
      "UPI"

      ? "active"

      : ""
    }`}

    onClick={() =>

      setSelectedPayment(
        "UPI"
      )
    }
  >

    UPI Payment

  </div>





  {/* QR CODE */}

  {

    selectedPayment ===
    "UPI"

    && (

      <div className="qr-container">

        <h3>

          Scan QR to Pay

        </h3>





        <div className="qr-box">

          <QRCode
  value={upiURL}
  size={220}
/>

        </div>





        <p className="upi-text">

          UPI ID:

          {" "}

          <strong>

            {upiId}

          </strong>

        </p>





        <p className="amount-text">

          Amount:

          {" "}

          ₹ {total}

        </p>

      </div>
    )
  }

</div>





        {/* TOTAL */}

        <div className="total-section">

          <p>Total Amount</p>

          <h2>

            ₹ {total}

          </h2>

        </div>





        {/* BUTTON */}

        <button

          className="place-order-btn"

          onClick={handleOrder}

          disabled={loading}
        >

          {

            loading

              ? "Placing Order..."

              : "Place Order"
          }

        </button>

      </div>

    </div>
  );
}

export default Payment;