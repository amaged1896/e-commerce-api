
import mongoose, { Types } from "mongoose";

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        min: 1,
        max: 100,
        required: true,
    },
    expiredAt: Number,
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: true,
    }

}, { timestamps: true });

export const CouponModel = mongoose.model("coupon", couponSchema);