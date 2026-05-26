import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import passport from '../config/passport.js';

import {
    registerUser,
    loginUser,
    logoutUser,
    sendOtpToUser,
    verifyOtpForUser,
    sendResetPasswordLinkToUser,
    resetPassword,
    changeCurrentPassword,
    updateUserProfile,
    deleteUser,
    googleAuthCallback,
    refreshAccessToken,
    getUserProfile,
    googleLogin
} from "../controllers/user.controller.js";
//import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router()

// *==========================
// *User Routes
router.post(
  "/google-login",
  googleLogin
);
// *Google OAuth Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleAuthCallback);

// *Register and login routes
router.route("/register").post(registerUser) //checked
router.route("/login").post(loginUser) //checked

// *OTP routes
router.route("/send-otp").get(verifyJWT, sendOtpToUser) //working
router.route("/verify-otp").post(verifyOtpForUser) //error

// *Forgot password flow
router.route("/password/forgot-password").post(sendResetPasswordLinkToUser)  //working
router.route("/password/forgot-password/:token").post(resetPassword)  

// *Authenticated user routes
router.route("/password/update-password").put(verifyJWT, changeCurrentPassword) //checked
//router.route("/dashboard").get(verifyJWT, getLoggedInUserInfo)
router.route("/update-profile").put(verifyJWT, updateUserProfile) //checked
router.route("/delete-profile").delete(verifyJWT, deleteUser) //checked
router.get(

  "/profile",

  verifyJWT,

  getUserProfile
);
router.route("/logout").get(verifyJWT, logoutUser) //logout
router.route("/refresh-token").post(refreshAccessToken) //error


export default router;