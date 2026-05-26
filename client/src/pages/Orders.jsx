/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import axios from "axios";

//import { io } from "socket.io-client";
import socket from "../socket";

import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaClipboardList,
  FaCheckCircle,
  FaUtensils,
  FaBoxOpen
} from "react-icons/fa";

import "../css/Orders.css";



// =========================================
// SOCKET CONNECTION
// =========================================

// const socket =
// io("http://localhost:5000");



function Orders() {

  // =========================================
  // STATES
  // =========================================

  const [currentOrders, setCurrentOrders] =
    useState([]);

  const [historyOrders, setHistoryOrders] =
    useState([]);

  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const location = useLocation();





  // =========================================
  // BACK BUTTON
  // =========================================

  const handleBack = () => {

    navigate("/home");
  };






  // =========================================
  // FETCH ORDERS
  // =========================================

  const fetchMyOrders = async () => {

    try {

      const response =
        await axios.get(

          "http://localhost:5000/api/v1/orders/my-orders",

          {
            withCredentials: true
          }
        );



      const orders =
        response.data.orders || [];



      console.log(
        "MY ORDERS:",
        orders
      );



      if (orders.length > 0) {

        setCurrentOrders([
          orders[0]
        ]);

        setHistoryOrders(
          orders.slice(1)
        );

      } else {

        setCurrentOrders([]);
        setHistoryOrders([]);
      }

    } catch (error) {

      console.log(
        "Error fetching orders:",
        error
      );
    }
  };







  // =========================================
  // INITIAL FETCH
  // =========================================

  // useEffect(() => {

  //   fetchMyOrders();

  // }, []);
useEffect(() => {

  const user = JSON.parse(

    localStorage.getItem("user")
  );



  // REGISTER USER
  if (user?._id) {

    socket.emit(

      "registerUser",

      user._id
    );
  }



  // ORDER STATUS UPDATE
  socket.on(

    "orderStatusUpdated",

    (data) => {

      toast.success(

        `Order #${data.tokenNumber} is now ${data.status}`
      );



      fetchMyOrders();
    }
  );



  // NEW FOOD ADDED
  socket.on(

    "newFoodAdded",

    (food) => {

      toast.info(

        `🍔 New Item Added: ${food.name}`
      );
    }
  );



  return () => {

    socket.off(
      "orderStatusUpdated"
    );

    socket.off(
      "newFoodAdded"
    );
  };

}, []);






  // =========================================
  // AUTO REFRESH
  // =========================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        fetchMyOrders();

      }, 2000);

    return () =>
      clearInterval(interval);

  }, []);







  // =========================================
  // SOCKET JOIN
  // =========================================

  useEffect(() => {

    const user =
      JSON.parse(
        localStorage.getItem("user")
      );



    console.log(
      "USER:",
      user
    );



    if (user?._id) {

      socket.emit(
        "join",
        user._id
      );

      console.log(
        "Joined Socket Room:",
        user._id
      );
    }

  }, []);








  // =========================================
  // LIVE STATUS UPDATE
  // =========================================

  useEffect(() => {

    socket.on(

      "orderStatusUpdated",

      (data) => {

        console.log(
          "LIVE STATUS UPDATE:",
          data
        );



        // REFRESH ORDERS
        fetchMyOrders();
      }
    );



    return () => {

      socket.off(
        "orderStatusUpdated"
      );
    };

  }, []);









  return (

    <div className="orders-page">



      {/* ========================================= */}
      {/* BACK BUTTON */}
      {/* ========================================= */}

      <button
        onClick={handleBack}
        className="back-btn"
      >

        <FaArrowLeft />

      </button>








      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="orders-header">

        <h1 className="orders-title">

          My Orders

        </h1>

        <p className="orders-subtitle">

          Track your live canteen orders

        </p>

      </div>










      {/* ========================================= */}
      {/* CURRENT ORDERS */}
      {/* ========================================= */}

      <div className="orders-section">

        <h2 className="section-title" >

          Current Orders

        </h2>



        {

          currentOrders.length === 0 ? (

            <div className="empty-box">

              <FaBoxOpen size={40} />

              <p>
                No current orders
              </p>

            </div>

          ) : (

            currentOrders.map((order) => (

              <div
                className="modern-order-card"
                key={order._id}
              >




                {/* ========================================= */}
                {/* TOP */}
                {/* ========================================= */}

                <div className="order-card-top">

                  <div>

                    <h3>

                      Token #

                      {
                        order.tokenNumber
                      }

                    </h3>

                    <p>

                      {
                        new Date(
                          order.createdAt
                        ).toLocaleString()
                      }

                    </p>

                  </div>





                  {/* STATUS BADGE */}

                  <div

                    className={`status-pill ${order.orderStatus}`}
                  >

                    {
                      order.orderStatus
                    }

                  </div>

                </div>










                {/* ========================================= */}
                {/* ORDER ITEMS */}
                {/* ========================================= */}

                <div className="order-items">

                  {

                    order.items?.map(

                      (
                        item,
                        index
                      ) => (

                        <div
                          className="order-item-row"
                          key={index}
                        >

                          <div>

                            <h4>
                              {item.name}
                            </h4>

                            <p>

                              Qty :
                              {" "}

                              {
                                item.quantity
                              }

                            </p>

                          </div>



                          <span>

                            ₹

                            {
                              item.price *
                              item.quantity
                            }

                          </span>

                        </div>
                      )
                    )
                  }

                </div>










                {/* ========================================= */}
                {/* TOTAL */}
                {/* ========================================= */}

                <div className="order-total">

                  <h3>
                    Total Amount
                  </h3>

                  <span>

                    ₹
                    {
                      order.totalAmount
                    }

                  </span>

                </div>









                {/* ========================================= */}
                {/* LIVE STATUS TRACKER */}
                {/* ========================================= */}

                <div className="live-status-wrapper">



                  {/* PLACED */}
                  <div className="status-step">

                    <div

                      className={`status-circle ${
                        order.orderStatus === "placed" ||
                        order.orderStatus === "preparing" ||
                        order.orderStatus === "delivered"

                          ? "active-circle"

                          : ""
                      }`}
                    >

                      <FaClipboardList />

                    </div>

                    <p

                      className={`status-text ${
                        order.orderStatus === "placed" ||
                        order.orderStatus === "preparing" ||
                        order.orderStatus === "delivered"

                          ? "active-text"

                          : ""
                      }`}
                    >

                      Placed

                    </p>

                  </div>








                  <div

                    className={`status-bar ${
                      order.orderStatus === "preparing" ||
                      order.orderStatus === "delivered"

                        ? "active-bar"

                        : ""
                    }`}
                  ></div>








                  {/* PREPARING */}
                  <div className="status-step">

                    <div

                      className={`status-circle ${
                        order.orderStatus === "preparing" ||
                        order.orderStatus === "delivered"

                          ? "active-circle"

                          : ""
                      }`}
                    >

                      <FaUtensils />

                    </div>

                    <p

                      className={`status-text ${
                        order.orderStatus === "preparing" ||
                        order.orderStatus === "delivered"

                          ? "active-text"

                          : ""
                      }`}
                    >

                      Preparing

                    </p>

                  </div>









                  <div

                    className={`status-bar ${
                      order.orderStatus === "delivered"

                        ? "active-bar"

                        : ""
                    }`}
                  ></div>









                  {/* DELIVERED */}
                  <div className="status-step">

                    <div

                      className={`status-circle ${
                        order.orderStatus === "delivered"

                          ? "active-circle"

                          : ""
                      }`}
                    >

                      <FaCheckCircle />

                    </div>

                    <p

                      className={`status-text ${
                        order.orderStatus === "delivered"

                          ? "active-text"

                          : ""
                      }`}
                    >

                      Delivered

                    </p>

                  </div>

                </div>

              </div>
            ))
          )
        }

      </div>














      {/* ========================================= */}
      {/* ORDER HISTORY */}
      {/* ========================================= */}

      <div className="orders-section">

        <h2 className="section-title">

          Order History

        </h2>



        {

          historyOrders.length === 0 ? (

            <div className="empty-box">

              <FaBoxOpen size={40} />

              <p>
                No order history
              </p>

            </div>

          ) : (

            historyOrders.map((order) => (

              <div
                className="history-card"
                key={order._id}
              >

                <div className="history-top">

                  <div>

                    <h3>

                      Token #

                      {
                        order.tokenNumber
                      }

                    </h3>

                    <p>

                      {
                        new Date(
                          order.createdAt
                        ).toLocaleString()
                      }

                    </p>

                  </div>





                  <div

                    className={`status-pill ${order.orderStatus}`}
                  >

                    {
                      order.orderStatus
                    }

                  </div>

                </div>







                {

                  order.items?.map(

                    (
                      item,
                      index
                    ) => (

                      <div
                        className="history-item"
                        key={index}
                      >

                        <span>
                          {item.name}
                        </span>

                        <span>

                          x
                          {
                            item.quantity
                          }

                        </span>

                      </div>
                    )
                  )
                }






                <div className="history-total">

                  ₹
                  {
                    order.totalAmount
                  }

                </div>

              </div>
            ))
          )
        }

      </div>

    </div>
  );
}

export default Orders;