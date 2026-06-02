/* eslint-disable no-undef */
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";

import axios from "axios";

import socket from "../socket";

import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

import Banner from "../components/Banner";

import Category from "../components/Category";

import FoodCard from "../components/FoodCard";

import Cart from "../components/Cart";

import "../css/Dashboard.css";

function UserDashboard() {

  // ======================================
  // STATES
  // ======================================

  const [category, setCategory] =
    useState("all");

  const [cart, setCart] =
    useState([]);

  const [menuItems, setMenuItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

   const [search, setSearch] =
     useState("");





  // ======================================
  // FETCH ALL FOODS
  // ======================================

  const fetchFoods = async () => {

    try {

      setLoading(true);

      const response =
        await axios.get(

          `${import.meta.env.VITE_API_URL}/api/v1/foods/`
        );



      console.log(
        response.data
      );



      setMenuItems(

        response.data.foods ||

        response.data
      );



      setLoading(false);

    } catch (error) {

      console.error(

        "Error fetching food menu:",

        error
      );



      setLoading(false);
    }
  };





  // ======================================
  // INITIAL FETCH
  // ======================================

  useEffect(() => {

    fetchFoods();

  }, []);







  // ======================================
  // SOCKET EVENTS
  // ======================================

  useEffect(() => {

    // =========================================
    // NEW FOOD ADDED
    // =========================================

    socket.on(

      "newFoodAdded",

      (food) => {

        toast.info(

          `🍔 New Item Added: ${food.name}`,

          {
            position: "top-right"
          }
        );







        // LIVE UPDATE
        setMenuItems(

          (prevFoods) => [

            food,

            ...prevFoods
          ]
        );
      }
    );







    // =========================================
    // FOOD AVAILABILITY UPDATE
    // =========================================

    socket.on(

      "foodAvailabilityChanged",

      (data) => {

        // UPDATE UI LIVE
        setMenuItems(

          (prevFoods) =>

            prevFoods.map(

              (food) =>

                food._id ===
                data.foodId

                  ? {

                      ...food,

                      isAvailable:
                        data.isAvailable
                    }

                  : food
            )
        );







        // POPUP NOTIFICATION
        toast(

          data.isAvailable

            ? `✅ ${data.foodName} is Available`

            : `❌ ${data.foodName} is Unavailable`,

          {
            position: "top-right"
          }
        );
      }
    );







    // =========================================
    // ORDER STATUS UPDATE
    // =========================================

    socket.on(

      "orderStatusUpdated",

      (data) => {

        toast.success(

          `📦 Order #${data.tokenNumber} is now ${data.status}`,

          {
            position: "top-right"
          }
        );
      }
    );







    // =========================================
    // CLEANUP
    // =========================================

    return () => {

      socket.off(
        "newFoodAdded"
      );



      socket.off(
        "foodAvailabilityChanged"
      );



      socket.off(
        "orderStatusUpdated"
      );
    };

  }, []);







  // ======================================
  // ADD TO CART
  // ======================================

  const addToCart = (food) => {

    // BLOCK IF UNAVAILABLE
    if (!food.isAvailable) {

      toast.error(

        "❌ This item is currently unavailable"
      );

      return;
    }







    const foodId =
      food._id || food.id;







    setCart((prevCart) => {

      const existingItem =
        prevCart.find(

          (item) =>

            (
              item._id || item.id
            )

            ===

            foodId
        );







      // ITEM EXISTS
      if (existingItem) {

        return prevCart.map(

          (item) =>

            (
              item._id || item.id
            )

            ===

            foodId

              ? {

                  ...item,

                  quantity:
                    item.quantity + 1
                }

              : item
        );
      }







      // NEW ITEM
      return [

        ...prevCart,

        {

          ...food,

          quantity: 1
        }
      ];
    });
  };







  // ======================================
  // INCREASE QTY
  // ======================================

  const increaseQty = (id) => {

    setCart((prevCart) =>

      prevCart.map(

        (item) =>

          (
            item._id || item.id
          )

          ===

          id

            ? {

                ...item,

                quantity:
                  item.quantity + 1
              }

            : item
      )
    );
  };







  // ======================================
  // DECREASE QTY
  // ======================================

  const decreaseQty = (id) => {

    setCart((prevCart) =>

      prevCart

        .map(

          (item) =>

            (
              item._id || item.id
            )

            ===

            id

              ? {

                  ...item,

                  quantity:
                    item.quantity - 1
                }

              : item
        )

        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };







  // ======================================
  // TOTAL PRICE
  // ======================================

  const totalPrice =
    cart.reduce(

      (total, item) =>

        total +
        item.price * item.quantity,

      0
    );







  return (

    <div className="dashboard">

      {/* SIDEBAR */}
      <Sidebar />







      <div className="dashboard-main">

        {/* NAVBAR */}
        <Navbar />

 { <div className="search-box">

              <input

                type="text"

                placeholder="Search Food..."

                value={search}

                onChange={(e) =>

                  setSearch(
                    e.target.value
                  )
                }

                className="menu-search"
              />

            </div> }





        {/* BANNER */}
        <Banner />







        {/* CATEGORY */}
        <Category
          setCategory={setCategory}
        />







        <div className="dashboard-content">

          {/* ====================================== */}
          {/* LEFT SIDE */}
          {/* ====================================== */}

          <div className="food-section">

            {/* SEARCH BAR */}

            {/* { <div className="search-box">

              <input

                type="text"

                placeholder="Search Food..."

                value={search}

                onChange={(e) =>

                  setSearch(
                    e.target.value
                  )
                }

                className="menu-search"
              />

            </div> } */}







            {

              loading ? (

                <div

                  style={{

                    color: "#fff",

                    fontSize: "20px"
                  }}
                >

                  Loading Menu...

                </div>

              ) : (

                <FoodCard

                  selectedCategory={
                    category
                  }

                  addToCart={
                    addToCart
                  }

                  cart={cart}

                  decreaseQty={
                    decreaseQty
                  }

                  increaseQty={
                    increaseQty
                  }

                  menuItems={

                    menuItems.filter(

                      (food) =>

                        food.name
                          ?.toLowerCase()

                          .includes(

                            search
                              .toLowerCase()
                          )
                    )
                  }

                  fetchFoods={
                    fetchFoods
                  }

                  isAdmin={false}

                />
              )
            }

          </div>







          {/* ====================================== */}
          {/* RIGHT SIDE CART */}
          {/* ====================================== */}

          <Cart

            cart={cart}

            setCart={setCart}

            increaseQty={
              increaseQty
            }

            decreaseQty={
              decreaseQty
            }

            totalPrice={
              totalPrice
            }

          />

        </div>

      </div>

    </div>
  );
}

export default UserDashboard;