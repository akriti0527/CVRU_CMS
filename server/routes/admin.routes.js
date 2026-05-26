import express from "express";

import {
    getDashboardStats,
    getAllUsers,
    getAllOrdersAdmin,
    updateOrderStatus,
    deleteUser,
    updateUserRole
} from "../controllers/admin.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { adminOnly } from "../middlewares/admin.middleware.js";

const router = express.Router();



// ======================================
// DASHBOARD
// ======================================
router.route(
    "/dashboard").get(         //CHECKED
    verifyJWT,
    adminOnly,
    getDashboardStats
);



// ======================================
// USERS
// ======================================
router.route(
    "/users").get(           //CHECKED
    verifyJWT,
    adminOnly,
    getAllUsers
);

router.route(
    "/users/:id").delete(    //CHECKED
    verifyJWT,
    adminOnly,
    deleteUser
);

router.route(
    "/users/role/:id").put(      //CHECKED
    verifyJWT,
    adminOnly,
    updateUserRole
);



// ======================================
// ORDERS
// ======================================
router.route(
    "/orders").get(
    verifyJWT,
    adminOnly,
    getAllOrdersAdmin
);

router.route(
    "/orders/status/:id").put(
    verifyJWT,
    adminOnly,
    updateOrderStatus
);

export default router;