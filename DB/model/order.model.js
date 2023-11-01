import mongoose, { Types } from "mongoose";

const orderSchema = mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [{
        _id: false,
        productId: { type: Types.ObjectId, ref: "product" },
        quantity: { type: Number, min: 1 },
        name: String,
        itemPrice: Number,
        totalPrice: Number
    }],
    invoice: {
        id: String,
        url: String,
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    coupon: {
        id: { type: Types.ObjectId, ref: "coupon" },
        name: String,
        discount: { type: Number, min: 1, max: 100 },
    },
    status: {
        type: String,
        enum: ["placed", "shipped", "delivered", "cancelled", "refunded"],
        default: "placed",
    },
    payment: {
        type: String,
        enum: ["visa", "cash"],
        default: "cash",
    }
}, { timestamps: true });


orderSchema.virtual("finalPrice").get(function () {

    // calculate the final price
    if (this.coupon) {
        return Number.parseFloat(this.price - (this.price * this.coupon.discount || 0) / 100).toFixed(2);
    }

    return this.price;

});


export const OrderModel = mongoose.model("order", orderSchema);