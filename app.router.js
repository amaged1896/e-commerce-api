import { AppError } from "./src/utils/appError.js";
import globalErrorHandler from "./src/utils/errorController.js";
import authRouter from './src/modules/auth/auth.router.js';

export const appRouter = (app, express) => {
    // Global Middleware 
    app.use(express.json());

    // auth
    app.use('/auth', authRouter);


    // not found page router
    app.all("*", (req, res, next) => {
        return next(new AppError('Page not found', 404));
    });
    // global error handling middleware
    app.use(globalErrorHandler);
};