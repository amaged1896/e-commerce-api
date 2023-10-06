import mongoose, { Types } from "mongoose";
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        min: [4, 'min length is 4 characters'],
        max: [4, 'max length is 15 characters'],
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true, toJSON: { virtuals: true } });

categorySchema.virtual("subcategory", {
    ref: "subcategory",
    localField: "_id", // category model
    foreignField: "categoryId", // subcategory model
});

export const categoryModel = mongoose.model('category', categorySchema);