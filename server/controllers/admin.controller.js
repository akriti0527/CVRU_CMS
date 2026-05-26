import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";

import { User } from "../models/user.model.js";
import Food from "../models/food.model.js";
import {Order} from "../models/order.model.js";



// ======================================
// DASHBOARD STATS
// ======================================
export const getDashboardStats = asyncHandler(     
    async (req, res, next) => {

        const totalUsers = await User.countDocuments();

        const totalFoods = await Food.countDocuments();

        const totalOrders = await Order.countDocuments();

        // Revenue Calculation
        const orders = await Order.find();

        const revenue = orders.reduce(
            (acc, item) => acc + item.totalAmount,
            0
        );

        // Pending Orders
        const pendingOrders = await Order.countDocuments({
            orderStatus: "Pending"
        });

        // Ready Orders
        const readyOrders = await Order.countDocuments({
            orderStatus: "Ready"
        });

        res.status(200).json({
            success: true,

            totalUsers,
            totalFoods,
            totalOrders,

            revenue,

            pendingOrders,
            readyOrders
        });
    }
);



// ======================================
// GET ALL USERS
// ======================================
export const getAllUsers = asyncHandler(
    async (req, res, next) => {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalUsers: users.length,
            users
        });
    }
);



// ======================================
// GET ALL ORDERS
// ======================================
export const getAllOrdersAdmin = asyncHandler(
    async (req, res, next) => {

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.food")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders
        });
    }
);



// ======================================
// UPDATE ORDER STATUS
// ======================================
export const updateOrderStatus = asyncHandler(
    async (req, res, next) => {

        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(
                new ErrorHandler(
                    "Order not found",
                    404
                )
            );
        }

        order.orderStatus = status;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated",
            order
        });
    }
);



// ======================================
// DELETE USER
// ======================================
export const deleteUser = asyncHandler(
    async (req, res, next) => {

        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorHandler(
                    "User not found",
                    404
                )
            );
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }
);



// ======================================
// CHANGE USER ROLE
// ======================================
export const updateUserRole = asyncHandler(
    async (req, res, next) => {

        const { role } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorHandler(
                    "User not found",
                    404
                )
            );
        }

        user.role = role;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated",
            user
        });
    }
);
