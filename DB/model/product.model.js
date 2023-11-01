import mongoose, { Types } from "mongoose";


const productSchema = mongoose.Schema({
  name: {
    type: String,
    min: [2, "min length is 2 characters"],
    max: [50, "min length is 50 characters"],
    required: true
  },
  description: String,
  images: [{
    id: { type: String, required: true },
    url: { type: String, required: true },
  }],
  defaultImage: {
    id: { type: String, required: true },
    url: { type: String, required: true },
  },
  availableItems: {
    type: Number,
    min: [1, "min items is 1"],
    required: true
  },
  soldItems: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    min: [1, "Minimum price is 1"],
    required: true
  },
  discount: {
    type: Number,
    min: [1, "Minimum discount is 100"],
    max: [100, "Minimum discount is 100"],
  },
  createdBy: { type: Types.ObjectId, ref: "user", required: true },
  category: { type: Types.ObjectId, ref: "category", required: true },
  subcategory: { type: Types.ObjectId, ref: "subcategory", required: true },
  brand: { type: Types.ObjectId, ref: "brand", required: true },
  cloudFolder: { type: String, unique: true }

}, { timestamps: true, toJSON: { virtuals: true } });

productSchema.virtual("finalPrice").get(function () {

  // calculate the final price
  if (this.price) return Number.parseFloat(this.price - (this.price * this.discount || 0) / 100).toFixed(2);

});

productSchema.methods.checkStock = function (requiredQuantity) {

  return this.availableItems >= requiredQuantity ? true : false;
};

export const ProductModel = mongoose.model("product", productSchema);