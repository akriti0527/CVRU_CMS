import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";

import ErrorHandler from "../middlewares/error.middleware.js";
import { io } from "../server.js";
import Notification from "../models/notification.model.js";



// ======================================
// CREATE NOTIFICATION
// ======================================
export const createNotification = asyncHandler(
    async (req, res, next) => {

        const {
            user,
            title,
            message,
            type,
            order,
            food
        } = req.body;

await Notification.create({

  title: "New Order",

  message:
    `New order #${order.tokenNumber} placed`,

  type: "admin"
});

        // CREATE NOTIFICATION
        const notification =
            await Notification.create({

                user,
                title,
                message,
                type,
                order,
                food

            });



        // REALTIME EMIT
        io.to(user.toString()).emit(
            "newNotification",
            {
                success: true,
                notification
            }
        );



        res.status(201).json({
            success: true,
            message:
                "Notification created successfully",
            notification
        });

    }
);
export const getAdminNotifications =
async (req, res) => {

  try {

    const notifications =
      await Notification.find()

        .sort({
          createdAt: -1
        });





    res.status(200).json({

      success: true,

      notifications
    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
};


// ======================================
// GET MY NOTIFICATIONS
// ======================================
export const getMyNotifications = asyncHandler(
    async (req, res, next) => {

        const notifications =
            await Notification.find({

                user: req.user._id

            })

            .populate("order")

            .populate("food")

            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalNotifications:
                notifications.length,
            notifications
        });
    }
);



// ======================================
// MARK AS READ
// ======================================
export const markNotificationAsRead =
asyncHandler(
    async (req, res, next) => {

        const notification =
            await Notification.findById(
                req.params.id
            );

        if (!notification) {

            return next(
                new ErrorHandler(
                    "Notification not found",
                    404
                )
            );
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            success: true,
            message:
                "Notification marked as read",
            notification
        });
    }
);



// ======================================
// DELETE NOTIFICATION
// ======================================
export const deleteNotification =
asyncHandler(
    async (req, res, next) => {

        const notification =
            await Notification.findById(
                req.params.id
            );

        if (!notification) {

            return next(
                new ErrorHandler(
                    "Notification not found",
                    404
                )
            );
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message:
                "Notification deleted successfully"
        });
    }
);



// ======================================
// DELETE ALL MY NOTIFICATIONS
// ======================================
export const clearAllNotifications =
asyncHandler(
    async (req, res, next) => {

        await Notification.deleteMany({
            user: req.user._id
        });

        res.status(200).json({
            success: true,
            message:
                "All notifications cleared"
        });
    }
);



// ======================================
// GET UNREAD COUNT
// ======================================
export const getUnreadNotificationCount =
asyncHandler(
    async (req, res, next) => {

        const unreadCount =
            await Notification.countDocuments({

                user: req.user._id,

                isRead: false

            });

        res.status(200).json({
            success: true,
            unreadCount
        });
    }
);

