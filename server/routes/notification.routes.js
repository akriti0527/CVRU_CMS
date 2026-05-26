import express from "express";

import {

    createNotification,

    getMyNotifications,

    markNotificationAsRead,

    deleteNotification,

    clearAllNotifications,

    getUnreadNotificationCount,
    getAdminNotifications

} from "../controllers/notification.controller.js";

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


// GET MY NOTIFICATIONS
router.route(
    "/my-notifications").get(     //CHECKED
    verifyJWT,
    getMyNotifications
);



// GET UNREAD COUNT
router.route(
    "/unread-count").get(       //CHECKED
    verifyJWT,
    getUnreadNotificationCount
);


router.get(

  "/admin",

  verifyJWT,

  getAdminNotifications
);
// MARK AS READ
router.route(
    "/mark-read/:id").put(     //CHECKED
    verifyJWT,
    markNotificationAsRead
);



// DELETE NOTIFICATION
router.route(
    "/delete/:id").delete(     //CHECKED
    verifyJWT,
    deleteNotification
);



// CLEAR ALL NOTIFICATIONS
router.route(
    "/clear-all").delete(         //CHECKED
    verifyJWT,
    clearAllNotifications
);



// ======================================
// ADMIN ROUTES
// ======================================


// CREATE NOTIFICATION
router.route("/create").post(          //CHECKED
    verifyJWT,
    //adminOnly,
    createNotification
);

export default router;