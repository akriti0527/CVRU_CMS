
///**********************ADMIN REGISTER*************************/////
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { cookieToken } from "../utils/cookie.utils.js";
import { logActivity } from "../utils/logActivity.utils.js";

import { User } from "../models/user.model.js";
const registerUser = asyncHandler(
    async (req, res, next) => {

        const {
            userName,
            email,
            password,
            phone,
            adminSecret
        } = req.body;

        // Validation
        if (
            !userName ||
            !email ||
            !phone ||
            !password
        ) {
            return next(
                new ErrorHandler(
                    "Please fill all fields",
                    400
                )
            );
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(
                new ErrorHandler(
                    "User already exists",
                    400
                )
            );
        }

        // Hash Password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Default Role
        let role = "user";

        // If admin secret matches
        if (
            adminSecret &&
            adminSecret === process.env.ADMIN_SECRET
        ) {
            role = "admin";
        }

        // Create User
        const user = await User.create({
            userName,
            email,
            phone,
            password: hashedPassword,
            role
        });

        // Generate Token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Send Cookie Token
        cookieToken(user, res);

        res.status(201).json({
            success: true,
            message: `${role} registered successfully`,
            token,
            user
        });
    }
);


// ======================================
// LOGIN USER / ADMIN
// ======================================
/*export const loginUser = asyncHandler(
    async (req, res, next) => {

        const {
            email,
            password
        } = req.body;

        // Check Fields
        if (!email || !password) {

            return next(
                new ErrorHandler(
                    "Please enter email and password",
                    400
                )
            );
        }

        // Find User
        const user = await User.findOne({ email });

        if (!user) {

            return next(
                new ErrorHandler(
                    "Invalid email or password",
                    401
                )
            );
        }

        // Compare Password
        const isPasswordMatched =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordMatched) {

            return next(
                new ErrorHandler(
                    "Invalid email or password",
                    401
                )
            );
        }

        // Send JWT Cookie
        cookieToken(user, res);

    }
);*/


// *Login Route
 const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) return next(new ErrorHandler("Please fill in all fields", 400));

      //const user = await User.findOne({ email })
     const user = await User.findOne({ email })
.select("password");
            console.log("user found")
        if (!user) return next(new ErrorHandler("Invalid Credentials", 401))
    const isPasswordValid = await user.isPasswordCorrect(password);
        //const isPasswordValid = await user.comparePassword(password);
        console.log("password  corrected")
        if (!isPasswordValid) return next(new ErrorHandler("Invalid credential", 400))

        cookieToken(user, res)
        await logActivity(
            user._id,
            "login",
            `${user.userName} logged in`,
            req
        );
    } catch (error) {
        return next(new ErrorHandler(`Something went wrong..details - ${error.message}`, 500))
    }

})

// *Logout Route
const logoutUser = asyncHandler(async (req, res, next) => {
    try {
      
        const userId = req.user._id

        try {
            const user = await User.findByIdAndUpdate(
                userId,
                {
                    // $set: { isVerified: false },
                    $unset: { refreshToken: "" } // ✅ Removes refreshToken field
                },

                {
                    new: true
                }
            ).select("userName");
     
            await logActivity(
                req.user._id,
                "logout",
                `${user.userName} logged out`,
                req
            );
        } catch (error) {
        }

        const options = {
            httpOnly: true,
            secure: true
        }


        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({
                success: true,
                message: "User Logged Out Successfully!",
            })
    } catch (error) {
        return next(new ErrorHandler(`Error logout session :\n${error}`, 400))
    }
})
export{
    registerUser ,
    loginUser ,
    logoutUser
}
