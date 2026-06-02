/* eslint-disable no-undef */
/* eslint-disable react-hooks/set-state-in-effect */
import "../css/AdminOrders.css";

import { useEffect, useState } from "react";

import axios from "axios";

import bgImage from "../../assets/chilli-bg.png";
import socket from "../../socket";

import { toast } from "react-toastify";
function AdminOrders() {

  // =========================================
  // STATES
  // =========================================

  const [orders, setOrders] =
    useState([]);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);



  // =========================================
  // FETCH ORDERS FROM BACKEND
  // =========================================

  const fetchOrders = async () => {
const token = localStorage.getItem("token");

    try {

      const response =
        await axios.get(

          `${import.meta.env.VITE_API_URL}/api/v1/orders/admin/active-orders`,

          {
             headers: {
      Authorization: `Bearer ${token}`,
    },
            withCredentials: true
          }
        );



      console.log(
        "ADMIN ORDERS:",
        response.data
      );



      setOrders(
        response.data.orders || []
      );



      // DEFAULT SELECT FIRST ORDER
      if (
        response.data.orders.length > 0
      ) {

        setSelectedOrder(
          response.data.orders[0]
        );
      }

      setLoading(false);

    } catch (error) {

      console.log(
        "Error fetching admin orders:",
        error
      );

      setLoading(false);
    }
  };



 useEffect(() => {

  fetchOrders();



  // ADMIN ROOM
  socket.emit(
    "registerUser",
    "admin"
  );



  // NEW ORDER POPUP
  socket.on(

    "newOrderPlaced",

    (order) => {

      toast.success(

        `🛒 New Order #${order.tokenNumber} placed`
      );



      fetchOrders();
    }
  );

  
  return () => {

    socket.off(
      "newOrderPlaced"
    );
  };

}, []);




  // =========================================
  // UPDATE STATUS
  // =========================================

 const updateStatus = async (

  orderId,

  newStatus

) => {
const token = localStorage.getItem("token");
  try {

    // API CALL
    const response =
      await axios.put(

        `${import.meta.env.VITE_API_URL}/api/v1/orders/admin/update-status/${orderId}`,

        {

           orderStatus: newStatus        },

        {
headers: {
      Authorization: `Bearer ${token}`,
    },
          withCredentials: true
        }
      );



    console.log(
      "UPDATED:",
      response.data
    );



    // =====================================
    // UPDATE ORDERS LIST
    // =====================================

    const updatedOrders =
      orders.map((order) =>

        order._id === orderId

          ? {

              ...order,

              orderStatus:
                newStatus,

              status:
                newStatus
            }

          : order
      );



    setOrders(updatedOrders);




    // =====================================
    // UPDATE SELECTED ORDER
    // =====================================

    if (

      selectedOrder &&

      selectedOrder._id === orderId

    ) {

      setSelectedOrder({

        ...selectedOrder,

        orderStatus:
          newStatus,

        status:
          newStatus
      });
    }



  } catch (error) {

    console.log(

      "Status Update Error:",

      error
    );
  }
};
// =========================================
// DELETE ORDER FUNCTION
// =========================================

const deleteOrder = async (
  orderId
) => {

  // CONFIRM
  const confirmDelete =
    window.confirm(

      "🗑 Are you sure you want to delete this order?"
    );



  if (!confirmDelete)
    return;



const token = localStorage.getItem("token");

  try {

    // DELETE API
    await axios.delete(

      `${import.meta.env.VITE_API_URL}/api/v1/orders/admin/delete-order/${orderId}`,

      {
        headers: {
      Authorization: `Bearer ${token}`,
    },
        withCredentials: true
      }
    );








    // REMOVE FROM UI
    const updatedOrders =
      orders.filter(

        (order) =>

          order._id !==
          orderId
      );








    // UPDATE STATE
    setOrders(
      updatedOrders
    );








    // AUTO SELECT NEXT ORDER
    if (
      updatedOrders.length > 0
    ) {

      setSelectedOrder(

        updatedOrders[0]
      );

    } else {

      setSelectedOrder(
        null
      );
    }








    alert(
      "✅ Order deleted successfully"
    );

  } catch (error) {

    console.log(
      "Delete Error:",
      error
    );








    alert(
      "❌ Failed to delete order"
    );
  }
};


  // =========================================
  // TOTAL CALCULATION
  // =========================================

  const totalRevenue =
    orders.reduce(

      (acc, order) =>
        acc + order.totalAmount,

      0
    );



  return (

    <div

      className="admin-orders-page"

      style={{

        backgroundImage:
          `url(${bgImage})`,

        backgroundSize:
          "cover",

        backgroundPosition:
          "center"
      }}
    >



      {/* ========================================= */}
      {/* TOP STATS */}
      {/* ========================================= */}

      <div className="orders-stats">

        <div className="stat-card">

          <div className="stat-icon purple">
            🛒
          </div>

          <div>

            <p>
              Orders
            </p>

            <h2>
              {orders.length}
            </h2>

          </div>

        </div>



        <div className="stat-card">

          <div className="stat-icon gold">
            ⭐
          </div>

          <div>

            <p>
              Delivered
            </p>

            <h2>

              {

                orders.filter(

                  (o) =>
                    o.orderStatus ===
                    "delivered"

                ).length
              }

            </h2>

          </div>

        </div>



        <div className="stat-card">

          <div className="stat-icon pink">
            💲
          </div>

          <div>

            <p>
              Revenue
            </p>

            <h2>

              ₹{totalRevenue}

            </h2>

          </div>

        </div>



        <div className="stat-card">

          <div className="stat-icon red">
            ⏳
          </div>

          <div>

            <p>
              Pending
            </p>

            <h2>

              {

                orders.filter(

                  (o) =>
                    o.orderStatus ===
                    "placed"

                ).length
              }

            </h2>

          </div>

        </div>

      </div>




      {/* ========================================= */}
      {/* MAIN CONTAINER */}
      {/* ========================================= */}

      <div className="orders-container">



        {/* ========================================= */}
        {/* LEFT PANEL */}
        {/* ========================================= */}

        <div className="orders-left">

          <h2 className="orders-heading">

            Food Orders

          </h2>



          <div className="orders-header">

            <span>#</span>

            <span>User</span>

            <span>Token</span>

            <span>Total</span>

            <span>Status</span>

          </div>



          {

            loading ? (

              <p>
                Loading...
              </p>

            ) : (

              orders.map(

                (
                  order,
                  index
                ) => (

                  <div

                    className="order-row"

                    key={order._id}

                    onClick={() =>
                      setSelectedOrder(order)
                    }
                  >

                    <span>
                      {index + 1}
                    </span>



                    <span>

                      {

                        order.user?.userName ||
                        "User"
                      }

                    </span>



                    <span>

                      #

                      {

                        order.tokenNumber
                      }

                    </span>



                    <span>

                      ₹

                      {

                        order.totalAmount
                      }

                    </span>



                    <span

                      className={`status ${order.orderStatus}`}
                    >
                      {

                        order.orderStatus
                      }

                    </span>

                  </div>
                )
              )
            )
          }

        </div>




        {/* ========================================= */}
        {/* RIGHT PANEL */}
        {/* ========================================= */}
<div className="orders-right">

  {

    selectedOrder ? (

      <>

        {/* HEADER */}

        <div className="details-header">

          <h2>
            🍽 Order Details
          </h2>

          <div className="token-box">

            Token #

            {
              selectedOrder.tokenNumber
            }

          </div>

        </div>



        {/* STATUS BADGE */}

        <div
          className={`live-status ${selectedOrder.orderStatus}`}
        >

          {

            selectedOrder.orderStatus ===
            "placed"

              ? "🟡 Order Placed"

              : selectedOrder.orderStatus ===
                "preparing"

              ? "👨‍🍳 Preparing"

              : "✅ Delivered"
          }

        </div>




        {/* ITEMS */}

        <div className="items-wrapper">

          {

            selectedOrder.items?.map(

              (
                item,
                i
              ) => (

                <div
                  className="modern-item-card"
                  key={i}
                >

                  <div className="food-icon">

                    🍔

                  </div>



                  <div className="food-details">

                    <h3>

                      {item.name}

                    </h3>

                    <p>

                      Quantity :
                      {" "}
                      {item.quantity}

                    </p>

                  </div>



                  <div className="food-price">

                    ₹

                    {

                      item.price *
                      item.quantity
                    }

                  </div>

                </div>
              )
            )
          }

        </div>




        {/* TOTAL SECTION */}

        <div className="modern-total-box">

          <span>
            Grand Total
          </span>

          <h2>

            ₹

            {
              selectedOrder.totalAmount
            }

          </h2>

        </div>




        {/* STATUS UPDATE */}

        <div className="modern-status-section">

          <h3>
            Update Order Status
          </h3>



          <div className="modern-status-buttons">

            {/* PLACED */}

            <button

              className={

                selectedOrder.orderStatus ===
                "placed"

                  ? "active-btn"

                  : ""
              }

              onClick={() =>
                updateStatus(

                  selectedOrder._id,

                  "placed"
                )
              }
            >

              🟡 Placed

            </button>




            {/* PREPARING */}

            <button

              className={

                selectedOrder.orderStatus ===
                "preparing"

                  ? "active-btn"

                  : ""
              }

              onClick={() =>
                updateStatus(

                  selectedOrder._id,

                  "preparing"
                )
              }
            >

              👨‍🍳 Preparing

            </button>




            {/* DELIVERED */}

            <button

              className={

                selectedOrder.orderStatus ===
                "delivered"

                  ? "active-btn"

                  : ""
              }

              onClick={() =>
                updateStatus(

                  selectedOrder._id,

                  "delivered"
                )
              }
            >

              ✅ Delivered

            </button>
            {/* DELETE ORDER BUTTON */}

<button

  className="delete-order-btn"

  onClick={() =>

    deleteOrder(
      selectedOrder._id
    )
  }
>

  🗑 Delete Order

</button>

          </div>

        </div>

      </>

    ) : (

      <div className="empty-order">

        Select an Order

      </div>
    )
  }

</div>

      </div>

    </div>
  );
}

export default AdminOrders;