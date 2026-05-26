// eslint-disable-next-line no-unused-vars
import React from "react";

import { useNavigate } from "react-router-dom";

function Cart({

  cart,

  increaseQty,

  decreaseQty,

  // eslint-disable-next-line no-unused-vars
  setCart

}) {

  // ======================================
  // NAVIGATE
  // ======================================

  const navigate =
    useNavigate();




  // ======================================
  // SUBTOTAL
  // ======================================

  const subTotal =
    cart.reduce(

      (total, item) =>

        total +

        item.price * item.quantity,

      0
    );




  // ======================================
  // GO TO PAYMENT PAGE
  // ======================================

  const handlePlaceOrder =
    () => {

      // EMPTY CART
      if (cart.length === 0) {

        alert(
          "Your cart is empty!"
        );

        return;
      }




      // NAVIGATE TO PAYMENT
      navigate(

        "/payment",

        {

          state: {

            total:
              subTotal,

            cart
          }
        }
      );
    };




  return (

    <div

      className="cart-sidebar"

      style={{

        width: "360px",

        display: "flex",

        flexDirection: "column",

        gap: "24px",

        padding: "10px",

        fontFamily:
          "'Segoe UI', Roboto, sans-serif"
      }}
    >




      {/* ====================================== */}
      {/* MY CART */}
      {/* ====================================== */}

      <div

        className="cart-container-box"

        style={{

          background: "#0d1527",

          borderRadius: "16px",

          padding: "24px",

          border:
            "1px solid rgba(255, 255, 255, 0.05)",

          minHeight: "220px",

          display: "flex",

          flexDirection: "column",

          boxShadow:
            "0 10px 25px rgba(0,0,0,0.3)"
        }}
      >




        <h3

          style={{

            color: "#ffffff",

            fontSize: "1.3rem",

            margin:
              "0 0 20px 0",

            fontWeight: "600",

            letterSpacing:
              "0.5px"
          }}
        >

          My Cart

        </h3>





        {

          cart.length === 0

          ? (

            <div

              style={{

                display: "flex",

                flexGrow: 1,

                alignItems: "center",

                justifyContent: "center"
              }}
            >

              <p

                className="no-items"

                style={{

                  color: "#475569",

                  fontSize: "0.95rem"
                }}
              >

                No items selected

              </p>

            </div>

          ) : (

            <div

              className="cart-items-list"

              style={{

                display: "flex",

                flexDirection: "column",

                gap: "16px",

                maxHeight: "280px",

                overflowY: "auto"
              }}
            >

              {

                cart.map((item) => {

                  const itemId =

                    item._id ||

                    item.id;




                  return (

                    <div

                      key={itemId}

                      className="cart-item-row"

                      style={{

                        display: "flex",

                        alignItems: "center",

                        justifyContent:
                          "space-between",

                        paddingBottom: "14px",

                        borderBottom:
                          "1px solid rgba(255, 255, 255, 0.04)"
                      }}
                    >




                      {/* QUANTITY */}

                      <div

                        className="qty-box"

                        style={{

                          display: "flex",

                          alignItems: "center",

                          gap: "12px",

                          background: "#1e293b",

                          padding: "6px 10px",

                          borderRadius: "8px"
                        }}
                      >




                        <button

                          onClick={() =>

                            decreaseQty(itemId)
                          }

                          style={{

                            background:
                              "transparent",

                            color: "#ffc72c",

                            border: "none",

                            fontWeight: "bold",

                            cursor: "pointer",

                            fontSize: "1.1rem",

                            padding: "0 4px"
                          }}
                        >

                          -

                        </button>





                        <span

                          style={{

                            color: "#ffffff",

                            fontSize: "0.95rem",

                            fontWeight: "600",

                            minWidth: "16px",

                            textAlign: "center"
                          }}
                        >

                          {item.quantity}

                        </span>





                        <button

                          onClick={() =>

                            increaseQty(itemId)
                          }

                          style={{

                            background:
                              "transparent",

                            color: "#ffc72c",

                            border: "none",

                            fontWeight: "bold",

                            cursor: "pointer",

                            fontSize: "1.1rem",

                            padding: "0 4px"
                          }}
                        >

                          +

                        </button>

                      </div>





                      {/* DETAILS */}

                      <div

                        className="item-details"

                        style={{

                          textAlign: "right",

                          display: "flex",

                          flexDirection: "column",

                          gap: "2px"
                        }}
                      >




                        <span

                          className="item-name"

                          style={{

                            color: "#ffffff",

                            fontWeight: "500",

                            fontSize: "1rem"
                          }}
                        >

                          {item.name}

                        </span>





                        <span

                          className="item-price"

                          style={{

                            color: "#94a3b8",

                            fontWeight: "500",

                            fontSize: "0.9rem"
                          }}
                        >

                          {

                            item.quantity

                          }

                          {" "}×

                          ₹{item.price}

                          {" "} = {" "}

                          <strong

                            style={{

                              color: "#ffc72c"
                            }}
                          >

                            ₹

                            {

                              item.price *

                              item.quantity
                            }

                          </strong>

                        </span>

                      </div>

                    </div>
                  );
                })
              }

            </div>
          )
        }

      </div>





      {/* ====================================== */}
      {/* ORDER SUMMARY */}
      {/* ====================================== */}

      <div

        className="order-container-box"

        style={{

          background: "#0d1527",

          borderRadius: "16px",

          padding: "24px",

          border:
            "1px solid rgba(255, 255, 255, 0.05)",

          boxShadow:
            "0 10px 25px rgba(0,0,0,0.3)"
        }}
      >




        <h3

          style={{

            color: "#ffffff",

            fontSize: "1.3rem",

            margin:
              "0 0 20px 0",

            fontWeight: "600",

            letterSpacing:
              "0.5px"
          }}
        >

          My Order

        </h3>





        {/* SUBTOTAL */}

        <div

          className="order-row"

          style={{

            display: "flex",

            justifyContent:
              "space-between",

            color: "#94a3b8",

            margin: "14px 0",

            fontSize: "1rem"
          }}
        >

          <span>
            Sub Total
          </span>

          <span

            style={{

              color: "#ffffff",

              fontWeight: "600"
            }}
          >

            ₹ {subTotal}

          </span>

        </div>





        <hr

          style={{

            border: "none",

            borderTop:
              "1px solid rgba(255, 255, 255, 0.08)",

            margin: "20px 0"
          }}
        />





        {/* GRAND TOTAL */}

        <div

          className="order-row grand-total-row"

          style={{

            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            margin:
              "16px 0 24px 0"
          }}
        >




          <span

            className="grand-total-lbl"

            style={{

              color: "#ffffff",

              fontWeight: "600",

              fontSize: "1.1rem"
            }}
          >

            Grand Total

          </span>





          <span

            className="grand-total-val"

            style={{

              color: "#ffc72c",

              fontWeight: "700",

              fontSize: "1.6rem",

              letterSpacing:
                "0.5px"
            }}
          >

            ₹ {subTotal}

          </span>

        </div>





        {/* BUTTON */}

        <button

          className="place-order-btn"

          onClick={handlePlaceOrder}

          style={{

            width: "100%",

            padding: "15px 0",

            background: "#ffc72c",

            color: "#0f172a",

            border: "none",

            borderRadius: "12px",

            fontWeight: "700",

            fontSize: "1.05rem",

            cursor: "pointer",

            boxShadow:
              "0 6px 20px rgba(255, 199, 44, 0.25)",

            transition:
              "transform 0.15s ease, background-color 0.2s ease"
          }}

          onMouseDown={(e) =>

            e.currentTarget.style.transform =
              "scale(0.98)"
          }

          onMouseUp={(e) =>

            e.currentTarget.style.transform =
              "scale(1)"
          }
        >

          Proceed to Payment

        </button>

      </div>

    </div>
  );
}

export default Cart;