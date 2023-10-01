import mongoose, { Types } from "mongoose";

const subcategorySchema = mongoose.Schema({

    name: {
        type: String,
        min: [5, "name must be at least 5 characters"],
        max: [20, "max length is 20 characters for name"],
        required: [true, "name is required"],
    },
    slug: {
        type: String,
        required: [true, "slug is required"],
    },
    image: {
        id: {
            type: String,
            required: [true, "image is required"]
        },
        url: {
            type: String,
            required: [true, "url is required"]
        }
    },
    categoryId: {
        type: Types.ObjectId,
        ref: "category",
        required: [true, "category is required"]
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "createdBy is required"]
    }

}, { timestamps: true });


const subcategoryModel = mongoose.model("subcategory", subcategorySchema);