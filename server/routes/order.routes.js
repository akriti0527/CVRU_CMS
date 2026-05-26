import express from "express";

import {

    createOrder,

    getMyOrders,

    getSingleOrder,

    cancelOrder,

    getActiveOrders,

    updateOrderStatus,

    getTodayOrders,

    trackOrderByToken,
    deleteOrder


} from "../controllers/order.controller.js";

import {
    verifyJWT
} from "../middlewares/auth.middleware.js";

import {
    adminOnly
} from "../middlewares/admin.middleware.js";



const router = express.Router();



// ======================================
// USER ROUTES
// ======================================


// CREATE ORDER
router.post(
    "/create",
    verifyJWT,
    createOrder
);



// GET MY ORDERS
router.get(
    "/my-orders",
    verifyJWT,
    getMyOrders
);

// TRACK ORDER USING TOKEN
router.get(
    "/track/:token",
    trackOrderByToken
);

// GET SINGLE ORDER
router.get(
    "/:id",
    verifyJWT,
    getSingleOrder
);



// CANCEL ORDER
router.put(
    "/cancel/:id",
    verifyJWT,
    cancelOrder
);



// ======================================
// ADMIN ROUTES
// ======================================


// GET ACTIVE QUEUE ORDERS
router.get(
    "/admin/active-orders",
    verifyJWT,
   // adminOnly,
    getActiveOrders
);

router.delete(

  "/admin/delete-order/:id",

  verifyJWT,

  deleteOrder
);

// UPDATE ORDER STATUS
router.put(
    "/admin/update-status/:id",
    verifyJWT,
    //adminOnly,
    updateOrderStatus
);



// GET TODAY ORDERS
router.get(
    "/admin/today-orders",
    verifyJWT,
   // adminOnly,
    getTodayOrders
);



export default router;