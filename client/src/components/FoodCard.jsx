
import { toast } from "react-toastify";

import "../css/FoodCard.css";

function FoodCard({

  menuItems,

  selectedCategory,

  addToCart,

  cart

}) {

  // ======================================
  // FILTER FOODS
  // ======================================

  const filteredFoods =

    selectedCategory === "all"

      ? menuItems

      : menuItems.filter(

          (food) =>

            food.category
              ?.toLowerCase()

              ===

            selectedCategory
              ?.toLowerCase()
        );





  return (

    <div className="food-container">

      {

        filteredFoods.length === 0

        ? (

          <h2 className="no-food">

            No Food Found

          </h2>

        )

        : (

          filteredFoods.map((food) => {

            // ======================================
            // FOOD ID
            // ======================================

            const foodId =

              food._id || food.id;





            // ======================================
            // FIND ITEM IN CART
            // ======================================

            const cartItem =

              cart.find(

                (item) =>

                  (
                    item._id || item.id
                  )

                  ===

                  foodId
              );





            return (

              <div

                className="food-card"

                key={foodId}
              >

                {/* ====================================== */}
                {/* UNAVAILABLE BADGE */}
                {/* ====================================== */}

                {

                  !food.isAvailable && (

                    <div className="unavailable-overlay">

                      Unavailable

                    </div>
                  )
                }





                {/* ====================================== */}
                {/* FOOD IMAGE */}
                {/* ====================================== */}

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





                {/* ====================================== */}
                {/* FOOD CONTENT */}
                {/* ====================================== */}

                <div className="food-content">

                  {/* FOOD NAME */}

                  <h3 className="food-name">

                    {food.name}

                  </h3>





                  {/* PRICE */}

                  <p className="food-price">

                    ₹{food.price}

                  </p>





                  {/* ====================================== */}
                  {/* ADD TO CART BUTTON */}
                  {/* ====================================== */}

                  <button

                    type="button"

                    className={`add-btn ${
                      !food.isAvailable
                        ? "disabled-btn"
                        : ""
                    }`}

                    disabled={!food.isAvailable}

                    onClick={(e) => {

                      e.preventDefault();

                      e.stopPropagation();





                      // BLOCK IF UNAVAILABLE
                      if (!food.isAvailable) {

                        toast.error(

                          "❌ Food is unavailable"
                        );

                        return;
                      }





                      console.log(
                        "ADDING:",
                        food
                      );





                      // ADD TO CART
                      addToCart(food);





                      // SUCCESS TOAST
                      toast.success(

                        `🛒 ${food.name} added to cart`
                      );
                    }}
                  >

                    {

                      cartItem

                        ? `Added (${cartItem.quantity})`

                        : food.isAvailable

                          ? "Add To Cart"

                          : "Unavailable"
                    }

                  </button>

                </div>

              </div>
            );
          })
        )
      }

    </div>
  );
}

export default FoodCard;