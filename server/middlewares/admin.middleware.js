import { asyncHandler } from "./asyncHandler.middleware.js";
import ErrorHandler from "./error.middleware.js";

export const adminOnly = asyncHandler(
    async (req, res, next) => {

        if (req.user.role !== "admin") {

            return next(
                new ErrorHandler(
                    "Access denied. Admin only.",
                    403
                )
            );
        }

        next();
    }
);