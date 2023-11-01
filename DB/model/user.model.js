import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        min: [3, 'min length 3 characters'],
        min: [20, 'max length 20 characters'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    phone: String,
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
    },
    role: {
        type: String,
        enum: ['user', 'seller', 'admin'],
        default: 'user'
    },
    verified: {
        type: Boolean,
        default: false
    },
    forgetCode: String,
    activationCode: String,
    profileImage: {
        url: {
            type: String,
            default: "https://res.cloudinary.com/dyrznlkg1/image/upload/v1695430784/ecommerceDefaults/user/149071_fm67fh.png"
        },
        id: {
            type: String,
            default: "ecommerceDefaults/user/149071_fm67fh"
        }
    },
    coverImages: [{
        url: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true });

export const userModel = mongoose.model('user', userSchema);