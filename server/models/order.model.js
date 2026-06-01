import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(

  {

    user: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true
    },



    items: [

      {

        foodId: {

          type: mongoose.Schema.Types.ObjectId,

          ref: "Food"
        },



        name: {

          type: String,

          required: true
        },



        quantity: {

          type: Number,

          required: true
        },



        price: {

          type: Number,

          required: true
        }
      }
    ],



    totalAmount: {

      type: Number,

      required: true
    },



    paymentMethod: {

      type: String,

enum: [

  "Cash",
"UPI Payment",
],
      default: "COD"
    },



    orderStatus: {

      type: String,

      enum: [

        "placed",

        "preparing",

        "delivered"
      ],

      default: "placed"
    },



    tokenNumber: {

      type: Number,

      unique: true
    }

  },

  {

    timestamps: true
  }
);





// AUTO TOKEN GENERATOR
orderSchema.pre(

  "save",

  async function (next) {

    if (!this.tokenNumber) {

      const latestOrder =

        await this.constructor

          .findOne()

          .sort("-tokenNumber");



      this.tokenNumber =

        latestOrder

          ? latestOrder.tokenNumber + 1

          : 1001;
    }

    next();
  }
);





export const Order =
  mongoose.model(
    "Order",
    orderSchema
  );