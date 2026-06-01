import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import crypto from "crypto";

import {Order} from "../models/order.model.js";
import Food from "../models/food.model.js";
import Notification from "../models/notification.model.js";
import { io } from "../server.js";

//===================================
//  GENERATE UNIQUE TOKEN
//====================================
const generateOrderToken = () => {

    return crypto
        .randomBytes(2)
        .toString("hex")
        .toUpperCase();
};


// ======================================
// CREATE ORDER
// ======================================
// export const createOrder =
// async (req, res) => {

//   try {

//     console.log(
//       "BODY:",
//       req.body
//     );



//     const {

//       items,

//       totalAmount,

//       paymentMethod

//     } = req.body;






//     // VALIDATION
//     if (

//       !items ||

//       items.length === 0
//     ) {

//       return res.status(400).json({

//         success: false,

//         message:
//           "Cart is empty"
//       });
//     }






//     // CREATE ORDER
//     const order =
//       await Order.create({

//         user:
//           req.user._id,

//         items:

//           items.map((item) => ({

//             foodId:
//               item.foodId,

//             name:
//               item.name,

//             quantity:
//               item.quantity,

//             price:
//               item.price
//           })),

//         totalAmount,

//         paymentMethod:
//           paymentMethod || "COD",

//         orderStatus:
//           "placed"
//       });



// io.emit(

//   "newOrderPlaced",

//   order
// );
// io.emit(
//   "newOrderPlaced",
//   {

//     tokenNumber:
//       order.tokenNumber,

//     status:
//       order.status,

//     order
//   }
// );


//     res.status(201).json({

//       success: true,

//       message:
//         "Order placed successfully",

//       order,
//       token,
// user
//     });

//   } catch (error) {

//     console.log(
//       "CREATE ORDER ERROR:",
//       error
//     );

//     res.status(500).json({

//       success: false,

//       message:
//         error.message
//     });
//   }
// };


export const createOrder =
async (req, res) => {

  try {

    const {

      items,

      totalAmount,

      paymentMethod,

      deliveryPlace

    } = req.body;





    console.log(
      "REQ USER:",
      req.user
    );





    const order =
      await Order.create({

        user:
          req.user._id,

        items,

        totalAmount,

        paymentMethod,

        deliveryPlace,

        tokenNumber:
          Math.floor(
            1000 +
            Math.random() * 9000
          )
      });





    console.log(
      "ORDER CREATED:",
      order
    );
io.emit(
  "newOrderPlaced",
  order
);




    return res.status(201).json({

      success: true,

      order
    });

  } catch (error) {

    console.log(
      "CREATE ORDER ERROR:",
      error
    );





    return res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
};
// ======================================
// GET MY ORDERS
// ======================================
export const getMyOrders =
async (req, res) => {

  try {

    console.log(
      "USER ID:",
      req.user._id
    );





    const orders =
      await Order.find({

        user:
          req.user._id
      });





    console.log(
      "ORDERS:",
      orders
    );





    res.status(200).json({

      success: true,

      orders
    });

  } catch (error) {

    console.log(error);





    res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
};
// ======================================
// TRACK ORDER BY TOKEN
// ======================================
export const trackOrderByToken = asyncHandler(
    async (req, res, next) => {

        const { token } = req.params;

        // FIND ORDER
        const order = await Order.findOne({
            tokenNumber: token
        })

        .populate("user", "userName email")

        .populate("items.food");

        // CHECK ORDER
        if (!order) {

            return next(
                new ErrorHandler(
                    "Invalid token or order not found",
                    404
                )
            );
        }

        res.status(200).json({
            success: true,
            order
        });
    }
);

// ======================================
// GET SINGLE ORDER
// ======================================
export const getSingleOrder = asyncHandler(
    async (req, res, next) => {

        const order = await Order.findById(
            req.params.id
        )

            .populate("user", "userName email")

            .populate("items.food");

        if (!order) {

            return next(
                new ErrorHandler(
                    "Order not found",
                    404
                )
            );
        }

        res.status(200).json({
            success: true,
            order
        });
    }
);



// ======================================
// CANCEL ORDER
// ======================================
export const cancelOrder = asyncHandler(
    async (req, res, next) => {

        const { cancelReason } = req.body;

        const order = await Order.findById(
            req.params.id
        );

        if (!order) {

            return next(
                new ErrorHandler(
                    "Order not found",
                    404
                )
            );
        }

        // OWNER CHECK
        if (
            order.user.toString() !==
            req.user._id.toString()
        ) {

            return next(
                new ErrorHandler(
                    "Unauthorized access",
                    403
                )
            );
        }

        // STATUS CHECK
        if (
            order.orderStatus === "Completed"
        ) {

            return next(
                new ErrorHandler(
                    "Completed order cannot be cancelled",
                    400
                )
            );
        }

        order.orderStatus = "Cancelled";

        order.cancelReason = cancelReason;

        order.isActive = false;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });
    }
);



// ======================================
// GET ACTIVE ORDERS
// ======================================
export const getActiveOrders = asyncHandler(

  async (req, res, next) => {

    try {

      console.log("ADMIN ACTIVE ORDERS API");



      // FETCH ORDERS
      const orders = await Order.find({

        status: {
          $ne: "delivered"
        }

      })

      .sort({

        createdAt: -1
      });



      console.log("ORDERS:", orders);



      return res.status(200).json({

        success: true,

        orders
      });

    } catch (error) {

      console.log(
        "ACTIVE ORDER ERROR:",
        error
      );

      return next(

        new ErrorHandler(
          error.message,
          500
        )
      );
    }
  }
);

// ======================================
// UPDATE ORDER STATUS
// ======================================
export const updateOrderStatus =
asyncHandler(async (req, res, next) => {

  try {

    const { orderStatus } =
      req.body;



    const order =
      await Order.findById(
        req.params.id
      );



    if (!order) {

      return next(

        new ErrorHandler(
          "Order not found",
          404
        )
      );
    }



    // UPDATE STATUS
    order.orderStatus =
      orderStatus;

    await order.save();
io.emit(

  "orderStatusUpdated",

  {

    tokenNumber:
      order.tokenNumber,

    status:
      order.orderStatus
  }
);
io.emit(
  "orderStatusUpdated",
  {

    tokenNumber:
      order.tokenNumber,

    status:
      order.status,

    order
  }
);
    // IMPORTANT
    // SEND UPDATED ORDER

    io.to(
      order.user.toString()
    ).emit(

      "orderStatusUpdated",

      {

        orderId:
          order._id.toString(),

        orderStatus:
          order.orderStatus
      }
    );



    res.status(200).json({

      success: true,

      message:
        "Order status updated",

      order
    });

  } catch (error) {

    return next(

      new ErrorHandler(
        error.message,
        500
      )
    );
  }
});
// =========================================
// DELETE ORDER
// =========================================

export const deleteOrder =
asyncHandler(

  async (
    req,
    res
  ) => {

    const order =
      await Order.findById(
        req.params.id
      );



    if (!order) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Order not found"
        });
    }



    await Order.findByIdAndDelete(
      req.params.id
    );



    res.status(200).json({

      success: true,

      message:
        "Order deleted successfully"
    });
  }
);
// ======================================
// GET TODAY ORDERS
// ======================================
export const getTodayOrders = asyncHandler(
    async (req, res, next) => {

        const startOfDay = new Date();

        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();

        endOfDay.setHours(23, 59, 59, 999);

        const orders = await Order.find({

            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }

        })

            .populate("user", "userName")

            .populate("items.food");

        res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders
        });
    }
);