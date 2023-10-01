import { catchAsync } from './../utils/catchAsync.js';
import { AppError } from './../utils/appError.js';

export const isAuthorized = (role) => {
    return catchAsync(async (req, res, next) => {
        //check user
        if (role !== req.user.role) {
            return next(new AppError("Your are not authorized", 401));
        }
        return next();
    });
};