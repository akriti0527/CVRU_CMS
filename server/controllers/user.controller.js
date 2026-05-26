// ** Press ctrl+ K 0 to collapse all code sections in VS Code --so you can view all modules**
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
//import { destroyOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/mail.utils.js";
import { cookieToken } from "../utils/cookie.utils.js";
//import { cloudinaryAvatarRefer } from "../utils/constants.utils.js";
import { logActivity } from "../utils/logActivity.utils.js";
const client = new OAuth2Client(

  process.env.GOOGLE_CLIENT_ID
);
// *==================================Email Templates & Link==============================================
function generateEmailLinkTemplate(Token) {
    return `<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Email Verification</title>
                    </head>
                    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f7;">
                        <div>
                            <h3>
                                <a href="http://localhost:5173/password/reset/${Token}">Click here to reset password</a>
                            </h3>
                        </div>
                    </body>
                </html>`;
}

function generateEmailTemplate(verificationCode, companyName = "CVRU", logoUrl = "") {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #ffffff; color: #333;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tr>
              <td align="center" style="padding: 20px 0;">   
                  <table align="center" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #e5e5e5; border-radius: 8px; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
                      <tr>
                          <td style="padding: 25px; text-align: center; background-color: #f8f8f8; border-bottom: 1px solid #eeeeee;">
                              ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" width="120" style="margin-bottom: 10px;" />` : `<h2>${companyName}</h2>`}
                          </td>
                      </tr>
                      <tr>
                          <td style="padding: 30px; text-align: center;">
                              <h1 style="font-size: 22px; color: #333;">Verify Your Email</h1>
                              <p style="font-size: 16px; color: #666;">Use the code below to verify your email address:</p>
                              <div style="font-size: 28px; font-weight: bold; padding: 12px 24px; border: 2px solid #333; display: inline-block; margin: 15px 0;">
                                  ${verificationCode}
                              </div>
                              <p style="font-size: 14px; color: #777;">If you didn’t request this, ignore this email.</p>
                          </td>
                      </tr>
                      <tr>
                          <td style="padding: 20px; text-align: center; background-color: #f8f8f8; border-top: 1px solid #eeeeee;">
                              <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>`;
}
// *========================================================================================================


// *Refresh-Access Token Route
// !watch out
const refreshAccessToken = asyncHandler(async (req, res, next) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!incomingRefreshToken) {
     
        return next(new ErrorHandler("Unauthorises Request", 401))
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id);
       
        if (!user || user.refreshToken !== incomingRefreshToken) {
           
            return next(new ErrorHandler("Invalid or Expired Refresh Token", 401))

        }


        // const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)
        cookieToken(user, res)

    } catch (error) {
        return next(new ErrorHandler(error?.message || "Invalid Refresh Token", 401))
        // throw new ApiError(401, error?.message || "Invalid Refresh Token");
    }
})


// *Register Route
const registerUser = asyncHandler(async (req, res, next) => {
    const { userName, email, phone, password, adminSecret } = req.body;
    
    console.log("Registration data received:", { userName, email, phone, password: "***"});
    
    const requiredFields = [userName, email, phone, password]
    const checkFields = { email, phone  }

    if (requiredFields.some((field) => !field || field.trim() === "")) return next(new ErrorHandler("All fields are required", 400))
    if (password.length < 8) return next(new ErrorHandler("Password must be at least 8 characters long", 400));

    const existingUser = await User.findOne({
        $or: [{email}, {phone}]
    })

    if (existingUser) {
        const duplicateField = Object.keys(checkFields).find(key => existingUser[key].toString().toLowerCase() === checkFields[key].toString().toLowerCase())
        return next(new ErrorHandler(`User already exist with the same ${duplicateField}: "${checkFields[duplicateField]}"\nPlease try unique one!`, 400))
    }


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
        // const user = await User.create({
        //     userName,
        //     email,
        //     phone,
        //     password: hashedPassword,
        //     role
        // });
    

    try {
        // Create User
        const user = await User.create({
            userName,
            email,
            phone,
            password,
            role
        })
        await cookieToken(user, res)
        await logActivity(
            user._id,
            "register",
            `${user.userName} registered`,
            req
        );
    } catch (error) {
        console.error("User creation error:", error);
        if (error instanceof mongoose.Error.ValidationError) {
            for (const err of Object.values(error.errors)) {
                next(new ErrorHandler(`Field: ${err.path} -> ${err.message}`));
            }
        } else {
            return next(new ErrorHandler(`Database error: ${error.message}`, 500));
        }
    }
})

// *Login Route
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) return next(new ErrorHandler("Please fill in all fields", 400));

        const user = await User.findOne({ email })

        if (!user) return next(new ErrorHandler("Invalid Credentials", 401))

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) return next(new ErrorHandler("Invalid credentials", 400))

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

// *OTP ROUTE
const sendOtpToUser = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    if (!userId) {
        return next(new ErrorHandler("You are unauthorised to get otp, please register / login to continue", 400))
    }
    const user = await User.findById(userId)
    if (!user?.email) {
        return next(new ErrorHandler("Please provide email used for account creation!"))
    }

    const OTP = await user.generateVerificationCode()
    await user.save()

    try {
        let email = user?.email

        const message = generateEmailTemplate(OTP);
        const mailResponse = await sendEmail({
            email,
            subject: "YOUR VERIFICATION CODE",
            message
        })
        return res.status(200).json({
            success: true,
            message: `Code sent successfully to ${email}`
        })

    } catch (error) {
        return next(new ErrorHandler(`Unable to send email to ${user.email}\n Error ${error.message || error}`, 400))
    }
})

// *Verify Route

const verifyOtpForUser = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email) {
        return next(new ErrorHandler("Enter the email to recive OTP", 400))
    }


    if (!otp) {
        return next(new ErrorHandler(`Please enter OTP sent to you mail: ${email} to verify Email`, 400))
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("INVALID Email", 400))
    }


    if (!user.verificationCode || user.verificationCode !== Number(otp)) {
        return next(new ErrorHandler("INVALID OTP", 400))
    }

    if (user.verificationCodeExpire < Date.now()) {
        return next(new ErrorHandler("OTP Expired", 400))
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken;
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;

    await user.save({ validateBeforeSave: false });

    await logActivity(
        user._id,
        "verify-otp",
        `${user.fullName} verified OTP`,
        req
    );

    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        sameSite: "Strict"
    }

    const resUser = await User.findById(user._id).select("-password -refreshToken");
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: `${email} verified successfully\nUser Created`,
            user: resUser, accessToken, refreshToken
        })
})


// *Reset Password Link
const sendResetPasswordLinkToUser = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new ErrorHandler("Please provide the email to sned otp", 400))
    }
    const user = await User.findOne({ email })
    if (!user) {
        return next(new ErrorHandler("Please provide email used for account creation!"))
    }

    const Token = await user.generateResetPasswordLink()
    await user.save()

    try {

        const message = generateEmailLinkTemplate(Token);
        const mailRes = await sendEmail({
            email,
            subject: "YOUR RESET PASSWORD LINK",
            message
        })
        return res.status(200).json({
            success: true,
            message: `Email sent successfully to ${email}`
        })

    } catch (error) {
        return next(new ErrorHandler(`Unable to send email to ${email}\n Error ${error.message || error}`, 400))
        // throw new ErrorHandler("Failed to send verification Code", 500)
    }
})


// *reset Pasword vai link
const resetPassword = asyncHandler(async (req, res, next) => {
    // const {token} = req.query;
    const { password, confirmPassword } = req.body
    const token = req?.params?.token

    const encryptedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

    const user = await User.findOne({
        forgotPasswordToken: encryptedToken,
        forgotPasswordTokenExpiry: { $gt: Date.now() }
    })


    if (!user) {
        return next(new ErrorHandler("Invalid link", 400))
    }


    if (!password || !confirmPassword) {

        return next(new ErrorHandler("Enter both fields", 400))
    }
    if (password !== confirmPassword) {


        return next(new ErrorHandler("Password and confirm password do not match", 400))
    }


    if (!user.forgotPasswordToken || user.forgotPasswordToken !== encryptedToken) {
        return next(new ErrorHandler("INVALID Link token", 400))
    }

    if (user.forgotPasswordTokenExpiry < Date.now()) {
        return next(new ErrorHandler("Link Expired", 400))
    }



    user.password = password


    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save({ validateBeforeSave: true });

    await logActivity(
        user._id,
        "reset-password",
        `${user.fullName} reset password`,
        req
    );

    return res.status(200).
        json({
            success: true,
            message: `Password for ${user.fullName} changed!`,
        })
})

// *Change Password
const changeCurrentPassword = asyncHandler(async (req, res, next) => {

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    if (newPassword.length < 8) {
        return next(new ErrorHandler("Password must be at least 8 characters long", 400));
    }


    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);



    if (!isPasswordCorrect) {
        // throw new ApiError(401, "");
        return next(new ErrorHandler("Invalid old password", 401))
    }

    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Confirm Password dindn't match the new Password!", 401))
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    await logActivity(
        req.user._id,
        "change-password",
        `${user.userName} changed password`,
        req
    );

    return res.status(200).json({
        success: true,
        message: "Password update Successfully!"
    })
})



// *Update Profile User
// =========================================
// UPDATE USER PROFILE
// =========================================

const updateUserProfile =
  async (req, res) => {

    try {

      const {

        name,

        email,

        password

      } = req.body;





      // ======================================
      // VALIDATION
      // ======================================

      if (!name || !email) {

        return res.status(400).json({

          success: false,

          message:
            "Name and Email are required"
        });
      }





      // ======================================
      // FIND USER
      // ======================================

      const user =
        await User.findById(
          req.user.id
        );





      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found"
        });
      }





      // ======================================
      // CHECK EMAIL EXISTS
      // ======================================

      const existingUser =
        await User.findOne({

          email
        });





      if (

        existingUser &&

        existingUser._id.toString()

        !==

        req.user.id
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Email already exists"
        });
      }





      // ======================================
      // UPDATE DATA
      // ======================================

      user.name = name;

      user.email = email;





      // PASSWORD UPDATE
      if (

        password &&

        password.trim() !== ""
      ) {

        const hashedPassword =
          await bcrypt.hash(

            password,

            10
          );





        user.password =
          hashedPassword;
      }





      await user.save();





      // ======================================
      // RESPONSE
      // ======================================

      res.status(200).json({

        success: true,

        message:
          "Profile updated successfully",

        user: {

          _id: user._id,

          name: user.name,

          email: user.email
        }
      });

    } catch (error) {

      console.log(error);





      res.status(500).json({

        success: false,

        message:
          "Failed to update profile"
      });
    }
  };

/*
// *User Info Route
const getLoggedInUserInfo = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    // Get user basic info
    const user = await User.findById(userId).select("-password -refreshToken").populate('savedPosts', '_id title');

    const userWithStats = {
        ...user.toObject(),
        stats: {
           
        }
    };

    res.status(200).json({
        success: true,
        user: userWithStats
    });
});
*/
// *Delete User
const deleteUser = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user?._id;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User Not Found", 404))

        }

        await logActivity(
            req.user._id,
            "delete-user",
            `${user.userName} deleted account`,
            req
        );

        // Delete the user
        await User.findByIdAndDelete(userId);

 
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        return next(new ErrorHandler("Internal Server Error", 500))
    }
});

// *Google OAuth Callback
const googleAuthCallback = asyncHandler(async (req, res, next) => {
    try {
        // User is authenticated via passport, req.user contains the user
        const user = req.user;

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Google authentication failed`);
        }

        // Generate tokens
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Set cookies
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        };

        res.cookie('accessToken', accessToken, options);
        res.cookie('refreshToken', refreshToken, options);

        // Redirect to frontend with success
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?auth=success`);
    } catch (error) {
        console.error('Google auth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Authentication failed`);
    }
});

// GOOGLE LOGIN
// ======================================
const googleLogin =
async (req, res) => {

  try {

    const { credential } =
      req.body;





    // VERIFY TOKEN
    const ticket =
      await client.verifyIdToken({

        idToken: credential,

        audience:
          process.env.GOOGLE_CLIENT_ID
      });





    const payload =
      ticket.getPayload();





    const {

      email,

      name,

      picture

    } = payload;





    // FIND USER
    let user =
      await User.findOne({

        email
      });





    // CREATE USER
    if (!user) {

      user = await User.create({

        userName: name,

        email,

        profilePic: picture,

        password:
          "google-login-user"
      });
    }





    // JWT TOKEN
    const token =
      jwt.sign(

        {
          id: user._id
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d"
        }
      );





    // COOKIE
    res.cookie(

      "token",

      token,

      {

        httpOnly: true,

        secure: false,

        sameSite: "lax"
      }
    );





    res.status(200).json({

      success: true,

      user
    });

  } catch (error) {

    console.log(
      "GOOGLE LOGIN ERROR:",
      error
    );





    res.status(500).json({

      success: false,

      message:
        "Google Login Failed"
    });
  }
};
// =========================================
// GET USER PROFILE
// =========================================

const getUserProfile =
  async (req, res) => {

    try {

      // FIND USER
      const user =
        await User.findById(

          req.user.id

        ).select("-password");





      // USER NOT FOUND
      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found"
        });
      }





      // SUCCESS
      res.status(200).json({

        success: true,

        user
      });

    } catch (error) {

      console.log(error);




      res.status(500).json({

        success: false,

        message:
          "Failed to fetch profile"
      });
    }
  };

// *Exports
export {
    refreshAccessToken,
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
    getUserProfile,

    googleLogin
}