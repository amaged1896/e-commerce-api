import { AppError } from "./src/utils/appError.js";
import globalErrorHandler from "./src/utils/errorController.js";
import authRouter from './src/modules/auth/auth.router.js';
import categoryRouter from "./src/modules/category/category.router.js";
import subcategoryRouter from "./src/modules/subcategory/subcategory.router.js";
import brandRouter from './src/modules/brand/brand.router.js';
import productRouter from "./src/modules/product/product.router.js";
import couponRouter from "./src/modules/coupon/coupon.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import orderRouter from "./src/modules/order/order.router.js";

export const appRouter = (app, express) => {
    // Global Middleware 
    app.use(express.json());

    // auth
    app.use('/api/v1/auth', authRouter);

    // category
    app.use('/api/v1/category', categoryRouter);

    // subcategory
    app.use('/api/v1/subcategory', subcategoryRouter);

    // brand
    app.use('/api/v1/brand', brandRouter);

    // product
    app.use('/api/v1/product', productRouter);

    // coupon
    app.use('/api/v1/coupon', couponRouter);

    // cart
    app.use('/api/v1/cart', cartRouter);

    // order
    app.use('/api/v1/order', orderRouter);

    // not found page router
    app.all("*", (req, res, next) => {
        return next(new AppError('Page not found', 404));
    });
    // global error handling middleware
    app.use(globalErrorHandler);
};