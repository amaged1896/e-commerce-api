import mongoose, { Types } from "mongoose";

const cartSchema = mongoose.Schema({

    user: {
        type: Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    products: [{
        productId: {
            type: Types.ObjectId,
            ref: "product",
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }]

}, { timestamps: true });

export const CartModel = mongoose.model("cart", cartSchema);