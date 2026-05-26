import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(

    {

        // RECEIVER
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },



        // TITLE
        title: {
            type: String,
            required: true,
            trim: true
        },



        // MESSAGE
        message: {
            type: String,
            required: true,
            trim: true
        },



        // TYPE
        type: {
            type: String,

            enum: [
                "order",
                "payment",
                "system",
                "food",
                "admin"
            ],

            default: "system"
        },



        // READ STATUS
        isRead: {
            type: Boolean,
            default: false
        },



        // RELATED ORDER
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        },



        // RELATED FOOD
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food"
        }

    },

    {
        timestamps: true
    }
);

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

export default Notification;