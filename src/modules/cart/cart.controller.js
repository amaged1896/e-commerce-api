import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ProductModel } from './../../../DB/model/product.model.js';
import { CartModel } from './../../../DB/model/cart.model.js';
import { sendData } from "../../utils/sendData.js";


export const addToCart = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    // check product
    const product = await ProductModel.findById(productId);
    if (!product) return next(new AppError("Product not found!", 404));

    // // check stock
    if (!product.checkStock(quantity)) {
        return next(new AppError(`Sorry, only ${product.availableItems} Items left on stock!`, 404));
    }
    const cart = await CartModel.findOneAndUpdate({ user: req.user._id }, { $push: { products: { productId, quantity } } }, { new: true });

    sendData(200, "success", "Product added successfully to cart", cart, res);
});

export const getUserCart = catchAsync(async (req, res, next) => {

    const cart = await CartModel.findOne({ user: req.user._id }).populate([
        {
            path: "products.productId",
            select: "name defaultImage.url price discount finalPrice"
        }
    ]);
    if (!cart) return next(new AppError("Cart not found!", 404));

    sendData(200, "success", undefined, cart, res);
});

export const updateCart = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    // check product
    const product = await ProductModel.findById(productId);
    if (!product) return next(new AppError("Product not found!", 404));

    // check stock
    if (quantity > product.availableItems) return next(new AppError(`Sorry, only ${product.availableItems} Items left on stock!`, 404));


    const cart = await CartModel.findOneAndUpdate({ user: req.user._id }, { $set: { "products.$.quantity": quantity } }, { new: true });
    sendData(200, "success", "Cart updated successfully", cart, res);
});

export const removeProductFromCart = catchAsync(async (req, res, next) => {
    const cart = await CartModel.findOneAndUpdate({ user: req.user._id },
        { $pull: { products: { productId: req.params.productId } } },
        { new: true }
    );
    sendData(200, "success", "Product removed successfully", cart, res);
});

export const clearCart = catchAsync(async (req, res, next) => {
    const cart = await CartModel.findOneAndUpdate({ user: req.user._id }, { products: [] }, { new: true });
    sendData(200, "success", "Cart Cleared successfully", cart, res);
}); 