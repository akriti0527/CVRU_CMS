import express from "express";

import {
    registerUser , loginUser ,logoutUser
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route(
    "/register").post(
    registerUser
);
// LOGIN
router.route(
    "/login").post(
    loginUser
);

//LOGOUT 
router.route(
    "/logout").post(
    logoutUser
);
export default router;