import { CartModel } from './../../../DB/model/cart.model.js';
import { ProductModel } from './../../../DB/model/product.model.js';


// clear cart
export const clearCart = async (userId) => {
    await CartModel.findOneAndUpdate({ user: userId }, { products: [] });
};

// update stock
export const updateStock = async (products) => {
    for (const product of products) {
        await ProductModel.findByIdAndUpdate(product.productId, {
            $inc: {
                availableItems: - product.quantity,
                soldItems: product.quantity
            }
        });
    }
};