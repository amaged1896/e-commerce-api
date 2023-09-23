import mongoose, { Types } from "mongoose";

const tokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'user',
    },
    isValid: {
        type: Boolean,
        default: true
    },
    agent: String,
    expiredAt: String
}, { timestamps: true });

export const tokenModel = mongoose.model('token', tokenSchema);