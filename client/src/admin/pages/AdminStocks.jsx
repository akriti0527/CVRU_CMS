/* eslint-disable react-hooks/set-state-in-effect */
import "../css/AdminStocks.css";

import {

  useEffect,

  useState

} from "react";

import axios from "axios";

import {

  FaBoxOpen,

  FaCheckCircle,

  FaTimesCircle,

  FaSyncAlt,

  FaPlus,

  FaMinus

} from "react-icons/fa";

import { toast } from "react-toastify";

function AdminStocks() {

  // =========================================
  // STATES
  // =========================================

  const [foods, setFoods] =
    useState([]);




  const [loading, setLoading] =
    useState(true);




  // =========================================
  // FETCH FOODS
  // =========================================

  const fetchFoods =
    async () => {

      try {

        setLoading(true);




        const response =
          await axios.get(

            `${import.meta.env.VITE_API_URL}/api/v1/foods/`
          );




        setFoods(

          response.data.foods ||

          response.data ||

          []
        );




        setLoading(false);

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to fetch stocks"
        );

        setLoading(false);
      }
    };




  // =========================================
  // UPDATE QUANTITY
  // =========================================

  const updateQuantity =
    async (

      foodId,

      currentQty,

      type
    ) => {

      try {

        let updatedQty =
          type === "increase"

            ? currentQty + 1

            : currentQty - 1;




        if (updatedQty < 0) {

          updatedQty = 0;
        }




        await axios.put(

          `${import.meta.env.VITE_API_URL}/api/v1/foods/update-stock/${foodId}`,

          {

            stock:
              updatedQty
          },

          {
            withCredentials: true
          }
        );




        // UPDATE UI
        setFoods(

          (prevFoods) =>

            prevFoods.map(

              (food) =>

                food._id ===
                foodId

                  ? {

                      ...food,

                      stock:
                        updatedQty
                    }

                  : food
            )
        );




        toast.success(
          "Stock Updated"
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to update stock"
        );
      }
    };




  // =========================================
  // TOGGLE AVAILABILITY
  // =========================================

  const toggleAvailability =
    async (

      foodId,

      currentStatus
    ) => {
const token = localStorage.getItem("token");

      try {

        await axios.put(

          `${import.meta.env.VITE_API_URL}/api/v1/foods/toggle-availability/${foodId}`,

          {

            isAvailable:
              !currentStatus
          },

          {
            headers: {
      Authorization: `Bearer ${token}`,
    },
            withCredentials: true
          }
        );




        // LIVE UPDATE
        setFoods(

          (prevFoods) =>

            prevFoods.map(

              (food) =>

                food._id ===
                foodId

                  ? {

                      ...food,

                      isAvailable:
                        !currentStatus
                    }

                  : food
            )
        );




        toast.success(

          !currentStatus

            ? "Item Available"

            : "Item Unavailable"
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to update availability"
        );
      }
    };




  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {

    fetchFoods();

  }, []);




  // =========================================
  // COUNTS
  // =========================================

  const availableCount =
    foods.filter(

      (food) =>
        food.isAvailable
    ).length;




  const unavailableCount =
    foods.filter(

      (food) =>
        !food.isAvailable
    ).length;




  // TOTAL STOCK COUNT
  const totalFoodQuantity =
    foods.reduce(

      (acc, item) =>

        acc +
        (item.stock || 0),

      0
    );




  return (

    <div className="admin-stocks-page">




      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="stocks-header">

        <h1>
          Food Stocks
        </h1>




        <button
          className="refresh-btn"
          onClick={fetchFoods}
        >

          <FaSyncAlt />

          Refresh

        </button>

      </div>





      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}

      <div className="stocks-stats-grid">




        {/* TOTAL ITEMS */}

        <div className="stock-stat-card">

          <FaBoxOpen />

          <div>

            <h2>
              Food Items
            </h2>

            <h1>
              {foods.length}
            </h1>

          </div>

        </div>





        {/* TOTAL STOCK */}

        <div className="stock-stat-card">

          <FaBoxOpen />

          <div>

            <h2>
              Total Quantity
            </h2>

            <h1>
              {totalFoodQuantity}
            </h1>

          </div>

        </div>





        {/* AVAILABLE */}

        <div className="stock-stat-card available-card">

          <FaCheckCircle />

          <div>

            <h2>
              Available
            </h2>

            <h1>
              {availableCount}
            </h1>

          </div>

        </div>





        {/* UNAVAILABLE */}

        <div className="stock-stat-card unavailable-card">

          <FaTimesCircle />

          <div>

            <h2>
              Unavailable
            </h2>

            <h1>
              {unavailableCount}
            </h1>

          </div>

        </div>

      </div>





      {/* ========================================= */}
      {/* TABLE */}
      {/* ========================================= */}

      <div className="stocks-table-container">

        <div className="stocks-table-header">

          <span>
            Food
          </span>

          <span>
            Price
          </span>

          <span>
            Quantity
          </span>

          <span>
            Status
          </span>

          <span>
            Action
          </span>

        </div>





        {

          loading ? (

            <div className="loading-box">

              Loading Stocks...

            </div>

          ) : (

            foods.map((food) => (

              <div
                className="stock-row"
                key={food._id}
              >




                {/* FOOD INFO */}

                <div className="food-info">

                  <img

                  src={

                    food.image

                      ? `${import.meta.env.VITE_API_URL}/${food.image}`

                      : "https://via.placeholder.com/300"
                  }

                  alt={food.name}

                  className="food-image"

                  onError={(e) => {

                    e.target.src =
                      "https://via.placeholder.com/300";
                  }}
                />




                  <div>

                    <h3>
                      {food.name}
                    </h3>

                    <p>
                      {food.category}
                    </p>

                  </div>

                </div>





                {/* PRICE */}

                <span>
                  ₹{food.price}
                </span>





                {/* QUANTITY */}

                <div className="qty-controls">

                  <button

                    className="qty-btn"

                    onClick={() =>

                      updateQuantity(

                        food._id,

                        food.stock || 0,

                        "decrease"
                      )
                    }
                  >

                    <FaMinus />

                  </button>




                  <span className="qty-number">

                    {food.stock || 0}

                  </span>




                  <button

                    className="qty-btn"

                    onClick={() =>

                      updateQuantity(

                        food._id,

                        food.stock || 0,

                        "increase"
                      )
                    }
                  >

                    <FaPlus />

                  </button>

                </div>





                {/* STATUS */}

                <span

                  className={

                    food.isAvailable

                      ? "available"

                      : "unavailable"
                  }
                >

                  {

                    food.isAvailable

                      ? "Available"

                      : "Unavailable"
                  }

                </span>





                {/* ACTION */}

                <button

                  className={

                    food.isAvailable

                      ? "disable-btn"

                      : "enable-btn"
                  }

                  onClick={() =>

                    toggleAvailability(

                      food._id,

                      food.isAvailable
                    )
                  }
                >

                  {

                    food.isAvailable

                      ? "Disable"

                      : "Enable"
                  }

                </button>

              </div>
            ))
          )
        }

      </div>

    </div>
  );
}

export default AdminStocks;