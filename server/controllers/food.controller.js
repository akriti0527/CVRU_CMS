import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookieToken } from "../utils/cookie.utils.js";
import { io } from "../server.js";
import Food from "../models/food.model.js";

// =====================================
// CREATE FOOD
// =====================================
// ======================================
// CREATE FOOD
// ======================================

export const createFood = asyncHandler(

  async (req, res, next) => {

    try {

      console.log(req.body);

      const {
        name,
        price,
        category,
        description
      } = req.body;



      // IMAGE FILE
      const image =
        req.file
          ? req.file.path
          : "";



      // VALIDATION
      if (
        !name ||
        !price ||
        !category
      ) {

        return next(

          new ErrorHandler(
            "Please fill all required fields",
            400
          )
        );
      }



      // CREATE FOOD
      const food = await Food.create({

        name,
        price,
        category,
        description,
        image
      });

io.emit(

  "newFoodAdded",

  food
);

      return res.status(201).json({

        success: true,
        message: "Food Added Successfully",
        food
      });

    } catch (error) {

      return next(

        new ErrorHandler(
          error.message,
          500
        )
      );
    }
  }
);

// =====================================
// GET ALL FOODS
// =====================================
export const getAllFoods = asyncHandler(async (req, res, next) => {

    const foods = await Food.find()
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        totalFoods: foods.length,
        foods
    });

});



// =====================================
// GET SINGLE FOOD
// =====================================
export const getSingleFood = asyncHandler(async (req, res, next) => {

    const food = await Food.findById(req.params.id);

    if (!food) {
        return next(
            new ErrorHandler(
                "Food item not found",
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        food
    });

});



// =====================================
// UPDATE FOOD
// =====================================
export const updateFood = asyncHandler(async (req, res, next) => {

    const food = await Food.findById(req.params.id);

    if (!food) {
        return next(
            new ErrorHandler(
                "Food item not found",
                404
            )
        );
    }

    const updatedFood = await Food.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        message: "Food updated successfully",
        updatedFood
    });

});



// =====================================
// DELETE FOOD
// =====================================
export const deleteFood = asyncHandler(async (req, res, next) => {

    const food = await Food.findById(req.params.id);

    if (!food) {
        return next(
            new ErrorHandler(
                "Food item not found",
                404
            )
        );
    }

    await food.deleteOne();

    res.status(200).json({
        success: true,
        message: "Food item deleted successfully"
    });

});



/// =========================================
// TOGGLE FOOD AVAILABILITY
// =========================================

export const toggleFoodAvailability =
asyncHandler(

  async (
    req,
    res
  ) => {

    const food =
      await Food.findById(
        req.params.id
      );





    if (!food) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            "Food not found"
        });
    }







    // TOGGLE STATUS
    food.isAvailable =
      !food.isAvailable;







    await food.save();







    // SOCKET EMIT
    io.emit(

      "foodAvailabilityChanged",

      {

        foodId:
          food._id,

        isAvailable:
          food.isAvailable,

        foodName:
          food.name
      }
    );







    res.status(200).json({

      success: true,

      message:
        "Food availability updated",

      food
    });
  }
);


// ======================================
// UPDATE FOOD STOCK
// ======================================

export const updateFoodStock =
  async (req, res) => {

    try {

      const { id } = req.params;

      const { stock } = req.body;





      const updatedFood =
        await Food.findByIdAndUpdate(

          id,

          {

            stock
          },

          {

            new: true
          }
        );





      if (!updatedFood) {

        return res.status(404).json({

          success: false,

          message:
            "Food item not found"
        });
      }





      res.status(200).json({

        success: true,

        message:
          "Stock updated successfully",

        food: updatedFood
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to update stock"
      });
    }
  };


// =====================================
// GET AVAILABLE FOODS ONLY
// =====================================
export const getAvailableFoods = asyncHandler(async (req, res, next) => {

    const foods = await Food.find({
        isAvailable: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        totalFoods: foods.length,
        foods
    });

});



// =====================================
// SEARCH FOOD
// =====================================
export const searchFoods = asyncHandler(async (req, res, next) => {

    const keyword = req.query.keyword;

    const foods = await Food.find({
        name: {
            $regex: keyword,
            $options: "i"
        }
    });

    res.status(200).json({
        success: true,
        totalFoods: foods.length,
        foods
    });

});